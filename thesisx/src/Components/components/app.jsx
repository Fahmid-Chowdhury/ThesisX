// src/App.js
import React, { useState, useEffect } from "react";
import CalendarComponent from "./components/Calendar";  // Import the Calendar component
import AddEventForm from "./components/AddEventForm";    // Import the Add Event Form
import Modal from "./components/Modal";                  // Import Modal to show event details

const App = () => {
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAddEventOpen, setIsAddEventOpen] = useState(false);

  // Example events
  useEffect(() => {
    setEvents([
      {
        title: "Faculty Meeting",
        start: new Date(2025, 0, 10, 10, 0),
        end: new Date(2025, 0, 10, 12, 0),
        type: "meeting",
      },
      {
        title: "Student Thesis Discussion",
        start: new Date(2025, 0, 12, 14, 0),
        end: new Date(2025, 0, 12, 16, 0),
        type: "discussion",
      },
    ]);
  }, []);

  const handleEventClick = (event) => {
    setSelectedEvent(event);
    setIsModalOpen(true);
  };

  const handleAddEventClick = () => {
    setIsAddEventOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const closeAddEventModal = () => {
    setIsAddEventOpen(false);
  };

  const handleEventSave = (newEvent) => {
    setEvents([...events, newEvent]);
    closeAddEventModal();
  };

  return (
    <div className="h-screen bg-gray-50 p-6">
      {/* Title and Add Event Button */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-semibold text-gray-800">Event Scheduler</h1>
        <button
          onClick={handleAddEventClick}
          className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600"
        >
          Add Event
        </button>
      </div>

      {/* Calendar */}
      <div className="calendar-container bg-white rounded-lg shadow-lg p-4">
        <CalendarComponent
          events={events}
          onEventClick={handleEventClick}
        />
      </div>

      {/* Add Event Modal */}
      {isAddEventOpen && (
        <AddEventForm onSave={handleEventSave} onClose={closeAddEventModal} />
      )}

      {/* Event Details Modal */}
      {isModalOpen && selectedEvent && (
        <Modal event={selectedEvent} onClose={closeModal} />
      )}
    </div>
  );
};

export default App;
