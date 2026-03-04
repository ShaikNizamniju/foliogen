import { useState } from 'react';
import { motion } from 'framer-motion';
import { Github, MessageSquareHeart } from 'lucide-react';
import { GitHubConnectCard } from '../ProofOfWork/GitHubConnectCard';
import { GitHubActivityFeed } from '../ProofOfWork/GitHubActivityFeed';
import { TestimonialRequestFlow } from '../ProofOfWork/TestimonialRequestFlow';
import { useProfile } from '@/contexts/ProfileContext';

export function ProofOfWorkSection() {
    const { profile } = useProfile();
    const [githubUsername, setGithubUsername] = useState<string | null>(
        (profile as any)?.githubUsername || (profile as any)?.github_username || null
    );

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h2 className="font-bold text-foreground text-lg flex items-center gap-2">
                    <Github className="h-5 w-5 text-primary" /> Automated Proof of Work
                </h2>
                <p className="text-sm text-muted-foreground mt-1">
                    Auto-fetch your GitHub activity and collect testimonials — no manual uploads needed.
                </p>
            </div>

            {/* GitHub integration */}
            <div className="space-y-4">
                <GitHubConnectCard
                    currentUsername={githubUsername}
                    onConnected={(uname) => setGithubUsername(uname)}
                />
                {githubUsername && (
                    <motion.div
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="rounded-2xl border border-border bg-card p-6"
                    >
                        <h3 className="font-semibold text-sm text-foreground mb-4 flex items-center gap-2">
                            <Github className="h-4 w-4" /> @{githubUsername} — Live Data
                        </h3>
                        <GitHubActivityFeed username={githubUsername} />
                    </motion.div>
                )}
            </div>

            {/* Testimonial section */}
            <div>
                <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3 flex items-center gap-2">
                    <MessageSquareHeart className="h-4 w-4" /> Testimonials
                </h3>
                <TestimonialRequestFlow />
            </div>
        </div>
    );
}
