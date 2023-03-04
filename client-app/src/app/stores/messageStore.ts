import { HubConnection, HubConnectionBuilder, LogLevel } from '@microsoft/signalr';
import { makeAutoObservable, runInAction } from 'mobx';
import { Message } from '../models/Message';
import { store } from './store';

export default class MessageStore {
    messageRegistry = new Map<string, Message[]>();
    hubConnectionRegistery = new Map<string, HubConnection>();

    constructor() {
        makeAutoObservable(this);
    }

    get getMessages() {
        const messages = this.messageRegistry.get(store.conversationStore.getSelectedConversationId);
        if (messages === undefined) return [];
        return Array.from(messages.values());
    }

    getLastmessage = (conversationId: string) => {
        const emptyMessage: Message = {
            id: '',
            username: '',
            body: '',
            isSent: false,
            isPartiallySeen: false,
            isSeen: false,
            isDelivered: false,
            createdAt: new Date(),
            conversationId: ''
        };
        const messages = this.messageRegistry.get(conversationId);
        if (!messages) return emptyMessage;
        return messages.at(messages.length - 1);
    };

    createHubConnections = () => {
        if (store.conversationStore.conversations) {
            store.conversationStore.conversations.forEach(conversation => {
                const hubConnection = new HubConnectionBuilder()
                    .withUrl(process.env.REACT_APP_CHAT_URL + '?conversationId=' + conversation.id, {
                        accessTokenFactory: () => store.userStore.user?.token!
                    })
                    .withAutomaticReconnect()
                    .configureLogging(LogLevel.Information)
                    .build();

                hubConnection.start().catch(error => console.log('Error establishing the connection: ', error));

                hubConnection.on('LoadMessages', (messages: Message[]) => {
                    runInAction(() => {
                        messages.forEach(message => {
                            //comment.createdAt = new Date(comment.createdAt + 'Z'); // with SQLite
                            message.createdAt = new Date(Date.parse(message.createdAt.toString())); // with PostgreSQL
                        });
                        this.messageRegistry.set(conversation.id, messages);
                        this.updateMessageIsDelivered([conversation.id]);
                    });
                });

                hubConnection.on('ReceiveMessage', (message: Message) => {
                    runInAction(() => {
                        message.createdAt = new Date(message.createdAt);
                        this.messageRegistry.get(message.conversationId)?.push(message);
                        this.updateMessageIsDelivered([message.conversationId]);
                    });
                });
                hubConnection.on('UpdateMessage', (message: Message) => {
                    message.createdAt = new Date(message.createdAt);
                    const newMessages: Message[] | undefined = this.messageRegistry.get(message.conversationId)?.map(m => m.id === message.id ? message : m);
                    runInAction(() => {
                        if (newMessages) this.messageRegistry.set(message.conversationId, newMessages);
                    });
                });
                this.hubConnectionRegistery.set(conversation.id, hubConnection);
            });
        }
    };

    stopHubConnections = () => {
        this.hubConnectionRegistery.forEach(value => value.stop().catch(error => console.log('Error stopping connection: ', error)));
    };

    clearMessages = () => {
        this.messageRegistry = new Map<string, Message[]>();
        this.stopHubConnections();
    };

    addMessage = async (values: any) => {
        values.conversationId = store.conversationStore.selectedConversation?.id;
        try {
            await this.hubConnectionRegistery.get(values.conversationId)?.invoke('SendMessage', values);
        } catch (error) {
            console.log(error);
        }
    };

    updateMessageIsSeen = async (conversationId: string) => {
        if (this.messageRegistry.get(conversationId) === undefined) return;
        const messagesToUpdate: any[] = [];
        this.messageRegistry.get(conversationId)?.forEach(message => {
            if (message.username !== store.userStore.user?.username && !message.isSeen) {
                message.isSeen = true;
                messagesToUpdate.push(message);
            }
        });
        if (messagesToUpdate.length < 1) return;
        messagesToUpdate.forEach(async message => {
            try {
                let values: any = {};
                values.message = message;
                await this.hubConnectionRegistery.get(conversationId)?.invoke('UpdateMessage', values);
            } catch (error) {
                console.log(error);
            }
        });
    };
    updateMessageIsDelivered = async (conversationIds: string[]) => {

        conversationIds.forEach(conversationId => {
            if (this.messageRegistry.get(conversationId) === undefined) return;
            const messagesToUpdate: any[] = [];
            this.messageRegistry.get(conversationId)?.forEach(message => {
                if (message.username !== store.userStore.user?.username && !message.isDelivered) {
                    message.isDelivered = true;
                    messagesToUpdate.push(message);
                }
            });
            if (messagesToUpdate.length < 1) return;
            messagesToUpdate.forEach(async message => {
                try {
                    let values: any = {};
                    values.message = message;
                    await this.hubConnectionRegistery.get(conversationId)?.invoke('UpdateMessage', values);
                } catch (error) {
                    console.log(error);
                }
            });
        });
    };

}