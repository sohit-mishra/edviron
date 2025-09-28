import api from "@/api/api";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { motion } from "framer-motion";
import { Copy } from "lucide-react";
import type { AxiosError } from "axios";

interface Order {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  totalFees: number;
  monthPayment: number;
  paymentClear: number;
  paymentDone: number;
  Order_id: string;
  studentId: string;
}

export default function PayNow() {
  const navigate = useNavigate();
  const [orderDetails, setOrderDetails] = useState<Order | null>(null);
  const [amount, setAmount] = useState<string>("");
  const [phone, setPhone] = useState<string>("");
  const [phoneError, setPhoneError] = useState<string>("");

  const location = useLocation();
  const { order_id } = (location.state || {}) as { order_id?: string };

  useEffect(() => {
    if (!order_id) return;

    async function fetchData() {
      try {
        const response = await api.get(`/orders/${order_id}`);
        const order = response.data.order;
        if (order && order.paymentDone === undefined) order.paymentDone = 0;
        setOrderDetails(order);
        setPhone(order.phone ?? "");
      } catch {
        toast.error("Failed to load order details");
      }
    }

    fetchData();
  }, [order_id]);

  const validatePhone = (value: string) => {
    if (!/^\d{10}$/.test(value)) {
      setPhoneError("Please enter a valid 10-digit phone number");
      return false;
    }
    setPhoneError("");
    return true;
  };

  const handlePay = async (payAmount: number) => {
    if (!payAmount || isNaN(payAmount) || payAmount <= 0) {
      toast.error("Please enter a valid amount");
      return;
    }

    if (!validatePhone(phone)) {
      toast.error("Invalid phone number");
      return;
    }

    if (
      orderDetails &&
      payAmount > orderDetails.totalFees - orderDetails.paymentDone
    ) {
      toast.error("Cannot pay more than remaining amount");
      return;
    }

    try {
      const response = await api.post(`/payment/create-payment`, {
        collect_id: orderDetails?._id,
        order_amount: payAmount,
        email: orderDetails?.email,
        name: orderDetails?.name,
        order_id: orderDetails?.Order_id,
        student_id: orderDetails?.studentId,
        phone: phone,
      });

      window.location.href = response.data.payment_link;
      toast.success("Payment processed successfully!");
      setAmount("");
      setOrderDetails((prev) =>
        prev
          ? { ...prev, paymentDone: prev.paymentDone + payAmount, phone }
          : prev
      );
    } catch (err: unknown) {
      const error = err as AxiosError;
      console.error(error.response?.data);
      toast.error(
        "Payment failed: " + (error.response?.data as any)?.message || ""
      );
      navigate('/createPayment');
    }
  };

  if (!orderDetails) {
    return (
      <div className="flex items-center justify-center h-screen text-base sm:text-lg">
        Loading...
      </div>
    );
  }

  const remainingAmount =
    (orderDetails.totalFees ?? 0) - (orderDetails.paymentDone ?? 0);

  const handleCopy = () => {
    navigator.clipboard.writeText(orderDetails.Order_id);
    toast.success("Order ID copied!");
  };

  return (
    <div className="bg-gray-50 flex items-center justify-center px-4 py-8 sm:p-6 mt-10 sm:mt-20">
      <motion.div
        className="w-full max-w-6xl bg-white p-4 sm:p-6 rounded-2xl flex flex-col md:flex-row gap-6 sm:gap-10"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="space-y-4 w-full md:w-1/2">
          <h1 className="text-xl sm:text-2xl font-semibold mb-4">
            Enter Student Info
          </h1>

          <div>
            <span className="block text-gray-600 mb-1 text-sm sm:text-base">
              Name:
            </span>
            <Input type="text" value={orderDetails.name} readOnly />
          </div>

          <div>
            <span className="block text-gray-600 mb-1 text-sm sm:text-base">
              Email:
            </span>
            <Input type="email" value={orderDetails.email} readOnly />
          </div>

          <div>
            <span className="block text-gray-600 mb-1 text-sm sm:text-base">
              Phone:
            </span>
            <Input
              type="text"
              value={phone}
              onChange={(e) => {
                setPhone(e.target.value);
                validatePhone(e.target.value);
              }}
              placeholder="Enter phone number"
              maxLength={10}
            />
            {phoneError && (
              <p className="text-red-500 text-sm mt-1">{phoneError}</p>
            )}
          </div>

          <div>
            <span className="block text-gray-600 mb-1 text-sm sm:text-base">
              Order ID:
            </span>
            <div className="flex items-center gap-2 break-all">
              <span className="text-xs sm:text-sm">
                {orderDetails.Order_id}
              </span>
              <Copy size={18} onClick={handleCopy} className="cursor-pointer" />
            </div>
          </div>
        </div>

        <div className="space-y-6 w-full md:w-1/2">
          <h1 className="text-xl sm:text-2xl font-semibold mb-4">
            Payment Summary
          </h1>

          <div className="space-y-2 text-sm sm:text-base">
            <div className="flex justify-between">
              <span className="text-gray-500">Total Payment:</span>
              <span className="font-medium">
                ₹{(orderDetails.totalFees ?? 0).toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Monthly Payment:</span>
              <span className="font-medium">
                ₹{(orderDetails.monthPayment ?? 0).toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Already Paid:</span>
              <span className="font-medium">
                ₹{(orderDetails.paymentDone ?? 0).toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Remaining:</span>
              <span className="font-medium">
                ₹{remainingAmount.toLocaleString()}
              </span>
            </div>
          </div>

          <div className="flex flex-col space-y-4 mt-4">
            <Button
              className="bg-black text-white hover:bg-gray-800 w-full text-sm sm:text-base"
              onClick={() => handlePay(orderDetails.monthPayment)}
              disabled={10 != phone.length || amount.length != 0}
            >
              Pay Next Month ₹{orderDetails.monthPayment.toLocaleString()}
            </Button>

            <div className="flex items-center justify-center text-gray-500 font-medium text-sm sm:text-base">
              <hr className="w-full border-gray-300" />
              <span className="px-2">or</span>
              <hr className="w-full border-gray-300" />
            </div>

            <div className="flex flex-col sm:flex-row sm:space-x-2 space-y-2 sm:space-y-0">
              <Input
                type="number"
                placeholder="Enter custom amount"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="flex-1 text-sm sm:text-base"
              />
              <Button
                className="bg-black text-white hover:bg-gray-800 w-full sm:w-auto text-sm sm:text-base"
                onClick={() => handlePay(Number(amount))}
                disabled={phone.length !== 10 || Number(amount) <= 0}
              >
                Pay
              </Button>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
