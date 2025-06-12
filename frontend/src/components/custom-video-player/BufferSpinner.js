import { Loader2 } from "lucide-react";
import { motion } from "framer-motion";

export default function BufferSpinner() {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="absolute inset-0 flex justify-center items-center z-50"
    >
      <div className="bg-black/60 rounded-full p-6">
        <Loader2 className="h-12 w-12 text-white animate-spin" />
      </div>
    </motion.div>
  );
}