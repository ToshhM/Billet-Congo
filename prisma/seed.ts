import { loadEnvConfig } from '@next/env';
loadEnvConfig(process.cwd());
import prisma from '../src/lib/prisma';

async function main() {
    console.log('🌱 Début du remplissage de la base de données...');

    // 1. Création du compte ADMIN
    await prisma.user.upsert({
        where: { phoneNumber: '060000000' },
        update: {},
        create: {
            phoneNumber: '060000000',
            fullName: 'Super Administrateur',
            email: 'admin@billet-congo.cg',
            role: 'ADMIN'
        }
    });

    // 2. Création du compte PROMOTER (Organisateur)
    const promoterUser = await prisma.user.upsert({
        where: { phoneNumber: '061111111' },
        update: {},
        create: {
            phoneNumber: '061111111',
            fullName: 'Organisateur VIP',
            email: 'promoter@events.cg',
            role: 'PROMOTER'
        }
    });

    // 3. Création du compte SCANNER
    await prisma.user.upsert({
        where: { phoneNumber: '062222222' },
        update: {},
        create: {
            phoneNumber: '062222222',
            fullName: 'Agent de Sécurité',
            email: 'agent@scan.cg',
            role: 'SCANNER'
        }
    });

    // 4. Création du compte CLIENT (pour faire des tests de connexion standard)
    await prisma.user.upsert({
        where: { phoneNumber: '063333333' },
        update: {},
        create: {
            phoneNumber: '063333333',
            fullName: 'Client Lambda',
            email: 'client@test.cg',
            role: 'CLIENT'
        }
    });

    // 5. Création des Événements de Test (appartenant au PROMOTER)
    await prisma.event.create({
        data: {
            title: 'Festival Poto-Poto Rumba',
            description: 'Le plus grand festival de Rumba Congolaise de l\'année au cœur de Brazzaville.',
            location: 'Stade de la Révolution, Brazzaville',
            startDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7), // Dans 7 jours
            price: 5000,
            capacity: 500,
            availableTickets: 500,
            status: 'PUBLISHED',
            organizerId: promoterUser.id
        }
    });

    await prisma.event.create({
        data: {
            title: 'Congo Tech Summit 2026',
            description: 'Rencontre avec les plus grands esprits de la tech en Afrique Centrale.',
            location: 'Palais des Congrès, Brazzaville',
            startDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 14), // Dans 14 jours
            price: 15000,
            capacity: 200,
            availableTickets: 200,
            status: 'PUBLISHED',
            organizerId: promoterUser.id
        }
    });

    console.log('✅ Base de données remplie avec succès !');
    console.log('--- IDENTIFIANTS DE TEST ---');
    console.log('🔑 ADMIN   : 060000000 (PIN au choix : 0000)');
    console.log('🎫 PROMOTER: 061111111 (PIN au choix : 0000)');
    console.log('📱 SCANNER : 062222222 (PIN au choix : 0000)');
    console.log('👤 CLIENT  : 063333333 (PIN au choix : 0000)');
    console.log('----------------------------');
}

main()
    .catch((e) => {
        console.error('Erreur lors du seed:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
