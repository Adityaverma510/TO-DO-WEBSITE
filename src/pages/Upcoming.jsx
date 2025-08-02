import React, { useState, useEffect, useCallback } from 'react';

// Main App Component
const Upcoming = () => {
    // Initialize tasks with some dummy data or an empty array
    // Tasks will now persist using localStorage for a "soft" persistence (client-side only)
    const [tasks, setTasks] = useState(() => {
        const savedTasks = localStorage.getItem('static-todo-tasks');
        return savedTasks ? JSON.parse(savedTasks) : [];
    });

    const [selectedTask, setSelectedTask] = useState(null);
    const [isDetailPanelOpen, setIsDetailPanelOpen] = useState(false);

    // Save tasks to localStorage whenever they change
    useEffect(() => {
        localStorage.setItem('static-todo-tasks', JSON.stringify(tasks));
    }, [tasks]);


    // Handlers for task operations - now directly modifying local state
    const handleAddTask = (title, dueDate = '', dueTime = '', list = '', tags = []) => {
        if (!title.trim()) return null;

        const newId = Date.now().toString(); // Simple unique ID for static app
        const newTask = {
            id: newId,
            title: title.trim(),
            completed: false, // Default to not completed
            createdAt: new Date(), // Use local Date object for sorting
            dueDate: dueDate,
            dueTime: dueTime, // Added dueTime
            list: list,
            tags: tags,
            description: '',
            subtasks: [],
        };
        setTasks(prevTasks => [...prevTasks, newTask]);
        return newTask; // Return the new task object for opening the panel
    };

    const handleToggleComplete = (taskId, completed) => {
        setTasks(prevTasks =>
            prevTasks.map(task =>
                task.id === taskId ? { ...task, completed: completed } : task
            )
        );
    };

    const handleSelectTask = (task) => {
        setSelectedTask(task);
        setIsDetailPanelOpen(true);
    };

    const handleCloseDetailPanel = () => {
        setSelectedTask(null);
        setIsDetailPanelOpen(false);
    };

    const handleSaveTask = (updatedTask) => {
        setTasks(prevTasks => {
            const newTasks = prevTasks.map(task => {
                if (task.id === updatedTask.id) {
                    return updatedTask;
                }
                return task;
            });
            return newTasks;
        });
        handleCloseDetailPanel();
    };

    const handleDeleteTask = (taskIdToDelete) => {
        if (window.confirm("Are you sure you want to delete this task?")) {
            setTasks(prevTasks => {
                const newTasks = prevTasks.filter(task => task.id !== taskIdToDelete);
                return newTasks;
            });
            handleCloseDetailPanel(); // Close panel after deletion
        }
    };

    return (
        <div className="flex min-h-screen bg-gray-100 font-inter">
            {/* Main Content Area */}
            <div className="flex-1 transition-all duration-300">
                {/* The UpcomingView is now the main and only view */}
                <UpcomingView
                    tasks={tasks}
                    onSelectTask={handleSelectTask}
                    onToggleComplete={handleToggleComplete} // Pass the toggle function down
                />
            </div>

            {/* Task Detail Panel (now a centered modal) */}
            <TaskDetailPanel
                task={selectedTask}
                isOpen={isDetailPanelOpen}
                onClose={handleCloseDetailPanel}
                onSave={handleSaveTask}
                onDelete={handleDeleteTask}
            />
        </div>
    );
};

