import { useState, useEffect, useRef } from 'react';
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from 'framer-motion';
import { 
  MessageCircle, 
  Edit3, 
  Trash2, 
  Save, 
  Download, 
  Clock, 
  Tag,
  Search,
  X,
  FileText,
  ChevronRight,
  ChevronDown,
  Link as LinkIcon
} from 'lucide-react';
import useAppStore from '@/lib/store/useAppStore';

function VideoNotes({ isOpen, onClose }) {
  const {
    currentVideo,
    currentTime = 0,
    videoNotes = {},
    addVideoNote,
    updateVideoNote,
    deleteVideoNote,
    exportNotesToPDF
  } = useAppStore();

  const [newNote, setNewNote] = useState('');
  const [newNoteTag, setNewNoteTag] = useState('');
  const [editingNote, setEditingNote] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTag, setSelectedTag] = useState('all');
  const [isMinimized, setIsMinimized] = useState(false);
  const textareaRef = useRef(null);

  // Gather all notes from all videos
  const allNotes = Object.entries(videoNotes)
    .flatMap(([videoId, notes]) =>
      (notes || []).map(note => ({
        ...note,
        videoId
      }))
    );

  // Filter notes by search and tag
  const filteredNotes = allNotes.filter(note => {
    const matchesSearch =
      !searchQuery ||
      note.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      note.tags?.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesTag =
      selectedTag === 'all' ||
      (note.tags && note.tags.includes(selectedTag));
    return matchesSearch && matchesTag;
  });

  // All tags from all notes
  const allTags = [...new Set(allNotes.flatMap(note => note.tags || []))];

  // Helper to get video info by id (always prefer note.videoTitle if available)
  const getVideoInfo = (note) => ({
    title: note.videoTitle || `Video ${note.videoId}`,
    url: note.videoUrl || ''
  });

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  };

  const handleAddNote = () => {
    if (!newNote.trim()) return;

    const videoId = currentVideo?.id || 'general';
    const videoUrl = currentVideo?.url || '';
    const videoTitle = currentVideo?.title || 'General Note';

    const note = {
      id: Date.now(),
      content: newNote.trim(),
      timestamp: Math.floor(currentTime),
      tags: newNoteTag ? newNoteTag.split(',').map(tag => tag.trim()) : [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      videoUrl,
      videoTitle
    };

    addVideoNote(videoId, note);
    setNewNote('');
    setNewNoteTag('');
  };

  const handleEditNote = (note) => {
    setEditingNote(note);
    setNewNote(note.content);
    setNewNoteTag(note.tags ? note.tags.join(', ') : '');
  };

  const handleUpdateNote = () => {
    if (!editingNote || !newNote.trim()) return;

    const updatedNote = {
      ...editingNote,
      content: newNote.trim(),
      tags: newNoteTag ? newNoteTag.split(',').map(tag => tag.trim()) : [],
      updatedAt: new Date().toISOString()
    };

    updateVideoNote(editingNote.videoId, updatedNote);
    setEditingNote(null);
    setNewNote('');
    setNewNoteTag('');
  };

  const handleDeleteNote = (noteId, videoId) => {
    deleteVideoNote(videoId, noteId);
  };

  const handleExportPDF = () => {
    if (exportNotesToPDF) {
      exportNotesToPDF();
    }
  };

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = textareaRef.current.scrollHeight + 'px';
    }
  }, [newNote]);

  // Redirect to player with videoId (implement your own navigation logic)
  const handleGoToVideo = (videoId) => {
    // Example: window.location.href = `/player/${videoId}`;
    window.dispatchEvent(new CustomEvent('goto-video', { detail: { videoId } }));
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ y: 40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 40, opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center"
        >
          <div className="fixed inset-0 bg-black/50" onClick={onClose} />
          <div className="relative bg-transparent flex items-center justify-center w-full h-full">
            <div className="glass-card w-full max-w-xl mx-auto my-12 rounded-xl shadow-2xl border border-white/10 flex flex-col max-h-[90vh]">
              {/* Header */}
              <div className="p-4 border-b border-white/10">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <MessageCircle size={20} className="text-purple-400" />
                    <h3 className="text-white font-semibold">Video Notes</h3>
                  </div>
                  <div className="flex items-center gap-2">
                    <motion.button
                      onClick={() => setIsMinimized(!isMinimized)}
                      className="p-1 hover:bg-white/10 rounded transition-colors"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      type="button"
                    >
                      {isMinimized ? (
                        <ChevronDown size={16} className="text-gray-400" />
                      ) : (
                        <ChevronRight size={16} className="text-gray-400" />
                      )}
                    </motion.button>
                    <motion.button
                      onClick={onClose}
                      className="p-1 hover:bg-white/10 rounded transition-colors"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      type="button"
                    >
                      <X size={16} className="text-gray-400" />
                    </motion.button>
                  </div>
                </div>
                <p className="text-gray-400 text-sm truncate">All video notes</p>
                <p className="text-gray-500 text-xs">{allNotes.length} notes</p>
              </div>

              {!isMinimized && (
                <>
                  {/* Search and Filter */}
                  <div className="p-4 border-b border-white/10 space-y-3">
                    <div className="relative">
                      <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                      <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search notes..."
                        className="w-full pl-10 pr-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white text-sm placeholder-gray-400 focus:outline-none focus:border-purple-500"
                      />
                    </div>
                    {allTags.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        <button
                          onClick={() => setSelectedTag('all')}
                          className={`px-2 py-1 rounded text-xs transition-colors ${
                            selectedTag === 'all'
                              ? 'bg-purple-600 text-white'
                              : 'bg-white/10 text-gray-300 hover:bg-white/20'
                          }`}
                        >
                          All
                        </button>
                        {allTags.map(tag => (
                          <button
                            key={tag}
                            onClick={() => setSelectedTag(tag)}
                            className={`px-2 py-1 rounded text-xs transition-colors ${
                              selectedTag === tag
                                ? 'bg-purple-600 text-white'
                                : 'bg-white/10 text-gray-300 hover:bg-white/20'
                            }`}
                          >
                            {tag}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                  {/* Add Note Form */}
                  <div className="p-4 border-b border-white/10">
                    <div className="space-y-3">
                      <textarea
                        ref={textareaRef}
                        value={newNote}
                        onChange={(e) => setNewNote(e.target.value)}
                        placeholder="Add a note (linked to current video if selected)..."
                        className="w-full p-3 bg-white/10 border border-white/20 rounded-lg text-white text-sm placeholder-gray-400 focus:outline-none focus:border-purple-500 resize-none min-h-[60px]"
                        rows={1}
                      />
                      <input
                        type="text"
                        value={newNoteTag}
                        onChange={(e) => setNewNoteTag(e.target.value)}
                        placeholder="Tags (comma separated)"
                        className="w-full p-2 bg-white/10 border border-white/20 rounded-lg text-white text-sm placeholder-gray-400 focus:outline-none focus:border-purple-500"
                      />
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-400">
                          {currentVideo?.id
                            ? <>@ {formatTime(currentTime)} <span className="ml-2 inline-flex items-center gap-1"><LinkIcon size={12} />{currentVideo.title}</span></>
                            : '@ General'}
                        </span>
                        <motion.button
                          onClick={editingNote ? handleUpdateNote : handleAddNote}
                          disabled={!newNote.trim()}
                          className="flex items-center gap-1 px-3 py-1 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white rounded-lg text-sm transition-colors"
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <Save size={14} />
                          {editingNote ? 'Update' : 'Add'}
                        </motion.button>
                      </div>
                    </div>
                  </div>
                  {/* Notes List */}
                  <div className="flex-1 overflow-y-auto">
                    {filteredNotes.length === 0 ? (
                      <div className="p-4 text-center">
                        <FileText size={32} className="text-gray-600 mx-auto mb-2" />
                        <p className="text-gray-400 text-sm">
                          {allNotes.length === 0 ? 'No notes yet' : 'No matching notes'}
                        </p>
                      </div>
                    ) : (
                      <div className="p-4 space-y-3">
                        {filteredNotes.map((note, index) => {
                          const videoInfo = getVideoInfo(note);
                          return (
                            <motion.div
                              key={note.id}
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: index * 0.1 }}
                              className="bg-white/5 p-3 rounded-lg hover:bg-white/10 transition-colors group"
                            >
                              <div className="flex items-start justify-between mb-2">
                                <div className="flex items-center gap-2">
                                  <span className="flex items-center gap-1 text-purple-400 text-xs font-medium">
                                    <Clock size={12} />
                                    {note.timestamp ? formatTime(note.timestamp) : '--:--'}
                                  </span>
                                  {note.videoId && (
                                    <button
                                      type="button"
                                      className="flex items-center gap-1 text-blue-400 text-xs ml-2 hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 rounded px-1"
                                      onClick={() => handleGoToVideo(note.videoId)}
                                      title={videoInfo.title}
                                      tabIndex={0}
                                    >
                                      <LinkIcon size={12} />
                                      <span className="truncate max-w-[120px] outline-none">{videoInfo.title}</span>
                                    </button>
                                  )}
                                </div>
                                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                  <button
                                    onClick={() => handleEditNote(note)}
                                    className="p-1 hover:bg-white/20 rounded transition-colors"
                                  >
                                    <Edit3 size={12} className="text-gray-400" />
                                  </button>
                                  <button
                                    onClick={() => handleDeleteNote(note.id, note.videoId)}
                                    className="p-1 hover:bg-red-500/20 rounded transition-colors"
                                  >
                                    <Trash2 size={12} className="text-red-400" />
                                  </button>
                                </div>
                              </div>
                              <p className="text-white text-sm mb-2">{note.content}</p>
                              {note.tags && note.tags.length > 0 && (
                                <div className="flex flex-wrap gap-1">
                                  {note.tags.map(tag => (
                                    <span
                                      key={tag}
                                      className="px-2 py-1 bg-white/10 text-gray-300 rounded text-xs flex items-center gap-1"
                                    >
                                      <Tag size={10} />
                                      {tag}
                                    </span>
                                  ))}
                                </div>
                              )}
                            </motion.div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                  {/* Footer Actions */}
                  {allNotes.length > 0 && (
                    <div className="p-4 border-t border-white/10">
                      <motion.button
                        onClick={handleExportPDF}
                        className="w-full flex items-center justify-center gap-2 p-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <Download size={16} />
                        Export Notes as PDF
                      </motion.button>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default VideoNotes;
