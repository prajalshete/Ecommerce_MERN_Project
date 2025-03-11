import React,{useState, useContext}  from 'react';
import axios from 'axios';
import {useNavigate} from 'react-router-dom'
import { UserContext } from '../context/userContext';

// import { useUserContext } from '../useContext/UserContextExample';
const Login=()=>{
  // const { setUser } = useUserContext();
//   const [username, setUsername]=useState('');

  const [email, setEmail]=useState('');
  const [password, setPassword]=useState('');
//   const [mobileNumber, setMobileNumber]=useState('');
//   const [role, setRole]=useState('commonUser');

const navigate=useNavigate();
const { setUser } = useContext(UserContext);


  // Function to fetch user info
  const fetchUserInfo = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        alert('No token found, please login again.');
        return;
      }

      const response = await axios.get('http://localhost:5002/api/user/getUserInfo', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data.success) {
        const userInfo = response.data.user; // Adjust based on your API response
        setUser(userInfo);
        console.log('User Info:', userInfo);
      } else {
        alert('Failed to fetch user information.');
      }
    } catch (error) {
      console.error('Failed to fetch user information', error);
      alert('Failed to fetch user information.');
    }
  };








 // Function to handle login
 const handleLogin = async (event) => {
  event.preventDefault();
  console.log(email, password);
  const payload = { email, password };

  try {
    const response = await axios.post('http://localhost:5002/api/user/loginuser', payload);
    const token = response.data.token;

    if (response.data.success) {
      localStorage.setItem('token', token);

      await fetchUserInfo(); // Fetch user info after login
      alert(response.data.message);
      navigate('/productList');
    } else {
      alert(response.data.message);
    }
  } catch (error) {
    console.error('Login Failed', error);
    alert('Login Failed');
  }
};
return(

<form>
  <div className='container'>
  <div className='Login'>
    
  <div className="form-group">
  <h1>Login</h1>
 
    <label htmlFor="exampleInputEmail1">Email address</label>
    <br></br>
    <input type="email" className="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" placeholder="Enter email"  onChange={(e)=>setEmail(e.target.value)}/>
    
    <small id="emailHelp" className="form-text text-muted">We'll never share your email with anyone else.</small>
  </div>
  <div className="form-group">
    <label htmlFor="exampleInputPassword1">Password</label>
    <br></br>
    <input type="password" className="form-control" id="exampleInputPassword1" placeholder="Password"  onChange={(e)=>setPassword(e.target.value)}/>
  </div>
  
  
  <button onClick={handleLogin} type="submit" className="btn btn-primary">Submit</button>
  </div>
  </div>
</form>
)
};
export default Login;