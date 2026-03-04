
import React, { useState } from 'react';
import { Clock, Zap, Calendar, Bell, BellOff } from 'lucide-react';

interface TimeBlock {
    id: string;
    title: string;
    day: string;
    startTime: string;
    endTime: string;
    type: 'deep-work' | 'meeting' | 'free';
}

const ChronosPage = () => {
    const [focusMode, setFocusMode] = useState(false);
    const [doNotDisturb, setDoNotDisturb] = useState(false);

    // Mock calendar data
    const mockEvents: TimeBlock[] = [
        {
            id: '1',
            title: 'Pitch Deck Review',
            day: 'Monday',
            startTime: '10:00',
            endTime: '11:00',
            type: 'meeting'
        },
        {
            id: '2',
            title: 'Code Sprint',
            day: 'Tuesday',
            startTime: '14:00',
            endTime: '16:00',
            type: 'deep-work'
        },
        {
            id: '3',
            title: 'Deep Focus Session',
            day: 'Wednesday',
            startTime: '09:00',
            endTime: '12:00',
            type: 'deep-work'
        },
        {
            id: '4',
            title: 'Team Standup',
            day: 'Thursday',
            startTime: '10:00',
            endTime: '10:30',
            type: 'meeting'
        },
        {
            id: '5',
            title: 'Architecture Planning',
            day: 'Friday',
            startTime: '15:00',
            endTime: '17:00',
            type: 'deep-work'
        }
    ];

    const weekDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
    const timeSlots = ['09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00'];

    const getEventForSlot = (day: string, time: string) => {
        return mockEvents.find(event => {
            const eventStart = parseInt(event.startTime.split(':')[0]);
            const slotTime = parseInt(time.split(':')[0]);
            const eventEnd = parseInt(event.endTime.split(':')[0]);
            return event.day === day && slotTime >= eventStart && slotTime < eventEnd;
        });
    };

    const getBlockColor = (type: 'deep-work' | 'meeting' | 'free') => {
        if (type === 'deep-work') return 'bg-blue-500/20 border-blue-500 text-blue-400';
        if (type === 'meeting') return 'bg-purple-500/20 border-purple-500 text-purple-400';
        return 'bg-slate-800/50 border-slate-700 text-slate-500';
    };

    return (
        <div className="min-h-screen bg-slate-950 text-white font-sans">
            {/* Futuristic Header */}
            <header className="bg-gradient-to-r from-slate-900 via-blue-900/30 to-slate-900 border-b border-blue-500/20 py-8 px-6">
                <div className="flex items-center justify-center gap-3">
                    <Clock className="text-blue-500 animate-pulse" size={40} />
                    <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-500 to-cyan-300 bg-clip-text text-transparent">
                        CHRONOS: TIME DILATION ENGINE
                    </h1>
                </div>
                <p className="text-center text-slate-400 mt-2 font-mono text-sm">
                    Quantum-Level Schedule Optimization
                </p>
            </header>

            <div className="flex h-[calc(100vh-180px)]">
                {/* Left Panel (70%): The Quantum Calendar */}
                <div className="w-[70%] p-6 border-r border-blue-500/20">
                    <div className="space-y-4">
                        <h2 className="text-2xl font-bold text-blue-400 flex items-center gap-2 font-mono">
                            <Calendar size={24} />
                            THE QUANTUM CALENDAR
                        </h2>

                        {/* Weekly Grid */}
                        <div className="bg-slate-900/50 backdrop-blur-md border border-blue-500/30 rounded-xl p-4 overflow-auto">
                            <div className="grid grid-cols-6 gap-2 min-w-[800px]">
                                {/* Header Row */}
                                <div className="font-mono text-xs text-slate-500 p-2">TIME</div>
                                {weekDays.map(day => (
                                    <div key={day} className="font-mono text-sm font-bold text-blue-400 p-2 text-center">
                                        {day.slice(0, 3).toUpperCase()}
                                    </div>
                                ))}

                                {/* Time Slots */}
                                {timeSlots.map(time => (
                                    <React.Fragment key={time}>
                                        <div className="font-mono text-xs text-slate-500 p-2 flex items-center">
                                            {time}
                                        </div>
                                        {weekDays.map(day => {
                                            const event = getEventForSlot(day, time);
                                            return (
                                                <div
                                                    key={`${day}-${time}`}
                                                    className={`
                                                        p-2 rounded-lg border-2 transition-all hover:scale-105 min-h-[60px]
                                                        ${event ? getBlockColor(event.type) : getBlockColor('free')}
                                                    `}
                                                >
                                                    {event && (
                                                        <div className="text-xs font-semibold">
                                                            {event.title}
                                                        </div>
                                                    )}
                                                </div>
                                            );
                                        })}
                                    </React.Fragment>
                                ))}
                            </div>
                        </div>

                        {/* Legend */}
                        <div className="flex gap-4 text-sm font-mono">
                            <div className="flex items-center gap-2">
                                <div className="w-4 h-4 bg-blue-500/20 border-2 border-blue-500 rounded"></div>
                                <span className="text-blue-400">Deep Work</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-4 h-4 bg-purple-500/20 border-2 border-purple-500 rounded"></div>
                                <span className="text-purple-400">Meetings</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-4 h-4 bg-slate-800/50 border-2 border-slate-700 rounded"></div>
                                <span className="text-slate-500">Free Slots</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Panel (30%): Temporal Controller */}
                <div className="w-[30%] p-6 space-y-6">
                    <h2 className="text-xl font-bold text-cyan-400 flex items-center gap-2 font-mono">
                        <Zap size={20} />
                        TEMPORAL CONTROLLER
                    </h2>

                    {/* Focus Mode Toggle */}
                    <div className="bg-slate-900/50 backdrop-blur-md border border-blue-500/30 rounded-xl p-6 space-y-4">
                        <h3 className="text-lg font-bold text-blue-400 font-mono">FOCUS MODE</h3>

                        <div className="flex items-center justify-between">
                            <span className="text-slate-300 font-mono text-sm">
                                {focusMode ? 'ACTIVATED' : 'DEACTIVATED'}
                            </span>
                            <button
                                onClick={() => setFocusMode(!focusMode)}
                                className={`
                                    relative w-16 h-8 rounded-full transition-all
                                    ${focusMode ? 'bg-blue-500 shadow-lg shadow-blue-500/50' : 'bg-slate-700'}
                                `}
                            >
                                <div className={`
                                    absolute top-1 w-6 h-6 rounded-full bg-white transition-all
                                    ${focusMode ? 'left-9' : 'left-1'}
                                `} />
                            </button>
                        </div>

                        <p className="text-slate-400 text-xs font-mono">
                            {focusMode
                                ? '⚡ All notifications blocked. Deep work enabled.'
                                : 'Normal mode. Notifications active.'}
                        </p>
                    </div>

                    {/* Do Not Disturb */}
                    <div className="bg-slate-900/50 backdrop-blur-md border border-purple-500/30 rounded-xl p-6 space-y-4">
                        <h3 className="text-lg font-bold text-purple-400 font-mono">DO NOT DISTURB</h3>

                        <button
                            onClick={() => setDoNotDisturb(!doNotDisturb)}
                            className={`
                                w-full py-3 rounded-lg font-bold font-mono flex items-center justify-center gap-2
                                transition-all
                                ${doNotDisturb
                                    ? 'bg-purple-500 text-white shadow-lg shadow-purple-500/50'
                                    : 'bg-slate-800 text-slate-400 hover:bg-slate-700'}
                            `}
                        >
                            {doNotDisturb ? <BellOff size={20} /> : <Bell size={20} />}
                            {doNotDisturb ? 'DND ACTIVE' : 'ACTIVATE DND'}
                        </button>
                    </div>

                    {/* Quick Add Event */}
                    <div className="bg-slate-900/50 backdrop-blur-md border border-cyan-500/30 rounded-xl p-6 space-y-4">
                        <h3 className="text-lg font-bold text-cyan-400 font-mono">QUICK ADD</h3>

                        <input
                            type="text"
                            placeholder="Event title..."
                            className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-white font-mono text-sm focus:border-cyan-500 focus:outline-none"
                        />

                        <button className="w-full bg-cyan-500 hover:bg-cyan-600 text-black font-bold py-2 rounded-lg font-mono transition-all">
                            ADD TO TIMELINE
                        </button>
                    </div>

                    {/* System Stats */}
                    <div className="bg-slate-900/50 backdrop-blur-md border border-blue-500/30 rounded-xl p-6 space-y-3">
                        <h3 className="text-sm font-bold text-blue-400 font-mono">WEEKLY ANALYTICS</h3>

                        <div className="space-y-2 text-xs font-mono">
                            <div className="flex justify-between">
                                <span className="text-slate-400">Deep Work Hours</span>
                                <span className="text-blue-400 font-bold">12.5h</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-slate-400">Meeting Hours</span>
                                <span className="text-purple-400 font-bold">4.0h</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-slate-400">Productivity Score</span>
                                <span className="text-cyan-400 font-bold">87%</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ChronosPage;
