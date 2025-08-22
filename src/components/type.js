import React, { useState, useEffect } from 'react';
import Layout from './_layout'; 
import './type.css'; 

const CertificateSelectionPage = () => {
  const [certificates, setCertificates] = useState([]);
  const [selectedCertificate, setSelectedCertificate] = useState('');
  const [isLoadingCertificates, setIsLoadingCertificates] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    async function loadCertificates() {
      setIsLoadingCertificates(true);
      try {
        // Simulate fetching certificates
        // Replace with API call as needed
        const fetchedCertificates = [
          { id: 'cert1', name: 'Completion Certificate' },
          { id: 'cert2', name: 'Excellence Certificate' },
          { id: 'cert3', name: 'Participation Certificate' },
        ];
        setCertificates(fetchedCertificates);
      } catch (error) {
        console.error('Failed to load certificates:', error);
        setCertificates([]);
      } finally {
        setIsLoadingCertificates(false);
      }
    }

    loadCertificates();
  }, []);

  const handleSelect = (e) => {
    setSelectedCertificate(e.target.value);
  };

  const handleContinue = () => {
    if (!selectedCertificate) return;
    setIsProcessing(true);
    console.log('Selected certificate:', selectedCertificate);
    setTimeout(() => setIsProcessing(false), 2000); // Simulate processing delay
  };

  return (
    <Layout>
      <div className="form-container">
        <h2 className="heading">Select Certificate Type</h2>
        <p className="description">Choose the certificate you want to generate</p>

        <label htmlFor="certificate-select" className="label">Certificate Type</label>

        {isLoadingCertificates ? (
          <div className="loading-message">
            <div className="spinner"></div> Loading certificates...
          </div>
        ) : certificates.length === 0 ? (
          <div className="empty-message">No certificates available. Please check back later.</div>
        ) : (
          <select
            id="certificate-select"
            className="select-input"
            value={selectedCertificate}
            onChange={handleSelect}
          >
            <option value="">Select a certificate type...</option>
            {certificates.map(cert => (
              <option key={cert.id} value={cert.id}>{cert.name}</option>
            ))}
          </select>
        )}

        {selectedCertificate && (
          <div className="certificate-preview">
            <div className="certificate-preview-title">Certificate Preview</div>
            <p className="certificate-preview-text">
              Preview of the "{certificates.find(c => c.id === selectedCertificate)?.name}" certificate will appear here.
            </p>
          </div>
        )}

        <button
          className={`continue-button ${(!selectedCertificate || isProcessing) ? 'disabled' : 'enabled'}`}
          onClick={handleContinue}
          disabled={!selectedCertificate || isProcessing}
        >
          {isProcessing ? (
            <>
              <div className="spinner"></div> Processing...
            </>
          ) : (
            'Continue'
          )}
        </button>
      </div>
    </Layout>
  );
};

export default CertificateSelectionPage;
