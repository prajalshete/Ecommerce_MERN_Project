import React, { useState } from 'react';
import axios from 'axios';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  const [role, setRole] = useState('commonUser'); // Default role is 'commonUser'

  // Register function to call API
  async function register(payload) {
    try {
      const response = await axios.post('http://localhost:5002/api/user/registeruser', payload);
      if (response.data.success) {
        alert(response.data.message);
      } else {
        alert(response.data.message);
      }
    } catch (error) {
      alert('Registration Failed');
    }
  }

  // Handle form submission
  const handleRegister = (event) => {
    event.preventDefault(); // Prevent page reload on form submit
    const payload = { name, email, password, mobileNumber, role };
    register(payload);
  };

  return (
    <form onSubmit={handleRegister}>
      <div className='container'>
        <div className='Register'>
          <div className="form-group">
            <h1>Register</h1>
            <label htmlFor="name">Name</label>
            <input
              type="text"
              className="form-control"
              id="name"
              placeholder="Enter username"
              onChange={(e) => setName(e.target.value)}
              value={name}
            />
            <label htmlFor="email">Email address</label>
            <input
              type="email"
              className="form-control"
              id="email"
              placeholder="Enter email"
              onChange={(e) => setEmail(e.target.value)}
              value={email}
            />
            <small id="emailHelp" className="form-text text-muted">
              We'll never share your email with anyone else.
            </small>
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              className="form-control"
              id="password"
              placeholder="Password"
              onChange={(e) => setPassword(e.target.value)}
              value={password}
            />
          </div>

          <div className="form-group">
            <label htmlFor="mobileNumber">Mobile Number</label>
            <input
              type="text"
              className="form-control"
              id="mobileNumber"
              placeholder="Enter Mobile Number"
              onChange={(e) => setMobileNumber(e.target.value)}
              value={mobileNumber}
            />
          </div>

          <div className="form-group">
            <label htmlFor="role">Role</label>
            <select
              className="form-control form-control-lg"
              id="role"
              value={role} // This ensures the select element is controlled
              onChange={(e) => setRole(e.target.value)}
            >
              <option value="admin">Admin</option>
              <option value="commonUser">Common User</option>
            </select>
          </div>

          <button type="submit" className="btn btn-primary">Submit</button>
        </div>
      </div>
    </form>
  );
};

export default Register;
