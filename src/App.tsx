import { useState } from "react";
import InteractiveCalendar from "./components/InteractiveCalendar";

function App() {
  const [dark, setDark] = useState(false);

  return (
    <div
      className={`min-h-[100dvh] flex items-center justify-center transition-colors duration-300 ${
        dark ? "bg-gray-900" : "bg-gray-200"
      }`}
    >
      <InteractiveCalendar dark={dark} setDark={setDark} />
    </div>
  );
}

export default App;