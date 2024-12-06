// ===========================
import React from 'react'
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
// ===========================
import { DangerAlert } from '../../Components/Alert/Alert';
import CustomSelect from '../../Components/CustomSelect/CustomSelect'
import OTPInput from '../../Components/OTPBox/OTPBox';
import LoaderSVG from '../../assets/LoaderSVG';
// ===========================


const Signup = () => {
    const navigate = useNavigate();
    const [step, setStep] = useState(1);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        role: '',
        department: '',
        otp: ''
    });

    const handleEmailVerification = async (e) => {
        e.preventDefault();
        setLoading(true);
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
                    body: JSON.stringify({ email: formData.email }),
                });

                const data = await response.json();
                console.log(data)
                if (!response.ok) {
                    setError(data.message || 'Email verification failed');
                } else {
                    setStep(2);
                    setError("")
                }
            } catch (err) {
                setError(err.message || 'Something went wrong');
            }

        } else {
            setError("Please enter a valid email address.");
        }

        setLoading(false);
    }

    const handleCreateAccount = async (e) => {
        e.preventDefault();
        setLoading(true)
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
            } else {
                setSuccess(true)
            }
        } catch (err) {
            setError(err.message || 'Something went wrong');
        } finally {
            setLoading(false)
        }


    }

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };


    return (
        <div className="h-screen w-screen bg-[hsl(0,0,95%)] dark:bg-[hsl(0,0,5%)] flex items-center justify-center">
            <div className='h-full w-full flex flex-col justify-center items-center '>

                <div className="sm:bg-[hsl(0,0,100%)] bg-[hsl(0,0,95%)] sm:dark:bg-[hsl(0,0,10%)] dark:bg-[hsl(0,0,5%)] lg:p-[50px] md:p-[42px] sm:p-[36px] p-[20px] sm:shadow-md rounded-xl max-w-[900px] sm:m-5 text-black dark:text-white overflow-x-auto w-full">
                    <div className="lg:grid lg:grid-cols-2 gap-10 ">
                        <LeftBanner />
                        <div className='h-full flex flex-col relative'>
                            {
                                loading &&
                                <div className="absolute z-10 w-full h-full scale-110 backdrop-blur-sm flex flex-col items-center justify-center">
                                    <LoaderSVG 
                                        color={"hsl(18,73%,48%)"}
                                        size={40}
                                    />
                                    <p>Loading</p>
                                </div>
                            }
                            {
                                success &&
                                <div className="absolute z-10 w-full h-full scale-110 backdrop-blur-sm flex flex-col items-center justify-center">
                                    
                                    <p className='text-center text-[24px] '>Account Created Successfully</p>
                                    <button className='mt-4 px-6 py-2 bg-[hsl(18,73%,48%)] hover:bg-[hsl(18,73%,42%)] dark:hover:bg-[hsl(18,73%,58%)] text-white rounded-full disabled:opacity-80' disabled={loading} onClick={() => {
                                            navigate('/signin')
                                        }}>
                                            Sign In
                                        </button>
                                </div>

                            }
                            <div>
                                <h1 className='font-bold text-[36px]'>
                                    Create Account
                                </h1>
                            </div>
                            {step === 1 &&
                                <div className='flex flex-col justify-between h-full transition-all duration-500 transform ease-in-out'>

                                    <form onSubmit={handleEmailVerification} id='verify-email' className={(loading|| success ) ? `mt-3 opacity-20` : `mt-3`}>
                                        <div className='flex flex-col justify-center gap-2'>
                                            <label htmlFor="email">Email</label>
                                            <input className='border outline-1 border-[hsl(0,0,30%)] dark:border-[hsl(0,0,70%)] rounded-lg py-2 px-4 bg-transparent' placeholder='Email' name="email" type="text" required value={formData.email} onChange={handleChange} />
                                        </div>
                                        {
                                            error && (
                                                <div className='mt-3'>
                                                    <DangerAlert text={error} />
                                                </div>
                                            )
                                        }
                                    </form>
                                    <div className='mt-10 flex items-center lg:justify-end justify-between gap-5'>
                                        <button className='lg:px-6 lg:py-2 dark:hover:bg-[hsla(18,73%,48%,40%)] hover:bg-[hsla(18,73%,62%,40%)] text-black dark:text-white rounded-full disabled:opacity-80' disabled={loading} onClick={() => {
                                            navigate('/signin')
                                        }}>
                                            Sign In
                                        </button>
                                        <button form='verify-email' className='px-6 py-2 bg-[hsl(18,73%,48%)] hover:bg-[hsl(18,73%,42%)] dark:hover:bg-[hsl(18,73%,58%)] text-white rounded-full disabled:opacity-80' disabled={loading}>
                                            Continue
                                        </button>
                                    </div>
                                </div>
                            }
                            {step === 2 &&
                                <div>
                                    <form onSubmit={handleCreateAccount} id="create-user" className={(loading|| success ) ? `mt-3 opacity-20 space-y-4` : `mt-3 space-y-4 animate-into-view-2`} >
                                        <div className="flex flex-col justify-center gap-2">
                                            <label htmlFor="name">Name</label>
                                            <input
                                                className="border outline-1 border-[hsl(0,0,30%)] dark:border-[hsl(0,0,70%)] rounded-lg py-2 px-4 bg-transparent"
                                                name="name"
                                                type="text"
                                                required
                                                value={formData.name}
                                                onChange={handleChange}
                                                placeholder='Name'
                                            />
                                        </div>
                                        <div className="flex flex-col justify-center gap-2">
                                            <label htmlFor="password">Password</label>
                                            <input
                                                className="border outline-1 border-[hsl(0,0,30%)] dark:border-[hsl(0,0,70%)] rounded-lg py-2 px-4 bg-transparent"
                                                name="password"
                                                type="password"
                                                required
                                                value={formData.password}
                                                onChange={handleChange}
                                                placeholder='Password'
                                            />
                                        </div>
                                        <div className="flex flex-col justify-center gap-2">
                                            <label htmlFor="department">Department</label>
                                            <CustomSelect
                                                value={formData.department}
                                                onChange={(newValue) => setFormData({ ...formData, department: newValue })}
                                                options={[
                                                    { label: 'Architecture', value: 'ARC' },
                                                    { label: 'Computer Science and Engineering', value: 'CSE' },
                                                    { label: 'Economics and Social Sciences', value: 'ECO_SSC' },
                                                    { label: 'Electrical and Electronic Engineering', value: 'EEE' },
                                                    { label: 'English and Humanities', value: 'ENG_HUM' },
                                                    { label: 'Mathematics and Natural Sciences', value: 'MNS' },
                                                    { label: 'Pharmacy', value: 'PHR' }
                                                ]}
                                            />
                                        </div>
                                        <div className="flex flex-col justify-center gap-2">
                                            <label htmlFor="role">Role</label>
                                            <CustomSelect
                                                value={formData.role}
                                                onChange={(newValue) => setFormData({ ...formData, role: newValue })}
                                                options={[
                                                    { label: 'Student', value: 'STUDENT' },
                                                    { label: 'Faculty', value: 'FACULTY' }
                                                ]}
                                            />
                                        </div>

                                        <div className="flex flex-col justify-center gap-2">
                                            <label htmlFor="otp">OTP</label>
                                            <OTPInput length={6} onChange={(newValue) => setFormData({ ...formData, otp: newValue })} />
                                        </div>
                                        {error && (
                                            <div className="mt-3">
                                                <DangerAlert text={error} />
                                            </div>
                                        )}
                                    </form>
                                    <div className='mt-10 flex items-center lg:justify-end justify-between gap-5'>

                                        <button className='lg:px-6 lg:py-2 dark:hover:bg-[hsla(18,73%,48%,40%)] hover:bg-[hsla(18,73%,62%,40%)] text-black dark:text-white rounded-full' onClick={() => {
                                            setStep(1)
                                        }}>
                                            Back
                                        </button>
                                        <button
                                            className="px-6 py-2 bg-[hsl(18,73%,48%)] hover:bg-[hsl(18,73%,42%)] dark:hover:bg-[hsl(18,73%,58%)] text-white rounded-full disabled:opacity-80"
                                            disabled={loading} form='create-user'
                                        >
                                            Signup
                                        </button>

                                    </div>
                                </div>

                            }
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Signup

function LeftBanner() {
    return (
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