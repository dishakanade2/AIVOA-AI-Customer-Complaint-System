import { useState } from "react";

function App() {
  const [customerName, setCustomerName] = useState("");
  const [productName, setProductName] = useState("");
  const [description, setDescription] = useState("");

  const [analysis, setAnalysis] = useState({
    category: "Waiting...",
    severity: "Waiting...",
    summary: "Waiting...",
    recommendation: "Waiting...",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    const complaint = {
      customerName,
      productName,
      description,
    };

    try {
      const response = await fetch("http://127.0.0.1:8000/complaints", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(complaint),
      });

      const data = await response.json();

      alert(data.message);

      if (data.analysis) {
        setAnalysis(data.analysis);
      }

      setCustomerName("");
      setProductName("");
      setDescription("");
    } catch (error) {
      console.error(error);
      alert("Failed to submit complaint");
    }
  };

  return (
    <div
      style={{
        display: "flex",
        gap: "20px",
        padding: "20px",
        fontFamily: "Arial",
        background: "#f5f5f5",
        minHeight: "100vh",
      }}
    >
      {/* Complaint Form */}
      <div
        style={{
          flex: 2,
          background: "white",
          padding: "20px",
          borderRadius: "10px",
          boxShadow: "0px 2px 8px rgba(0,0,0,0.1)",
        }}
      >
        <h2>Customer Complaint Form</h2>

        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Customer Name"
            value={customerName}
            onChange={(e) => setCustomerName(e.target.value)}
            style={{
              width: "100%",
              padding: "10px",
              marginBottom: "15px",
            }}
            required
          />

          <input
            type="text"
            placeholder="Product Name"
            value={productName}
            onChange={(e) => setProductName(e.target.value)}
            style={{
              width: "100%",
              padding: "10px",
              marginBottom: "15px",
            }}
            required
          />

          <textarea
            rows="6"
            placeholder="Complaint Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            style={{
              width: "100%",
              padding: "10px",
              marginBottom: "15px",
            }}
            required
          />

          <button
            type="submit"
            style={{
              padding: "12px 20px",
              backgroundColor: "#2563eb",
              color: "white",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
            }}
          >
            Submit Complaint
          </button>
        </form>
      </div>

      {/* AI Copilot */}
      <div
        style={{
          flex: 1,
          background: "white",
          padding: "20px",
          borderRadius: "10px",
          boxShadow: "0px 2px 8px rgba(0,0,0,0.1)",
        }}
      >
        <h2>🤖 AI Copilot</h2>

        <p>
          <strong>Category:</strong> {analysis.category}
        </p>

        <p>
          <strong>Severity:</strong> {analysis.severity}
        </p>

        <p>
          <strong>Summary:</strong>
          <br />
          {analysis.summary}
        </p>

        <p>
          <strong>Recommendation:</strong>
          <br />
          {analysis.recommendation}
        </p>
      </div>
    </div>
  );
}

export default App;