import React, { useState, useEffect } from "react";
import "./App.css";

function App() {
  const [inputTitle, setInputTitle] = useState("");
  const [inputDescription, setInputDescription] = useState("");
  const [todos, setTodos] = useState([]);
  const [completedTodos, setCompletedTodos] = useState([]);
  const [pendingTodos, setPendingTodos] = useState([]);
  const [showMorePending, setShowMorePending] = useState(false);
  const [showMoreCompleted, setShowMoreCompleted] = useState(false);

  // Load data from local storage on initial render
  useEffect(() => {
    const storedTodos = JSON.parse(localStorage.getItem("todos"));
    if (storedTodos) {
      setTodos(storedTodos);
      updatePendingAndCompletedLists(storedTodos);
    }
  }, []);

  // Function to add a new todo
  const addTodo = () => {
    if (inputTitle.trim() !== "") {
      const newTodo = {
        title: inputTitle,
        description: inputDescription,
        id: Date.now(),
        addedDate: new Date().toLocaleString(),
        completed: false,
        completedDate: null,
      };

      const updatedTodos = [...todos, newTodo];
      setTodos(updatedTodos);
      updatePendingAndCompletedLists(updatedTodos);

      // Save data to local storage
      localStorage.setItem("todos", JSON.stringify(updatedTodos));

      setInputTitle("");
      setInputDescription("");
    }
  };

  // Function to edit a todo
  const editTodo = (id, newTitle, newDescription) => {
    const updatedTodos = todos.map((todo) =>
      todo.id === id ? { ...todo, title: newTitle, description: newDescription } : todo
    );
    setTodos(updatedTodos);
    updatePendingAndCompletedLists(updatedTodos);

    // Save data to local storage
    localStorage.setItem("todos", JSON.stringify(updatedTodos));
  };

  // Function to mark a todo as completed
  const markAsCompleted = (id) => {
    const updatedTodos = todos.map((todo) =>
      todo.id === id ? { ...todo, completed: true, completedDate: new Date().toLocaleString() } : todo
    );
    setTodos(updatedTodos);
    updatePendingAndCompletedLists(updatedTodos);

    // Save data to local storage
    localStorage.setItem("todos", JSON.stringify(updatedTodos));
  };

  // Function to remove a todo
  const removeTodo = (id) => {
    const confirmation = window.confirm("Are you sure you want to remove this todo?");
    if (confirmation) {
      const updatedTodos = todos.filter((todo) => todo.id !== id);
      setTodos(updatedTodos);
      updatePendingAndCompletedLists(updatedTodos);

      // Save data to local storage
      localStorage.setItem("todos", JSON.stringify(updatedTodos));
    }
  };

  // Function to update pending and completed lists
  const updatePendingAndCompletedLists = (updatedTodos) => {
    const updatedPendingTodos = updatedTodos.filter((todo) => !todo.completed);
    const updatedCompletedTodos = updatedTodos.filter((todo) => todo.completed);

    setPendingTodos(updatedPendingTodos);
    setCompletedTodos(updatedCompletedTodos);
  };

  // Function to toggle "Show More" for pending tasks
  const handleShowMorePending = () => {
    setShowMorePending(!showMorePending);
  };

  // Function to toggle "Show More" for completed tasks
  const handleShowMoreCompleted = () => {
    setShowMoreCompleted(!showMoreCompleted);
  };

  return (
    <div className="diary-container">
      <h1 className="diary-title">Personal Diary on the go</h1>
      <div className="container">
        <div className="left-column">
          <div>
            <label>Title:</label>
            <input
              type="text"
              value={inputTitle}
              onChange={(e) => setInputTitle(e.target.value)}
            />
          </div>
          <div>
            <label>Description:</label>
            <textarea
              value={inputDescription}
              onChange={(e) => setInputDescription(e.target.value)}
            />
          </div>
          <button onClick={addTodo}>Add</button>
        </div>

        <div className="right-column">
          <div className="tasks-container">
            <h2 className="pending-tasks-title">Pending Tasks</h2>
            <table className="tasks-table">
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Description</th>
                  <th>Added Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {pendingTodos.slice(0, showMorePending ? pendingTodos.length : 3).map((todo) => (
                  <tr key={todo.id} className="pending-task">
                    <td><strong>{todo.title}</strong></td>
                    <td>{todo.description}</td>
                    <td>{todo.addedDate}</td>
                    <td>
                      <button onClick={() => editTodo(todo.id, prompt("Enter new title:", todo.title), prompt("Enter new description:", todo.description))}>
                        <i className="fas fa-pen"></i>
                      </button>
                      <button onClick={() => markAsCompleted(todo.id)}>
                        <i className="fas fa-check"></i>
                      </button>
                      <button onClick={() => removeTodo(todo.id)}>
                        <i className="fas fa-times"></i>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {pendingTodos.length > 3 && (
              <button onClick={handleShowMorePending} className="show-more-button">
                {showMorePending ? "Show Less" : "Show More"}
              </button>
            )}

            <h2 className="completed-tasks-title">Completed Tasks</h2>
            <table className="tasks-table">
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Description</th>
                  <th>Completed Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {completedTodos.slice(0, showMoreCompleted ? completedTodos.length : 3).map((todo) => (
                  <tr key={todo.id} className="completed-task">
                    <td><strong>{todo.title}</strong></td>
                    <td>{todo.description}</td>
                    <td>{todo.completedDate}</td>
                    <td>
                      <button onClick={() => removeTodo(todo.id)}>
                        <i className="fas fa-times"></i>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {completedTodos.length > 3 && (
              <button onClick={handleShowMoreCompleted} className="show-more-completed-button">
                {showMoreCompleted ? "Show Less" : "Show More"}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
