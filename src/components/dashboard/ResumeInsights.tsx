import { Card } from '@/components/ui/card';
import { Target, Search, Clock, FileText, Briefcase, GraduationCap, CheckCircle2, AlertTriangle, AlertCircle } from 'lucide-react';

export function ResumeInsights() {
    return (
        <div className="space-y-6 mt-6">
            <div className="flex flex-col gap-1">
                <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
                    <Target className="h-5 w-5 text-indigo-500" />
                    How Resume Scoring Works
                </h2>
                <p className="text-sm text-muted-foreground">
                    An Application Tracking System (ATS) is software that scans, parses, and ranks incoming resumes. Nearly 75% of resumes are rejected by an ATS before a human ever sees them. Here is how to ensure yours gets through.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* The ATS Factor */}
                <Card className="p-6 bg-card border-border/50">
                    <h3 className="font-semibold text-lg flex items-center gap-2 mb-4">
                        <Search className="h-4 w-4 text-emerald-500" />
                        The ATS Algorithm
                    </h3>
                    <ul className="space-y-3 text-sm text-muted-foreground">
                        <li className="flex items-start gap-2">
                            <span className="font-medium text-foreground min-w-[120px]">Keyword Match:</span>
                            <span>Highest weight. The exact terms from the job description must be in your skills or experience.</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <span className="font-medium text-foreground min-w-[120px]">Job Title:</span>
                            <span>Alignment between past titles and the target role role influences the initial ranking.</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <span className="font-medium text-foreground min-w-[120px]">Experience:</span>
                            <span>Total years of relevant experience parsed from date ranges (e.g., 2020–Present).</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <span className="font-medium text-foreground min-w-[120px]">Education:</span>
                            <span>Degree requirements acting as hard filters for certain corporate roles.</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <span className="font-medium text-foreground min-w-[120px]">Parsability:</span>
                            <span>If a complex PDF layout breaks text extraction, the AI assumes you are unqualified.</span>
                        </li>
                    </ul>
                </Card>

                {/* The Human Factor */}
                <Card className="p-6 bg-card border-border/50">
                    <h3 className="font-semibold text-lg flex items-center gap-2 mb-4">
                        <Clock className="h-4 w-4 text-amber-500" />
                        The Human Factor
                    </h3>
                    <p className="text-sm text-muted-foreground mb-4">
                        Recruiters spend an average of <strong>6–10 seconds</strong> scanning a resume on their first pass. They look for:
                    </p>
                    <ul className="space-y-3 text-sm text-muted-foreground">
                        <li className="flex items-center gap-2">
                            <Briefcase className="h-4 w-4 shrink-0 text-indigo-400" />
                            <span><strong>Relevance:</strong> Are your most recent roles directly related to the open position?</span>
                        </li>
                        <li className="flex items-center gap-2">
                            <Target className="h-4 w-4 shrink-0 text-indigo-400" />
                            <span><strong>Impact:</strong> Do you list metrics and results, or just basic duties?</span>
                        </li>
                        <li className="flex items-center gap-2">
                            <GraduationCap className="h-4 w-4 shrink-0 text-indigo-400" />
                            <span><strong>Trajectory:</strong> Is there a clear pattern of career growth and increased responsibility?</span>
                        </li>
                    </ul>
                </Card>
            </div>

            {/* Thresholds Table */}
            <Card className="overflow-hidden border-border/50 bg-card">
                <div className="bg-muted/30 px-6 py-4 border-b border-border/50">
                    <h3 className="font-semibold text-sm flex items-center gap-2">
                        <FileText className="h-4 w-4 text-indigo-500" />
                        ATS Action Thresholds
                    </h3>
                </div>
                <div className="divide-y divide-border/50">
                    <div className="flex items-center p-4 hover:bg-muted/10 transition-colors">
                        <div className="w-[120px] sm:w-[150px] shrink-0 font-bold text-emerald-500 text-lg">80–100%</div>
                        <div className="flex-1">
                            <div className="flex items-center gap-2 font-medium text-foreground mb-1">
                                <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                                Strong Match — Likely reviewed by human.
                            </div>
                            <p className="text-sm text-muted-foreground">Routed immediately to a human recruiter. High chance of interview.</p>
                        </div>
                    </div>
                    <div className="flex items-center p-4 hover:bg-muted/10 transition-colors">
                        <div className="w-[120px] sm:w-[150px] shrink-0 font-bold text-amber-500 text-lg">60–79%</div>
                        <div className="flex-1">
                            <div className="flex items-center gap-2 font-medium text-foreground mb-1">
                                <AlertTriangle className="h-4 w-4 text-amber-500" />
                                Possible Match — May be reviewed.
                            </div>
                            <p className="text-sm text-muted-foreground">Kept in the system for manual review if the top candidate pool is thin.</p>
                        </div>
                    </div>
                    <div className="flex items-center p-4 hover:bg-muted/10 transition-colors">
                        <div className="w-[120px] sm:w-[150px] shrink-0 font-bold text-red-500 text-lg">Below 60%</div>
                        <div className="flex-1">
                            <div className="flex items-center gap-2 font-medium text-foreground mb-1">
                                <AlertCircle className="h-4 w-4 text-red-500" />
                                Auto-Rejected — Typically screened out.
                            </div>
                            <p className="text-sm text-muted-foreground">Automatically archived by the ATS. Resume is rarely seen by a human.</p>
                        </div>
                    </div>
                </div>
            </Card>
        </div>
    );
}
