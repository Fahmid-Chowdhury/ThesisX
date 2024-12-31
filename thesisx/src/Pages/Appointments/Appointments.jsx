import { useState } from "react"
import { useAppointment, AppointmentProvider } from "../../Contexts/AppointmentContext/AppointmentContext"
import BarLoader from "react-spinners/BarLoader";
import { useNavigate } from "react-router-dom";

const renderCard = (item, type) => {
    const navigate = useNavigate()

    return (
        <div
            key={item.id}
            className="bg-[hsl(0,0,100)] dark:bg-black rounded-lg p-5 border border-[hsl(0,0%,80%)] dark:border-[hsl(0,0%,20%)] flex flex-col justify-between"
        >
            {/* Title */}
            <h2
                className="text-xl font-semibold mb-2 overflow-hidden"
                style={{
                    height: "3rem",
                    lineHeight: "1.5rem",
                    display: "-webkit-box",
                    WebkitBoxOrient: "vertical",
                    WebkitLineClamp: 2,
                    overflow: "hidden",
                }}
            >
                {item.thesis.title}
            </h2>

            <div className="h-[1px] w-full bg-black dark:bg-white opacity-15 mb-2"></div>
            {/* Details */}
            <div className="text-sm text-gray-500 mb-4">
                {item.status && (
                    <p>
                        <span className="font-medium">Status:</span> {item.status}
                    </p>

                )}
                <p>
                    <span className="font-medium">Faculty:</span> {item.faculty.user.name}
                </p>
                <p>
                    <span className="font-medium">Created at:</span> {new Date(item.createdAt).toLocaleDateString()}
                </p>
                {item.appointmentDate && (
                    <p>
                        <span className="font-medium">Appointment Date:</span>{" "}
                        {new Date(item.appointmentDate).toLocaleDateString()}
                    </p>
                )}
                {item.notes && (
                    <p>
                        <span className="font-medium">Notes:</span> {item.notes}
                    </p>
                )}
            </div>

            {/* View Button */}
            <button
                className="mt-auto text-themeColDark dark:text-themeColLight text-sm font-medium py-2 px-4 rounded-lg border border-themeColDark dark:border-themeColLight"
                onClick={() => {
                    // Add navigation logic here if needed
                    if (type === "request"){
                        navigate(`/appointments/r/${item.id}`)
                    }
                    console.log(`View Appointment ID: ${item.id}`);
                }}
            >
                View Details
            </button>
        </div>
    );
}


const AppointmentComponent = () => {
    const { appointments, requests, loading, error } = useAppointment();

    if (loading) {
        return (
            <div className="h-full flex flex-col items-center justify-center">
                <BarLoader
                    color={"hsl(210 80% 55%)"}
                    height={"6px"}
                    width={"150px"}
                />
            </div>
        );
    }
    if (error) {
        return (
            <div className="h-full flex flex-col items-center justify-center">
                {error}
            </div>
        );
    }



    return (
        <div className="max-w-7xl mx-auto sm:p-6 p-2">

            <h1 className="text-2xl font-bold mb-4">Appointments</h1>
            {appointments.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
                    {appointments.map((appointment) => renderCard(appointment, "appointment"))}
                </div>
            ) : (
                <div className="text-center opacity-75">
                    No appointments available.
                </div>
            )}

            <h1 className="text-2xl font-bold mb-4">Requests</h1>
            {requests.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {requests.map((request) => renderCard(request, "request"))}
                </div>
            ) : (
                <div className="text-center opacity-75">
                    No requests available.
                </div>
            )}
        </div>
    );
};


const Appointments = () => {
    return (
        <AppointmentProvider>
            <AppointmentComponent />
        </AppointmentProvider>
    )
}
export default Appointments