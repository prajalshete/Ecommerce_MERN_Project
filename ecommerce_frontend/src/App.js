

import {BrowserRouter, Routes, Route} from 'react-router-dom'
import Navbar from './Components/Navbar'
import Home from './Components/Home'
import Register from './Components/Register'
import Login from './Components/Login'
import Dashboard from './Components/Dashboard';
import { UserProvider } from './context/userContext';
import AddProduct from './Components/Products/AddProduct';
import ProductList from './Components/Products/ProductList';
import Cartpage from './Components/Cartpage';
import CheckoutPage from './Components/CheckoutPage';
import SuccessPage from './Components/SuccessPage';
import CancelPage from './Components/CancelPage';


import AddCategory from './Components/Category/AddCategory';
import ProductUpdateForm from './Components/Products/ProductUpdateForm';
import SearchPage from './Components/SearchPage';


function App() {
  return (
    <BrowserRouter>
    <UserProvider>
    <Navbar/>
   
    <Routes>
      <Route path='/' element={<Home />}></Route>

      <Route path='/register' element={<Register />}></Route>
      <Route path='/login' element={<Login />}></Route>
      {/* <Route path='/dashboard' element={<Dashboard />}></Route> */}
      <Route path='/addproduct' element={<AddProduct />}></Route>
      <Route path='/productList' element={<ProductList />}></Route>
      <Route path="/cartpage" element={<Cartpage />} />
      <Route path="/checkout" element={<CheckoutPage />} />
                <Route path="/success" element={<SuccessPage />} />
                <Route path="/cancel" element={<CancelPage />} />
      <Route path='/addcategory' element={<AddCategory />}></Route>
      <Route path="/update-product/:id" element={<ProductUpdateForm />} />
      <Route path="/search" element={<SearchPage />} /> {/* Add this */}
    </Routes>
   </UserProvider>

    </BrowserRouter>
  );
}

export default App;
