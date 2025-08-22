import React from "react";
import Layout from "./_layout"; 
import '../App.css';
import { useNavigate } from "react-router-dom";

export default function CertificatePage() {
  const navigate = useNavigate();

  return (
    <Layout>
      <input type="email" placeholder="Enter your email" className="email-input" />
      <button 
        className="submit-btn" 
        onClick={() => navigate("/verification")}>Submit</button>
    </Layout>
  );
}
