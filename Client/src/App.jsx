import { Route, Routes } from "react-router-dom";
import { Home, Chat } from "./Pages";
import "./App.css";
function App() {
  return (
    <div>
      <Routes>
        <Route path={"/"} Component={Home} />
        <Route path={"/chats"} Component={Chat} />
      </Routes>
    </div>
  );
}

export default App;
