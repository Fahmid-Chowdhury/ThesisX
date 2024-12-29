import { useThesis } from "../../../../Contexts/ThesisContext/ThesisContext"
import { GetStaticImage } from "../../../../utils/imageAPI"
const ThesisPeople = () => {
    const { thesisData } = useThesis()
    console.log(thesisData)
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
                <button>
                    Add student
                </button>
            </div>

        </div>
    )
}

export default ThesisPeople
