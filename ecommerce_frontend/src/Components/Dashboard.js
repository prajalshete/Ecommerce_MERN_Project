import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../context/userContext'; // Adjust the import path as necessary

const Dashboard = () => {
  const { user } = useContext(UserContext); // Assuming `user` will be null if not authenticated
  const navigate = useNavigate();

  // Check if user is not logged in
  if (!user) {
    // Redirect to login page
    // navigate('/login');
    alert("Login please");
    return null; // Render nothing while redirecting
  }
  else{
   
    navigate('/login');
  }

  return (
    <div>
      <h1>Welcome to the Dashboard, {user.username}!</h1>
      <p>Here is some exclusive content only visible to logged-in users.</p>
      {/* Add more dashboard content here */}
    </div>
  );
};

export default Dashboard;
