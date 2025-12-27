import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faCalendarPlus, 
  faClock,
  faTools,
  faChevronLeft,
  faChevronRight
} from '@fortawesome/free-solid-svg-icons';
import { getPreventiveRequests } from '../../services/api';
import { format, isSameDay, startOfMonth, endOfMonth } from 'date-fns';
import { toast } from 'react-toastify';
import Modal from '../Common/Modal';
import Button from '../Common/Button';
import './MaintenanceCalendar.css';

const MaintenanceCalendar = () => {
  const [date, setDate] = useState(new Date());
  const [events, setEvents] = useState([]);
  const [selectedDateEvents, setSelectedDateEvents] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showEventDetails, setShowEventDetails] = useState(false);
  const [loading, setLoading] = useState(false);

  const fetchCalendarEvents = useCallback(async () => {
    try {
      setLoading(true);
      const start = startOfMonth(date);
      const end = endOfMonth(date);
      const response = await getPreventiveRequests(
        format(start, 'yyyy-MM-dd'),
        format(end, 'yyyy-MM-dd')
      );
      setEvents(response.data);
      toast.success('Calendar updated');
    } catch (error) {
      console.error('Error fetching calendar events:', error);
      toast.error('Failed to load calendar events');
    } finally {
      setLoading(false);
    }
  }, [date]);

  useEffect(() => {
    fetchCalendarEvents();
  }, [date, fetchCalendarEvents]);

  const handleDateClick = (value) => {
    setDate(value);
    const dayEvents = events.filter(event =>
      isSameDay(new Date(event.scheduledDate), value)
    );
    setSelectedDateEvents(dayEvents);
    if (dayEvents.length > 0) {
      setShowEventDetails(true);
    }
  };

  const tileContent = ({ date, view }) => {
    if (view === 'month') {
      const dayEvents = events.filter(event =>
        isSameDay(new Date(event.scheduledDate), date)
      );

      if (dayEvents.length > 0) {
        return (
          <motion.div
            className="event-indicator"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 500 }}
          >
            <motion.span
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              {dayEvents.length}
            </motion.span>
          </motion.div>
        );
      }
    }
    return null;
  };

  return (
    <div className="maintenance-calendar">
      <motion.div 
        className="calendar-header"
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
      >
        <div className="calendar-header-left">
          <h1>Maintenance Calendar</h1>
          <p>Schedule and track preventive maintenance</p>
        </div>

        <Button
          icon={faCalendarPlus}
          variant="primary"
          onClick={() => setShowModal(true)}
        >
          Schedule Maintenance
        </Button>
      </motion.div>

      <div className="calendar-container">
        <motion.div
          className="calendar-wrapper"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
        >
          <Calendar
            onChange={handleDateClick}
            value={date}
            tileContent={tileContent}
            prevLabel={<FontAwesomeIcon icon={faChevronLeft} />}
            nextLabel={<FontAwesomeIcon icon={faChevronRight} />}
            className="custom-calendar"
          />
        </motion.div>

        <motion.div
          className="event-sidebar"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
        >
          <h3>
            Events for {format(date, 'MMMM dd, yyyy')}
          </h3>

          {loading ? (
            <motion.div 
              className="events-loading"
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            >
              Loading...
            </motion.div>
          ) : (
            <div className="events-list">
              <AnimatePresence mode="popLayout">
                {events
                  .filter(event => isSameDay(new Date(event.scheduledDate), date))
                  .map((event, index) => (
                    <motion.div
                      key={event.id}
                      className="event-card"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ delay: index * 0.05 }}
                      whileHover={{ 
                        scale: 1.02, 
                        x: 5,
                        boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                      }}
                    >
                      <div className="event-header">
                        <motion.div 
                          className="event-icon"
                          whileHover={{ rotate: 360 }}
                          transition={{ duration: 0.5 }}
                        >
                          <FontAwesomeIcon icon={faTools} />
                        </motion.div>
                        <div className="event-info">
                          <h4>{event.subject}</h4>
                          <p>{event.equipment?.name}</p>
                        </div>
                      </div>

                      <div className="event-details">
                        <motion.div 
                          className="detail-item"
                          whileHover={{ x: 3 }}
                        >
                          <FontAwesomeIcon icon={faClock} />
                          <span>{event.scheduledTime || 'All day'}</span>
                        </motion.div>

                        {event.assignedTo && (
                          <motion.div 
                            className="detail-item"
                            whileHover={{ x: 3 }}
                          >
                            <span className="assignee">{event.assignedTo.name}</span>
                          </motion.div>
                        )}
                      </div>
                    </motion.div>
                  ))}
              </AnimatePresence>

              {events.filter(event => isSameDay(new Date(event.scheduledDate), date)).length === 0 && (
                <motion.div
                  className="no-events"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  <p>No maintenance scheduled for this day</p>
                </motion.div>
              )}
            </div>
          )}
        </motion.div>
      </div>

      <AnimatePresence>
        {showModal && (
          <Modal
            title="Schedule Preventive Maintenance"
            onClose={() => setShowModal(false)}
          >
            <p>Schedule form will be here</p>
          </Modal>
        )}
      </AnimatePresence>
    </div>
  );
};

export default MaintenanceCalendar;
