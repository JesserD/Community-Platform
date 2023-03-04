export interface Conversation {
    id: string;
    createdAt: Date;
    participantIds: string[];
    participantNames: string[];
    participantPictureUrls : string[];
}