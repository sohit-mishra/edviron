import React, { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { motion } from "framer-motion";
import { toast } from "sonner";
import api from "@/api/api";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function StudentPayment() {
  const [loading, setLoading] = useState(false);
  const [studentPayment, setStudentPayment] = useState({
    name: "",
    email: "",
    schoolId: "",
    totalFees: "",
    months: "12",
    monthPayment: "",
  });
  const [responseData, setResponseData] = useState<any>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [schools, setSchools] = useState<{ _id: string; schoolName: string }[]>(
    []
  );

  const fetchSchools = async () => {
    setLoading(true);
    try {
      const response = await api.get("/school/select");
      setSchools([response.data]);
    } catch (error) {
      console.error(error);
      toast.error("Failed to fetch school data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSchools();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setStudentPayment((prev) => ({
      ...prev,
      [name]: value,
      monthPayment:
        name === "totalFees" || name === "months"
          ? prev.months && (name === "months" ? value : prev.months)
            ? (
                Number(name === "totalFees" ? value : prev.totalFees) /
                Number(name === "months" ? value : prev.months)
              ).toFixed(2)
            : ""
          : prev.monthPayment,
    }));
  };

  const handleSelectChange = (value: string) => {
    setStudentPayment({ ...studentPayment, schoolId: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const payload = {
      ...studentPayment,
      totalFees: Number(studentPayment.totalFees),
      months: Number(studentPayment.months),
      monthPayment: Number(studentPayment.monthPayment),
    };

    try {
      const res = await api.post(`/students/create`, payload);
      setResponseData(res.data.data);
      setIsDialogOpen(true);
      setStudentPayment({
        name: "",
        email: "",
        schoolId: "",
        totalFees: "",
        months: "12",
        monthPayment: "",
      });
      toast.success(res.data.message);
    } catch (error: any) {
      console.error(error);
      const errorMessage =
        error.response?.data?.message || "Something went wrong";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 120, damping: 20 }}
        className="max-w-md mx-auto mt-10"
      >
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl text-center">
              Student Payment
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
              <div className="flex flex-col">
                <Label htmlFor="name" className="mb-2">
                  Student Name
                </Label>
                <Input
                  id="name"
                  name="name"
                  value={studentPayment.name}
                  onChange={handleChange}
                  placeholder="Enter student name"
                  required
                />
              </div>

              <div className="flex flex-col">
                <Label htmlFor="email" className="mb-2">
                  Student Email
                </Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={studentPayment.email}
                  onChange={handleChange}
                  placeholder="Enter email"
                  required
                />
              </div>

              <div className="flex flex-col">
                <Label htmlFor="schoolId" className="mb-2">
                  School Name
                </Label>
                <Select
                  onValueChange={handleSelectChange}
                  value={studentPayment.schoolId}
                  required
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select a school" />
                  </SelectTrigger>
                  <SelectContent className="w-full">
                    {schools.map((school) => (
                      <SelectItem key={school._id} value={school._id}>
                        {school.schoolName}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex flex-col">
                <Label htmlFor="totalFees" className="mb-2">
                  Total Fees
                </Label>
                <Input
                  id="totalFees"
                  name="totalFees"
                  type="number"
                  value={studentPayment.totalFees}
                  onChange={handleChange}
                  placeholder="Enter total fees"
                  required
                />
              </div>

              <div className="flex flex-col">
                <Label htmlFor="months" className="mb-2">
                  Number of Months
                </Label>
                <Input
                  id="months"
                  name="months"
                  type="number"
                  value={studentPayment.months}
                  onChange={(e) => {
                    let value = e.target.value;
                    if (Number(value) < 0) value = "0";
                    if (Number(value) > 12) value = "12";
                    setStudentPayment((prev) => ({
                      ...prev,
                      months: value,
                    }));
                  }}
                  placeholder="Enter number of months"
                  min={0}
                  max={12}
                  required
                />
              </div>

              <div className="flex flex-col">
                <Label htmlFor="monthPayment" className="mb-2">
                  Monthly Payment
                </Label>
                <Input
                  id="monthPayment"
                  name="monthPayment"
                  type="number"
                  value={studentPayment.monthPayment}
                  onChange={handleChange}
                  placeholder="Calculated monthly payment"
                  required
                />
                {studentPayment.totalFees && studentPayment.months && (
                  <p className="text-sm text-gray-500 mt-1">
                    Suggested monthly payment: $
                    {(
                      Number(studentPayment.totalFees) /
                      Number(studentPayment.months)
                    ).toFixed(2)}
                  </p>
                )}
              </div>

              <Button type="submit" className="mt-2" disabled={loading}>
                {loading ? "Processing..." : "Create Student"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </motion.div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Payment Processed Successfully</DialogTitle>
          </DialogHeader>
          <DialogDescription className="space-y-2">
            {responseData ? (
              <div>
                <p>
                  <strong>Student Email:</strong> {responseData.email}
                </p>
                <p>
                  <strong>Password:</strong> {responseData.password}
                </p>
                <p>
                  <strong>Amount Paid:</strong> {responseData.monthPayment || 0}
                </p>
                <p>
                  <strong>Total Fees:</strong> {responseData.totalFees}
                </p>
                <p>
                  <strong>Months:</strong> {responseData.months}
                </p>
              </div>
            ) : (
              <p>No data available.</p>
            )}
          </DialogDescription>
        </DialogContent>
      </Dialog>
    </>
  );
}
