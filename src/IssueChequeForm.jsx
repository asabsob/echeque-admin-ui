import { useState } from "react";

export default function IssueChequeForm({ onSuccess }) {
  const [form, setForm] = useState({
    sender_account: "",
    receiver_account: "",
    amount: "",
    cheque_date: "",
    expiry_date: "",
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const res = await fetch("https://echeque-api-production.up.railway.app/echeques/issue", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x_api_key": "bank-abc-key"
        },
        body: JSON.stringify({
          ...form,
          amount: parseFloat(form.amount)
        })
      });

      if (!res.ok) throw new Error("Failed to issue cheque");
      setMessage("✅ Cheque issued successfully!");
      setForm({
        sender_account: "",
        receiver_account: "",
        amount: "",
        cheque_date: "",
        expiry_date: ""
      });

      if (onSuccess) onSuccess(); // to refresh list
    } catch (err) {
      setMessage("❌ Error issuing cheque.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-4 rounded-xl shadow-md mb-6">
      <h2 className="text-xl font-bold mb-4">Issue New Cheque</h2>

      {["sender_account", "receiver_account", "amount", "cheque_date", "expiry_date"].map((field) => (
        <div className="mb-3" key={field}>
          <label className="block text-sm font-medium text-gray-700 capitalize">
            {field.replace("_", " ")}
          </label>
          <input
            required
            type={field.includes("date") ? "date" : "text"}
            name={field}
            value={form[field]}
            onChange={handleChange}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
          />
        </div>
      ))}

      <button
        type="submit"
        disabled={loading}
        className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
      >
        {loading ? "Issuing..." : "Issue Cheque"}
      </button>

      {message && <p className="mt-4 text-sm text-gray-600">{message}</p>}
    </form>
  );
}
