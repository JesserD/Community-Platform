export interface Message {
    id: string;
    username: string;
    body: string;
    isSent: Boolean;
    isPartiallySeen: Boolean;
    isSeen: Boolean;
    isDelivered: Boolean;
    createdAt: Date;
    conversationId: string;
}