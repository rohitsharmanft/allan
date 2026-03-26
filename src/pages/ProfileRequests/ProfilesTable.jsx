import React from "react";

const ProfilesTable = ({ profiles, onAccept, onReject }) => {
  // Helper to safely compare values (handles arrays, objects, primitives)
  const isDifferent = (oldVal, newVal) => {
    if (oldVal === undefined || oldVal === null) oldVal = "";
    if (newVal === undefined || newVal === null) newVal = "";
    return JSON.stringify(oldVal) !== JSON.stringify(newVal);
  };

  const renderDiff = (oldVal, newVal, type = "text") => {
    const different = isDifferent(oldVal, newVal);

    if (!different) {
      if (type === "skills") {
        return oldVal?.length ? oldVal.join(", ") : "—";
      }
      if (type === "social") {
        if (!oldVal || Object.keys(oldVal).length === 0) return "—";
        return Object.keys(oldVal)
          .filter((k) => oldVal[k] && oldVal[k].trim())
          .join(", ");
      }
      return oldVal || "—";
    }

    // Changed value → show both
    let oldContent = oldVal || "—";
    let newContent = newVal || "—";

    if (type === "skills") {
      oldContent = oldVal?.length ? oldVal.join(", ") : "—";
      newContent = newVal?.length ? newVal.join(", ") : "—";
    }

    if (type === "social") {
      oldContent =
        oldVal && Object.keys(oldVal).length > 0
          ? Object.keys(oldVal)
              .filter((k) => oldVal[k] && oldVal[k].trim())
              .join(", ") || "—"
          : "—";

      newContent =
        newVal && Object.keys(newVal).length > 0
          ? Object.keys(newVal)
              .filter((k) => newVal[k] && newVal[k].trim())
              .join(", ") || "—"
          : "—";
    }

    return (
      <div style={{ lineHeight: 1.4 }}>
        <span style={{ color: "#888", textDecoration: "line-through" }}>
          {oldContent}
        </span>
        <br />
        <span style={{ color: "#006600", fontWeight: 500 }}>{newContent}</span>
      </div>
    );
  };

  return (
    <div style={{ overflowX: "auto", maxWidth: "100%" }}>
      <table
        style={{
          width: "100%",
          borderCollapse: "collapse",
          fontSize: "14px",
          minWidth: "900px", // prevents too narrow columns on small screens
        }}
      >
        <thead>
          <tr style={{ background: "#f5f5f5", textAlign: "left" }}>
            <th style={{ padding: "12px 10px", borderBottom: "2px solid #ddd" }}>
              Full Name
            </th>
            <th style={{ padding: "12px 10px", borderBottom: "2px solid #ddd" }}>
              Phone / WhatsApp
            </th>
            <th style={{ padding: "12px 10px", borderBottom: "2px solid #ddd" }}>
              Category
            </th>
            <th style={{ padding: "12px 10px", borderBottom: "2px solid #ddd" }}>
              Skills
            </th>
            <th style={{ padding: "12px 10px", borderBottom: "2px solid #ddd" }}>
              Social Links
            </th>
            <th style={{ padding: "12px 10px", borderBottom: "2px solid #ddd" }}>
              Action
            </th>
          </tr>
        </thead>
        <tbody>
          {!profiles || profiles.length === 0 ? (
            <tr>
              <td
                colSpan={6}
                style={{
                  padding: "40px",
                  textAlign: "center",
                  color: "#777",
                  fontStyle: "italic",
                }}
              >
                No profile update requests found
              </td>
            </tr>
          ) : (
            profiles.map((item, index) => {
              const oldData = item.oldData || {};
              const newData = item.newData || {};

              return (
                <tr
                  key={item._id || item.memberId || index}
                  style={{ borderBottom: "1px solid #eee" }}
                >
                  {/* Full Name */}
                  <td style={{ padding: "12px 10px" }}>
                    {renderDiff(oldData.fullName, newData.fullName)}
                  </td>

                  {/* Phone / WhatsApp */}
                  <td style={{ padding: "12px 10px" }}>
                    {renderDiff(
                      oldData.phoneNumber || oldData.whatsappNumber,
                      newData.phoneNumber || newData.whatsappNumber
                    )}
                  </td>

                  {/* Category */}
                  <td style={{ padding: "12px 10px" }}>
                    {renderDiff(oldData.category, newData.category)}
                  </td>

                  {/* Skills */}
                  <td style={{ padding: "12px 10px" }}>
                    {renderDiff(oldData.skills, newData.skills, "skills")}
                  </td>

                  {/* Social Links */}
                  <td style={{ padding: "12px 10px" }}>
                    {renderDiff(oldData.socialLinks, newData.socialLinks, "social")}
                  </td>

                  {/* Actions */}
                  <td style={{ padding: "12px 10px", whiteSpace: "nowrap" }}>
                    <button
                      onClick={() => onAccept(item)}
                      style={{
                        marginRight: 12,
                        padding: "6px 14px",
                        background: "#28a745",
                        color: "white",
                        border: "none",
                        borderRadius: "4px",
                        cursor: "pointer",
                        fontWeight: 500,
                      }}
                    >
                      Accept
                    </button>
                    <button
                      onClick={() => onReject(item)}
                      style={{
                        padding: "6px 14px",
                        background: "#dc3545",
                        color: "white",
                        border: "none",
                        borderRadius: "4px",
                        cursor: "pointer",
                        fontWeight: 500,
                      }}
                    >
                      Reject
                    </button>
                  </td>
                </tr>
              );
            })
          )}
        </tbody>
      </table>
    </div>
  );
};

export default ProfilesTable;