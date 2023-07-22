export interface IUser{
    _id: string,
    name: { first: string, last: string },
    email: string,
    password: string,
    location: number[],
    phone: string,
    address: string,
    rating: number
}