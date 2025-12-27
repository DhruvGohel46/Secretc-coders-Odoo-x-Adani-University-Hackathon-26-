import React, { useState } from 'react';
import { motion } from 'motion/react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faEdit, 
  faArchive,
  faTools,
  faCalendarAlt,
  faMapMarkerAlt,
  faBarcode,
  faWrench
} from '@fortawesome/free-solid-svg-icons';
import { format } from 'date-fns';
import { getEquipmentMaintenanceRequests } from '../../services/api';
import { toast } from 'react-toastify';
import './EquipmentCard.css';

const EquipmentCard = ({ equipment, index, onEdit, onArchive, viewMode }) => {
  const [maintenanceCount, setMaintenanceCount] = useState(equipment.maintenanceCount || 0);
  const [showTooltip, setShowTooltip] = useState(false);

  const handleMaintenanceClick = async () => {
    try {
      const response = await getEquipmentMaintenanceRequests(equipment.id);
      toast.info(`${response.data.length} maintenance requests found`);
    } catch (error) {
      console.error('Error fetching maintenance requests:', error);
      toast.error('Failed to fetch maintenance requests');
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, scale: 0.9, y: 20 },
    visible: { 
      opacity: 1, 
      scale: 1, 
      y: 0,
      transition: {
        delay: index * 0.05,
        type: "spring",
        stiffness: 300
      }
    },
    exit: { 
      opacity: 0, 
      scale: 0.9, 
      y: 20,
      transition: { duration: 0.2 }
    }
  };

  return (
    <motion.div
      className={`equipment-card ${viewMode}`}
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      whileHover={{ 
        y: -8, 
        boxShadow: '0 12px 24px rgba(0,0,0,0.15)',
        transition: { type: "spring", stiffness: 400 }
      }}
      layout
    >
      <div className="equipment-card-header">
        <motion.div 
          className="equipment-icon"
          whileHover={{ rotate: 360, scale: 1.2 }}
          transition={{ duration: 0.5 }}
        >
          <FontAwesomeIcon icon={faTools} />
        </motion.div>

        <div className="equipment-actions">
          <motion.button
            onClick={() => onEdit(equipment)}
            whileHover={{ scale: 1.2, rotate: 15 }}
            whileTap={{ scale: 0.9 }}
            className="edit-btn"
          >
            <FontAwesomeIcon icon={faEdit} />
          </motion.button>

          <motion.button
            onClick={() => onArchive(equipment.id, equipment.isArchived)}
            whileHover={{ scale: 1.2, rotate: -15 }}
            whileTap={{ scale: 0.9 }}
            className="archive-btn"
            title={equipment.isArchived ? 'Unarchive' : 'Archive'}
          >
            <FontAwesomeIcon icon={faArchive} />
          </motion.button>
        </div>
      </div>

      <motion.h3
        whileHover={{ x: 5 }}
        transition={{ type: "spring", stiffness: 400 }}
      >
        {equipment.name}
      </motion.h3>

      <div className="equipment-details">
        <motion.div 
          className="detail-row"
          whileHover={{ x: 3, backgroundColor: 'rgba(59, 130, 246, 0.05)' }}
        >
          <FontAwesomeIcon icon={faBarcode} />
          <span>Serial: {equipment.serialNumber}</span>
        </motion.div>

        <motion.div 
          className="detail-row"
          whileHover={{ x: 3, backgroundColor: 'rgba(59, 130, 246, 0.05)' }}
        >
          <FontAwesomeIcon icon={faMapMarkerAlt} />
          <span>Location: {equipment.location}</span>
        </motion.div>

        <motion.div 
          className="detail-row"
          whileHover={{ x: 3, backgroundColor: 'rgba(59, 130, 246, 0.05)' }}
        >
          <FontAwesomeIcon icon={faCalendarAlt} />
          <span>Purchased: {equipment.purchaseDate ? format(new Date(equipment.purchaseDate), 'MMM dd, yyyy') : 'N/A'}</span>
        </motion.div>
      </div>

      <div className="equipment-footer">
        <motion.span 
          className="department-badge"
          whileHover={{ scale: 1.1 }}
        >
          {equipment.department?.name || equipment.department || 'N/A'}
        </motion.span>

        <motion.button
          className="maintenance-btn"
          onClick={handleMaintenanceClick}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          onMouseEnter={() => setShowTooltip(true)}
          onMouseLeave={() => setShowTooltip(false)}
        >
          <FontAwesomeIcon icon={faWrench} />
          <motion.span 
            className="badge"
            key={maintenanceCount}
            initial={{ scale: 1.5 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 500 }}
          >
            {maintenanceCount}
          </motion.span>

          {showTooltip && (
            <motion.div
              className="tooltip"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
            >
              Maintenance Requests
            </motion.div>
          )}
        </motion.button>
      </div>

      <motion.div
        className="card-glow"
        initial={{ opacity: 0 }}
        whileHover={{ opacity: 0.3 }}
        transition={{ duration: 0.3 }}
      />
    </motion.div>
  );
};

export default EquipmentCard;
