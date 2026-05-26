import prisma from '@/lib/prisma';

export const cityService = {
    async getCities() {
        try {
            const cities = await prisma.city.findMany({
                orderBy: { name: 'asc' }
            });
            return cities.map(c => ({
                id: c.id,
                name: c.name,
                createdAt: c.createdAt.toISOString(),
                updatedAt: c.updatedAt.toISOString(),
            }));
        } catch (error) {
            console.error('Database connection error in getCities:', error);
            return [];
        }
    }
};

export const getCities = cityService.getCities;
