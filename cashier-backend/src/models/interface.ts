export interface UserPayload {
    id: string,
    name: string,
    email: string,
    role: "CASHIER" | "ADMIN" | null
}

export interface UserRegister {
    name: string,
    email: string,
    password: string,
    role : 'CASHIER' | 'ADMIN'
}