import TransactionsDashboard from "@/pages/Dashboard";
import { AuthContext } from "@/context/AuthProvider";
import React from "react";
import StudentDashboard from "@/pages/StudentDashboard";

export default function RoleDashboard() {
  const { user } = React.useContext(AuthContext);

  if (user?.role === "student") {
    return <StudentDashboard />;
  }

  if (user?.role === "admin" || user?.role === "teacher") {
    return <TransactionsDashboard />;
  }

  return "";
}
