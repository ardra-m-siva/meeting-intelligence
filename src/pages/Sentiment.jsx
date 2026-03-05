import React, { useState, useEffect } from 'react'
import { AxiosCall } from '../services/AxiosCall';

const Sentiment = () => {
    const [transcripts, setTranscripts] = useState({});
    const [selectedTranscript, setSelectedTranscript] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

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

    if (loading) {
        return (
            <div className='space-y-6'>
                <h1 className="text-2xl font-semibold">Sentiment Analysis</h1>
                <p className="text-slate-400">Loading transcripts...</p>
            </div>
        );
    }

    const allTranscripts = [];
    Object.keys(transcripts).forEach(project => {
        transcripts[project].forEach(t => {
            allTranscripts.push({ ...t, project });
        });
    });

    return (
        <div className='space-y-6'>
            <div>
                <h1 className="text-2xl font-semibold">Sentiment Analysis</h1>
                <p className="text-slate-400">Analyze sentiment patterns in your meetings</p>
            </div>

            {error && <p className='text-red-500'>{error}</p>}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Transcripts List */}
                <div className="lg:col-span-1">
                    <h2 className="text-lg font-semibold mb-4">Select a Meeting</h2>
                    <div className="space-y-2 max-h-96 overflow-y-auto">
                        {allTranscripts.length > 0 ? (
                            allTranscripts.map((transcript) => (
                                <div
                                    key={transcript.id}
                                    onClick={() => setSelectedTranscript(transcript.id)}
                                    className={`p-3 rounded cursor-pointer transition ${
                                        selectedTranscript === transcript.id
                                            ? 'bg-blue-600'
                                            : 'bg-slate-700 hover:bg-slate-600'
                                    }`}
                                >
                                    <p className="font-semibold text-sm truncate">{transcript.file_name}</p>
                                    <p className="text-xs text-slate-400">{transcript.project}</p>
                                </div>
                            ))
                        ) : (
                            <p className="text-slate-400">No transcripts found</p>
                        )}
                    </div>
                </div>

                {/* Sentiment Analysis Content */}
                <div className="lg:col-span-2">
                    {selectedTranscript ? (
                        <div className="space-y-6">
                            <div className="bg-slate-800 p-6 rounded-lg">
                                <h3 className="text-lg font-semibold mb-4">
                                    {allTranscripts.find(t => t.id === selectedTranscript)?.file_name}
                                </h3>
                                <p className="text-slate-400 mb-4">
                                    Note: Sentiment analysis features require backend API implementation.
                                </p>
                                <div className="space-y-4">
                                    <div className="p-4 bg-slate-700 rounded">
                                        <h4 className="font-semibold mb-2">Sentiment Timeline Chart</h4>
                                        <p className="text-slate-400 text-sm">Requires: /api/transcript/{selectedTranscript}/sentiment/ endpoint</p>
                                    </div>

                                    <div className="p-4 bg-slate-700 rounded">
                                        <h4 className="font-semibold mb-2">Speaker Sentiment Breakdown</h4>
                                        <p className="text-slate-400 text-sm">Requires: /api/transcript/{selectedTranscript}/speaker-sentiment/ endpoint</p>
                                    </div>

                                    <div className="p-4 bg-slate-700 rounded">
                                        <h4 className="font-semibold mb-2">Flagged Sections</h4>
                                        <p className="text-slate-400 text-sm">Requires: /api/transcript/{selectedTranscript}/flagged-sections/ endpoint</p>
                                    </div>

                                    <div className="p-4 bg-slate-700 rounded">
                                        <h4 className="font-semibold mb-2">Chat Interface</h4>
                                        <p className="text-slate-400 text-sm">Requires: /api/transcript/{selectedTranscript}/chat/ endpoint</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="text-slate-400 text-center py-8 bg-slate-800 rounded-lg">
                            Select a transcript to view sentiment analysis
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default Sentiment