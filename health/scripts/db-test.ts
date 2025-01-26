import { PrismaClient } from '@prisma/client'

enum ApplicationStatus {
    PENDING = 'PENDING',
    UNDER_REVIEW = 'UNDER_REVIEW',
    APPROVED = 'APPROVED',
    REJECTED = 'REJECTED'
}
import { exit } from 'process'

const prisma = new PrismaClient()

async function main() {
console.log('Starting database test...')

try {
    // Create a test doctor application
    const newApplication = await prisma.doctorApplication.create({
    data: {
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@example.com',
    phone: '+1234567890',
    dateOfBirth: new Date('1985-05-15'),
    address: '123 Medical Center Dr, Healthcare City, HC 12345',
    currentWorkplace: 'City General Hospital',
    licenseNumber: 'MD123456',
    specialization: 'GENERAL_PRACTICE',
    yearsOfExperience: 10,
    education: 'MD from Stanford University, Residency at Mayo Clinic',
    bio: 'Board-certified physician with extensive experience in general practice.',
    status: ApplicationStatus.PENDING,
    },
    })

    console.log('Successfully created doctor application:')
    console.log(JSON.stringify(newApplication, null, 2))

    // Retrieve the created application
    const retrievedApplication = await prisma.doctorApplication.findUnique({
    where: {
        id: newApplication.id,
    },
    })

    if (!retrievedApplication) {
    throw new Error('Failed to retrieve created application')
    }

    console.log('\nSuccessfully retrieved application:')
    console.log(JSON.stringify(retrievedApplication, null, 2))

    // Update the application
    const updatedApplication = await prisma.doctorApplication.update({
    where: {
        id: newApplication.id,
    },
    data: {
        status: ApplicationStatus.UNDER_REVIEW,
    },
    })

    console.log('\nSuccessfully updated application status:')
    console.log(JSON.stringify(updatedApplication, null, 2))

    // Cleanup - Delete the test application
    await prisma.doctorApplication.delete({
    where: {
        id: newApplication.id,
    },
    })

    console.log('\nSuccessfully cleaned up test data')

} catch (error) {
    console.error('Error during database test:', error)
    throw error
} finally {
    // Disconnect Prisma Client
    await prisma.$disconnect()
}
}

main()
.catch((error) => {
    console.error('Fatal error:', error)
    exit(1)
})

