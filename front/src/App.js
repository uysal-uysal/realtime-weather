import { useState } from "react";

import "./App.css";
import Latest from "./components/Latest";
import Past from "./components/Past";

function App() {
  const [isLatest, setIsLatest] = useState(false);

  const toggleView = () => {
    setIsLatest(!isLatest);
  };

  return (
    <>
      <div className="App">
        <header className="App-header">
          <h1>Weather App</h1>
          <button onClick={toggleView}>Toggle View</button>
          {isLatest ? <Latest /> : <Past />}
        </header>
      </div>
    </>
  );
}

export default App;
