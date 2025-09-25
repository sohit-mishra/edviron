import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import Logo from "@/assets/logo.svg";
import { AuthContext } from "@/context/AuthProvider";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import React from "react";

interface NavbarProps {
  toggleSidebar: () => void;
}

export default function Navbar({ toggleSidebar }: NavbarProps) {
  const { user, logout } = React.useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <motion.div
      initial={{ y: -60, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="fixed top-0 left-0 right-0 z-50 flex justify-between items-center px-6 py-4 bg-white shadow-md"
    >
      <div className="flex items-center space-x-2">
        <button
          className="md:hidden p-2 rounded hover:bg-gray-100"
          onClick={toggleSidebar}
          aria-label="Toggle menu"
        >
          <Menu size={22} />
        </button>

        <img src={Logo} alt="App Logo" className="h-10 w-auto" />

        <span className="hidden md:inline-block text-2xl font-bold bg-gradient-to-r from-indigo-500 to-blue-600 bg-clip-text text-transparent">
          School Payment
        </span>
      </div>

      <div className="flex items-center space-x-4">
        <span className="font-medium">{user?.name || "Guest"}</span>
        <Button variant="outline" onClick={handleLogout}>
          Logout
        </Button>
      </div>
    </motion.div>
  );
}
