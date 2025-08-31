import { prisma } from '../lib/prisma';

async function main() {
    const [u1, u2] = await Promise.all([
        prisma.user.upsert({
            where: { email: 'driver@example.com' },
            update: {},
            create: { name: 'Driver One', email: 'driver@example.com', role: 'DRIVER' },
        }),
        prisma.user.upsert({
            where: { email: 'manager@example.com' },
            update: {},
            create: { name: 'Manager One', email: 'manager@example.com', role: 'MANAGER' },
        }),
    ]);

    const car = await prisma.car.upsert({
        where: { plateNumber: 'MH12AB1234' },
        update: {},
        create: { plateNumber: 'MH12AB1234', model: 'City', make: 'Honda', year: 2020 },
    });

    await prisma.incident.create({
        data: {
            carId: car.id,
            reportedById: u1.id,
            assignedToId: u2.id,
            title: 'Minor bumper scratch',
            description: 'Scratch while parking',
            severity: 'LOW',
            status: 'PENDING',
            type: 'ACCIDENT',
            occurredAt: new Date(),
            images: [],
            documents: [],
        },
    });
}

main().then(() => {
    console.log('Seeded');
}).catch((e) => {
    console.error(e);
    process.exit(1);
});
