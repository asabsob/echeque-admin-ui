import { useEffect, useState } from "react";

const statusColors = {
  Pending: "bg-yellow-100 text-yellow-800",
  Signed: "bg-blue-100 text-blue-800",
  Presented: "bg-green-100 text-green-800",
  Revoked: "bg-red-100 text-red-800",
  Outdated: "bg-gray-300 text-gray-700",
};

export default function EChequeDashboard() {
  const [cheques, setCheques] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    fetch("https://echeque-api-production.up.railway.app/echeques/all", {
      headers: {
        "x_api_key": "bank-abc-key",
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Network response was not ok");
        return res.json();
      })
      .then((data) => setCheques(data))
      .catch((err) => {
        console.error(err);
        setError(true);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <div className="p-6 text-center text-gray-600 text-lg">🔄 Loading cheques...</div>;
  }

  if (error) {
    return <div className="p-6 text-center text-red-600 text-lg">❌ Failed to load cheques.</div>;
  }

  if (cheques.length === 0) {
    return <div className="p-6 text-center text-gray-500 text-lg">No cheques available.</div>;
  }

  return (
    <div className="p-6 min-h-screen bg-gray-50 grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
      {cheques.map((cheque) => {
        const status =
          new Date(cheque.expiry_date) < new Date() && cheque.status !== "Revoked"
            ? "Outdated"
            : cheque.status;

        return (
          <div key={cheque.id} className="rounded-2xl shadow-md border border-gray-200 bg-white p-4">
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
  );
}
