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

interface Teacher {
  _id: string;
  name: string;
  email: string;
  isVerified: boolean;
}

export default function AllTeacher() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [totalPages, setTotalPages] = useState(1);
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [deleteTeacherId, setDeleteTeacherId] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const fetchTeachers = async () => {
    try {
      const query = new URLSearchParams({
        page: currentPage.toString(),
        limit: itemsPerPage.toString(),
      });
      if (search.trim() !== "") query.append("search", search);

      const response = await api.get(`/teachers/all?${query.toString()}`);
      const data = response.data;

      setTeachers(data.teachers || []);
      setTotalPages(Math.ceil(data.totalNumber / itemsPerPage));
      setCurrentPage(data.page || 1);
      setItemsPerPage(data.limit || itemsPerPage);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchTeachers();
  }, [currentPage, itemsPerPage, search]);

  const handleDelete = async (id: string) => {
    try {
      await api.delete(`/teachers/delete/${id}`);
      setTeachers((prev) => prev.filter((t) => t._id !== id));
      toast.success("Teacher deleted successfully");
      fetchTeachers();
      setIsDialogOpen(false);
    } catch (error) {
      console.error("Failed to delete teacher", error);
      toast.error("Failed to delete teacher");
    }
  };

  const handleEdit = (id: string) => navigate(`/teacher/edit/${id}`);
  const handleView = (id: string) => navigate(`/teacher/${id}`);
  const handleAdd = () => navigate(`/teacher/add`);

  return (
    <motion.div
      className="p-6 bg-white shadow-[0_4px_15px_rgba(0,0,0,0.2)] mt-5 rounded-lg"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      <motion.div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <h1 className="text-2xl font-bold text-gray-800">All Teachers</h1>
        <div className="flex items-center gap-3 w-full md:w-auto">
          <Input
            type="text"
            placeholder="Search teacher..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full md:w-64"
          />
          <Button onClick={handleAdd}>Add Teacher</Button>
        </div>
      </motion.div>

      <Table className="w-full border-collapse border border-gray-200 rounded-lg overflow-hidden">
        <TableHeader className="bg-pink-100 text-gray-800">
          <TableRow>
            <TableHead className="px-4 py-2 text-left">Name</TableHead>
            <TableHead className="px-4 py-2 text-left">Email</TableHead>
            <TableHead className="px-4 py-2 text-left">Status</TableHead>
            <TableHead className="px-4 py-2 text-center">View</TableHead>
            <TableHead className="px-4 py-2 text-center">Edit</TableHead>
            <TableHead className="px-4 py-2 text-center">Delete</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {teachers.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="text-center py-20">
                No teachers found.
              </TableCell>
            </TableRow>
          ) : (
            <AnimatePresence>
              {teachers.map((teacher) => (
                <motion.tr
                  key={teacher._id}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  transition={{ duration: 0.3 }}
                  className="hover:bg-gray-50 transition-colors duration-200"
                >
                  <TableCell className="px-4 py-3 font-medium">{teacher.name}</TableCell>
                  <TableCell className="px-4 py-3">{teacher.email}</TableCell>
                  <TableCell className="px-4 py-3">
                    <span
                      className={`px-2 py-1 rounded-full text-sm font-semibold ${
                        teacher.isVerified ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                      }`}
                    >
                      {teacher.isVerified ? "Verified" : "Not Verified"}
                    </span>
                  </TableCell>
                  <TableCell className="px-4 py-3 text-center">
                    <div className="flex items-center justify-center">
                      <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex items-center justify-center border-none hover:bg-gray-100"
                          onClick={() => handleView(teacher._id)}
                        >
                          <Eye size={16} />
                        </Button>
                      </motion.div>
                    </div>
                  </TableCell>
                  <TableCell className="px-4 py-3 text-center">
                    <div className="flex items-center justify-center">
                      <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex items-center justify-center border-none hover:bg-gray-100"
                          onClick={() => handleEdit(teacher._id)}
                        >
                          <Edit size={16} />
                        </Button>
                      </motion.div>
                    </div>
                  </TableCell>
                  <TableCell className="px-4 py-3 text-center">
                    <Dialog
                      open={isDialogOpen && deleteTeacherId === teacher._id}
                      onOpenChange={setIsDialogOpen}
                    >
                      <DialogTrigger asChild>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setDeleteTeacherId(teacher._id);
                            setIsDialogOpen(true);
                          }}
                        >
                          <Trash2 size={16} />
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-[400px] bg-white rounded-lg shadow-lg">
                        <DialogHeader>
                          <DialogTitle>Delete Teacher</DialogTitle>
                          <DialogDescription>
                            Are you sure you want to delete {teacher.name}? This action cannot be undone.
                          </DialogDescription>
                        </DialogHeader>
                        <div className="flex justify-end gap-2 mt-4">
                          <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                            Cancel
                          </Button>
                          <Button variant="destructive" onClick={() => handleDelete(teacher._id)}>
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
              className={`cursor-pointer px-2 py-1 rounded ${currentPage === 1 ? "opacity-50 pointer-events-none" : ""}`}
            >
              Prev
            </PaginationPrevious>

            {[...Array(totalPages)].map((_, idx) => (
              <PaginationItem
                key={idx}
                onClick={() => setCurrentPage(idx + 1)}
                className={`cursor-pointer px-2 py-1 rounded ${currentPage === idx + 1 ? "bg-gray-200 font-bold" : ""}`}
              >
                {idx + 1}
              </PaginationItem>
            ))}

            <PaginationNext
              onClick={() => currentPage < totalPages && setCurrentPage(currentPage + 1)}
              className={`cursor-pointer px-2 py-1 rounded ${currentPage === totalPages ? "opacity-50 pointer-events-none" : ""}`}
            >
              Next
            </PaginationNext>
          </Pagination>
        </div>
      </div>
    </motion.div>
  );
}
