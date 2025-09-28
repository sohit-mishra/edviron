import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { motion, AnimatePresence } from "framer-motion";
import api from "@/api/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface PaymentResponse {
  bank_reference?: string;
  cf_payment_id: number;
  order_id: string;
  order_amount: number;
  payment_amount: number;
  payment_completion_time?: string;
  payment_currency: string;
  payment_group: string;
  payment_message: string;
  payment_method?: {
    upi?: { channel: string; upi_id: string };
    [key: string]: any;
  };
  payment_status: "SUCCESS" | "FAILED" | "PENDING" | "USER_DROPPED" | "ACTIVE";
  payment_time: string;
  student_name?: string;
  student_email?: string;
  totalFees?: number;
  months?: number;
  monthPayment?: number;
  paymentClear?: number;
}

export default function PaymentStatus() {
  const [orderId, setOrderId] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<PaymentResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async () => {
    if (!orderId) return;
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const res = await api.get<PaymentResponse>(`/payment/${orderId}`);
      setResult(res.data);
    } catch (err: any) {
      setError(
        err.response?.data?.message || err.message || "Something went wrong"
      );
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "SUCCESS":
        return <Badge className="bg-green-500">Success</Badge>;
      case "FAILED":
        return <Badge className="bg-red-500">Failed</Badge>;
      case "PENDING":
        return <Badge className="bg-yellow-500">Pending</Badge>;
      case "ACTIVE":
        return <Badge className="bg-blue-500">Active</Badge>;
      case "USER_DROPPED":
        return <Badge className="bg-orange-500">User Dropped</Badge>;
      default:
        return <Badge className="bg-gray-500">Unknown</Badge>;
    }
  };

  return (
    <motion.div
      className="p-6 pt-15 bg-gray-50 h-full"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
    >
      <Card className="w-full max-w-5xl mx-auto shadow-lg rounded-2xl">
        <CardHeader>
          <CardTitle className="text-2xl font-bold flex justify-between items-center">
            Search Transaction
            {result && getStatusBadge(result.payment_status)}
          </CardTitle>
        </CardHeader>

        <CardContent>
          <motion.div
            className="flex gap-2 mb-6"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
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
          </motion.div>

          {error && (
            <motion.p
              className="text-red-500"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              {error}
            </motion.p>
          )}

          <AnimatePresence>
            {result && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.4 }}
                className="grid grid-cols-1 md:grid-cols-2 gap-6"
              >
                {/* Transaction Details */}
                <motion.div
                  initial={{ x: -30, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.2, duration: 0.5 }}
                >
                  <Card className="shadow-md">
                    <CardHeader>
                      <CardTitle className="text-xl">
                        Transaction Details
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2 text-sm">
                      <p>
                        <strong>Order ID:</strong> {result.order_id}
                      </p>
                      <p>
                        <strong>Payment ID:</strong> {result.cf_payment_id}
                      </p>
                      <p>
                        <strong>Order Amount:</strong> ₹{result.order_amount}
                      </p>
                      <p>
                        <strong>Paid Amount:</strong> ₹{result.payment_amount}
                      </p>
                      <p>
                        <strong>Currency:</strong> {result.payment_currency}
                      </p>
                      <p>
                        <strong>Payment Group:</strong> {result.payment_group}
                      </p>
                      <p>
                        <strong>Message:</strong> {result.payment_message}
                      </p>
                      {result.bank_reference && (
                        <p>
                          <strong>Bank Ref:</strong> {result.bank_reference}
                        </p>
                      )}
                      <p>
                        <strong>Payment Time:</strong>{" "}
                        {new Date(result.payment_time).toLocaleString("en-IN")}
                      </p>
                      {result.payment_completion_time && (
                        <p>
                          <strong>Completion Time:</strong>{" "}
                          {new Date(
                            result.payment_completion_time
                          ).toLocaleString("en-IN")}
                        </p>
                      )}
                      {result.payment_method?.upi && (
                        <p>
                          <strong>UPI:</strong>{" "}
                          {result.payment_method.upi.upi_id} (
                          {result.payment_method.upi.channel})
                        </p>
                      )}
                    </CardContent>
                  </Card>
                </motion.div>

                {/* Student Info */}
                <motion.div
                  initial={{ x: 30, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.3, duration: 0.5 }}
                >
                  <Card className="shadow-md">
                    <CardHeader>
                      <CardTitle className="text-xl">Student Info</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2 text-sm">
                      {result.student_name ? (
                        <>
                          <p>
                            <strong>Name:</strong> {result.student_name}
                          </p>
                          <p>
                            <strong>Email:</strong> {result.student_email}
                          </p>
                          {result.totalFees !== undefined && (
                            <p>
                              <strong>Total Fees:</strong> ₹{result.totalFees}
                            </p>
                          )}
                          {result.months !== undefined && (
                            <p>
                              <strong>Months:</strong> {result.months}
                            </p>
                          )}
                          {result.monthPayment !== undefined && (
                            <p>
                              <strong>Monthly Payment:</strong> ₹
                              {result.monthPayment}
                            </p>
                          )}
                          {result.paymentClear !== undefined && (
                            <p>
                              <strong>Payment Clear:</strong> ₹
                              {result.paymentClear}
                            </p>
                          )}
                        </>
                      ) : (
                        <p className="text-gray-500">
                          No student info available
                        </p>
                      )}
                    </CardContent>
                  </Card>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </CardContent>
      </Card>
    </motion.div>
  );
}
