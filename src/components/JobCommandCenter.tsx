
import React, { useEffect, useState } from 'react';
import { prioritizeJobs, JobApplication } from '@/lib/agents/scout';
import { supabase } from '@/lib/supabase_v2';
import { ExternalLink, Trophy, Target, Sparkles, TrendingUp } from 'lucide-react';

const JobCommandCenter = () => {
    const [jobs, setJobs] = useState<JobApplication[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [selectedJob, setSelectedJob] = useState<JobApplication | null>(null);

    useEffect(() => {
        const fetchJobs = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (user) {
                try {
                    const prioritized = await prioritizeJobs(user.id);
                    setJobs(prioritized);
                    if (prioritized.length > 0) {
                        setSelectedJob(prioritized[0]); // Auto-select first job
                    }
                } catch (e) {
                    console.error("Failed to fetch jobs", e);
                } finally {
                    setLoading(false);
                }
            } else {
                setLoading(false);
            }
        };
        fetchJobs();
    }, []);

    const getAIStrategy = (job: JobApplication) => {
        const suggestions = [];

        if (job.status?.toLowerCase() === 'interviewing') {
            suggestions.push("🎯 Priority: Schedule mock interviews");
            suggestions.push("📝 Review company values and recent news");
        }

        if (job.score && job.score > 20) {
            suggestions.push("⚡ High Priority: Follow up within 24 hours");
        }

        if (!job.salary_range) {
            suggestions.push("💰 Research salary benchmarks for this role");
        }

        suggestions.push("🔗 Connect with employees on LinkedIn");
        suggestions.push("📧 Send a personalized follow-up email");

        return suggestions;
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-slate-950 flex items-center justify-center">
                <div className="text-yellow-500 text-2xl font-bold animate-pulse">
                    Initializing Mission Control...
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-950 text-white">
            {/* Cinematic Header */}
            <header className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 border-b border-yellow-500/20 py-8 px-6">
                <div className="flex items-center justify-center gap-3">
                    <Trophy className="text-yellow-500" size={40} />
                    <h1 className="text-4xl font-bold bg-gradient-to-r from-yellow-500 to-yellow-300 bg-clip-text text-transparent">
                        Mission Control: Career
                    </h1>
                </div>
                <p className="text-center text-slate-400 mt-2">
                    AI-Powered Job Application Strategy Dashboard
                </p>
            </header>

            {/* 3-Column Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 p-6 max-w-[1800px] mx-auto">
                {/* Left Column: Active Applications */}
                <div className="lg:col-span-3 space-y-4">
                    <h2 className="text-xl font-bold text-slate-300 flex items-center gap-2 mb-4">
                        <Target size={20} className="text-blue-400" />
                        Active Applications
                    </h2>

                    <div className="grid grid-cols-2 lg:grid-cols-1 gap-3 max-h-[calc(100vh-300px)] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-slate-700">
                        {jobs.length === 0 ? (
                            <p className="text-slate-500 text-sm">No applications found.</p>
                        ) : (
                            jobs.map((job) => (
                                <button
                                    key={job.id}
                                    onClick={() => setSelectedJob(job)}
                                    className={`
                                        w-full p-4 rounded-lg border-2 transition-all text-left overflow-hidden flex flex-col justify-start
                                        ${selectedJob?.id === job.id
                                            ? 'bg-yellow-500/10 border-yellow-500 shadow-lg shadow-yellow-500/20'
                                            : 'bg-slate-900 border-slate-800 hover:border-slate-600'}
                                    `}
                                >
                                    <div className="flex justify-between items-start mb-2 gap-2 w-full">
                                        <h3 className={`font-semibold truncate w-full ${selectedJob?.id === job.id ? 'text-yellow-400' : 'text-white'}`}>
                                            {job.role}
                                        </h3>
                                        <span className="shrink-0 text-xs px-2 py-1 rounded-full bg-blue-500/20 text-blue-300 font-bold whitespace-nowrap">
                                            {job.score}
                                        </span>
                                    </div>
                                    <p className="text-slate-400 text-sm w-full truncate">{job.company}</p>
                                    <p className="text-slate-500 text-xs mt-1 capitalize">{job.status}</p>
                                </button>
                            ))
                        )}
                    </div>
                </div>

                {/* Center Column: The Spotlight */}
                <div className="lg:col-span-6">
                    <h2 className="text-2xl font-bold text-yellow-500 flex items-center gap-2 mb-4">
                        <Sparkles size={24} />
                        The Spotlight
                    </h2>

                    {selectedJob ? (
                        <div className="bg-slate-900 border-2 border-yellow-500/30 rounded-xl p-8 shadow-2xl shadow-yellow-500/10">
                            <div className="flex justify-between items-start mb-6">
                                <div>
                                    <h3 className="text-3xl font-bold text-yellow-400 mb-2">{selectedJob.role}</h3>
                                    <p className="text-xl text-slate-300">{selectedJob.company}</p>
                                </div>
                                <div className="text-right">
                                    <span className="text-4xl font-bold text-yellow-500">{selectedJob.score}</span>
                                    <p className="text-slate-400 text-sm">Priority Score</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4 mb-6">
                                <div className="bg-slate-800/50 p-4 rounded-lg">
                                    <p className="text-slate-400 text-sm mb-1">Status</p>
                                    <p className="text-white font-semibold capitalize">{selectedJob.status}</p>
                                </div>
                                <div className="bg-slate-800/50 p-4 rounded-lg">
                                    <p className="text-slate-400 text-sm mb-1">Salary Range</p>
                                    <p className="text-white font-semibold">
                                        {selectedJob.salary_range || 'Not specified'}
                                    </p>
                                </div>
                            </div>

                            {selectedJob.job_url && (
                                <a
                                    href={selectedJob.job_url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center justify-center gap-2 w-full bg-yellow-500 hover:bg-yellow-600 text-black font-bold py-3 px-6 rounded-lg transition-colors"
                                >
                                    View Full Application <ExternalLink size={18} />
                                </a>
                            )}
                        </div>
                    ) : (
                        <div className="bg-slate-900 border-2 border-slate-800 rounded-xl p-12 text-center">
                            <p className="text-slate-500">Select an application to view details</p>
                        </div>
                    )}
                </div>

                {/* Right Column: AI Strategy */}
                <div className="lg:col-span-3 space-y-4">
                    <h2 className="text-xl font-bold text-emerald-400 flex items-center gap-2 mb-4">
                        <TrendingUp size={20} />
                        AI Strategy
                    </h2>

                    {selectedJob ? (
                        <div className="bg-slate-900 border border-emerald-500/30 rounded-lg p-5 space-y-3">
                            <p className="text-slate-400 text-sm mb-4">Recommended Next Steps:</p>
                            {getAIStrategy(selectedJob).map((suggestion, index) => (
                                <div
                                    key={index}
                                    className="bg-slate-800/50 p-3 rounded-md border-l-4 border-emerald-500/50"
                                >
                                    <p className="text-sm text-slate-300">{suggestion}</p>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="bg-slate-900 border border-slate-800 rounded-lg p-5">
                            <p className="text-slate-500 text-sm">Select a job to see AI-powered strategies</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default JobCommandCenter;
