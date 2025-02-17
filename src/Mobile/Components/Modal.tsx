import React, { ReactNode } from "react";

interface ModalProps {
  isOpen: boolean;
  children: ReactNode;
}

const Modal: React.FC<ModalProps> = ({ isOpen, children }) => {
  if (!isOpen) {
    return null;
  }

  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-50 z-50"></div>
      <div className="fixed inset-0 flex items-center justify-center z-50">
        <div className="bg-white p-4 rounded-lg shadow-md">
          <div className="">{children}</div>
        </div>
      </div>
    </>
  );
};

export default Modal;
