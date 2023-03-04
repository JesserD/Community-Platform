import { createContext, useContext } from 'react';
import CommonStore from './commonStore';
import ConversationStore from './conversationStore';
import MessageStore from './messageStore';
import ModalStore from './modalStore';
import UserStore from './userStore';
import ProfileStore from './profileStore';
import PhotoStore from './photoStore';

interface Store {
    commonStore: CommonStore;
    userStore: UserStore;
    modalStore: ModalStore;
    conversationStore: ConversationStore;
    messageStore: MessageStore;
    profileStore: ProfileStore;
    photoStore : PhotoStore;
}

export const store: Store = {
    commonStore: new CommonStore(),
    userStore: new UserStore(),
    modalStore: new ModalStore(),
    conversationStore: new ConversationStore(),
    messageStore: new MessageStore(),
    profileStore: new ProfileStore(),
    photoStore: new PhotoStore(),
};

export const StoreContext = createContext(store);

export function useStore() {
    return useContext(StoreContext);
}