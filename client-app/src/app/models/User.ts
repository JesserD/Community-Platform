export interface User {
    username: string;
    userId: string;
    displayName: string;
    token: string;
    image?: string;
}

export interface UserFormValues {
    email: string;
    password: string;
    displayName?: string;
    username?: string;
}

export interface Profile {
    id: string;
    username: string;
    pictureUrl: string;
}

export interface Photo {
    id: string;
    url: string;
}