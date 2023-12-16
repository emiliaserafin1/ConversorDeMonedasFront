export interface RegisterData {
    Username: string,
    Email: string,
    FirstName: string,
    LastName: string,
    Password: string,
}

export interface User{
    Id: number,
    Username: string,
    Email: string,
    FirstName: string,
    LastName: string,
    SubscriptionId: number,
}

export interface LoginData {
    Email: string,
    Password: string
}
