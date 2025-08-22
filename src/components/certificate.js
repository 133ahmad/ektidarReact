import React from "react";
import "./certificate.css";
import ektidarImage from "../images/ektidar.png";
/**
 * HOW TO USE
 * ----------
 * <Certificate
 *   // ↓ Replace these with real values (or keep and pass later from your page/form)
 *   participantName="Ali Al Hek"
 *   participantNameAr="علي الحق"
 *   workshopName="The workshop AI Tools for Daily Life"
 *   workshopNameAr="ورشة أدوات الذكاء الاصطناعي للحياة اليومية"
 *   dateEn="13 August 2025"     // shown under EN block
 *   dateAr="١٣ آب ٢٠٢٥"         // shown under AR block
 *   issueDateEn="August 14, 2025"
 *   issueDateAr="٢٠٢٥ آب ١٤"
 *   qrSrc="/qr-placeholder.png" // place QR image in public/ or src
 *   signatureSrc="/signature.png"
 *   logoSrc="/logo.png"
 * />
 */

export default function Certificate({
  // ↓↓↓ Placeholders you’ll refill programmatically
  participantName,
  participantNameAr,
  workshopName,
  workshopNameAr,
  dateEn,
  dateAr,
  issueDateEn,
  issueDateAr,
  qrSrc,
  signatureSrc,
  logoSrc,
}) {
  return (
    <div className="cert-wrap">
      {/* Header shape + brand */}
      <div className="cert-header">
        {/* Top-left logo */}
        {/* TODO: Replace logo if needed */}
        <img src={ektidarImage} alt="Logo" className="cert-logo" />
      </div>

      {/* Watermark (very light center logo) */}
      <div className="cert-watermark">
        {/* If you want image watermark instead of text: place an <img> here */}
        EKTIDAR
      </div>

      <div className="cert-body">
        {/* Title */}
        <div className="cert-titles">
          <h1 className="ar-title">إفادة مشاركة</h1>
          <div className="ribbon">
            <span>Participation Statement</span>
          </div>
        </div>

        {/* Intro text (bilingual) */}
        <div className="cert-intro">
          <p className="ar">
            تفيد جمعية اقتدار للتربية والتعليم بأن السيد/ة
          </p>
          <p className="en">
            Ektidar Association for Education confirms that Mr./Ms.
          </p>
        </div>

        {/* Participant names */}
        <div className="names-row">
          {/* TODO: Replace participant name (EN) */}
          <div className="name en">{participantName}</div>
          {/* TODO: Replace participant name (AR) */}
          <div className="name ar">{participantNameAr}</div>
        </div>

        {/* has participated text */}
        <div className="has-participated">
          <p className="ar">قد شارك/ت في</p>
          <p className="en">has participated in</p>
        </div>

        {/* Workshop title */}
        <div className="workshop-row">
          {/* TODO: Replace workshop name (EN) */}
          <div className="workshop en">{workshopName}</div>
          {/* TODO: Replace workshop name (AR) */}
          <div className="workshop ar">{workshopNameAr}</div>
        </div>

        {/* Dates under EN / AR blocks */}
        <div className="dates-row">
          {/* TODO: Replace event date (EN) */}
          <div className="date en">on {dateEn}</div>
          {/* TODO: Replace event date (AR) */}
          <div className="date ar">بتاريخ {dateAr}</div>
        </div>

        {/* Divider */}
        <div className="divider" />

        {/* Footer area: signature, stamp/QR, issue date */}
        <div className="footer-grid">
          {/* Signature */}
          <div className="sig-box">
            <div className="sig-line" />
            {signatureSrc ? (
              // TODO: Replace signature image source
              <img src={signatureSrc} alt="Signature" className="sig-img" />
            ) : null}
            <div className="sig-labels">
              <span className="ar">التوقيع</span>
              <span className="en">Signature</span>
            </div>
          </div>

          {/* QR */}
          <div className="qr-box">
            {/* TODO: Replace qrSrc with your QR code image */}
            {qrSrc ? <img src={qrSrc} alt="QR Code" className="qr-img" /> : <div className="qr-placeholder">QR</div>}
            <div className="qr-label">Verify Certificate</div>
          </div>

          {/* Issue date */}
          <div className="issue-box">
            <div className="issue-labels">
              {/* TODO: Replace issue dates */}
              <div className="ar">التاريخ: {issueDateAr}</div>
              <div className="en">Date: {issueDateEn}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}