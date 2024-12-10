import { Routes, Route } from "react-router-dom";
import { Authenticator } from "@aws-amplify/ui-react";
import Hero from "./pages/Hero";
import Story from "./pages/Story";
import Chat from "./pages/Chat";
import "./App.css";
import "@aws-amplify/ui-react/styles.css";

function App() {
  return (
    <>
      <Authenticator>
        <Routes>
          <Route path="/" element={<Hero />} />
          <Route path="/chat" element={<Chat />} />
          <Route path="/story/:id" element={<Story />} />
        </Routes>
      </Authenticator>
    </>
  );
}

export default App;
