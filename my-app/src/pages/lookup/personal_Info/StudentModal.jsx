import React from "react";

export default function StudentModal({
  showModal,
  setShowModal,
  isEditMode,
  studentForm,
  setStudentForm,
  classList,
  handleSubmit
}) {
  if (!showModal) return null;

  const handleHeightWeightChange = (field, value) => {
    setStudentForm((prev) => {
      const updated = { ...prev, [field]: value };
      const h = parseFloat(updated.height);
      const w = parseFloat(updated.weight);
      if (h > 0 && w > 0) {
        const heightInMeters = h / 100;
        updated.bmi = (w / (heightInMeters * heightInMeters)).toFixed(1);
      } else {
        updated.bmi = 20;
      }
      return updated;
    });
  };

  return (
    <div style={{
      position: "fixed",
      top: 0, left: 0, right: 0, bottom: 0,
      backgroundColor: "rgba(0,0,0,0.5)",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      zIndex: 1000
    }}>
      <div style={{
        backgroundColor: "white",
        padding: "24px",
        borderRadius: "12px",
        width: "520px",
        maxHeight: "90vh",
        overflowY: "auto",
        boxShadow: "0 4px 20px rgba(0,0,0,0.15)"
      }}>
        <h3 style={{ fontSize: "20px", marginBottom: "16px", color: "#5e50e6" }}>
          {isEditMode ? "✏️ Chỉnh sửa hồ sơ học sinh" : "➕ Thêm hồ sơ học sinh mới"}
        </h3>
        <form onSubmit={handleSubmit}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
            <div>
              <label style={{ fontSize: "13px", fontWeight: "600" }}>Họ và tên học sinh *</label>
              <input
                type="text"
                required
                placeholder="VD: Nguyễn Văn An"
                value={studentForm.studentName}
                onChange={(e) => setStudentForm({ ...studentForm, studentName: e.target.value })}
                style={{ width: "100%", padding: "8px", borderRadius: "6px", border: "1px solid #ccc", marginTop: "4px" }}
              />
            </div>
            <div>
              <label style={{ fontSize: "13px", fontWeight: "600" }}>Ngày sinh *</label>
              <input
                type="date"
                required
                value={studentForm.dob}
                onChange={(e) => setStudentForm({ ...studentForm, dob: e.target.value })}
                style={{ width: "100%", padding: "8px", borderRadius: "6px", border: "1px solid #ccc", marginTop: "4px" }}
              />
            </div>
            <div>
              <label style={{ fontSize: "13px", fontWeight: "600" }}>Giới tính</label>
              <select
                value={studentForm.gender}
                onChange={(e) => setStudentForm({ ...studentForm, gender: e.target.value })}
                style={{ width: "100%", padding: "8px", borderRadius: "6px", border: "1px solid #ccc", marginTop: "4px" }}
              >
                <option value="Male">Nam</option>
                <option value="Female">Nữ</option>
              </select>
            </div>
            <div>
              <label style={{ fontSize: "13px", fontWeight: "600" }}>Chọn Khối / Lớp</label>
              <select
                value={studentForm.classId}
                onChange={(e) => {
                  const selectedId = Number(e.target.value);
                  const cls = classList.find((c) => (c.id || c.class_id) === selectedId);
                  setStudentForm({
                    ...studentForm,
                    classId: selectedId,
                    grade: cls ? cls.className : "5A1"
                  });
                }}
                style={{ width: "100%", padding: "8px", borderRadius: "6px", border: "1px solid #ccc", marginTop: "4px" }}
              >
                {classList.map((cls) => {
                  const cId = cls.id || cls.class_id;
                  const roomText = cls.room ? (cls.room.startsWith('P.') ? cls.room.replace('P.', 'Phòng ') : cls.room) : '';
                  return (
                    <option key={cId || cls.className} value={cId}>
                      {cls.className} {roomText ? `– ${roomText}` : ''}
                    </option>
                  );
                })}
              </select>
            </div>
            <div>
              <label style={{ fontSize: "13px", fontWeight: "600" }}>Chiều cao (cm)</label>
              <input
                type="number"
                min="50"
                max="220"
                value={studentForm.height}
                onChange={(e) => handleHeightWeightChange("height", e.target.value)}
                style={{ width: "100%", padding: "8px", borderRadius: "6px", border: "1px solid #ccc", marginTop: "4px" }}
              />
            </div>
            <div>
              <label style={{ fontSize: "13px", fontWeight: "600" }}>Cân nặng (kg)</label>
              <input
                type="number"
                min="10"
                max="150"
                value={studentForm.weight}
                onChange={(e) => handleHeightWeightChange("weight", e.target.value)}
                style={{ width: "100%", padding: "8px", borderRadius: "6px", border: "1px solid #ccc", marginTop: "4px" }}
              />
            </div>
            <div>
              <label style={{ fontSize: "13px", fontWeight: "600" }}>Thị lực</label>
              <select
                value={studentForm.vision}
                onChange={(e) => setStudentForm({ ...studentForm, vision: e.target.value })}
                style={{ width: "100%", padding: "8px", borderRadius: "6px", border: "1px solid #ccc", marginTop: "4px" }}
              >
                <option value="10/10">10/10 (Mắt tốt)</option>
                <option value="9/10">9/10</option>
                <option value="8/10">8/10</option>
                <option value="7/10">7/10</option>
                <option value="Cận thị">Cận thị</option>
                <option value="Viễn thị">Viễn thị</option>
                <option value="Loạn thị">Loạn thị</option>
              </select>
            </div>
            <div>
              <label style={{ fontSize: "13px", fontWeight: "600" }}>Thính lực</label>
              <select
                value={studentForm.hearing}
                onChange={(e) => setStudentForm({ ...studentForm, hearing: e.target.value })}
                style={{ width: "100%", padding: "8px", borderRadius: "6px", border: "1px solid #ccc", marginTop: "4px" }}
              >
                <option value="Tốt">Tốt</option>
                <option value="Bình thường">Bình thường</option>
                <option value="Suy giảm nhẹ">Suy giảm nhẹ</option>
              </select>
            </div>
            <div style={{ gridColumn: "span 2" }}>
              <label style={{ fontSize: "13px", fontWeight: "600" }}>Dị ứng</label>
              <input
                type="text"
                value={studentForm.allergy}
                onChange={(e) => setStudentForm({ ...studentForm, allergy: e.target.value })}
                style={{ width: "100%", padding: "8px", borderRadius: "6px", border: "1px solid #ccc", marginTop: "4px" }}
              />
            </div>
            <div style={{ gridColumn: "span 2" }}>
              <label style={{ fontSize: "13px", fontWeight: "600" }}>Bệnh mãn tính</label>
              <input
                type="text"
                value={studentForm.chronicDisease}
                onChange={(e) => setStudentForm({ ...studentForm, chronicDisease: e.target.value })}
                style={{ width: "100%", padding: "8px", borderRadius: "6px", border: "1px solid #ccc", marginTop: "4px" }}
              />
            </div>
          </div>

          <div style={{ marginTop: "16px", display: "flex", justifyContent: "flex-end", gap: "12px" }}>
            <button
              type="button"
              onClick={() => setShowModal(false)}
              style={{ padding: "8px 16px", borderRadius: "6px", border: "1px solid #ccc", background: "#f5f5f5", cursor: "pointer" }}
            >
              Hủy
            </button>
            <button
              type="submit"
              style={{ padding: "8px 16px", borderRadius: "6px", border: "none", background: "#5e50e6", color: "white", fontWeight: "600", cursor: "pointer" }}
            >
              {isEditMode ? "💾 Lưu cập nhật" : "💾 Lưu hồ sơ"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
