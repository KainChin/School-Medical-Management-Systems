import React from "react";

export default function PrescriptionForm({
  form,
  setForm,
  students,
  user,
  editingIndex,
  handleAddOrUpdate,
  handleChange
}) {
  const handleImageUpload = (e) => {
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
    <div className="form-column">
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
          <label>Tên thuốc *</label>
          <input
            name="drugName"
            value={form.drugName}
            onChange={handleChange}
            placeholder="Ví dụ: Paracetamol"
            required
          />
        </div>
        <div className="field">
          <label>Liều lượng (mg) *</label>
          <input
            name="dose"
            value={form.dose}
            onChange={handleChange}
            placeholder="Ví dụ: 500"
            required
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
          required
        />
      </div>

      {/* ✅ BẮT BUỘC ĐÍNH KÈM HÌNH ẢNH THUỐC */}
      <div className="field" style={{ marginTop: "12px" }}>
        <label style={{ color: "#d97706", fontWeight: "600" }}>
          📷 Hình ảnh thuốc (Bắt buộc) *
        </label>
        <input
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
          style={{ padding: "6px", border: "1px dashed #4F46E5", borderRadius: "6px", width: "100%" }}
        />
        {form.imageUrl && (
          <div style={{ marginTop: "8px", textAlign: "center" }}>
            <img
              src={form.imageUrl}
              alt="Ảnh thuốc"
              style={{ maxHeight: "120px", borderRadius: "8px", border: "2px solid #4F46E5", display: "inline-block" }}
            />
            <p style={{ fontSize: "12px", color: "#16a34a", marginTop: "4px" }}>✓ Đã tải ảnh thuốc thành công</p>
          </div>
        )}
      </div>

      <div className="two-fields" style={{ marginTop: "12px" }}>
        <div className="field">
          <label>Ngày bắt đầu *</label>
          <input
            type="date"
            name="startDate"
            value={form.startDate}
            onChange={handleChange}
          />
        </div>
        <div className="field">
          <label>Ngày kết thúc *</label>
          <input
            type="date"
            name="endDate"
            value={form.endDate}
            onChange={handleChange}
          />
        </div>
      </div>

      <button className="btn-add" onClick={handleAddOrUpdate} style={{ marginTop: "16px" }}>
        {editingIndex != null ? "Cập nhật thuốc" : "Thêm thuốc"}
      </button>
    </div>
  );
}
