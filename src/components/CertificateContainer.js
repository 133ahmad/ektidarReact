import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import CertificatePage from "./certificate";
import { ENDPOINTS } from "./api";

const CertificateContainer = () => {
  const { id } = useParams();
  const [certificate, setCertificate] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchCertificate = async () => {
      if (!id) {
        setError("No certificate ID provided");
        setLoading(false);
        return;
      }

      try {
        const res = await fetch(ENDPOINTS.getCertificateById(id));
        const data = await res.json();
        console.log("Fetched certificate:", data);

        if (data && data.id) {
          setCertificate(data);
        } else {
          setError("Certificate not found or invalid data");
        }
      } catch (err) {
        console.error("Fetch error:", err);
        setError("Failed to fetch certificate");
      } finally {
        setLoading(false);
      }
    };

    fetchCertificate();
  }, [id]);

  if (loading) return <p>Loading certificate...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;
  if (!certificate) return <p>No certificate data found.</p>;

  return <CertificatePage certificate={certificate} />;
};

export default CertificateContainer;
