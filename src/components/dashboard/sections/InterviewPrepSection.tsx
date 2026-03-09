import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useProfile } from '@/contexts/ProfileContext';
import { useJobApplications, JobApplication, AiPrep } from '@/hooks/useJobApplications';
import { supabase } from '@/integrations/supabase/client';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { BrainCircuit, Loader2, Target, CheckCircle2, AlertTriangle, MessageSquareText, Sparkles } from 'lucide-react';
import { toast } from 'sonner';
import { usePro } from '@/contexts/ProContext';

export function InterviewPrepSection() {
    const { user } = useAuth();
    const { profile } = useProfile();
    const { isPro: isProUser } = usePro();
    const { jobs, saveAiPrep, loading: jobsLoading } = useJobApplications();

    const appliedJobs = jobs.filter(j => ['applied', 'interviewing', 'offer'].includes(j.status));

    const [selectedJobId, setSelectedJobId] = useState<string>('');
    const [isGenerating, setIsGenerating] = useState(false);
    const [activeQuestion, setActiveQuestion] = useState<string>('');
    const [answer, setAnswer] = useState('');
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [feedback, setFeedback] = useState<any>(null);

    const selectedJob = appliedJobs.find(j => j.id === selectedJobId);

    const handleGeneratePrep = async (job: JobApplication) => {
        setIsGenerating(true);
        try {
            const { data, error } = await supabase.functions.invoke('generate-interview-prep', {
                body: { company: job.company, role: job.role },
            });

            if (error) throw new Error(error.message);
            if (data.error) throw new Error(data.error);

            const aiPrep: AiPrep = {
                company_summary: data.company_summary,
                likely_questions: data.likely_questions,
                questions_to_ask: data.questions_to_ask,
            };

            await saveAiPrep(job.id, aiPrep);
            toast.success('Interview Prep Generated!');
        } catch (err: any) {
            toast.error(err.message || 'Failed to generate prep');
        } finally {
            setIsGenerating(false);
        }
    };

    const handleAnalyzeAnswer = async () => {
        if (!answer.trim()) {
            toast.error("Please provide an answer first");
            return;
        }

        setIsAnalyzing(true);
        setFeedback(null);
        try {
            const { data, error } = await supabase.functions.invoke('analyze-interview-answer', {
                body: {
                    question: activeQuestion,
                    answer,
                    role: selectedJob?.role,
                    company: selectedJob?.company
                },
            });

            if (error) throw new Error(error.message);
            if (data.error) throw new Error(data.error);

            setFeedback(data);
            toast.success('Feedback received!');
        } catch (err: any) {
            toast.error(err.message || 'Analysis failed');
        } finally {
            setIsAnalyzing(false);
        }
    };

    const selectQuestion = (q: string) => {
        setActiveQuestion(q);
        setAnswer('');
        setFeedback(null);
    };

    if (jobsLoading) {
        return (
            <div className="flex items-center justify-center py-24">
                <Loader2 className="h-8 w-8 animate-spin text-indigo-500" />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-foreground">AI Interview Prep</h1>
                <p className="text-muted-foreground mt-1">
                    Select an applied job to generate tailored questions and practice your responses.
                </p>
            </div>

            <Card className="p-6 bg-card/50 backdrop-blur-sm border-border/50">
                <label className="text-sm font-medium mb-2 block">Target Role</label>
                <Select value={selectedJobId} onValueChange={setSelectedJobId}>
                    <SelectTrigger className="w-full md:w-[400px]">
                        <SelectValue placeholder={appliedJobs.length > 0 ? "Select a job application..." : "No applied jobs found"} />
                    </SelectTrigger>
                    <SelectContent>
                        {appliedJobs.map(job => (
                            <SelectItem key={job.id} value={job.id}>
                                {job.role} at {job.company}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>

                {appliedJobs.length === 0 && (
                    <p className="text-sm text-muted-foreground mt-2">
                        You must add a job to your Career Hub and move it to "Applied" or later to unlock interview prep.
                    </p>
                )}
            </Card>

            {selectedJob && !selectedJob.ai_prep && (
                <Card className="p-8 text-center bg-card/50 border-border/50 border-dashed">
                    <BrainCircuit className="h-10 w-10 mx-auto text-indigo-500 mb-4" />
                    <h3 className="font-semibold text-lg">Generate Interview Strategy</h3>
                    <p className="text-muted-foreground text-sm max-w-md mx-auto mb-6">
                        Our AI will analyze {selectedJob.company} and the {selectedJob.role} position to generate likely technical and behavioral questions based on your profile.
                    </p>
                    <Button
                        onClick={() => handleGeneratePrep(selectedJob)}
                        disabled={isGenerating || !isProUser}
                        className="shadow-glow"
                    >
                        {isGenerating ? (
                            <><Loader2 className="h-4 w-4 mr-2 animate-spin" /> Analyzing Company & Role...</>
                        ) : (
                            <><Sparkles className="h-4 w-4 mr-2" /> Generate Interview Prep</>
                        )}
                    </Button>
                    {!isProUser && (
                        <p className="text-xs text-amber-500 mt-4 font-medium">
                            Interview Prep is a Pro feature. Upgrade to unlock.
                        </p>
                    )}
                </Card>
            )}

            {selectedJob?.ai_prep && (
                <div className="grid md:grid-cols-12 gap-6">
                    <div className="md:col-span-4 space-y-4">
                        <h3 className="font-semibold flex items-center gap-2">
                            <Target className="h-4 w-4 text-indigo-500" />
                            Practice Questions
                        </h3>
                        <div className="space-y-2">
                            {selectedJob.ai_prep.likely_questions.map((q, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => selectQuestion(q)}
                                    className={`w-full text-left p-4 rounded-xl text-sm transition-all border ${activeQuestion === q
                                        ? 'bg-indigo-500/10 border-indigo-500/30 text-indigo-600 font-medium shadow-sm'
                                        : 'bg-card border-border/50 text-muted-foreground hover:bg-muted'
                                        }`}
                                >
                                    <p className="line-clamp-2">{q}</p>
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="md:col-span-8">
                        {activeQuestion ? (
                            <Card className="p-6 bg-card border-border/50 h-full flex flex-col">
                                <div className="flex items-start gap-4 mb-4">
                                    <div className="p-2 rounded-lg bg-indigo-500/10 shrink-0">
                                        <MessageSquareText className="h-4 w-4 text-indigo-500" />
                                    </div>
                                    <h4 className="font-semibold text-foreground text-lg leading-snug">{activeQuestion}</h4>
                                </div>

                                <Textarea
                                    placeholder="Type your response here using the STAR method (Situation, Task, Action, Result)..."
                                    value={answer}
                                    onChange={(e) => setAnswer(e.target.value)}
                                    className="min-h-[200px] resize-y mb-4 bg-muted/30 flex-1"
                                />

                                <div className="flex justify-end mb-6">
                                    <Button
                                        onClick={handleAnalyzeAnswer}
                                        disabled={isAnalyzing || !answer.trim()}
                                        className="shadow-glow"
                                    >
                                        {isAnalyzing ? (
                                            <><Loader2 className="h-4 w-4 mr-2 animate-spin" /> Evaluating Answer...</>
                                        ) : (
                                            <><BrainCircuit className="h-4 w-4 mr-2" /> Analyze with AI</>
                                        )}
                                    </Button>
                                </div>

                                {feedback && (
                                    <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
                                        <div className="flex items-center justify-between p-4 bg-muted/40 rounded-xl border border-border/50">
                                            <span className="font-semibold">Answer Score</span>
                                            <div className="flex items-center gap-2">
                                                <span className={`text-2xl font-bold ${feedback.score >= 80 ? 'text-emerald-500' :
                                                    feedback.score >= 50 ? 'text-amber-500' : 'text-red-500'
                                                    }`}>
                                                    {feedback.score}/100
                                                </span>
                                            </div>
                                        </div>

                                        <div className="grid md:grid-cols-2 gap-4">
                                            <div className="p-4 rounded-xl bg-emerald-500/5 border border-emerald-500/20">
                                                <h5 className="flex items-center gap-2 font-medium text-emerald-700 dark:text-emerald-400 text-sm mb-2">
                                                    <CheckCircle2 className="h-4 w-4" /> What you did well
                                                </h5>
                                                <ul className="space-y-1 text-sm text-emerald-600/90 dark:text-emerald-300/90 list-disc ml-4">
                                                    {feedback.strengths.map((s: string, i: number) => <li key={i}>{s}</li>)}
                                                </ul>
                                            </div>
                                            <div className="p-4 rounded-xl bg-amber-500/5 border border-amber-500/20">
                                                <h5 className="flex items-center gap-2 font-medium text-amber-700 dark:text-amber-400 text-sm mb-2">
                                                    <AlertTriangle className="h-4 w-4" /> Areas to improve
                                                </h5>
                                                <ul className="space-y-1 text-sm text-amber-600/90 dark:text-amber-300/90 list-disc ml-4">
                                                    {feedback.improvements.map((s: string, i: number) => <li key={i}>{s}</li>)}
                                                </ul>
                                            </div>
                                        </div>

                                        <div className="p-4 rounded-xl bg-indigo-500/5 border border-indigo-500/20">
                                            <h5 className="font-medium text-indigo-600 text-sm mb-2 flex items-center gap-2">
                                                <Sparkles className="h-4 w-4" /> Ideal Framework
                                            </h5>
                                            <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-wrap">
                                                {feedback.idealFramework}
                                            </p>
                                        </div>
                                    </div>
                                )}
                            </Card>
                        ) : (
                            <Card className="h-full min-h-[400px] flex flex-col items-center justify-center p-6 text-center border-dashed border-border/50 text-muted-foreground bg-card/30">
                                <Target className="h-10 w-10 mb-4 opacity-20" />
                                <p>Select a question from the left to start practicing</p>
                            </Card>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
