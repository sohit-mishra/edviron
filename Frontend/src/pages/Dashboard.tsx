import { useEffect, useState } from "react";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import {
  Pagination,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import api from "@/api/api";
import { AnimatePresence, motion } from "framer-motion";

interface Transaction {
  _id: string;
  school_id: string;
  payment_mode: string;
  status:
    | "SUCCESS"
    | "FAILED"
    | "PENDING"
    | "USER_DROPPED"
    | "EXPIRED"
    | "CANCELLED";
  error_message: string;
  payment_time: string;
  order_id: string;
  student_info: {
    student_id: string;
    name: string;
    phone: number;
    email: string;
  };
  school: string;
  order_amount: number;
}

export default function TransactionsDashboard() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("All");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [totalPages, setTotalPages] = useState(1);
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  const fetchTransactions = async () => {
    try {
      const query = new URLSearchParams({
        page: currentPage.toString(),
        limit: itemsPerPage.toString(),
      });

      if (search.trim() !== "") query.append("search", search);
      if (statusFilter !== "All") query.append("status", statusFilter);

      const response = await api.get(`/transactions/all?${query.toString()}`);
      const data = response.data;

      setTransactions(data.transactions || []);
      setTotalPages(Math.ceil(data.total / itemsPerPage));
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, [currentPage, itemsPerPage, search, statusFilter]);

  const statusColors: Record<Transaction["status"], string> = {
    SUCCESS: "text-green-600",
    FAILED: "text-red-600",
    PENDING: "text-yellow-600",
    USER_DROPPED: "text-orange-600",
    EXPIRED: "text-gray-400",
    CANCELLED: "text-gray-500",
  };

  return (
    <motion.div
      className="p-6 bg-white shadow-md rounded-lg mt-5"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-4">
        <Input
          type="text"
          placeholder="Search transactions..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setCurrentPage(1);
          }}
          className="w-full md:w-64"
        />

        <Select
          value={statusFilter}
          onValueChange={(val) => {
            setStatusFilter(val);
            setCurrentPage(1);
          }}
        >
          <SelectTrigger className="w-44">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            {["All", "SUCCESS", "FAILED", "PENDING", "USER_DROPPED", "EXPIRED", "CANCELLED"].map(
              (status) => (
                <SelectItem key={status} value={status}>
                  {status}
                </SelectItem>
              )
            )}
          </SelectContent>
        </Select>
      </div>

      <Table className="w-full border border-gray-200 rounded-lg">
        <TableHeader className="bg-gray-100">
          <TableRow>
            <TableHead className="px-4 py-2">Order ID</TableHead>
            <TableHead className="px-4 py-2">Student Name</TableHead>
            <TableHead className="px-4 py-2">Email</TableHead>
            <TableHead className="px-4 py-2">Phone</TableHead>
            <TableHead className="px-4 py-2">Order Amount</TableHead>
            <TableHead className="px-4 py-2">Mode</TableHead>
            <TableHead className="px-4 py-2">Status</TableHead>
            <TableHead className="px-4 py-2">Payment Time</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {transactions.length === 0 ? (
            <TableRow>
              <TableCell colSpan={8} className="text-center py-10">
                No transactions found.
              </TableCell>
            </TableRow>
          ) : (
            <AnimatePresence>
              {transactions.map((txn) => (
                <motion.tr
                  key={txn._id}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  transition={{ duration: 0.3 }}
                >
                  <TableCell className="px-4 py-3">{txn.order_id}</TableCell>
                  <TableCell className="px-4 py-3">{txn.student_info.name}</TableCell>
                  <TableCell className="px-4 py-3 text-center">{txn.student_info.email}</TableCell>
                  <TableCell className="px-4 py-3 text-center">{txn.student_info.phone}</TableCell>
                  <TableCell className="px-4 py-3 text-center">₹ {txn.order_amount}</TableCell>
                  <TableCell className="px-4 py-3 text-center">{txn.payment_mode}</TableCell>
                  <TableCell className={`px-4 py-3 text-center font-medium ${statusColors[txn.status]}`}>
                    {txn.status}
                  </TableCell>
                  <TableCell className="px-4 py-3 text-center">
                    {new Date(txn.payment_time).toLocaleString("en-IN", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                      hour12: true,
                    })}
                  </TableCell>
                </motion.tr>
              ))}
            </AnimatePresence>
          )}
        </TableBody>
      </Table>

      <div className="flex justify-between items-center mt-4">
        <div className="flex items-center gap-2">
          <span>Rows per page:</span>
          <Select
            value={String(itemsPerPage)}
            onValueChange={(val) => {
              setItemsPerPage(Number(val));
              setCurrentPage(1);
            }}
          >
            <SelectTrigger className="w-20">
              <SelectValue placeholder="5" />
            </SelectTrigger>
            <SelectContent>
              {[5, 10, 20].map((num) => (
                <SelectItem key={num} value={String(num)}>
                  {num}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex justify-end w-full md:w-auto">
          <Pagination className="flex items-center gap-2 list-none p-0 m-0">
            <PaginationPrevious
              onClick={() => currentPage > 1 && setCurrentPage(currentPage - 1)}
              className={`cursor-pointer px-2 py-1 rounded ${
                currentPage === 1 ? "opacity-50 pointer-events-none" : ""
              }`}
            >
              Prev
            </PaginationPrevious>

            {[...Array(totalPages)].map((_, idx) => (
              <PaginationItem
                key={idx}
                onClick={() => setCurrentPage(idx + 1)}
                className={`cursor-pointer px-2 py-1 rounded ${
                  currentPage === idx + 1 ? "bg-gray-200 font-bold" : ""
                }`}
              >
                {idx + 1}
              </PaginationItem>
            ))}

            <PaginationNext
              onClick={() =>
                currentPage < totalPages && setCurrentPage(currentPage + 1)
              }
              className={`cursor-pointer px-2 py-1 rounded ${
                currentPage === totalPages
                  ? "opacity-50 pointer-events-none"
                  : ""
              }`}
            >
              Next
            </PaginationNext>
          </Pagination>
        </div>
      </div>
    </motion.div>
  );
}
