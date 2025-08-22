// Layout.js (corrected)
import React from "react";
import "./_layout.css"; 
import ektidarImage from "../images/ektidar.png"; // Import the image correctly

export default function Layout({ children }) {
  return (
    <div className="page">
      <header className="header">
        <img src={ektidarImage} alt="Logo" className="logo" /> {/* Use the imported image */}
        <h1 className="title">Certificate Generator</h1>
      </header>

      <main className="content">
        {children} {/* This will render the content of each page */}
      </main>

      <footer className="footer">
        <a href="#">Contact</a>
        <a href="#">Support</a>
        <a href="#">About</a>
      </footer>
    </div>
  );
}