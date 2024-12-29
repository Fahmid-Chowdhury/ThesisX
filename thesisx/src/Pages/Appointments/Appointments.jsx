import { useState } from "react"
import { useAppointment, AppointmentProvider } from "../../Contexts/AppointmentContext/AppointmentContext"
import BarLoader from "react-spinners/BarLoader"

const AppointmentComponent = () => {
    const { appointments, requests, loading, error } = useAppointment()

    if (loading) {
        return (
            <div className='h-full flex flex-col items-center justify-center'>
                <BarLoader
                    color={'hsl(210 80% 55%)'}
                    height={'6px'}
                    width={'150px'}
                />
            </div>
        )
    }
    if (error) {
        return (
            <div className='h-full flex flex-col items-center justify-center'>
                {error}
            </div>
        )
    }

    return(
        <>
            appointments
        </>
    )
}


const Appointments = () =>{
    return(
        <AppointmentProvider>
            <AppointmentComponent />
        </AppointmentProvider>
    )
}
export default Appointments