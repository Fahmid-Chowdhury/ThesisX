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
    
}

export {
    GetFacultyInfo,
    SetSupervisorRequest
}