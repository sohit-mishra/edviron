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

      navigate("/payNow", { state: { id: res.data.data._id } });

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

  return (
    <Card className="max-w-lg mx-auto mt-10 p-4">
      <CardHeader>
        <CardTitle className="text-2xl text-center">Create Order</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {school && (
          <div className="w-full">
            <Label className="mb-1">School</Label>
            <Select
              value={form.school_id}
              onValueChange={(value) => handleChange("school_id", value)}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select gateway" />
              </SelectTrigger>
              <SelectContent className="w-full">
                <SelectItem value={school._id}>{school.schoolName}</SelectItem>
              </SelectContent>
            </Select>
          </div>
        )}

        <div className="w-full">
          <Label className="mb-1">Trustee ID</Label>
          <Input
            value={form.trusteeId}
            onChange={(e) => handleChange("trusteeId", e.target.value)}
            placeholder="Enter trustee ID"
            className="w-full"
          />
        </div>

        <div className="w-full">
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
                <SelectItem key={student._id} value={student._id}>{student.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="w-full">
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
        </div>

        <div className="w-full">
          <Label className="mb-1">Payment Type</Label>
          <Input
            value={form.type}
            onChange={(e) => handleChange("type", e.target.value)}
            placeholder="Tuition, Exam Fee, etc."
            className="w-full"
          />
        </div>

        <Button onClick={handleSubmit} className="w-full mt-2">
          Create Order
        </Button>
      </CardContent>
    </Card>
  );
}
