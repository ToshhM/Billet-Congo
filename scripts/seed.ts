import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log('--- Seeding Database ---');

    // Mocks originaux
    const mockUsers = [
        {
            id: 'usr-admin-1',
            email: 'admin@congotickets.com',
            phoneNumber: '061234567',
            fullName: 'Admin CongoTickets',
            role: 'ADMIN',
        },
        {
            id: 'usr-client-1',
            email: 'client@example.com',
            phoneNumber: '059876543',
            fullName: 'Jean Client',
            role: 'USER',
        },
        {
            id: 'usr-scanner-1',
            email: 'scanner@congotickets.com',
            phoneNumber: '062223344',
            fullName: 'Agent Scanner',
            role: 'SCANNER',
        },
        {
            id: 'usr-organizer-1',
            email: 'organizer@congotickets.com',
            phoneNumber: '065556677',
            fullName: 'Partenaire Organisateur',
            role: 'ORGANIZER',
        }
    ];

    for (const u of mockUsers) {
        await prisma.user.upsert({
            where: { id: u.id },
            update: {},
            create: u
        });
    }
    console.log(`✅ ${mockUsers.length} Users seeded`);

    const mockEvents = [
        {
            id: 'evo-001',
            title: 'Showcase Fally Ipupa',
            description: 'Le grand retour de l\'Aigle pour un showcase exclusif à Brazzaville. Venez vibrer au rythme de la rumba et de la tokoss music dans un cadre exceptionnel.',
            location: 'Stade Marchand, Brazzaville',
            startDate: new Date('2024-03-24T18:00:00Z'),
            price: 10000,
            currency: 'XAF',
            capacity: 5000,
            availableTickets: 3450,
            status: 'PUBLISHED',
            organizerId: 'usr-admin-1',
            imageUrl: 'https://images.unsplash.com/photo-1540039155732-684735035727?q=80&w=2669&auto=format&fit=crop',
        },
        {
            id: 'evo-002',
            title: 'Festival Panafricain de Musique (FESPAM)',
            description: 'La 12ème édition du FESPAM s\'annonce grandiose. Plus de 50 artistes venus de tout le continent pour célébrer la musique africaine.',
            location: 'Esplanade du Palais des Congrès, Brazzaville',
            startDate: new Date('2024-07-15T15:00:00Z'),
            price: 5000,
            currency: 'XAF',
            capacity: 20000,
            availableTickets: 12000,
            status: 'PUBLISHED',
            organizerId: 'usr-admin-1', // L'ID doit exister dans les Users
            imageUrl: 'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?q=80&w=2670&auto=format&fit=crop',
        },
        {
            id: 'evo-003',
            title: 'Roga Roga & Extra Musica - 30 Ans',
            description: 'Célébration des 30 ans de carrière de Roga Roga et Extra Musica. Un concert monumental pour retracer l\'histoire de la musique congolaise.',
            location: 'Stade Éboué, Brazzaville',
            startDate: new Date('2024-05-10T20:00:00Z'),
            price: 15000,
            currency: 'XAF',
            capacity: 8000,
            availableTickets: 150,
            status: 'PUBLISHED',
            organizerId: 'usr-admin-1',
            imageUrl: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?q=80&w=2670&auto=format&fit=crop',
        },
    ];

    for (const e of mockEvents) {
        await prisma.event.upsert({
            where: { id: e.id },
            update: {},
            create: e
        });
    }
    console.log(`✅ ${mockEvents.length} Events seeded`);
}

main()
    .then(async () => {
        await prisma.$disconnect()
    })
    .catch(async (e) => {
        console.error(e)
        await prisma.$disconnect()
        process.exit(1)
    });
