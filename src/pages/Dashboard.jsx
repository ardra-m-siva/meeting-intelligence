import React, { useState, useEffect } from 'react'
import { AxiosCall } from '../services/AxiosCall';

const Dashboard = () => {
    const [transcripts, setTranscripts] = useState({});
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

    // Calculate stats
    const calculateStats = () => {
        let totalMeetings = 0;
        let totalActionItems = 0;
        let allTranscriptsList = [];

        Object.keys(transcripts).forEach(project => {
            const projectTranscripts = transcripts[project];
            totalMeetings += projectTranscripts.length;
            allTranscriptsList = [...allTranscriptsList, ...projectTranscripts];
        });

        // Note: Action items count would need to fetch individual transcripts
        // For now, we'll display this as fetch needed
        
        return {
            totalMeetings,
            totalActionItems,
            allTranscriptsList
        };
    };

    const stats = calculateStats();
    const recentMeetings = stats.allTranscriptsList.slice(0, 5).sort((a, b) => 
        new Date(b.uploaded_at) - new Date(a.uploaded_at)
    );

    function StatCard({ title, value }) {
        return (
            <div className=" p-6 rounded-lg shadow transition border ">
                <p className="text-slate-400 text-sm">{title}</p>
                <h3 className="text-3xl font-semibold mt-2">{value || "0"}</h3>
            </div>
        );
    }

    if (loading) {
        return (
            <div className='space-y-8'>
                <div>
                    <h1 className="text-2xl font-semibold">Dashboard</h1>
                    <p className="text-slate-400 text-sm">Loading...</p>
                </div>
            </div>
        );
    }

    return (
        <div className='space-y-8'>
            <div>
                <h1 className="text-2xl font-semibold">Dashboard</h1>
                <p className="text-slate-400 text-sm">
                    Overview of your meetings and insights
                </p>
            </div>

            {error && <p className='text-red-500'>{error}</p>}

            {/* Stats Section */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <StatCard title="Total Meetings" value={stats.totalMeetings} />
                <StatCard title="Total Projects" value={Object.keys(transcripts).length} />
                <StatCard title="Recent Upload" value={recentMeetings.length > 0 ? new Date(recentMeetings[0].uploaded_at).toLocaleDateString() : "N/A"} />
            </div>

            {/* Recent Meetings Table */}
            <div>
                <h2 className="text-xl font-semibold mb-4">Recent Meetings</h2>
                <div className="overflow-x-auto">
                    <table className="w-full border-collapse border border-slate-700">
                        <thead className="bg-slate-800">
                            <tr>
                                <th className="border border-slate-700 px-4 py-2 text-left">File Name</th>
                                <th className="border border-slate-700 px-4 py-2 text-left">Project</th>
                                <th className="border border-slate-700 px-4 py-2 text-left">Meeting Date</th>
                                <th className="border border-slate-700 px-4 py-2 text-left">Speakers</th>
                                <th className="border border-slate-700 px-4 py-2 text-left">Words</th>
                                <th className="border border-slate-700 px-4 py-2 text-left">Uploaded</th>
                            </tr>
                        </thead>
                        <tbody>
                            {recentMeetings.length > 0 ? (
                                recentMeetings.map((meeting, index) => (
                                    <tr key={index} className="hover:bg-slate-700">
                                        <td className="border border-slate-700 px-4 py-2">{meeting.file_name}</td>
                                        <td className="border border-slate-700 px-4 py-2">
                                            {Object.keys(transcripts).find(project => 
                                                transcripts[project].some(t => t.id === meeting.id)
                                            )}
                                        </td>
                                        <td className="border border-slate-700 px-4 py-2">{meeting.meeting_date || "N/A"}</td>
                                        <td className="border border-slate-700 px-4 py-2">{meeting.speaker_count}</td>
                                        <td className="border border-slate-700 px-4 py-2">{meeting.word_count}</td>
                                        <td className="border border-slate-700 px-4 py-2">{new Date(meeting.uploaded_at).toLocaleDateString()}</td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="6" className="border border-slate-700 px-4 py-2 text-center text-slate-400">
                                        No meetings yet. Upload a transcript to get started.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}

export default Dashboard