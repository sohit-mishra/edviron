"use client";
import { useEffect, useState } from "react";
import api from "@/api/api";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

interface Student {
  _id: string;
  name: string;
  email: string;
  totalFees: number;
  months: number;
  monthPayment: number;
  paymentClear: number;
  role: string;
  schoolId: string;
  isVerified: boolean;
  createdAt: string;
}

export default function StudentDashboard() {
  const navigate = useNavigate();
  const [student, setStudent] = useState<Student | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [loadingPay, setLoadingPay] = useState(false);

  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  useEffect(() => {
    async function fetchStudent() {
      try {
        const response = await api.get<{ user: Student }>("user/me");
        setStudent(response.data.user);
      } catch (err: any) {
        console.error(err);
        setError(err.response?.data?.message || "Failed to load student data");
      } finally {
        setLoading(false);
      }
    }
    fetchStudent();
  }, []);

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen">
        Loading...
      </div>
    );
  if (error)
    return <div className="text-red-500 text-center mt-20">{error}</div>;
  if (!student)
    return <div className="text-center mt-20">No student data found.</div>;

  const createdMonthIndex = new Date(student.createdAt).getMonth();
  const currentMonthIndex = new Date().getMonth();

  const handlePay = async () => {
    if (!student) return;
    try {
      setLoadingPay(true);
      const response = await api.post("/orders", {
        school_id: student.schoolId,
        trustee_id: "TRUST123",
        student_info: student._id,
        gateway_name: "CashFree",
        types: "Tution Fees",
      });

      navigate("/payNow", { state: { order_id: response.data.data.Order_id } });
    } catch (err) {
      console.error("Payment failed:", err);
    } finally {
      setLoadingPay(false);
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen flex flex-col items-center space-y-6">
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-3xl font-bold"
      >
        Welcome, {student.name}
      </motion.h1>

      <div className="flex flex-col md:flex-row gap-6 w-full max-w-5xl">
        <Card className="flex-1 shadow-lg rounded-2xl p-4">
          <CardHeader>
            <CardTitle className="text-xl font-semibold">Total Fees</CardTitle>
          </CardHeader>
          <CardContent className="text-2xl font-bold text-green-600">
            ₹{student.totalFees}
          </CardContent>
        </Card>
        <Card className="flex-1 shadow-lg rounded-2xl p-4">
          <CardHeader>
            <CardTitle className="text-xl font-semibold">
              Monthly Payment
            </CardTitle>
          </CardHeader>
          <CardContent className="text-lg font-medium">
            ₹{student.monthPayment} per month
          </CardContent>
        </Card>
        <Card className="flex-1 shadow-lg rounded-2xl p-4">
          <CardHeader>
            <CardTitle className="text-xl font-semibold">
              Payment Clear
            </CardTitle>
          </CardHeader>
          <CardContent className="text-2xl font-bold text-blue-600">
            ₹{student.paymentClear}
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-3 mt-4 w-full max-w-5xl">
        {[...Array(student.months)].map((_, idx) => {
          const monthName = monthNames[idx % 12];
          const isPaid =
            idx < Math.floor(student.paymentClear / student.monthPayment);
          const isDisabled = idx < createdMonthIndex || idx > currentMonthIndex;

          return (
            <motion.div
              key={idx}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.05 }}
              className={`flex justify-between items-center p-3 rounded-lg shadow-md ${
                isPaid ? "bg-green-100" : "bg-gray-100"
              }`}
            >
              <span className="font-semibold">{monthName}</span>
              <span className="text-sm">₹{student.monthPayment}</span>
              <Button
                size="sm"
                variant={isPaid || isDisabled ? "default" : "outline"}
                disabled={isPaid || isDisabled || loadingPay}
                onClick={() => handlePay()}
              >
                {isPaid ? "Paid" : "Pay Now"}
              </Button>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
