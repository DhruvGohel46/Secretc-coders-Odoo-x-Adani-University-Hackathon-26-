import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSave, faTimes } from '@fortawesome/free-solid-svg-icons';
import { createTeam, updateTeam, getAllTechnicians } from '../../services/api';
import { toast } from 'react-toastify';
import Button from '../Common/Button';
import './TeamForm.css';

const TeamForm = ({ team, onClose }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    memberIds: []
  });

  const [technicians, setTechnicians] = useState([]);
  const [selectedTechnicians, setSelectedTechnicians] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchTechnicians();
    if (team) {
      setFormData({
        name: team.name,
        description: team.description || '',
        memberIds: team.members?.map(m => m.id) || []
      });
      setSelectedTechnicians(team.members || []);
    }
  }, [team]);

  const fetchTechnicians = async () => {
    try {
      const response = await getAllTechnicians();
      setTechnicians(response.data);
    } catch (error) {
      console.error('Error fetching technicians:', error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleAddMember = (technicianId) => {
    const technician = technicians.find(t => t.id === parseInt(technicianId));
    if (technician && !selectedTechnicians.find(t => t.id === technician.id)) {
      setSelectedTechnicians([...selectedTechnicians, technician]);
      setFormData(prev => ({
        ...prev,
        memberIds: [...prev.memberIds, technician.id]
      }));
    }
  };

  const handleRemoveMember = (technicianId) => {
    setSelectedTechnicians(selectedTechnicians.filter(t => t.id !== technicianId));
    setFormData(prev => ({
      ...prev,
      memberIds: prev.memberIds.filter(id => id !== technicianId)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (team) {
        // Backend doesn't support team updates, show message
        toast.info('Team updates are not supported. Please create a new team instead.');
        onClose();
        return;
      } else {
        await createTeam({ name: formData.name });
        toast.success('Team created successfully');
        // Add members after team creation if any selected
        if (formData.memberIds.length > 0 && team) {
          // Note: Members should be added via the team detail page
          toast.info('Add team members after creating the team');
        }
      }
      onClose();
    } catch (error) {
      console.error('Error saving team:', error);
      toast.error(error.response?.data?.error || 'Failed to save team');
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
      className="team-form"
      onSubmit={handleSubmit}
      variants={formVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.div className="form-group" variants={fieldVariants}>
        <label htmlFor="name">Team Name *</label>
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
        <label htmlFor="description">Description</label>
        <motion.textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          rows={3}
          whileFocus={{ scale: 1.01 }}
        />
      </motion.div>

      <motion.div className="form-group" variants={fieldVariants}>
        <label>Add Team Members</label>
        <div className="member-selector">
          <motion.select
            onChange={(e) => {
              handleAddMember(e.target.value);
              e.target.value = '';
            }}
            whileFocus={{ scale: 1.02 }}
          >
            <option value="">Select Technician</option>
            {technicians
              .filter(tech => !selectedTechnicians.find(t => t.id === tech.id))
              .map(tech => (
                <option key={tech.id} value={tech.id}>
                  {tech.name} - {tech.specialization}
                </option>
              ))}
          </motion.select>
        </div>
      </motion.div>

      <motion.div className="selected-members" variants={fieldVariants}>
        <label>Team Members ({selectedTechnicians.length})</label>
        <div className="member-list">
          {selectedTechnicians.map((member, index) => (
            <motion.div
              key={member.id}
              className="member-chip"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ delay: index * 0.05 }}
              whileHover={{ scale: 1.05 }}
            >
              <motion.div 
                className="member-avatar"
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.5 }}
              >
                {member.name.charAt(0)}
              </motion.div>
              <span>{member.name}</span>
              <motion.button
                type="button"
                onClick={() => handleRemoveMember(member.id)}
                whileHover={{ scale: 1.2, rotate: 90 }}
                whileTap={{ scale: 0.9 }}
              >
                <FontAwesomeIcon icon={faTimes} />
              </motion.button>
            </motion.div>
          ))}

          {selectedTechnicians.length === 0 && (
            <motion.p 
              className="empty-members"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              No members added yet
            </motion.p>
          )}
        </div>
      </motion.div>

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
          {team ? 'Update' : 'Create'}
        </Button>
      </motion.div>
    </motion.form>
  );
};

export default TeamForm;
