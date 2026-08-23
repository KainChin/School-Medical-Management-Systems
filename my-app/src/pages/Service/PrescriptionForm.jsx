import React from "react";

export default function PrescriptionForm({
  form,
  setForm,
  students,
  user,
  editingIndex,
  handleAddToList,
  handleChange,
  today
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
      setForm((f) => ({ ...f, imageUrl: reader.result }));
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="form-column" style={{ backgroundColor: "#fff", padding: "20px", borderRadius: "12px", boxShadow: "0 2px 12px rgba(0,0,0,0.06)" }}>
      <h3 style={{ fontSize: "18px", color: "#1e293b", marginBottom: "16px" }}>
        📝 Nhập thông tin đơn thuốc
      </h3>

      {/* --- Chọn học sinh & người gửi --- */}
      <div className="field">
        <label>Tên học sinh *</label>
        <select
          name="selectedIndex"
          value={form.selectedIndex}
          onChange={handleChange}
          required
        >
          <option value="">-- Chọn học sinh --</option>
          {students.map((s, i) => (
            <option key={s.studentId || i} value={String(i)}>
              {s.studentName}
            </option>
          ))}
        </select>
      </div>

      <div className="field">
        <label>Người gửi</label>
        <input
          type="text"
          readOnly
          value={
            students.length > 0
              ? form.selectedIndex === ""
                ? students[0].parentName || user.name
                : students[Number(form.selectedIndex)].parentName || user.name
              : user.name
          }
        />
      </div>

      <div className="two-fields">
        <div className="field">
          <label>Ngày bắt đầu *</label>
          <input
            type="date"
            name="startDate"
            value={form.startDate}
            onChange={handleChange}
            min={today()}
          />
        </div>
        <div className="field">
          <label>Ngày kết thúc *</label>
          <input
            type="date"
            name="endDate"
            value={form.endDate}
            onChange={handleChange}
            min={form.startDate || today()}
          />
        </div>
      </div>

      <hr style={{ border: "0.5px solid #f1f5f9", margin: "16px 0" }} />

      {/* --- Chi tiết loại thuốc --- */}
      <div className="two-fields">
        <div className="field">
          <label>Tên thuốc *</label>
          <input
            name="drugName"
            value={form.drugName}
            onChange={handleChange}
            placeholder="Ví dụ: Paracetamol"
          />
        </div>
        <div className="field">
          <label>Liều lượng (mg) *</label>
          <input
            name="dose"
            value={form.dose}
            onChange={handleChange}
            placeholder="Ví dụ: 500"
          />
        </div>
      </div>

      <div className="field">
        <label>Số lần uống *</label>
        <input
          name="note"
          value={form.note}
          onChange={handleChange}
          placeholder="Ví dụ: 2 lần/ngày hoặc 3 lần/tuần"
        />
      </div>

      {/* --- Bắt buộc Ảnh thuốc --- */}
      <div className="field" style={{ marginTop: "12px" }}>
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
            value={form.imageUrl && !form.imageUrl.startsWith("data:") ? form.imageUrl : ""}
            onChange={(e) => setForm((f) => ({ ...f, imageUrl: e.target.value }))}
            style={{ padding: "8px", border: "1px solid #ccc", borderRadius: "6px", width: "100%" }}
          />
        </div>

        {form.imageUrl && (
          <div style={{ marginTop: "8px", textAlign: "center" }}>
            <img
              src={form.imageUrl}
              alt="Ảnh thuốc preview"
              onError={(e) => {
                e.target.onerror = null;
                alert("⚠️ Không thể tải ảnh từ liên kết URL này!");
              }}
              style={{ maxHeight: "100px", maxWidth: "100%", borderRadius: "6px", border: "2px solid #4F46E5", objectFit: "cover" }}
            />
            <p style={{ fontSize: "11px", color: "#16a34a", margin: "2px 0 0 0" }}>✓ Đã tải ảnh thành công</p>
          </div>
        )}
      </div>

      <button
        type="button"
        className="btn-add"
        onClick={handleAddToList}
        style={{ marginTop: "16px", backgroundColor: "#4f46e5", color: "#fff", padding: "12px", borderRadius: "8px", fontWeight: "600", width: "100%", border: "none", cursor: "pointer" }}
      >
        {editingIndex != null ? "💾 Cập nhật loại thuốc" : "➕ Thêm vào danh sách gửi"}
      </button>
    </div>
  );
}
