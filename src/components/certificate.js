import React, { useEffect, useState, useRef } from "react";
import { useLocation, useParams } from "react-router-dom";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { QRCodeCanvas } from "qrcode.react";
import certificateBg from "../images/certificate.jpg";

const CertificatePage = () => {
  const location = useLocation();
  const params = useParams();
  const certificateRef = useRef();

  const [certificate, setCertificate] = useState(location.state?.certificate || null);

  // Fetch certificate if not passed via state
  useEffect(() => {
    const fetchCertificate = async (id) => {
      try {
        const res = await fetch(`http://127.0.0.1:8000/api/certificate/${id}`);
        if (!res.ok) throw new Error("Certificate not found");
        const data = await res.json();
        setCertificate(data);
      } catch (err) {
        console.error(err);
      }
    };

    if (!certificate && params.id) {
      fetchCertificate(params.id);
    }
  }, [certificate, params.id]);

  if (!certificate) return <p>Loading certificate...</p>;

  // QR code will link to the online certificate page
  const qrValue = `http://127.0.0.1:3000/certificate/${certificate.id}`;

  const handleDownloadPDF = async () => {
    if (!certificateRef.current) return;
    const canvas = await html2canvas(certificateRef.current, { scale: 2 });
    const imgData = canvas.toDataURL("image/png");

    const pdf = new jsPDF({
      orientation: "landscape",
      unit: "px",
      format: [canvas.width, canvas.height],
    });

    pdf.addImage(imgData, "PNG", 0, 0, canvas.width, canvas.height);
    pdf.save(`${certificate.workshopName}_certificate.pdf`);
  };

  return (
    <div className="certificate-container">
      <div
        className="certificate-preview"
        ref={certificateRef}
        style={{
          position: "relative",
          width: "100%",
          maxWidth: "900px",
          height: "auto",
          aspectRatio: "4/3",
          margin: "0 auto",
        }}
      >
        <img
          src={certificateBg}
          alt="Certificate Background"
          style={{
            width: "100%",
            height: "100%",
            position: "absolute",
            top: 0,
            left: 0,
            zIndex: 0,
            objectFit: "cover",
          }}
        />

        <div
          className="certificate-content"
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 1,
            padding: "40px 60px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
          }}
        >
          {/* Header */}
          <div style={{ textAlign: "center", marginTop: "20px" }}>
            <h1 style={{ color: "#00BCD4", fontSize: "28px", margin: 0, fontWeight: "bold" }}>
              إفادة مشاركة
            </h1>
            <h2 style={{ color: "#00BCD4", fontSize: "16px", margin: "5px 0 0 0", fontWeight: "normal" }}>
              Participation Statement
            </h2>
          </div>

          {/* Statement */}
          <div style={{ textAlign: "center", marginTop: "30px" }}>
            <p style={{ fontSize: "14px", lineHeight: 1.5, margin: 0, color: "#333" }}>
              تفيد جمعية اقتدار للتربية والتعليم بأن السيدة/السيد
              <br />
              <span style={{ fontSize: "12px" }}>
                Ektidar Association for Education confirms that Mr./Ms.
              </span>
            </p>
          </div>

          {/* Names Section */}
          <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: "15px", marginTop: "25px" }}>
            <div style={{ padding: "8px 25px", minWidth: "150px", textAlign: "center" }}>
              <strong style={{ fontSize: "14px" }}>{certificate.name}</strong>
            </div>
            <span style={{ fontSize: "14px", color: "#333", margin: "0 10px" }}>قد شاركت في</span>
            <div style={{ padding: "8px 25px", minWidth: "150px", textAlign: "center" }}>
              <strong style={{ fontSize: "14px" }}>{certificate.nameArabic}</strong>
            </div>
          </div>

          {/* Workshop */}
          <div style={{ textAlign: "center", marginTop: "25px" }}>
            <div style={{ padding: "10px 40px", display: "inline-block", fontSize: "14px", fontWeight: "bold" }}>
              {certificate.workshopName}
            </div>
          </div>

          {/* Date */}
          <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: "20px", marginTop: "25px" }}>
            <span style={{ fontSize: "12px", color: "#666" }}>on {certificate.date}</span>
            <span style={{ fontSize: "12px", color: "#666" }}>بتاريخ {certificate.dateArabic}</span>
          </div>

          {/* Footer */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginTop: "40px", paddingTop: "20px" }}>
            <div style={{ textAlign: "left", fontSize: "12px", color: "#666" }}>
              <div style={{ borderTop: "1px solid #ccc", paddingTop: "5px", minWidth: "120px" }}>التوقيع</div>
              <p style={{ margin: "5px 0", fontSize: "10px" }}>Signature</p>
            </div>

            {/* Official Stamp */}
            <div style={{ textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center" }}>
              <div style={{
                width: "60px",
                height: "60px",
                borderRadius: "50%",
                backgroundColor: "#1565C0",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "white",
                fontSize: "10px",
                textAlign: "center",
                marginBottom: "5px"
              }}>
                OFFICIAL<br />STAMP
              </div>
            </div>

            {/* QR Code */}
            <div style={{ display: "flex", alignItems: "flex-end", gap: "15px" }}>
              <QRCodeCanvas value={qrValue} size={50} />
            </div>
          </div>
        </div>
      </div>

      <button
        onClick={handleDownloadPDF}
        style={{
          marginTop: "30px",
          padding: "10px 20px",
          backgroundColor: "#009688",
          color: "#fff",
          border: "none",
          borderRadius: "4px",
          cursor: "pointer",
          fontSize: "14px"
        }}
      >
        Download PDF
      </button>
    </div>
  );
};

export default CertificatePage;
