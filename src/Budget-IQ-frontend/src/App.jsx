// import { useState } from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { Budget_IQ_backend } from 'declarations/Budget-IQ-backend';
import Dasboard, { dashboardAction, dashboardLoader } from './pages/Dasboard';
import Error from './pages/Error';
import Main, { mainLoader } from './layout/Main';
import { loggedoutAction } from './actions/logout';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


const router = createBrowserRouter([
  {
    path: "/",
    element:<Main/>,
    loader : mainLoader,
    errorElement:<Error />,
    children:[
      {
        path: "/",
        element:<Dasboard/>,
        loader : dashboardLoader,
        action: dashboardAction,
        errorElement:<Error />
      },
      {
        path: "logout",
        action: loggedoutAction
      },
    ]
  },

])
function App() {
  return (
    <div className='App'>
      <RouterProvider router={router} />
      <ToastContainer/>
    </div>
  );
}

export default App;
