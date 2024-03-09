import { Route, Routes } from "react-router-dom";
import { Home, Chat } from "./Pages";
import "./App.css";

function App() {
  return (
    <div>
      <Routes>
        <Route path={"/"} element={<Home />} />
        <Route path={"/chats"} element={<Chat />} />
      </Routes>
    </div>
  );
}

export default App;
