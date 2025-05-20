import React from 'react';

const StatCard = ({ title, value }) => {
  return (
    <div style={{
      background: "#ffffff",
      borderRadius: "16px",
      padding: "15px",
      boxShadow: "0 8px 16px rgba(0,0,0,0.08)",
      textAlign: "center",
      flex: "1",
      minWidth: "200px",
      transition: "0.3s ease",
    }}>
      <h3 style={{ fontSize: "1.2rem", color: "#333" }}>{title}</h3>
      <p style={{
        fontSize: "2rem",
        fontWeight: "bold",
        color: "#007bff",
        marginTop: "5px"
      }}>{value}</p>
    </div>
  );
};

export default StatCard;