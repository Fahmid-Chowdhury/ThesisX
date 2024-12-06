import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
// ================================
import { AuthContext } from '../../Contexts/Authentication/AuthContext';
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


const Signin = () => {
    const { fetchUserData } = useContext(AuthContext);
    const navigate = useNavigate()
    const [loading, setLoading] = useState(false); // To manage loading state
    const [error, setError] = useState(null)
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    })

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true);
        setError(null);

        try {
            const apiDomain = import.meta.env.VITE_API_DOMAIN;
            const response = await fetch(`${apiDomain}/api/auth/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            const data = await response.json();
            console.log(data)
            if (!response.ok) {
                throw new Error(data.message || 'Sign-in failed');
            }
            localStorage.setItem("authToken", data.token)
            fetchUserData(data.token);
            navigate('/') 

        } catch (err) {
            setError(err.message || 'Something went wrong');
        } finally {
            setLoading(false);
        }

    }

    return (
        <div className="h-screen w-screen bg-[hsl(0,0,95%)] dark:bg-[hsl(0,0,5%)] flex items-center justify-center">
            <div className="bg-[hsl(0,0,100%)] dark:bg-[hsl(0,0,0)] p-[50px] shadow-md dark:shadow-[hsl(0,0,70%] rounded-xl max-w-[900px] m-5 text-black dark:text-white">
                <div className="lg:grid lg:grid-cols-2 gap-10 ">
                    <LeftBanner />
                    <div>
                        <form onSubmit={handleSubmit}>
                            <div className='flex flex-col justify-center gap-2'>
                                <label htmlFor="email">Email</label>
                                <input type="email" name='email' className='border outline-1 border-[hsl(0,0,30%)] dark:border-[hsl(0,0,70%)] rounded-lg py-2 px-4 bg-transparent' placeholder='Email' value={formData.email} onChange={handleChange} required />
                            </div>
                            <div className='flex flex-col justify-center gap-2 mt-3'>
                                <label htmlFor="text">Password</label>
                                <input type="password" name='password' className='border outline-1 border-[hsl(0,0,30%)] dark:border-[hsl(0,0,70%)] rounded-lg py-2 px-4 bg-transparent' placeholder='password' value={formData.password} onChange={handleChange} required />
                            </div>

                            <div className='mt-4 flex flex-col'>
                                <button className='px-6 py-2 bg-blue-600 text-white rounded-lg' disabled = {loading}>
                                    Sign In
                                </button>
                            </div>
<<<<<<< Updated upstream
=======
                            <div className='flex justify-center items-center gap-1 mt-3'>
                                <div className='h-[1px] w-full bg-[hsl(0,0,30%)] dark:bg-[hsl(0,0,70%)]'></div>
                                <p className="text-nowrap text-[hsl(0,0,30%)] dark:text-[hsl(0,0,70%)]">Don't have an account?</p>
                                <div className='h-[1px] w-full bg-[hsl(0,0,30%)] dark:bg-[hsl(0,0,70%)]'></div>
                            </div>
                            <div className='mt-4 flex flex-col'>
                                <button className='px-6 py-2 bg-blue-600 text-white rounded-lg' >
                                    Register
                                </button>
                            </div>
>>>>>>> Stashed changes
                        </form>
                        <div className='flex justify-center items-center gap-1 mt-3'>
                            <div className='h-[1px] w-full bg-[hsl(0,0,30%)] dark:bg-[hsl(0,0,70%)]'></div>
                            <p className="text-nowrap text-[hsl(0,0,30%)] dark:text-[hsl(0,0,70%)]">Don't have an account?</p>
                            <div className='h-[1px] w-full bg-[hsl(0,0,30%)] dark:bg-[hsl(0,0,70%)]'></div>
                        </div>
                        <div className='mt-4 flex flex-col'>
                            <button className='px-6 py-2 bg-blue-600 text-white rounded-lg' onClick={() => {
                                navigate('/signup')
                            }}>
                                Signup
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Signin
