import React from 'react';
import ReactDOM from 'react-dom';
import Loader from  './index'
type PageLoaderProps = {
  isLoading: boolean;
};

const PageLoader: React.FC<PageLoaderProps> = ({ isLoading }) => {
  if (!isLoading) return null;

  return ReactDOM.createPortal(
      <div className="page-loader-overlay">
          <Loader />

      {/* <div className="page_spinner" /> */}
    </div>,
    document.body
  );
};

export default PageLoader;
