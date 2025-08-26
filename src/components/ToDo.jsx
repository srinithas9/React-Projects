import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ToDoItem from "./ToDoItem";



function ToDo({ userId }) {
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState("");
  const navigate = useNavigate();

  // Fetch todos
  const fetchTodos = async () => {
    try {
      const res = await fetch(`http://localhost:5000/api/todos/${userId}`);
      if (!res.ok) throw new Error("Failed to fetch todos");
      const data = await res.json();
      setTodos(data);
    } catch (err) {
      console.error("Fetch todos error:", err);
    }
  };

  useEffect(() => {
    if (!userId) navigate("/login");
    else fetchTodos();
  }, [userId]);

  // Add todo
  const addTodo = async () => {
    if (!newTodo.trim()) return;
    try {
      const res = await fetch("http://localhost:5000/api/todos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, text: newTodo }),
      });
      if (!res.ok) throw new Error("Failed to add todo");
      const todo = await res.json();
      setTodos([todo, ...todos]);
      setNewTodo("");
    } catch (err) {
      console.error("Add todo error:", err);
    }
  };

  // Toggle complete
  const toggleTodo = async (id, isComplete) => {
    try {
      const res = await fetch(`http://localhost:5000/api/todos/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isComplete }),
      });
      if (!res.ok) throw new Error("Failed to update todo");
      const updated = await res.json();
      setTodos(todos.map(t => (t.id === id ? updated : t)));
    } catch (err) {
      console.error("Update todo error:", err);
    }
  };

  // Delete todo
  const deleteTodo = async (id) => {
    try {
      const res = await fetch(`http://localhost:5000/api/todos/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed to delete todo");
      setTodos(todos.filter(t => t.id !== id));
    } catch (err) {
      console.error("Delete todo error:", err);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-200 via-pink-200 to-purple-100 flex flex-col items-center p-6">
      <h2 className="text-3xl font-bold mb-4 text-purple-700">My To-Do List</h2>
      <div className="flex mb-4 w-full max-w-md">
        <input
          type="text"
          value={newTodo}
          onChange={(e) => setNewTodo(e.target.value)}
          placeholder="Add a new task..."
          className="flex-grow p-3 rounded-l-lg border border-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-400"
        />
        <button
          onClick={addTodo}
          className="p-3 bg-purple-500 text-white rounded-r-lg hover:bg-purple-600"
        >
          Add
        </button>
      </div>

      <div className="w-full max-w-md">
        {todos.map((todo) => (
          <ToDoItem
            key={todo.id}
            todo={todo}
            onToggle={toggleTodo}
            onDelete={deleteTodo}
          />
        ))}
      </div>
    </div>
  );
}

export default ToDo;
