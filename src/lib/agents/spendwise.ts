
import { supabase } from '@/lib/supabase';

export const analyzeSpending = async (userId: string): Promise<string> => {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const { data: transactions, error } = await supabase
        .from('transactions')
        .select('amount')
        .eq('user_id', userId)
        .gte('date', thirtyDaysAgo.toISOString());

    if (error) {
        console.error('Error fetching transactions:', error);
        throw new Error('Failed to analyze spending');
    }

    const total = transactions.reduce((sum, transaction) => sum + Number(transaction.amount), 0);

    if (total > 50000) {
        return `Warning: You have spent ${total} this month. Slow down.`;
    } else {
        return `Good job! You are on track with ${total} spent.`;
    }
};
