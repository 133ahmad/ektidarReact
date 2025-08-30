import React, { useState } from "react";
import Layout from "./_layout";
import * as XLSX from "xlsx"; 
import "./import.css";
import { ENDPOINTS } from "./api";

export default function ExcelImport() {
  const [file, setFile] = useState(null);
  const [data, setData] = useState([]);
  const [headers, setHeaders] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [dragOver, setDragOver] = useState(false);
  const [importResult, setImportResult] = useState(null); // <-- NEW state

  const handleFileSelect = (selectedFile) => {
    setError(""); 
    setSuccess("");
    setImportResult(null);
    if (!selectedFile) return;

    const allowedTypes = [
      "application/vnd.ms-excel",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "text/csv",
    ];
    
    if (
      !allowedTypes.includes(selectedFile.type) && 
      !selectedFile.name.endsWith(".xlsx") && 
      !selectedFile.name.endsWith(".xls") && 
      !selectedFile.name.endsWith(".csv")
    ) {
      setError("Please select a valid Excel file (.xlsx, .xls) or CSV file");
      return;
    }

    if (selectedFile.size > 10 * 1024 * 1024) {
      setError("File size must be less than 10MB");
      return;
    }

    setFile(selectedFile);
  };

  const handleFileChange = (e) => handleFileSelect(e.target.files[0]);
  const handleDragOver = (e) => { e.preventDefault(); setDragOver(true); };
  const handleDragLeave = (e) => { e.preventDefault(); setDragOver(false); };
  const handleDrop = (e) => { e.preventDefault(); setDragOver(false); handleFileSelect(e.dataTransfer.files[0]); };

  const processExcelFile = async () => {
    if (!file) { setError("Please select a file first"); return; }
    setIsLoading(true);
    setError("");
    try {
      const fileBuffer = await file.arrayBuffer();
      const workbook = XLSX.read(fileBuffer, { type: "array" });
      const worksheet = workbook.Sheets[workbook.SheetNames[0]];
      const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

      if (jsonData.length === 0) {
        setError("The Excel file appears to be empty");
        return;
      }

      const headerRow = jsonData[0];
      const dataRows = jsonData
        .slice(1)
        .filter((row) => row.some((cell) => cell !== undefined && cell !== null && cell !== ""));

      const processedData = dataRows.map((row) => {
        const rowObject = {};
        headerRow.forEach((header, index) => {
          let cellValue = row[index] || "";

          // Convert Excel numeric dates to JS date
          if (typeof cellValue === "number") {
            const jsDate = XLSX.SSF.parse_date_code(cellValue);
            if (jsDate) {
              cellValue = `${jsDate.y}-${String(jsDate.m).padStart(2, "0")}-${String(jsDate.d).padStart(2, "0")}`;
            }
          } 
          // Format JS Date objects
          else if (cellValue instanceof Date) {
            cellValue = cellValue.toISOString().split("T")[0];
          }

          rowObject[header || `Column_${index + 1}`] = cellValue;
        });
        return rowObject;
      });

      setHeaders(headerRow);
      setData(processedData);
      setSuccess(`File processed: ${processedData.length} records ready for import`);
    } catch (err) {
      console.error("Error processing file:", err);
      setError("Failed to process the Excel file. Please make sure it's a valid Excel or CSV file.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleImport = async () => {
    if (data.length === 0) {
      setError("No data to import. Please process an Excel file first.");
      return;
    }
    setIsLoading(true);
    try {
      const formData = new FormData();
      formData.append("excel", file);

      const response = await fetch(ENDPOINTS.IMPORT_STUDENTS, {
        method: "POST",
        body: formData,
      });

      const result = await response.json();
      if (response.ok) {
        setSuccess(result.message || `Imported ${data.length} records!`);
        setImportResult(result); // <-- Save detailed result
      } else {
        setError(result.error || "Failed to import data.");
        setImportResult(result);
      }
    } catch (err) {
      console.error(err);
      setError("Failed to import data. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const clearData = () => {
    setFile(null);
    setData([]);
    setHeaders([]);
    setError("");
    setSuccess("");
    setImportResult(null);
  };

  return (
    <Layout>
      <div className="excel-import-container">
        <div className="import-header">
          <h2>Import Excel Document</h2>
          <p>Upload an Excel file (.xlsx, .xls, .csv) to import certificate data</p>
        </div>

        <div className="upload-section">
          <div 
            className={`file-drop-zone ${dragOver ? "drag-over" : ""}`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <div>
              <div className="upload-icon">📁</div>
              <p>{file ? file.name : "Drag and drop your Excel file here"}</p>
              <p>or</p>
              <label className="file-select-button">
                Choose File
                <input type="file" accept=".xlsx,.xls,.csv" onChange={handleFileChange} style={{ display: "none" }} />
              </label>
            </div>
          </div>
          <p>Supported formats: .xlsx, .xls, .csv | Max size: 10MB</p>
        </div>

        <div className="action-buttons">
          <button onClick={processExcelFile} disabled={!file || isLoading} className="process-button">
            {isLoading ? "Processing..." : "Process File"}
          </button>
          {data.length > 0 && (
            <>
              <button onClick={handleImport} disabled={isLoading} className="import-button">
                {isLoading ? "Importing..." : `Import ${data.length} Records`}
              </button>
              <button onClick={clearData} disabled={isLoading} className="clear-button">Clear Data</button>
            </>
          )}
        </div>

        {error && <div className="message error-message">❌ {error}</div>}
        {success && <div className="message success-message">✅ {success}</div>}

        {/* ✅ Show backend import results */}
        {importResult && (
          <div className="import-result">
            <h3>Import Summary</h3>
            <p><strong>Inserted:</strong> {importResult.inserted || 0}</p>
            <p><strong>Skipped:</strong> {importResult.skipped || 0}</p>

            {importResult.errors && importResult.errors.length > 0 && (
              <div className="error-list">
                <h4>Skipped Records:</h4>
                <ul>
                  {importResult.errors.map((errMsg, i) => (
                    <li key={i}>⚠️ {errMsg}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

        {data.length > 0 && (
          <div className="data-preview">
            <h3>Data Preview ({data.length} records)</h3>
            <table>
              <thead>
                <tr>{headers.map((header, index) => <th key={index}>{header}</th>)}</tr>
              </thead>
              <tbody>
                {data.slice(0, 10).map((row, rowIndex) => (
                  <tr key={rowIndex}>{headers.map((header, colIndex) => <td key={colIndex}>{row[header]}</td>)}</tr>
                ))}
              </tbody>
            </table>
            {data.length > 10 && (
              <p className="preview-note">Showing first 10 records. Total: {data.length} records</p>
            )}
          </div>
        )}
      </div>
    </Layout>
  );
}
