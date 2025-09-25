import { useEffect, useState } from "react";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import { Input } from "../components/ui/input";
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
  collect_id: string;
  order_id: string;
  student: string;
  school: string;
  order_amount: number;
  transaction_amount: number;
  payment_mode: string;
  payment_details?: string;
  bank_reference?: string;
  status: string;
  payment_time: string;
}

export default function TransactionsDashboard() {
  const [search, setSearch] = useState("");
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
  }, [currentPage, itemsPerPage, search]);

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
      </div>

      <Table className="w-full border border-gray-200 rounded-lg">
        <TableHeader className="bg-gray-100">
          <TableRow>
            <TableHead className="px-4 py-2">Order ID</TableHead>
            <TableHead className="px-4 py-2">Student</TableHead>
            <TableHead className="px-4 py-2">School</TableHead>
            <TableHead className="px-4 py-2">Order Amount</TableHead>
            <TableHead className="px-4 py-2">Txn Amount</TableHead>
            <TableHead className="px-4 py-2">Mode</TableHead>
            <TableHead className="px-4 py-2">Status</TableHead>
            <TableHead className="px-4 py-2">Payment Time</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {transactions.length === 0 ? (
            <TableRow>
              <TableCell colSpan={9} className="text-center py-10">
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
                  <TableCell className="px-4 py-3">{txn.collect_id}</TableCell>
                  <TableCell className="px-4 py-3">{txn.student}</TableCell>
                  <TableCell className="px-4 py-3">{txn.school}</TableCell>
                  <TableCell className="px-4 py-3 text-center">
                    {txn.order_amount}
                  </TableCell>
                  <TableCell className="px-4 py-3 text-center">
                    {txn.transaction_amount}
                  </TableCell>
                  <TableCell className="px-4 py-3 text-center">
                    {txn.payment_mode}
                  </TableCell>
                  <TableCell className="px-4 py-3 text-center">
                    {txn.status}
                  </TableCell>
                  <TableCell className="px-4 py-3 text-center">
                    {new Date(txn.payment_time).toLocaleString()}
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
              {[5, 10].map((num) => (
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
