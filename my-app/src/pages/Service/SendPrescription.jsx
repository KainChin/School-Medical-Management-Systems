import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";
import PrescriptionForm from "./PrescriptionForm";
import PrescriptionList from "./PrescriptionList";
import "./SendPrescription.css";

export default function SendPrescription() {
  const navigate = useNavigate();

  const getToken = () => localStorage.getItem("token") || localStorage.getItem("jwt");
  function today() {
    return new Date().toISOString().split("T")[0];
  }

  const [user, setUser] = useState({
    name: localStorage.getItem("userName") || "",
    id: parseInt(localStorage.getItem("userId") || "0", 10),
  });

  const [form, setForm] = useState({
    selectedIndex: "",
    drugName: "",
    dose: "",
    note: "",
    imageUrl: "",
    startDate: today(),
    endDate: today(),
  });

  const [students, setStudents] = useState([]);
  const [items, setItems] = useState([]);
  const [editingIndex, setEditingIndex] = useState(null);
  const [statusMessage, setStatusMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const token = getToken();
    if (!token) return;

    fetch("http://localhost:8080/api/notifications/parent", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => (r.ok ? r.json() : Promise.reject()))
      .then((me) => {
        const userId = me.user_id || me.userId || me.id;
        const userName = localStorage.getItem("userName") || "Phụ huynh";
        setUser({ name: userName, id: userId });
        localStorage.setItem("userId", userId?.toString() || "");
      })
      .catch(console.error);
  }, []);

  useEffect(() => {
    const token = getToken();
    if (!token) return;
    fetch("http://localhost:8080/api/students/my-children", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => (r.ok ? r.json() : Promise.reject()))
      .then((res) => {
        const list = res.data || res;
        if (Array.isArray(list)) {
          setStudents(
            list.map((c) => ({
              studentId: c.studentId ?? c.id,
              studentName: c.studentName ?? c.name,
              parentName: c.parentName || user.name,
            }))
          );
        }
      })
      .catch(console.error);
  }, [user.name]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => {
      const updated = { ...f, [name]: value };
      if (name === "startDate") {
        const minStart = today();
        if (value < minStart) updated.startDate = minStart;
        if (updated.endDate < updated.startDate) updated.endDate = updated.startDate;
      }
      if (name === "endDate" && value < updated.startDate) {
        updated.endDate = updated.startDate;
      }
      return updated;
    });
  };

  // ✅ THÊM HOẶC CẬP NHẬT THUỐC VÀO DANH SÁCH + TỰ ĐỘNG RESET Ô NHẬP THUỐC
  const handleAddToList = () => {
    if (form.selectedIndex === "") {
      alert("⚠️ Vui lòng chọn Học sinh!");
      return;
    }
    if (!form.drugName.trim()) {
      alert("⚠️ Vui lòng nhập Tên thuốc!");
      return;
    }
    if (!form.dose.trim() || isNaN(Number(form.dose))) {
      alert("⚠️ Liều lượng thuốc phải là con số hợp lệ!");
      return;
    }
    if (!form.note.trim()) {
      alert("⚠️ Vui lòng nhập Số lần uống!");
      return;
    }
    if (!form.imageUrl) {
      alert("⚠️ Vui lòng tải ảnh hoặc dán URL HÌNH ẢNH THUỐC!");
      return;
    }

    const stu = students[Number(form.selectedIndex)];
    const entry = {
      studentId: stu.studentId,
      studentName: stu.studentName,
      medicationName: form.drugName.trim(),
      dosage: form.dose.trim() + "mg",
      frequency: form.note.trim(),
      imageUrl: form.imageUrl,
      startDate: form.startDate,
      endDate: form.endDate,
      parentName: stu.parentName || user.name,
      status: "PENDING",
      parentUserId: user.id,
    };

    if (editingIndex != null) {
      setItems((list) => list.map((it, i) => (i === editingIndex ? entry : it)));
    } else {
      setItems((list) => [...list, entry]);
    }

    // Reset ô nhập thuốc để phụ huynh gõ thuốc tiếp theo siêu nhanh!
    setForm((f) => ({ ...f, drugName: "", dose: "", note: "", imageUrl: "" }));
    setEditingIndex(null);
    setStatusMessage("");
  };

  const handleEditItem = (idx) => {
    const it = items[idx];
    const foundIdx = students.findIndex((s) => s.studentId === it.studentId);
    setForm({
      selectedIndex: String(foundIdx !== -1 ? foundIdx : ""),
      drugName: it.medicationName,
      dose: it.dosage.replace(/mg$/, ""),
      note: it.frequency,
      imageUrl: it.imageUrl || "",
      startDate: it.startDate,
      endDate: it.endDate,
    });
    setEditingIndex(idx);
    setStatusMessage("");
  };

  const removeItem = (idx) => {
    setItems((list) => list.filter((_, i) => i !== idx));
    if (editingIndex === idx) setEditingIndex(null);
    setStatusMessage("");
  };

  // ✅ GỬI TOÀN BỘ DANH SÁCH THUỐC
  const handleConfirmSend = async () => {
    if (!items.length) return;
    const token = getToken();
    if (!token) {
      navigate("/login");
      return;
    }

    setIsSubmitting(true);
    try {
      const promises = items.map((item) =>
        fetch("http://localhost:8080/api/medication-submissions", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(item),
        })
      );

      const responses = await Promise.all(promises);
      const allSuccess = responses.every((res) => res.ok);

      if (allSuccess) {
        setItems([]);
        setStatusMessage(`🎉 Gửi thành công đơn gồm ${items.length} loại thuốc cho Y tá nhà trường!`);
      } else {
        setStatusMessage("❌ Không gửi được đơn thuốc. Vui lòng thử lại.");
      }
    } catch (err) {
      console.error("Lỗi gửi thuốc:", err);
      setStatusMessage("❌ Lỗi kết nối máy chủ, vui lòng thử lại.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Header />
      <div className="breadcrumb-container">
        <nav className="breadcrumb">
          <Link to="/" className="breadcrumb-link">Trang chủ</Link>
          <span className="breadcrumb-sep">›</span>
          <Link to="/services" className="breadcrumb-link">Dịch vụ</Link>
          <span className="breadcrumb-sep">›</span>
          <span className="breadcrumb-current">Gửi đơn thuốc</span>
        </nav>
      </div>
      <div className="send-prescription-page">
        <div className="send-prescription-content">
          <PrescriptionForm
            form={form}
            setForm={setForm}
            students={students}
            user={user}
            editingIndex={editingIndex}
            handleAddToList={handleAddToList}
            handleChange={handleChange}
            today={today}
          />
          <PrescriptionList
            items={items}
            handleEditItem={handleEditItem}
            removeItem={removeItem}
            handleConfirmSend={handleConfirmSend}
            statusMessage={statusMessage}
            isSubmitting={isSubmitting}
          />
        </div>
      </div>
      <Footer />
    </>
  );
}
