// import jwt from 'jsonwebtoken';

// const checkAuth = (req, res, next) => {
//     try {
//         const token = req.headers.authorization.split(" ")[1];
//         const decodedToken = jwt.verify(token, process.env.JWT_KEY);
//         req.userData = decodedToken;
//         console.log("auth passed")
//         next();
//     } catch (error) {
//         res.status(401).json({
//             message: 'Auth failed',
//             error
//         });
//     }
// };

// export { checkAuth };

import jwt from 'jsonwebtoken';
import DB from '../DB/db.js'; // Ensure this import is correct

const checkAuth = async (req, res, next) => {  // Make this function async
    try {
        // Extract token from the Authorization header
        const token = req.headers.authorization.split(" ")[1];
        
        // Verify JWT token
        const decodedToken = jwt.verify(token, process.env.JWT_KEY);
        req.userData = decodedToken;

        console.log("Auth passed");

        // Check if the route is adding or updating feedback
        if (req.originalUrl.includes("feedback")) {
            const { submissionId } = req.body; // Assuming submissionId is passed in the body for feedback routes

            if (!submissionId) {
                return res.status(400).json({
                    success: false,
                    message: "submissionId is required"
                });
            }

            // Authorize based on role and submissionId
            if (req.originalUrl.includes("/add-feedback") || req.originalUrl.includes("/update-feedback")) {
                if (req.userData.role === "FACULTY") {
                    // Faculty can add or update feedback for any submission under their supervision
                    const submission = await DB.submission.findUnique({
                        where: { id: submissionId },
                        select: { thesis: { supervisorId: true } }
                    });

                    if (!submission) {
                        return res.status(404).json({
                            success: false,
                            message: "Submission not found"
                        });
                    }

                    // Check if the faculty is the supervisor of the thesis
                    if (submission.thesis.supervisorId !== req.userData.id) {
                        return res.status(403).json({
                            success: false,
                            message: "Forbidden: You are not the supervisor of this thesis"
                        });
                    }
                } else if (req.userData.role === "STUDENT") {
                    // Student can add or update feedback if they are enrolled in the thesis of the submission
                    const student = await DB.student.findUnique({
                        where: { userId: req.userData.id },
                        select: { thesisID: true }
                    });

                    if (!student || student.thesisID !== submissionId) {
                        return res.status(403).json({
                            success: false,
                            message: "Forbidden: You are not enrolled in this thesis"
                        });
                    }
                } else {
                    return res.status(403).json({
                        success: false,
                        message: "Forbidden: Unauthorized role"
                    });
                }
            }
        }

        next(); // Proceed to the next middleware or route handler
    } catch (error) {
        console.error(error);  // Log the error for debugging purposes
        res.status(401).json({
            success: false,
            message: "Auth failed",
            error
        });
    }
};

export { checkAuth };



