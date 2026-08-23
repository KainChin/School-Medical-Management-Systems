import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./StudentProfile.css";
import AvatarImg from "../../../image/hinhanh/avatar.png";
import LogoImg from "../../../image/hinhanh/logoproject.png";

const StudentHealthProfile = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const tabRoutes = {
    "/patient-search": "Thông tin cá nhân",
    "/medications": "Đơn thuốc",
    "/vaccinations": "Lịch sử tiêm chủng",
    "/health-record": "Hồ sơ sức khỏe",
  };
  const activeTab = tabRoutes[location.pathname] || "Hồ sơ sức khỏe";

  const [children, setChildren] = useState([]);
  const [selectedStudentId, setSelectedStudentId] = useState(null);
  const [classList, setClassList] = useState([]);
  const [profile, setProfile] = useState({
    allergy: "",
    chronicDisease: "",
    medicalHistory: "",
    vision: "",
    hearing: "",
    height: "",
    weight: "",
    name: "",
    gender: "",
  });

  // State cho Modal thêm học sinh mới
  const [showAddModal, setShowAddModal] = useState(false);
  const [newStudent, setNewStudent] = useState({
    studentName: "",
    dob: "",
    gender: "Male",
    grade: "5A1",
    classId: 1,
    relationship: "Father",
    height: 150,
    weight: 45,
    allergy: "Không",
    chronicDisease: "Không",
    vision: "10/10",
    hearing: "Tốt",
    medicalHistory: "Không có",
    bmi: 20
  });

  const userId = localStorage.getItem("userId");
  const token = localStorage.getItem("token");

  const fetchMyChildren = () => {
    if (!userId || !token) return;

    fetch(`http://localhost:8080/api/students/my-children`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((res) => {
        if (res.success && Array.isArray(res.data)) {
          setChildren(res.data);
          if (res.data.length > 0 && !selectedStudentId) {
            setSelectedStudentId(res.data[0].id);
          }
        }
      })
      .catch((err) => console.error("❌ Lỗi lấy học sinh:", err));
  };

  useEffect(() => {
    fetchMyChildren();

    fetch("http://localhost:8080/api/classes")
      .then((res) => res.json())
      .then((data) => {
        const classes = Array.isArray(data) ? data : (data.data || []);
        if (classes.length > 0) {
          setClassList(classes);
          const firstCls = classes[0];
          setNewStudent((prev) => ({
            ...prev,
            classId: firstCls.id || firstCls.class_id || 1,
            grade: firstCls.className || "5A1"
          }));
        } else {
          setClassList([
            { id: 1, className: "5A1" },
            { id: 2, className: "5A2" },
            { id: 3, className: "4C1" }
          ]);
        }
      })
      .catch(() => {
        setClassList([
          { id: 1, className: "5A1" },
          { id: 2, className: "5A2" },
          { id: 3, className: "4C1" }
        ]);
      });
  }, [userId, token]);

  useEffect(() => {
    if (!selectedStudentId || !userId || !token || children.length === 0) return;

    const student = children.find((s) => s.id === Number(selectedStudentId));

    fetch(`http://localhost:8080/api/students/healthinfo?userId=${userId}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((res) => {
        if (Array.isArray(res)) {
          const info = res.find((h) => h.studentId === Number(selectedStudentId));
          setProfile({
            allergy: info?.allergy || "Không",
            chronicDisease: info?.chronicDisease || "Không",
            medicalHistory: info?.medicalHistory || "Không",
            vision: info?.vision || "10/10",
            hearing: info?.hearing || "Tốt",
            height: info?.height || "--",
            weight: info?.weight || "--",
            name: student?.name || "",
            gender: student?.gender || "",
          });
        }
      })
      .catch((err) => console.error("❌ Lỗi lấy health info:", err));
  }, [selectedStudentId, userId, token, children]);

  const handleTabClick = (label) => {
    const path = Object.keys(tabRoutes).find((k) => tabRoutes[k] === label);
    if (path && location.pathname !== path) navigate(path);
  };

  // ✅ HÀM VALIDATE DỮ LIỆU ĐẦU VÀO CỰC KỲ CHẶT CHẼ
  const validateStudentForm = () => {
    const nameTrimmed = newStudent.studentName.trim();
    
    // 1. Validate Họ và tên (Không chứa số hay ký tự đặc biệt, ít nhất 2 từ hoặc 2 ký tự)
    const nameRegex = /^[a-zA-ZàáãạảăắằẳẵặâấầẩẫậèéẹẻẽêềếểễệđìíĩỉịòóõọỏôốồổỗộơớờởỡợùúũụủưứừửữựỳỵỷỹýÀÁÃẠẢĂẮẰẲẴẶÂẤẦẨẪẬÈÉẸẺẼÊỀẾỂỄỆĐÌÍĨỈỊÒÓÕỌỎÔỐỒỔỖỘƠỚỜỞỠỢÙÚŨỤỦƯỨỪỬỮỰỲỴỶỸÝ\s]+$/;
    if (!nameTrimmed || nameTrimmed.length < 2) {
      alert("⚠️ Họ và tên học sinh phải có ít nhất 2 ký tự!");
      return false;
    }
    if (!nameRegex.test(nameTrimmed)) {
      alert("⚠️ Họ và tên học sinh chỉ được chứa chữ cái, không bao gồm số hay ký tự đặc biệt!");
      return false;
    }

    // 2. Validate Ngày sinh (Phải từ 5 đến 18 tuổi, không được chọn ngày tương lai)
    if (!newStudent.dob) {
      alert("⚠️ Vui lòng chọn ngày sinh cho học sinh!");
      return false;
    }
    const dobDate = new Date(newStudent.dob);
    const today = new Date();
    if (dobDate > today) {
      alert("⚠️ Ngày sinh không thể là một ngày trong tương lai!");
      return false;
    }
    const ageDiffMs = today - dobDate;
    const ageDate = new Date(ageDiffMs);
    const age = Math.abs(ageDate.getUTCFullYear() - 1970);
    if (age < 5 || age > 18) {
      alert(`⚠️ Độ tuổi học sinh không hợp lệ (${age} tuổi). Học sinh phải trong độ tuổi từ 5 đến 18 tuổi!`);
      return false;
    }

    // 3. Validate Chiều cao (50cm - 220cm)
    const height = Number(newStudent.height);
    if (isNaN(height) || height < 50 || height > 220) {
      alert("⚠️ Chiều cao không hợp lệ! Vui lòng nhập trong khoảng từ 50cm đến 220cm.");
      return false;
    }

    // 4. Validate Cân nặng (10kg - 150kg)
    const weight = Number(newStudent.weight);
    if (isNaN(weight) || weight < 10 || weight > 150) {
      alert("⚠️ Cân nặng không hợp lệ! Vui lòng nhập trong khoảng từ 10kg đến 150kg.");
      return false;
    }

    return true;
  };

  const handleAddStudentSubmit = async (e) => {
    e.preventDefault();

    // Chạy kiểm tra dữ liệu trước khi gửi
    if (!validateStudentForm()) return;

    try {
      const payload = {
        ...newStudent,
        studentName: newStudent.studentName.trim(),
        dob: new Date(newStudent.dob).toISOString(),
        height: Number(newStudent.height),
        weight: Number(newStudent.weight),
        classId: Number(newStudent.classId),
      };

      const res = await fetch("http://localhost:8080/api/students/save", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.message || "Thêm học sinh thất bại!");
      }

      alert("🎉 Thêm hồ sơ học sinh thành công!");
      setShowAddModal(false);
      setNewStudent({
        studentName: "",
        dob: "",
        gender: "Male",
        grade: classList[0]?.className || "5A1",
        classId: classList[0]?.id || 1,
        relationship: "Father",
        height: 150,
        weight: 45,
        allergy: "Không",
        chronicDisease: "Không",
        vision: "10/10",
        hearing: "Tốt",
        medicalHistory: "Không có",
        bmi: 20
      });
      fetchMyChildren();
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="student-profile-page">
      <aside className="sidebar">
        <div className="brand-box">
          <img src={LogoImg} alt="Logo" className="brand-icon" />
          <div className="brand-text">
            <h1>SchoMed</h1>
            <p>School Medical</p>
          </div>
        </div>
        <nav className="sidebar-nav">
          {Object.entries(tabRoutes).map(([path, label]) => (
            <button
              key={path}
              onClick={() => navigate(path)}
              className={location.pathname === path ? "active" : ""}
            >
              {label}
            </button>
          ))}
        </nav>
      </aside>

      <main className="profile-main">
        <button className="home-button" onClick={() => navigate("/")}>
          ⬅ Quay về trang chính
        </button>

        <div className="profile-card">
          <div className="profile-overview">
            <img src={AvatarImg} alt="avatar" className="avatar" />
            <div className="info-text" style={{ flex: 1 }}>
              <h2>Hồ sơ sức khỏe học sinh</h2>

              <div style={{ display: "flex", itemsCenter: "center", gap: "12px", marginTop: "8px" }}>
                <label>Chọn học sinh:</label>
                <select
                  value={selectedStudentId || ""}
                  onChange={(e) => setSelectedStudentId(e.target.value)}
                  style={{ padding: "6px 12px", borderRadius: "6px", border: "1px solid #ccc" }}
                >
                  {children.map((child) => (
                    <option key={child.id} value={child.id}>
                      {child.name} ({child.grade})
                    </option>
                  ))}
                </select>

                <button
                  type="button"
                  onClick={() => setShowAddModal(true)}
                  style={{
                    backgroundColor: "#5e50e6",
                    color: "white",
                    border: "none",
                    padding: "6px 14px",
                    borderRadius: "6px",
                    cursor: "pointer",
                    fontWeight: "500"
                  }}
                >
                  ➕ Thêm con / học sinh mới
                </button>
              </div>
            </div>
          </div>

          <div className="profile-tabs">
            {Object.values(tabRoutes).map((label) => (
              <span
                key={label}
                className={`tab ${activeTab === label ? "active" : ""}`}
                onClick={() => handleTabClick(label)}
              >
                {label}
              </span>
            ))}
          </div>

          <div className="profile-detail">
            <div className="info-columns">
              <div className="contact-left">
                <p><strong>Họ tên:</strong> {profile.name || "Chưa chọn"}</p>
                <p><strong>Giới tính:</strong> {profile.gender}</p>
                <p><strong>Dị ứng:</strong> {profile.allergy}</p>
                <p><strong>Bệnh mãn tính:</strong> {profile.chronicDisease}</p>
              </div>
              <div className="contact-right" style={{ marginLeft: "100px" }}>
                <p><strong>Chiều cao:</strong> {profile.height} cm</p>
                <p><strong>Cân nặng:</strong> {profile.weight} kg</p>
                <p><strong>Thị lực:</strong> {profile.vision}</p>
                <p><strong>Thính lực:</strong> {profile.hearing}</p>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Modal Thêm Học Sinh Mới */}
      {showAddModal && (
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
            width: "500px",
            maxHeight: "90vh",
            overflowY: "auto",
            boxShadow: "0 4px 20px rgba(0,0,0,0.15)"
          }}>
            <h3 style={{ fontSize: "20px", marginBottom: "16px", color: "#5e50e6" }}>➕ Thêm hồ sơ con mới</h3>
            <form onSubmit={handleAddStudentSubmit}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                <div>
                  <label style={{ fontSize: "13px", fontWeight: "600" }}>Họ và tên học sinh *</label>
                  <input
                    type="text"
                    required
                    placeholder="VD: Nguyễn Văn An"
                    value={newStudent.studentName}
                    onChange={(e) => setNewStudent({ ...newStudent, studentName: e.target.value })}
                    style={{ width: "100%", padding: "8px", borderRadius: "6px", border: "1px solid #ccc", marginTop: "4px" }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: "13px", fontWeight: "600" }}>Ngày sinh *</label>
                  <input
                    type="date"
                    required
                    value={newStudent.dob}
                    onChange={(e) => setNewStudent({ ...newStudent, dob: e.target.value })}
                    style={{ width: "100%", padding: "8px", borderRadius: "6px", border: "1px solid #ccc", marginTop: "4px" }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: "13px", fontWeight: "600" }}>Giới tính</label>
                  <select
                    value={newStudent.gender}
                    onChange={(e) => setNewStudent({ ...newStudent, gender: e.target.value })}
                    style={{ width: "100%", padding: "8px", borderRadius: "6px", border: "1px solid #ccc", marginTop: "4px" }}
                  >
                    <option value="Male">Nam</option>
                    <option value="Female">Nữ</option>
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: "13px", fontWeight: "600" }}>Chọn Khối / Lớp</label>
                  <select
                    value={newStudent.classId}
                    onChange={(e) => {
                      const selectedId = Number(e.target.value);
                      const cls = classList.find((c) => (c.id || c.class_id) === selectedId);
                      setNewStudent({
                        ...newStudent,
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
                  <label style={{ fontSize: "13px", fontWeight: "600" }}>Mối quan hệ</label>
                  <select
                    value={newStudent.relationship}
                    onChange={(e) => setNewStudent({ ...newStudent, relationship: e.target.value })}
                    style={{ width: "100%", padding: "8px", borderRadius: "6px", border: "1px solid #ccc", marginTop: "4px" }}
                  >
                    <option value="Father">Bố (Father)</option>
                    <option value="Mother">Mẹ (Mother)</option>
                    <option value="Guardian">Người giám hộ</option>
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: "13px", fontWeight: "600" }}>Chiều cao (cm)</label>
                  <input
                    type="number"
                    min="50"
                    max="220"
                    value={newStudent.height}
                    onChange={(e) => setNewStudent({ ...newStudent, height: e.target.value })}
                    style={{ width: "100%", padding: "8px", borderRadius: "6px", border: "1px solid #ccc", marginTop: "4px" }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: "13px", fontWeight: "600" }}>Cân nặng (kg)</label>
                  <input
                    type="number"
                    min="10"
                    max="150"
                    value={newStudent.weight}
                    onChange={(e) => setNewStudent({ ...newStudent, weight: e.target.value })}
                    style={{ width: "100%", padding: "8px", borderRadius: "6px", border: "1px solid #ccc", marginTop: "4px" }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: "13px", fontWeight: "600" }}>Dị ứng</label>
                  <input
                    type="text"
                    value={newStudent.allergy}
                    onChange={(e) => setNewStudent({ ...newStudent, allergy: e.target.value })}
                    style={{ width: "100%", padding: "8px", borderRadius: "6px", border: "1px solid #ccc", marginTop: "4px" }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: "13px", fontWeight: "600" }}>Thị lực</label>
                  <select
                    value={newStudent.vision}
                    onChange={(e) => setNewStudent({ ...newStudent, vision: e.target.value })}
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
                    value={newStudent.hearing}
                    onChange={(e) => setNewStudent({ ...newStudent, hearing: e.target.value })}
                    style={{ width: "100%", padding: "8px", borderRadius: "6px", border: "1px solid #ccc", marginTop: "4px" }}
                  >
                    <option value="Tốt">Tốt</option>
                    <option value="Bình thường">Bình thường</option>
                    <option value="Suy giảm nhẹ">Suy giảm nhẹ</option>
                  </select>
                </div>
              </div>

              <div style={{ marginTop: "16px", display: "flex", justifyContent: "flex-end", gap: "12px" }}>
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  style={{ padding: "8px 16px", borderRadius: "6px", border: "1px solid #ccc", background: "#f5f5f5", cursor: "pointer" }}
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  style={{ padding: "8px 16px", borderRadius: "6px", border: "none", background: "#5e50e6", color: "white", fontWeight: "600", cursor: "pointer" }}
                >
                  💾 Lưu hồ sơ
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentHealthProfile;
