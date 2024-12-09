// ===========================
import { useContext } from 'react'
import BarLoader from "react-spinners/BarLoader";
// ===========================
import { AuthContext } from './Contexts/Authentication/AuthContext'
import AppRouter from './Routes/routes';
// ===========================


function App() {
    
    const {loading} = useContext(AuthContext);

    if (loading) {
        return (
            <div className='h-screen w-screen bg-[hsl(0,0%,95%)] dark:bg-[hsl(0,0%,5%)] flex flex-col items-center justify-center'>
                <BarLoader 
                    color={'hsl(210 80% 55%)'}
                    height={'6px'}
                    width={'150px'}
                />
            </div>
    )}
    return (
        <>
            <AppRouter />
        </>
    )
}


export default App


