
import React, { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useVoice } from '@/hooks/useVoice';
import { Volume2, TrendingDown, TrendingUp, Laptop, ShoppingBag, Coffee, Home, Car, Zap } from 'lucide-react';

interface Transaction {
    id: string;
    amount: number;
    type: 'income' | 'expense';
    category: string;
    description: string;
    date: string;
}

const WealthDashboard = () => {
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [monthlyBurnRate, setMonthlyBurnRate] = useState<number>(0);
    const { speak } = useVoice();

    useEffect(() => {
        fetchTransactions();
    }, []);

    const fetchTransactions = async () => {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
            setLoading(false);
            return;
        }

        // Get transactions from the last 30 days
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

        const { data, error } = await supabase
            .from('transactions')
            .select('*')
            .eq('user_id', user.id)
            .gte('date', thirtyDaysAgo.toISOString())
            .order('date', { ascending: false });

        if (error) {
            console.error('Error fetching transactions:', error);
            setLoading(false);
            return;
        }

        setTransactions(data || []);

        // Calculate monthly burn rate (total expenses)
        const totalExpenses = (data || [])
            .filter(t => t.type === 'expense')
            .reduce((sum, t) => sum + t.amount, 0);

        setMonthlyBurnRate(totalExpenses);
        setLoading(false);
    };

    const handleBriefMe = () => {
        const status = monthlyBurnRate > 50000 ? 'CRITICAL' : 'SAFE';
        const message = monthlyBurnRate > 50000
            ? `Warning! Your monthly burn rate is ${monthlyBurnRate.toLocaleString()} rupees. You are spending above the safe threshold. Consider reducing expenses immediately.`
            : `Good news! Your monthly burn rate is ${monthlyBurnRate.toLocaleString()} rupees. You are within safe spending limits. Keep it up!`;

        speak(message);
    };

    const getCategoryIcon = (category: string) => {
        const cat = category.toLowerCase();
        if (cat.includes('electronic') || cat.includes('tech')) return Laptop;
        if (cat.includes('shopping') || cat.includes('retail')) return ShoppingBag;
        if (cat.includes('food') || cat.includes('restaurant')) return Coffee;
        if (cat.includes('rent') || cat.includes('housing')) return Home;
        if (cat.includes('transport') || cat.includes('car')) return Car;
        return Zap;
    };

    const isDanger = monthlyBurnRate > 50000;

    if (loading) {
        return (
            <div className="min-h-screen bg-slate-950 flex items-center justify-center">
                <div className="text-emerald-500 text-2xl font-bold animate-pulse font-mono">
                    LOADING FINANCIAL DATA...
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-950 text-white font-sans">
            {/* Cinematic Header */}
            <header className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 border-b border-emerald-500/20 py-8 px-6">
                <h1 className="text-4xl font-bold text-center bg-gradient-to-r from-emerald-500 to-emerald-300 bg-clip-text text-transparent">
                    WEALTH COMMAND CENTER
                </h1>
                <p className="text-center text-slate-400 mt-2 font-mono text-sm">
                    Real-Time Financial Intelligence
                </p>
            </header>

            <div className="max-w-6xl mx-auto p-6 space-y-8">
                {/* Hero Section: Monthly Burn Rate */}
                <div className={`
                    relative overflow-hidden rounded-2xl p-8 
                    bg-slate-900/50 backdrop-blur-md border-2
                    ${isDanger ? 'border-red-500/30 shadow-2xl shadow-red-500/20' : 'border-emerald-500/30 shadow-2xl shadow-emerald-500/20'}
                `}>
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-xl font-bold text-slate-300 font-mono">MONTHLY BURN RATE</h2>
                        {isDanger ? (
                            <TrendingDown className="text-red-500 animate-pulse" size={32} />
                        ) : (
                            <TrendingUp className="text-emerald-500" size={32} />
                        )}
                    </div>

                    <div className={`
                        text-6xl font-bold font-mono mb-2
                        ${isDanger ? 'text-red-500' : 'text-emerald-500'}
                    `}>
                        ₹{monthlyBurnRate.toLocaleString()}
                    </div>

                    <p className={`
                        text-sm font-mono uppercase tracking-wider
                        ${isDanger ? 'text-red-400' : 'text-emerald-400'}
                    `}>
                        {isDanger ? '⚠ DANGER ZONE - REDUCE SPENDING' : '✓ SAFE ZONE - ON TRACK'}
                    </p>

                    {/* Threshold indicator */}
                    <div className="mt-6 pt-4 border-t border-slate-700">
                        <div className="flex justify-between items-center text-sm font-mono">
                            <span className="text-slate-400">SAFE THRESHOLD</span>
                            <span className="text-slate-300">₹50,000</span>
                        </div>
                    </div>
                </div>

                {/* Transaction Stream */}
                <div className="space-y-4">
                    <h2 className="text-2xl font-bold text-slate-300 font-mono flex items-center gap-2">
                        <Zap className="text-yellow-500" size={24} />
                        TRANSACTION STREAM
                    </h2>

                    <div className="space-y-3 max-h-[600px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-slate-700">
                        {transactions.length === 0 ? (
                            <div className="bg-slate-900/50 backdrop-blur-md border border-slate-800 rounded-lg p-8 text-center">
                                <p className="text-slate-500 font-mono">NO TRANSACTIONS FOUND</p>
                            </div>
                        ) : (
                            transactions.map((transaction) => {
                                const IconComponent = getCategoryIcon(transaction.category);
                                const isExpense = transaction.type === 'expense';

                                return (
                                    <div
                                        key={transaction.id}
                                        className="bg-slate-900/50 backdrop-blur-md border border-slate-800 rounded-lg p-5 hover:border-slate-600 transition-all"
                                    >
                                        <div className="flex items-start justify-between">
                                            <div className="flex items-start gap-4">
                                                <div className={`
                                                    p-3 rounded-lg
                                                    ${isExpense ? 'bg-red-500/10 text-red-400' : 'bg-emerald-500/10 text-emerald-400'}
                                                `}>
                                                    <IconComponent size={24} />
                                                </div>

                                                <div>
                                                    <h3 className="text-white font-semibold mb-1">
                                                        {transaction.description || transaction.category}
                                                    </h3>
                                                    <p className="text-slate-400 text-sm font-mono uppercase">
                                                        {transaction.category}
                                                    </p>
                                                    <p className="text-slate-500 text-xs font-mono mt-1">
                                                        {new Date(transaction.date).toLocaleDateString('en-US', {
                                                            month: 'short',
                                                            day: 'numeric',
                                                            year: 'numeric'
                                                        })}
                                                    </p>
                                                </div>
                                            </div>

                                            <div className="text-right">
                                                <p className={`
                                                    text-2xl font-bold font-mono
                                                    ${isExpense ? 'text-red-500' : 'text-emerald-500'}
                                                `}>
                                                    {isExpense ? '-' : '+'}₹{transaction.amount.toLocaleString()}
                                                </p>
                                                <p className={`
                                                    text-xs font-mono uppercase mt-1
                                                    ${isExpense ? 'text-red-400' : 'text-emerald-400'}
                                                `}>
                                                    {transaction.type}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })
                        )}
                    </div>
                </div>
            </div>

            {/* Floating "Brief Me" Button */}
            <button
                onClick={handleBriefMe}
                className={`
                    fixed bottom-8 right-8 
                    px-6 py-4 rounded-full font-bold font-mono
                    flex items-center gap-2 shadow-2xl
                    transition-all hover:scale-105
                    ${isDanger
                        ? 'bg-red-500 hover:bg-red-600 text-white shadow-red-500/50'
                        : 'bg-emerald-500 hover:bg-emerald-600 text-black shadow-emerald-500/50'}
                `}
            >
                <Volume2 size={20} />
                BRIEF ME
            </button>
        </div>
    );
};

export default WealthDashboard;
