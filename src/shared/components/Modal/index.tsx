import React, { ReactNode } from "react";
import classNames from "classnames";

type ModalSize = "sm" | "md" | "lg";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  allowDismiss?: boolean ,
  size?: ModalSize;
  children: ReactNode;
  className?: string;
}

interface ModalSubComponentProps {
  children: ReactNode;
  className?: string;
}

const ModalHeader: React.FC<ModalSubComponentProps> = ({
  children,
  className,
}) => <div className={classNames("modal__header", className)}>{children}</div>;

const ModalBody: React.FC<ModalSubComponentProps> = ({
  children,
  className,
}) => <div className={classNames("modal__body", className)}>{children}</div>;

const ModalFooter: React.FC<ModalSubComponentProps> = ({
  children,
  className,
}) => <div className={classNames("modal__footer", className)}>{children}</div>;

export const Modal: React.FC<ModalProps> & {
  Header: typeof ModalHeader;
  Body: typeof ModalBody;
  Footer: typeof ModalFooter;
} = ({ isOpen, onClose, size = "md", children, className , allowDismiss= true}) => {
  if (!isOpen) return null;

  return (
    <div className='modal__overlay' onClick={() => {
      if (allowDismiss===false) return
      console.log(allowDismiss)
      onClose()
    }}>
      <div
        className={classNames("modal", `modal--${size}`, className)}
        onClick={(e) => {
          e.stopPropagation()
        }}
      >
        {children}
      </div>
    </div>
  );
};

Modal.Header = ModalHeader;
Modal.Body = ModalBody;
Modal.Footer = ModalFooter;
