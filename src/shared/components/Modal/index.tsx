import React, { useEffect, useRef } from "react";

const Modal = ({ isOpen, onClose, children, size = "md" }) => {
  const modalRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        onClose?.();
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div>
      <div ref={modalRef}>{children}</div>
    </div>
  );
};

Modal.Header = ({ children }) => (
  <div >{children}</div>
);

Modal.Body = ({ children }) => (
  <div>{children}</div>
);

Modal.Footer = ({ children }) => (
  <div>{children}</div>
);

export default Modal;
