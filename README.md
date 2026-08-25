# 🏫 School Medical Management System (SMMS)
> **Dự án môn học SWP391** – Hệ thống Quản lý Y tế & Thuốc học đường cho Học sinh

[![Java](https://img.shields.io/badge/Java-21-orange.svg)](https://www.oracle.com/java/)
[![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.4.5-brightgreen.svg)](https://spring.io/projects/spring-boot)
[![React](https://img.shields.io/badge/React-19.1.0-blue.svg)](https://react.dev/)
[![MySQL](https://img.shields.io/badge/MySQL-8.0-blue.svg)](https://www.mysql.com/)
[![Tailwind CSS](https://img.shields.io/badge/TailwindCSS-3.x-38B2AC.svg)](https://tailwindcss.com/)
[![License](https://img.shields.io/badge/License-Academic-lightgrey.svg)]()

---

## 📖 1. Giới thiệu dự án

**School Medical Management System (SMMS)** là giải pháp phần mềm toàn diện hỗ trợ các trường học số hóa và tự động hóa quy trình quản lý y tế học đường. Hệ thống kết nối chặt chẽ giữa **Nhà trường - Cán bộ Y tế - Phụ huynh - Học sinh**, giúp nâng cao chất lượng chăm sóc sức khỏe, đảm bảo an toàn sử dụng thuốc và xử lý kịp thời các sự cố y tế trong khuôn viên trường học.

### 🎯 Mục tiêu cốt lõi:
- **Số hóa hồ sơ y tế học sinh:** Theo dõi thông tin sức khỏe định kỳ, tiền sử dị ứng, bệnh nền và lịch sử tiêm chủng.
- **Quản lý dặn thuốc an toàn:** Phụ huynh gửi yêu cầu kèm hình ảnh đơn thuốc; Y tá trường tiếp nhận, xác thực và ghi nhận nhật ký phát thuốc chuẩn xác.
- **Ứng phó sự cố y tế:** Ghi nhận và theo dõi các ca cấp cứu/sơ cứu tại trường, xuất cấp vật tư y tế tương ứng.
- **Tiêm chủng & Khám sức khỏe định kỳ:** Lên lịch đợt khám/tiêm, quản lý phiếu khai báo và phiếu đồng ý (Consent Form) trực tuyến từ phụ huynh.
- **Minh bạch tài chính & dịch vụ:** Tích hợp cổng thanh toán trực tuyến **VNPAY** cho các dịch vụ khám/tư vấn y tế nâng cao.

---

## 🏗️ 2. Kiến trúc & Công nghệ sử dụng

### 🖥️ Backend
- **Core Framework:** Spring Boot `3.4.5`, Java `21`
- **Security:** Spring Security, JWT (JSON Web Token), Google OAuth2 Client, OTP qua Email
- **Data Persistence:** Spring Data JPA / Hibernate, MySQL 8.0
- **Email Service:** Spring Boot Starter Mail (SMTP Gmail)
- **Payment Gateway:** VNPAY Sandbox API
- **Build Tool:** Maven

### 🌐 Frontend
- **Core:** React `19.1.0`, React Router DOM `v7`
- **Styling & UI:** Tailwind CSS, Bootstrap 5, Lucide React, React Icons
- **Data Visualization & Animations:** Recharts, GSAP, AOS (Animate on Scroll)
- **HTTP Client:** Axios, JWT Decode

### 🗄️ Database & Services
- **Database:** MySQL `mesch`
- **News Server:** Node.js Express server (`ServerNew.js`) hỗ trợ tin tức y tế

---

## 👥 3. Phân quyền người dùng (Role-Based Access Control)

Hệ thống hỗ trợ 6 vai trò chính:

| Role ID | Vai trò | Mô tả nhiệm vụ |
| :---: | :--- | :--- |
| **1** | **Admin** | Quản trị hệ thống, quản lý tài khoản người dùng, phân quyền và cấu hình hệ thống. |
| **2** | **Headmaster** | Ban giám hiệu, xem các báo cáo tổng quan sức khỏe toàn trường và thống kê y tế. |
| **3** | **School Nurse (Y tá)** | Tiếp nhận đơn thuốc, cấp phát thuốc, xử lý sự cố y tế, quản lý kho thuốc, ghi nhận kết quả khám/tiêm chủng. |
| **4** | **Parent (Phụ huynh)** | Gửi yêu cầu dặn thuốc, theo dõi hồ sơ con cái, ký phiếu đồng ý tiêm chủng/khám sức khỏe, đặt lịch tư vấn, thanh toán dịch vụ. |
| **5** | **Student (Học sinh)** | Tra cứu thông tin sức khỏe cá nhân, lịch tiêm chủng và thông báo y tế. |
| **6** | **Manager** | Quản lý lớp học, quản lý kho vật tư y tế, quản lý đợt sự kiện khám/tiêm chủng theo khối/lớp. |

---

## 🌟 4. Tính năng chi tiết

### 🩺 Phân hệ Y tế học đường & Học sinh
- **Quản lý hồ sơ sức khỏe (`HealthInfo`):** Chiều cao, cân nặng, BMI, nhóm máu, dị ứng, thị lực, răng hàm mặt, tiền sử phẫu thuật/bệnh mãn tính.
- **Quản lý gửi thuốc (`MedicationSubmission`):**
  - Phụ huynh điền thông tin thuốc, liều dùng, hướng dẫn và đính kèm đơn thuốc/ảnh thuốc.
  - Y tế trường kiểm tra, duyệt đơn, đánh dấu đã uống thuốc trong ngày và phản hồi kết quả cho phụ huynh.
- **Quản lý sự cố y tế (`MedicalEvent` & `MedicalFollowUp`):**
  - Ghi nhận tai nạn, trượt ngã, sốt cao, ngộ độc,...
  - Ghi nhận thuốc/vật tư y tế đã sử dụng (`MedicalEventSupply`).
  - Cập nhật quá trình hồi phục và theo dõi sau sự cố.

### 💉 Phân hệ Khám sức khỏe & Tiêm chủng
- **Lập kế hoạch đợt sự kiện (`EventBatch` & `EventBatchClass`):** Lên lịch khám sức khỏe hoặc tiêm vaccine cho từng khối/lớp cụ thể.
- **Khai báo & Đồng ý tiêm (`ParentConsent` & `VaccinationParentDeclaration`):**
  - Phụ huynh khai báo tiền sử tiêm và bệnh lý trước tiêm.
  - Phụ huynh gửi phiếu đồng ý cho phép tiêm/khám tại trường.
- **Ghi nhận kết quả khám (`MedicalCheckup`) & Tiêm chủng (`Vaccination`):** Bác sĩ/Y tế cập nhật tình trạng sau khám/tiêm và phản ứng sau tiêm.

### 💊 Phân hệ Quản lý Kho Dược & Vật tư
- Quản lý danh mục thuốc (`MedicalSupply`), số lượng tồn kho, hạn sử dụng, nhà cung cấp, phân loại thuốc.
- Cảnh báo thuốc sắp hết hạn hoặc hết hàng trong kho y tế.
- Tự động trừ tồn kho khi phát thuốc hoặc cấp cứu sự cố.

### 💳 Phân hệ Đặt lịch, Tư vấn & Thanh toán
- Đặt lịch khám/tư vấn sức khỏe trực tuyến (`MedicalAppointment`).
- Tích hợp thanh toán trực tuyến qua cổng **VNPAY** (`OrderController`) cho các dịch vụ y tế.

### 🔐 Phân hệ Bảo mật & Tiện ích
- Đăng nhập thông thường (mã hóa mật khẩu), đăng nhập nhanh qua Google OAuth.
- Khôi phục mật khẩu thông qua mã OTP gửi về Email.
- Hệ thống thông báo tự động (`Notification`) qua chuông thông báo giao diện và Email.

---

## 📂 5. Cấu trúc thư mục dự án

```text
School-Medical-Management-Systems/
├── src/                               # Backend Source Code (Spring Boot)
│   ├── main/
│   │   ├── java/com/school_medical/school_medical_management_system/
│   │   │   ├── api/                   # REST Controllers (Auth, Student, Medication, etc.)
│   │   │   ├── config/                # SecurityConfig, CorsConfig, MailConfig
│   │   │   ├── models/                # Entity Models, DTOs, Request/Response Payloads
│   │   │   ├── repositories/          # JPA Repositories
│   │   │   ├── services/              # Business Logic Services
│   │   │   ├── schedulers/            # Scheduled Tasks & Background Jobs
│   │   │   ├── utils/                 # Helpers, JWT Utils, Email Sender
│   │   │   └── VNPAY/                 # VNPAY Configuration & Helpers
│   │   └── resources/
│   │       ├── application.properties # Cấu hình DB, Mail, VNPAY, JWT
│   │       └── static/ & templates/
│   └── test/
├── my-app/                            # Frontend Source Code (React.js)
│   ├── public/                        # Static assets (index.html, icons, images)
│   ├── src/
│   │   ├── auth/                      # Login, Register, Forgot Password, OTP
│   │   ├── components/                # Reusable UI Components (Navbar, Header, Footer)
│   │   ├── Manager/                   # Dashboard, Drug Management, Student List, Class
│   │   ├── pages/                     # Trang chức năng: Tra cứu, gửi thuốc, tiêm chủng
│   │   ├── Payment/                   # Giao diện thanh toán VNPAY
│   │   ├── server/                    # Node.js Express server phục vụ tin tức (ServerNew.js)
│   │   ├── AdminApp.js                # App router dành riêng cho Admin
│   │   ├── NurseApp.js                # App router dành riêng cho School Nurse
│   │   ├── UserApp.js                 # App router dành riêng cho Parent/Student
│   │   └── App.js                     # Root Component
│   ├── package.json                   # Frontend dependencies
│   └── tailwind.config.js             # Cấu hình Tailwind CSS
├── sql/
│   └── database.sql                   # Schema và Dữ liệu mẫu MySQL (Database: mesch)
├── pom.xml                            # Backend dependencies & Maven build config
└── README.md                          # Tài liệu dự án
```

---

## 🚀 6. Hướng dẫn Cài đặt & Khởi chạy

### 📋 Yêu cầu môi trường
- **Java:** JDK 21 hoặc mới hơn
- **Node.js:** Node.js v18.x trở lên & npm
- **Database:** MySQL Server 8.0+
- **IDE đề xuất:** IntelliJ IDEA / Eclipse (Backend) & VS Code / Antigravity (Frontend)

---

### Bước 1: Khởi tạo Cơ sở Dữ liệu (MySQL)
1. Mở MySQL Workbench hoặc CLI.
2. Tạo database và import dữ liệu mẫu từ tệp `sql/database.sql`:
```sql
CREATE DATABASE mesch CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE mesch;
SOURCE sql/database.sql;
```

---

### Bước 2: Cấu hình Backend
Kiểm tra và cập nhật file `src/main/resources/application.properties` phù hợp với môi trường máy của bạn:

```properties
server.port=8080

# Cấu hình kết nối MySQL
spring.datasource.url=jdbc:mysql://127.0.0.1:3306/mesch?useSSL=false&allowPublicKeyRetrieval=true
spring.datasource.username=root
spring.datasource.password=YOUR_MYSQL_PASSWORD

# Cấu hình Gửi Email (SMTP Gmail)
spring.mail.username=your_email@gmail.com
spring.mail.password=your_app_password

# Cấu hình VNPAY Sandbox
vnpay.tmnCode=YOUR_TMN_CODE
vnpay.hashSecret=YOUR_HASH_SECRET
vnpay.returnUrl=http://localhost:3000/payment/result
```

Khởi chạy Backend:
```bash
# Windows
mvnw.cmd spring-boot:run

# Hoặc chạy trực tiếp Application.java trong IDE
```
Backend sẽ lắng nghe tại: `http://localhost:8080`

---

### Bước 3: Cấu hình & Chạy Frontend
1. Di chuyển vào thư mục `my-app`:
```bash
cd my-app
```

2. Cài đặt các gói phụ thuộc:
```bash
npm install --legacy-peer-deps
```

3. Khởi chạy ứng dụng React:
```bash
npm start
```
Frontend sẽ mở tại: `http://localhost:3000`

*(Tùy chọn) Chạy Server tin tức phụ trợ:*
```bash
node src/server/ServerNew.js
# Chạy tại http://localhost:5001
```

---

## 📡 7. Danh sách API chính (RESTful Endpoints)

| Module | Method | Endpoint | Mô tả |
| :--- | :---: | :--- | :--- |
| **Auth** | `POST` | `/api/auth/login` | Đăng nhập tài khoản & lấy JWT token |
| | `POST` | `/api/auth/register` | Đăng ký tài khoản người dùng mới |
| | `POST` | `/api/auth/google` | Đăng nhập bằng tài khoản Google |
| **OTP** | `POST` | `/api/otp/send` | Gửi mã OTP xác thực qua Email |
| | `POST` | `/api/otp/verify` | Xác thực mã OTP |
| **Medication** | `GET` | `/api/medication/all` | Lấy danh sách yêu cầu gửi thuốc |
| | `POST` | `/api/medication/submit` | Phụ huynh gửi dặn thuốc cho con |
| | `PUT` | `/api/medication/status/{id}`| Y tế xác nhận trạng thái phát thuốc |
| **Medical Supply** | `GET` | `/api/supplies` | Xem danh mục thuốc & vật tư y tế |
| | `POST` | `/api/supplies` | Thêm mới thuốc/vật tư vào kho |
| **Vaccination** | `GET` | `/api/vaccinations` | Lấy danh sách tiêm chủng |
| | `POST` | `/api/vaccinations/consent` | Gửi phiếu đồng ý tiêm chủng |
| **Student** | `GET` | `/api/students` | Lấy danh sách học sinh theo lớp |
| | `GET` | `/api/students/{id}/health`| Lấy hồ sơ sức khỏe chi tiết của học sinh |
| **Payment** | `POST` | `/api/payment/create-order`| Tạo link thanh toán VNPAY |

---

## 👨‍💻 8. Thông tin Đồ án & Bản quyền

- **Môn học:** SWP391 – Software Development Project
- **Trường:** Đại học FPT (FPT University)
- **Dự án:** School Medical Management Systems

---
*Cảm ơn thầy cô và các bạn đã quan tâm đến dự án! Mọi thắc mắc hoặc đóng góp vui lòng tạo Issue trên GitHub repository.*
