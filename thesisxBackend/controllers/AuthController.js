//============= imports =================
import DB from "../DB/db.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { sendEmail } from "../middleware/nodemailer.js";
//=======================================

async function generateAndSendOTP(email) {
    const otp = Math.floor(100000 + Math.random() * 900000).toString();  // Generate a 6-digit OTP
    const expireAt = new Date(Date.now() + 10 * 60 * 1000); // Set OTP expiry time (10 minutes)

    try {
        // Check if an OTP already exists for the given email
        const existingOtp = await DB.Otp.findUnique({
            where: { email },
        });

        let status;

        if (existingOtp) {
            // Update OTP if it exists
            status = await DB.Otp.update({
                where: { email },
                data: {
                    otp,
                    expireAt,
                },
            });
        } else {
            // Create new OTP if it doesn't exist
            status = await DB.Otp.create({
                data: {
                    email,
                    otp,
                    expireAt,
                },
            });
        }

        if (status) {
            await sendEmail(email, 'Verify your email', `Your OTP is: ${otp}. It will expire in 10 minutes.`);
            return {
                success: true,
                message: "OTP sent successfully",
            };
        } else {
            return {
                success: false,
                message: "Internal server error",
            };
        }
    } catch (err) {
        console.error("Error in generating OTP:", err);
        return {
            success: false,
            message: "Failed to process OTP request",
        };
    }
}

async function signup(req, res) {
    
    try {
        const { otp, name, email, password, role, department } = req.body;

        // Verify the OTP
        const otpRecord = await DB.Otp.findUnique({
            where: { email },
        });

        // Check if OTP exists and is not expired
        if (!otpRecord) {
            return res.status(400).json({ success: false, message: 'OTP not found for this email' });
        }

        if (otpRecord.otp !== otp) {
            return res.status(400).json({ success: false, message: 'Invalid OTP' });
        }

        if (new Date() > otpRecord.expireAt) {
            return res.status(400).json({ success: false, message: 'OTP has expired' });
        }

        
        // Hash the password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create the user
        const user = await DB.user.create({
            data: {
                name,
                email,
                password: hashedPassword,
                role,
                department,
            },
        });

        await DB.Otp.delete({
            where: { email },
        });

        res.status(201).json({ success: true, message: 'User created successfully' });
    } catch (err) {
        console.error('Error during signup:', err);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
}

async function login(req, res) {
    try {
        const { email, password } = req.body;
        const user = await DB.user.findUnique({
            where: {
                email
            }
        });

        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        bcrypt.compare(password, user.password, function(err, result) {
            if (err) {
                return res.status(500).json({ success: false, message: 'Internal server error' });
            }

            if (result) {
                const token = jwt.sign({ 
                    id: user.id, 
                    role: user.role, 
                    dept: user.department,  
                }, process.env.JWT_KEY);
                return res.status(200).json({ success: true, message: 'Login successful', token });
            } else {
                return res.status(401).json({ success: false, message: 'Invalid credentials' });
            }
        });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
}

async function verifyEmail(req, res) {
    
    try {
        const { email } = req.body;
        if (!email){
            res.status(400).json({ success: false, message: "Empty field"})
        }

        const user = await DB.User.findUnique({
            where: { email }
        });
        if (user) {
            return res.status(409).json({ success: false, message: 'Email already registered' });
        }
        const result = await generateAndSendOTP(email);

        if (result.success){
            res.status(200).json({ success: true, message: result.message });
        } else {
            res.status(500).json({ success: false, message: result.message });
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Internal server error' });
    }
}


export { 
    signup, 
    login, 
    verifyEmail, 
};