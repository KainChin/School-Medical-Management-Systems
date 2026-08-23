import React from "react";
import { X } from "lucide-react";

export default function PrescriptionList({
  items,
  handleEditItem,
  removeItem,
  handleConfirmSend,
  statusMessage
}) {
  return (
    <div className="items-column">
      <h3>Danh sách thuốc được gửi</h3>
      {items.length === 0 && (
        <p style={{ color: "#888", fontStyle: "italic", textAlign: "center", marginTop: "20px" }}>
          Chưa có thuốc nào được chọn. Vui lòng điền thông tin và đính kèm ảnh thuốc bên trái.
        </p>
      )}

      {items.map((it, idx) => (
        <div
          key={idx}
          className="prescription-item"
          onClick={() => handleEditItem(idx)}
          style={{ position: "relative", cursor: "pointer", marginBottom: "16px" }}
        >
          <button
            className="remove-btn"
            onClick={(e) => {
              e.stopPropagation();
              removeItem(idx);
            }}
          >
            <X size={16} />
          </button>
          <h4>{it.medicationName}</h4>
          <p className="student-name">Học sinh: {it.studentName}</p>
          <p className="dose">Liều lượng (mg): {it.dosage}</p>
          <p className="note">Số lần uống: {it.frequency}</p>
          <p className="sender">Người gửi: {it.parentName}</p>
          <p className="meta">
            {it.startDate} → {it.endDate}
          </p>

          {/* ✅ HIỂN THỊ ẢNH THUỐC ĐÃ ĐÍNH KÈM */}
          {it.imageUrl && (
            <div style={{ marginTop: "8px", borderTop: "1px dashed #e5e7eb", paddingTop: "8px" }}>
              <span style={{ fontSize: "12px", fontWeight: "600", color: "#4F46E5", display: "block", marginBottom: "4px" }}>
                📷 Ảnh chụp thuốc:
              </span>
              <img
                src={it.imageUrl}
                alt={it.medicationName}
                style={{ width: "100%", maxHeight: "150px", objectFit: "cover", borderRadius: "6px", border: "1px solid #ddd" }}
              />
            </div>
          )}
        </div>
      ))}

      {items.length > 0 && (
        <button className="btn-confirm" onClick={handleConfirmSend} style={{ marginTop: "16px", width: "100%" }}>
          🚀 Xác nhận gửi đơn thuốc
        </button>
      )}

      {statusMessage && (
        <div
          className={`status-alert ${
            statusMessage.startsWith("Error") || statusMessage.startsWith("❌") || statusMessage.startsWith("⚠️")
              ? "error"
              : "success"
          }`}
          style={{ marginTop: "16px" }}
        >
          {statusMessage}
        </div>
      )}
    </div>
  );
}
