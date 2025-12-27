import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faPlus, 
  faSearch, 
  faFilter,
  faTable,
  faThLarge
} from '@fortawesome/free-solid-svg-icons';
import { getAllEquipment, deleteEquipment } from '../../services/api';
import { toast } from 'react-toastify';
import EquipmentCard from './EquipmentCard';
import EquipmentForm from './EquipmentForm';
import Modal from '../Common/Modal';
import Button from '../Common/Button';
import './EquipmentList.css';

const EquipmentList = () => {
  const [equipment, setEquipment] = useState([]);
  const [filteredEquipment, setFilteredEquipment] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState('grid');
  const [showModal, setShowModal] = useState(false);
  const [selectedEquipment, setSelectedEquipment] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchEquipment();
  }, []);

  useEffect(() => {
    const filtered = equipment.filter(item =>
      item.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.serialNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.department?.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredEquipment(filtered);
  }, [searchTerm, equipment]);

  const fetchEquipment = async () => {
    try {
      setLoading(true);
      const response = await getAllEquipment();
      setEquipment(response.data);
      setFilteredEquipment(response.data);
      toast.success('Equipment loaded successfully');
    } catch (error) {
      console.error('Error fetching equipment:', error);
      toast.error('Failed to load equipment');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this equipment?')) {
      try {
        await deleteEquipment(id);
        toast.success('Equipment deleted successfully');
        fetchEquipment();
      } catch (error) {
        console.error('Error deleting equipment:', error);
        toast.error('Failed to delete equipment');
      }
    }
  };

  const handleEdit = (item) => {
    setSelectedEquipment(item);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedEquipment(null);
    fetchEquipment();
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  return (
    <div className="equipment-list">
      <motion.div 
        className="equipment-header"
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
      >
        <div className="equipment-header-left">
          <h1>Equipment Management</h1>
          <p>Track and manage all company assets</p>
        </div>

        <div className="equipment-header-actions">
          <motion.div 
            className="search-box"
            whileFocus={{ scale: 1.02 }}
          >
            <FontAwesomeIcon icon={faSearch} />
            <input
              type="text"
              placeholder="Search equipment..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </motion.div>

          <div className="view-toggle">
            <motion.button
              className={viewMode === 'grid' ? 'active' : ''}
              onClick={() => setViewMode('grid')}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              <FontAwesomeIcon icon={faThLarge} />
            </motion.button>
            <motion.button
              className={viewMode === 'table' ? 'active' : ''}
              onClick={() => setViewMode('table')}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              <FontAwesomeIcon icon={faTable} />
            </motion.button>
          </div>

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
            onClick={() => setShowModal(true)}
          >
            Add Equipment
          </Button>
        </div>
      </motion.div>

      {loading ? (
        <motion.div 
          className="equipment-loading"
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
        <motion.div
          className={`equipment-container ${viewMode}`}
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <AnimatePresence mode="popLayout">
            {filteredEquipment.map((item, index) => (
              <EquipmentCard
                key={item.id}
                equipment={item}
                index={index}
                onEdit={handleEdit}
                onDelete={handleDelete}
                viewMode={viewMode}
              />
            ))}
          </AnimatePresence>

          {filteredEquipment.length === 0 && (
            <motion.div
              className="empty-state"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
            >
              <p>No equipment found</p>
            </motion.div>
          )}
        </motion.div>
      )}

      <AnimatePresence>
        {showModal && (
          <Modal
            title={selectedEquipment ? 'Edit Equipment' : 'Add New Equipment'}
            onClose={handleCloseModal}
          >
            <EquipmentForm
              equipment={selectedEquipment}
              onClose={handleCloseModal}
            />
          </Modal>
        )}
      </AnimatePresence>
    </div>
  );
};

export default EquipmentList;
