import React from 'react'
import { useState, useContext } from 'react';

const Signup = () => {

    const [step, setStep] = useState(1);
    const [error, setError] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        role: 'STUDENT',
        department: 'ARC',
        otp: ''
    });

    const handleEmailVerification = async (e) => {
        e.preventDefault();
    
        // Email regex pattern (basic validation)
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        const email = formData.email;  // Assuming you have an email field in your state (formData)
    
        // Check if email matches the regex
        if (emailRegex.test(email)) {
            try {
                const apiDomain = import.meta.env.VITE_API_DOMAIN;
                const response = await fetch(`${apiDomain}/api/auth/verifyEmail`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ email : formData.email }),
                });
    
                const data = await response.json();
                console.log(data)
                if (!response.ok) {
                    setError(data.message || 'Email verification failed');
                }
                setStep(2);
            } catch (err) {
                setError(err.message || 'Something went wrong');
            }

        } else {
            setError("Please enter a valid email address.");
        }
    }
    
    const handleCreateAccount = async (e) => {
        e.preventDefault();

        try {
            const apiDomain = import.meta.env.VITE_API_DOMAIN;
            const response = await fetch(`${apiDomain}/api/auth/signup`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            const data = await response.json();
            console.log(data)
            if (!response.ok) {
                setError(data.message || 'Signup failed');
            }
        } catch (err) {
            setError(err.message || 'Something went wrong');
        }

        console.log(formData);
    }

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };


  return (
    <div>
        {step === 1 &&
        <form onSubmit={handleEmailVerification}>
            <div>
                <label htmlFor="email">Email</label>
                <input name="email" type="text" required value={formData.email} onChange={handleChange}/>
            </div>
            <button>
                Continue
            </button>
        </form>
    }
        {step === 2 &&
        <form onSubmit={handleCreateAccount}>
            <div>
                <label htmlFor="name">Name</label>
                <input name="name" type="text" required value={formData.name} onChange={handleChange}/>
            </div>
            <div>
                <label htmlFor="password">Password</label>
                <input name="password" type="password" required value={formData.password} onChange={handleChange}/>
            </div>
            <div>
                <label htmlFor="role">Role</label>
                <select name="role" required value={formData.role} onChange={handleChange}>
                    <option value="STUDENT">Student</option>
                    <option value="FACULTY">Faculty</option>
                </select>
            </div>
            {formData.role === 'STUDENT' &&
                <div>
                    <label htmlFor="department">Department</label>
                    <select name="department" required value={formData.department} onChange={handleChange}>
                        <option value="ARC">Department of Architecture</option>
                        <option value="CSE">Department of Computer Science and Engineering</option>
                        <option value="ECO_SSC">Department of Economics and Social Sciences</option>
                        <option value="EEE">Department of Electrical and Electronic Engineering</option>
                        <option value="ENG_HUM">Department of English and Humanities</option>
                        <option value="MNS">Department of Mathematics and Natural Sciences</option>
                        <option value="PHR">School of Pharmacy</option>
                    </select>
                </div>
            }
            <div>
                <label htmlFor="otp">Verify OTP</label>
                <input name="otp" type="text" required value={formData.otp} onChange={handleChange}/>
            </div>
            <button>
                Signup
            </button>
        </form>
    }
    </div>
  )
}

export default Signup

function LeftBanner() {
    return(
        <div className='mb-4 lg:mb-0'>
            <div>
                <h1 className='font-bold text-[36px]'>
                    thesis X
                </h1>
                <p className='text-[14px] text-[hsl(0,0,30%)] dark:text-[hsl(0,0,70%)]'>
                    Empowering collaboration between students and faculty
                </p>
            </div>

            <div className='lg:block hidden lg:mt-5 '>
                <p>
                Thesis X streamlines the thesis supervision process by connecting students with faculty based on shared research interests. Easily find supervisors, track your progress, and manage your thesis journey all in one place.
                </p>
            </div>
            <div className='hidden lg:mt-5 lg:block'>
                Powered by: XYZ
            </div>
        </div>
    )
}