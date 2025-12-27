import React from 'react';
import { motion } from 'motion/react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import './StatsCard.css';

const StatsCard = ({ title, value, icon, color, trend, index }) => {
  const cardVariants = {
    hidden: { y: 20, opacity: 0, scale: 0.9 },
    visible: { 
      y: 0, 
      opacity: 1, 
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 20
      }
    }
  };

  const iconVariants = {
    initial: { scale: 1, rotate: 0 },
    hover: { 
      scale: 1.2, 
      rotate: 360,
      transition: {
        type: "spring",
        stiffness: 300
      }
    }
  };

  return (
    <motion.div
      className="stats-card"
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      whileHover={{ 
        y: -10, 
        boxShadow: "0 20px 40px rgba(0,0,0,0.1)",
        transition: { type: "spring", stiffness: 400 }
      }}
      style={{ '--card-color': color }}
    >
      <div className="stats-card-content">
        <div className="stats-info">
          <motion.h3
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 + index * 0.1 }}
          >
            {title}
          </motion.h3>
          <motion.p 
            className="stats-value"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ 
              delay: 0.3 + index * 0.1,
              type: "spring",
              stiffness: 500
            }}
          >
            {value}
          </motion.p>
          <motion.span 
            className={`stats-trend ${trend.startsWith('+') ? 'positive' : 'negative'}`}
            initial={{ x: -10, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.4 + index * 0.1 }}
          >
            {trend} from last month
          </motion.span>
        </div>

        <motion.div 
          className="stats-icon"
          variants={iconVariants}
          initial="initial"
          whileHover="hover"
        >
          <FontAwesomeIcon icon={icon} />
        </motion.div>
      </div>

      <motion.div 
        className="stats-card-glow"
        initial={{ opacity: 0 }}
        whileHover={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      />
    </motion.div>
  );
};

export default StatsCard;
