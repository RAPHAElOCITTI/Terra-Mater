// src/auth.ts
import { supabase } from './supabaseClient';
import type { User, AuthError } from '@supabase/supabase-js';

export interface AuthState {
    user: User | null;
    loading: boolean;
    error: string | null;
}

export class AuthService {
    private static instance: AuthService;
    private authState: AuthState = {
        user: null,
        loading: false,
        error: null
    };

    static getInstance(): AuthService {
        if (!AuthService.instance) {
            AuthService.instance = new AuthService();
        }
        return AuthService.instance;
    }

    async signIn(email: string, password: string): Promise<{ user: User | null; error: AuthError | null }> {
        this.authState.loading = true;
        this.authState.error = null;

        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password
        });

        this.authState.loading = false;
        this.authState.user = data.user;
        this.authState.error = error?.message || null;

        return { user: data.user, error };
    }

    async signOut(): Promise<{ error: AuthError | null }> {
        const { error } = await supabase.auth.signOut();
        
        if (!error) {
            this.authState.user = null;
        }
        this.authState.error = error?.message || null;

        return { error };
    }

    async getCurrentUser(): Promise<User | null> {
        try {
            const { data: { user }, error } = await supabase.auth.getUser();
            
            if (error) {
                console.error('Error getting current user:', error);
                this.authState.error = error.message;
                return null;
            }

            this.authState.user = user;
            return user;
        } catch (err) {
            console.error('Error in getCurrentUser:', err);
            this.authState.error = 'Failed to get current user';
            return null;
        }
    }

    getAuthState(): AuthState {
        return { ...this.authState };
    }

    onAuthStateChange(callback: (user: User | null) => void) {
        return supabase.auth.onAuthStateChange((_event, session) => {
            const user = session?.user || null;
            this.authState.user = user;
            callback(user);
        });
    }
}

export const authService = AuthService.getInstance();