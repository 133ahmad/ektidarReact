import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./components/login";
import Certificate from "./components/certificate";
import EmailVerificationPage from "./components/verification";
import CertificateType from "./components/type";
import AdminLogin from "./components/admin";
import ExcelImport from "./components/import";
import CertificateContainer from "./components/CertificateContainer";
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/certificate" element={<Certificate />} />
        <Route path="/verification" element={<EmailVerificationPage/>}/>
        <Route path="/type" element={<CertificateType/>}/>
        <Route path="/adminadmin" element={<AdminLogin/>}/>
        <Route path="/import" element={<ExcelImport/>} />
        <Route path="/certificate/:id" element={<CertificateContainer />} />
        
      </Routes>
    </Router>
  );
}

export default App;
