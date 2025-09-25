import Navbar from "@/components/Navbar";
import SideBar from "@/components/SideBar";
import { useState, type ReactNode } from "react";

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  return (
    <div className="flex min-h-screen bg-gray-50 flex-col">
      <Navbar toggleSidebar={toggleSidebar} />

      <div className="flex-1 flex flex-row ">
        <SideBar isOpen={sidebarOpen} />
        <div className="flex-1 overflow-y-auto h-screen">
          <main className="p-6 pt-[74px]">{children}</main>
        </div>
      </div>
    </div>
  );
} 
