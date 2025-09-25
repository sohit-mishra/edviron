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

interface Teacher {
  name: string;
  email: string;
  schoolId: School;
}

interface ApiResponse {
  success: boolean;
  message: string;
}

export default function UpdateTeacherForm() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  const [teacher, setTeacher] = useState<Teacher>({
    name: "",
    email: "",
    schoolId: { _id: "", schoolName: "" },
  });
  const [loading, setLoading] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [responseData, setResponseData] = useState<ApiResponse | null>(null);

  const fetchTeacher = async () => {
    if (!id) return;
    setLoading(true);
    try {
      const res = await api.get<{ teacher: Teacher }>(`/teachers/${id}`);
      const data = res.data.teacher;
      setTeacher({
        name: data.name,
        email: data.email,
        schoolId: data.schoolId || { _id: "", schoolName: "" },
      });
    } catch (err) {
      console.error("Failed to fetch teacher:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!id) {
      navigate("/login");
      return;
    }

    const fetchData = async () => {
      try {
        await fetchTeacher();
      } catch (err) {
        console.error(err);
      }
    };

    fetchData();
  }, [id, navigate]);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setTeacher((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!id) return;
    setLoading(true);
    try {
      const res = await api.put<ApiResponse>(`/teachers/update/${id}`, {
        name: teacher.name,
      });
      setResponseData(res.data);
      setIsDialogOpen(true);
    } catch (err) {
      console.error("Failed to update teacher:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md mx-auto mt-40"
      >
        <Card>
          <CardTitle className="text-2xl font-bold text-center">
            Update Teacher
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
                  value={teacher.name}
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
                  value={teacher.email}
                  onChange={handleChange}
                  placeholder="Enter Email"
                  disabled={true}
                />
              </div>

              <div className="flex flex-col">
                <Label htmlFor="schoolId" className="mb-2">
                  School
                </Label>
                <Input
                  type="text"
                  value={teacher.schoolId.schoolName}
                  disabled
                  className="w-full px-3 py-2 border rounded-md bg-gray-100"
                />
              </div>

              <Button type="submit" className="mt-2 w-full" disabled={loading}>
                {loading ? "Saving..." : "Update Teacher"}
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
            {responseData?.message || "Teacher profile updated successfully."}
          </DialogDescription>
          <div className="mt-4 flex justify-end">
            <Button onClick={() => setIsDialogOpen(false)}>Close</Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
