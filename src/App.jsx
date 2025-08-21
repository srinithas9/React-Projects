import { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "./components/Login";
import Signup from "./components/Signup";
import ToDo from "./components/ToDo";

function App() {
  const [userId, setUserId] = useState(null);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<Login setUserId={setUserId} />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/todo" element={<ToDo userId={userId} />} />
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </Router>
  );
}

export default App;
