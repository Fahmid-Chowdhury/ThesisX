import { useThesis } from "../../../../Contexts/ThesisContext/ThesisContext"
import { GetStaticImage } from "../../../../utils/imageAPI"
import { useState } from "react";
const ThesisPeople = () => {
    const { thesisData } = useThesis();
    const [showForm, setShowForm] = useState(false);
    return (
        <div className="flex flex-col gap-2 sm:gap-3 mt-3 sm:px-10 md:px-20">
            <h2 className="text-xl sm:text-3xl px-4 sm:px-10">Supervisor</h2>
            <div className="h-[1px] w-full bg-black dark:bg-white opacity-15 "></div>
            {
                thesisData.supervisorId ? (
                    <div className="flex items-center gap-4 px-4 sm:px-10 mt-2">
                        <div className="flex items-center gap-2">
                            <div className='flex-shrink-0 aspect-square w-12 rounded-full overflow-hidden flex'>
                                <img
                                    src={GetStaticImage(thesisData.faculty.user.image, "?format=true&width=160&height=160") || "/profile.webp"}
                                    alt={`${thesisData.faculty.user.name}'s profile`}
                                    className=" object-cover"
                                />
                            </div>
                            <div>
                                <h3 className="font-semibold">{thesisData.faculty.user.name}</h3>
                                <p className="text-sm text-[hsl(0,0%,50%)] dark:text-[hsl(0,0%,50%)]">{thesisData.faculty.user.email}</p>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="flex items-center gap-4 flex-col mt-2">
                        <p className="text-[hsl(0,0%,50%)] dark:text-[hsl(0,0%,50%)]">No supervisor assigned</p>
                    </div>
                )
            }

            <h2 className="text-xl sm:text-3xl px-4 sm:px-10 mt-5">Students</h2>
            <div className="h-[1px] w-full bg-black dark:bg-white opacity-15 "></div>
            {
                thesisData.student?.length > 0 ? (
                    thesisData.student.map((student) => (
                        <div key={student.id} className="flex items-center gap-4 px-4 sm:px-10 mt-2">
                            <div className="flex items-center gap-2">
                                <div className='flex-shrink-0 aspect-square w-12 rounded-full overflow-hidden flex'>
                                    <img
                                        src={GetStaticImage(student.user.image, "?format=true&width=160&height=160") || "/profile.webp"}
                                        alt={`${student.user.name}'s profile`}
                                        className=" object-cover"
                                    />
                                </div>
                                <div>
                                    <h3 className="font-semibold">{student.user.name}</h3>
                                    <p className="text-sm text-[hsl(0,0%,50%)] dark:text-[hsl(0,0%,50%)]">{student.user.email}</p>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="flex items-center gap-4 flex-col mt-2">
                        <p className="text-[hsl(0,0%,50%)] dark:text-[hsl(0,0%,50%)]">No students assigned</p>
                    </div>
                )
            }

            <div className="flex items-center gap-4 px-4 sm:px-10 mt-5">
                <button onClick ={()=>{
                    setShowForm(!showForm);
                }}
                    className="px-4 py-2 border border-themeColDark dark:border-themeColLight text-themeColDark dark:text-themeColLight rounded-lg"
                >   {
                        showForm? "Cancel" : "Add student"
                    }
                </button>
            </div>
            {
                showForm && (
                    <InviteBox />
                )
            }

        </div>
    )
}


const InviteBox = () => {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState('');

    const handleSuccess = ()=>{
        setSuccess("Student invited successfully!");
        setTimeout(() => {
            setSuccess(null);
        }, 2000);
    }

    const handleInvite = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem("authToken");
            const apiDomain = import.meta.env.VITE_API_DOMAIN;
            const response = await fetch(`${apiDomain}/api/thesis/invite-student`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ email }),
            });

            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.message || "Failed to invite student");
            }
            setEmail('');
            setError(null);
            handleSuccess();
        } catch (err) {
            console.error(err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }


    return (
        <div className="flex flex-col gap-4 mt-2 px-4 sm:px-10 max-w-xl">
            {
                error && (
                    <div className="text-red-500 text-sm">{error}</div>
                )
            }
            {
                success && (
                    <div className="text-green-500 text-sm">{success}</div>
                )
            }
            <p className="text-[hsl(0,0%,20%)] dark:text-[hsl(0,0%,80%)]">Email:</p>
            <input 
                type="text" 
                className="w-full border border-gray-300 rounded-lg px-3 py-2 dark:bg-black dark:border-gray-700" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required

            />
            <button className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700" onClick={handleInvite}>{
                    loading ? 'Sending Invitation' : 'Invite'
                }</button>
        </div>
    );
}

export default ThesisPeople
