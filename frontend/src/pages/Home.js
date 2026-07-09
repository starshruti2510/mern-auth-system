import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { handleError, handleSuccess } from './utils';
import { ToastContainer } from 'react-toastify';

function Home() {
  const [loggedInUser, setLoggedInUser] = useState('');
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();
  const API_BASE_URL = (process.env.REACT_APP_API_URL || 'https://mern-auth-system-api-rho.vercel.app').replace(/\/+$/, '');

  useEffect(() => {
    setLoggedInUser(localStorage.getItem('loggedInUser'))
  },[])

  const handleLogout = (e) => {
    localStorage.removeItem('token');
    localStorage.removeItem('loggedInUser');
    handleSuccess('User Logged Out!!')
    setTimeout(() => {
      navigate('/login');
    },1000)
  }

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const url = `${API_BASE_URL}/products`;
        const headers = {
          headers : {
            'Authorization': localStorage.getItem('token')
          }
        }
        const response = await fetch(url, headers);
        const result = await response.json();
        console.log(result);
        setProducts(result);
      } catch(err) {
        handleError(err);
      }
    }

    fetchProducts();
  },[API_BASE_URL])

  return (
    <div>
      <h1>WELCOME {loggedInUser} !!</h1>
      <button onClick={handleLogout}>Logout</button>
      <div>
        {
          products && products?.map((item, index) => (
            <ul key={index}>
              <span>{item.name} : {item.price}</span>
            </ul>
          ))
        }
      </div>
      <ToastContainer />
    </div>
  )
}

export default Home
