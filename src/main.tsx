import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Root from "./routes/root";
import NotFound from "./pages/NotFound";
import { RoutePath } from "./enum/routes";
import Users from "./pages/Users";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Banners from "./pages/Banners";
import Roles from "./pages/Roles";
import Articles from "./pages/Articles";

const App = () => {
  const queryClient = new QueryClient();

  return (
    <React.StrictMode>
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
      </QueryClientProvider>
    </React.StrictMode>
  );
};

const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    errorElement: <NotFound />,
    children: [
      {
        path: RoutePath.BANNERS,
        element: <Banners />,
      },
      {
        path: RoutePath.USERS,
        element: <Users />,
      },
      {
        path: RoutePath.ROLES,
        element: <Roles />,
      },
      {
        path: RoutePath.ARTICLES,
        element: <Articles />,
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")!).render(<App />);
