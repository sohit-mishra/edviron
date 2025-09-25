import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { motion } from "framer-motion";
import { toast } from "sonner";
import api from "@/api/api";

interface School {
  _id?: string;
  schoolName: string;
  address: string;
  phone: string;
  sessionStart: string;
  sessionEnd: string;
}

export default function SchoolUpdate() {

  const [school, setSchool] = useState<School>({
    _id: "",
    schoolName: "",
    address: "",
    phone: "",
    sessionStart: "",
    sessionEnd: "",
  });
  const [loading, setLoading] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await api.get("/school");
      console.log(response.data);
      setSchool(response.data);
      console.log(school);
    } catch (error) {
      console.error(error);
      toast.error("Failed to fetch school data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;

    if (name === "sessionStart") {
      const startDate = new Date(value);
      const endDate = new Date(startDate);

      endDate.setFullYear(startDate.getFullYear() + 1);

      setSchool({
        ...school,
        sessionStart: value,
        sessionEnd: endDate.toISOString().split("T")[0],
      });
    } else {
      setSchool({
        ...school,
        [name]: value,
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await api.put(`/school/update/${school._id}`, {
        schoolName: school.schoolName,
        address: school.address,
        phone: school.phone,
        sessionStart: school.sessionStart,
        sessionEnd: school.sessionEnd,
      });
      toast.success("School updated successfully");
      fetchData();
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 120, damping: 20 }}
      className="max-w-md mx-auto mt-25"
    >
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl text-center">Update School</CardTitle>
        </CardHeader>
        <CardContent>
          <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
            <div className="flex flex-col">
              <Label htmlFor="name" className="mb-2">
                School Name
              </Label>
              <Input
                id="name"
                name="schoolName"
                value={school.schoolName}
                onChange={handleChange}
                placeholder="Enter school name"
                required
              />
            </div>

            <div className="flex flex-col">
              <Label htmlFor="address" className="mb-2">
                Address
              </Label>
              <Textarea
                id="address"
                name="address"
                value={school.address}
                onChange={handleChange}
                placeholder="Enter address"
                required
              />
            </div>

            <div className="flex flex-col">
              <Label htmlFor="contact" className="mb-2">
                Contact
              </Label>
              <Input
                id="contact"
                name="phone"
                type="tel"
                value={school.phone}
                onChange={handleChange}
                placeholder="Enter contact number"
                required
              />
            </div>

            <div className="flex gap-4">
              <div className="flex flex-col w-1/2">
                <Label htmlFor="sessionStart" className="mb-2">
                  Session Start Date
                </Label>
                <Input
                  id="sessionStart"
                  type="date"
                  name="sessionStart"
                  value={
                    school.sessionStart ? school.sessionStart.split("T")[0] : ""
                  }
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="flex flex-col w-1/2">
                <Label htmlFor="sessionEnd" className="mb-2">
                  Session End Date
                </Label>
                <Input
                  id="sessionEnd"
                  type="date"
                  name="sessionEnd"
                  value={
                    school.sessionEnd ? school.sessionEnd.split("T")[0] : ""
                  }
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <Button type="submit" className="mt-2" disabled={loading}>
              {loading ? "Saving..." : "Update School"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </motion.div>
  );
}
