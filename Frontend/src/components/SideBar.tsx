import { Home, User, Settings, Clipboard, HandCoins } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import clsx from "clsx";
import { motion } from "framer-motion";
import { AuthContext } from "@/context/AuthProvider";
import React from "react";

interface SideBarProps {
  isOpen: boolean;
}

export default function SideBar({ isOpen }: SideBarProps) {
  const { user } = React.useContext(AuthContext);

  const renderLinks = () => {
    switch (user?.role) {
      case "admin":
        return (
          <>
            <Link to="/">
              <Button variant="ghost" className="w-full justify-start gap-2">
                <Home size={18} /> Dashboard
              </Button>
            </Link>
            <Link to="/createPayment">
              <Button variant="ghost" className="w-full justify-start gap-2">
                <HandCoins size={18} /> Create Payment
              </Button>
            </Link>
            <Link to="/teachers">
              <Button variant="ghost" className="w-full justify-start gap-2">
                <User size={18} /> All Teachers
              </Button>
            </Link>
            <Link to="/transactions">
              <Button variant="ghost" className="w-full justify-start gap-2">
                <Clipboard size={18} /> Search Transaction
              </Button>
            </Link>
            <Link to="/students">
              <Button variant="ghost" className="w-full justify-start gap-2">
                <User size={18} /> All Students
              </Button>
            </Link>
            <Link to="/school">
              <Button variant="ghost" className="w-full justify-start gap-2">
                <Settings size={18} /> School Info
              </Button>
            </Link>
          </>
        );

      case "teacher":
        return (
          <>
            <Link to="/">
              <Button variant="ghost" className="w-full justify-start gap-2">
                <Home size={18} /> Dashboard
              </Button>
            </Link>
            <Link to="/createPayment">
              <Button variant="ghost" className="w-full justify-start gap-2">
                <HandCoins size={18} /> Create Payment
              </Button>
            </Link>
            <Link to="/students">
              <Button variant="ghost" className="w-full justify-start gap-2">
                <User size={18} /> All Students
              </Button>
            </Link>
            <Link to="/transactions">
              <Button variant="ghost" className="w-full justify-start gap-2">
                <Clipboard size={18} /> Search Transaction
              </Button>
            </Link>
          </>
        );

      default:
        return (
          <Link to="/">
            <Button variant="ghost" className="w-full justify-start gap-2">
              <Home size={18} /> Dashboard
            </Button>
          </Link>
        );
    }
  };

  return (
    <motion.div
      initial={{ x: -300, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ type: "spring", stiffness: 100, damping: 20 }}
      className={clsx(
        "fixed md:static h-screen md:h-auto top-0 pt-[72px] left-0 w-64 bg-white shadow-lg flex flex-col p-4 border-r border-gray-300 z-40",
        {
          "-translate-x-full md:translate-x-0": !isOpen,
          "translate-x-0": isOpen,
        }
      )}
    >
      <div className="text-xl font-bold pt-5 text-[#737373] mb-6">
        {user?.role === "admin"
          ? "Admin Dashboard"
          : user?.role === "teacher"
          ? "Teacher Dashboard"
          : "Student Dashboard"}
      </div>

      <nav className="flex flex-col space-y-2 flex-1">{renderLinks()}</nav>
    </motion.div>
  );
}
