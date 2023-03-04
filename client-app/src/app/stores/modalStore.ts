import { makeAutoObservable } from 'mobx';

interface Modal {
    open: boolean;
    body: JSX.Element | null;
}

export default class ModalStore {
    modal: Modal = {
        open: false,
        body: null
    };
    newConversationModal: Modal = {
        open: false,
        body: null
    };

    constructor() {
        makeAutoObservable(this);
    }

    openModal = (content: JSX.Element) => {
        this.modal.open = true;
        this.modal.body = content;
    };

    closeModal = () => {
        this.modal.open = false;
        this.modal.body = null;
    };

    openNewConversationModal = (content: JSX.Element) => {
        this.newConversationModal.open = true;
        this.newConversationModal.body = content;
    };

    closeNewConversationModal = () => {
        this.newConversationModal.open = false;
        this.newConversationModal.body = null;
    };
}