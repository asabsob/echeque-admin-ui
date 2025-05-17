import { useEffect, useState, useRef } from "react";
import IssueChequeForm from "./IssueChequeForm";
import { QRCodeCanvas } from "qrcode.react";
import html2canvas from "html2canvas";

const statusColors = {
  Pending: "bg-yellow-200 text-yellow-800",
  Signed: "bg-blue-200 text-blue-800",
  Presented: "bg-green-200 text-green-800",
  Revoked: "bg-red-200 text-red-800",
  Outdated: "bg-gray-300 text-gray-700",
};

export default function App() {
  const [cheques, setCheques] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [filter, setFilter] = useState("All");

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

  const filteredCheques =
    filter === "All" ? cheques : cheques.filter((c) => c.status === filter);

  return (
    <div className="p-6 bg-slate-100 min-h-screen space-y-6">
      <IssueChequeForm onSuccess={fetchCheques} />

      <div className="flex flex-wrap gap-2">
        {["All", "Pending", "Signed", "Presented", "Revoked", "Outdated"].map((f) => (
          <button
            key={f}
            className={`px-3 py-1 rounded ${
              filter === f ? "bg-blue-600 text-white" : "bg-gray-200"
            }`}
            onClick={() => setFilter(f)}
          >
            {f}
          </button>
        ))}
      </div>

      {loading ? (
        <p className="text-center">Loading...</p>
      ) : error ? (
        <p className="text-center text-red-600">❌ Failed to load cheques.</p>
      ) : filteredCheques.length === 0 ? (
        <p className="text-center">No cheques found.</p>
      ) : (
        <div className="grid gap-6 grid-cols-1 md:grid-cols-2">
          {filteredCheques.map((cheque) => {
            const status =
              new Date(cheque.expiry_date) < new Date() &&
              cheque.status !== "Revoked"
                ? "Outdated"
                : cheque.status;

            const chequeRef = useRef(null);

            const downloadCheque = () => {
              html2canvas(chequeRef.current).then((canvas) => {
                const link = document.createElement("a");
                link.download = `cheque-${cheque.id}.png`;
                link.href = canvas.toDataURL();
                link.click();
              });
            };

            return (
              <div
                key={cheque.id}
                ref={chequeRef}
                className="relative bg-white border border-gray-400 shadow-lg rounded-xl px-6 py-4 font-serif"
                style={{
                  backgroundImage: 'url("/cheque-bg.png")',
                  backgroundSize: "cover",
                  backgroundRepeat: "no-repeat",
                }}
              >
                <button
                  onClick={downloadCheque}
                  className="absolute top-2 right-2 text-xs bg-blue-600 text-white px-2 py-1 rounded"
                >
                  Download
                </button>

                <div className="flex justify-between text-sm text-gray-600 mb-2">
                  <span>فرع</span>
                  <span className="italic">Cheque #{cheque.id.slice(0, 8)}</span>
                </div>

                <div className="flex justify-between mb-3">
                  <div className="text-sm">
                    <span className="font-bold">Pay To:</span> {cheque.receiver}
                  </div>
                  <div className="text-sm">
                    <span className="font-bold">Date:</span> {cheque.cheque_date}
                  </div>
                </div>

                <div className="text-lg font-bold mb-2">JD {cheque.amount}</div>

                <div className="text-sm text-gray-700 mb-2">
                  <span className="font-bold">Sender:</span> {cheque.sender}
                </div>

                <div className="flex justify-between text-xs mb-3">
                  <span>Expiry: {cheque.expiry_date}</span>
                  <span className={`px-2 py-1 rounded-full ${statusColors[status]}`}>
                    {status}
                  </span>
                </div>

                <div className="absolute bottom-4 left-4">
                  <QRCodeCanvas
  value={`https://echeque-admin-ui.vercel.app/cheque/${cheque.id}`}
/>
                    size={60}
                    bgColor="#ffffff"
                    fgColor="#000000"
                    level="H"
                  />
                </div>

                <div className="mt-8 border-t pt-2 text-right text-xs italic text-gray-500">
                  Signature ____________________
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
'''
