import React, { useState, useEffect } from 'react';
import { DragDropContext } from 'react-beautiful-dnd';
import { motion } from 'motion/react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faFilter, faSearch } from '@fortawesome/free-solid-svg-icons';
import { getRequestsByStage, updateRequestStage } from '../../services/api';
import { toast } from 'react-toastify';
import KanbanColumn from './KanbanColumn';
import Button from '../Common/Button';
import Modal from '../Common/Modal';
import './KanbanBoard.css';

const KanbanBoard = () => {
  const [columns, setColumns] = useState({
    new: { id: 'new', title: 'New', color: '#3b82f6', requests: [] },
    inProgress: { id: 'inProgress', title: 'In Progress', color: '#f59e0b', requests: [] },
    repaired: { id: 'repaired', title: 'Repaired', color: '#10b981', requests: [] },
    scrap: { id: 'scrap', title: 'Scrap', color: '#ef4444', requests: [] }
  });

  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetchKanbanData();
  }, []);

  const fetchKanbanData = async () => {
    try {
      setLoading(true);
      const response = await getRequestsByStage();
      const allRequests = response.data;

      // Group requests by status
      const statusMap = {
        new: 'NEW',
        inProgress: 'IN_PROGRESS',
        repaired: 'REPAIRED',
        scrap: 'SCRAP'
      };

      const groupedData = {
        new: allRequests.filter(r => r.status === statusMap.new),
        inProgress: allRequests.filter(r => r.status === statusMap.inProgress),
        repaired: allRequests.filter(r => r.status === statusMap.repaired),
        scrap: allRequests.filter(r => r.status === statusMap.scrap)
      };

      setColumns(prev => ({
        new: { ...prev.new, requests: groupedData.new },
        inProgress: { ...prev.inProgress, requests: groupedData.inProgress },
        repaired: { ...prev.repaired, requests: groupedData.repaired },
        scrap: { ...prev.scrap, requests: groupedData.scrap }
      }));

      toast.success('Kanban board updated');
    } catch (error) {
      console.error('Error fetching kanban data:', error);
      toast.error('Failed to load kanban board');
    } finally {
      setLoading(false);
    }
  };

  const handleDragEnd = async (result) => {
    const { source, destination, draggableId } = result;

    if (!destination) return;
    if (source.droppableId === destination.droppableId && source.index === destination.index) return;

    const sourceColumn = columns[source.droppableId];
    const destColumn = columns[destination.droppableId];
    const sourceRequests = Array.from(sourceColumn.requests);
    const destRequests = source.droppableId === destination.droppableId 
      ? sourceRequests 
      : Array.from(destColumn.requests);

    const [movedRequest] = sourceRequests.splice(source.index, 1);
    destRequests.splice(destination.index, 0, movedRequest);

    setColumns({
      ...columns,
      [source.droppableId]: { ...sourceColumn, requests: sourceRequests },
      [destination.droppableId]: { ...destColumn, requests: destRequests }
    });

    try {
      // Convert status ID to proper backend status value
      const statusMap = {
        new: 'NEW',
        inProgress: 'IN_PROGRESS',
        repaired: 'REPAIRED',
        scrap: 'SCRAP'
      };
      const backendStatus = statusMap[destination.droppableId];
      
      await updateRequestStage(draggableId, backendStatus);
      toast.success(`Request moved to ${destColumn.title}`, {
        position: "bottom-right",
        autoClose: 2000,
      });
    } catch (error) {
      console.error('Error updating request stage:', error);
      toast.error('Failed to update request');
      fetchKanbanData();
    }
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  return (
    <div className="kanban-board">
      <motion.div 
        className="kanban-header"
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
      >
        <div className="kanban-header-left">
          <h1>Maintenance Requests</h1>
          <p>Drag and drop to update request status</p>
        </div>

        <div className="kanban-header-actions">
          <motion.div 
            className="search-box"
            whileFocus={{ scale: 1.02 }}
          >
            <FontAwesomeIcon icon={faSearch} />
            <input
              type="text"
              placeholder="Search requests..."
              value={searchTerm}
              onChange={handleSearch}
            />
          </motion.div>

          <Button
            icon={faFilter}
            variant="secondary"
            onClick={() => toast.info('Filter feature coming soon')}
          >
            Filter
          </Button>

          <Button
            icon={faPlus}
            variant="primary"
            onClick={() => toast.info('Request form integration coming soon')}
          >
            New Request
          </Button>
        </div>
      </motion.div>

      {loading ? (
        <motion.div 
          className="kanban-loading"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          >
            Loading...
          </motion.div>
        </motion.div>
      ) : (
        <DragDropContext onDragEnd={handleDragEnd}>
          <motion.div 
            className="kanban-columns"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            {Object.values(columns).map((column, index) => (
              <KanbanColumn
                key={column.id}
                column={column}
                index={index}
                searchTerm={searchTerm}
              />
            ))}
          </motion.div>
        </DragDropContext>
      )}

    </div>
  );
};

export default KanbanBoard;
