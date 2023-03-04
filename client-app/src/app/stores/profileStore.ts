import { makeAutoObservable, runInAction } from 'mobx';
import { HubConnection, HubConnectionBuilder, LogLevel } from '@microsoft/signalr';
import { Profile } from '../models/User';
import { store } from './store';


export default class ProfileStore {
    profiles: Profile[] = [];
    hubConnection: HubConnection | null = null;

    constructor() {
        makeAutoObservable(this);
    }

    createHubConnection = () => {

        this.hubConnection = new HubConnectionBuilder()
            .withUrl(process.env.REACT_APP_Profile_URL + '', {
                accessTokenFactory: () => store.userStore.user?.token!
            })
            .withAutomaticReconnect()
            .configureLogging(LogLevel.Information)
            .build();

        this.hubConnection.start().catch(error => console.log('Error establishing the connection: ', error));

        this.hubConnection.on('LoadProfiles', (profiles: Profile[]) => {
            runInAction(() => {
                this.profiles = profiles;
            });
        });
    };

    stopHubConnection = () => {
        this.hubConnection?.stop().catch(error => console.log('Error stopping connection: ', error));
        runInAction(() => {
            this.profiles = [];
        });
    };

    searchForProfile = async (searchString: string) => {
        if (searchString === '') {
            //runInAction(() => this.profiles = []);
            //return;
        }
        const values = { SearchUsername: searchString };
        try {
            await this.hubConnection?.invoke('SearchUsername', values);
        } catch (error) {
            console.log(error);
        }
    };

}