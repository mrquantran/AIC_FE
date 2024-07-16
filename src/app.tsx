import { useState } from "preact/hooks";
import "./app.css";
import Loading from "./components/Loading";
export function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <h1>Vite + Preact</h1>
      <button onClick={() => setCount((count) => count + 1)}>
        count is {count}
      </button>
      <Loading/>
    </>
  );
}
