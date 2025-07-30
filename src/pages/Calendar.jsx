import React, { useState, useEffect, useCallback } from 'react';

// Main App Component
const Calendar = () => {
    // Initialize tasks with some dummy data or an empty array
    // Tasks will now persist using localStorage for a "soft" persistence (client-side only)
    const [tasks, setTasks] = useState(() => {
        const savedTasks = localStorage.getItem('static-todo-tasks');
        return savedTasks ? JSON.parse(savedTasks) : [];
    });

    const [selectedTask, setSelectedTask] = useState(null);
    const [isDetailPanelOpen, setIsDetailPanelOpen] = useState(false);
    // Removed currentMainView state as only calendar will be displayed

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
        console.log("App.js: handleSaveTask received updatedTask:", updatedTask);
        setTasks(prevTasks => {
            const newTasks = prevTasks.map(task => {
                if (task.id === updatedTask.id) {
                    // This is the crucial line: returning the *new* updatedTask object
                    return updatedTask;
                }
                return task;
            });
            console.log("App.js: Tasks array after save update:", newTasks);
            return newTasks;
        });
        handleCloseDetailPanel();
    };

    const handleDeleteTask = (taskIdToDelete) => {
        console.log("App.js: Attempting to delete task with ID:", taskIdToDelete);
        setTasks(prevTasks => {
            const newTasks = prevTasks.filter(task => task.id !== taskIdToDelete);
            console.log("App.js: Tasks after filter:", newTasks);
            return newTasks;
        });
        handleCloseDetailPanel(); // Close panel after deletion
    };

    // Filter tasks for "Today" based on due date
    const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
    const todayTasks = tasks.filter(task => task.dueDate === today && !task.completed);

    return (
        <div className="flex min-h-screen bg-gray-100 font-inter">
            {/* Main Content Area - Now directly displays CalendarView */}
            <div className={`flex-1 transition-all duration-300`}>
                <CalendarView
                    tasks={tasks}
                    onSelectTask={handleSelectTask}
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

// TaskListView Component (Existing - remains here but not rendered by App directly)
const TaskListView = ({ tasks, todayTasksCount, onAddTask, onToggleComplete, onSelectTask }) => {
    const [newTaskTitle, setNewTaskTitle] = useState('');

    const handleNewTaskSubmit = (e) => {
        e.preventDefault();
        if (newTaskTitle.trim()) {
            const newTask = onAddTask(newTaskTitle); // Call the static addTask
            if (newTask) {
                onSelectTask(newTask); // Open detail panel for the new task
            }
            setNewTaskTitle('');
        }
    };

    const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD

    // Filter tasks that are due today or have no due date and are not completed
    const displayTasks = tasks.filter(task =>
        (task.dueDate === today || !task.dueDate) && !task.completed
    ).sort((a, b) => {
        // Sort incomplete tasks: those with due date today first, then others by creation time
        // For static app, createdAt will be a Date object directly
        return (a.createdAt || 0) - (b.createdAt || 0);
    });

    const completedTasks = tasks.filter(task => task.completed);


    return (
        <div className="w-full h-full bg-white rounded-none">
            <h1 className="text-4xl font-bold text-gray-800 mb-6 flex items-center p-8">
                Today <span className="ml-4 px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-lg font-semibold">{todayTasksCount}</span>
            </h1>

            {/* Add New Task Form */}
            <form onSubmit={handleNewTaskSubmit} className="mb-8 border-b border-gray-200 pb-6 px-8">
                <div className="flex items-center bg-gray-50 rounded-lg p-3">
                    <button type="submit" className="text-gray-500 hover:text-blue-600 mr-3 focus:outline-none">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                        </svg>
                    </button>
                    <input
                        type="text"
                        placeholder="Add New Task"
                        className="flex-1 bg-transparent text-gray-800 placeholder-gray-400 focus:outline-none"
                        value={newTaskTitle}
                        onChange={(e) => setNewTaskTitle(e.target.value)}
                    />
                </div>
            </form>

            {/* Task List */}
            <ul className="space-y-4 px-8">
                {displayTasks.length === 0 && completedTasks.length === 0 && (
                    <p className="text-gray-500 text-center py-4">No tasks for today! Time to relax or add some new ones.</p>
                )}
                {displayTasks.map(task => (
                    <TaskItem
                        key={task.id}
                        task={task}
                        onToggleComplete={onToggleComplete}
                        onSelectTask={onSelectTask}
                    />
                ))}
                {completedTasks.length > 0 && (
                    <>
                        <div className="text-gray-500 text-sm uppercase tracking-wider mt-8 pt-4 border-t border-gray-200">
                            Completed Tasks
                        </div>
                        {completedTasks.map(task => (
                            <TaskItem
                                key={task.id}
                                task={task}
                                onToggleComplete={onToggleComplete}
                                onSelectTask={onSelectTask}
                            />
                        ))}
                    </>
                )}
            </ul>
        </div>
    );
};

// TaskItem Component (Existing)
const TaskItem = ({ task, onToggleComplete, onSelectTask }) => {
    console.log(`TaskItem ID: ${task.id} - Title: "${task.title}" - DueDate: "${task.dueDate}" - List: "${task.list}" - Tags: [${task.tags.join(', ')}]`);

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
        console.log("TaskDetailPanel: Saving task. editedTask before onSave:", editedTask);
        onSave(editedTask);
    };

    const handleDeleteClick = () => {
        console.log("TaskDetailPanel: Delete button clicked for task ID:", editedTask.id);
        if (window.confirm("Are you sure you want to delete this task?")) {
            console.log("TaskDetailPanel: User confirmed deletion.");
            onDelete(editedTask.id);
        } else {
            console.log("TaskDetailPanel: User cancelled deletion.");
        }
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

// New CalendarView Component
const CalendarView = ({ tasks, onSelectTask }) => {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [view, setView] = useState('day'); // Changed default view to 'day'

    // Filter and sort tasks for a given date string (YYYY-MM-DD)
    const getPendingTasksForDate = (dateString) => {
        return tasks.filter(task => task.dueDate === dateString && !task.completed)
            .sort((a, b) => (a.dueTime || '').localeCompare(b.dueTime || ''));
    };

    const getTasksForWeek = (startOfWeek) => {
        const weekTasks = {};
        for (let i = 0; i < 7; i++) {
            const date = new Date(startOfWeek);
            date.setDate(startOfWeek.getDate() + i);
            const dateString = date.toISOString().split('T')[0];
            weekTasks[dateString] = getPendingTasksForDate(dateString);
        }
        return weekTasks;
    };

    const getStartOfWeek = (date) => {
        const d = new Date(date);
        const day = d.getDay(); // Sunday - 0, Monday - 1, etc.
        const diff = d.getDate() - day + (day === 0 ? -6 : 1); // Adjust to Monday
        d.setDate(diff);
        d.setHours(0, 0, 0, 0);
        return d;
    };

    const getStartOfMonth = (date) => {
        const d = new Date(date);
        d.setDate(1);
        d.setHours(0, 0, 0, 0);
        return d;
    };

    const navigateDate = (unit, amount) => {
        const newDate = new Date(currentDate);
        if (unit === 'day') {
            newDate.setDate(newDate.getDate() + amount);
        } else if (unit === 'week') {
            newDate.setDate(newDate.getDate() + (amount * 7));
        } else if (unit === 'month') {
            newDate.setMonth(newDate.getMonth() + amount);
        }
        setCurrentDate(newDate);
    };

    const renderHeader = () => {
        let title = '';
        if (view === 'day') {
            title = currentDate.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
        } else if (view === 'week') {
            const start = getStartOfWeek(currentDate);
            const end = new Date(start);
            end.setDate(start.getDate() + 6);
            title = `${start.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - ${end.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`;
        } else { // month
            title = currentDate.toLocaleDateString('en-US', { year: 'numeric', month: 'long' });
        }

        return (
            <div className="flex justify-between items-center mb-6">
                <button onClick={() => navigateDate(view, -1)} className="p-2 rounded-full hover:bg-gray-200">
                    <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path></svg>
                </button>
                <h2 className="text-2xl font-bold text-gray-800">{title}</h2>
                <button onClick={() => navigateDate(view, 1)} className="p-2 rounded-full hover:bg-gray-200">
                    <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path></svg>
                </button>
            </div>
        );
    };

    return (
        <div className="w-full h-full bg-white rounded-none p-8"> {/* Consistent padding */}
            <div className="flex justify-between items-center mb-6"> {/* Adjusted for Today button */}
                <div className="flex space-x-2">
                    <button
                        onClick={() => setView('day')}
                        className={`px-4 py-2 rounded-lg font-semibold ${view === 'day' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
                    >
                        Day
                    </button>
                    <button
                        onClick={() => setView('week')}
                        className={`px-4 py-2 rounded-lg font-semibold ${view === 'week' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
                    >
                        Week
                    </button>
                    <button
                        onClick={() => setView('month')}
                        className={`px-4 py-2 rounded-lg font-semibold ${view === 'month' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
                    >
                        Month
                    </button>
                </div>
                {/* Moved Today button to top right with icon */}
                <button
                    onClick={() => {
                        setCurrentDate(new Date());
                        setView('day'); // Always go to day view for today
                    }}
                    className="px-4 py-2 rounded-lg font-semibold bg-gray-200 text-gray-700 hover:bg-gray-300 flex items-center space-x-2"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                    </svg>
                    <span>Today</span>
                </button>
            </div>

            {renderHeader()}

            {view === 'month' && (
                <MonthView
                    currentDate={currentDate}
                    tasks={tasks} // Pass all tasks to MonthView
                    onSelectTask={onSelectTask}
                    onDayClick={(dateString) => {
                        setCurrentDate(new Date(dateString));
                        setView('day');
                    }}
                />
            )}
            {view === 'week' && (
                <WeekView
                    currentDate={currentDate}
                    tasks={tasks} // Pass all tasks to WeekView
                    onSelectTask={onSelectTask}
                    getTasksForDate={getPendingTasksForDate} // Use pending tasks filter
                    getStartOfWeek={getStartOfWeek}
                />
            )}
            {view === 'day' && (
                <DayView
                    currentDate={currentDate}
                    tasks={tasks} // Pass all tasks to DayView
                    onSelectTask={onSelectTask}
                    getTasksForDate={getPendingTasksForDate} // Use pending tasks filter
                />
            )}
        </div>
    );
};

// MonthView Component
const MonthView = ({ currentDate, tasks, onSelectTask, onDayClick }) => {
    const startOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    const endOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
    const numDaysInMonth = endOfMonth.getDate();

    const firstDayOfWeek = startOfMonth.getDay(); // 0 for Sunday, 1 for Monday

    const days = [];
    // Fill leading empty days
    for (let i = 0; i < firstDayOfWeek; i++) {
        days.push(null);
    }
    // Fill days of the month
    for (let i = 1; i <= numDaysInMonth; i++) {
        days.push(i);
    }

    const todayString = new Date().toISOString().split('T')[0];

    // Function to get only pending tasks for a specific day
    const getPendingTasksForDay = (year, month, day) => {
        const dateString = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
        return tasks.filter(task => task.dueDate === dateString && !task.completed);
    };

    return (
        <div className="grid grid-cols-7 gap-1 h-full">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                <div key={day} className="text-center font-semibold text-gray-600 py-2 border-b border-gray-200">
                    {day}
                </div>
            ))}
            {days.map((day, index) => {
                const isCurrentMonthDay = day !== null;
                const date = isCurrentMonthDay ? new Date(currentDate.getFullYear(), currentDate.getMonth(), day) : null;
                const dateString = date ? date.toISOString().split('T')[0] : null;
                const dayTasks = isCurrentMonthDay ? getPendingTasksForDay(date.getFullYear(), date.getMonth(), date.getDate()) : []; // Use getPendingTasksForDay
                const isToday = dateString === todayString;

                return (
                    <div
                        key={index}
                        className={`border border-gray-200 p-2 text-sm relative h-28 flex flex-col ${isCurrentMonthDay ? 'bg-white' : 'bg-gray-50 text-gray-400'} ${isToday ? 'border-blue-500 ring-2 ring-blue-300' : ''} ${dayTasks.length > 0 ? 'bg-blue-50' : ''}`}
                        onClick={() => isCurrentMonthDay && onDayClick(dateString)}
                    >
                        <span className={`font-bold ${isToday ? 'text-blue-700' : 'text-gray-800'}`}>{day}</span>
                        <div className="flex-1 overflow-y-auto mt-1 space-y-0.5">
                            {dayTasks.slice(0, 2).map(task => ( // Show first 2 tasks
                                <div key={task.id} className="text-xs text-blue-700 bg-blue-100 rounded-sm px-1 truncate" onClick={(e) => { e.stopPropagation(); onSelectTask(task); }}>
                                    {task.dueTime ? `${task.dueTime} - ` : ''}{task.title} {/* Display time in 24hr format */}
                                </div>
                            ))}
                            {dayTasks.length > 2 && (
                                <div className="text-xs text-gray-500 mt-1">+{dayTasks.length - 2} more</div>
                            )}
                        </div>
                        {/* New: Blue dot indicator for days with tasks */}
                        {dayTasks.length > 0 && (
                            <div className="absolute bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-blue-500 rounded-full"></div>
                        )}
                    </div>
                );
            })}
        </div>
    );
};

// WeekView Component
const WeekView = ({ currentDate, tasks, onSelectTask, getTasksForDate, getStartOfWeek }) => {
    const startOfWeek = getStartOfWeek(currentDate);
    const daysOfWeek = [];
    for (let i = 0; i < 7; i++) {
        const date = new Date(startOfWeek);
        date.setDate(startOfWeek.getDate() + i);
        daysOfWeek.push(date);
    }

    return (
        <div className="grid grid-cols-7 gap-1 h-full">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                <div key={day} className="text-center font-semibold text-gray-600 py-2 border-b border-gray-200">
                    {day}
                </div>
            ))}
            {daysOfWeek.map(date => {
                const dateString = date.toISOString().split('T')[0];
                const dayTasks = getTasksForDate(dateString); // getTasksForDate already filters pending and sorts by time
                const isToday = dateString === new Date().toISOString().split('T')[0];

                return (
                    <div key={dateString} className={`border border-gray-200 p-2 text-sm relative h-full flex flex-col ${isToday ? 'bg-blue-50 border-blue-500 ring-2 ring-blue-300' : (dayTasks.length > 0 ? 'bg-blue-50' : 'bg-white')}`}> {/* Added bg-blue-50 for days with tasks */}
                        <div className={`text-center font-semibold mb-2 ${isToday ? 'text-blue-700' : 'text-gray-800'}`}>
                            {date.toLocaleDateString('en-US', { weekday: 'short', day: 'numeric' })}
                        </div>
                        <div className="flex-1 overflow-y-auto space-y-1">
                            {dayTasks.map(task => (
                                <div key={task.id} className="text-xs text-blue-700 bg-blue-100 rounded-sm px-1 py-0.5 truncate" onClick={() => onSelectTask(task)}>
                                    {task.dueTime ? `${task.dueTime} - ` : ''}{task.title}
                                </div>
                            ))}
                            {dayTasks.length === 0 && (
                                <p className="text-xs text-gray-400 text-center">No tasks</p>
                            )}
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

// DayView Component
const DayView = ({ currentDate, tasks, onSelectTask, getTasksForDate }) => {
    const dateString = currentDate.toISOString().split('T')[0];
    const dayTasks = getTasksForDate(dateString); // getTasksForDate already filters pending and sorts by time

    return (
        <div className="h-full bg-white p-4 overflow-y-auto">
            {dayTasks.length === 0 ? (
                <p className="text-center text-gray-500 py-8">No tasks for this day.</p>
            ) : (
                <ul className="space-y-3">
                    {dayTasks.map(task => (
                        <li
                            key={task.id}
                            className="flex items-center p-3 border border-gray-200 rounded-lg bg-gray-50 hover:bg-gray-100 cursor-pointer"
                            onClick={() => onSelectTask(task)}
                        >
                            <span className="font-semibold text-gray-700 mr-3">
                                {task.dueTime || 'All Day'}
                            </span>
                            <span className={`flex-1 text-gray-800 ${task.completed ? 'line-through text-gray-500' : ''}`}>
                                {task.title}
                            </span>
                            {task.list && (
                                <span className="ml-2 px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
                                    {task.list}
                                </span>
                            )}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default Calendar;
