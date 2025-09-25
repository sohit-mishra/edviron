import api from "@/api/api";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import PaymentImage from "@/assets/payment.svg";
import { motion } from "framer-motion";

interface Order {
  _id :string;
  name: string;
  email: string;
  totalFees: number;
  monthPayment: number;
  paymentClear: number;
  paymentDone: number; 
}

export default function PayNow() {
  const [orderDetails, setOrderDetails] = useState<Order | null>(null);
  const [amount, setAmount] = useState<string>("");

  const location = useLocation();
  const { id } = (location.state || {}) as { id?: string };

  useEffect(() => {
    if (!id) return;

    async function fetchData() {
      try {
        const response = await api.get(`/orders/${id}`);
        const order = response.data.order;
        if (order && order.paymentDone === undefined) order.paymentDone = 0;
        setOrderDetails(order);
      } catch {
        toast.error("Failed to load order details");
      }
    }

    fetchData();
  }, [id]);

  const handlePay = async (payAmount: number) => {
    if (!payAmount || isNaN(payAmount) || payAmount <= 0) {
      toast.error("Please enter a valid amount");
      return;
    }
    if (orderDetails && payAmount > (orderDetails.totalFees - orderDetails.paymentDone)) {
      toast.error("Cannot pay more than remaining amount");
      return;
    }

    try {
      const response = await api.post(`/payment/create-payment`, { 
        collect_id : orderDetails?._id,
        order_amount: payAmount,
        email : orderDetails?.email,
        name: orderDetails?.name,
      });
      window.location.href = response.data.payment_link;
      toast.success("Payment processed successfully!");
      setAmount("");
      setOrderDetails((prev) =>
        prev ? { ...prev, paymentDone: prev.paymentDone + payAmount } : prev
      );
      console.log("Payment response:", response.data);
    } catch {
      toast.error("Payment failed");
    }
  };

  if (!orderDetails) {
    return (
      <div className="flex items-center justify-center h-screen text-lg">
        Loading...
      </div>
    );
  }

  const remainingAmount = (orderDetails.totalFees ?? 0) - (orderDetails.paymentDone ?? 0);

  return (
    <div className="bg-gray-50 flex items-center justify-center p-6 mt-10">
      <motion.div
        className="w-full max-w-6xl bg-white p-6 rounded-2xl grid grid-cols-1 md:grid-cols-2 gap-12 items-center"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
  
        <motion.div
          className="flex justify-center"
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
        >
          <motion.img
            src={PaymentImage}
            alt="Payment Illustration"
            className="w-72 md:w-96"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          />
        </motion.div>

   
        <motion.div
          className="space-y-6 w-full max-w-md mx-auto"
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <h1 className="text-2xl font-semibold mb-4">Order Summary</h1>


          <div className="space-y-2 mb-20">
            <div className="flex justify-between">
              <span className="text-gray-500">Name:</span>
              <span className="font-medium">{orderDetails.name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Email:</span>
              <span className="font-medium">{orderDetails.email}</span>
            </div>
          </div>

 
          <div className="space-y-2 mt-4">
             <h1 className="text-2xl font-semibold mb-4">Payment Summary</h1>
            <div className="flex justify-between">
              <span className="text-gray-500">Total Payment:</span>
              <span className="font-medium">₹{(orderDetails.totalFees ?? 0).toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Monthly Payment:</span>
              <span className="font-medium">₹{(orderDetails.monthPayment ?? 0).toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Already Paid:</span>
              <span className="font-medium">₹{(orderDetails.paymentDone ?? 0).toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Remaining:</span>
              <span className="font-medium">₹{remainingAmount.toLocaleString()}</span>
            </div>
          </div>

       
          <div className="flex flex-col space-y-4 mt-4">
            <Button
              className="bg-black text-white hover:bg-gray-800 w-full"
              onClick={() => handlePay(orderDetails.monthPayment)}
            >
              Pay Next Month ₹{orderDetails.monthPayment.toLocaleString()}
            </Button>


            <div className="flex items-center justify-center text-gray-500 font-medium">
              <hr className="w-full border-gray-300" />
              <span className="px-2">or</span>
              <hr className="w-full border-gray-300" />
            </div>

            <div className="flex space-x-2">
              <Input
                type="number"
                placeholder="Enter custom amount"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="flex-1"
              />
              <Button
                className="bg-black text-white hover:bg-gray-800"
                onClick={() => handlePay(Number(amount))}
              >
                Pay
              </Button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
