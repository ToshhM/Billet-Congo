import { User, AuthSession } from '../types';
import prisma from '@/lib/prisma';

export const authService = {
    async authenticate(phoneNumber: string, pin: string): Promise<AuthSession | null> {
        // Note: in a real world, verify pin using bcrypt. For MVP, we trust length >= 4
        if (pin.length < 4) return null;

        let user = await prisma.user.findUnique({
            where: { phoneNumber }
        });

        if (!user) {
            // Auto-create for MVP testing
            user = await prisma.user.create({
                data: {
                    email: `user${Date.now()}@example.com`,
                    phoneNumber,
                    fullName: `User ${phoneNumber}`,
                    role: 'USER',
                }
            });
        }

        return {
            user: user as unknown as User,
            token: `mock-jwt-token-${user.id}-${Date.now()}`
        };
    },

    async getSessionByToken(token: string): Promise<AuthSession | null> {
        if (!token) return null;

        // Reverse engineer mock token "mock-jwt-token-UUID-timestamp"
        const parts = token.split('-');
        if (parts.length < 5) return null;

        const userId = parts.slice(3, -1).join('-');
        const user = await prisma.user.findUnique({
            where: { id: userId }
        });

        if (user) {
            return { user: user as unknown as User, token };
        }

        return null;
    }
};
