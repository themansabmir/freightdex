import { RouterProvider } from "react-router-dom";
import "./_app.scss";
import { browserRouterRoutes } from "./router/BROWSER_ROUTER";
export function App() {
  return (
    <RouterProvider
      router={browserRouterRoutes}
    />
  );
}

export default App;
