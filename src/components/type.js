import React, { useState, useEffect } from "react";
import Layout from "./_layout";
import "./type.css";
import { ENDPOINTS } from "./api";
import { useNavigate } from "react-router-dom";

const CertificateSelectionPage = () => {
  const [certificates, setCertificates] = useState([]);
  const [selectedCertificate, setSelectedCertificate] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [userEmail, setUserEmail] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const storedEmail = localStorage.getItem("userEmail");
        if (!storedEmail) {
          setError("No user email found. Please login first.");
          return;
        }

        setUserEmail(storedEmail);

        const storedWorkshopType = localStorage.getItem("workshopType") || "student";

        await loadCertificates(storedEmail, storedWorkshopType);
      } catch (err) {
        console.error(err);
        setError(err.message || "Failed to fetch user info.");
      }
    };

    fetchUserInfo();
  }, []);

  const loadCertificates = async (email, type) => {
    setIsLoading(true);
    setError("");

    try {
      const url = `${ENDPOINTS.availableCertificates}?email=${encodeURIComponent(email)}&workshopType=${encodeURIComponent(type)}`;
      const response = await fetch(url, { headers: { Accept: "application/json" } });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || "Failed to fetch certificates");
      }

      const data = await response.json();
      setCertificates(data.certificates || []);
    } catch (err) {
      console.error(err);
      setError(err.message || "Failed to load certificates.");
      setCertificates([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelect = (e) => {
    const certId = parseInt(e.target.value, 10); // Convert to number
    const cert = certificates.find((c) => c.id === certId);
    setSelectedCertificate(cert || null);
  };

  const handleContinue = () => {
    if (!selectedCertificate) return;

    setIsProcessing(true);
    setError("");

    try {
      // Save selected certificate to localStorage
      localStorage.setItem("selectedCertificate", JSON.stringify(selectedCertificate));

      // Navigate to preview page with valid template string
      navigate(`/certificate/${selectedCertificate.id}`, { state: { certificate: selectedCertificate } });
    } catch (err) {
      console.error(err);
      setError(err.message || "Failed to proceed. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Layout>
      <div className="form-container">
        <h2 className="heading">Select Certificate Type</h2>
        <p className="description">Choose the certificate you want to generate</p>

        <div className="user-info">
          <p><strong>Email:</strong> {userEmail}</p>
        </div>

        {error && <div className="error-message">{error}</div>}

        <label htmlFor="certificate-select" className="label">Certificate Type</label>

        {isLoading ? (
          <div className="loading-message"><div className="spinner"></div> Loading certificates...</div>
        ) : certificates.length === 0 ? (
          <div className="empty-message">No certificates available for your account. Please check back later.</div>
        ) : (
          <select
            id="certificate-select"
            className="select-input"
            value={selectedCertificate?.id || ""}
            onChange={handleSelect}
          >
            <option value="">Select a certificate type...</option>
            {certificates.map((cert) => (
              <option key={cert.id} value={cert.id}>{cert.type || cert.name}</option>
            ))}
          </select>
        )}

        <button
          className={`continue-button ${!selectedCertificate || isProcessing ? "disabled" : "enabled"}`}
          onClick={handleContinue}
          disabled={!selectedCertificate || isProcessing}
        >
          {isProcessing ? (<><div className="spinner"></div> Processing...</>) : "Continue"}
        </button>
      </div>
    </Layout>
  );
};

export default CertificateSelectionPage;
