import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";

export default function HealthFormApp() {
  const [classes, setClasses] = useState([]);
  const [loadError, setLoadError] = useState("");
  const [formData, setFormData] = useState({
    fullName: "",
    dob: "",
    gender: "",
    classId: "",
    relationship: "",
    allergy: "Không",
    chronicDisease: "Không",
    medicalHistory: "Không có",
    vision: "10/10",
    hearing: "Tốt",
    height: "",
    weight: "",
    bmi: "",
    grade: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userId = localStorage.getItem("userId");
    if (!token || !userId) {
      alert("Bạn cần đăng nhập để sử dụng chức năng này.");
      navigate("/login");
      return;
    }

    fetch("http://localhost:8080/api/classes")
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status} ${res.statusText}`);
        return res.json();
      })
      .then((data) => setClasses(Array.isArray(data) ? data : (data.data || [])))
      .catch((err) =>
        setLoadError("Không thể tải danh sách lớp: " + err.message)
      );
  }, [navigate]);

  // ✅ Tự động tính BMI khi Chiều cao hoặc Cân nặng thay đổi
  const handleHeightWeightChange = (field, value) => {
    setFormData((prev) => {
      const updated = { ...prev, [field]: value };
      const h = parseFloat(updated.height);
      const w = parseFloat(updated.weight);
      if (h > 0 && w > 0) {
        const heightInMeters = h / 100;
        const bmiVal = (w / (heightInMeters * heightInMeters)).toFixed(1);
        updated.bmi = bmiVal;
      } else {
        updated.bmi = "";
      }
      return updated;
    });
  };

  const handleChange = (field, value) =>
    setFormData((fd) => ({ ...fd, [field]: value }));

  const handleClassSelect = (value) => {
    const cls = classes.find((c) => (c.id || c.class_id) === Number(value));
    const grade = cls?.className.match(/^(\d+)/)?.[1] || "";
    setFormData((fd) => ({ ...fd, classId: value, grade }));
  };

  // ✅ HÀM VALIDATE CHẶT CHẼ DỮ LIỆU ĐẦU VÀO
  const validateForm = () => {
    const nameTrimmed = formData.fullName.trim();
    const nameRegex = /^[a-zA-ZàáãạảăắằẳẵặâấầẩẫậèéẹẻẽêềếểễệđìíĩỉịòóõọỏôốồổỗộơớờởỡợùúũụủưứừửữựỳỵỷỹýÀÁÃẠẢĂẮẰẲẴẶÂẤẦẨẪẬÈÉẸẺẼÊỀẾỂỄỆĐÌÍĨỈỊÒÓÕỌỎÔỐỒỔỖỘƠỚỜỞỠỢÙÚŨỤỦƯỨỪỬỮỰỲỴỶỸÝ\s]+$/;

    // 1. Họ và tên
    if (!nameTrimmed || nameTrimmed.length < 2) {
      alert("⚠️ Họ và tên học sinh phải chứa ít nhất 2 ký tự!");
      return false;
    }
    if (!nameRegex.test(nameTrimmed)) {
      alert("⚠️ Họ và tên học sinh chỉ được chứa chữ cái, không bao gồm số hay ký tự đặc biệt!");
      return false;
    }

    // 2. Ngày sinh & Độ tuổi
    if (!formData.dob) {
      alert("⚠️ Vui lòng chọn ngày sinh!");
      return false;
    }
    const dobDate = new Date(formData.dob);
    const today = new Date();
    if (dobDate > today) {
      alert("⚠️ Ngày sinh không thể nằm trong tương lai!");
      return false;
    }
    const ageDiffMs = today - dobDate;
    const ageDate = new Date(ageDiffMs);
    const age = Math.abs(ageDate.getUTCFullYear() - 1970);
    if (age < 5 || age > 18) {
      alert(`⚠️ Độ tuổi học sinh không hợp lệ (${age} tuổi). Học sinh phải nằm trong độ tuổi từ 5 đến 18 tuổi!`);
      return false;
    }

    // 3. Giới tính, Lớp, Mối quan hệ
    if (!formData.gender) {
      alert("⚠️ Vui lòng chọn Giới tính!");
      return false;
    }
    if (!formData.classId) {
      alert("⚠️ Vui lòng chọn Lớp học!");
      return false;
    }
    if (!formData.relationship) {
      alert("⚠️ Vui lòng chọn Mối quan hệ với học sinh!");
      return false;
    }

    // 4. Chiều cao & Cân nặng
    const height = parseFloat(formData.height);
    if (isNaN(height) || height < 50 || height > 220) {
      alert("⚠️ Chiều cao không hợp lệ! Vui lòng nhập trong khoảng 50 cm đến 220 cm.");
      return false;
    }

    const weight = parseFloat(formData.weight);
    if (isNaN(weight) || weight < 10 || weight > 150) {
      alert("⚠️ Cân nặng không hợp lệ! Vui lòng nhập trong khoảng 10 kg đến 150 kg.");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);
    setSubmitMessage("");

    try {
      const parentId = localStorage.getItem("userId");
      const token = localStorage.getItem("token");

      if (!parentId || isNaN(parentId)) {
        setSubmitMessage("Không tìm thấy tài khoản phụ huynh. Vui lòng đăng nhập lại.");
        setIsSubmitting(false);
        return;
      }

      if (!token) {
        setSubmitMessage("Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại.");
        setIsSubmitting(false);
        return;
      }

      const payload = {
        studentName: formData.fullName.trim(),
        dob: formData.dob,
        gender: formData.gender,
        grade: formData.grade,
        classId: Number(formData.classId),
        parentUserId: Number(parentId),
        relationship: formData.relationship,
        allergy: formData.allergy || "Không",
        chronicDisease: formData.chronicDisease || "Không",
        vision: formData.vision || "10/10",
        hearing: formData.hearing || "Tốt",
        medicalHistory: formData.medicalHistory || "Không có",
        height: parseFloat(formData.height),
        weight: parseFloat(formData.weight),
        bmi: parseFloat(formData.bmi) || 20,
      };

      const res = await fetch("http://localhost:8080/api/students/save", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const text = await res.text();

      if (!res.ok || text.toLowerCase().includes("lỗi")) {
        throw new Error(text || res.statusText);
      }

      setSubmitMessage("🎉 Lưu thông tin sức khỏe học sinh thành công!");
      setTimeout(() => navigate("/patient-search"), 1200);
    } catch (err) {
      console.error("❌ Lỗi gửi form:", err);
      setSubmitMessage("Có lỗi khi gửi: " + err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setFormData({
      fullName: "",
      dob: "",
      gender: "",
      classId: "",
      relationship: "",
      allergy: "Không",
      chronicDisease: "Không",
      medicalHistory: "Không có",
      vision: "10/10",
      hearing: "Tốt",
      height: "",
      weight: "",
      bmi: "",
      grade: ""
    });
    setSubmitMessage("");
  };

  return (
    <>
      <Header />
      <div className="bg-gray-100 py-12 min-h-screen">
        <div className="max-w-3xl mx-auto bg-white shadow-lg rounded-2xl p-8">
          <h1 className="text-2xl font-bold text-gray-800 mb-6 text-center">
            PHIẾU NHẬP THÔNG TIN SỨC KHỎE HỌC SINH
          </h1>
          {loadError && (
            <p className="text-red-600 text-center mb-4">{loadError}</p>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <fieldset className="border border-gray-200 rounded-lg p-6">
              <legend className="px-2 text-lg font-semibold text-gray-700">
                Thông tin cá nhân
              </legend>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <div className="flex flex-col">
                  <label className="mb-2 text-sm font-medium text-gray-700">
                    Họ và tên học sinh *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="VD: Nguyễn Văn An"
                    className="border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    value={formData.fullName}
                    onChange={(e) => handleChange("fullName", e.target.value)}
                  />
                </div>
                <div className="flex flex-col">
                  <label className="mb-2 text-sm font-medium text-gray-700">
                    Ngày sinh *
                  </label>
                  <input
                    type="date"
                    required
                    className="border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    value={formData.dob}
                    onChange={(e) => handleChange("dob", e.target.value)}
                  />
                </div>
                <div className="flex flex-col md:col-span-1">
                  <label className="mb-2 text-sm font-medium text-gray-700">
                    Giới tính *
                  </label>
                  <select
                    required
                    className="border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    value={formData.gender}
                    onChange={(e) => handleChange("gender", e.target.value)}
                  >
                    <option value="">Chọn giới tính</option>
                    <option value="Male">Nam</option>
                    <option value="Female">Nữ</option>
                  </select>
                </div>
              </div>
            </fieldset>

            <fieldset className="border border-gray-200 rounded-lg p-6">
              <legend className="px-2 text-lg font-semibold text-gray-700">
                Chọn lớp
              </legend>
              <div className="mt-4">
                <label className="mb-2 text-sm font-medium text-gray-700 block">
                  Lớp học *
                </label>
                <select
                  required
                  className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  value={formData.classId}
                  onChange={(e) => handleClassSelect(e.target.value)}
                >
                  <option value="">-- Chọn lớp --</option>
                  {classes.map((c) => {
                    const cId = c.id || c.class_id;
                    const roomText = c.room ? (c.room.startsWith('P.') ? c.room.replace('P.', 'Phòng ') : c.room) : '';
                    return (
                      <option key={cId} value={cId}>
                        Lớp {c.className} {roomText ? `(${roomText})` : ''}
                      </option>
                    );
                  })}
                </select>
              </div>
            </fieldset>

            <fieldset className="border border-gray-200 rounded-lg p-6">
              <legend className="px-2 text-lg font-semibold text-gray-700">
                Mối quan hệ với học sinh
              </legend>
              <div className="mt-4">
                <label className="mb-2 text-sm font-medium text-gray-700 block">
                  Quan hệ *
                </label>
                <select
                  required
                  className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  value={formData.relationship}
                  onChange={(e) => handleChange("relationship", e.target.value)}
                >
                  <option value="">-- Chọn mối quan hệ --</option>
                  <option value="Father">Cha (Bố)</option>
                  <option value="Mother">Mẹ</option>
                  <option value="Guardian">Người giám hộ</option>
                </select>
              </div>
            </fieldset>

            <fieldset className="border border-gray-200 rounded-lg p-6">
              <legend className="px-2 text-lg font-semibold text-gray-700">
                Chỉ số cơ thể
              </legend>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                <div className="flex flex-col">
                  <label className="mb-2 text-sm font-medium text-gray-700">
                    Chiều cao (cm) *
                  </label>
                  <input
                    type="number"
                    min="50"
                    max="220"
                    required
                    placeholder="VD: 145"
                    className="border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    value={formData.height}
                    onChange={(e) => handleHeightWeightChange("height", e.target.value)}
                  />
                </div>
                <div className="flex flex-col">
                  <label className="mb-2 text-sm font-medium text-gray-700">
                    Cân nặng (kg) *
                  </label>
                  <input
                    type="number"
                    min="10"
                    max="150"
                    required
                    placeholder="VD: 38"
                    className="border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    value={formData.weight}
                    onChange={(e) => handleHeightWeightChange("weight", e.target.value)}
                  />
                </div>
                <div className="flex flex-col">
                  <label className="mb-2 text-sm font-medium text-gray-700">
                    Chỉ số BMI (Tự động tính)
                  </label>
                  <input
                    type="text"
                    readOnly
                    placeholder="Tự động tính"
                    className="border border-gray-300 rounded-lg p-2 bg-gray-100 font-bold text-blue-600 outline-none"
                    value={formData.bmi}
                  />
                </div>
              </div>
            </fieldset>

            <fieldset className="border border-gray-200 rounded-lg p-6">
              <legend className="px-2 text-lg font-semibold text-gray-700">
                Dị ứng (Nếu có)
              </legend>
              <textarea
                placeholder="Nhập dị ứng (nếu có, VD: Phấn hoa, Hải sản...)"
                className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 focus:outline-none mt-4 resize-none"
                value={formData.allergy}
                onChange={(e) => handleChange("allergy", e.target.value)}
              />
            </fieldset>

            <fieldset className="border border-gray-200 rounded-lg p-6">
              <legend className="px-2 text-lg font-semibold text-gray-700">
                Bệnh mãn tính (Nếu có)
              </legend>
              <textarea
                placeholder="Nhập bệnh mãn tính (nếu có, VD: Hen suyễn...)"
                className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 focus:outline-none mt-4 resize-none"
                value={formData.chronicDisease}
                onChange={(e) => handleChange("chronicDisease", e.target.value)}
              />
            </fieldset>

            <fieldset className="border border-gray-200 rounded-lg p-6">
              <legend className="px-2 text-lg font-semibold text-gray-700">
                Tiền sử bệnh
              </legend>
              <textarea
                placeholder="Nhập tiền sử bệnh..."
                className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 focus:outline-none mt-4 resize-none"
                value={formData.medicalHistory}
                onChange={(e) => handleChange("medicalHistory", e.target.value)}
              />
            </fieldset>

            <fieldset className="border border-gray-200 rounded-lg p-6">
              <legend className="px-2 text-lg font-semibold text-gray-700">
                Thị lực & Thính lực
              </legend>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <div className="flex flex-col">
                  <label className="mb-2 text-sm font-medium text-gray-700">
                    Thị lực
                  </label>
                  <select
                    className="border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    value={formData.vision}
                    onChange={(e) => handleChange("vision", e.target.value)}
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
                <div className="flex flex-col">
                  <label className="mb-2 text-sm font-medium text-gray-700">
                    Thính lực
                  </label>
                  <select
                    className="border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    value={formData.hearing}
                    onChange={(e) => handleChange("hearing", e.target.value)}
                  >
                    <option value="Tốt">Tốt</option>
                    <option value="Bình thường">Bình thường</option>
                    <option value="Suy giảm nhẹ">Suy giảm nhẹ</option>
                  </select>
                </div>
              </div>
            </fieldset>

            <div className="flex justify-end space-x-4">
              <button
                type="button"
                onClick={handleReset}
                className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold py-2 px-4 rounded-lg transition"
              >
                LÀM LẠI
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-lg transition disabled:opacity-50"
              >
                LƯU THÔNG TIN
              </button>
            </div>

            {submitMessage && (
              <p
                className={`mt-4 text-center font-medium ${
                  submitMessage.includes("thành công")
                    ? "text-green-600"
                    : "text-red-600"
                }`}
              >
                {submitMessage}
              </p>
            )}
          </form>
        </div>
      </div>
      <Footer />
    </>
  );
}