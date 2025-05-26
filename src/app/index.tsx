import { RouterProvider } from "react-router-dom";
import "./_app.scss";
import { browserRouterRoutes } from "./router/BROWSER_ROUTER";
import { useOnline } from "@shared/hooks/useOnline";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export function App() {
  const { isOnline } = useOnline();

  return (
    <>
      <ToastContainer
        position='bottom-center'
        autoClose={2000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        pauseOnFocusLoss
        draggable
        style={{ zIndex: 100000 }}
        pauseOnHover
        theme='dark' // or "dark"
      />
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
