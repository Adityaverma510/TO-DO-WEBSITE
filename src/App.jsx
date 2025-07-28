import {RouterProvider, createBrowserRouter} from 'react-router-dom';
import { ErrorPage } from './pages/ErrorPage';
import { AppLayout } from './components/Layout/AppLayout';
import Home from './pages/Today';
import { Calendar } from './pages/Calendar';
import { Upcoming } from './pages/Upcoming';
import StickyWall from './pages/StickyWall';


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
      {
        path: "calendar",
        element: <Calendar />,
      },
      {
        path: "upcoming",
        element: <Upcoming />,
      },
      {
        path: "sticky-wall",
        element: <StickyWall />,
      },
    ]
  }
]);

const App = () => {
  return <RouterProvider router={router} />;
};

export default App;
