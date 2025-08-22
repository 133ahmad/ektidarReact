import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./components/login";
import Certificate from "./components/certificate";
import EmailVerificationPage from "./components/verification";
import CertificateType from "./components/type";
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/certificate" element={<Certificate />} />
        <Route path="/verification" element={<EmailVerificationPage/>}/>
        <Route path="/type" element={<CertificateType/>}/>
      </Routes>
    </Router>
  );
}

export default App;
