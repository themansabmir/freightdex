import React from 'react';

interface LoaderProps {
  message?: string;
  size?: 'sm' | 'md' | 'lg';
}

const Loader: React.FC<LoaderProps> = ({ message = 'Loading...', size = 'md' }) => {
  return (
    <div className="loader-container">
      <div className={`spinner ${size}`} />
      {message && <p className="loader-message">{message}</p>}
    </div>
  );
};

export default Loader;
