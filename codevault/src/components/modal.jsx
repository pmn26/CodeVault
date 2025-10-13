import React from "react";
import "../assets/modal.css"; // We'll create this next

const Modal = ({ isOpen, onClose, children }) => {
if (!isOpen) return null; // Don't render if not open

return (
    <div className="modal-overlay" onClick={onClose}>
    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="close-btn" onClick={onClose}>×</button>
        {children}
    </div>
    </div>
);
};

export default Modal;
