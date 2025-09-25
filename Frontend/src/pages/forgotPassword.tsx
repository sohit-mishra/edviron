import React, { useState } from "react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { Link } from "react-router-dom";
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

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

const ForgotPassword: React.FC = () => {
  const [email, setEmail] = useState("");
  const [open, setOpen] = useState(false);
  const [btnDisabled, setBtnDisabled] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBtnDisabled(true);

    try {
      const res = await api.post("/auth/forgetPassword", { email });
      toast.success(res.data?.message || "OTP sent successfully!");
      setOpen(true);
    } catch (error: any) {
      toast.error(
        error.response?.data?.message ||
          "Failed to send reset link. Please try again."
      );
    } finally {
      setBtnDisabled(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="flex justify-center items-center min-h-screen bg-gray-50"
    >
      <Card className="w-full max-w-md p-4">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold">Forgot Password</CardTitle>
          <CardDescription>
            Enter your email to reset your password
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="email" className="mb-2">
                Email
              </Label>
              <Input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <Button
              type="submit"
              className="w-full"
              disabled={!email || btnDisabled}
            >
              {btnDisabled ? "Sending..." : "Send Reset Email Link"}
            </Button>
          </form>
        </CardContent>

        <CardFooter className="flex flex-col gap-2 items-center">
          <Link to="/login" className="w-full">
            <Button variant="outline" className="w-full">
              Back to Login
            </Button>
          </Link>
        </CardFooter>
      </Card>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reset Link Sent</DialogTitle>
            <DialogDescription>
              A password reset link has been sent to <b>{email}</b>. Please
              check your inbox to proceed with resetting your password.
            </DialogDescription>
          </DialogHeader>

          <div className="flex justify-end gap-2 mt-4">
            <Button
              variant="outline"
              onClick={() => {
                setOpen(false);
                setEmail("");
              }}
            >
              Cancel
            </Button>

            <Button
              onClick={() => {
                setOpen(false);
                setEmail("");
              }}
            >
              Okay
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
};

export default ForgotPassword;
