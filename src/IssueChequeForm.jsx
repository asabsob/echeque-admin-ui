import { useState } from "react";

export default function IssueChequeForm({ onSuccess }) {
  const [formData, setFormData] = useState({
    sender_account: "",
    receiver_account: "",
    amount: "",
    cheque_date: "",
    expiry_date: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    fetch("https://echeque-api-production.up.railway.app/echeques/issue", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x_api_key": "bank-abc-key",
      },
      body: JSON.stringify(formData),
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to issue cheque");
        return res.json();
      })
      .then(() => {
        onSuccess(); // Refresh cheques
        setFormData({
          sender_account: "",
          receiver_account: "",
          amount: "",
          cheque_date: "",
          expiry_date: "",
        });
      })
      .catch((err) => alert(err.message));
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-4 rounded-xl shadow-md mb-6 grid grid-cols-1 md:grid-cols-2 gap-4">
      <input
        type="text"
        name="sender_account"
        placeholder="Sender Account"
        value={formData.sender_account}
        onChange={handleChange}
        className="border p-2 rounded"
        required
      />
      <input
        type="text"
        name="receiver_account"
        placeholder="Receiver Account"
        value={formData.receiver_account}
        onChange={handleChange}
        className="border p-2 rounded"
        required
      />
      <input
        type="number"
        name="amount"
        placeholder="Amount"
        value={formData.amount}
        onChange={handleChange}
        className="border p-2 rounded"
        required
      />
      <input
        type="date"
        name="cheque_date"
        value={formData.cheque_date}
        onChange={handleChange}
        className="border p-2 rounded"
        required
      />
      <input
        type="date"
        name="expiry_date"
        value={formData.expiry_date}
        onChange={handleChange}
        className="border p-2 rounded"
        required
      />
      <button
        type="submit"
        className="col-span-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
      >
        Issue Cheque
      </button>
    </form>
  );
}
