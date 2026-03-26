import React from "react";

const AlertMessage = ({ message }) => {
    if (!message) return null;

    const isSuccess = message.toLowerCase().includes("success");

    return (
        <div
            style={{
                padding: "14px 20px",
                margin: "20px 0",
                borderRadius: "10px",
                textAlign: "center",
                fontSize: "15px",
                fontWeight: "500",
                backgroundColor: isSuccess
                    ? "rgba(40, 167, 69, 0.15)"
                    : "rgba(220, 53, 69, 0.15)",
                color: isSuccess ? "#155724" : "#721c24",
                border: `1px solid ${isSuccess ? "#c3e6cb" : "#f5c6cb"}`,
            }}
        >
            {message}
        </div>
    );
};

export default AlertMessage;
