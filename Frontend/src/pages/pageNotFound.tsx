import { motion } from "framer-motion";

export default function PageNotFound() {
  return (
    <motion.div
      className="flex items-center justify-center min-h-screen bg-gray-100"
      initial={{ opacity: 0, y: -50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <h1 className="text-3xl font-bold text-red-500">
        404 | Page Not Found
      </h1>
    </motion.div>
  );
}
