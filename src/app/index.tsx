import { RouterProvider } from "react-router-dom";
import "./_app.scss";
import { browserRouterRoutes } from "./router/BROWSER_ROUTER";
import { useOnline } from "@shared/hooks/isOnline";

export function App() {
  const { isOnline } = useOnline();

  return (
    <>
      {!isOnline && (
        <div className='check_online font-sm'>
          Please check your internet connection and try again.
        </div>
      )}
      <RouterProvider router={browserRouterRoutes} />
    </>
  );
}

export default App;
