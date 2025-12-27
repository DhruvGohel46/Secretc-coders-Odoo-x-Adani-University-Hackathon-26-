import React from 'react';
import { Droppable } from 'react-beautiful-dnd';
import { motion } from 'motion/react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import KanbanCard from './KanbanCard';
import './KanbanColumn.css';

const KanbanColumn = ({ column, index, searchTerm, onAddRequest, onViewRequest, onEditRequest, onDeleteRequest }) => {
  const filteredRequests = column.requests.filter(request =>
    request.subject?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    request.equipment?.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const columnVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        delay: index * 0.1,
        type: "spring",
        stiffness: 300
      }
    }
  };

  return (
    <motion.div
      className="kanban-column"
      variants={columnVariants}
      initial="hidden"
      animate="visible"
      whileHover={{ y: -5 }}
      transition={{ type: "spring", stiffness: 300 }}
    >
      <div className="column-header" style={{ borderTopColor: column.color }}>
        <div className="column-title">
          <motion.div
            className="column-color-indicator"
            style={{ backgroundColor: column.color }}
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
          <h3>{column.title}</h3>
          <motion.span 
            className="column-count"
            key={filteredRequests.length}
            initial={{ scale: 1.5 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 500 }}
          >
            {filteredRequests.length}
          </motion.span>
        </div>

        <motion.button
          className="add-card-btn"
          onClick={onAddRequest}
          whileHover={{ scale: 1.1, rotate: 90 }}
          whileTap={{ scale: 0.9 }}
          transition={{ type: "spring", stiffness: 400 }}
        >
          <FontAwesomeIcon icon={faPlus} />
        </motion.button>
      </div>

      <Droppable droppableId={column.id}>
        {(provided, snapshot) => (
          <motion.div
            className={`column-content ${snapshot.isDraggingOver ? 'dragging-over' : ''}`}
            ref={provided.innerRef}
            {...provided.droppableProps}
            animate={{
              backgroundColor: snapshot.isDraggingOver 
                ? 'rgba(59, 130, 246, 0.1)' 
                : 'transparent'
            }}
            transition={{ duration: 0.2 }}
          >
            {filteredRequests.map((request, index) => (
              <KanbanCard
                key={request.id}
                request={request}
                index={index}
                columnColor={column.color}
                onView={onViewRequest}
                onEdit={onEditRequest}
                onDelete={onDeleteRequest}
              />
            ))}
            {provided.placeholder}

            {filteredRequests.length === 0 && (
              <motion.div
                className="empty-column"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                <p>No requests</p>
              </motion.div>
            )}
          </motion.div>
        )}
      </Droppable>
    </motion.div>
  );
};

export default KanbanColumn;
