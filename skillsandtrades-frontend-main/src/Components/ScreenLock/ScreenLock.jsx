import React, { useState, useEffect } from "react";

const ScreenLock = ({ children }) => {
  const [isLocked, setIsLocked] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  // useEffect(() => {
  //   const unlocked = sessionStorage.getItem("siteUnlocked");
  //   if (unlocked === "true") {
  //     setIsLocked(false);
  //   }
  // }, []);

  // useEffect(() => {
  //   setIsLocked(true);
  //   setShowModal(false);
  // }, []);

  // useEffect(() => {
  //   if (isLocked) {
  //     document.body.style.overflow = "hidden";
  //   } else {
  //     document.body.style.overflow = "auto";
  //   }

  //   return () => {
  //     document.body.style.overflow = "auto";
  //   };
  // }, [isLocked]);

  const handleUnlockClick = () => {
    setShowModal(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const CORRECT_PASSWORD = "Allan@admin";

    if (password === CORRECT_PASSWORD) {
      sessionStorage.setItem("siteUnlocked", "true");
      setIsLocked(false);
    } else {
      setError("Incorrect password");
    }
  };


  // if (isLocked) {
  //   return (
  //     <div
  //       style={{
  //         position: "fixed",
  //         top: 0,
  //         left: 0,
  //         width: "100vw",
  //         height: "100vh",
  //         zIndex: 9999,
  //         display: "flex",
  //         justifyContent: "center",
  //         alignItems: "center",
  //         backdropFilter: "blur(8px)",
  //         backgroundColor: "rgba(255, 255, 255, 0.6)",
  //       }}
  //     >
  //       {!showModal && (
  //         <button
  //           onClick={handleUnlockClick}
  //           style={{
  //             padding: "15px 30px",
  //             fontSize: "1.2rem",
  //             cursor: "pointer",
  //             background: "#134A45",
  //             color: "white",
  //             border: "none",
  //             borderRadius: "5px",
  //             boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
  //           }}
  //         >
  //           Unlock
  //         </button>
  //       )}

  //       {showModal && (
  //         <div
  //           style={{
  //             backgroundColor: "white",
  //             padding: "30px",
  //             borderRadius: "8px",
  //             boxShadow: "0 4px 15px rgba(0,0,0,0.2)",
  //             textAlign: "center",
  //             minWidth: "300px",
  //           }}
  //         >
  //           <form onSubmit={handleSubmit}>
  //             <input
  //               type="password"
  //               value={password}
  //               autoFocus
  //               onChange={(e) => {
  //                 setPassword(e.target.value);
  //                 setError("");
  //               }}
  //               placeholder="Enter password"
  //               style={{
  //                 width: "100%",
  //                 padding: "10px",
  //                 marginBottom: "15px",
  //                 borderRadius: "4px",
  //                 border: "1px solid #ccc",
  //                 fontSize: "1rem",
  //               }}
  //             />
  //             {error && (
  //               <p style={{ color: "red", marginBottom: "10px" }}>
  //                 {error}
  //               </p>
  //             )}
  //             <button
  //               type="submit"
  //               style={{
  //                 width: "100%",
  //                 padding: "10px",
  //                 backgroundColor: "#134A45",
  //                 color: "white",
  //                 border: "none",
  //                 borderRadius: "4px",
  //                 cursor: "pointer",
  //                 fontSize: "1rem",
  //               }}
  //             >
  //               Submit
  //             </button>
  //           </form>
  //         </div>
  //       )}
  //     </div>
  //   );
  // }

  return <>{children}</>;
};

export default ScreenLock;
