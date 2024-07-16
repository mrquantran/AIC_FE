import { useState } from "preact/hooks";
import MainLayout from "./layout/MainLayout";

export function App() {
  const [count, setCount] = useState(0);

  return <MainLayout />;
}
