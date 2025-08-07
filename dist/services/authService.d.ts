import { IUser, LoginRequest } from '../types';
export declare class AuthService {
    static generateToken(userId: string): string;
    static generateRefreshToken(userId: string): string;
    static login(loginData: LoginRequest): Promise<{
        user: IUser;
        token: string;
        refreshToken: string;
    }>;
    static refreshToken(refreshToken: string): Promise<{
        token: string;
        refreshToken: string;
    }>;
}
//# sourceMappingURL=authService.d.ts.map