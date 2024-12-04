import {useState, useEffect} from 'react';

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
    const [formData, setFormData] = useState({
        email:'',
        password:''
    })

    return (
        <div className="h-screen w-screen bg-[hsl(0,0,95%)] dark:bg-[hsl(0,0,5%)] flex items-center justify-center">
            <div className="bg-[hsl(0,0,100%)] dark:bg-[hsl(0,0,0)] p-[50px] shadow-md dark:shadow-[hsl(0,0,70%] rounded-xl max-w-[900px] m-5 text-black dark:text-white">
                <div className="lg:grid lg:grid-cols-2 gap-10 ">
                    <LeftBanner />
                    <div>
                        <form action="">
                            <div className='flex flex-col justify-center gap-2'>
                                <label htmlFor="email">Email</label>
                                <input type="email" className='border outline-1 border-[hsl(0,0,30%)] dark:border-[hsl(0,0,70%)] rounded-lg py-2 px-4 bg-transparent' placeholder='Email' required />
                            </div>
                            <div className='flex flex-col justify-center gap-2 mt-3'>
                                <label htmlFor="text">Password</label>
                                <input type="password" className='border outline-1 border-[hsl(0,0,30%)] dark:border-[hsl(0,0,70%)] rounded-lg py-2 px-4 bg-transparent' placeholder='password' required />
                            </div>

                            <div className='mt-4 flex flex-col'>
                                <button className='px-6 py-2 bg-blue-600 text-white rounded-lg'>
                                    Sign In
                                </button>
                            </div>
                            <div className='flex justify-center items-center gap-1 mt-3'>
                                <div className='h-[1px] w-full bg-[hsl(0,0,30%)] dark:bg-[hsl(0,0,70%)]'></div>
                                <p className="text-nowrap text-[hsl(0,0,30%)] dark:text-[hsl(0,0,70%)]">Don't have an account?</p>
                                <div className='h-[1px] w-full bg-[hsl(0,0,30%)] dark:bg-[hsl(0,0,70%)]'></div>
                            </div>
                            <div className='mt-4 flex flex-col'>
                                <button className='px-6 py-2 bg-blue-600 text-white rounded-lg'>
                                    Register
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Signin
