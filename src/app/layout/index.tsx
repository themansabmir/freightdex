import  { ReactNode } from 'react'
import Sidebar from './sidebar';
import { BellRing } from 'lucide-react';

const Layout = ({ children }: { children: ReactNode }) => {
  return (
    <div className="body">
      <Sidebar />
      <div className="main-content">
        <div className="header">
          <div>
            <BellRing fill="none" />
          </div>
        </div>
        <main className="page-content">{children}</main>
      </div>
    </div>
  );
};


export default Layout