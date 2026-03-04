import React from 'react'

const Dashboard = () => {
    function StatCard({ title, value }) {
        return (
            <div className=" p-6 rounded-lg shadow transition border ">
                <p className="text-slate-400 text-sm">{title}</p>
                <h3 className="text-3xl font-semibold mt-2">{value}</h3>
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

            {/* Stats Section */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

                <StatCard title="Total Meetings" value="12" />
                <StatCard title="Total Action Items" value="34" />
                <StatCard title="Overall Sentiment" value="Positive" />

            </div>
            {/* Recent Meetings Table */}
            {/* Sentiment Overview Chart */}
        </div>
    )
}

export default Dashboard