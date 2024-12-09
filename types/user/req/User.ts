import type { UserRole } from "./UserRole";

export interface User {
    id: number; 
    nickname: string; 
    email: string; 
    password: string; 
    userRole: UserRole; 
}