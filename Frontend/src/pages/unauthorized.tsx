import { motion } from "framer-motion";

const Unauthorized: React.FC = () => {
  return (
    <motion.div
      className="flex flex-col items-center justify-center min-h-screen bg-gray-50"
      initial={{ opacity: 0, y: -50 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 50 }}
      transition={{ duration: 0.5 }}
    >
      <h1 className="text-3xl font-bold text-red-600 mb-2">
        Unauthorized
      </h1>
      <p className="text-gray-700 text-lg">
        You do not have permission to access this page.
      </p>
    </motion.div>
  );
};

export default Unauthorized;
