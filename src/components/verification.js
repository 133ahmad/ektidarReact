import React, { useState } from "react";
import Layout from "./_layout";
import "./verification.css";

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
  const [code, setCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleCodeChange = (e) => {
    const value = e.target.value.replace(/\D/g, "");
    if (value.length <= 6) setCode(value);
  };

  const handleSubmit = () => {
    if (code.length === 6) {
      setIsLoading(true);
      setMessage("");
      console.log("Verifying code:", code);

      setTimeout(() => {
        setIsLoading(false);
        setMessage("Verification successful!");
      }, 2000);
    }
  };

  const handleResend = () => {
    setResendLoading(true);
    console.log("Resending verification code");

    setTimeout(() => {
      setResendLoading(false);
      setMessage("Verification code resent!");
    }, 1500);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && code.length === 6) handleSubmit();
  };

  return (
    <Layout>
      <div className="verification-card">
        <h2 className="card-title">Email Verification</h2>
        <p className="card-description">Please enter the code sent to your email</p>

        <div className="input-container">
          <input
            type="text"
            value={code}
            onChange={handleCodeChange}
            onKeyDown={handleKeyDown}
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
