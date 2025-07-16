import ReactDOM from "react-dom";
import { useEffect } from "react";
import {
  FaCheckCircle,
  FaExclamationCircle,
  FaInfoCircle,
  FaExclamationTriangle,
} from "react-icons/fa";

export default function NotificationPopup({ message, type = "info", onClose }) {
  useEffect(() => {
    const timer = setTimeout(onClose, 2300);
    return () => clearTimeout(timer);
  }, [onClose]);

  const typeStyles = {
    success: {
      bg: "bg-green-500/90 shadow-green-100",
      icon: <FaCheckCircle className="text-white mr-2" />,
    },
    error: {
      bg: "bg-red-500/90 shadow-red-100",
      icon: <FaExclamationCircle className="text-white mr-2" />,
    },
    info: {
      bg: "bg-blue-500/90 shadow-blue-100",
      icon: <FaInfoCircle className="text-white mr-2" />,
    },
    warning: {
      bg: "bg-yellow-500/90 text-black shadow-yellow-100",
      icon: <FaExclamationTriangle className="text-black mr-2" />,
    },
  };

  const { bg, icon } = typeStyles[type] || typeStyles.info;

  return ReactDOM.createPortal(
    <div className="fixed top-8 left-1/2 z-50 transform -translate-x-1/2 -translate-y-1/2 animate-slide-in">
      <div
        className={`flex items-center px-4 py-3 rounded-lg shadow-lg ${bg} backdrop-blur-sm`}
      >
        {icon}
        <span className="text-sm font-medium">{message}</span>
      </div>
    </div>,
    document.body
  );
}
