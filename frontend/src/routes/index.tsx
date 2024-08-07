import { Suspense, lazy, ElementType } from "react";
import { useRoutes } from "react-router-dom";

const Loadable = (Component: ElementType) =>
  function load(props: any) {
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
const Favorites = Loadable(lazy(() => import("../pages/Favorites.tsx")));
const Profile = Loadable(lazy(() => import("../pages/Profile.tsx")));
const Recipe = Loadable(lazy(() => import("../pages/Recipe.tsx")));

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
    {
      path: "favorites",
      element: <Favorites />,
    },
    {
      path: "profile",
      element: <Profile />,
    },
    {
      path: "recipes/:recipeId",
      element: <Recipe />,
    },
  ]);
}
