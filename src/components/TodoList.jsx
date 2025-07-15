"use client";

import { useState, useEffect } from "react";
import pb from "../lib/pocketbase";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Check, Trash2 } from "lucide-react";

export default function TodoList({ todos, setTodos }) {
  const [newTodo, setNewTodo] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState("");

  useEffect(() => {
    const controller = new AbortController();

    const fetchTodos = async () => {
      try {
        const todos = await pb.collection("todos").getFullList({
          sort: "-created",
          signal: controller.signal,
        });
        setTodos(todos);
      } catch (err) {
        console.error("Error fetching todos:", err);
      }
    };

    fetchTodos();
    return () => controller.abort();
  }, []);

  const addTodo = async (text) => {
    try {
      const record = await pb.collection("todos").create({
        text: text,
        completed: false,
      });
      setTodos((prev) => [...prev, record]);
    } catch (err) {
      console.error("Error adding todo:", err);
    }
  };

  const toggleTodo = async (id) => {
    const todo = todos.find((t) => t.id === id);
    const updated = await pb.collection("todos").update(id, {
      completed: !todo.completed,
    });
    setTodos((prev) => prev.map((t) => (t.id === id ? updated : t)));
  };

  const deleteTodo = async (id) => {
    await pb.collection("todos").delete(id);
    setTodos((prev) => prev.filter((t) => t.id !== id));
  };

  const saveEdit = async () => {
    if (editText.trim()) {
      try {
        const updated = await pb.collection("todos").update(editingId, {
          text: editText.trim(),
        });
        setTodos((prev) =>
          prev.map((todo) => (todo.id === editingId ? updated : todo))
        );
      } catch (error) {
        console.error("Failed to update todo:", error);
      }
    }
    setEditingId(null);
    setEditText("");
  };

  const completedCount = todos.filter((t) => t.completed).length;

  return (
    <div className="backdrop-blur-xl bg-white/70 rounded-3xl p-8 shadow-2xl border border-white/20 mt-10 text-gray-800">
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-2xl font-bold">Your Tasks</h2>
          <span className="text-sm text-gray-600">
            {completedCount}/{todos.length} done
          </span>
        </div>

        <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
          <motion.div
            className="bg-gradient-to-r from-indigo-500 to-purple-500 h-2 rounded-full"
            initial={{ width: 0 }}
            animate={{
              width: `${todos.length > 0 ? (completedCount / todos.length) * 100 : 0}%`,
            }}
            transition={{ duration: 0.5 }}
          />
        </div>
      </div>

      <div className="flex gap-3 mb-6">
        <input
          type="text"
          value={newTodo}
          onChange={(e) => setNewTodo(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && newTodo.trim()) {
              addTodo(newTodo.trim());
              setNewTodo("");
            }
          }}
          placeholder="Add a new task..."
          className="flex-1 px-4 py-3 rounded-2xl bg-white/80 border border-gray-200 text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          autoFocus
        />
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => {
            if (newTodo.trim()) {
              addTodo(newTodo.trim());
              setNewTodo("");
            }
          }}
          className="flex items-center gap-2 px-6 py-3 rounded-2xl font-semibold text-white bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 shadow-lg"
        >
          <Plus className="w-5 h-5" />
          Add
        </motion.button>
      </div>

      <div className="space-y-3 max-h-96 overflow-y-auto custom-scrollbar">
        <AnimatePresence>
          {todos.map((todo) => (
            <motion.div
              key={todo.id}
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.95 }}
              transition={{ duration: 0.3 }}
              className={`flex items-center justify-between p-4 rounded-2xl border transition-all duration-200 ${
                todo.completed
                  ? "bg-green-50 border-green-200"
                  : "bg-white/80 border-gray-200 hover:bg-white"
              }`}
            >
              <div className="flex items-center gap-3">
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => toggleTodo(todo.id)}
                  className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                    todo.completed
                      ? "bg-green-500 border-green-500 text-white"
                      : "border-gray-400 hover:border-indigo-500"
                  }`}
                >
                  {todo.completed && <Check className="w-4 h-4" />}
                </motion.button>

                {editingId === todo.id ? (
                  <div className="flex gap-2 items-center">
                    <input
                      value={editText}
                      onChange={(e) => setEditText(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && saveEdit()}
                      className="px-2 py-1 rounded-lg border border-gray-300 text-gray-800"
                      autoFocus
                    />
                    <button onClick={saveEdit} className="text-green-600 hover:text-green-800">
                      <Check className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <span
                    className={`text-gray-800 ${
                      todo.completed ? "line-through text-gray-500" : ""
                    }`}
                    onDoubleClick={() => {
                      setEditingId(todo.id);
                      setEditText(todo.text);
                    }}
                  >
                    {todo.text}
                  </span>
                )}
              </div>

              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => deleteTodo(todo.id)}
                className="p-1 text-gray-400 hover:text-red-500"
              >
                <Trash2 className="w-4 h-4" />
              </motion.button>
            </motion.div>
          ))}
        </AnimatePresence>

        {todos.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-10 text-gray-500"
          >
            <div className="text-5xl mb-3">📝</div>
            <p className="text-lg font-medium">No tasks yet</p>
            <p className="text-sm">Add something to get started!</p>
          </motion.div>
        )}
      </div>
    </div>
  );
}
