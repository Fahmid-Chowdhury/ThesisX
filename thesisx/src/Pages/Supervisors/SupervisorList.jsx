import { ArrowRightCircleIcon } from "@heroicons/react/24/outline";

const supervisors = [
    {
        id: 1,
        name: "Dr. John Doe",
        department: "Computer Science",
        researchInterests: ["AI", "Machine Learning", "NLP"],
        availability: 2,
        publications: ["Deep Learning 101", "AI in Healthcare"],
        imageUrl:"profile.webp"
    },
    {
        id: 2,
        name: "Dr. Jane Smith",
        department: "Mathematics",
        researchInterests: ["Algebra", "Cryptography"],
        availability: 0,
        publications: ["Cryptographic Methods", "Algebraic Patterns"],
        imageUrl:"profile.webp"
    },
    {
        id: 1,
        name: "Dr. John Doe",
        department: "Computer Science",
        researchInterests: ["AI", "Machine Learning", "NLP"],
        availability: 2,
        publications: ["Deep Learning 101", "AI in Healthcare"],
        imageUrl:"profile.webp"
    },
    {
        id: 2,
        name: "Dr. Jane Smith",
        department: "Mathematics",
        researchInterests: ["Algebra", "Cryptography"],
        availability: 0,
        publications: ["Cryptographic Methods", "Algebraic Patterns"],
        imageUrl:"profile.webp"
    },
    {
        id: 1,
        name: "Dr. John Doe",
        department: "Computer Science",
        researchInterests: ["AI", "Machine Learning", "NLP"],
        availability: 2,
        publications: ["Deep Learning 101", "AI in Healthcare"],
        imageUrl:"profile.webp"
    },
    {
        id: 2,
        name: "Dr. Jane Smith",
        department: "Mathematics",
        researchInterests: ["Algebra", "Cryptography"],
        availability: 0,
        publications: ["Cryptographic Methods", "Algebraic Patterns"],
        imageUrl:"profile.webp"
    },
];

const SupervisorCard = ({ supervisor }) => {
    return (
        <div className="bg-white dark:bg-black shadow-md rounded-lg p-4 flex flex-col justify-between">
            <div className="flex justify-between">
                <div className="flex ">
                    {/* Image Section */}
                    <img
                        src={supervisor.imageUrl} // Assuming the image URL is provided in the supervisor object
                        alt={`${supervisor.name}'s profile`}
                        className="w-[70px] h-[70px] rounded-md object-cover mr-4"
                    />
                    <div className="flex flex-col justify-between" >
                        <div>
                            <h3 className="text-xl font-bold text-black dark:text-white text leading-none">
                                {supervisor.name}
                            </h3>
                            <p className="text-sm text-black dark:text-white opacity-50 mt-2 leading-none">
                                Dept: {supervisor.department}
                            </p>
                        </div>
                        <p className="text-sm text-white w-fit ">
                        
                        {supervisor.availability > 0
                            ? `${supervisor.availability} slots open`
                            : "Not available"}
                        </p>
                    </div>
                </div>
                <button>
                    <ArrowRightCircleIcon className="w-10 h-10 opacity-50 hover:opacity-100" />
                </button>

            </div>
        </div>
    );
};


const SupervisorList = () => {
    return (
        <div className="p-5 max-w-screen-xl mx-auto">
            
            <div className="grid grid-cols-1 sm:grid-cols-1 lg:grid-cols-2 gap-6">
                {supervisors.map((supervisor) => (
                    <SupervisorCard key={supervisor.id} supervisor={supervisor} />
                ))}
            </div>
        </div>
    );
};

export default SupervisorList;