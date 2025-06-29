import React, { useState, useContext } from "react";
import styles from "../styles/Leaderboard.module.css";
import { CurrentUserContext } from "../context/CurrentUserProvider";

export default function CreateBattle({ onClose }) {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    endDate: "",
  });
  const { currentUser, createBattle } = useContext(CurrentUserContext);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Form data:", formData);
    const prize = "Tamagotchi";
    const title = "Test Battle";
    const battle = await createBattle(formData.endDate, prize, title);
    console.log("battle", battle);
  };

  return (
    <div className={styles.container}>
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
      <form onSubmit={handleSubmit} className={styles.list}>
        <div style={{ marginBottom: "16px", width: "100%" }}>
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
              border: "2px solid #bfa76a",
              borderRadius: "12px",
              backgroundColor: "#fffbe6",
              fontFamily: "VT323, monospace",
              fontSize: "16px",
              color: "#5a4a2c",
              outline: "none",
              boxShadow: "2px 3px 0 #5a4a2c",
            }}
            required
          />
        </div>

        <div style={{ marginBottom: "16px", width: "100%" }}>
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
            Description
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            placeholder="Describe your battle..."
            rows="3"
            style={{
              width: "100%",
              padding: "12px 16px",
              border: "2px solid #bfa76a",
              borderRadius: "12px",
              backgroundColor: "#fffbe6",
              fontFamily: "VT323, monospace",
              fontSize: "16px",
              color: "#5a4a2c",
              outline: "none",
              boxShadow: "2px 3px 0 #5a4a2c",
              resize: "vertical",
              minHeight: "80px",
            }}
            required
          />
        </div>

        <div style={{ marginBottom: "16px", width: "100%" }}>
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
              border: "2px solid #bfa76a",
              borderRadius: "12px",
              backgroundColor: "#fffbe6",
              fontFamily: "VT323, monospace",
              fontSize: "16px",
              color: "#5a4a2c",
              outline: "none",
              boxShadow: "2px 3px 0 #5a4a2c",
            }}
            required
          />
        </div>
      </form>
      <button
        className={styles.joinBtn}
        onClick={handleSubmit}
        style={{ marginTop: "8px" }}
      >
        Create Battle
      </button>
    </div>
  );
}
