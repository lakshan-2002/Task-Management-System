import React, {useState} from "react";
import "./Tasks.css";

const baseurl = "http://localhost:8080";

function AllTasks() {
    const [filter, setFilter] = useState("All");
    const [editTask, setEditTask] = useState(null); // Holds the task being edited
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [tasks, setTasks] = useState([]);
    const [message, setMessage] = useState(""); // For showing success/error messages
    const [error, setError] = useState(""); // For error handling

    // const tasks = [
    //     { title: "Build Navbar", description: "Implement navbar.", status: "In Progress", priority: "High", dueDate: "2025-01-05" },
    //     { title: "Create Login Page", description: "Design login page.", status: "Pending", priority: "Medium", dueDate: "2025-01-10" },
    //     { title: "Set Up Database", description: "Configure MySQL.", status: "Completed", priority: "Low", dueDate: "2023-12-25" },
    //     { title: "Implement Authentication", description: "Add authentication logic.", status: "Completed", priority: "High", dueDate: "2024-01-15" },
    //     { title: "Optimize Performance", description: "Improve page load speed.", status: "Pending", priority: "Medium", dueDate: "2025-01-20" },
    //     { title: "Presentation", description: "Communication skills.", status: "Pending", priority: "Medium", dueDate: "2024-01-25" },
    //     { title: "Figma Project", description: "Making a FitEase app.", status: "Completed", priority: "Low", dueDate: "2024-12-22" },
    //   ];

    // Fetch tasks from the backend
    useEffect(() => {
      const fetchData = async () => {
        try {
          const response = await fetch(`${baseurl}/task/getAllTasks`);
          if (!response.ok) {
            throw new Error("Failed to fetch tasks");
          }
          const result = await response.json();
          setTasks(result);
        } catch (error) {
          setError(error.message);
        }
      };
      fetchData();
    }, []);

    const filteredTasks = filter === "All" ? tasks : tasks.filter((task) => task.priority === filter);

  const handleFilterChange = (event) => {
    setFilter(event.target.value);
  };

  const handleEdit = (task) => {
    setEditTask(task);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setEditTask(null);
    setIsModalOpen(false);
  };

  const handleSave = async () => {
    try {
      const response = await fetch(`${baseurl}/task/updateTask`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(editTask),
      });
      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.message || `Error: ${response.statusText}`);
      }
      setMessage(result.message);
      setIsModalOpen(false);
      // Re-fetch the tasks after update
      await fetchData();
    } catch (error) {
      setError(error.message);
    }
  };

  const handleDelete = async (taskId) => {
    try {
      const response = await fetch(`${baseurl}/task/deleteTask/${taskId}`, {
        method: "DELETE",
      });
      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.message || `Error: ${response.statusText}`);
      }
      setMessage(result.message);
      // Re-fetch the tasks after delete
      await fetchData();
    } catch (error) {
      setError(error.message);
    }
  };

  const handleChange = (field, value) => {
    setEditTask({ ...editTask, [field]: value });
  };

    return (
        <div className="all-tasks-container">
          <div className="all-tasks-header">
            <h2 className="all-tasks-title">All Tasks</h2>
            <label className="task-filter-label">Filter by Priority:</label>
            <select className="task-filter" value={filter} onChange={handleFilterChange}>
              <option value="All">All</option>
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>
          </div>

           {/* Display success/error messages */}
          {message && <div className="alert success">{message}</div>}
          {error && <div className="alert error">{error}</div>}

          <div className="task-container">
            {filteredTasks.map((task, index) => (
              <div className="task-box" key={index}>
                <h3 className="task-title">{task.title}</h3>
                <p className="task-description">Description: {task.description}</p>
                <p className="task-status">Status: {task.status}</p>
                <p className="task-priority">Priority: {task.priority}</p>
                <p className="task-due-date">Due Date: {task.dueDate}</p>
                <input type="button" value="Edit" className="task-edit-button" onClick={() => handleEdit(task)}/>
                <input type="button" value="Delete" className="task-delete-button" onClick={() => handleDelete(task.id)}/>
              </div>
            ))}
          </div>
        {isModalOpen && editTask && (
          <div className="modal">
            <div className="modal-content">
              <h3 align = "center">Edit Task</h3>
              <form>
                <label>Title:</label>
                <input
                  type="text"
                  value={editTask.title}
                  onChange={(e) => handleChange("title", e.target.value)}
                />

                <label>Description:</label>
                <textarea
                  value={editTask.description}
                  onChange={(e) => handleChange("description", e.target.value)}
                ></textarea>

                <label>Status:</label>
                <select
                  value={editTask.status}
                  onChange={(e) => handleChange("status", e.target.value)}
                >
                  <option value="Pending">Pending</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Completed">Completed</option>
                </select>

                <label>Priority:</label>
                <select
                  value={editTask.priority}
                  onChange={(e) => handleChange("priority", e.target.value)}
                >
                  <option value="High">High</option>
                  <option value="Medium">Medium</option>
                  <option value="Low">Low</option>
                </select>

                <label>Due Date:</label>
                <input
                  type="date"
                  value={editTask.dueDate}
                  onChange={(e) => handleChange("dueDate", e.target.value)}
                />
              </form>
              <button className="save-button" onClick={handleSave}>
                Save
              </button>
              <button className="close-button" onClick={handleCloseModal}>
                Close
              </button>
            </div>
          </div>
        )}
      </div>
    
  );
}

export default AllTasks;
