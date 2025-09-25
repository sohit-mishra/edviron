import React, { useState } from "react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import api from "@/api/api";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import { AuthContext } from "@/context/AuthProvider";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";

interface LoginFormData {
  email: string;
  password: string;
  rememberMe: boolean;
}

const Login: React.FC = () => {
  const { setUser, setAccessToken, setRefreshToken, setAuthentication } =
    React.useContext(AuthContext);
  const [formData, setFormData] = useState<LoginFormData>({
    email: "",
    password: "",
    rememberMe: false,
  });
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, type, checked, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const response = await api.post("/auth/login", {
        email: formData.email,
        password: formData.password,
      });

      toast.success("Login successful!");
      localStorage.setItem("accessToken", response.data.accessToken);
      localStorage.setItem("refreshToken", response.data.refreshToken);
      setAuthentication(true);
      setUser(response.data.user);
      setAccessToken(response.data.accessToken);
      setRefreshToken(response.data.refreshToken);

      navigate("/");
    } catch (error: any) {
      console.error(error);
      toast.error(error.response?.data?.message || "Login failed!");
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
          <CardTitle className="text-3xl font-bold">Welcome Back</CardTitle>
        </CardHeader>

        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-5">
            <div>
              <Label htmlFor="email" className="mb-1 font-medium">
                Email
              </Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="Enter your Email Id"
                value={formData.email}
                onChange={handleChange}
                required
                className="rounded-md border-gray-300 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div className="relative">
              <Label htmlFor="password" className="mb-1 font-medium">
                Password
              </Label>
              <Input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                placeholder="Enter Your Password"
                value={formData.password}
                onChange={handleChange}
                required
                className="rounded-md border-gray-300 focus:ring-blue-500 focus:border-blue-500 pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute top-1/2 right-3 -translate-y-1/2 text-gray-500 hover:text-gray-700"
              >
                {showPassword ? (
                  <EyeOff size={18} className="mt-5" />
                ) : (
                  <Eye size={18} className="mt-5" />
                )}
              </button>
            </div>

            <div className="flex justify-between items-center text-sm mb-6">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="rememberMe"
                  name="rememberMe"
                  checked={formData.rememberMe}
                  onCheckedChange={(checked) =>
                    setFormData((prev) => ({
                      ...prev,
                      rememberMe: checked === true,
                    }))
                  }
                />
                <Label htmlFor="rememberMe">Remember Me</Label>
              </div>
              <Link to="/forgot-password" className="text-[#5d5d5d] underline">
                Forgot Password?
              </Link>
            </div>
          </CardContent>

          <CardFooter className="flex flex-col gap-3">
            <Button
              type="submit"
              className="w-full text-white font-semibold py-2 rounded-md transition-all duration-200"
            >
              Login
            </Button>

            <p className="text-center text-sm">
              Don’t have an account?{" "}
              <Link to="/signup" className="text-[#5d5d5d] underline">
                Sign Up
              </Link>
            </p>
          </CardFooter>
        </form>
      </Card>
    </motion.div>
  );
};

export default Login;
