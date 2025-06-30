import React, { useState, useContext, useEffect, useRef } from "react";
import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";
import styles from "../styles/Leaderboard.module.css";
import { CurrentUserContext } from "../context/CurrentUserProvider";

export default function CreateBattle({ onClose, onCreated }) {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    startDate: new Date(),
    endDate: null,
  });
  const [loading, setLoading] = useState(false);
  const [showStartPicker, setShowStartPicker] = useState(false);
  const [showEndPicker, setShowEndPicker] = useState(false);
  const [pickerPosition, setPickerPosition] = useState('bottom');
  const { createBattle } = useContext(CurrentUserContext);
  const startPickerRef = useRef(null);
  const endPickerRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (startPickerRef.current && !startPickerRef.current.contains(event.target)) {
        setShowStartPicker(false);
      }
      if (endPickerRef.current && !endPickerRef.current.contains(event.target)) {
        setShowEndPicker(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleDateSelect = (date, field) => {
    if (date) {
      setFormData((prev) => ({
        ...prev,
        [field]: date,
      }));
    }
    if (field === 'startDate') {
      setShowStartPicker(false);
    } else {
      setShowEndPicker(false);
    }
  };

  const toggleEndPicker = () => {
    if (!showEndPicker) {
      // Check if there's enough space below, if not, position above
      const rect = endPickerRef.current?.getBoundingClientRect();
      if (rect) {
        const spaceBelow = window.innerHeight - rect.bottom;
        const spaceAbove = rect.top;
        setPickerPosition(spaceBelow < 350 && spaceAbove > spaceBelow ? 'top' : 'bottom');
      }
    }
    setShowEndPicker(!showEndPicker);
  };

  const handleTimeChange = (e, field) => {
    const time = e.target.value;
    const [hours, minutes] = time.split(':');
    
    setFormData((prev) => {
      const currentDate = prev[field] || new Date();
      const newDate = new Date(currentDate);
      newDate.setHours(parseInt(hours), parseInt(minutes), 0, 0);
      return {
        ...prev,
        [field]: newDate,
      };
    });
  };

  const formatDate = (date) => {
    if (!date) return "";
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatTime = (date) => {
    if (!date) return "";
    return date.toTimeString().slice(0, 5);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const title = formData.name;
      const prize = formData.description;
      const images = [
        "/images/hackathon.png",
        "/images/bt_battle.png",
        "/images/bt_capivara.png",
        "/images/bt_galo.png",
        "/images/bt_kiwi.png",
        "/images/bt_orange.png",
        "/images/bt_pera.png",
        "/images/bt_pinneaple.png",
        "/images/bt_strawberry.png",
      ];
      const image = images[Math.floor(Math.random() * images.length)];
      const endDateISO = formData.endDate ? formData.endDate.toISOString() : new Date().toISOString();
      const startDateISO = formData.startDate ? formData.startDate.toISOString() : new Date().toISOString();
      const battle = await createBattle(startDateISO, endDateISO, prize, title, image);
      if (onCreated) onCreated();
      onClose();
    } catch (err) {
      alert("Erro ao criar batalha");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        background: 'rgba(0,0,0,0.3)',
        zIndex: 1000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <div
        className={styles.container}
        style={{
          borderRadius: 32,
          boxShadow: '0 2px 16px #bfa76a44',
          background: '#ffedae',
        }}
      >
        <button
          className={styles.closeX}
          onClick={onClose}
          aria-label="Close"
          style={{
            position: "absolute",
            top: 12,
            right: 16,
            background: "none",
            border: "none",
            fontSize: 28,
            color: "#655f4d",
            cursor: "pointer",
            zIndex: 10,
          }}
        >
          ×
        </button>
        <h1 className={styles.title}>Create Battle</h1>
        <form onSubmit={handleSubmit} className={styles.list} style={{width: '100%', padding: 0, margin: 0}}>
          <div style={{ marginBottom: "16px" }}>
            <label
              style={{
                display: "block",
                marginBottom: "8px",
                color: "#5a4a2c",
                fontFamily: "VT323, monospace",
                fontSize: "16px",
                fontWeight: "bold",
              }}
            >
              Battle Name
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="Enter battle name..."
              style={{
                width: "100%",
                padding: "12px 16px",
                border: "1.5px solid #655f4d",
                borderRadius: "12px",
                backgroundColor: "#fef6bf",
                fontFamily: "VT323, monospace",
                fontSize: "16px",
                color: "#5a4a2c",
                outline: "none",
                boxShadow: "none",
              }}
              required
            />
          </div>

          <div style={{ marginBottom: "16px" }}>
            <label
              style={{
                display: "block",
                marginBottom: "8px",
                color: "#5a4a2c",
                fontFamily: "VT323, monospace",
                fontSize: "16px",
                fontWeight: "bold",
              }}
            >
              Prize Description
            </label>
            <input
              type="text"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Describe prize..."
              style={{
                width: "100%",
                padding: "12px 16px",
                border: "1.5px solid #655f4d",
                borderRadius: "12px",
                backgroundColor: "#fef6bf",
                fontFamily: "VT323, monospace",
                fontSize: "16px",
                color: "#5a4a2c",
                outline: "none",
                boxShadow: "none",
              }}
              required
            />
          </div>

          <div style={{ marginBottom: "16px" }}>
            <label
              style={{
                display: "block",
                marginBottom: "8px",
                color: "#5a4a2c",
                fontFamily: "VT323, monospace",
                fontSize: "16px",
                fontWeight: "bold",
              }}
            >
              Start Date
            </label>
            <div style={{ position: "relative" }} ref={startPickerRef}>
              <button
                type="button" 
                onClick={() => setShowStartPicker(!showStartPicker)}
                style={{
                  width: "100%",
                  padding: "12px 16px",
                  border: "1.5px solid #655f4d",
                  borderRadius: "12px",
                  backgroundColor: "#fef6bf",
                  fontFamily: "VT323, monospace",
                  fontSize: "16px",
                  color: "#5a4a2c",
                  cursor: "pointer",
                  textAlign: "left",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <span>{formatDate(formData.startDate)}</span>
                <span>📅</span>
              </button>
              {showStartPicker && (
                <div
                  style={{ 
                    top: "100%",
                    left: 0,
                    right: 0,
                    zIndex: 1000,
                    backgroundColor: "#fef6bf",
                    border: "1.5px solid #655f4d",
                    borderRadius: "12px",
                    padding: "6px 2px 16px 2px",
                    marginTop: "4px",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                  }}
                >
                  <DayPicker
                    mode="single"
                    selected={formData.startDate}
                    onSelect={(date) => handleDateSelect(date, 'startDate')}
                    disabled={{ before: new Date() }}
                    styles={{
                      caption: { color: "#5a4a2c", fontFamily: "VT323, monospace" },
                      head_cell: { color: "#5a4a2c", fontFamily: "VT323, monospace" },
                      cell: { color: "#5a4a2c", fontFamily: "VT323, monospace" },
                      day_selected: { backgroundColor: "#4caf50", color: "white" },
                      day_today: { color: "#4caf50", fontWeight: "bold" },
                    }} 
                  />
                  <div style={{ marginTop: "12px" }}>
                    <label style={{ color: "#5a4a2c", fontFamily: "VT323, monospace", fontSize: "14px" }}>
                      Time:
                    </label>
                    <input
                      type="time"
                      value={formatTime(formData.startDate)}
                      onChange={(e) => handleTimeChange(e, 'startDate')}
                      style={{
                        width: "100%",
                        padding: "6px",
                        border: "1px solid #655f4d",
                        borderRadius: "6px",
                        backgroundColor: "#fff",
                        fontFamily: "VT323, monospace",
                        fontSize: "14px",
                        marginTop: "4px",
                      }}
                    />
                  </div>
                </div>
              )}
            </div>
          </div>

          <div style={{ marginBottom: "16px" }}>
            <label
              style={{
                display: "block",
                marginBottom: "8px",
                color: "#5a4a2c",
                fontFamily: "VT323, monospace",
                fontSize: "16px",
                fontWeight: "bold",
              }}
            >
              End Date
            </label>
            <div style={{ position: "relative" }} ref={endPickerRef}>
              <button
                type="button"
                onClick={toggleEndPicker}
                style={{
                  width: "100%",
                  padding: "12px 16px",
                  border: "1.5px solid #655f4d",
                  borderRadius: "12px",
                  backgroundColor: "#fef6bf",
                  fontFamily: "VT323, monospace",
                  fontSize: "16px",
                  color: "#5a4a2c",
                  cursor: "pointer",
                  textAlign: "left",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <span>{formData.endDate ? formatDate(formData.endDate) : "Select end date..."}</span>
                <span>📅</span>
              </button>
              {showEndPicker && (
                <div
                  style={{ 
                    position: "absolute",
                    [pickerPosition === 'top' ? 'bottom' : 'top']: "100%",
                    left: 0,
                    right: 0,
                    maxHeight: "400px",
                    overflowY: "auto",
                    zIndex: 1000,
                    backgroundColor: "#fef6bf",
                    border: "1.5px solid #655f4d",
                    borderRadius: "12px",
                    padding: "6px 2px 16px 2px",
                    marginTop: pickerPosition === 'top' ? "0px" : "4px",
                    marginBottom: pickerPosition === 'top' ? "4px" : "0px",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                    transform: "translateY(0)",
                    maxWidth: "calc(100vw - 32px)",
                  }}
                >
                  <DayPicker
                    mode="single"
                    selected={formData.endDate}
                    onSelect={(date) => handleDateSelect(date, 'endDate')}
                    disabled={{ before: formData.startDate }}
                    styles={{
                      caption: { color: "#5a4a2c", fontFamily: "VT323, monospace" },
                      head_cell: { color: "#5a4a2c", fontFamily: "VT323, monospace" },
                      cell: { color: "#5a4a2c", fontFamily: "VT323, monospace" },
                      day_selected: { backgroundColor: "#4caf50", color: "white" },
                      day_today: { color: "#4caf50", fontWeight: "bold" },
                    }}
                  /> 
                  <div style={{ marginTop: "12px" }}>
                    <label style={{ color: "#5a4a2c", fontFamily: "VT323, monospace", fontSize: "14px" }}>
                      Time:
                    </label>
                    <input
                      type="time"
                      value={formData.endDate ? formatTime(formData.endDate) : ""}
                      onChange={(e) => handleTimeChange(e, 'endDate')}
                      style={{
                        width: "100%",
                        padding: "8px",
                        border: "1px solid #655f4d",
                        borderRadius: "6px",
                        backgroundColor: "#fff",
                        fontFamily: "VT323, monospace",
                        fontSize: "14px",
                        marginTop: "4px",
                      }}
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        </form>
        <button
          className={styles.joinBtn}
          onClick={handleSubmit}
          style={{
            margin: '24px auto 0 auto',
            background: loading ? '#bfa76a' : '#4caf50',
            color: '#fffbe6',
            fontFamily: "'VT323', monospace",
            fontSize: '1.2rem',
            border: '2px solid #5a4a2c',
            borderRadius: '8px',
            padding: '12px 0',
            width: '100%',
            maxWidth: 320,
            cursor: loading ? 'not-allowed' : 'pointer',
            boxShadow: '2px 3px 0 #5a4a2c',
            opacity: loading ? 0.7 : 1,
            transition: 'background 0.2s',
            display: 'block',
          }}
          disabled={loading}
        >
          {loading ? "Creating..." : "Create Battle"}
        </button>
      </div>
    </div>
  );
}
