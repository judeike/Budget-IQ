// import { useState } from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { Budget_IQ_backend } from 'declarations/Budget-IQ-backend';
import Dasboard, { dashboardAction, dashboardLoader } from './pages/Dasboard';
import Error from './pages/Error';
import Main, { mainLoader } from './layout/Main';
import { logoutAction } from './actions/logout';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ExpensesPage, { expensesLoader } from './pages/ExpensesPage';


const router = createBrowserRouter([
  {
    path: "/",
    element:<Main/>,
    loader : mainLoader,
    errorElement:<Error />,
    children:[
      {
        index: true,
        element:<Dasboard/>,
        loader : dashboardLoader,
        action: dashboardAction,
        errorElement:<Error />
      },
      {
        path: "expenses",
        element:<ExpensesPage/>,
        loader : expensesLoader,
      },
      {
        path: "logout",
        action: logoutAction
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
