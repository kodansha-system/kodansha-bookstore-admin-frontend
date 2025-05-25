import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Root from "./routes/root";
import NotFound from "./pages/NotFound";
import { RoutePath } from "./enum/routes";
import Users from "./pages/Users";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Roles from "./pages/Roles";
import Articles from "./pages/Articles";
import Reviews from "./pages/Reviews";
import Orders from "./pages/Orders";
import OrderDetailPage from "./pages/Orders/OrderDetailPage";
import FlashSales from "./pages/FlashSale";
import CreateNewFlashSalePage from "./pages/FlashSale/CreateFlashSale";
import EditFlashSalePage from "./pages/FlashSale/EditFlashSale";
import StatisticsOverview from "./pages/Statistics";
import LoginPage from "./pages/Login";
import Books from "./pages/Books";
import Categories from "./pages/Categories";
import Vouchers from "./pages/Vouchers";
import Shops from "./pages/Shops";
import EditShopBooksPage from "./pages/ShopBooks/components/EditShopBooks";
import Staffs from "./pages/Staffs";

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
    path: "/login",
    element: <LoginPage />,
  },
  {
    path: "/",
    element: <Root />,
    errorElement: <NotFound />,
    children: [
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
      {
        path: RoutePath.BOOKS,
        element: <Books />,
      },
      {
        path: RoutePath.REVIEWS,
        element: <Reviews />,
      },
      {
        path: RoutePath.ORDERS,
        element: <Orders />,
      },
      {
        path: RoutePath.ORDERS + "/:id",
        element: <OrderDetailPage />,
      },
      {
        path: RoutePath.FLASH_SALES,
        element: <FlashSales />,
      },
      {
        path: RoutePath.FLASH_SALES + "/create",
        element: <CreateNewFlashSalePage />,
      },
      {
        path: RoutePath.FLASH_SALES + "/edit/:id",
        element: <EditFlashSalePage />,
      },
      {
        path: RoutePath.STATISTICS,
        element: <StatisticsOverview />,
      },
      {
        path: RoutePath.CATEGORIES,
        element: <Categories />,
      },
      {
        path: RoutePath.VOUCHERS,
        element: <Vouchers />,
      },
      {
        path: RoutePath.SHOPS,
        element: <Shops />,
      },
      {
        path: `${RoutePath.SHOPS}/:id`,
        element: <EditShopBooksPage />,
      },
      {
        path: RoutePath.STAFFS,
        element: <Staffs />,
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")!).render(<App />);
