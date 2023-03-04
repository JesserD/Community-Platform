import { makeAutoObservable, runInAction } from 'mobx';
import agent from '../api/agent';
import { User, UserFormValues } from '../models/User';
import { store } from './store';

export default class UserStore {
    user: User | null = null;
    navigate : string | null = null;

    constructor() {
        makeAutoObservable(this);
    }

    get isLoggedIn() {
        return !!this.user;
    }

    login = async (creds: UserFormValues) => {
        try {
            const user = await agent.Account.login(creds);
            store.commonStore.setToken(user.token);
            runInAction(() => {
                this.user = user;
                this.navigate = '/dashboard';
            });
            store.modalStore.closeModal();
        } catch (error) {
            throw error;
        }
    };

    logout = () => {
        store.commonStore.setToken(null);
        window.localStorage.removeItem('jwt');
        store.messageStore.clearMessages();
        this.user = null;
        runInAction(() => {
            this.navigate = '/';
        });
    };

    getUser = async () => {
        try {
            const user = await agent.Account.current();
            runInAction(() => this.user = user);
        } catch (error) {
            console.log(error);
        }
    };

    register = async (creds: UserFormValues) => {
        try {
            const user = await agent.Account.register(creds);
            store.commonStore.setToken(user.token);
            runInAction(() => {
                this.user = user;
                this.navigate = '/dashboard';
            });
            store.modalStore.closeModal();
        } catch (error) {
            throw error;
        }
    };

    setImage = (image: string) => {
        if (this.user) this.user.image = image;
    };

    setDisplayName = (displayName: string) => {
        if (this.user) this.user.displayName = displayName;
    };
}