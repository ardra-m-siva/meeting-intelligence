import React, { useState, useEffect, useRef } from 'react'
import { AxiosCall } from '../services/AxiosCall';

const Chat = () => {
    const [messages, setMessages] = useState([
        {
            id: 'welcome',
            type: 'assistant',
            content: "Hello! I'm your meeting intelligence chatbot. I can answer questions across all your meeting transcripts. You can ask me about decisions, action items, specific speakers, or anything else mentioned in your meetings. What would you like to know?",
            sources: []
        }
    ]);
    const [inputValue, setInputValue] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [selectedProject, setSelectedProject] = useState('');
    const [projects, setProjects] = useState([]);
    const messagesEndRef = useRef(null);

    // Fetch available projects on mount
    useEffect(() => {
        fetchProjects();
    }, []);

    // Auto-scroll to bottom
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const fetchProjects = async () => {
        try {
            const result = await AxiosCall('GET', 'api/list/', null, false, false);
            if (result.status === 200) {
                const projectNames = Object.keys(result.data);
                setProjects(projectNames);
            }
        } catch (error) {
            console.log('Error fetching projects:', error);
        }
    };

    const handleSendMessage = async (e) => {
        e.preventDefault();
        
        if (!inputValue.trim()) {
            return;
        }

        const userMessage = {
            id: `user-${Date.now()}`,
            type: 'user',
            content: inputValue,
            sources: []
        };

        setMessages(prev => [...prev, userMessage]);
        setInputValue('');
        setLoading(true);
        setError('');

        try {
            const queryData = {
                query: inputValue,
                ...(selectedProject && { project: selectedProject })
            };

            const result = await AxiosCall('POST', 'api/query/', queryData, true, false);

            if (result.status === 200) {
                const assistantMessage = {
                    id: `assistant-${Date.now()}`,
                    type: 'assistant',
                    content: result.data.answer,
                    sources: result.data.sources || [],
                    query: result.data.query
                };
                setMessages(prev => [...prev, assistantMessage]);
            } else {
                setError('Failed to get response. Please try again.');
            }
        } catch (error) {
            console.log('Error sending message:', error);
            setError('Error communicating with the chatbot. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className='flex flex-col w-full h-full bg-slate-900 rounded-lg overflow-hidden border border-slate-700'>
            {/* Header */}
            <div className='bg-slate-800 p-4 border-b border-slate-700'>
                <h1 className='text-2xl font-semibold mb-2'>Meeting Intelligence Chatbot</h1>
                <div className='flex items-center gap-4'>
                    <label className='flex items-center gap-2'>
                        <span className='text-slate-400 text-sm'>Filter by Project:</span>
                        <select
                            value={selectedProject}
                            onChange={(e) => setSelectedProject(e.target.value)}
                            className='bg-slate-700 text-white px-3 py-1 rounded text-sm border border-slate-600'
                        >
                            <option value="">All Projects</option>
                            {projects.map((project) => (
                                <option key={project} value={project}>
                                    {project}
                                </option>
                            ))}
                        </select>
                    </label>
                </div>
            </div>

            {/* Messages Container */}
            <div className='flex-1 overflow-y-auto p-6 space-y-4'>
                {messages.map((message) => (
                    <div
                        key={message.id}
                        className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                        <div
                            className={`max-w-2xl rounded-lg p-4 ${
                                message.type === 'user'
                                    ? 'bg-blue-600 text-white'
                                    : 'bg-slate-800 text-slate-100 border border-slate-700'
                            }`}
                        >
                            {/* Message Content */}
                            <p className='text-sm leading-relaxed whitespace-pre-wrap'>
                                {message.content}
                            </p>

                            {/* Sources */}
                            {message.sources && message.sources.length > 0 && (
                                <div className='mt-3 pt-3 border-t border-slate-600'>
                                    <p className='text-xs font-semibold text-slate-400 mb-2'>Sources:</p>
                                    <div className='space-y-1'>
                                        {message.sources.map((source, idx) => (
                                            <div key={idx} className='text-xs text-slate-300 bg-slate-700 p-2 rounded'>
                                                <p className='font-semibold'>{source.file_name}</p>
                                                <p className='text-slate-400'>
                                                    Project: {source.project} | Date: {source.meeting_date || 'N/A'}
                                                </p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                ))}

                {loading && (
                    <div className='flex justify-start'>
                        <div className='bg-slate-800 text-slate-100 border border-slate-700 rounded-lg p-4'>
                            <div className='flex items-center gap-2'>
                                <div className='animate-spin rounded-full h-4 w-4 border-b border-r border-blue-500'></div>
                                <span className='text-sm'>Analyzing transcripts...</span>
                            </div>
                        </div>
                    </div>
                )}

                {error && (
                    <div className='flex justify-start'>
                        <div className='bg-red-900 text-red-100 border border-red-700 rounded-lg p-4 max-w-2xl'>
                            <p className='text-sm'>{error}</p>
                        </div>
                    </div>
                )}

                <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className='bg-slate-800 border-t border-slate-700 p-4'>
                <form onSubmit={handleSendMessage} className='flex gap-3'>
                    <input
                        type='text'
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        placeholder='Ask a question about your meetings...'
                        disabled={loading}
                        className='flex-1 bg-slate-700 text-white px-4 py-2 rounded border border-slate-600 focus:border-blue-500 focus:outline-none disabled:opacity-50'
                    />
                    <button
                        type='submit'
                        disabled={loading || !inputValue.trim()}
                        className='bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white px-6 py-2 rounded font-medium transition'
                    >
                        Send
                    </button>
                </form>
                <p className='text-xs text-slate-400 mt-2'>
                    💡 Try asking: "What were the main decisions?" or "What is John responsible for?"
                </p>
            </div>
        </div>
    );
};

export default Chat;
