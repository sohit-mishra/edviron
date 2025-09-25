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

export default function AddTeacher() {
  const [loading, setLoading] = useState(false);
  const [teacher, setTeacher] = useState({ name: "", email: "", schoolId: "" });
  const [responseData, setResponseData] = useState<any>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [schools, setSchools] = useState<{ _id: string; schoolName: string }[]>(
    []
  );

  const fetchSchools = async () => {
    setLoading(true);
    try {
      const response = await api.get("/school/select");
      console.log(response.data);
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
    setTeacher({ ...teacher, [e.target.name]: e.target.value });
  };

  const handleSelectChange = (value: string) => {
    setTeacher({ ...teacher, schoolId: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await api.post(`/teachers/create`, teacher);
      setResponseData(res.data.data);
      setIsDialogOpen(true);
      setTeacher({ name: "", email: "", schoolId: "" });
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
        className="max-w-md mx-auto mt-25"
      >
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl text-center">Add Teacher</CardTitle>
          </CardHeader>
          <CardContent>
            <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
              <div className="flex flex-col">
                <Label htmlFor="name" className="mb-2">
                  Teacher Name
                </Label>
                <Input
                  id="name"
                  name="name"
                  value={teacher.name}
                  onChange={handleChange}
                  placeholder="Enter Teacher name"
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
                  placeholder="Enter email"
                  required
                />
              </div>

              <div className="flex flex-col">
                <Label htmlFor="schoolId" className="mb-2">
                  School
                </Label>
                <Select
                  onValueChange={handleSelectChange}
                  value={teacher.schoolId}
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

              <Button type="submit" className="mt-2" disabled={loading}>
                {loading ? "Saving..." : "Add Teacher"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </motion.div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Teacher Created Successfully</DialogTitle>
          </DialogHeader>
          <DialogDescription className="space-y-2">
            {responseData ? (
              <div>
                <p>
                  <strong>Email:</strong> {responseData.email}
                </p>
                <p>
                  <strong>Password:</strong> {responseData.password}
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
