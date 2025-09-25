import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { motion } from "framer-motion";
import { toast } from "sonner";
import api from "@/api/api";
import { useParams } from "react-router-dom";

interface Teacher {
  _id: string;
  name: string;
  email: string;
  isVerified: boolean;
  role: string;
  createdAt: string;
  updatedAt: string;
  createId?: { name: string; email: string };
  schoolId?: { schoolName: string; address: string };
}

export default function OneTeacher() {
  const { id } = useParams<{ id: string }>();
  const [teacher, setTeacher] = useState<Teacher | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchTeacher = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/teachers/${id}`);
      setTeacher(response.data.teacher);
    } catch (error) {
      console.error(error);
      toast.error("Failed to fetch teacher");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) fetchTeacher();
  }, [id]);

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto mt-10 px-4">
        <Card>
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

  if (!teacher) {
    return <div className="text-center mt-10">No teacher found.</div>;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: -40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 120, damping: 20 }}
      className="max-w-5xl mx-auto mt-25 px-4"
    >
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl text-center">Teacher Details</CardTitle>
        </CardHeader>

        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-x-18 gap-y-4 p-6 text-gray-800">

          <InfoRow label="Name" value={teacher.name} />
          <InfoRow label="Email" value={teacher.email} />

          <div className="flex justify-between items-center py-2 border-b">
            <span className="font-semibold">Status:</span>
            <span
              className={`px-3 py-1 rounded-full text-sm font-semibold ${
                teacher.isVerified
                  ? "bg-green-100 text-green-800"
                  : "bg-red-100 text-red-800"
              }`}
            >
              {teacher.isVerified ? "Verified" : "Not Verified"}
            </span>
          </div>

          <InfoRow label="Role" value={teacher.role} />

          {teacher.createId && (
            <>
              <InfoRow label="Created By" value={teacher.createId.name} />
              <InfoRow label="Creator Email" value={teacher.createId.email} />
            </>
          )}

          {teacher.schoolId && (
            <>
              <InfoRow label="School" value={teacher.schoolId.schoolName} />
              <InfoRow label="Address" value={teacher.schoolId.address} />
            </>
          )}

          <InfoRow
            label="Session Start"
            value={new Date(teacher.createdAt).toLocaleDateString(undefined, {
              year: "numeric",
              month: "long",
            })}
          />
          <InfoRow
            label="Session End"
            value={new Date(teacher.updatedAt).toLocaleDateString(undefined, {
              year: "numeric",
              month: "long",
            })}
          />
        </CardContent>
      </Card>
    </motion.div>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between py-2 border-b">
      <span className="font-semibold">{label}:</span>
      <span className="text-gray-700">{value}</span>
    </div>
  );
}
