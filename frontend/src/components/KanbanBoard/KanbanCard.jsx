import React, { useState } from 'react';
import { Draggable } from 'react-beautiful-dnd';
import { motion, AnimatePresence } from 'motion/react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faClock, 
  faUser, 
  faExclamationCircle,
  faTools,
  faEllipsisV,
  faEdit,
  faTrash,
  faEye
} from '@fortawesome/free-solid-svg-icons';
import { format } from 'date-fns';
import './KanbanCard.css';

const KanbanCard = ({ request, index, columnColor, onEdit, onDelete, onView }) => {
  const [showActions, setShowActions] = useState(false);
  const isOverdue = request.isOverdue === true;

  const cardVariants = {
    hidden: { opacity: 0, scale: 0.8, y: 20 },
    visible: { 
      opacity: 1, 
      scale: 1, 
      y: 0,
      transition: {
        delay: index * 0.05,
        type: "spring",
        stiffness: 300
      }
    }
  };

  return (
    <Draggable draggableId={request.id.toString()} index={index}>
      {(provided, snapshot) => (
        <motion.div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className={`kanban-card ${snapshot.isDragging ? 'dragging' : ''} ${isOverdue ? 'overdue' : ''}`}
          variants={cardVariants}
          initial="hidden"
          animate="visible"
          whileHover={{ 
            scale: 1.02, 
            boxShadow: '0 8px 16px rgba(0,0,0,0.15)',
            y: -5
          }}
          transition={{ type: "spring", stiffness: 400 }}
          style={{
            ...provided.draggableProps.style,
            borderLeft: `4px solid ${columnColor}`
          }}
        >
          {isOverdue && (
            <motion.div 
              className="overdue-badge"
              initial={{ x: -100 }}
              animate={{ x: 0 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <FontAwesomeIcon icon={faExclamationCircle} />
              <span>Overdue</span>
            </motion.div>
          )}

          <div className="card-header">
            <motion.h4
              whileHover={{ x: 5 }}
              transition={{ type: "spring", stiffness: 400 }}
            >
              {request.subject}
            </motion.h4>

            <motion.button
              className="card-actions-btn"
              onClick={() => setShowActions(!showActions)}
              whileHover={{ scale: 1.2, rotate: 90 }}
              whileTap={{ scale: 0.9 }}
            >
              <FontAwesomeIcon icon={faEllipsisV} />
            </motion.button>
          </div>

          <AnimatePresence>
            {showActions && (
              <motion.div
                className="card-actions-menu"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                <motion.button onClick={() => onView?.(request)} whileHover={{ x: 5 }} whileTap={{ scale: 0.95 }}>
                  <FontAwesomeIcon icon={faEye} /> View
                </motion.button>
                <motion.button onClick={() => onEdit?.(request)} whileHover={{ x: 5 }} whileTap={{ scale: 0.95 }}>
                  <FontAwesomeIcon icon={faEdit} /> Edit
                </motion.button>
                <motion.button onClick={() => onDelete?.(request.id)} whileHover={{ x: 5 }} whileTap={{ scale: 0.95 }} className="delete">
                  <FontAwesomeIcon icon={faTrash} /> Delete
                </motion.button>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="card-body">
            <motion.div 
              className="card-info-row"
              whileHover={{ x: 3 }}
            >
              <FontAwesomeIcon icon={faTools} className="info-icon" />
              <span className="equipment-name">{request.equipment?.name || 'N/A'}</span>
            </motion.div>

            {request.scheduledDate && (
              <motion.div 
                className="card-info-row"
                whileHover={{ x: 3 }}
              >
                <FontAwesomeIcon icon={faClock} className="info-icon" />
                <span>{format(new Date(request.scheduledDate), 'MMM dd, yyyy')}</span>
              </motion.div>
            )}

            {request.technician && (
              <motion.div 
                className="card-technician"
                whileHover={{ scale: 1.05 }}
              >
                <motion.div 
                  className="tech-avatar"
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.5 }}
                >
                  <FontAwesomeIcon icon={faUser} />
                </motion.div>
                <div className="tech-info">
                  <div className="tech-name">{request.technician.name}</div>
                  <div className="tech-role">Technician</div>
                </div>
              </motion.div>
            )}
          </div>

          <div className="card-footer">
            <motion.span 
              className="request-type"
              whileHover={{ scale: 1.1 }}
            >
              {request.type === 'PREVENTIVE' ? '📅' : '🔧'}
            </motion.span>

            {request.durationHours && (
              <motion.span 
                className="duration"
                whileHover={{ scale: 1.1 }}
              >
                <FontAwesomeIcon icon={faClock} /> {request.durationHours}h
              </motion.span>
            )}
          </div>

          {snapshot.isDragging && (
            <motion.div
              className="drag-indicator"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 500 }}
            />
          )}
        </motion.div>
      )}
    </Draggable>
  );
};

export default KanbanCard;
