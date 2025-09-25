import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Eye, Edit, Trash2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from "@/components/ui/dialog";
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
import { useNavigate } from "react-router-dom";
import api from "@/api/api";
import { toast } from "sonner";
import { AnimatePresence, motion } from "framer-motion";

interface Student {
  _id: string;
  name: string;
  email: string;
  totalFees: number;
  months: number;
  monthPayment?: number;
  schoolId: {
    _id: string;
    schoolName: string;
  };
  createId: {
    _id: string;
    name: string;
  };
}

export default function StudentList() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [totalPages, setTotalPages] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);
  const [students, setStudents] = useState<Student[]>([]);
  const [deleteStudentId, setDeleteStudentId] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const fetchStudents = async () => {
    try {
      const query = new URLSearchParams({
        page: currentPage.toString(),
        limit: itemsPerPage.toString(),
      });
      if (search.trim() !== "") query.append("search", search);

      const response = await api.get(`/students/all?${query.toString()}`);
      const { data, total, page, limit } = response.data;

      setStudents(data);
      setItemsPerPage(limit);
      setCurrentPage(page);
      setTotalRecords(total);
      setTotalPages(Math.max(1, Math.ceil(total / limit)));
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, [currentPage, itemsPerPage, search]);

  const handleDelete = async (id: string) => {
    try {
      await api.delete(`/students/delete/${id}`);
      setStudents((prev) => prev.filter((s) => s._id !== id));
      toast.success("Student deleted successfully");
      fetchStudents();
      setIsDialogOpen(false);
    } catch (error) {
      console.error("Failed to delete student", error);
      toast.error("Failed to delete student");
    }
  };

  const handleEdit = (id: string) => navigate(`/student/edit/${id}`);
  const handleView = (id: string) => navigate(`/student/${id}`);
  const handleAdd = () => navigate(`/student/add`);

  // helper for showing "X–Y of Z"
  const showingFrom = (currentPage - 1) * itemsPerPage + 1;
  const showingTo = Math.min(currentPage * itemsPerPage, totalRecords);

  return (
    <motion.div
      className="p-6 bg-white shadow-[0_4px_15px_rgba(0,0,0,0.2)] mt-5 rounded-lg"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      <motion.div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <h1 className="text-2xl font-bold text-gray-800">All Students</h1>
        <div className="flex items-center gap-3 w-full md:w-auto">
          <Input
            type="text"
            placeholder="Search student..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full md:w-64"
          />
          <Button onClick={handleAdd}>Add Student</Button>
        </div>
      </motion.div>

      <Table className="w-full border-collapse border border-gray-200 rounded-lg overflow-hidden">
        <TableHeader className="bg-pink-100 text-gray-800">
          <TableRow>
            <TableHead className="px-4 py-2 text-left">Name</TableHead>
            <TableHead className="px-4 py-2 text-left">Email</TableHead>
            <TableHead className="px-4 py-2 text-left">Total Fees</TableHead>
            <TableHead className="px-4 py-2 text-left">Months</TableHead>
            <TableHead className="px-4 py-2 text-left">Month Payment</TableHead>
            <TableHead className="px-4 py-2 text-left">
              Create Account
            </TableHead>
            <TableHead className="px-4 py-2 text-left">School Name</TableHead>
            <TableHead className="px-4 py-2 text-center">View</TableHead>
            <TableHead className="px-4 py-2 text-center">Edit</TableHead>
            <TableHead className="px-4 py-2 text-center">Delete</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {students.length === 0 ? (
            <TableRow>
              <TableCell colSpan={10} className="text-center py-20 text-xl">
                No students found.
              </TableCell>
            </TableRow>
          ) : (
            <AnimatePresence>
              {students.map((student) => (
                <motion.tr
                  key={student._id}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  transition={{ duration: 0.3 }}
                  className="hover:bg-gray-50 transition-colors duration-200"
                >
                  <TableCell className="px-4 py-3 font-medium">
                    {student.name}
                  </TableCell>
                  <TableCell className="px-4 py-3">{student.email}</TableCell>
                  <TableCell className="px-4 py-3">
                    ₹ {student.totalFees}
                  </TableCell>
                  <TableCell className="px-4 py-3">
                    {student.months} Months
                  </TableCell>
                  <TableCell className="px-4 py-3">
                    ₹ {student.monthPayment}
                  </TableCell>
                  <TableCell className="px-4 py-3">
                    {student.createId.name}
                  </TableCell>
                  <TableCell className="px-4 py-3">
                    {student.schoolId.schoolName}
                  </TableCell>
                  <TableCell className="px-4 py-3 text-center">
                    <Button
                      variant="outline"
                      size="sm"
                      className="border-none hover:bg-gray-100"
                      onClick={() => handleView(student._id)}
                    >
                      <Eye size={16} />
                    </Button>
                  </TableCell>
                  <TableCell className="px-4 py-3 text-center">
                    <Button
                      variant="outline"
                      size="sm"
                      className="border-none hover:bg-gray-100"
                      onClick={() => handleEdit(student._id)}
                    >
                      <Edit size={16} />
                    </Button>
                  </TableCell>
                  <TableCell className="px-4 py-3 text-center">
                    <Dialog
                      open={isDialogOpen && deleteStudentId === student._id}
                      onOpenChange={setIsDialogOpen}
                    >
                      <DialogTrigger asChild>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setDeleteStudentId(student._id);
                            setIsDialogOpen(true);
                          }}
                        >
                          <Trash2 size={16} />
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-[400px] bg-white rounded-lg shadow-lg">
                        <DialogHeader>
                          <DialogTitle>Delete Student</DialogTitle>
                          <DialogDescription>
                            Are you sure you want to delete {student.name}? This
                            action cannot be undone.
                          </DialogDescription>
                        </DialogHeader>
                        <div className="flex justify-end gap-2 mt-4">
                          <Button
                            variant="outline"
                            onClick={() => setIsDialogOpen(false)}
                          >
                            Cancel
                          </Button>
                          <Button
                            variant="destructive"
                            onClick={() => handleDelete(student._id)}
                          >
                            Delete
                          </Button>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </TableCell>
                </motion.tr>
              ))}
            </AnimatePresence>
          )}
        </TableBody>
      </Table>

      <div className="flex flex-col md:flex-row justify-between items-center mt-4 gap-4 w-full">
        <div className="flex items-center gap-2 w-full md:w-auto">
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

            {Array.from({ length: totalPages }, (_, idx) => (
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
