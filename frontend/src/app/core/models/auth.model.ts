export interface LoginRequest { email: string; password: string; }
export interface AuthResponse { userId: number; name: string; email: string; role: 'Customer' | 'Administrator'; token: string; }
export interface MessageResponse { message: string; }
