import { useState, useEffect } from 'react';
import TodoList from './components/TodoList';
import PomodoroTimer from './components/PomodoroTimer';
import pb from './lib/pocketbase';
import Footer from './components/footer';

function App() {
  const [todos, setTodos] = useState([]);

  useEffect(() => {
    const fetchTodos = async () => {
      try {
        const records = await pb.collection('todos').getFullList({
          sort: '-created',
        });
        setTodos(records);
      } catch (err) {
        console.error("Failed to fetch todos:", err);
      }
    };

    fetchTodos();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white px-4 py-8 sm:px-6 lg:px-12">
      <div className="max-w-4xl mx-auto space-y-10">
        <header className="text-center">
          <h1 className="text-4xl font-bold tracking-tight mb-2">⏳ Pomodoro To-Do App</h1>
          <p className="text-gray-400 text-sm">
            Boost productivity with a Pomodoro timer and task manager in one place.
          </p>
        </header>

        <PomodoroTimer />
        <TodoList todos={todos} setTodos={setTodos} />
      </div>
      <Footer />
    </div>
  );
}

export default App;
