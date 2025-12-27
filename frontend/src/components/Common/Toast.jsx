import React from 'react';
import { motion } from 'motion/react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faCheckCircle, 
  faExclamationCircle, 
  faInfoCircle,
  faTimes 
} from '@fortawesome/free-solid-svg-icons';
import './Toast.css';

const Toast = ({ type = 'info', message, onClose }) => {
  const icons = {
    success: faCheckCircle,
    error: faExclamationCircle,
    info: faInfoCircle,
    warning: faExclamationCircle
  };

  const toastVariants = {
    hidden: { 
      opacity: 0, 
      x: 100,
      scale: 0.8
    },
    visible: { 
      opacity: 1, 
      x: 0,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 500,
        damping: 30
      }
    },
    exit: {
      opacity: 0,
      x: 100,
      scale: 0.8,
      transition: {
        duration: 0.2
      }
    }
  };

  return (
    <motion.div
      className={`toast toast-${type}`}
      variants={toastVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
    >
      <motion.div 
        className="toast-icon"
        animate={{ rotate: [0, 10, -10, 0] }}
        transition={{ duration: 0.5 }}
      >
        <FontAwesomeIcon icon={icons[type]} />
      </motion.div>

      <div className="toast-content">
        <p>{message}</p>
      </div>

      <motion.button
        className="toast-close"
        onClick={onClose}
        whileHover={{ scale: 1.2, rotate: 90 }}
        whileTap={{ scale: 0.9 }}
      >
        <FontAwesomeIcon icon={faTimes} />
      </motion.button>

      <motion.div
        className="toast-progress"
        initial={{ width: "100%" }}
        animate={{ width: "0%" }}
        transition={{ duration: 3, ease: "linear" }}
      />
    </motion.div>
  );
};

export default Toast;
