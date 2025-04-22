import { ReactNode } from "react";
import Layout from "../layout";

const ProtectedRoute = ({ children }: { children: ReactNode }) => {
  // const auth = useContext(AuthContext);
  //   if (!auth?.user) {
  //     return <Navigate to="/login" />
  //   }
  // const { } = useAuth
  return <Layout>{children}</Layout>;
};

export default ProtectedRoute;
