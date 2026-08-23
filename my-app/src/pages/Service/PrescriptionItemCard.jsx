import React from "react";
import { Trash2 } from "lucide-react";

export default function PrescriptionItemCard({
  index,
  item,
  onChangeItem,
  onRemoveItem,
  canRemove
}) {
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      alert("⚠️ Dung lượng ảnh không được vượt quá 5MB!");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      onChangeItem(index, "imageUrl", reader.result);
    };
    reader.readAsDataURL(file);
  };

  return (
    <div style={{
      border: "1px solid #e5e7eb",
      borderRadius: "10px",
      padding: "16px",
      backgroundColor: "#fafafa",
      marginBottom: "16px",
      position: "relative"
    }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
        <h4 style={{ color: "#4F46E5", margin: 0, fontSize: "15px" }}>
          💊 Loại thuốc #{index + 1}
        </h4>
        {canRemove && (
          <button
            type="button"
            onClick={() => onRemoveItem(index)}
            style={{
              background: "#fee2e2",
              color: "#ef4444",
              border: "none",
              padding: "4px 10px",
              borderRadius: "6px",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "4px",
              fontSize: "13px"
            }}
          >
            <Trash2 size={14} /> Xóa thuốc này
          </button>
        )}
      </div>

      <div className="two-fields">
        <div className="field">
          <label>Tên thuốc *</label>
          <input
            type="text"
            placeholder="Ví dụ: Paracetamol"
            value={item.drugName}
            onChange={(e) => onChangeItem(index, "drugName", e.target.value)}
            required
          />
        </div>
        <div className="field">
          <label>Liều lượng (mg) *</label>
          <input
            type="text"
            placeholder="Ví dụ: 500"
            value={item.dose}
            onChange={(e) => onChangeItem(index, "dose", e.target.value)}
            required
          />
        </div>
      </div>

      <div className="field" style={{ marginTop: "10px" }}>
        <label>Số lần uống *</label>
        <input
          type="text"
          placeholder="Ví dụ: 2 lần/ngày hoặc 3 lần/tuần"
          value={item.note}
          onChange={(e) => onChangeItem(index, "note", e.target.value)}
          required
        />
      </div>

      {/* ✅ HÌNH ẢNH THUỐC (BẮT BUỘC: FILE HOẶC URL) */}
      <div className="field" style={{ marginTop: "10px" }}>
        <label style={{ color: "#d97706", fontWeight: "600", fontSize: "13px" }}>
          📷 Hình ảnh thuốc (Bắt buộc: Tải tệp hoặc dán URL) *
        </label>

        <div style={{ display: "flex", flexDirection: "column", gap: "8px", marginTop: "4px" }}>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileUpload}
            style={{ padding: "6px", border: "1px dashed #4F46E5", borderRadius: "6px", width: "100%" }}
          />

          <input
            type="url"
            placeholder="Hoặc dán đường dẫn ảnh URL (https://...)"
            value={item.imageUrl && !item.imageUrl.startsWith("data:") ? item.imageUrl : ""}
            onChange={(e) => onChangeItem(index, "imageUrl", e.target.value)}
            style={{ padding: "8px", border: "1px solid #ccc", borderRadius: "6px", width: "100%" }}
          />
        </div>

        {item.imageUrl && (
          <div style={{ marginTop: "8px", textAlign: "center" }}>
            <img
              src={item.imageUrl}
              alt={`Ảnh thuốc #${index + 1}`}
              onError={(e) => {
                e.target.onerror = null;
                alert("⚠️ Không thể tải ảnh từ liên kết này!");
              }}
              style={{ maxHeight: "110px", maxWidth: "100%", borderRadius: "8px", border: "2px solid #4F46E5", objectFit: "cover" }}
            />
            <p style={{ fontSize: "12px", color: "#16a34a", margin: "4px 0 0 0" }}>✓ Đã tải hình ảnh thành công</p>
          </div>
        )}
      </div>
    </div>
  );
}
