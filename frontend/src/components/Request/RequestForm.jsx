import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSave, faTimes, faTools, faCalendarAlt } from '@fortawesome/free-solid-svg-icons';
import { createRequest, getAllEquipment } from '../../services/api';
import { toast } from 'react-toastify';
import Button from '../Common/Button';
import './RequestForm.css';

const RequestForm = ({ onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    type: 'CORRECTIVE',
    subject: '',
    equipmentId: '',
    scheduledDate: ''
  });

  const [equipment, setEquipment] = useState([]);
  const [filteredEquipment, setFilteredEquipment] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [selectedEquipmentInfo, setSelectedEquipmentInfo] = useState(null);

  useEffect(() => {
    fetchEquipment();
  }, []);

  useEffect(() => {
    const filtered = equipment.filter(eq =>
      eq.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      eq.serialNumber?.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredEquipment(filtered);
  }, [searchTerm, equipment]);

  const fetchEquipment = async () => {
    try {
      const response = await getAllEquipment();
      setEquipment(response.data);
    } catch (error) {
      console.error('Error fetching equipment:', error);
      toast.error('Failed to load equipment');
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleEquipmentSelect = (equipmentId) => {
    const selected = equipment.find(eq => eq.id === equipmentId);
    setFormData(prev => ({ ...prev, equipmentId }));
    setSelectedEquipmentInfo(selected);
    setSearchTerm(selected?.name || '');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.subject.trim()) {
      toast.error('Please enter a request subject');
      return;
    }

    if (!formData.equipmentId) {
      toast.error('Please select equipment');
      return;
    }

    if (formData.type === 'PREVENTIVE' && !formData.scheduledDate) {
      toast.error('Please select a scheduled date for preventive maintenance');
      return;
    }

    setLoading(true);

    try {
      const payload = {
        type: formData.type,
        subject: formData.subject,
        equipmentId: parseInt(formData.equipmentId)
      };

      if (formData.type === 'PREVENTIVE') {
        payload.scheduledDate = formData.scheduledDate;
      }

      await createRequest(payload);
      toast.success('Maintenance request created successfully');
      onSuccess?.();
      onClose();
    } catch (error) {
      console.error('Error creating request:', error);
      toast.error(error.response?.data?.error || 'Failed to create request');
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      className="request-form-overlay"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.form
        className="request-form"
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
        onClick={e => e.stopPropagation()}
        onSubmit={handleSubmit}
      >
        <div className="form-header">
          <h2>Create Maintenance Request</h2>
          <button
            type="button"
            className="close-btn"
            onClick={onClose}
          >
            <FontAwesomeIcon icon={faTimes} />
          </button>
        </div>

        <div className="form-content">
          {/* Request Type */}
          <motion.div className="form-group" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
            <label htmlFor="type">Request Type *</label>
            <div className="type-selector">
              <button
                type="button"
                className={`type-btn ${formData.type === 'CORRECTIVE' ? 'active' : ''}`}
                onClick={() => setFormData(prev => ({ ...prev, type: 'CORRECTIVE' }))}
              >
                <span>🔧</span>
                <span>Corrective</span>
                <small>Fix broken equipment</small>
              </button>
              <button
                type="button"
                className={`type-btn ${formData.type === 'PREVENTIVE' ? 'active' : ''}`}
                onClick={() => setFormData(prev => ({ ...prev, type: 'PREVENTIVE' }))}
              >
                <span>📅</span>
                <span>Preventive</span>
                <small>Scheduled maintenance</small>
              </button>
            </div>
          </motion.div>

          {/* Equipment Selection */}
          <motion.div className="form-group" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            <label htmlFor="equipment">Equipment *</label>
            <div className="equipment-selector">
              <input
                type="text"
                placeholder="Search equipment by name or serial number..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="equipment-search"
              />
              {searchTerm && filteredEquipment.length > 0 && (
                <motion.div
                  className="equipment-dropdown"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  {filteredEquipment.slice(0, 5).map(eq => (
                    <motion.div
                      key={eq.id}
                      className="equipment-option"
                      onClick={() => handleEquipmentSelect(eq.id)}
                      whileHover={{ backgroundColor: '#f3f4f6' }}
                    >
                      <div className="equipment-info">
                        <div className="equipment-name">{eq.name}</div>
                        <div className="equipment-meta">
                          {eq.serialNumber && <span>{eq.serialNumber}</span>}
                          {eq.category && <span>{eq.category}</span>}
                        </div>
                      </div>
                      <FontAwesomeIcon icon={faTools} className="equipment-icon" />
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </div>
            {selectedEquipmentInfo && (
              <motion.div
                className="selected-equipment"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
              >
                <div className="equipment-badge">
                  <FontAwesomeIcon icon={faTools} />
                  <span>{selectedEquipmentInfo.name}</span>
                  <button
                    type="button"
                    onClick={() => {
                      setFormData(prev => ({ ...prev, equipmentId: '' }));
                      setSelectedEquipmentInfo(null);
                      setSearchTerm('');
                    }}
                  >
                    ✕
                  </button>
                </div>
                {selectedEquipmentInfo.maintenanceTeam && (
                  <div className="team-info">
                    <strong>Team:</strong> {selectedEquipmentInfo.maintenanceTeam.name}
                  </div>
                )}
              </motion.div>
            )}
          </motion.div>

          {/* Subject */}
          <motion.div className="form-group" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <label htmlFor="subject">Request Subject *</label>
            <textarea
              id="subject"
              name="subject"
              value={formData.subject}
              onChange={handleChange}
              placeholder="Describe the maintenance issue or work required..."
              rows={4}
            />
          </motion.div>

          {/* Scheduled Date (for Preventive) */}
          {formData.type === 'PREVENTIVE' && (
            <motion.div
              className="form-group"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <label htmlFor="scheduledDate">Scheduled Date *</label>
              <div className="date-input-group">
                <FontAwesomeIcon icon={faCalendarAlt} className="date-icon" />
                <input
                  type="date"
                  id="scheduledDate"
                  name="scheduledDate"
                  value={formData.scheduledDate}
                  onChange={handleChange}
                  min={new Date().toISOString().split('T')[0]}
                />
              </div>
            </motion.div>
          )}
        </div>

        <motion.div className="form-actions" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
          <button
            type="submit"
            className="submit-btn"
            disabled={loading}
          >
            <FontAwesomeIcon icon={faSave} />
            {loading ? 'Creating...' : 'Create Request'}
          </button>
          <button
            type="button"
            className="cancel-btn"
            onClick={onClose}
          >
            <FontAwesomeIcon icon={faTimes} />
            Cancel
          </button>
        </motion.div>
      </motion.form>
    </motion.div>
  );
};

export default RequestForm;
