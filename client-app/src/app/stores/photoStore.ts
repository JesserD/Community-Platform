import { makeAutoObservable } from 'mobx';

export default class PhotoStore {

    constructor() {
        makeAutoObservable(this);
    }

    
}