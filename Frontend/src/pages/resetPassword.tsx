import { motion } from "framer-motion";
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";

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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

import api from "@/api/api";

interface ResetPasswordFormData {
  password: string;
  confirmPassword: string;
}

export default function ResetPassword() {
  const navigate = useNavigate();
  const {id} = useParams();
  const resetToken = id || "";

  const [formData, setFormData] = useState<ResetPasswordFormData>({
    password: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogMessage, setDialogMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      setIsSuccess(false);
      setDialogMessage("Passwords do not match. Please try again.");
      setDialogOpen(true);
      return;
    }

    try {
      const res = await api.post("/auth/resetPassword", {
        resetToken: resetToken,
        password: formData.password,
      });

      setIsSuccess(true);
      setDialogMessage(res.data?.message || "Your password has been changed successfully!");
    } catch (error: any) {
      setIsSuccess(false);
      setDialogMessage(
        error.response?.data?.message || "Failed to reset password. Please try again."
      );
    } finally {
      setDialogOpen(true);
    }
  };

  return (
    <>
      <motion.div
        className="flex items-center justify-center min-h-screen bg-gray-50"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <Card className="w-full max-w-md shadow-lg">
          <CardHeader className="text-center">
            <CardTitle className="text-3xl font-bold">Reset Password</CardTitle>
            <CardDescription>
              Enter your new password to reset your account
            </CardDescription>
          </CardHeader>

          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              <div className="relative">
                <Label htmlFor="password" className="mb-2">
                  New Password
                </Label>
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter new password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
                <Button
                  type="button"
                  variant="ghost"
                  className="absolute right-2 top-9 p-0"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={18} className="mb-6"/> : <Eye size={18} className="mb-6"/>}
                </Button>
              </div>

              <div className="relative">
                <Label htmlFor="confirmPassword" className="mb-2">
                  Confirm Password
                </Label>
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Confirm new password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                />
                <Button
                  type="button"
                  variant="ghost"
                  className="absolute right-2 top-9 p-0"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? <EyeOff size={18} className="mb-6"/> : <Eye size={18} className="mb-6"/>}
                </Button>
              </div>
            </CardContent>

            <CardFooter>
              <Button type="submit" className="w-full mt-5">
                Reset Password
              </Button>
            </CardFooter>
          </form>
        </Card>
      </motion.div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{isSuccess ? "Password Changed " : "Error"}</DialogTitle>
            <DialogDescription>{dialogMessage}</DialogDescription>
          </DialogHeader>

          <div className="flex justify-end gap-2 mt-4">
            {!isSuccess && (
              <Button
                variant="secondary"
                onClick={() => setDialogOpen(false)}
              >
                Cancel
              </Button>
            )}
            <Button
              onClick={() => {
                setDialogOpen(false);
                navigate("/login");
              }}
            >
              OK
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
