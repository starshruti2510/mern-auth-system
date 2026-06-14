import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import { handleError, handleSuccess } from './utils';

function Login() {

    const [loginInfo, setLoginInfo] = useState({
        email: '',
        password: ''
    })

    const navigate = useNavigate();

    const handleChange = (e) => {
        const {name, value} = e.target;
        console.log(name, value);
        const copyLoginInfo = { ...loginInfo};
        copyLoginInfo[name] = value;
        setLoginInfo(copyLoginInfo);
    }

    const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080';

    const handleLogin = async (e) => {
        e.preventDefault();
        const {email, password} = loginInfo;
        if(!email || !password) {
            return handleError('email and passwords are required')
        }
        try {
            const url = `${API_BASE_URL}/auth/login`;
            console.log('Login request URL:', url);
            console.log('API_BASE_URL:', API_BASE_URL);
            const response = await fetch(url, {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(loginInfo)
            })
            const result = await response.json();
            const { success, message, jwtToken, name, error } = result;
            if(success) {
                handleSuccess(message);
                localStorage.setItem('token', jwtToken);
                localStorage.setItem('loggedInUser', name);
                setTimeout(() => {
                    navigate('/home')
                }, 1000)
            } else if(error) {
                const details = error?.details?.[0]?.message || error;
                handleError(details);
            } else if(!success) {
                handleError(message);
            }
            console.log(result);
        } catch(err) {
            handleError(err);
        }
    }
    return (
        <div className='container'>
            <h1>Login</h1>
            <form onSubmit={handleLogin}>
                <div>
                    <label htmlFor='email'>Email</label>
                    <input
                        onChange={handleChange}
                        type='email'
                        id='email'
                        name='email'
                        autoComplete='email'
                        placeholder='Enter your email...'
                        value={loginInfo.email}
                    />
                </div>
                <div>
                    <label htmlFor='password'>Password</label>
                    <input
                        onChange={handleChange}
                        type='password'
                        id='password'
                        name='password'
                        autoComplete='current-password'
                        placeholder='Enter your password...'
                        value={loginInfo.password}
                    />
                </div>
                <button type='submit'>Login</button>
                <span>Don't have an account ?
                    <Link to="/signup">SignUp</Link>
                </span>
            </form>
        </div>
    )
}

export default Login
