import { makeAutoObservable } from 'mobx';
import agent from '../api/agent';
import { Conversation } from '../models/Conversation';
import { store } from './store';

export default class ConversationStore {
    conversationRegistry = new Map<string, Conversation>();
    selectedConversation: Conversation | undefined = undefined;
    loading = false;
    loadingInitial = false;

    constructor() { makeAutoObservable(this); }

    get conversationsByDate() {
        return Array.from(this.conversationRegistry.values()).sort((a, b) =>
            a.createdAt.getTime() - b.createdAt.getTime());
    }

    get conversations() {
        return Array.from(this.conversationRegistry.values());
    }

    get getSelectedConversationId() {
        if (!this.selectedConversation) return '';
        return this.selectedConversation.id;
    }

    loadConversations = async () => {
        this.loadingInitial = true;
        try {
            const conversations = await agent.Conversations.list();
            conversations.forEach(conversation => {
                conversation.createdAt = new Date(Date.parse(conversation.createdAt.toString()));
                this.setConversation(conversation);
            });
            this.setLoadingInitial(false);
            store.messageStore.createHubConnections();
        } catch (error) {
            console.log(error);
            this.setLoadingInitial(false);
        }
    };

    private setConversation = (conversation: Conversation) => {
        this.conversationRegistry.set(conversation.id, conversation);
    };

    setLoadingInitial = (state: boolean) => { this.loadingInitial = state; };
    setSelectedConversation = (id: string) => {
        this.selectedConversation = this.conversationRegistry.get(id);
    };

    selectCreateConversation = async (participantId: string) => {
        let conversationToSelect: Conversation = { id: '', createdAt: new Date(), participantIds: [], participantNames: [], participantPictureUrls: [] };
        this.conversations.forEach(conversation => {
            if (conversation.participantIds.includes(participantId))
                conversationToSelect = conversation;
        });
        if (conversationToSelect.id === '') {
            try {
                await agent.Conversations.create(participantId);
                await this.loadConversations();
            } catch (error) {
                console.log(error);
            }
            this.conversations.forEach(conversation => {
                if (conversation.participantIds.includes(participantId))
                    conversationToSelect = conversation;
            });
        }
        this.setSelectedConversation(conversationToSelect.id);
    };
}