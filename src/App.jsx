import {RouterProvider, createBrowserRouter} from 'react-router-dom';
import { ErrorPage } from './pages/ErrorPage';
import { AppLayout } from './components/Layout/AppLayout';
import Home from './pages/Today';


const router = createBrowserRouter([
  {
    path: "/",
    element: <AppLayout />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: "today",
        element: <Home />,
      },
    ]
  }
]);

const App = () => {
  return <RouterProvider router={router} />;
};

export default App;
