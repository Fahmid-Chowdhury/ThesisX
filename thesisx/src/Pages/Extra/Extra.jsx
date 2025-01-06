import React from 'react'

const Extra = () => {
  return (
    <div>Extra</div>
  )
}

export default Extra

// // Function to delete availability for a faculty
// const deleteAvailability = async (req, res) => {
//     try {
//         const userId = req.userData?.id; // Assuming user ID comes from authentication middleware
//         const role = req.userData?.role;

//         if (!userId || role !== "FACULTY") {
//             return res.status(403).json({ success: false, message: "Unauthorized" });
//         }

//         const { availabilityId } = req.body;

//         if (!availabilityId) {
//             return res.status(400).json({ success: false, message: "Missing availability ID." });
//         }

//         const faculty = await DB.faculty.findUnique({
//             where: { userId },
//         });

//         if (!faculty) {
//             return res.status(404).json({ success: false, message: "Faculty not found." });
//         }

//         // Check if the availability entry exists and belongs to the faculty
//         const existingAvailability = await DB.availability.findUnique({
//             where: { id: availabilityId },
//         });

//         if (!existingAvailability || existingAvailability.facultyId !== faculty.id) {
//             return res.status(404).json({ success: false, message: "Availability entry not found or unauthorized." });
//         }

//         // Delete the availability entry
//         await DB.availability.delete({
//             where: { id: availabilityId },
//         });

//         return res.status(200).json({
//             success: true,
//             message: "Availability deleted successfully.",
//         });
//     } catch (error) {
//         console.error("Error deleting availability:", error);
//         return res.status(500).json({ success: false, message: "Internal server error." });
//     }
// };



// const addAvailability = async (req, res) => {
//     try {
//         const userId = req.userData?.id;
//         const role = req.userData?.role;

//         if (!userId || role !== "FACULTY") {
//             return res.status(403).json({ success: false, message: "Unauthorized" });
//         }

//         const { startTime, endTime, type, status = "Available" } = req.body;

//         if (!startTime || !endTime || !type) {
//             return res.status(400).json({ success: false, message: "Missing required fields." });
//         }

//         const faculty = await DB.faculty.findUnique({ where: { userId } });

//         if (!faculty) {
//             return res.status(404).json({ success: false, message: "Faculty not found." });
//         }

//         // Validate status
//         const validStatuses = ["Available", "Reserved", "Canceled"];
//         if (!validStatuses.includes(status)) {
//             return res.status(400).json({ success: false, message: "Invalid status provided." });
//         }

//         // Create a new availability entry
//         const availability = await DB.availability.create({
//             data: {
//                 facultyId: faculty.id,
//                 startTime: new Date(startTime),
//                 endTime: new Date(endTime),
//                 type,
//                 status,
//             },
//         });

//         return res.status(201).json({
//             success: true,
//             message: "Availability added successfully.",
//             availability,
//         });
//     } catch (error) {
//         console.error("Error adding availability:", error);
//         return res.status(500).json({ success: false, message: "Internal server error." });
//     }
// };
