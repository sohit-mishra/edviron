import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import api from "@/api/api";

interface TransactionResponse {
  order_id: string;
  order_status: string;
  order_amount: number;
  payment_session_id?: string;
  payment_status?: string;
  [key: string]: any;
}

export default function PaymentStatus() {
  const [orderId, setOrderId] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<TransactionResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async () => {
    if (!orderId) return;
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const res = await api.get(`payments/${orderId}`);
      const data = await res.data;
      console.log(res.data)
      setResult(data);
    } catch (err: any) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 mt-50 bg-white shadow-md rounded-lg w-full max-w-lg mx-auto">
      <h2 className="text-xl font-bold mb-4">Search Transaction</h2>
      <div className="flex gap-2 mb-4">
        <Input
          type="text"
          placeholder="Enter Order ID"
          value={orderId}
          onChange={(e) => setOrderId(e.target.value)}
          className="flex-1"
        />
        <Button onClick={handleSearch} disabled={loading}>
          {loading ? "Searching..." : "Search"}
        </Button>
      </div>

      {error && <p className="text-red-500">{error}</p>}
      {result && (
        <div className="bg-gray-50 p-4 rounded-lg border mt-4">
          <p><strong>Order ID:</strong> {result.order_id}</p>
          <p><strong>Status:</strong> {result.order_status}</p>
          <p><strong>Amount:</strong> ₹{result.order_amount}</p>
          {result.payment_status && (
            <p><strong>Payment Status:</strong> {result.payment_status}</p>
          )}
        </div>
      )}
    </div>
  );
}
