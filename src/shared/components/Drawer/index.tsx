import React, { useEffect } from 'react';

interface DrawerProps {
  open: boolean;
  onClose: () => void;
  side?: 'left' | 'right' | 'bottom' | 'top';
  children: React.ReactNode;
}

const Drawer: React.FC<DrawerProps> = ({ open, onClose, side = 'right', children }) => {
  // Close drawer on ESC key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  return (
    <>
      <div className={`drawer-overlay ${open ? 'open' : ''}`} onClick={onClose} />
      <div className={`drawer ${side} ${open ? 'open' : ''}`}>
        <button className="drawer-close" onClick={onClose}>
          ✕
        </button>
        <div className="drawer-content">{children}</div>
      </div>
    </>
  );
};

export default Drawer;
