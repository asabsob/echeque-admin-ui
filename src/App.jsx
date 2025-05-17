import { useEffect, useState } from "react";
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

  const downloadCheque = (chequeId) => {
    const node = document.getElementById(`cheque-${chequeId}`);
    html2canvas(node).then((canvas) => {
      const link = document.createElement("a");
      link.download = `cheque-${chequeId}.png`;
      link.href = canvas.toDataURL();
      link.click();
    });
  };

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
              new Date(cheque.expiry_date) < new Date() && cheque.status !== "Revoked"
                ? "Outdated"
                : cheque.status;

            const statusClass = statusColors[status] || "";

            return (
              <div
                key={cheque.id}
                id={`cheque-${cheque.id}`}
                className="relative w-[900px] h-[250px] bg-no-repeat bg-cover font-serif"
                style={{ backgroundImage: 'url("/cheque-template.png")' }}
              >
                {/* Download Button */}
                <button
                  onClick={() => downloadCheque(cheque.id)}
                  className="absolute top-2 right-2 text-xs bg-blue-600 text-white px-2 py-1 rounded"
                >
                  Download
                </button>

                {/* Positioned Fields */}
                <div className="absolute top-[20px] left-[30px] text-sm font-semibold">
                  Cheque #: {cheque.id.slice(0, 8)}
                </div>
                <div className="absolute top-[50px] left-[30px] text-sm">
                  Pay To: {cheque.receiver}
                </div>
                <div className="absolute top-[80px] left-[30px] text-lg font-bold">
                  JD {cheque.amount}
                </div>
                <div className="absolute top-[110px] left-[30px] text-sm">
                  Sender: {cheque.sender}
                </div>
                <div className="absolute top-[140px] left-[30px] text-sm">
                  Date: {cheque.cheque_date}
                </div>
                <div className="absolute top-[170px] left-[30px] text-sm">
                  Expiry: {cheque.expiry_date}
                </div>

                {/* Status Badge */}
                <div
                  className={`absolute top-[170px] right-[30px] text-xs px-2 py-1 rounded-full font-bold ${statusClass}`}
                >
                  {status}
                </div>

                {/* QR Code */}
                <div className="absolute bottom-4 left-4">
                  <QRCodeCanvas
                    value={`https://echeque-admin-ui.vercel.app/cheque/${cheque.id}`}
                    size={60}
                    bgColor="#ffffff"
                    fgColor="#000000"
                    level="H"
                  />
                </div>

                {/* Signature Line */}
                <div className="absolute bottom-4 right-6 text-xs italic text-gray-500">
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
