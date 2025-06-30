import React, { useState, useContext } from "react";
import styles from "../styles/Leaderboard.module.css";
import { CurrentUserContext } from "../context/CurrentUserProvider";

export default function CreateBattle({ onClose, onCreated }) {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    startDate: new Date().toISOString().slice(0, 16),
    endDate: "",
  });
  const [loading, setLoading] = useState(false);
  const { createBattle } = useContext(CurrentUserContext);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
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
      const battle = await createBattle(formData.endDate, prize, title, image);
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
            <input
              type="datetime-local"
              name="startDate"
              value={formData.startDate}
              onChange={handleInputChange}
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
              End Date
            </label>
            <input
              type="datetime-local"
              name="endDate"
              value={formData.endDate}
              onChange={handleInputChange}
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
