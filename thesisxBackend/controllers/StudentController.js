import DB from "../DB/db.js";



const addContribution = async (req, res) => {
    const userId = req.userData?.id;

    const { title, abstract, authors, publicationDate, url } = req.body;

    if (!userId || !title || !authors || !publicationDate) {
        return res.status(400).json({ error: 'Missing required fields.' });
    }

    try {
        // Check if the student exists
        const student = await DB.Student.findUnique({
            where: { userId: userId },
        });

        if (!student) {
            return res.status(404).json({ error: 'Student record not found for the provided user.' });
        }

        const contribution = await DB.Contribution.create({
            data: {
                title,
                abstract,
                authors,
                publicationDate: new Date(publicationDate),
                url,
                studentId: student.id,
            },
        });

        res.status(201).json({ message: 'contribution added successfully.', contribution });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Failed to add contribution.' });
    }
};

const editContribution = async (req, res) => {
    const userId = req.userData?.id; // User ID from token
    const { id } = req.params; // contribution ID from request params
    const { title, abstract, authors, publicationDate, url } = req.body;

    if (!userId || !id) {
        return res.status(400).json({ error: 'Missing required fields.' });
    }

    try {
        // Check if the user is a valid student member
        const student = await DB.student.findUnique({
            where: { userId: userId },
        });

        if (!student) {
            return res.status(403).json({ error: 'You are not authorized to edit contributions.' });
        }

        // Fetch the contribution to check if the studentId matches
        const contribution = await DB.contribution.findUnique({
            where: { id: Number(id) },
        });

        if (!contribution || contribution.studentId !== student.id) {
            return res.status(403).json({ error: 'You are not authorized to edit this contribution.' });
        }

        // Update the contribution
        const updatedcontribution = await DB.contribution.update({
            where: { id: Number(id) },
            data: {
                title,
                abstract,
                authors,
                publicationDate: publicationDate ? new Date(publicationDate) : contribution.publicationDate,
                url,
            },
        });

        res.status(200).json({ message: 'contribution updated successfully.', updatedcontribution });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to edit contribution.' });
    }
};

const removeContribution = async (req, res) => {
    const userId = req.userData?.id; // User ID from token
    const { id } = req.params; // Publication ID from request params

    if (!userId || !id) {
        return res.status(400).json({ error: 'Missing required fields.' });
    }

    try {
        // Check if the user is a valid student member
        const student = await DB.student.findUnique({
            where: { userId: userId },
        });

        if (!student) {
            return res.status(403).json({ error: 'You are not authorized to delete contributions.' });
        }

        // Fetch the publication to check if the studentId matches
        const contribution = await DB.contribution.findUnique({
            where: { id: Number(id) },
        });

        if (!contribution || contribution.studentId !== student.id) {
            return res.status(403).json({ error: 'You are not authorized to delete this contribution.' });
        }

        // Delete the publication
        await DB.contribution.delete({
            where: { id: Number(id) },
        });

        res.status(200).json({ message: 'contribution deleted successfully.' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to delete contribution.' });
    }
};

const getContributions = async (req, res) => {
    const { id, role } = req.userData;

    try {
        let contributions;

        if (role === 'STUDENT') {
            // If the user is a student, fetch contributions related to them
            contributions = await DB.contribution.findMany({
                where: {
                    student: {
                        userId: id, // User ID in the student relation
                    },
                },
            });
        } else {
            // If the user is not a student, return an empty array or handle appropriately
            return res.status(403).json({ message: 'Forbidden: Only students can view contributions.' });
        }

        return res.status(200).json({ success: true, data: contributions });
    } catch (error) {
        console.error('Error fetching contributions:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};


export {
    addContribution,
    editContribution,
    removeContribution,
    getContributions

}