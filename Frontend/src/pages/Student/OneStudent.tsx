import api from "@/api/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { toast } from "sonner";
import { motion } from "framer-motion";

interface Student {
  _id: string;
  name: string;
  email: string;
  isVerified: boolean;
  createdAt: string;
  updatedAt: string;
  createId?: { name: string; email: string };
  schoolId?: { schoolName: string; address: string };
}

export default function OneStudent() {
  const { id } = useParams<{ id: string }>();
  const [student, setStudent] = useState<Student | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchStudent = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/students/${id}`);
      setStudent(response.data.student);
    } catch (error: any) {
      console.error(error);
      const message = error.response?.data?.message || "Failed to fetch student";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) fetchStudent();
  }, [id]);

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto mt-10 px-4">
        <Card aria-busy="true">
          <CardHeader>
            <CardTitle className="text-2xl text-center">Loading...</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="flex flex-col space-y-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-5 w-40" />
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!student) {
    return (
      <div className="flex items-center justify-center h-full mt-80">
        <p className="text-3xl text-center">No Student found.</p>
      </div>
    );
  }

  return (
    <motion.div
      className="max-w-3xl mx-auto mt-10 px-4"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      <Card className="shadow-xl border border-gray-100 rounded-2xl hover:shadow-2xl transition-shadow duration-300">
        <CardHeader className="flex flex-col items-center space-y-3 border-b pb-6">
          <Avatar className="h-20 w-20">
            <AvatarFallback className="bg-[#e5e5e5] text-white text-xl font-bold">
              {student?.name ? student.name.charAt(0).toUpperCase() : "?"}
            </AvatarFallback>
          </Avatar>
          <CardTitle className="text-2xl font-bold text-gray-900">
            {student.name}
          </CardTitle>
          <p className="text-gray-500">{student.email}</p>
        </CardHeader>

        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-8 p-8">
          <MotionDetailItem label="Created By" value={student.createId?.name} />
          <MotionDetailItem label="School" value={student.schoolId?.schoolName} />
        </CardContent>
      </Card>
    </motion.div>
  );
}

function MotionDetailItem({ label, value }: { label: string; value?: string }) {
  return (
    <motion.div
      className="flex flex-col"
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <span className="text-sm font-medium text-gray-500">{label}</span>
      <span className="mt-1 text-gray-900 font-semibold">{value || "N/A"}</span>
    </motion.div>
  );
}
