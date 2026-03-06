import React, { useState, useEffect } from 'react'
import { AxiosCall } from '../services/AxiosCall';

const Sentiment = () => {
    const [transcripts, setTranscripts] = useState({});
    const [selectedTranscript, setSelectedTranscript] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [sentimentData, setSentimentData] = useState(null);
    const [speakerData, setSpeakerData] = useState(null);
    const [flaggedSections, setFlaggedSections] = useState(null);
    const [selectedSection, setSelectedSection] = useState(null);
    const [analysisStatus, setAnalysisStatus] = useState('idle'); // idle, analyzing, cached, error
    const [analyzedTranscripts, setAnalyzedTranscripts] = useState(new Set()); // Track which transcripts have been analyzed

    useEffect(() => {
        fetchTranscripts();
    }, []);

    useEffect(() => {
        if (selectedTranscript) {
            fetchSentimentData();
        }
    }, [selectedTranscript]);

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

    const fetchSentimentData = async (forceRefresh = false) => {
        if (!selectedTranscript) return;

        setAnalysisStatus('analyzing');
        setSentimentData(null);
        setSpeakerData(null);
        setFlaggedSections(null);

        try {
            // Fetch all three analysis types sequentially to avoid overwhelming the API
            const queryParams = forceRefresh ? '?refresh=true' : '';

            // Fetch sentiment timeline first
            const sentimentResult = await AxiosCall('GET', `api/transcript/${selectedTranscript}/sentiment/${queryParams}`, {}, false, false);
            if (sentimentResult.status === 200) setSentimentData(sentimentResult.data);

            // Small delay between requests to respect rate limits
            await new Promise(resolve => setTimeout(resolve, 500));

            // Fetch speaker sentiment
            const speakerResult = await AxiosCall('GET', `api/transcript/${selectedTranscript}/speaker-sentiment/${queryParams}`, {}, false, false);
            if (speakerResult.status === 200) {
                setSpeakerData(speakerResult.data);
            }

            // Another small delay
            await new Promise(resolve => setTimeout(resolve, 500));

            // Fetch flagged sections
            const flaggedResult = await AxiosCall('GET', `api/transcript/${selectedTranscript}/flagged-sections/${queryParams}`, {}, false, false);
            if (flaggedResult.status === 200) setFlaggedSections(flaggedResult.data);

            // Check if any results are cached
            const isCached = sentimentResult.data.cached || speakerResult.data.cached || flaggedResult.data.cached;

            setAnalysisStatus(isCached ? 'cached' : 'completed');

            // Mark this transcript as analyzed
            setAnalyzedTranscripts(prev => new Set([...prev, selectedTranscript]));

        } catch (error) {
            console.log("Error fetching sentiment data:", error);

            // Check if it's a rate limit error
            if (error.response?.data?.error?.includes('rate limit') ||
                error.response?.data?.error?.includes('tokens per minute')) {
                setAnalysisStatus('rate-limited');
            } else {
                setAnalysisStatus('error');
            }
        }
    };

    const getSentimentColor = (sentiment, emotion) => {
        if (emotion === 'enthusiastic') return 'bg-green-500';
        if (emotion === 'frustrated') return 'bg-red-500';
        if (emotion === 'conflicted') return 'bg-orange-500';
        if (emotion === 'agreeable') return 'bg-blue-500';
        if (emotion === 'uncertain') return 'bg-yellow-500';
        if (sentiment === 'positive') return 'bg-green-400';
        if (sentiment === 'negative') return 'bg-red-400';
        return 'bg-gray-400';
    };

    const getSentimentEmoji = (emotion) => {
        const emojis = {
            enthusiastic: '🎉',
            frustrated: '😤',
            conflicted: '⚡',
            agreeable: '🤝',
            uncertain: '🤔',
            neutral: '😐'
        };
        return emojis[emotion] || '😐';
    };

    const getIntensityBar = (intensity) => {
        const bars = ['▫️', '▪️', '▪️▪️', '▪️▪️▪️', '▪️▪️▪️▪️', '▪️▪️▪️▪️▪️'];
        return bars[intensity] || bars[0];
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
                <p className="text-slate-400">Analyze the emotional tone and sentiment patterns in your meetings</p>
            </div>

            {error && <p className='text-red-500'>{error}</p>}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Transcripts List */}
                <div className="lg:col-span-1">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-lg font-semibold">Select a Meeting</h2>
                        <div className="flex items-center space-x-4 text-xs text-slate-400">
                            <div className="flex items-center">
                                <div className="w-2 h-2 bg-green-500 rounded-full mr-1"></div>
                                Analyzed
                            </div>
                            <div className="flex items-center">
                                <div className="w-2 h-2 bg-slate-500 rounded-full mr-1"></div>
                                Not analyzed
                            </div>
                        </div>
                    </div>
                    <div className="space-y-2 max-h-96 overflow-y-auto">
                        {allTranscripts.length > 0 ? (
                            allTranscripts.map((transcript) => (
                                <div
                                    key={transcript.id}
                                    onClick={() => setSelectedTranscript(transcript.id)}
                                    className={`p-3 rounded cursor-pointer transition ${selectedTranscript === transcript.id
                                            ? 'bg-blue-600'
                                            : 'bg-slate-700 hover:bg-slate-600'
                                        }`}
                                >
                                    <div className="flex items-center justify-between">
                                        <div className="flex-1">
                                            <p className="font-semibold text-sm truncate">{transcript.file_name}</p>
                                            <p className="text-xs text-slate-400">{transcript.project}</p>
                                        </div>
                                        <div className="ml-2">
                                            <div className={`w-2 h-2 rounded-full ${analyzedTranscripts.has(transcript.id)
                                                    ? 'bg-green-500'
                                                    : 'bg-slate-500'
                                                }`}></div>
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p className="text-slate-400">No transcripts found</p>
                        )}
                    </div>
                </div>

                {/* Sentiment Analysis Dashboard */}
                <div className="lg:col-span-2">
                    {selectedTranscript ? (
                        <div className="space-y-6">
                            <div className="bg-slate-800 p-6 rounded-lg">
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="text-lg font-semibold">
                                        {allTranscripts.find(t => t.id === selectedTranscript)?.file_name}
                                    </h3>
                                    <button
                                        onClick={() => fetchSentimentData(analysisStatus === 'cached')}
                                        disabled={analysisStatus === 'analyzing'}
                                        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800 disabled:cursor-not-allowed rounded text-white text-sm flex items-center"
                                    >
                                        {analysisStatus === 'analyzing' ? (
                                            <>
                                                <div className="animate-spin rounded-full h-4 w-4 border-b border-white mr-2"></div>
                                                Analyzing...
                                            </>
                                        ) : (
                                            <>
                                                <span className="mr-2">🔄</span>
                                                {analysisStatus === 'cached' ? 'Re-analyze' : 'Analyze'}
                                            </>
                                        )}
                                    </button>
                                </div>

                                {/* Sentiment Timeline */}
                                {sentimentData && sentimentData.timeline && (
                                    <div className="mb-6">
                                        <h4 className="font-semibold mb-3 flex items-center">
                                            <span className="mr-2"><i className="fa-solid fa-chart-column"></i></span>
                                            Sentiment Timeline
                                        </h4>
                                        <div className="space-y-2">
                                            {sentimentData.timeline.map((segment, index) => (
                                                <div key={index} className="flex items-center space-x-3 p-2 bg-slate-700 rounded">
                                                    <span className="text-xs font-mono w-12">{segment.time}</span>
                                                    <div className={`w-4 h-4 rounded-full ${getSentimentColor(segment.sentiment, segment.emotion)}`}></div>
                                                    <span className="text-lg">{getSentimentEmoji(segment.emotion)}</span>
                                                    <span className="text-xs text-slate-300 flex-1 truncate">{segment.segment_text}</span>
                                                    <span className="text-xs">{getIntensityBar(segment.intensity)}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Overall Sentiment Summary */}
                                {speakerData && speakerData.speakers && Array.isArray(speakerData.speakers) && speakerData.speakers.length > 0 ? (
                                    <>
                                        <div className="mb-6">
                                            <h4 className="font-semibold mb-3 flex items-center">
                                                <span className="mr-2"><i className="fa-solid fa-chart-column"></i></span>
                                                Overall Sentiment Summary
                                            </h4>
                                            <div className="p-4 bg-slate-700 rounded">
                                                {(() => {
                                                    // Calculate overall sentiment from speaker data
                                                    const speakers = speakerData.speakers;
                                                    const totalWords = speakers.reduce((sum, s) => sum + (s?.total_words || 0), 0);
                                                    const positiveCount = speakers.filter(s => s?.sentiment === 'positive').length;
                                                    const negativeCount = speakers.filter(s => s?.sentiment === 'negative').length;
                                                    const neutralCount = speakers.filter(s => s?.sentiment === 'neutral').length;

                                                    // Determine dominant sentiment
                                                    let overallSentiment = 'neutral';
                                                    let dominantEmotion = 'neutral';
                                                    if (positiveCount > negativeCount && positiveCount > neutralCount) {
                                                        overallSentiment = 'positive';
                                                        dominantEmotion = 'enthusiastic';
                                                    } else if (negativeCount > positiveCount && negativeCount > neutralCount) {
                                                        overallSentiment = 'negative';
                                                        dominantEmotion = 'frustrated';
                                                    }

                                                    // Calculate average confidence
                                                    const avgConfidence = speakers.reduce((sum, s) => sum + (s?.confidence || 0.5), 0) / speakers.length;

                                                    return (
                                                        <>
                                                            <div className="flex items-center justify-between mb-3">
                                                                <span className="text-sm">Overall Sentiment:</span>
                                                                <div className="flex items-center space-x-2">
                                                                    <span className="text-lg">{getSentimentEmoji(dominantEmotion)}</span>
                                                                    <span className="font-medium capitalize">{overallSentiment}</span>
                                                                </div>
                                                            </div>
                                                            <div className="flex items-center space-x-2 mb-3">
                                                                <div className={`w-4 h-4 rounded-full ${getSentimentColor(overallSentiment, dominantEmotion)}`}></div>
                                                                <span className="text-sm capitalize">{overallSentiment}</span>
                                                                <span className="text-sm text-slate-400">({Math.round(avgConfidence * 100)}% avg confidence)</span>
                                                            </div>
                                                            <div className="text-sm text-slate-400">
                                                                Total words: {totalWords} • {speakers.length} speakers •
                                                                {positiveCount} positive, {neutralCount} neutral, {negativeCount} negative
                                                            </div>
                                                        </>
                                                    );
                                                })()}
                                            </div>
                                        </div>
                                        <div className="mb-6">
                                            <h4 className="font-semibold mb-3 flex items-center">
                                                <span className="mr-2">👥</span>
                                                Speaker Sentiment Breakdown ({speakerData.speakers.length} speakers)
                                            </h4>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                                {speakerData.speakers.map((speaker, index) => (
                                                    <div key={index} className="p-3 bg-slate-700 rounded">
                                                        <div className="flex items-center justify-between mb-2">
                                                            <span className="font-medium text-sm">{speaker?.speaker || 'Unknown'}</span>
                                                            <span className="text-lg">{getSentimentEmoji(speaker?.dominant_emotion)}</span>
                                                        </div>
                                                        <div className="flex items-center space-x-2 mb-2">
                                                            <div className={`w-3 h-3 rounded-full ${getSentimentColor(speaker?.sentiment, speaker?.dominant_emotion)}`}></div>
                                                            <span className="text-xs capitalize">{speaker?.sentiment || 'neutral'}</span>
                                                            <span className="text-xs text-slate-400">({Math.round((speaker?.confidence || 0.5) * 100)}%)</span>
                                                        </div>
                                                        <div className="text-xs text-slate-400">
                                                            {speaker?.total_words || 0} words • {speaker?.dominant_emotion || 'neutral'}
                                                        </div>
                                                        {speaker?.key_phrases && Array.isArray(speaker.key_phrases) && speaker.key_phrases.length > 0 && (
                                                            <div className="mt-2">
                                                                <div className="text-xs text-slate-400 mb-1">Key phrases:</div>
                                                                <div className="flex flex-wrap gap-1">
                                                                    {speaker.key_phrases.slice(0, 2).map((phrase, i) => (
                                                                        <span key={i} className="text-xs bg-slate-600 px-2 py-1 rounded">
                                                                            {phrase}
                                                                        </span>
                                                                    ))}
                                                                </div>
                                                            </div>
                                                        )}
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </>
                                ) : speakerData && (!speakerData.speakers || !Array.isArray(speakerData.speakers) || speakerData.speakers.length === 0) ? (
                                    <div className="mb-6">
                                        <div className="text-center py-4">
                                                <div className="text-slate-400 mb-2"><i className="fa-solid fa-user-group"></i></div>
                                            <p className="text-sm text-slate-400">No speaker analysis available for this transcript</p>
                                            <p className="text-xs text-slate-500">The transcript may not have the expected speaker format</p>
                                        </div>
                                    </div>
                                ) : null}

                                {/* Flagged Sections */}
                                {flaggedSections && flaggedSections.flagged_sections && (
                                    <div className="mb-6">
                                        <h4 className="font-semibold mb-3 flex items-center">
                                            <span className="mr-2"><i class="fa-solid fa-font-awesome text-red-600"></i></span>
                                            Flagged Sections ({flaggedSections.flagged_sections.length})
                                        </h4>
                                        <div className="space-y-2">
                                            {flaggedSections.flagged_sections.map((section, index) => (
                                                <div
                                                    key={index}
                                                    className="p-3 bg-slate-700 rounded cursor-pointer hover:bg-slate-600 transition"
                                                    onClick={() => setSelectedSection(section)}
                                                >
                                                    <div className="flex items-center justify-between mb-2">
                                                        <span className="text-sm font-medium">{section.time}</span>
                                                        <div className="flex items-center space-x-2">
                                                            <span className="text-lg">{getSentimentEmoji(section.emotion)}</span>
                                                            <span className="text-xs bg-red-600 px-2 py-1 rounded">
                                                                {section.flag_reason}
                                                            </span>
                                                        </div>
                                                    </div>
                                                    <p className="text-xs text-slate-300">{section.text_preview}</p>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Loading states */}
                                {analysisStatus === 'analyzing' && (
                                    <div className="text-center py-8">
                                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-4"></div>
                                        <p className="text-slate-400">Analyzing sentiment...</p>
                                        <p className="text-xs text-slate-500 mt-2">This may take a moment for new transcripts</p>
                                    </div>
                                )}

                                {analysisStatus === 'cached' && (
                                    <div className="text-center py-4 mb-4">
                                        <div className="inline-flex items-center px-3 py-1 rounded-full bg-green-900 text-green-300 text-sm">
                                            <span className="mr-2"><i className="fa-solid fa-floppy-disk"></i></span>
                                            Using cached analysis
                                        </div>
                                    </div>
                                )}

                                {analysisStatus === 'rate-limited' && (
                                    <div className="text-center py-8">
                                        <div className="text-red-400 mb-4">
                                            <div className="text-2xl mb-2"><i className="fa-solid fa-alarm-clock"></i></div>
                                            <p className="font-semibold">Rate Limit Reached</p>
                                            <p className="text-sm">API token limit exceeded. Please wait before trying again.</p>
                                        </div>
                                        <button
                                            onClick={() => fetchSentimentData(false)}
                                            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded text-white text-sm"
                                        >
                                            Retry in 30 seconds
                                        </button>
                                    </div>
                                )}

                                {analysisStatus === 'completed' && (
                                    <div className="text-center py-4 mb-4">
                                        <div className="inline-flex items-center px-3 py-1 rounded-full bg-blue-900 text-blue-300 text-sm">
                                            <span className="mr-2"><i className="fa-solid fa-arrow-trend-up"></i></span>
                                            Fresh analysis completed
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Selected Section Detail Modal */}
                            {selectedSection && (
                                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                                    <div className="bg-slate-800 p-6 rounded-lg max-w-2xl w-full mx-4 max-h-96 overflow-y-auto">
                                        <div className="flex items-center justify-between mb-4">
                                            <h3 className="text-lg font-semibold">Flagged Section Details</h3>
                                            <button
                                                onClick={() => setSelectedSection(null)}
                                                className="text-slate-400 hover:text-white"
                                            >
                                                ✕
                                            </button>
                                        </div>
                                        <div className="space-y-3">
                                            <div className="flex items-center space-x-4">
                                                <span className="text-sm">Time: {selectedSection.time}</span>
                                                <span className="text-sm">Emotion: {selectedSection.emotion}</span>
                                                <span className="text-sm">Intensity: {getIntensityBar(selectedSection.intensity)}</span>
                                            </div>
                                            <div className="bg-slate-700 p-3 rounded">
                                                <p className="text-sm text-slate-300">{selectedSection.text_preview}</p>
                                            </div>
                                            <div className="text-xs text-slate-400">
                                                Flag reason: {selectedSection.flag_reason}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
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