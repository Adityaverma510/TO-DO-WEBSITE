import React, { useState, useEffect } from 'react';

// Utility function to generate a random pastel-like background color
const getRandomColor = () => {
    const colors = [
        'bg-yellow-100', // Light yellow
        'bg-blue-100',   // Light blue
        'bg-green-100',  // Light green
        'bg-red-100',    // Light red/pink
        'bg-purple-100', // Light purple
        'bg-orange-100', // Light orange
        'bg-teal-100',   // Light teal
    ];
    return colors[Math.floor(Math.random() * colors.length)];
};

// StickyWall Component (Main Application)
const StickyWall = () => {
    const [notes, setNotes] = useState(() => {
        const savedNotes = localStorage.getItem('sticky-notes-data');
        return savedNotes ? JSON.parse(savedNotes) : [];
    });
    const [selectedNote, setSelectedNote] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Persist notes to localStorage whenever they change
    useEffect(() => {
        localStorage.setItem('sticky-notes-data', JSON.stringify(notes));
    }, [notes]);

    // Handle adding a new note
    const handleAddNote = () => {
        setSelectedNote(null); // Clear selected note for new entry
        setIsModalOpen(true);
    };

    // Handle editing an existing note
    const handleEditNote = (note) => {
        setSelectedNote(note);
        setIsModalOpen(true);
    };

    // Handle saving a note (either new or edited)
    const handleSaveNote = (updatedNote) => {
        if (updatedNote.id) {
            // Editing existing note
            setNotes(prevNotes =>
                prevNotes.map(note =>
                    note.id === updatedNote.id ? { ...updatedNote } : note
                )
            );
        } else {
            // Adding new note
            const newNote = {
                id: Date.now().toString(),
                ...updatedNote,
                color: getRandomColor(), // Assign random color to new notes
            };
            setNotes(prevNotes => [...prevNotes, newNote]);
        }
        setIsModalOpen(false);
        setSelectedNote(null);
    };

    // Handle deleting a note
    const handleDeleteNote = (idToDelete) => {
        if (window.confirm("Are you sure you want to delete this note?")) {
            setNotes(prevNotes => prevNotes.filter(note => note.id !== idToDelete));
            setIsModalOpen(false); // Close modal if the deleted note was open
            setSelectedNote(null);
        }
    };

    // Handle closing the modal
    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedNote(null);
    };

    return (
        <div className="min-h-screen bg-gray-100 font-inter">
            <div className="w-full h-full bg-white rounded-none"> {/* Matches dashboard styling */}
                <h1 className="text-4xl font-bold text-gray-800 mb-6 p-8">
                    Sticky Wall
                </h1>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 p-8"> {/* Grid layout for notes */}
                    {notes.map(note => (
                        <StickyNoteCard
                            key={note.id}
                            note={note}
                            onEdit={handleEditNote}
                            onDelete={handleDeleteNote}
                        />
                    ))}
                    <AddNoteCard onAdd={handleAddNote} />
                </div>
            </div>

            {/* Note Add/Edit Modal */}
            <NoteModal
                note={selectedNote}
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                onSave={handleSaveNote}
            />
        </div>
    );
};

// StickyNoteCard Component
const StickyNoteCard = ({ note, onEdit, onDelete }) => {
    const handleDeleteClick = (e) => {
        e.stopPropagation(); // Prevent opening the note when clicking delete
        onDelete(note.id);
    };

    return (
        <div
            className={`relative p-6 rounded-lg cursor-pointer transition-all duration-200 hover:shadow-lg ${note.color}`}
            onClick={() => onEdit(note)}
        >
            <h3 className="text-xl font-semibold mb-2 text-gray-800">{note.title}</h3>
            <p className="text-gray-700 whitespace-pre-wrap">{note.content}</p> {/* whitespace-pre-wrap to preserve newlines */}

            {/* Delete Button */}
            <button
                onClick={handleDeleteClick}
                className="absolute top-2 right-2 text-gray-500 hover:text-red-600 focus:outline-none p-1 rounded-full bg-white bg-opacity-50 hover:bg-opacity-75"
                aria-label="Delete note"
            >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                </svg>
            </button>
        </div>
    );
};

// AddNoteCard Component
const AddNoteCard = ({ onAdd }) => {
    return (
        <div
            className="flex items-center justify-center p-6 rounded-lg border-2 border-dashed border-gray-300 text-gray-400 cursor-pointer h-48 sm:h-auto hover:border-blue-400 hover:text-blue-600 transition-all duration-200"
            onClick={onAdd}
        >
            <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
            </svg>
        </div>
    );
};

// NoteModal Component (for adding/editing notes)
const NoteModal = ({ note, isOpen, onClose, onSave }) => {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');

    useEffect(() => {
        if (note) {
            setTitle(note.title);
            setContent(note.content);
        } else {
            setTitle('');
            setContent('');
        }
    }, [note]);

    if (!isOpen) {
        return null;
    }

    const handleSaveClick = () => {
        if (!title.trim() && !content.trim()) {
            // Using a custom message box instead of alert()
            alert("Note cannot be empty!"); // For simplicity, using alert for now as custom modal is complex
            return;
        }
        onSave({ id: note ? note.id : null, title: title.trim(), content: content.trim() });
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50 p-4">
            <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md relative flex flex-col max-h-[90vh]">
                <div className="flex items-center justify-between mb-6 border-b pb-4">
                    <h2 className="text-2xl font-bold text-gray-800">{note ? 'Edit Note' : 'Add New Note'}</h2>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-800 focus:outline-none">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                        </svg>
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto pr-2">
                    <div className="mb-4">
                        <label htmlFor="note-title" className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                        <input
                            type="text"
                            id="note-title"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                            placeholder="Note title"
                        />
                    </div>

                    <div className="mb-6">
                        <label htmlFor="note-content" className="block text-sm font-medium text-gray-700 mb-1">Content</label>
                        <textarea
                            id="note-content"
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            rows="6"
                            className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                            placeholder="Write your note here..."
                        ></textarea>
                    </div>
                </div>

                <div className="mt-auto flex justify-end pt-4 border-t border-gray-200 space-x-3">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 bg-gray-200 text-gray-700 font-semibold rounded-lg hover:bg-gray-300 transition duration-200"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSaveClick}
                        className="px-4 py-2 bg-blue-500 text-white font-semibold rounded-lg shadow-md hover:bg-blue-600 transition duration-200"
                    >
                        Save Note
                    </button>
                </div>
            </div>
        </div>
    );
};

export default StickyWall;
