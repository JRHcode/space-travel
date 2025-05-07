import { createBrowserRouter, RouterProvider, useRouteError } from "react-router-dom"; 
import Root from "./routes/Root";
import HomePage from "./pages/HomePage";
import SpacecraftsPage from "./pages/SpacecraftsPage";
import SpacecraftPage from "./pages/SpacecraftPage";
import SpacecraftConstructionPage from "./pages/SpacecraftConstructionPage";
import PlanetsPage from "./pages/PlanetsPage";
import styles from "./App.module.css";

function ErrorBoundary() {
  const error = useRouteError();
  console.error(error);
  return (
    <div className="error-page">
      <h1>Oops!</h1>
      <p>Sorry, an unexpected error has occurred.</p>
      <p>
        <i>{error.statusText || error.message}</i>
      </p>
    </div>
  );
}

const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    errorElement: <ErrorBoundary />,
    children: [
      {
        index: true,
        element: <HomePage />,
      },
      {
        path: "spacecrafts",
        element: <SpacecraftsPage />,
      },
      {
        path: "spacecrafts/:id",
        element: <SpacecraftPage />,
      },
      {
        path: "spacecrafts/build",
        element: <SpacecraftConstructionPage />,
      },
      {
        path: "planets",
        element: <PlanetsPage />,
      },
    ],
  },
]);

function App() {
  return (
    <div className={styles.app}>
      <RouterProvider router={router} />
    </div>
  );
}

export default App;