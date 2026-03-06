import React, { useState, useEffect } from 'react'
import { AxiosCall } from '../services/AxiosCall';

const Meetings = () => {
    const [transcripts, setTranscripts] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [selectedTranscript, setSelectedTranscript] = useState(null);
    const [transcriptItems, setTranscriptItems] = useState(null);
    const [itemsLoading, setItemsLoading] = useState(false);

    useEffect(() => {
        fetchTranscripts();
    }, []);

    const fetchTranscripts = async () => {
        setLoading(true);
        setError("");
        try {
            const result = await AxiosCall('GET', 'api/list/', {}, false, false);
            if (result.status === 200) {
                setTranscripts(result.data);
            } else {
                setError("Failed to load transcripts");
            }
        } catch (error) {
            setError("Error loading transcripts");
            console.log(error);
        } finally {
            setLoading(false);
        }
    };

    const fetchTranscriptItems = async (transcriptId) => {
        setItemsLoading(true);
        try {
            const result = await AxiosCall('GET', `api/transcript/${transcriptId}/items/`, {}, false, false);
            if (result.status === 200) {
                setTranscriptItems(result.data);
                setSelectedTranscript(transcriptId);
            }
        } catch (error) {
            console.log(error);
            setError("Failed to load transcript items");
        } finally {
            setItemsLoading(false);
        }
    };

    const handleExport = async (transcriptId) => {
        try {
            const result = await AxiosCall('GET', `api/transcript/${transcriptId}/items/export/?export_format=csv`, {}, false, false);
            if (result.status === 200) {
                // Create a blob and download
                const blob = new Blob([result.data], { type: 'text/csv' });
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `transcript_${transcriptId}_items.csv`;
                document.body.appendChild(a);
                a.click();
                window.URL.revokeObjectURL(url);
                document.body.removeChild(a);
            }
        } catch (error) {
            console.log(error);
            setError("Failed to export items");
        }
    };

    const handleDelete = async (transcriptId) => {
        if (!window.confirm("Are you sure you want to delete this transcript? This action cannot be undone.")) {
            return;
        }
        try {
            const result = await AxiosCall('DELETE', `api/transcript/${transcriptId}/delete/`, {}, false, false);
            if (result.status === 200) {
                setError("");
                setSelectedTranscript(null);
                setTranscriptItems(null);
                // Refresh the transcripts list
                fetchTranscripts();
            }
        } catch (error) {
            console.log(error);
            setError("Failed to delete transcript");
        }
    };

    if (loading) {
        return (
            <div className='space-y-6'>
                <h1 className="text-2xl font-semibold">Meetings</h1>
                <p className="text-slate-400">Loading meetings...</p>
            </div>
        );
    }

    const allTranscripts = [];
    Object.keys(transcripts).forEach(project => {
        transcripts[project].forEach(t => {
            allTranscripts.push({ ...t, project });
        });
    });
    // Sort by latest upload first
    allTranscripts.sort((a, b) => new Date(b.uploaded_at) - new Date(a.uploaded_at));

    return (
        <div className='space-y-6'>
            <div>
                <h1 className="text-2xl font-semibold">Meetings</h1>
                <p className="text-slate-400">View and manage your meeting transcripts</p>
                <p className="text-sm text-slate-500 mt-2">Total Transcripts: <span className="font-semibold text-slate-300">{allTranscripts.length}</span></p>
            </div>

            {error && <p className='text-red-500'>{error}</p>}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Transcripts List */}
                <div className="lg:col-span-1">
                    <h2 className="text-lg font-semibold mb-4">Transcripts <span className="text-sm text-slate-400">({allTranscripts.length})</span></h2>
                    <div className="space-y-2 max-h-96 overflow-y-auto">
                        {allTranscripts.length > 0 ? (
                            allTranscripts.map((transcript, index) => (
                                <div
                                    key={transcript.id}
                                    onClick={() => fetchTranscriptItems(transcript.id)}
                                    className={`p-3 rounded cursor-pointer transition ${selectedTranscript === transcript.id
                                            ? 'bg-blue-600'
                                            : 'bg-slate-700 hover:bg-slate-600'
                                        }`}
                                >
                                    <div className="flex items-start gap-2">
                                        <span className="text-xs font-bold text-slate-400 min-w-fit">{index + 1}.</span>
                                        <div className="flex-1 min-w-0">
                                            <p className="font-semibold text-sm truncate">{transcript.file_name}</p>
                                            <p className="text-xs text-slate-400">{transcript.project}</p>
                                            <p className="text-xs text-slate-400">
                                                {new Date(transcript.uploaded_at).toLocaleDateString()}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p className="text-slate-400">No transcripts found</p>
                        )}
                    </div>
                </div>

                {/* Transcript Details */}
                <div className="lg:col-span-2">
                    {selectedTranscript ? (
                        <>
                            {itemsLoading ? (
                                <p className="text-slate-400">Loading items...</p>
                            ) : transcriptItems ? (
                                <div className="space-y-6">
                                    {/* Transcript Header */}
                                    <div>
                                        <div className="flex justify-between items-start mb-4">
                                            <div>
                                                <h2 className="text-xl font-semibold mb-2">
                                                    {allTranscripts.find(t => t.id === selectedTranscript)?.file_name}
                                                </h2>
                                                <p className="text-slate-400">
                                                    Project: {allTranscripts.find(t => t.id === selectedTranscript)?.project}
                                                </p>
                                            </div>
                                            <div className="flex gap-2">
                                                <button
                                                    onClick={() => handleExport(selectedTranscript)}
                                                    className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded text-sm text-white"
                                                >
                                                    Export CSV
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(selectedTranscript)}
                                                    className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded text-sm text-white"
                                                >
                                                    Delete
                                                </button>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Decisions Tab */}
                                    <div>
                                        <h3 className="text-lg font-semibold mb-3">Decisions ({transcriptItems.decisions.length})</h3>
                                        <div className="space-y-2">
                                            {transcriptItems.decisions.length > 0 ? (
                                                transcriptItems.decisions.map((decision) => (
                                                    <div key={decision.id} className="bg-slate-700 p-3 rounded">
                                                        <p className="text-sm">{decision.text}</p>
                                                    </div>
                                                ))
                                            ) : (
                                                <p className="text-slate-400">No decisions found</p>
                                            )}
                                        </div>
                                    </div>

                                    {/* Action Items Tab */}
                                    <div>
                                        <h3 className="text-lg font-semibold mb-3">Action Items ({transcriptItems.action_items.length})</h3>
                                        <div className="overflow-x-auto">
                                            <table className="w-full border-collapse border border-slate-700">
                                                <thead className="bg-slate-800">
                                                    <tr>
                                                        <th className="border border-slate-700 px-4 py-2 text-left">Task</th>
                                                        <th className="border border-slate-700 px-4 py-2 text-left">Responsible</th>
                                                        <th className="border border-slate-700 px-4 py-2 text-left">Due Date</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {transcriptItems.action_items.length > 0 ? (
                                                        transcriptItems.action_items.map((item) => (
                                                            <tr key={item.id} className="hover:bg-slate-700">
                                                                <td className="border border-slate-700 px-4 py-2">{item.text}</td>
                                                                <td className="border border-slate-700 px-4 py-2">{item.responsible || "N/A"}</td>
                                                                <td className="border border-slate-700 px-4 py-2">{item.due_date || "N/A"}</td>
                                                            </tr>
                                                        ))
                                                    ) : (
                                                        <tr>
                                                            <td colSpan="3" className="border border-slate-700 px-4 py-2 text-center text-slate-400">
                                                                No action items found
                                                            </td>
                                                        </tr>
                                                    )}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                </div>
                            ) : null}
                        </>
                    ) : (
                        <div className="text-slate-400 text-center py-8">
                            Select a transcript to view details
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default Meetings