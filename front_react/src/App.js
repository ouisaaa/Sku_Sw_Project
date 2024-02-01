import './App.css';

import Main from './component/Main';

import Login from'./component/Login';
import SignUp from './component/SignUp';
import Seller from './component/Seller';
import ProductDetail from './component/ProductDetail';
import Order from './component/Order';


import {HashRouter,Route,Routes,Navigate} from 'react-router-dom';
function App() {
  return (
   <HashRouter>
    <Routes>
      <Route exact path='/'element={<Navigate to="/main/all"/>}></Route>
      <Route path='/main/:category'element={<Main/>}>
      </Route>
      <Route path='/login'element={<Login/>}>
      </Route>
      <Route path='/signup'element={<SignUp/>}>
      </Route>
      <Route path='/seller'element={<Seller/>}>
      </Route>
      <Route path='/ProductDetail/:p_code'element={<ProductDetail/>}>
      </Route>
      <Route path='/Order/:m_code'element={<Order/>}>
      </Route>
      <Route path='/Order/:p_code'state='{ product: productBuy }'element={<Order/>}>
      </Route>
    </Routes>
   </HashRouter>
  );
}

export default App;
