import { useState } from "react";
import { QRCodeCanvas } from "qrcode.react";

const UpiQrGenerator = ({ onPaymentConfirmed }) => {
  const [upiId, setUpiId] = useState("");
  const [amount, setAmount] = useState("");
  const [note, setNote] = useState("");
  const [showQR, setShowQR] = useState(false);

  const upiLink = `upi://pay?pa=${upiId}&pn=${encodeURIComponent(
    "Payment Request"
  )}&am=${amount}&cu=INR&tn=${encodeURIComponent(note)}`;

  const handleConfirm = () => {
    onPaymentConfirmed({
      amount: parseFloat(amount),
      upiId,
      note,
      date: new Date().toISOString(),
    });

    // reset
    setUpiId("");
    setAmount("");
    setNote("");
    setShowQR(false);
  };

  return (
    <div className="p-4 bg-white rounded-xl shadow-md max-w-md mx-auto">
      {!showQR ? (
        <>
          <h2 className="text-xl font-semibold mb-4 text-gray-800">Send UPI Payment</h2>
          <input
            type="text"
            placeholder="Receiver UPI ID (e.g., name@bank)"
            value={upiId}
            onChange={(e) => setUpiId(e.target.value)}
            className="input input-bordered w-full mb-3"
          />
          <input
            type="number"
            placeholder="Amount (₹)"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="input input-bordered w-full mb-3"
          />
          <input
            type="text"
            placeholder="Note (e.g., Grocery)"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            className="input input-bordered w-full mb-3"
          />
          <button
            className="btn btn-primary w-full"
            onClick={() => setShowQR(true)}
            disabled={!upiId || !amount}
          >
            Generate UPI QR
          </button>
        </>
      ) : (
        <>
          <h3 className="text-lg font-semibold mb-2 text-gray-700">Scan to Pay</h3>
          <QRCodeCanvas value={upiLink} size={220} level="H" includeMargin />
          <p className="mt-3 text-gray-600">
            Scan with any UPI app (Google Pay, Paytm, PhonePe).
          </p>
          <button
            className="btn btn-success mt-4 w-full"
            onClick={handleConfirm}
          >
            Payment Done
          </button>
          <button
            className="btn btn-secondary mt-2 w-full"
            onClick={() => setShowQR(false)}
          >
            Back
          </button>
        </>
      )}
    </div>
  );
};

export default UpiQrGenerator;
