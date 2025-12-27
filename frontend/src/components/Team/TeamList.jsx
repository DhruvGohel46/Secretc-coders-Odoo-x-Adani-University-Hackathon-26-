import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faPlus, 
  faSearch, 
  faUsers,
  faEdit,
  faTrash,
  faUserPlus
} from '@fortawesome/free-solid-svg-icons';
import { getAllTeams, deleteTeam } from '../../services/api';
import { toast } from 'react-toastify';
import TeamForm from './TeamForm';
import Modal from '../Common/Modal';
import Button from '../Common/Button';
import './TeamList.css';

const TeamList = () => {
  const [teams, setTeams] = useState([]);
  const [filteredTeams, setFilteredTeams] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchTeams();
  }, []);

  useEffect(() => {
    const filtered = teams.filter(team =>
      team.name?.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredTeams(filtered);
  }, [searchTerm, teams]);

  const fetchTeams = async () => {
    try {
      setLoading(true);
      const response = await getAllTeams();
      setTeams(response.data);
      setFilteredTeams(response.data);
      toast.success('Teams loaded successfully');
    } catch (error) {
      console.error('Error fetching teams:', error);
      toast.error('Failed to load teams');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this team?')) {
      try {
        await deleteTeam(id);
        toast.success('Team deleted successfully');
        fetchTeams();
      } catch (error) {
        console.error('Error deleting team:', error);
        toast.error('Failed to delete team');
      }
    }
  };

  const handleEdit = (team) => {
    setSelectedTeam(team);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedTeam(null);
    fetchTeams();
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

  const cardVariants = {
    hidden: { opacity: 0, scale: 0.9, y: 20 },
    visible: { 
      opacity: 1, 
      scale: 1, 
      y: 0,
      transition: {
        type: "spring",
        stiffness: 300
      }
    },
    exit: { 
      opacity: 0, 
      scale: 0.9, 
      y: 20 
    }
  };

  return (
    <div className="team-list">
      <motion.div 
        className="team-header"
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
      >
        <div className="team-header-left">
          <h1>Maintenance Teams</h1>
          <p>Manage your maintenance workforce</p>
        </div>

        <div className="team-header-actions">
          <motion.div 
            className="search-box"
            whileFocus={{ scale: 1.02 }}
          >
            <FontAwesomeIcon icon={faSearch} />
            <input
              type="text"
              placeholder="Search teams..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </motion.div>

          <Button
            icon={faPlus}
            variant="primary"
            onClick={() => setShowModal(true)}
          >
            Add Team
          </Button>
        </div>
      </motion.div>

      {loading ? (
        <motion.div 
          className="team-loading"
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
          className="team-grid"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <AnimatePresence mode="popLayout">
            {filteredTeams.map((team, index) => (
              <motion.div
                key={team.id}
                className="team-card"
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
                <div className="team-card-header">
                  <motion.div 
                    className="team-icon"
                    whileHover={{ rotate: 360, scale: 1.2 }}
                    transition={{ duration: 0.5 }}
                  >
                    <FontAwesomeIcon icon={faUsers} />
                  </motion.div>

                  <div className="team-actions">
                    <motion.button
                      onClick={() => handleEdit(team)}
                      whileHover={{ scale: 1.2, rotate: 15 }}
                      whileTap={{ scale: 0.9 }}
                      className="edit-btn"
                    >
                      <FontAwesomeIcon icon={faEdit} />
                    </motion.button>

                    <motion.button
                      onClick={() => handleDelete(team.id)}
                      whileHover={{ scale: 1.2, rotate: -15 }}
                      whileTap={{ scale: 0.9 }}
                      className="delete-btn"
                    >
                      <FontAwesomeIcon icon={faTrash} />
                    </motion.button>
                  </div>
                </div>

                <motion.h3
                  whileHover={{ x: 5 }}
                  transition={{ type: "spring", stiffness: 400 }}
                >
                  {team.name}
                </motion.h3>

                <p className="team-description">{team.description || 'No description'}</p>

                <div className="team-members">
                  <motion.div 
                    className="members-count"
                    whileHover={{ scale: 1.1 }}
                  >
                    <FontAwesomeIcon icon={faUserPlus} />
                    <span>{team.members?.length || 0} Members</span>
                  </motion.div>

                  <div className="member-avatars">
                    {team.members?.slice(0, 3).map((member, idx) => (
                      <motion.div
                        key={member.id}
                        className="member-avatar"
                        initial={{ scale: 0, x: -20 }}
                        animate={{ scale: 1, x: 0 }}
                        transition={{ delay: idx * 0.1 }}
                        whileHover={{ scale: 1.2, zIndex: 10 }}
                        style={{ zIndex: 3 - idx }}
                      >
                        {member.name.charAt(0)}
                      </motion.div>
                    ))}
                    {team.members?.length > 3 && (
                      <motion.div
                        className="member-avatar more"
                        whileHover={{ scale: 1.2 }}
                      >
                        +{team.members.length - 3}
                      </motion.div>
                    )}
                  </div>
                </div>

                <motion.div
                  className="card-glow"
                  initial={{ opacity: 0 }}
                  whileHover={{ opacity: 0.3 }}
                  transition={{ duration: 0.3 }}
                />
              </motion.div>
            ))}
          </AnimatePresence>

          {filteredTeams.length === 0 && (
            <motion.div
              className="empty-state"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
            >
              <p>No teams found</p>
            </motion.div>
          )}
        </motion.div>
      )}

      <AnimatePresence>
        {showModal && (
          <Modal
            title={selectedTeam ? 'Edit Team' : 'Add New Team'}
            onClose={handleCloseModal}
          >
            <TeamForm
              team={selectedTeam}
              onClose={handleCloseModal}
            />
          </Modal>
        )}
      </AnimatePresence>
    </div>
  );
};

export default TeamList;
