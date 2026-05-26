/* eslint-disable no-unused-vars */
import { useContext,useEffect } from "react"; 
import { AuthContext } from "../auth.context.jsx";
import {login,register,logout,getMe} from "../service/auth.api";


export const useAuth = () => {
    const context = useContext(AuthContext);
    const {user,setUser,loading,setLoading} = context;

    const handleLogin = async ({email,password}) => {
        setLoading(true);
        try{
            const data = await login({email,password});
            setUser(data.user);
        }catch(err){
            console.log(err);
        }finally{
            setLoading(false);   
        }
    }

    const handleRegister = async ({username,email,password}) => {
        setLoading(true);
        try {
            const data = await register({username,email,password});
            setUser(data.user);
        }catch(err){
            console.log(err);
        }
        finally{
            setLoading(false);
        }    
    }

    const handleLogout = async () => {
        setLoading(true);
        try{
            const data = await logout();
            setUser(null);
        }catch(err){
            console.log(err);
        }
        finally{
            setLoading(false);
        }
    }

    useEffect(() => {
    const getAndSetUser = async () => {
        console.log('getMe starting...')
        try {
            const data = await getMe()
            console.log('getMe result:', data)
            setUser(data?.user || null)
        } catch (err) {
            console.log('getMe error:', err)
            setUser(null)
        } finally {
            setLoading(false)
            console.log('loading set to false')
        }
    }
    getAndSetUser()
}, [])

    return {user,loading,handleLogin,handleRegister,handleLogout}
}