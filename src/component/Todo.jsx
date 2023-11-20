import React from 'react'


const Todo = ({ task,
    handleUpdateTask,
    handleDeleteTask,
    handleEditTask,
    index,
    handleSort,
    draggedOver,
    dragging }) => {

    return (
        <div draggable onDrop={() => null}
            onDragStart={() => dragging.current = index}
            onDragEnter={() => draggedOver.current = index}
            onDragEnd={() => handleSort()}
            onDragOver={(e) => e.preventDefault()}
            key={index} style={{marginBottom: '40px', border:"1px solid black"}}>
            <div className="task-item">

                <div style={{ display: 'flex' }}>
                    {/* complete or incomple marking checkbox */}
                    <span
                        style={{ marginRight: '5px', cursor: 'pointer' }}
                        onClick={() => handleUpdateTask(task._id, !task.complete, null)}
                    >
                        {task.complete ? (
                            <i class="fa-solid fa-circle-check"></i>
                        ) : (
                            <i class="fa-regular fa-circle"></i>
                        )}
                    </span>
                    {/* task text */}
                    {task.complete ? (
                        <p style={{ textDecoration: 'line-through' }}>{task.text}</p>
                    ) : (
                        <p>{task.text}</p>
                    )}
                </div>
                {/* edit and delete button */}
                <div>
                    <button onClick={() => handleEditTask(task._id)} className="edit-button">
                        <i class="fa-solid fa-pen-to-square"></i>
                    </button>
                    <button onClick={() => handleDeleteTask(task._id)} className="delete-button">
                        <i class="fa-solid fa-trash"></i>
                    </button>
                </div>
            </div>
        </div>
    )
}

export default Todo