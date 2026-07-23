import { BrowserRouter, Routes, Route } from "react-router-dom";

import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Workspace from "./pages/Workspace";
import Memory from "./pages/Memory";
import Advisor from "./pages/Advisor";
import Finance from "./pages/Finance";
import Chat from "./pages/Chat";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/workspace" element={<Workspace />} />
        <Route path="/memory" element={<Memory />} />
        <Route path="/advisor" element={<Advisor />} />
        <Route path="/finance" element={<Finance />} />
        <Route path="/chat" element={<Chat />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;