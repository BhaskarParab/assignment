import { useEffect, useState } from "react";
import { FaTrash, FaEdit, FaCheck, FaTimes } from "react-icons/fa";
import { useAuth } from "../../auth/AuthContext";

interface Task {
  id: string;
  title: string;
  completed: boolean;
  user_id: string;
}

export default function Task() {
  type FilterType = "all" | "completed" | "ongoing";

  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTitle, setNewTitle] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingTitle, setEditingTitle] = useState("");
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<FilterType>("all");

  const { user } = useAuth();

  const BASE_URL = "http://localhost:5000/app/tasks";

  // Fetch all tasks
  const fetchTasks = async () => {
    try {
      const res = await fetch(BASE_URL, {
        method: "GET",
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to fetch tasks");
      const data = await res.json();
      setTasks(data);
    } catch (err: unknown) {
      if (err instanceof Error) console.error(err.message);
      else console.error("Unknown error", err);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  // Add new task
  const handleAddTask = async () => {
    if (!newTitle.trim()) return;
    try {
      const res = await fetch(BASE_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ title: newTitle }),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || "Failed to create task");
      }
      const data: Task = await res.json();
      setTasks((prev) => [...prev, data]);
      setNewTitle("");
    } catch (err: unknown) {
      if (err instanceof Error) console.error(err.message);
      else console.error("Unknown error", err);
    }
  };

  // Toggle completed
  const toggleComplete = async (task: Task) => {
    try {
      const res = await fetch(`${BASE_URL}/${task.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ completed: !task.completed }),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || "Failed to update task");
      }
      const updatedTask = await res.json();
      setTasks((prev) =>
        prev.map((t) => (t.id === updatedTask.id ? updatedTask : t))
      );
    } catch (err: unknown) {
      if (err instanceof Error) console.error(err.message);
      else console.error("Unknown error", err);
    }
  };

  // Delete task
  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`${BASE_URL}/${id}`, {
        method: "DELETE",
        credentials: "include",
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || "Failed to delete task");
      }
      setTasks((prev) => prev.filter((t) => t.id !== id));
    } catch (err: unknown) {
      if (err instanceof Error) console.error(err.message);
      else console.error("Unknown error", err);
    }
  };

  // Start editing
  const startEditing = (task: Task) => {
    setEditingId(task.id);
    setEditingTitle(task.title);
  };

  // Save edited task
  const saveEdit = async (task: Task) => {
    try {
      const res = await fetch(`${BASE_URL}/${task.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ title: editingTitle }),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || "Failed to update task");
      }
      const updatedTask = await res.json();
      setTasks((prev) =>
        prev.map((t) => (t.id === updatedTask.id ? updatedTask : t))
      );
      setEditingId(null);
      setEditingTitle("");
    } catch (err: unknown) {
      if (err instanceof Error) console.error(err.message);
      else console.error("Unknown error", err);
    }
  };

  // Cancel editing
  const cancelEdit = () => {
    setEditingId(null);
    setEditingTitle("");
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 text-white">
      <h1 className="text-3xl font-bold text-center mb-6">
        {user?.name}'s Tasks
      </h1>
      <div className="flex gap-4 items-start">
        <div className="bg-white">
          <input
            className=" px-3 py-3.5 border-none ml-0.5 mb-0.5 md:w-full w-60
 bg-black focus:ml-0 focus:mb-0 focus:outline-none placeholder:text-gray-300"
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            placeholder="New Task"
            onKeyDown={(e) => {
              if (e.key === "Enter") handleAddTask();
            }}
          />
        </div>
        <div className="bg-white w-fit h-auto">
          <button
            onClick={handleAddTask}
            className="w-20 h-12.5 ml-0.5 mb-0.5 cursor-pointer bg-black text-white font-semibold  hover:bg-gray-900 active:ml-0 active:mb-0 transition duration-200"
          >
            Add
          </button>
        </div>
      </div>

      {/* SEARCH + FILTER */}
      <div className="flex gap-4 flex-col lg:flex-row mt-6 items-start">
        {/* SEARCH */}
        <div className="bg-white">
          <input
            className="px-3 py-3.5 border-none ml-0.5 mb-0.5 w-85 bg-black focus:ml-0 focus:mb-0 focus:outline-none placeholder:text-gray-300"
            placeholder="Search tasks"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* FILTER BUTTONS */}
        <div className="flex gap-2 items-start">
          {(["all", "ongoing", "completed"] as FilterType[]).map((f) => (
            <div key={f} className="bg-white w-fit">
              <button
                onClick={() => setFilter(f)}
                className={`
            px-4 py-3.5 text-sm font-semibold
            ml-0.5 mb-0.5
            bg-black cursor-pointer
            transition duration-200
            ${filter === f ? "text-blue-400" : "text-gray-300"}
            active:ml-0 active:mb-0
          `}
              >
                {f.charAt(0).toUpperCase() + f.slice(1)}
              </button>
            </div>
          ))}
        </div>
      </div>

      <ul className="space-y-2 mt-2">
        {tasks
          .filter((task) =>
            task.title.toLowerCase().includes(search.toLowerCase())
          )
          .filter((task) => {
            if (filter === "all") return true;
            if (filter === "completed") return task.completed;
            if (filter === "ongoing") return !task.completed;
            return true;
          })
          .map((task) => (
            <li key={task.id} className="flex gap-10 mt-10 items-start">
              <div className="bg-white w-fit h-auto">
                <button
                  onClick={() => toggleComplete(task)}
                  className={`
        px-6 py-3 text-sm font-semibold
        ml-0.5 mb-0.5
        bg-black cursor-pointer
        transition duration-200
        active:ml-0 active:mb-0
        ${task.completed ? "text-green-400" : "text-yellow-400"}
      `}
                >
                  {task.completed ? "Completed" : "Ongoing"}
                </button>
              </div>

              {/* TASK BODY */}
              <div className="bg-white flex-1">
                <div className="flex items-center justify-between bg-black p-3 ml-0.5 mb-0.5">
                  <div className="flex items-center gap-2">
                    {editingId === task.id ? (
                      <input
                        className="px-2 py-1 bg-gray-900 border-none text-white focus:outline-none"
                        value={editingTitle}
                        onChange={(e) => setEditingTitle(e.target.value)}
                      />
                    ) : (
                      <span
                        className={`cursor-pointer ${
                          task.completed ? "line-through text-gray-400" : ""
                        }`}
                      >
                        {task.title}
                      </span>
                    )}
                  </div>

                  <div className="flex gap-2">
                    {editingId === task.id ? (
                      <>
                        <FaCheck
                          className="cursor-pointer text-green-500 hover:text-green-400"
                          onClick={() => saveEdit(task)}
                        />
                        <FaTimes
                          className="cursor-pointer text-red-500 hover:text-red-400"
                          onClick={cancelEdit}
                        />
                      </>
                    ) : (
                      <>
                        <FaEdit
                          className="cursor-pointer text-blue-500 hover:text-blue-400"
                          onClick={() => startEditing(task)}
                        />
                        <FaTrash
                          className="cursor-pointer text-red-500 hover:text-red-400"
                          onClick={() => handleDelete(task.id)}
                        />
                      </>
                    )}
                  </div>
                </div>
              </div>
            </li>
          ))}
      </ul>
    </div>
  );
}
