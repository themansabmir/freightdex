import { ReactNode } from "react";
import Sidebar from "./sidebar";
import { BellRing } from "lucide-react";

const Layout = ({ children }: { children: ReactNode }) => {
  return (
    <div className='body'>
      <Sidebar />
      <div className='main-content'>
        <div className='header'>
          <div>
            <BellRing fill='none' />
          </div>
        </div>
        <main className='page-content'>
          <div className='mr-8 mb-8'>{children}</div>
        </main>
      </div>
    </div>
  );
};

export default Layout;
