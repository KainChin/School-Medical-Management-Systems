import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { GoogleLogin, GoogleOAuthProvider } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";

import "./Login.css";
import LogoImg from "../../image/hinhanh/logoproject.png";
import Background from "../../image/hinhanh/backgroundauth.png";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  // ✅ Xử lý đăng nhập Google
  const handleGoogleLogin = async (credentialResponse) => {
    try {
      const decoded = jwtDecode(credentialResponse.credential);
      console.log("🌐 Google user decoded:", decoded);

      const res = await fetch("http://localhost:8080/auth/google", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: decoded.email,
          name: decoded.name,
          googleId: decoded.sub,
          token: credentialResponse.credential,
        }),
      });

      if (!res.ok) throw new Error("Google login thất bại");

      const data = await res.json();
      console.log("🔐 Google login response:", data);

      if (!data.userId) {
        alert("Không lấy được userId từ Google login.");
        return;
      }

      localStorage.setItem("token", data.jwt);
      localStorage.setItem("userName", data.name);
      localStorage.setItem("role", data.role);
      localStorage.setItem("userId", data.userId);

      redirectByRole(data.role);
    } catch (err) {
      console.error("❌ Google login error:", err);
      alert(err.message || "Đăng nhập Google thất bại!");
    }
  };

  // ✅ Đăng nhập bằng email/mật khẩu
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("http://localhost:8080/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) throw new Error("Đăng nhập thất bại");

      const data = await res.json();
      console.log("🔐 Login response:", data);

      if (!data.userId) {
        alert("Không lấy được userId. Vui lòng kiểm tra backend.");
        return;
      }

      localStorage.setItem("token", data.jwt);
      localStorage.setItem("userName", data.name);
      localStorage.setItem("role", data.role);
      localStorage.setItem("userId", data.userId);

      redirectByRole(data.role);
    } catch (error) {
      alert("Đăng nhập thất bại!");
    }
  };

  // ✅ Điều hướng theo vai trò
  const redirectByRole = (role) => {
    if (role === "Admin" || role === "Manager" || role === "Headmaster") {
      navigate("/admin");
    } else if (role === "SchoolNurse") {
      navigate("/nurse");
    } else if (role === "Parent" || role === "Student") {
      navigate("/");
    } else {
      alert("Vai trò không được hỗ trợ!");
    }
  };

  return (
    <GoogleOAuthProvider clientId="493912650211-kqoj7t293bdhfgepv1q7kh7vik3o0852.apps.googleusercontent.com">
      <div
        className="login-wrapper"
        style={{ backgroundImage: `url(${Background})` }}
      >
        <div className="login-box">
          <img src={LogoImg} alt="Logo" className="login-logo" />
          <h2 className="login-title">Đăng nhập</h2>

          <form className="login-form" onSubmit={handleSubmit}>
            <div>
              <label className="login-label">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
                className="input-custom"
                required
              />
            </div>

            <div>
              <label className="login-label">Mật khẩu</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Mật khẩu"
                className="input-custom"
                required
              />
            </div>

            <div className="checkbox-links">
              <label className="remember-label">
                <input type="checkbox" className="checkbox" />
                Ghi nhớ đăng nhập
              </label>
              <div className="link-group">
                <Link to="/register">Tạo tài khoản mới</Link>
                <Link to="/forget-password">Quên mật khẩu</Link>
              </div>
            </div>
            <button type="submit" className="btn-submit">
              Tiếp tục
            </button>
          </form>

          {/* Google Login Button */}
          <div className="google-login-container">
            <GoogleLogin
              onSuccess={handleGoogleLogin}
              onError={() => alert("Đăng nhập Google thất bại!")}
            />
          </div>
        </div>
      </div>
    </GoogleOAuthProvider>
  );
}
