import React, { useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import "./App.css";
import Main from "./views/Main";

function App() {
  useEffect(() => {
    console.log("hello world");
  }, []);
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Main />} />
        <Route path="/List" element={<></>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
