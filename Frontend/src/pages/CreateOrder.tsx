"use client";
import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import api from "@/api/api";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

interface School {
  _id: string;
  schoolName: string;
}

interface Student {
  _id: string;
  name: string;
}

export default function CreateOrder() {
  const navigate = useNavigate();
  const [school, setSchool] = useState<School | null>(null);
  const [students, setStudents] = useState<Student[]>([]);
  const [form, setForm] = useState({
    school_id: "",
    trusteeId: "",
    studentId: "",
    gatewayName: "",
    type: "",
  });

  useEffect(() => {
    async function fetchData() {
      try {
        const schoolRes = await api.get("/school/select");
        setSchool(schoolRes.data);
        const studentsRes = await api.get("/students/option");
        setStudents(studentsRes.data);
      } catch (err) {
        toast.error("Failed to load school/students");
      }
    }
    fetchData();
  }, []);

  const handleChange = (field: string, value: string) => {
    setForm({ ...form, [field]: value });
  };

  const handleSubmit = async () => {
    if (!form.school_id || !form.trusteeId || !form.studentId) {
      toast.error("Please fill all required fields");
      return;
    }

    try {
      const res = await api.post("/orders", {
        school_id: form.school_id,
        trustee_id: form.trusteeId,
        student_info: form.studentId,
        gateway_name: form.gatewayName,
        types: form.type,
      });

      navigate("/payNow", { state: { order_id: res.data.data.Order_id } });

      toast.success("Order created successfully");
      setForm({
        school_id: "",
        trusteeId: "",
        studentId: "",
        gatewayName: "",
        type: "",
      });
    } catch (error: unknown) {
      toast.error("Failed to create order");
    }
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { staggerChildren: 0.15, duration: 0.5 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
  };

  return (
    <motion.div
      className="max-w-lg mx-auto mt-10"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <Card className="p-4 shadow-lg">
        <CardHeader>
          <motion.div variants={itemVariants}>
            <CardTitle className="text-2xl text-center">Create Order</CardTitle>
          </motion.div>
        </CardHeader>
        <CardContent className="space-y-4">
          {school && (
            <motion.div className="w-full" variants={itemVariants}>
              <Label className="mb-1">School</Label>
              <Select
                value={form.school_id}
                onValueChange={(value) => handleChange("school_id", value)}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select School" />
                </SelectTrigger>
                <SelectContent className="w-full">
                  <SelectItem value={school._id}>{school.schoolName}</SelectItem>
                </SelectContent>
              </Select>
            </motion.div>
          )}

          <motion.div className="w-full" variants={itemVariants}>
            <Label className="mb-1">Trustee ID</Label>
            <Input
              value={form.trusteeId}
              onChange={(e) => handleChange("trusteeId", e.target.value)}
              placeholder="Enter trustee ID"
              className="w-full"
            />
          </motion.div>

          <motion.div className="w-full" variants={itemVariants}>
            <Label className="mb-1">Select Student</Label>
            <Select
              value={form.studentId}
              onValueChange={(value) => handleChange("studentId", value)}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select Student" />
              </SelectTrigger>
              <SelectContent className="w-full">
                {students.map((student) => (
                  <SelectItem key={student._id} value={student._id}>
                    {student.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </motion.div>

          <motion.div className="w-full" variants={itemVariants}>
            <Label className="mb-1">Gateway</Label>
            <Select
              value={form.gatewayName}
              onValueChange={(value) => handleChange("gatewayName", value)}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select gateway" />
              </SelectTrigger>
              <SelectContent className="w-full">
                <SelectItem value="CashFree">CashFree</SelectItem>
                <SelectItem value="Razorpay" disabled>
                  Razorpay
                </SelectItem>
              </SelectContent>
            </Select>
          </motion.div>

          <motion.div className="w-full" variants={itemVariants}>
            <Label className="mb-1">Payment Type</Label>
            <Input
              value={form.type}
              onChange={(e) => handleChange("type", e.target.value)}
              placeholder="Tuition, Exam Fee, etc."
              className="w-full"
            />
          </motion.div>

          <motion.div variants={itemVariants}>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button onClick={handleSubmit} className="w-full mt-2">
                Create Order
              </Button>
            </motion.div>
          </motion.div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
