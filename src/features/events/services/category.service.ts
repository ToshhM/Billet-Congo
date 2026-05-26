import prisma from '@/lib/prisma';

export const categoryService = {
    async getCategories() {
        try {
            const categories = await prisma.category.findMany({
                orderBy: { name: 'asc' }
            });
            return categories.map(c => ({
                id: c.id,
                name: c.name,
                createdAt: c.createdAt.toISOString(),
                updatedAt: c.updatedAt.toISOString(),
            }));
        } catch (error) {
            console.error('Database connection error in getCategories:', error);
            return [];
        }
    }
};

export const getCategories = categoryService.getCategories;
