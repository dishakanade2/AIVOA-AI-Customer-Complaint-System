import { useState } from "react";
import "./App.css";

function App() {
  const [customerName, setCustomerName] = useState("");
  const [productName, setProductName] = useState("");
  const [description, setDescription] = useState("");

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const [analysis, setAnalysis] = useState({
    category: "Waiting for analysis",
    severity: "Pending",
    summary: "Submit a complaint to receive an AI-generated summary.",
    recommendation: "AI recommendations will appear here.",
  });

  const [complaints, setComplaints] = useState([]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);
    setMessage("");

    const complaint = {
      customerName,
      productName,
      description,
    };

    try {
      const response = await fetch(
        "http://127.0.0.1:8000/complaints",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(complaint),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || "Unable to submit complaint");
      }

      if (data.analysis) {
        setAnalysis(data.analysis);
      }

      setComplaints((prev) => [
        {
          ...complaint,
          id: Date.now(),
          analysis: data.analysis,
        },
        ...prev,
      ]);

      setMessage("Complaint submitted successfully!");

      setCustomerName("");
      setProductName("");
      setDescription("");
    } catch (error) {
      console.error(error);
      setMessage(error.message || "Failed to submit complaint.");
    } finally {
      setLoading(false);
    }
  };

  const severityClass = (severity) => {
    const value = String(severity).toLowerCase();

    if (value.includes("high")) return "high";
    if (value.includes("medium")) return "medium";
    if (value.includes("low")) return "low";

    return "pending";
  };

  return (
    <div className="app-container">

      {/* SIDEBAR */}
      <aside className="sidebar">
        <div className="brand">
          <div className="brand-icon">C</div>
          <span>ComplainAI</span>
        </div>

        <div className="sidebar-label">WORKSPACE</div>

        <nav className="navigation">
          <a href="#dashboard" className="nav-item active">
            <span>▦</span> Dashboard
          </a>

          <a href="#complaint-form" className="nav-item">
            <span>＋</span> New Complaint
          </a>

          <a href="#history" className="nav-item">
            <span>▤</span> Complaint History
          </a>
        </nav>

        <div className="sidebar-bottom">
          <div className="profile">
            <div className="avatar">D</div>
            <div>
              <strong>Disha Kanade</strong>
              <small>Administrator</small>
            </div>
          </div>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className="main-content" id="dashboard">

        <header className="topbar">
          <div>
            <h1>Dashboard</h1>
            <p>AI-powered customer complaint management</p>
          </div>

          <div className="status-badge">
            <span className="status-dot"></span>
            AI Assistant
          </div>
        </header>

        {/* OVERVIEW CARDS */}
        <section className="stats-grid">

          <div className="stat-card">
            <div className="stat-icon blue">▤</div>
            <p>Total Complaints</p>
            <h2>{complaints.length}</h2>
            <small>Submitted complaints</small>
          </div>

          <div className="stat-card">
            <div className="stat-icon red">!</div>
            <p>High Priority</p>
            <h2>
              {complaints.filter(
                (item) =>
                  String(item.analysis?.severity)
                    .toLowerCase()
                    .includes("high")
              ).length}
            </h2>
            <small>High severity complaints</small>
          </div>

          <div className="stat-card">
            <div className="stat-icon purple">✦</div>
            <p>AI Analysis</p>
            <h2>Groq AI</h2>
            <small>Powered by AI</small>
          </div>

        </section>

        {/* FORM AND AI ANALYSIS */}
        <section className="workspace-grid">

          {/* COMPLAINT FORM */}
          <div className="panel" id="complaint-form">

            <div className="panel-heading">
              <div>
                <h2>Submit a Complaint</h2>
                <p>Enter the details below for AI analysis.</p>
              </div>

              <span className="heading-icon">＋</span>
            </div>

            <form onSubmit={handleSubmit}>

              <div className="form-group">
                <label>Customer Name</label>
                <input
                  type="text"
                  placeholder="Enter customer name"
                  value={customerName}
                  onChange={(e) =>
                    setCustomerName(e.target.value)
                  }
                  required
                />
              </div>

              <div className="form-group">
                <label>Product Name</label>
                <input
                  type="text"
                  placeholder="Enter product name"
                  value={productName}
                  onChange={(e) =>
                    setProductName(e.target.value)
                  }
                  required
                />
              </div>

              <div className="form-group">
                <label>Complaint Description</label>
                <textarea
                  rows="5"
                  placeholder="Describe the customer's issue in detail..."
                  value={description}
                  onChange={(e) =>
                    setDescription(e.target.value)
                  }
                  required
                />
              </div>

              {message && (
                <div className="message-box">
                  {message}
                </div>
              )}

              <button
                type="submit"
                className="submit-btn"
                disabled={loading}
              >
                {loading
                  ? "Analyzing Complaint..."
                  : "✦ Submit & Analyze Complaint"}
              </button>

            </form>
          </div>

          {/* AI COPILOT */}
          <div className="panel ai-panel">

            <div className="ai-heading">
              <div className="ai-icon">✦</div>
              <div>
                <h2>AI Copilot</h2>
                <p>Intelligent complaint analysis</p>
              </div>
            </div>

            <div className="ai-content">

              <div className="analysis-item">
                <span>Complaint Category</span>
                <strong>{analysis.category}</strong>
              </div>

              <div className="analysis-item">
                <span>Severity Level</span>
                <strong
                  className={`severity ${severityClass(
                    analysis.severity
                  )}`}
                >
                  {analysis.severity}
                </strong>
              </div>

              <div className="analysis-item">
                <span>AI Summary</span>
                <p>{analysis.summary}</p>
              </div>

              <div className="analysis-item">
                <span>Recommended Action</span>
                <p>{analysis.recommendation}</p>
              </div>

            </div>

            <div className="ai-footer">
              ✦ Analysis powered by Groq AI
            </div>

          </div>

        </section>

        {/* COMPLAINT HISTORY */}
        <section className="panel history-panel" id="history">

          <div className="panel-heading">
            <div>
              <h2>Recent Complaints</h2>
              <p>Recently submitted customer complaints.</p>
            </div>
          </div>

          {complaints.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">▤</div>
              <h3>No complaints yet</h3>
              <p>Submitted complaints will appear here.</p>
            </div>
          ) : (

            <div className="table-wrapper">
              <table>
                <thead>
                  <tr>
                    <th>Customer</th>
                    <th>Product</th>
                    <th>Category</th>
                    <th>Severity</th>
                  </tr>
                </thead>

                <tbody>
                  {complaints.map((item) => (
                    <tr key={item.id}>
                      <td>{item.customerName}</td>
                      <td>{item.productName}</td>
                      <td>
                        {item.analysis?.category || "N/A"}
                      </td>
                      <td>
                        <span
                          className={`severity ${severityClass(
                            item.analysis?.severity
                          )}`}
                        >
                          {item.analysis?.severity || "Pending"}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

          )}

        </section>

        <footer className="footer">
          © 2026 ComplainAI | AI-Powered Customer Complaint Management
        </footer>

      </main>
    </div>
  );
}

export default App;