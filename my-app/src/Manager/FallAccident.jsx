import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const FallAccident = () => {
  const [incident, setIncident] = useState({
    event_type: "",
    event_date: new Date().toISOString().slice(0, 10),
    description: "",
    student_id: "",
    nurse_id: "",
    status: "Pending",
    approved_by: "",
  });
  const [nurseName, setNurseName] = useState("");
  const [eventNames, setEventNames] = useState([]);
  const [studentList, setStudentList] = useState([]);
  const [studentNameInput, setStudentNameInput] = useState("");
  const [accidentList, setAccidentList] = useState([]);
  const [showAccidentList, setShowAccidentList] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editId, setEditId] = useState(null);

  // Thêm state cho kho thuốc
  const [suppliesList, setSuppliesList] = useState([]);
  const [selectedSupplyId, setSelectedSupplyId] = useState("");
  const [quantityUsed, setQuantityUsed] = useState(1);
  const [usedSupplies, setUsedSupplies] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    const nurseId = localStorage.getItem("userId") || "";
    const nurseName = localStorage.getItem("userName") || "";
    setIncident((prev) => ({ ...prev, nurse_id: nurseId }));
    setNurseName(nurseName);

    fetch("http://localhost:8080/api/event-batches")
      .then((res) => res.json())
      .then((data) => {
        const eventsArray = Array.isArray(data.data) ? data.data : [];
        setEventNames(eventsArray);
      })
      .catch(() => setEventNames([]));

    fetch("http://localhost:8080/api/students/all")
      .then((res) => res.json())
      .then((data) => {
        setStudentList(Array.isArray(data) ? data : []);
      })
      .catch(() => setStudentList([]));

    // Lấy danh sách vật tư y tế
    fetch("http://localhost:8080/api/medicalsupply/all")
      .then((res) => res.json())
      .then((data) => {
        setSuppliesList(Array.isArray(data.data) ? data.data : []);
      })
      .catch(() => setSuppliesList([]));
  }, []);

  const handleChange = (field, value) => {
    setIncident({ ...incident, [field]: value });
  };

  const handleAddSupply = () => {
    if (!selectedSupplyId || quantityUsed <= 0) return;
    const supply = suppliesList.find((s) => s.supplyId === Number(selectedSupplyId));
    if (!supply) return;

    if (quantityUsed > supply.quantity) {
      alert(`Trong kho chỉ còn ${supply.quantity} ${supply.unit} ${supply.name}!`);
      return;
    }

    setUsedSupplies((prev) => {
      const existing = prev.find((s) => s.supplyId === supply.supplyId);
      if (existing) {
        if (existing.quantityUsed + quantityUsed > supply.quantity) {
          alert(`Vượt quá số lượng trong kho!`);
          return prev;
        }
        return prev.map((s) =>
          s.supplyId === supply.supplyId ? { ...s, quantityUsed: s.quantityUsed + quantityUsed } : s
        );
      }
      return [...prev, { supplyId: supply.supplyId, name: supply.name, unit: supply.unit, quantityUsed }];
    });
    setQuantityUsed(1);
    setSelectedSupplyId("");
  };

  const handleRemoveSupply = (supplyId) => {
    setUsedSupplies((prev) => prev.filter((s) => s.supplyId !== supplyId));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!incident.student_id) {
      alert("Vui lòng nhập thông tin học sinh!");
      return;
    }
    const payload = {
      eventType: incident.event_type,
      eventDate: incident.event_date,
      description: incident.description,
      studentId: Number(incident.student_id),
      nurseId: Number(incident.nurse_id),
      status: incident.status,
      supplies: usedSupplies.map((s) => ({ supplyId: s.supplyId, quantityUsed: s.quantityUsed }))
    };
    try {
      let response;
      if (isEditMode && editId) {
        // Edit vẫn giữ endpoint cũ hoặc cập nhật sau
        response = await fetch(`http://localhost:8080/api/medical-events/${editId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      } else {
        response = await fetch("http://localhost:8080/api/medical-events/with-supplies", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      }
      const data = await response.json();
      if (!response.ok || !data.success) {
        throw new Error(data.message || "Gửi dữ liệu thất bại!");
      }

      // Gửi thông báo cho phụ huynh
      const student = studentList.find(s => s.id === Number(incident.student_id));
      const parentEmail = student?.parentEmail || "";
      if (parentEmail) {
        await fetch("http://localhost:8080/api/notifications/sendone", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            to: parentEmail,
            subject: `Thông báo sự cố tại trường cho học sinh ${student?.name || ""}`,
            message: `Học sinh ${student?.name || ""} gặp sự cố: ${incident.event_type}. Mô tả: ${incident.description}. Y tá: ${nurseName}`
          }),
        });
      }

      alert(isEditMode ? "Đã cập nhật sự cố thành công!" : "Đã lưu sự cố và cấp thuốc thành công!");
      setIsEditMode(false);
      setEditId(null);
      setIncident({
        event_type: "",
        event_date: new Date().toISOString().slice(0, 10),
        description: "",
        student_id: "",
        nurse_id: localStorage.getItem("userId") || "",
        status: "Pending",
        approved_by: "",
      });
      setStudentNameInput("");
      setUsedSupplies([]);
      fetchAccidentList();
      
      // Refresh lại kho thuốc
      fetch("http://localhost:8080/api/medicalsupply/all")
        .then((res) => res.json())
        .then((data) => setSuppliesList(Array.isArray(data.data) ? data.data : []));
        
    } catch (error) {
      alert(error.message);
    }
  };

  const fetchAccidentList = async () => {
    try {
      const res = await fetch("http://localhost:8080/api/medical-events");
      const data = await res.json();
      setAccidentList(Array.isArray(data) ? data : data.data || []);
      setShowAccidentList(true);
    } catch (err) {
      alert("Lỗi lấy danh sách sự cố!");
    }
  };

  const handleEditAccident = (accident) => {
    setIncident({
      event_type: accident.event_type || accident.eventType,
      event_date: accident.event_date || accident.eventDate,
      description: accident.description,
      student_id: accident.student_id || accident.studentId,
      nurse_id: accident.nurse_id || accident.nurseId,
      status: accident.status,
    });
    setStudentNameInput(studentList.find(s => s.id === (accident.student_id || accident.studentId))?.name || "");
    setIsEditMode(true);
    setEditId(accident.event_id || accident.id);
    setUsedSupplies([]); // Không hỗ trợ sửa thuốc lúc Edit (chưa làm api)
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="p-6">
      <div className="bg-white rounded-xl shadow-md p-8 max-w-4xl mx-auto">
        <h2 className="text-xl font-bold text-blue-700 mb-6 flex items-center">
          <span className="text-2xl mr-2">🩹</span>
          Ghi nhận sự cố & Cấp thuốc
        </h2>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Loại sự cố (VD: Sốt, Đau bụng...)"
              value={incident.event_type}
              onChange={(e) => handleChange("event_type", e.target.value)}
              className="border border-gray-300 p-3 rounded-lg"
              required
            />
            <input
              type="date"
              value={incident.event_date}
              onChange={(e) => handleChange("event_date", e.target.value)}
              className="border border-gray-300 p-3 rounded-lg"
              required
            />
            <input
              type="text"
              placeholder="Nhập tên học sinh"
              value={studentNameInput}
              onChange={(e) => {
                setStudentNameInput(e.target.value);
                const found = studentList.find(s => s.name === e.target.value);
                handleChange("student_id", found ? found.id : "");
              }}
              className="border border-gray-300 p-3 rounded-lg"
              required
            />
            <input
              type="text"
              placeholder="Tên y tá"
              value={nurseName}
              disabled
              className="border border-gray-300 p-3 rounded-lg bg-gray-100"
            />
          </div>

          <div className="mt-6 border-t pt-4">
            <label className="font-semibold text-gray-700 mb-2 block">
              💊 Vật tư / Thuốc sử dụng (Tùy chọn)
            </label>
            <div className="flex gap-4 items-center">
              <select
                value={selectedSupplyId}
                onChange={(e) => setSelectedSupplyId(e.target.value)}
                className="border border-gray-300 p-2 rounded-lg flex-1"
              >
                <option value="">-- Chọn thuốc --</option>
                {suppliesList.map((sup) => (
                  <option key={sup.supplyId} value={sup.supplyId}>
                    {sup.name} (Còn: {sup.quantity} {sup.unit})
                  </option>
                ))}
              </select>
              <input
                type="number"
                min="1"
                value={quantityUsed}
                onChange={(e) => setQuantityUsed(Number(e.target.value))}
                className="border border-gray-300 p-2 rounded-lg w-24"
              />
              <button
                type="button"
                onClick={handleAddSupply}
                className="bg-gray-800 text-white px-4 py-2 rounded hover:bg-gray-700"
              >
                Thêm
              </button>
            </div>

            {usedSupplies.length > 0 && (
              <ul className="mt-4 space-y-2">
                {usedSupplies.map((s) => (
                  <li key={s.supplyId} className="flex justify-between items-center bg-gray-50 p-2 rounded border">
                    <span>{s.name} - Số lượng: <b>{s.quantityUsed} {s.unit}</b></span>
                    <button
                      type="button"
                      onClick={() => handleRemoveSupply(s.supplyId)}
                      className="text-red-500 font-bold hover:text-red-700"
                    >
                      Xóa
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="mt-6">
            <label className="font-semibold text-gray-700 mb-2 block">
              📝 Mô tả triệu chứng / Cách xử lý
            </label>
            <textarea
              placeholder="Chi tiết sự cố..."
              value={incident.description}
              onChange={(e) => handleChange("description", e.target.value)}
              className="border border-gray-300 p-3 rounded-lg w-full h-28"
              required
            />
          </div>

          <div className="mt-8 flex justify-between items-center">
            <button
              type="submit"
              className="bg-blue-600 text-white px-6 py-3 rounded hover:bg-blue-700"
            >
              {isEditMode ? "💾 Cập nhật" : "💾 Lưu & Cấp thuốc"}
            </button>
            <button
              type="button"
              className="bg-green-600 text-white px-6 py-3 rounded hover:bg-green-700"
              onClick={fetchAccidentList}
            >
              📋 Lịch sử sự cố
            </button>
          </div>
        </form>

        {showAccidentList && (
          <div className="mt-8 overflow-x-auto">
            <h3 className="text-lg font-semibold mb-4">Danh sách sự cố y tế</h3>
            <table className="min-w-full border border-gray-300">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border px-4 py-2">Loại sự cố</th>
                  <th className="border px-4 py-2">Ngày</th>
                  <th className="border px-4 py-2">Mô tả</th>
                  <th className="border px-4 py-2">Học sinh</th>
                  <th className="border px-4 py-2">Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {accidentList.map((accident) => {
                  const student = studentList.find(s => s.id === (accident.student_id || accident.studentId));
                  return (
                    <tr key={accident.event_id || accident.id} className="text-center">
                      <td className="border px-4 py-2">{accident.event_type || accident.eventType}</td>
                      <td className="border px-4 py-2">{accident.event_date || accident.eventDate}</td>
                      <td className="border px-4 py-2 text-left">{accident.description}</td>
                      <td className="border px-4 py-2">{student ? student.name : (accident.student_id || accident.studentId)}</td>
                      <td className="border px-4 py-2">
                        <button
                          className="bg-yellow-400 text-white px-3 py-1 rounded hover:bg-yellow-500"
                          onClick={() => handleEditAccident(accident)}
                        >
                          ✏️ Sửa
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default FallAccident;
