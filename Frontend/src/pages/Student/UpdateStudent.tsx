import { useState, useEffect } from "react";
import type { ChangeEvent, FormEvent } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import api from "@/api/api";
import { useNavigate, useParams } from "react-router-dom";

interface School {
  _id: string;
  schoolName: string;
}

interface Student {
  name: string;
  email: string;
  schoolId: School;
  totalFees: string;
  months: number;
  monthPayment: string;
}

interface ApiResponse {
  success: boolean;
  message: string;
}

export default function UpdateStudent() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  const [student, setStudent] = useState<Student>({
    name: "",
    email: "",
    schoolId: { _id: "", schoolName: "" },
    totalFees: "",
    months: 0,
    monthPayment: "",
  });
  const [loading, setLoading] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [responseData, setResponseData] = useState<ApiResponse | null>(null);

  const fetchStudent = async () => {
    if (!id) return;
    setLoading(true);
    try {
      const res = await api.get<{ student: Student }>(`/students/${id}`);
      const data = res.data.student;
      setStudent({
        name: data.name,
        email: data.email,
        schoolId: data.schoolId || { _id: "", schoolName: "" },
        totalFees: data.totalFees || "",
        months: data.months || 0,
        monthPayment: data.monthPayment || "",
      });
    } catch (err) {
      console.error("Failed to fetch Student:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!id) {
      navigate("/login");
      return;
    }
    fetchStudent();
  }, [id, navigate]);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setStudent((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!id) return;
    setLoading(true);
    try {
      const res = await api.put<ApiResponse>(`/students/update/${id}`, {
        name: student.name,
        months: Number(student.months),
      });
      setResponseData(res.data);
      setIsDialogOpen(true);
      navigate('/students')
    } catch (err) {
      console.error("Failed to update student:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md mx-auto mt-20"
      >
        <Card>
          <CardTitle className="text-2xl font-bold text-center">
            Update Student
          </CardTitle>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="flex flex-col">
                <Label htmlFor="name" className="mb-2">
                  Name
                </Label>
                <Input
                  id="name"
                  name="name"
                  type="text"
                  value={student.name}
                  onChange={handleChange}
                  placeholder="Enter Name"
                  required
                />
              </div>

              <div className="flex flex-col">
                <Label htmlFor="email" className="mb-2">
                  Email
                </Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={student.email}
                  disabled
                />
              </div>

              <div className="flex flex-col">
                <Label htmlFor="schoolId" className="mb-2">
                  School
                </Label>
                <Input
                  type="text"
                  value={student.schoolId.schoolName}
                  disabled
                  className="bg-gray-100"
                />
              </div>

              <div className="flex flex-col">
                <Label htmlFor="totalFees" className="mb-2">
                  Total Fees
                </Label>
                <Input
                  id="totalFees"
                  name="totalFees"
                  type="text"
                  value={student.totalFees}
                  onChange={handleChange}
                  placeholder="Enter Total Fees"
                  readOnly
                  disabled
                  required
                />
              </div>

              <div className="flex flex-col">
                <Label htmlFor="months" className="mb-2">
                  Months
                </Label>
                <Input
                  id="months"
                  name="months"
                  type="number"
                  value={student.months}
                  onChange={(e) => {
                    let value = Number(e.target.value);
                    if (value < 0) value = 0;
                    if (value > 12) value = 12;
                    setStudent((prev) => ({ ...prev, months: value }));
                  }}
                  placeholder="Enter Months"
                  min={0}
                  max={12}
                  required
                />
              </div>

              <Button type="submit" className="mt-2 w-full" disabled={loading}>
                {loading ? "Saving..." : "Update Student"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </motion.div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Success</DialogTitle>
          </DialogHeader>
          <DialogDescription className="space-y-2">
            {responseData?.message || "Student profile updated successfully."}
          </DialogDescription>
          <div className="mt-4 flex justify-end">
            <Button onClick={() => setIsDialogOpen(false)}>Close</Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
