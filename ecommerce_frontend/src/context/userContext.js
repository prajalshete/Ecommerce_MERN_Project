import React, { createContext, useContext, useState } from 'react';


//user
export const UserContext = createContext();
export const useUserContext = () => useContext(UserContext);








// export const useUser = () => useContext(UserContext);
export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null); // Initial state or fetch user data

  return (
    <UserContext.Provider value={{ user, setUser }}>
     
      {children}
     
    </UserContext.Provider>
  );
};



 


  
   
 

// export default UserContext;

