export interface RegisterData {
    Username: string,
    Email: string,
    FirstName: string,
    LastName: string,
    Password: string,
}

export interface User{
    id: number,
    username: string,
    email: string,
    firstName: string,
    lastName: string,
    subscriptionId: number,
}

export interface LoginData {
    Email: string,
    Password: string
}

export interface UserSubscription {
    subscriptionId: number
}