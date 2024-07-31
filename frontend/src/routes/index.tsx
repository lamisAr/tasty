import { Suspense, lazy, ElementType } from "react";
import { useRoutes } from "react-router-dom";

const Loadable = (Component: ElementType) =>
  function (props: any) {
    /* eslint-disable react/jsx-props-no-spreading */
    return (
      <Suspense>
        <Component {...props} />
      </Suspense>
    );
  };

const Login = Loadable(lazy(() => import("../pages/Login.tsx")));
const Register = Loadable(lazy(() => import("../pages/Register.tsx")));
const Home = Loadable(lazy(() => import("../pages/Home.tsx")));
const UserRecipes = Loadable(lazy(() => import("../pages/UserRecipes.tsx")));

export default function Router() {
  return useRoutes([
    {
      path: "login",
      element: <Login />,
    },
    {
      path: "register",
      element: <Register />,
    },
    {
      path: "home",
      element: <Home />,
    },
    {
      path: "",
      element: <Home />,
    },
    {
      path: "my-recipes",
      element: <UserRecipes />,
    },
  ]);
}
