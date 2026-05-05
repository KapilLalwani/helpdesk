import { useEffect, useState } from "react";

function App() {
  const [health, setHealth] = useState<string | null>(null);

  useEffect(() => {
    fetch("http://localhost:3000/api/health")
      .then((res) => res.json())
      .then((data) => setHealth(data.status))
      .catch(() => setHealth("error"));
  }, []);

  return (
    <div>
      <h1>Helpdesk</h1>
      {health && <p>API status: {health}</p>}
    </div>
  );
}

export default App;