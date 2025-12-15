import React from "react";
import ReactDOM from "react-dom";
import "../assets/modal.css";

const Modal = ({ isOpen, onClose, children }) => {
if (!isOpen) return null;

return ReactDOM.createPortal(
    <div className="modal-overlay" onClick={onClose}>
    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="close-btn" onClick={onClose}>×</button>
        {children}
    </div>
    </div>,
    document.getElementById("modal-root")
);
};

export default Modal;
