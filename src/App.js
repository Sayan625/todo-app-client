import React, { useState, useEffect,useRef } from 'react';
import './App.css';
import Todo from './component/Todo';

const apiBase = 'https://todo-server-96t4.onrender.com';
// const apiBase = 'http://localhost:2001';


const App = () => {
  // State variables for managing tasks, new task input, edited task, edit mode, and loading state
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState('');
  const [editedTask, setEditedTask] = useState({});
  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(false);
  const dragging=useRef(0)
  const draggedOver=useRef(0)

  // Function to fetch tasks from the API
  const handleGetTask = async () => {
    setLoading(true); // Set loading state to true
    const data = await fetch(apiBase + '/api/todos');
    const Data = await data.json();
    // Data.sort((a, b)=> a.index - b.index)
    console.log(Data)
    setTasks(()=>Data); 
    setLoading(false); 
  };

  // Function to add a new task
  const handleAddTask = async () => {
    if (newTask.trim() !== '') {
      setTasks([{ _id: null, text: newTask }, ...tasks]); // Add the new task optimistically
      await fetch(apiBase + '/api/todos/new', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: newTask,
          index: tasks.length
        }),
      });
      setNewTask(''); // Clear the new task input
      handleGetTask(); // Refresh the task list from the API
    }
  };

  // Function to delete a task
  const handleDeleteTask = async (_id) => {
    setTasks(tasks.filter((task) => task._id !== _id)); // Remove the task optimistically
    await fetch(apiBase + '/api/todos/delete/' + _id, { method: 'DELETE' });
  };

  // Function to start editing a task
  const handleEditTask = (_id) => {
    const taskToEdit = tasks.find((task) => task._id === _id);
    setEditedTask(taskToEdit); // Set the task to be edited and enable edit mode
    setEditMode(true);
  };


  // Function to update a task (either text or completion status)
  const handleUpdateTask = async (_id, complete = null, text = null, index=null) => {
    console.log(_id)
    if (complete === null && text === null)
      return
    let updatedtask = {}

    setTasks(
      tasks.map((task) => {
        if (task._id === _id) {

          task.text=text!==null ? text : task.text
          task.complete=complete !== null ? complete : task.complete
          task.index= index!== null ? index : task.index

          updatedtask = {
            'text': task.text,
            'complete':  task.complete,
            'index':task.index
          }
        }
        return task
      }
      ));

    setEditedTask(() => ({ ...editedTask, 'text': "Updating: Please wait" }))
    await fetch(apiBase + '/api/todos/update/' + _id, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updatedtask),
    });
    setEditMode(false); // Disable edit mode
    setEditedTask({});

  };

  const handleSort=async()=>{
    console.log(draggedOver.current)
    console.log(dragging.current)

    setTasks((prev)=>{
      const list=[...prev]
      const temp=tasks[draggedOver.current]
      list[draggedOver.current]=list[dragging.current]
      list[dragging.current]=temp
      console.log(list)
      return list

    })
    await fetch(apiBase + `/api/todos/sort?index1=${dragging.current}&index2=${draggedOver.current}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    console.log(tasks)

  }

  // Use the useEffect hook to fetch tasks when the component mounts
  useEffect(() => {
    handleGetTask();
    console.log(tasks)

  }, []);

  return (
    <div className="App">
      <div className="container">
        <h2 className="title">Todo List</h2>
        {/* Add Task section */}
        <div className="input-container">
          <input
            type="text"
            placeholder="Add a task"
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
            className="input"
          />
          {/* Add button */}
          <button onClick={handleAddTask} className="add-button">
            Add
          </button>
          {loading ? <div style={{ marginTop: '15px' }}>Loading...</div> : <></>}
        </div>
        {/* Task list section */}
        <div className="task-list">
          {tasks.map((task, index) => (
            <Todo task={task}
              handleUpdateTask={handleUpdateTask}
              handleEditTask={handleEditTask}
              handleDeleteTask={handleDeleteTask}
              handleSort={handleSort}
              draggedOver={draggedOver}
              dragging={dragging}
              index={index} />
          ))}
        </div>
        {/* edit mode section */}
        {editMode && (
          <div className="edit-container">
            <input
              type="text"
              value={editedTask.text}
              onChange={(e) => setEditedTask((prev) => ({ ...prev, 'text': e.target.value }))}
              className="edit-input"
            />
            {/* update button */}
            <button onClick={() => handleUpdateTask(editedTask._id, null, editedTask.text)} className="update-button">
              Update
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default App;