// TaskItem Component (Existing)
const TaskItem = ({ task, onToggleComplete, onSelectTask }) => {
    const handleCheckboxChange = (e) => {
        e.stopPropagation();
        onToggleComplete(task.id, e.target.checked);
    };

    const handleTaskItemClick = () => {
        onSelectTask(task);
    };

    const getListColorClass = (listName) => {
        switch (listName.toLowerCase()) {
            case 'personal': return 'bg-red-100 text-red-800';
            case 'work': return 'bg-blue-100 text-blue-800';
            case 'groceries': return 'bg-green-100 text-green-800';
            default: return 'bg-gray-100 text-gray-700';
        }
    };

    const getTagColorClass = (tagName) => {
        switch (tagName.toLowerCase()) {
            case 'urgent': return 'bg-red-100 text-red-700';
            case 'project x': return 'bg-blue-100 text-blue-700';
            case 'home': return 'bg-purple-100 text-purple-700';
            default: return 'bg-gray-200 text-gray-700';
        }
    };

    return (
        <li
            className={`flex items-center justify-between p-4 rounded-lg shadow-sm cursor-pointer transition-all duration-200 ${task.completed ? 'bg-gray-50 opacity-70 line-through' : 'bg-white hover:bg-gray-50'
                }`}
            onClick={handleTaskItemClick}
        >
            <div className="flex items-center flex-grow">
                <input
                    type="checkbox"
                    className="form-checkbox h-5 w-5 text-blue-600 rounded mr-4"
                    checked={task.completed}
                    onChange={handleCheckboxChange}
                />
                <span className={`text-lg ${task.completed ? 'text-gray-500' : 'text-gray-800'}`}>
                    {task.title}
                </span>
                <div className="flex items-center ml-4 space-x-2 text-sm text-gray-500">
                    {/* Display Due Date */}
                    <span className="flex items-center bg-gray-100 px-2 py-1 rounded-full">
                        <svg className="w-4 h-4 mr-1 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                        </svg>
                        {task.dueDate || 'No Due Date'}
                    </span>
                    {/* Display Due Time */}
                    {task.dueTime && (
                        <span className="flex items-center bg-gray-100 px-2 py-1 rounded-full">
                            <svg className="w-4 h-4 mr-1 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                            </svg>
                            {task.dueTime}
                        </span>
                    )}
                    {/* Display List/Category */}
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getListColorClass(task.list)}`}>
                        {task.list || 'No List'}
                    </span>
                    {/* Display Tags */}
                    {task.tags && task.tags.length > 0 ? (
                        task.tags.map((tag, index) => (
                            <span key={index} className={`px-2 py-1 rounded-full text-xs font-medium ${getTagColorClass(tag)}`}>
                                {tag}
                            </span>
                        ))
                    ) : (
                        <span className="px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-500">No Tags</span>
                    )}
                    {/* Display Subtasks Count */}
                    {task.subtasks && task.subtasks.length > 0 && (
                        <span className="flex items-center bg-gray-100 px-2 py-1 rounded-full text-xs">
                            <svg className="w-4 h-4 mr-1 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"></path>
                            </svg>
                            {task.subtasks.length} Subtasks
                        </span>
                    )}
                </div>
            </div>
            <div className="ml-4 text-gray-400">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
                </svg>
            </div>
        </li>
    );
};

// TaskDetailPanel Component (Existing)
const TaskDetailPanel = ({ task, isOpen, onClose, onSave, onDelete }) => {
    const [editedTask, setEditedTask] = useState(task);
    const [newSubtaskTitle, setNewSubtaskTitle] = useState('');
    const [newTagInput, setNewTagInput] = useState('');

    useEffect(() => {
        if (task) {
            setEditedTask({
                ...task,
                subtasks: task.subtasks ? [...task.subtasks] : [],
                tags: task.tags ? [...task.tags] : [],
            });
        }
    }, [task]);

    if (!isOpen || !editedTask) {
        return null;
    }

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name === 'completed') {
            setEditedTask(prev => ({ ...prev, completed: value === 'completed' }));
        } else {
            setEditedTask(prev => ({ ...prev, [name]: value }));
        }
    };

    const handleSubtaskChange = (index, e) => {
        const updatedSubtasks = editedTask.subtasks.map((sub, i) =>
            i === index ? { ...sub, title: e.target.value } : sub
        );
        setEditedTask(prev => ({ ...prev, subtasks: updatedSubtasks }));
    };

    const handleToggleSubtaskComplete = (index) => {
        const updatedSubtasks = editedTask.subtasks.map((sub, i) =>
            i === index ? { ...sub, completed: !sub.completed } : sub
        );
        setEditedTask(prev => ({ ...prev, subtasks: updatedSubtasks }));
    };

    const handleAddSubtask = () => {
        if (newSubtaskTitle.trim()) {
            setEditedTask(prev => ({
                ...prev,
                subtasks: [...prev.subtasks, { id: Date.now(), title: newSubtaskTitle.trim(), completed: false }]
            }));
            setNewSubtaskTitle('');
        }
    };

    const handleDeleteSubtask = (idToDelete) => {
        setEditedTask(prev => ({
            ...prev,
            subtasks: prev.subtasks.filter(sub => sub.id !== idToDelete)
        }));
    };

    const handleAddTag = () => {
        if (newTagInput.trim() && !editedTask.tags.includes(newTagInput.trim())) {
            setEditedTask(prev => ({
                ...prev,
                tags: [...prev.tags, newTagInput.trim()]
            }));
            setNewTagInput('');
        }
    };

    const handleRemoveTag = (tagToRemove) => {
        setEditedTask(prev => ({
            ...prev,
            tags: prev.tags.filter(tag => tag !== tagToRemove)
        }));
    };

    const handleSaveClick = () => {
        onSave(editedTask);
    };

    const handleDeleteClick = () => {
        onDelete(editedTask.id);
    };

    const listOptions = ['Personal', 'Work', 'Groceries', 'Other'];

    return (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50 p-4">
            <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md relative flex flex-col max-h-[90vh]">
                <div className="flex items-center justify-between mb-6 border-b pb-4">
                    <h2 className="text-2xl font-bold text-gray-800">Task:</h2>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-800 focus:outline-none">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                        </svg>
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto pr-2">
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                        <div className="flex items-center space-x-4">
                            <label className="inline-flex items-center">
                                <input
                                    type="radio"
                                    className="form-radio h-4 w-4 text-green-600"
                                    name="completed"
                                    value="completed"
                                    checked={editedTask.completed === true}
                                    onChange={handleChange}
                                />
                                <span className="ml-2 text-gray-800">Completed</span>
                            </label>
                            <label className="inline-flex items-center">
                                <input
                                    type="radio"
                                    className="form-radio h-4 w-4 text-red-600"
                                    name="completed"
                                    value="not completed"
                                    checked={editedTask.completed === false}
                                    onChange={handleChange}
                                />
                                <span className="ml-2 text-gray-800">Not Completed</span>
                            </label>
                        </div>
                    </div>

                    <div className="mb-4">
                        <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                        <input
                            type="text"
                            id="title"
                            name="title"
                            value={editedTask.title}
                            onChange={handleChange}
                            className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                        />
                    </div>

                    <div className="mb-4">
                        <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                        <textarea
                            id="description"
                            name="description"
                            value={editedTask.description}
                            onChange={handleChange}
                            rows="3"
                            className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                            placeholder="Add a detailed description..."
                        ></textarea>
                    </div>

                    <div className="mb-4">
                        <label htmlFor="list" className="block text-sm font-medium text-gray-700 mb-1">List</label>
                        <select
                            id="list"
                            name="list"
                            value={editedTask.list}
                            onChange={handleChange}
                            className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                        >
                            <option value="">None</option>
                            {listOptions.map(option => (
                                <option key={option} value={option}>{option}</option>
                            ))}
                        </select>
                    </div>

                    <div className="mb-4">
                        <label htmlFor="dueDate" className="block text-sm font-medium text-gray-700 mb-1">Due date</label>
                        <input
                            type="date"
                            id="dueDate"
                            name="dueDate"
                            value={editedTask.dueDate}
                            onChange={handleChange}
                            className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                        />
                    </div>

                    <div className="mb-4">
                        <label htmlFor="dueTime" className="block text-sm font-medium text-gray-700 mb-1">Due time</label>
                        <input
                            type="time"
                            id="dueTime"
                            name="dueTime"
                            value={editedTask.dueTime}
                            onChange={handleChange}
                            className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                        />
                    </div>

                    <div className="mb-6">
                        <label className="block text-sm font-medium text-gray-700 mb-2">Tags</label>
                        <div className="flex flex-wrap gap-2 mb-2">
                            {editedTask.tags.map((tag, index) => (
                                <span
                                    key={index}
                                    className="flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-700 cursor-pointer"
                                    onClick={() => handleRemoveTag(tag)}
                                >
                                    {tag}
                                    <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                                    </svg>
                                </span>
                            ))}
                        </div>
                        <div className="flex items-center">
                            <input
                                type="text"
                                placeholder="Add Tag"
                                value={newTagInput}
                                onChange={(e) => setNewTagInput(e.target.value)}
                                onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleAddTag(); } }}
                                className="flex-1 p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                            />
                            <button
                                onClick={handleAddTag}
                                className="ml-2 p-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 focus:outline-none"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                                </svg>
                            </button>
                        </div>
                    </div>

                    <div className="mb-6">
                        <h3 className="text-lg font-semibold text-gray-800 mb-3">Subtasks:</h3>
                        <ul className="space-y-2 mb-4">
                            {editedTask.subtasks.map((subtask, index) => (
                                <li key={subtask.id} className="flex items-center justify-between bg-gray-50 p-3 rounded-md">
                                    <div className="flex items-center flex-1">
                                        <input
                                            type="checkbox"
                                            className="form-checkbox h-4 w-4 text-blue-600 rounded mr-3"
                                            checked={subtask.completed}
                                            onChange={() => handleToggleSubtaskComplete(index)}
                                        />
                                        <input
                                            type="text"
                                            value={subtask.title}
                                            onChange={(e) => handleSubtaskChange(index, e)}
                                            className={`flex-1 bg-transparent focus:outline-none ${subtask.completed ? 'line-through text-gray-500' : 'text-gray-800'}`}
                                        />
                                    </div>
                                    <button
                                        onClick={() => handleDeleteSubtask(subtask.id)}
                                        className="ml-4 text-red-500 hover:text-red-700 focus:outline-none"
                                    >
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                                        </svg>
                                    </button>
                                </li>
                            ))}
                        </ul>
                        <div className="flex items-center">
                            <input
                                type="text"
                                placeholder="Add New Subtask"
                                value={newSubtaskTitle}
                                onChange={(e) => setNewSubtaskTitle(e.target.value)}
                                onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleAddSubtask(); } }}
                                className="flex-1 p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                            />
                            <button
                                onClick={handleAddSubtask}
                                className="ml-2 p-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 focus:outline-none"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>

                <div className="mt-auto flex justify-between pt-4 border-t border-gray-200">
                    <button
                        onClick={handleDeleteClick}
                        className="px-5 py-2 bg-red-500 text-white font-semibold rounded-lg shadow-md hover:bg-red-600 transition duration-200"
                    >
                        Delete Task
                    </button>
                    <button
                        onClick={handleSaveClick}
                        className="px-5 py-2 bg-yellow-500 text-gray-900 font-semibold rounded-lg shadow-md hover:bg-yellow-600 transition duration-200"
                    >
                        Save changes
                    </button>
                </div>
            </div>
        </div>
    );
};

// New UpcomingView Component
const UpcomingView = ({ tasks, onSelectTask, onToggleComplete }) => {
    // Filter for pending tasks and sort them
    const pendingTasks = tasks.filter(task => !task.completed)
        .sort((a, b) => {
            // Tasks with a due date come first
            if (a.dueDate && b.dueDate) {
                // Sort by date, then by time
                if (a.dueDate === b.dueDate) {
                    return (a.dueTime || '').localeCompare(b.dueTime || '');
                }
                return a.dueDate.localeCompare(b.dueDate);
            }
            if (a.dueDate) return -1; // a comes first
            if (b.dueDate) return 1;  // b comes first
            return (a.createdAt || 0) - (b.createdAt || 0); // Both have no date, sort by creation time
        });

    // Group tasks by date
    const groupedTasks = pendingTasks.reduce((acc, task) => {
        const dateKey = task.dueDate || 'No Due Date';
        if (!acc[dateKey]) {
            acc[dateKey] = [];
        }
        acc[dateKey].push(task);
        return acc;
    }, {});

    const sortedDates = Object.keys(groupedTasks).sort((a, b) => {
        if (a === 'No Due Date') return 1;
        if (b === 'No Due Date') return -1;
        return a.localeCompare(b);
    });

    return (
        <div className="w-full h-full p-8 bg-white rounded-none overflow-y-auto">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Upcoming Tasks</h2>
            {pendingTasks.length === 0 ? (
                <div className="text-center text-gray-500 py-12">
                    <p>You have no upcoming tasks!</p>
                    <p>Enjoy your free time or add a new task.</p>
                </div>
            ) : (
                <div className="space-y-6">
                    {sortedDates.map(dateKey => (
                        <div key={dateKey}>
                            <h3 className="text-xl font-semibold text-gray-700 mb-4 pb-2 border-b border-gray-200">
                                {dateKey === 'No Due Date' ? 'No Due Date' : new Date(dateKey + 'T00:00:00').toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                            </h3>
                            <ul className="space-y-4">
                                {groupedTasks[dateKey].map(task => (
                                    <TaskItem
                                        key={task.id}
                                        task={task}
                                        onSelectTask={onSelectTask}
                                        onToggleComplete={onToggleComplete}
                                    />
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Upcoming;
