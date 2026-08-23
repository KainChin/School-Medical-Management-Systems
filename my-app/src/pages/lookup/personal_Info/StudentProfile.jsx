import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./StudentProfile.css";
import AvatarImg from "../../../image/hinhanh/avatar.png";
import StudentSidebar from "./StudentSidebar";
import StudentModal from "./StudentModal";

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
    allergy: "", chronicDisease: "", medicalHistory: "", vision: "", hearing: "",
    height: "", weight: "", name: "", gender: "", dob: "", grade: "", classId: 1
  });

  const [showModal, setShowModal] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [studentForm, setStudentForm] = useState({
    studentName: "", dob: "", gender: "Male", grade: "5A1", classId: 1,
    relationship: "Father", height: 150, weight: 45, allergy: "Không",
    chronicDisease: "Không", vision: "10/10", hearing: "Tốt", medicalHistory: "Không có", bmi: 20
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
      .then((data) => setClassList(Array.isArray(data) ? data : (data.data || [])))
      .catch(() => setClassList([{ id: 1, className: "5A1" }]));
  }, [userId, token]);

  const fetchHealthInfo = () => {
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
            allergy: info?.allergy || "Không", chronicDisease: info?.chronicDisease || "Không",
            medicalHistory: info?.medicalHistory || "Không", vision: info?.vision || "10/10",
            hearing: info?.hearing || "Tốt", height: info?.height || 150, weight: info?.weight || 45,
            name: student?.name || "", gender: student?.gender || "Male", dob: student?.dateOfBirth || "",
            grade: student?.grade || "5A1", classId: student?.classId || 1
          });
        }
      })
      .catch((err) => console.error("❌ Lỗi lấy health info:", err));
  };

  useEffect(() => {
    fetchHealthInfo();
  }, [selectedStudentId, userId, token, children]);

  const validateStudentForm = () => {
    const nameTrimmed = studentForm.studentName.trim();
    const nameRegex = /^[a-zA-ZàáãạảăắằẳẵặâấầẩẫậèéẹẻẽêềếểễệđìíĩỉịòóõọỏôốồổỗộơớờởỡợùúũụủưứừửữựỳỵỷỹýÀÁÃẠẢĂẮẰẲẴẶÂẤẦẨẪẬÈÉẸẺẼÊỀẾỂỄỆĐÌÍĨỈỊÒÓÕỌỎÔỐỒỔỖỘƠỚỜỞỠỢÙÚŨỤỦƯỨỪỬỮỰỲỴỶỸÝ\s]+$/;
    if (!nameTrimmed || nameTrimmed.length < 2 || !nameRegex.test(nameTrimmed)) {
      alert("⚠️ Họ và tên học sinh không hợp lệ!"); return false;
    }
    if (!studentForm.dob) { alert("⚠️ Vui lòng chọn ngày sinh!"); return false; }
    const age = Math.abs(new Date(new Date() - new Date(studentForm.dob)).getUTCFullYear() - 1970);
    if (age < 5 || age > 18) { alert(`⚠️ Độ tuổi học sinh (${age}) phải từ 5 đến 18 tuổi!`); return false; }
    return true;
  };

  const handleOpenAddModal = () => {
    setIsEditMode(false);
    setStudentForm({
      studentName: "", dob: "", gender: "Male", grade: classList[0]?.className || "5A1",
      classId: classList[0]?.id || 1, relationship: "Father", height: 150, weight: 45,
      allergy: "Không", chronicDisease: "Không", vision: "10/10", hearing: "Tốt", medicalHistory: "Không có", bmi: 20
    });
    setShowModal(true);
  };

  const handleOpenEditModal = () => {
    if (!selectedStudentId) return;
    setIsEditMode(true);
    setStudentForm({
      studentName: profile.name || "", dob: profile.dob || "", gender: profile.gender || "Male",
      grade: profile.grade || "5A1", classId: profile.classId || 1, relationship: "Father",
      height: profile.height || 150, weight: profile.weight || 45, allergy: profile.allergy || "Không",
      chronicDisease: profile.chronicDisease || "Không", vision: profile.vision || "10/10",
      hearing: profile.hearing || "Tốt", medicalHistory: profile.medicalHistory || "Không có", bmi: 20
    });
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateStudentForm()) return;
    try {
      const payload = {
        ...studentForm, studentName: studentForm.studentName.trim(), dob: new Date(studentForm.dob).toISOString(),
        height: Number(studentForm.height), weight: Number(studentForm.weight), classId: Number(studentForm.classId), bmi: Number(studentForm.bmi) || 20
      };
      const url = isEditMode ? `http://localhost:8080/api/students/update/${selectedStudentId}` : `http://localhost:8080/api/students/save`;
      const res = await fetch(url, {
        method: isEditMode ? "PUT" : "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.message || "Thất bại!");
      alert(isEditMode ? "🎉 Cập nhật hồ sơ học sinh thành công!" : "🎉 Thêm hồ sơ thành công!");
      setShowModal(false); fetchMyChildren(); fetchHealthInfo();
    } catch (err) { alert(err.message); }
  };

  return (
    <div className="student-profile-page">
      <StudentSidebar tabRoutes={tabRoutes} />
      <main className="profile-main">
        <button className="home-button" onClick={() => navigate("/")}>⬅ Quay về trang chính</button>
        <div className="profile-card">
          <div className="profile-overview">
            <img src={AvatarImg} alt="avatar" className="avatar" />
            <div className="info-text" style={{ flex: 1 }}>
              <h2>Hồ sơ sức khỏe học sinh</h2>
              <div style={{ display: "flex", alignItems: "center", gap: "12px", marginTop: "8px", flexWrap: "wrap" }}>
                <label>Chọn học sinh:</label>
                <select value={selectedStudentId || ""} onChange={(e) => setSelectedStudentId(e.target.value)} style={{ padding: "6px 12px", borderRadius: "6px", border: "1px solid #ccc" }}>
                  {children.map((child) => (<option key={child.id} value={child.id}>{child.name} ({child.grade})</option>))}
                </select>
                <button type="button" onClick={handleOpenAddModal} style={{ backgroundColor: "#5e50e6", color: "white", border: "none", padding: "6px 14px", borderRadius: "6px", cursor: "pointer", fontWeight: "500" }}>➕ Thêm học sinh mới</button>
                {selectedStudentId && (<button type="button" onClick={handleOpenEditModal} style={{ backgroundColor: "#eab308", color: "white", border: "none", padding: "6px 14px", borderRadius: "6px", cursor: "pointer", fontWeight: "500" }}>✏️ Chỉnh sửa hồ sơ</button>)}
              </div>
            </div>
          </div>
          <div className="profile-tabs">
            {Object.values(tabRoutes).map((label) => (
              <span key={label} className={`tab ${activeTab === label ? "active" : ""}`} onClick={() => navigate(Object.keys(tabRoutes).find((k) => tabRoutes[k] === label))}>{label}</span>
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
      <StudentModal showModal={showModal} setShowModal={setShowModal} isEditMode={isEditMode} studentForm={studentForm} setStudentForm={setStudentForm} classList={classList} handleSubmit={handleSubmit} />
    </div>
  );
};

export default StudentHealthProfile;
