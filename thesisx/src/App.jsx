// ===========================
import { useContext } from 'react'
import BarLoader from "react-spinners/BarLoader";
// ===========================
import { AuthContext } from './Contexts/Authentication/AuthContext'
import AppRouter from './Routes/routes';
// ===========================


function App() {
    
    const {token, user, loading, signIn, signOut } = useContext(AuthContext);

    if (loading) {
        return (
            <div className='h-screen w-screen bg-[hsl(0,0%,95%)] dark:bg-[hsl(0,0%,5%)] flex flex-col items-center justify-center'>
                <BarLoader 
                    color={'hsl(18 73% 60%)'}
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


