import React from "react";
import { X, Send } from "lucide-react";

export default function PrescriptionList({
  items,
  handleEditItem,
  removeItem,
  handleConfirmSend,
  statusMessage,
  isSubmitting
}) {
  return (
    <div className="items-column" style={{ backgroundColor: "#fff", padding: "20px", borderRadius: "12px", boxShadow: "0 2px 12px rgba(0,0,0,0.06)", display: "flex", flexDirection: "column" }}>
      <h3 style={{ fontSize: "18px", color: "#1e293b", marginBottom: "12px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span>📦 Danh sách thuốc được gửi</span>
        <span style={{ fontSize: "13px", backgroundColor: "#e0e7ff", color: "#3730a3", padding: "2px 10px", borderRadius: "12px", fontWeight: "600" }}>
          {items.length} loại
        </span>
      </h3>

      {/* --- Khung danh sách có scrollbar cố định chiều cao --- */}
      <div style={{ flex: 1, maxHeight: "430px", overflowY: "auto", paddingRight: "6px", marginBottom: "16px" }}>
        {items.length === 0 ? (
          <div style={{ padding: "40px 10px", textAlign: "center", color: "#94a3b8", fontStyle: "italic" }}>
            <p style={{ fontSize: "24px", marginBottom: "8px" }}>💊</p>
            <p>Chưa có loại thuốc nào trong danh sách.</p>
            <p style={{ fontSize: "12px", color: "#cbd5e1" }}>Vui lòng điền thông tin và bấm "Thêm vào danh sách" ở cột bên trái.</p>
          </div>
        ) : (
          items.map((it, idx) => (
            <div
              key={idx}
              className="prescription-item"
              onClick={() => handleEditItem(idx)}
              style={{
                position: "relative",
                cursor: "pointer",
                marginBottom: "12px",
                padding: "12px",
                border: "1fr solid #e2e8f0",
                borderRadius: "8px",
                backgroundColor: "#fafafa"
              }}
            >
              <button
                className="remove-btn"
                onClick={(e) => {
                  e.stopPropagation();
                  removeItem(idx);
                }}
                style={{ position: "absolute", top: "8px", right: "8px" }}
              >
                <X size={16} />
              </button>
              <h4 style={{ color: "#4f46e5", margin: "0 0 4px 0", fontSize: "15px" }}>
                #{idx + 1}. {it.medicationName}
              </h4>
              <p className="student-name" style={{ margin: "2px 0", fontSize: "13px" }}>
                <strong>Học sinh:</strong> {it.studentName}
              </p>
              <p className="dose" style={{ margin: "2px 0", fontSize: "13px" }}>
                <strong>Liều lượng:</strong> {it.dosage}
              </p>
              <p className="note" style={{ margin: "2px 0", fontSize: "13px" }}>
                <strong>Số lần uống:</strong> {it.frequency}
              </p>
              <p className="meta" style={{ margin: "4px 0 0 0", fontSize: "12px", color: "#64748b" }}>
                📅 {it.startDate} → {it.endDate}
              </p>

              {it.imageUrl && (
                <div style={{ marginTop: "6px", borderTop: "1px dashed #e2e8f0", paddingTop: "6px" }}>
                  <img
                    src={it.imageUrl}
                    alt={it.medicationName}
                    style={{ width: "100%", maxHeight: "110px", objectFit: "cover", borderRadius: "6px", border: "1px solid #cbd5e1" }}
                  />
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* --- Nút Xác nhận gửi tất cả --- */}
      {items.length > 0 && (
        <button
          className="btn-confirm"
          onClick={handleConfirmSend}
          disabled={isSubmitting}
          style={{
            width: "100%",
            padding: "14px",
            borderRadius: "8px",
            border: "none",
            backgroundColor: isSubmitting ? "#94a3b8" : "#2563eb",
            color: "#fff",
            fontWeight: "bold",
            fontSize: "15px",
            cursor: isSubmitting ? "not-allowed" : "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "8px"
          }}
        >
          <Send size={18} /> {isSubmitting ? "Đang gửi đơn thuốc..." : `🚀 Xác nhận gửi tất cả (${items.length} loại thuốc)`}
        </button>
      )}

      {statusMessage && (
        <div
          className={`status-alert ${
            statusMessage.includes("❌") || statusMessage.includes("⚠️") || statusMessage.includes("Error")
              ? "error"
              : "success"
          }`}
          style={{ marginTop: "12px", padding: "10px", borderRadius: "6px", fontSize: "13px", textAlign: "center" }}
        >
          {statusMessage}
        </div>
      )}
    </div>
  );
}
