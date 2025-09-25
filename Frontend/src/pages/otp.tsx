import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { useLocation, useNavigate } from "react-router-dom";
import api from "@/api/api";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

interface OtpFormData {
  otp: number;
  email: string;
}

const Otp: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const email = location.state?.email || "";

  const [formData, setFormData] = useState<OtpFormData>({
    otp: 0,
    email,
  });

  useEffect(() => {
    if (!email) {
      navigate("/login");
    }
  }, [email, navigate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    if (name === "otp" && /^\d{0,6}$/.test(value)) {
      setFormData({ ...formData, otp: Number(value) });
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (formData.otp.toString().length !== 6) {
      toast.error("OTP must be 6 digits!");
      return;
    }

    try {
      const response = await api.post("/auth/verify-otp", formData);
      toast.success(response.data.message || "OTP verified successfully!");
      navigate("/login");
    } catch (error: any) {
      toast.error(error.response?.data?.message || "OTP verification failed!");
    }
  };
  return (
    <motion.div
      className="flex items-center justify-center min-h-screen bg-gray-50 px-4"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold">Enter OTP</CardTitle>
          <CardDescription>
            Please enter the 6-digit OTP sent to your email
          </CardDescription>
        </CardHeader>

        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <Input type="hidden" name="email" value={formData.email} />

            <div>
              <Label htmlFor="otp" className="mb-2 block">
                OTP
              </Label>

              <Input
                id="otp"
                name="otp"
                type="text"
                placeholder="Enter 6-digit OTP"
                value={formData.otp === 0 ? "" : formData.otp.toString()}
                onChange={handleChange}
                maxLength={6}
                inputMode="numeric"
                pattern="\d{6}"
                required
              />
            </div>
          </CardContent>

          <CardFooter className="mt-5">
            <Button
              type="submit"
              className="w-full disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={formData.otp.toString().length !== 6}
            >
              {formData.otp.toString().length !== 6 ? "Verify" : "Verify OTP"}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </motion.div>
  );
};

export default Otp;
