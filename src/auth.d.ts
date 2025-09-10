import type { User, AuthError } from '@supabase/supabase-js';
export interface AuthState {
    user: User | null;
    loading: boolean;
    error: string | null;
}
export declare class AuthService {
    private static instance;
    private authState;
    static getInstance(): AuthService;
    signIn(email: string, password: string): Promise<{
        user: User | null;
        error: AuthError | null;
    }>;
    signOut(): Promise<{
        error: AuthError | null;
    }>;
    getCurrentUser(): Promise<User | null>;
    getAuthState(): AuthState;
    onAuthStateChange(callback: (user: User | null) => void): {
        data: {
            subscription: import("@supabase/auth-js").Subscription;
        };
    };
}
export declare const authService: AuthService;
//# sourceMappingURL=auth.d.ts.map