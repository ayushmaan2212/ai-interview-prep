/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable no-unused-vars */
import React, { use,useState } from 'react'
import "../auth.form.scss"
import { useNavigate, Navigate, Link }  from 'react-router';
import { useAuth } from '../hooks/useAuth';

 const login = () => {
    
    const {loading, handleLogin, user}  = useAuth();
    const navigate = useNavigate();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        await handleLogin({email, password});
    }

    // Redirect to home if user is logged in
    if (user) {
        return <Navigate to="/" replace />;
    }
    
    if(loading){
        return (<main><h1>Loading......</h1></main>)
    }

  return (
    <main>
        <div className="form-container">
            <h1>Login</h1>

            <form onSubmit={handleSubmit}>

                <div className="input-group">
                    <label htmlFor="email">Email</label>
                    <input 
                     onChange={(e)=> {setEmail(e.target.value)}}
                    type="email" id="email" name="email" placeholder='Enter email address' required />
                </div>
                <div className="input-group">
                    <label htmlFor="password">Password</label>
                    <input
                    onChange={(e)=>{setPassword(e.target.value)}}
                    type="password" id="password" name="password" placeholder='Enter password' required />
                </div>
                <button className="button primary-button">Login</button>
            </form>

            <p>Don't have an account? <Link to="/register">Register</Link> </p>
        </div>
    </main>
  )
}
export default login