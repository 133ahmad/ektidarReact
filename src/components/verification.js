import React, { useState, useEffect } from "react";
import Layout from "./_layout";
import "./verification.css";
import { useNavigate } from "react-router-dom";
import { ENDPOINTS } from "./api";

const Spinner = ({ size = 5, color = "white" }) => (
  <div
    className="spinner"
    style={{
      width: `${size}rem`,
      height: `${size}rem`,
      borderTopColor: color,
    }}
  ></div>
);

export default function EmailVerificationPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [message, setMessage] = useState("");

  // Retrieve stored email on load
  useEffect(() => {
    const storedEmail = localStorage.getItem("userEmail");
    if (!storedEmail || storedEmail === "undefined" || storedEmail === "null") {
      navigate("/"); // redirect if no email
    } else {
      setEmail(storedEmail);
    }
  }, [navigate]);

  const handleCodeChange = (e) => {
    const value = e.target.value.replace(/\D/g, "");
    if (value.length <= 6) setCode(value);
  };

  const handleSubmit = async () => {
    if (code.length !== 6) return;
    setIsLoading(true);
    setMessage("");

    try {
      const response = await fetch(ENDPOINTS.verifyCode, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, code }),
      });

      const data = await response.json();

      if (response.ok && data.verified) {
        setMessage("Verification successful!");
        navigate("/type"); // next page
      } else {
        setMessage(data.message || "Invalid code. Please try again.");
      }
    } catch (err) {
      console.error(err);
      setMessage("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleResend = async () => {
    setResendLoading(true);
    setMessage("");

    try {
      const response = await fetch(ENDPOINTS.resendCode, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setMessage(data.message || "Verification code resent!");
      } else {
        setMessage(data.message || "Failed to resend code.");
      }
    } catch (err) {
      console.error(err);
      setMessage("Something went wrong. Please try again.");
    } finally {
      setResendLoading(false);
    }
  };

  return (
    <Layout>
      <div className="verification-card">
        <h2 className="card-title">Email Verification</h2>
        <p className="card-description">
          Please enter the code sent to your email: <strong>{email}</strong>
        </p>

        <div className="input-container">
          <input
            type="text"
            value={code}
            onChange={handleCodeChange}
            placeholder="Enter 6-digit code"
            className="code-input"
            maxLength="6"
          />
        </div>

        <button
          onClick={handleSubmit}
          disabled={code.length !== 6 || isLoading}
          className="verify-button"
        >
          {isLoading ? <Spinner size={1.25} color="#ffffff" /> : "Verify Code"}
        </button>

        <div className="resend-section">
          <p className="resend-text">Email not received?</p>
          <button
            onClick={handleResend}
            disabled={resendLoading}
            className="resend-button"
          >
            {resendLoading ? <Spinner size={0.8} color="#0f766e" /> : "Resend"}
          </button>
        </div>

        {message && <p className="message-text">{message}</p>}
      </div>
    </Layout>
  );
}
