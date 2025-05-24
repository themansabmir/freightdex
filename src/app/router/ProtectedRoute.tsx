import { useAuth } from '@modules/auth/hooks/useAuth';
import { ReactNode } from 'react';
import Layout from '../layout';
import SignIn from '@modules/auth/components/Signin';
import Loader from '@shared/components/Loader';

const ProtectedRoute = ({ children }: { children: ReactNode }) => {
  const { user, refresh } = useAuth();
  if (refresh)
    return (
      <div style={{ minHeight: '100vh', width: '100vw', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <Loader />;
      </div>
    );

  if (!user && refresh === false) return <SignIn></SignIn>;

  return <Layout>{children}</Layout>;
};

export default ProtectedRoute;
