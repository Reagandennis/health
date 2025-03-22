import { prisma } from '../../../../lib/prisma';

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    const { id } = req.query;

    try {
        await prisma.doctorApplication.update({
            where: { id },
            data: { status: 'REJECTED', reviewedAt: new Date() },
        });
        res.status(200).json({ message: 'Doctor rejected successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Failed to reject doctor', error: error.message });
    }
}