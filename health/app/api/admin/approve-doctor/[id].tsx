import { prisma } from '../../../../lib/prisma';

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    const { id } = req.query;

    try {
        await prisma.doctorApplication.update({
            where: { id },
            data: { status: 'APPROVED', reviewedAt: new Date() },
        });
        res.status(200).json({ message: 'Doctor approved successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Failed to approve doctor', error: error.message });
    }
}