const prisma = require('../prismaClient');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const sendOTP = require('../utils/nodemailer.js');


async function generateAndSendOTP(userId, email) {
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiration = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes from now

    // Save OTP in the `otps` table
    await prisma.otps.create({
        data: {
            user_id: userId,
            otp,
            expiration
        }
    });

    // Send OTP via email
    const sendOTPEmail = await sendOTP(email, 'Verify your email', `Your OTP is ${otp}`);
}


async function signup(req, res) {
    const { name, email, password, role, department } = req.body;

    bcrypt.genSalt(10, function(err, salt) {
        if (err) {
            return res.status(500).json({ message: 'Internal server error' });
        }

        try {
            bcrypt.hash(password, salt, async function(err, hash) {
                if (err) {
                    return res.status(500).json({ message: 'Internal server error' });
                }

                try {
                    const user = await prisma.user.create({
                        data: {
                            name,
                            email,
                            password: hash,
                            role,
                            department
                        }
                    });

                    await generateAndSendOTP(user.id, email);

                    res.status(201).json({ message: 'User created successfully' });
                } catch (err) {
                    res.status(400).json({ message: 'Username already taken' });
                }
            });
        } catch (err) {
            res.status(500).json({ message: 'Internal server error' });
        }
    })
}

async function login(req, res) {
    const { email, password } = req.body;

    try {
        const user = await prisma.user.findUnique({
            where: {
                email
            }
        });

        if (user === null) {
            return res.status(404).json({ message: 'User not found' });
        }

        if (user.isVerified === false) {
            return res.status(401).json({ message: 'User is not active' });
        }

        bcrypt.compare(password, user.password, function(err, result) {
            if (err) {
                return res.status(500).json({ message: 'Internal server error' });
            }

            if (result) {
                const token = jwt.sign({ 
                    email: user.email, 
                    role: user.role, 
                    dept: user.department, 
                    isActive: user.isActive 
                }, process.env.JWT_KEY);
                return res.status(200).json({ message: 'Login successful', token });
            } else {
                return res.status(401).json({ message: 'Invalid credentials' });
            }
        });
    } catch (err) {
        res.status(500).json({ message: 'Internal server error' });
    }
}

async function verifyOTP(req, res) {
    const { email, otp } = req.body;

    try {
        const user = await prisma.user.findUnique({
            where: { email }
        });

        if (user === null) {
            return res.status(404).json({ message: 'User not found' });
        }

        const otpRecord = await prisma.otp.findFirst({
            where: {
                userId: user.id,
                otp,
                isVerified: false
            }
        });

        if (otpRecord === null) {
            return res.status(400).json({ message: 'Invalid OTP' });
        }

        if (new Date() > otpRecord.expiration) {
            return res.status(400).json({ message: 'OTP expired. Please request a new one.' });
        }

        // Mark OTP as verified
        await prisma.otp.delete({
            where: { id: otpRecord.id }
        });

        // Update user as verified
        await prisma.user.update({
            where: { id: user.id },
            data: { isVerified: true }
        });

        res.status(200).json({ message: 'Email verified successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Internal server error' });
    }
}

async function resendOTP(req, res) {
    const { email } = req.body;

    try {
        const user = await prisma.user.findUnique({
            where: { email }
        });

        if (user === null) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Delete old OTPs for the user
        await prisma.otp.deleteMany({
            where: { userId: user.id }
        });

        // Generate and send a new OTP
        await generateAndSendOTP(user.id, email);

        res.status(200).json({ message: 'New OTP sent to your email' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Internal server error' });
    }
}



module.exports = {
    signup,
    login,
    verifyOTP,
    resendOTP
};