import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import api from "@/api/api";
import Confetti from "react-confetti";
import { motion } from "framer-motion";

interface PaymentResponse {
  cf_payment_id: number;
  order_id: string;
  payment_status: "SUCCESS" | "FAILED" | "PENDING" | "USER_DROPPED";
  payment_message: string;
}

export default function PaymentCheckStatus() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [status, setStatus] = useState<PaymentResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [showConfetti, setShowConfetti] = useState<boolean>(false);

  useEffect(() => {
    if (!id) return;

    async function fetchStatus() {
      try {
        setLoading(true);
        const response = await api.get<PaymentResponse>(`/payment/checkStatus/${id}`);
        const data: PaymentResponse = response.data;

        setStatus(data);

        if (data.payment_status === "SUCCESS") {
          setShowConfetti(true);
          setTimeout(() => setShowConfetti(false), 15000);
        }

        setTimeout(() => {
          navigate("/");
        }, 5000);
      } catch (err: unknown) {
        console.error(err);
        toast.error("Failed to fetch payment status");
      } finally {
        setLoading(false);
      }
    }

    fetchStatus();
  }, [id, navigate]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen text-lg">
        Checking payment status...
      </div>
    );
  }

  if (!status) {
    return (
      <div className="flex justify-center items-center h-screen text-lg">
        No payment found.
      </div>
    );
  }

  const statusColors: Record<PaymentResponse["payment_status"], string> = {
    SUCCESS: "text-green-600",
    FAILED: "text-red-600",
    PENDING: "text-yellow-600",
    USER_DROPPED: "text-orange-600",
  };

  return (
    <div className="flex flex-col items-center justify-center h-full space-y-4 p-4 mt-60">
      {showConfetti && (
        <Confetti
          width={window.innerWidth}
          height={window.innerHeight}
          recycle={false}
          numberOfPieces={2000}
        />
      )}

      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="flex flex-col items-center space-y-4"
      >
        <h1 className="text-2xl font-semibold">Payment Status</h1>
        <p className={`text-xl font-medium ${statusColors[status.payment_status]}`}>
          {status.payment_status}
        </p>
        <p className="text-gray-600 text-center">{status.payment_message}</p>
        <p className="text-sm text-gray-500">Order ID: {status.order_id}</p>
        <p className="text-sm text-gray-500">Payment ID: {status.cf_payment_id}</p>
      </motion.div>
    </div>
  );
}
