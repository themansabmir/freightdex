import { RouterProvider } from "react-router-dom";
import "./_app.scss";
import { browserRouterRoutes } from "./router/BROWSER_ROUTER";
import { useOnline } from "@shared/hooks/isOnline";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export function App() {
  const { isOnline } = useOnline();

  return (
    <>
      <ToastContainer
        position='bottom-center'
        autoClose={4000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        pauseOnFocusLoss
        draggable
        style={{ zIndex: 100000 }}
        pauseOnHover
        theme='colored' // or "dark"
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
