import { Suspense, lazy, ElementType, useEffect } from "react";
import { useRoutes } from "react-router-dom";

const Loadable = (Component: ElementType) => (props: any) =>
  (
    <Suspense>
      <Component {...props} />
    </Suspense>
  );

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
const Login = Loadable(lazy(() => import("../pages/Login")));
const Register = Loadable(lazy(() => import("../pages/Register")));
const Home = Loadable(lazy(() => import("../pages/Home")));
const UserRecipes = Loadable(lazy(() => import("../pages/UserRecipes")));
