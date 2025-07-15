import { motion } from "framer-motion";

export default function Footer() {
  return (
    <motion.footer
      className="w-full text-center py-4 mt-10 border-t border-gray-700 text-gray-400 text-sm"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3, duration: 0.5 }}
    >
      Made with 💻 + ☕ by{" "}
      <a
        href="https://github.com/Br7eleven"
        target="_blank"
        rel="noopener noreferrer"
        className="text-indigo-400 hover:text-indigo-300 transition duration-300"
      >
        Balaj Hussain
      </a>{" "}
      — © {new Date().getFullYear()}
    </motion.footer>
  );
}
