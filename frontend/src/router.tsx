import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import ErrorPage from './error-page'
import Home, { loader as homeLoader } from './routes/home'
import Login from './routes/login'
import { Profile } from './routes/profile'
import Register from './routes/register'
import Root from './routes/root'

import SSOLogin, { loader as ssoLoader } from './routes/sso.login'
import Users, { loader as usersLoader } from './routes/users'
import { useState } from 'react'

const AppRouter = () => {
  const [pRoute, setRoute] = useState<string>('/'); // control the internal routing of profile

  const profileRouteHandler = (url: string) => {
    setRoute(url);
  };

  console.log(pRoute)

  const routes = [
    {
      path: '/',
      element: <Root />,
      errorElement: <ErrorPage />,
      children: [
        { index: true, element: <Home />, loader: homeLoader },
        {
          path: 'sso-login-callback',
          element: <SSOLogin />,
          loader: ssoLoader,
        },
        {
          path: 'profile',
          element: (
            <Profile routeHandler={profileRouteHandler} pRoute={pRoute} />
          ),
        },
        {
          path: 'login',
          element: <Login />,
        },
        {
          path: 'register',
          element: <Register />,
        },
        {
          path: 'users',
          element: <Users />,
          loader: usersLoader,
        },
      ],
    },
  ];

  const router = createBrowserRouter(routes);

  return <RouterProvider router={router} />;
};

export default AppRouter;
