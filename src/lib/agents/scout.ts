
import { supabase } from '../supabase';

export interface JobApplication {
    id: string;
    role: string;
    company: string;
    status: string;
    salary_range: string | null;
    job_url: string | null;
    score?: number;
}

export const prioritizeJobs = async (userId: string): Promise<JobApplication[]> => {
    const { data: jobs, error } = await supabase
        .from('job_applications')
        .select('*')
        .eq('user_id', userId);

    if (error) {
        console.error('Error fetching job applications:', error);
        throw new Error('Failed to prioritize jobs');
    }

    if (!jobs || jobs.length === 0) {
        return [];
    }

    const scoredJobs = jobs.map((job: any) => {
        let score = 0;

        // +20 points if the status is 'interviewing'
        if (job.status?.toLowerCase() === 'interviewing') {
            score += 20;
        }

        // +10 points if the role contains 'AI', 'Manager', or 'Product'
        const roleLower = job.role.toLowerCase();
        if (roleLower.includes('ai') || roleLower.includes('manager') || roleLower.includes('product')) {
            score += 10;
        }

        // +5 points if the salary_range is not null
        if (job.salary_range) {
            score += 5;
        }

        return { ...job, score };
    });

    // Sort by score (Highest first)
    scoredJobs.sort((a: any, b: any) => b.score - a.score);

    return scoredJobs;
};
