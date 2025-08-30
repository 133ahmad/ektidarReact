import React, { useState } from "react";
import Layout from "./_layout"; 
import './login.css';
import { useNavigate } from "react-router-dom";
import { ENDPOINTS } from "./api";

export default function CertificatePage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const validateEmail = (email) => /\S+@\S+\.\S+/.test(email);

  const handleSubmit = async () => {
    setError("");

    if (!email) return setError("Please enter your email.");
    if (!validateEmail(email)) return setError("Please enter a valid email.");

    setLoading(true);

    try {
      const response = await fetch(ENDPOINTS.checkEmail, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      if (!response.ok) throw new Error("Network response was not ok");

      const data = await response.json();

      if (data.exists) {
        // store email in localStorage
        localStorage.setItem("userEmail", email);

        // send verification code
        await fetch(ENDPOINTS.sendVerificationCode, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Accept": "application/json",
          },
          body: JSON.stringify({ email }),
        });

        navigate("/verification"); // go to verification page
      } else {
        setError("Email not found in the database.");
      }
    } catch (err) {
      console.error(err);
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="login-container">
        <input
          type="email"
          placeholder="Enter your email"
          className="email-input"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <button
          className="submit-btn"
          onClick={handleSubmit}
          disabled={loading}
        >
          {loading ? <div className="spinner"></div> : "Submit"}
        </button>
        {error && <p className="error-msg">{error}</p>}
      </div>
    </Layout>
  );
}
