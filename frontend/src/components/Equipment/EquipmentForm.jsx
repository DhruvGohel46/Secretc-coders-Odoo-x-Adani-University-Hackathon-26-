import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSave, faTimes } from '@fortawesome/free-solid-svg-icons';
import { createEquipment, updateEquipment, getAllTeams } from '../../services/api';
import { toast } from 'react-toastify';
import Button from '../Common/Button';
import './EquipmentForm.css';

const EquipmentForm = ({ equipment, onClose }) => {
  const [formData, setFormData] = useState({
    name: '',
    serialNumber: '',
    department: '',
    employee: '',
    location: '',
    purchaseDate: '',
    warrantyInfo: '',
    maintenanceTeamId: '',
    category: ''
  });

  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchTeams();
    if (equipment) {
      setFormData(equipment);
    }
  }, [equipment]);

  const fetchTeams = async () => {
    try {
      const response = await getAllTeams();
      setTeams(response.data);
    } catch (error) {
      console.error('Error fetching teams:', error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (equipment) {
        await updateEquipment(equipment.id, formData);
        toast.success('Equipment updated successfully');
      } else {
        await createEquipment(formData);
        toast.success('Equipment created successfully');
      }
      onClose();
    } catch (error) {
      console.error('Error saving equipment:', error);
      toast.error('Failed to save equipment');
    } finally {
      setLoading(false);
    }
  };

  const formVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        staggerChildren: 0.05
      }
    }
  };

  const fieldVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0 }
  };

  return (
    <motion.form
      className="equipment-form"
      onSubmit={handleSubmit}
      variants={formVariants}
      initial="hidden"
      animate="visible"
    >
      <div className="form-grid">
        <motion.div className="form-group" variants={fieldVariants}>
          <label htmlFor="name">Equipment Name *</label>
          <motion.input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            whileFocus={{ scale: 1.02 }}
            transition={{ type: "spring", stiffness: 300 }}
          />
        </motion.div>

        <motion.div className="form-group" variants={fieldVariants}>
          <label htmlFor="serialNumber">Serial Number *</label>
          <motion.input
            type="text"
            id="serialNumber"
            name="serialNumber"
            value={formData.serialNumber}
            onChange={handleChange}
            required
            whileFocus={{ scale: 1.02 }}
          />
        </motion.div>

        <motion.div className="form-group" variants={fieldVariants}>
          <label htmlFor="department">Department *</label>
          <motion.select
            id="department"
            name="department"
            value={formData.department}
            onChange={handleChange}
            required
            whileFocus={{ scale: 1.02 }}
          >
            <option value="">Select Department</option>
            <option value="Production">Production</option>
            <option value="IT">IT</option>
            <option value="Maintenance">Maintenance</option>
            <option value="Operations">Operations</option>
          </motion.select>
        </motion.div>

        <motion.div className="form-group" variants={fieldVariants}>
          <label htmlFor="employee">Assigned To</label>
          <motion.input
            type="text"
            id="employee"
            name="employee"
            value={formData.employee}
            onChange={handleChange}
            whileFocus={{ scale: 1.02 }}
          />
        </motion.div>

        <motion.div className="form-group" variants={fieldVariants}>
          <label htmlFor="location">Location *</label>
          <motion.input
            type="text"
            id="location"
            name="location"
            value={formData.location}
            onChange={handleChange}
            required
            whileFocus={{ scale: 1.02 }}
          />
        </motion.div>

        <motion.div className="form-group" variants={fieldVariants}>
          <label htmlFor="category">Category</label>
          <motion.input
            type="text"
            id="category"
            name="category"
            value={formData.category}
            onChange={handleChange}
            whileFocus={{ scale: 1.02 }}
          />
        </motion.div>

        <motion.div className="form-group" variants={fieldVariants}>
          <label htmlFor="purchaseDate">Purchase Date</label>
          <motion.input
            type="date"
            id="purchaseDate"
            name="purchaseDate"
            value={formData.purchaseDate}
            onChange={handleChange}
            whileFocus={{ scale: 1.02 }}
          />
        </motion.div>

        <motion.div className="form-group" variants={fieldVariants}>
          <label htmlFor="maintenanceTeamId">Maintenance Team *</label>
          <motion.select
            id="maintenanceTeamId"
            name="maintenanceTeamId"
            value={formData.maintenanceTeamId}
            onChange={handleChange}
            required
            whileFocus={{ scale: 1.02 }}
          >
            <option value="">Select Team</option>
            {teams.map(team => (
              <option key={team.id} value={team.id}>{team.name}</option>
            ))}
          </motion.select>
        </motion.div>

        <motion.div className="form-group full-width" variants={fieldVariants}>
          <label htmlFor="warrantyInfo">Warranty Information</label>
          <motion.textarea
            id="warrantyInfo"
            name="warrantyInfo"
            value={formData.warrantyInfo}
            onChange={handleChange}
            rows={3}
            whileFocus={{ scale: 1.01 }}
          />
        </motion.div>
      </div>

      <motion.div 
        className="form-actions"
        variants={fieldVariants}
      >
        <Button
          type="button"
          variant="secondary"
          icon={faTimes}
          onClick={onClose}
        >
          Cancel
        </Button>

        <Button
          type="submit"
          variant="primary"
          icon={faSave}
          loading={loading}
        >
          {equipment ? 'Update' : 'Create'}
        </Button>
      </motion.div>
    </motion.form>
  );
};

export default EquipmentForm;
