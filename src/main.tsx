import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Root from "./routes/root";
import NotFound from "./pages/NotFound";
import Questions from "./pages/Questions";
import { RoutePath } from "./enum/routes";
import Tests from "./pages/Tests";
import Subjects from "./pages/Subjects";
import Users from "./pages/Users";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import TestsOfSubject from "./pages/Tests/TestsOfSubject";
import TestDetail from "./pages/Tests/Detail";
import UpdateTest from "./pages/Tests/Update";
import SubjectQuestions from "./pages/Subjects/Questions";

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
        path: RoutePath.QUESTIONS,
        element: <Questions />,
      },
      {
        path: RoutePath.SUBJECTS,
        element: <Subjects />,
      },
      {
        path: RoutePath.SUBJECT_QUESTIONS,
        element: <SubjectQuestions />,
      },
      {
        path: RoutePath.TESTS,
        element: <Tests />,
      },
      {
        path: RoutePath.USERS,
        element: <Users />,
      },
      {
        path: RoutePath.SUBJECTS_TESTS,
        element: <TestsOfSubject />,
      },
      {
        path: RoutePath.DETAIL_TEST,
        element: <TestDetail />,
      },
      {
        path: RoutePath.UPDATE_TEST,
        element: <UpdateTest />,
      },
      {
        path: RoutePath.CREATE_TEST,
        element: <UpdateTest />,
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")!).render(<App />);
