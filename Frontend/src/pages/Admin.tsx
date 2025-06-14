import React, { useEffect, useState } from 'react';
import axios from 'axios';

declare global {
  interface Window {
    Razorpay: any;
  }
}

interface Report {
  id: string;
  location: string;
  bounty: number;
  contractor: { id: string };
}

const loadRazorpayScript = (): Promise<boolean> => {
  return new Promise((resolve) => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

const Admin: React.FC = () => {
  const [completed, setCompleted] = useState<Report[]>([]);

  useEffect(() => {
    axios
      .get<Report[]>('http://localhost:8080/api/get-completedWork')
      .then((res) => setCompleted(res.data))
      .catch((err) => console.error('Failed to fetch completed work:', err));
  }, []);

  const fulfilPayment = async (reportId: string, contractorId: string) => {
  try {
    await axios.post('http://localhost:8080/api/verify', null, {
      params: { reportId },
    });

    const report = completed.find(r => r.id === reportId);
    if (!report) return;

    const qrResp = await axios.get(`http://localhost:8080/api/get-upi-qr`, {
      params: {
        contractorId,
        amount: report.bounty,
      },
    });

    const qrUrl = qrResp.data;

    const qrWindow = window.open("", "_blank", "width=300,height=350");
    qrWindow?.document.write(`
      <html>
        <head><title>Pay via UPI</title></head>
        <body style="text-align: center; font-family: sans-serif;">
          <h3>Scan to Pay</h3>
          <img src="${qrUrl}" alt="UPI QR Code" />
          <p>Amount: ₹${report.bounty}</p>
        </body>
      </html>
    `);

  } catch (error) {
    console.error('QR Payment error:', error);
    alert('Something went wrong. Please try again.');
  }
};


  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Completed Repairs - Pending Payments</h1>
      <ul>
        {completed.map((r) => (
          <li key={r.id} className="border p-4 rounded-lg shadow mb-3">
            <p><strong>Contractor ID:</strong> {r.contractor.id}</p>
            <p><strong>Location:</strong> {r.location}</p>
            <p><strong>Bounty:</strong> ₹{r.bounty}</p>
            <button
              onClick={() => fulfilPayment(r.id, r.contractor.id)}
              className="bg-green-500 text-white px-4 py-2 mt-2 rounded"
            >
              Fulfil Payment
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Admin;