import DB from "../DB/db.js";
import FacultyProfile from "../Common/FacultyRelatedQuery/GetFacultyProfile.js";

async function GetFacultyInfo (req, res ){
    const { id } = req.query; // Extract faculty ID from the query string

    try {
        if (!id) {
            return res.status(400).json({ 
                success: false,
                message: "Faculty ID is required in the query." 
            });
        }

        // Fetch faculty profile using the helper function
        const faculty = await FacultyProfile(parseInt(id));

        if (!faculty) {
            return res.status(404).json({ success: false, message: "Faculty not found." });
        }

        // Respond with the faculty data
        res.status(200).json({
            success: true,
            data: faculty
        });
    } catch (error) {
        console.error("Error fetching faculty info:", error);
        res.status(500).json({ 
            success:false,
            message: "An error occurred while fetching faculty info." 
        });
    }
}

async function SetSupervisorRequest (req, res) {
    const userData = req.userData; // Extract user data from the request

    const { facultyID, thesisID, notes } = req.body; // Extract faculty ID, thesis ID, and notes from the request body
    
    console.log("Request body:", req.body);
    if (!facultyID || !thesisID) {
        return res.status(400).json({ 
            success: false,
            message: "Faculty ID and Thesis ID are required." 
        });
    }


    try {
        const student = await DB.Student.findUnique({ where: { userId: userData.id } });

        if (!student) {
            return res.status(404).json({ success: false, message: "Student not found." });
        }

        if ( student.thesisID !== parseInt(thesisID) ) {
            return res.status(400).json({ success: false, message: "Thesis ID does not match." });
        }
        // check if thesis is already assigned to a supervisor
        const thesis = await DB.Thesis.findUnique({ where: { id: parseInt(thesisID) } });

        if (!thesis) {
            return res.status(404).json({ success: false, message: "Thesis not found." });
        }

        if (thesis.supervisorId) {
            return res.status(400).json({ success: false, message: "Thesis is already assigned to a supervisor." });
        }

        const faculty = await DB.Faculty.findUnique({ where: { userId: parseInt(facultyID) } })

        if (!faculty) {
            return res.status(400).json({ success: false, message: "Faculty not found"})
        }

        // check for existing request that is still pending
        const existingRequest = await DB.RequestSupervisor.findFirst({
            where: {
                thesisId: parseInt(thesisID),
                facultyId: faculty.id,
                status: "PENDING"
            }
        });

        if (existingRequest) {
            return res.status(400).json({ success: false, message: `Request already exists. Status: ${existingRequest.status}` });
        }

        // Create a new supervisor request
        const request = await DB.RequestSupervisor.create({
            data: {
                facultyId: faculty.id,
                thesisId: parseInt(thesisID),
                notes: notes
            }
        });

        // Respond with the request data
        res.status(201).json({
            success: true,
            data: request
        });

    } catch (error) {
        console.error("Error setting supervisor request:", error);
        res.status(500).json({ 
            success: false,
            message: "An error occurred while setting supervisor request." 
        });
    }
}

const addPublication = async (req, res) => {
    const userId = req.userData?.id;

    const { title, abstract, authors, publicationDate, url } = req.body;

    if (!userId || !title || !authors || !publicationDate) {
        return res.status(400).json({ error: 'Missing required fields.' });
    }

    try {
        // Check if the faculty exists
        const faculty = await DB.faculty.findUnique({
            where: { userId: userId },
        });

        if (!faculty) {
            return res.status(404).json({ error: 'Faculty record not found for the provided user.' });
        }

        const publication = await DB.publication.create({
            data: {
                title,
                abstract,
                authors,
                publicationDate: new Date(publicationDate),
                url,
                facultyId: faculty.id,
            },
        });

        res.status(201).json({ message: 'Publication added successfully.', publication });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Failed to add publication.' });
    }
};

const editPublication = async (req, res) => {
    const userId = req.userData?.id; // User ID from token
    const { id } = req.params; // Publication ID from request params
    const { title, abstract, authors, publicationDate, url } = req.body;

    if (!userId || !id) {
        return res.status(400).json({ error: 'Missing required fields.' });
    }

    try {
        // Check if the user is a valid faculty member
        const faculty = await DB.faculty.findUnique({
            where: { userId: userId },
        });

        if (!faculty) {
            return res.status(403).json({ error: 'You are not authorized to edit publications.' });
        }

        // Fetch the publication to check if the facultyId matches
        const publication = await DB.publication.findUnique({
            where: { id: Number(id) },
        });

        if (!publication || publication.facultyId !== faculty.id) {
            return res.status(403).json({ error: 'You are not authorized to edit this publication.' });
        }

        // Update the publication
        const updatedPublication = await DB.publication.update({
            where: { id: Number(id) },
            data: {
                title,
                abstract,
                authors,
                publicationDate: publicationDate ? new Date(publicationDate) : undefined,
                url,
            },
        });

        res.status(200).json({ message: 'Publication updated successfully.', updatedPublication });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to edit publication.' });
    }
};


const removePublication = async (req, res) => {
    const userId = req.userData?.id; // User ID from token
    const { id } = req.params; // Publication ID from request params

    if (!userId || !id) {
        return res.status(400).json({ error: 'Missing required fields.' });
    }

    try {
        // Check if the user is a valid faculty member
        const faculty = await DB.faculty.findUnique({
            where: { userId: userId },
        });

        if (!faculty) {
            return res.status(403).json({ error: 'You are not authorized to delete publications.' });
        }

        // Fetch the publication to check if the facultyId matches
        const publication = await DB.publication.findUnique({
            where: { id: Number(id) },
        });

        if (!publication || publication.facultyId !== faculty.id) {
            return res.status(403).json({ error: 'You are not authorized to delete this publication.' });
        }

        // Delete the publication
        await DB.publication.delete({
            where: { id: Number(id) },
        });

        res.status(200).json({ message: 'Publication deleted successfully.' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to delete publication.' });
    }
};



export {
    GetFacultyInfo,
    SetSupervisorRequest,
    addPublication,
    editPublication,
    removePublication
}