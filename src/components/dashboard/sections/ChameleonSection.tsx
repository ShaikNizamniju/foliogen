import { useState } from 'react';
import { Wand2, Link2 } from 'lucide-react';
import { ChameleonModePanel } from '../ChameleonMode/ChameleonModePanel';
import { ChameleonLinkGenerator } from '../ChameleonMode/ChameleonLinkGenerator';

export function ChameleonSection() {
    const [chameleonId, setChameleonId] = useState<string | null>(null);
    const [matchScore, setMatchScore] = useState<number | undefined>(undefined);

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h2 className="font-bold text-foreground text-lg flex items-center gap-2">
                    <Wand2 className="h-5 w-5 text-blue-400" /> Chameleon Mode
                </h2>
                <p className="text-sm text-muted-foreground mt-1">
                    Paste a job URL or description — AI re-tailors your portfolio for that specific role. Share the generated link with recruiters.
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
                {/* Generator panel */}
                <ChameleonModePanel
                    onGenerated={(id, score) => {
                        setChameleonId(id);
                        setMatchScore(score);
                    }}
                />

                {/* Link panel (shows after generation) */}
                {chameleonId ? (
                    <ChameleonLinkGenerator
                        chameleonId={chameleonId}
                        matchScore={matchScore}
                    />
                ) : (
                    <div className="rounded-2xl border border-dashed border-border p-8 flex flex-col items-center justify-center gap-3 text-center h-full min-h-[200px]">
                        <div className="p-3 rounded-full bg-muted/50">
                            <Link2 className="h-6 w-6 text-muted-foreground/50" />
                        </div>
                        <p className="text-sm text-muted-foreground">
                            Your shareable Chameleon link will appear here after generation
                        </p>
                    </div>
                )}
            </div>

            {/* Info callout */}
            <div className="rounded-2xl border border-blue-500/20 bg-blue-500/5 p-4">
                <p className="text-sm text-blue-300 font-semibold mb-1">How it works</p>
                <ol className="text-xs text-blue-200/70 space-y-1 list-decimal list-inside">
                    <li>Paste the job URL or JD text into the panel on the left</li>
                    <li>AI analyzes the JD against your profile and generates a tailored overlay</li>
                    <li>Copy the unique link — it loads your normal portfolio with the AI overlay</li>
                    <li>Your real portfolio data is <strong>never changed</strong> — the overlay is temporary</li>
                </ol>
            </div>
        </div>
    );
}
