import { useState } from "react";
import { motion } from "framer-motion";
import { toast } from "sonner";
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

import { Eye, EyeOff } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

interface SignupFormData {
  name: string;
  email: string;
  password: string;
}

export default function Signup() {
  const [disabledBtn, setDisabledBtn] = useState<boolean>(false);
  const [formData, setFormData] = useState<SignupFormData>({
    name: "",
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setDisabledBtn(true);
    try {
      const response = await api.post("/auth/register", formData);
      toast.success(response.data.message);
      navigate("/otp", { state: { email: formData.email } });
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Signup failed");
    } finally {
      setDisabledBtn(false);
    }
  };

  return (
    <motion.div
      className="flex items-center justify-center min-h-screen bg-gray-50 px-4"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="w-full max-w-md shadow-xl rounded-lg border border-gray-200 bg-white">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold">Create Account</CardTitle>
          <CardDescription className="mt-1 text-gray-600">
            Fill the details below to register
          </CardDescription>
        </CardHeader>

        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-5">
            <div>
              <Label htmlFor="name" className="mb-1 font-medium">
                Full Name
              </Label>
              <Input
                id="name"
                name="name"
                type="text"
                placeholder="Enter your full name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>

            <div>
              <Label htmlFor="email" className="mb-1 font-medium">
                Email
              </Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className="mb-5">
              <Label htmlFor="password" className="mb-1 font-medium">
                Password
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  className="pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute inset-y-0 right-2 flex items-center text-gray-500 hover:text-gray-700"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>
          </CardContent>

          <CardFooter className="flex flex-col gap-3">
            <Button
              type="submit"
              className="w-full disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={disabledBtn}
            >
              {disabledBtn ? "Signing up..." : "Signup"}
            </Button>
            <p className="text-center text-sm">
              Already have an account?{" "}
              <Link to="/login" className="text-[#5d5d5d] underline">
                Login
              </Link>
            </p>
          </CardFooter>
        </form>
      </Card>
    </motion.div>
  );
}
