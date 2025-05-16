import { useEffect, useState } from "react";
import IssueChequeForm from "./IssueChequeForm"; // 👈 Add this import

// ... existing statusColors, etc.

export default function EChequeDashboard() {
  const [cheques, setCheques] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const fetchCheques = () => {
    setLoading(true);
    fetch("https://echeque-api-production.up.railway.app/echeques/all", {
      headers: {
        "x_api_key": "bank-abc-key",
      },
    })
      .then((res) => res.json())
      .then((data) => setCheques(data))
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchCheques();
  }, []);

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <IssueChequeForm onSuccess={fetchCheques} />

      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p className="text-red-600">❌ Failed to load cheques.</p>
      ) : cheques.length === 0 ? (
        <p>No cheques available.</p>
      ) : (
        <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {cheques.map((cheque) => {
            const status =
              new Date(cheque.expiry_date) < new Date() && cheque.status !== "Revoked"
                ? "Outdated"
                : cheque.status;

            return (
              <div
                key={cheque.id}
                className="rounded-2xl shadow-md border border-gray-200 bg-white p-4"
              >
                <div className="flex justify-between items-center mb-2">
                  <div className="font-bold text-lg">Cheque #{cheque.id.slice(0, 8)}</div>
                  <span className={`${statusColors[status]} px-3 py-1 rounded-full text-sm`}>
                    {status}
                  </span>
                </div>
                <div className="text-sm text-gray-700 space-y-1">
                  <p>Sender: <span className="font-medium">{cheque.sender}</span></p>
                  <p>Receiver: <span className="font-medium">{cheque.receiver}</span></p>
                  <p>Amount: <span className="font-medium">JD {cheque.amount}</span></p>
                  <p>Date: <span className="font-medium">{cheque.cheque_date}</span></p>
                  <p>Expiry: <span className="font-medium">{cheque.expiry_date}</span></p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
