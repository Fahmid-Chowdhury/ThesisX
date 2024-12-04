// ===========================
import { useContext } from 'react'
// ===========================
import { AuthContext } from './Contexts/Authentication/AuthContext'

function App() {
    
    const {token, user, loading, signIn, signOut } = useContext(AuthContext);

    if (loading) {
        return (
            <div>
                Loading...
            </div>
    )}
    return (
        <>
            {
                user ? (
                    <div>
                        {user.name}
                        {user.email}
                    </div>
                ) : (
                    <div>
                        User is not defined
                    </div>
                )
            }
            {
                token ? (
                    <div>
                        token is defined
                    </div>
                ) : (
                    <div>
                        token is not defined
                    </div>
                )
            }
        </>
    )
}


export default App


