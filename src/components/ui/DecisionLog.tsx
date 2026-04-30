import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Check } from 'lucide-react';

export interface DecisionOption {
  name: string;
  metrics: {
    cost?: string;
    time?: string;
    complexity?: string;
    [key: string]: string | undefined; // Extensible for RICE (Reach, Impact, Confidence, Effort) or MoSCoW
  };
}

export interface DecisionLogProps {
  conflict: string;
  framework?: string; // e.g., 'RICE Scoring', 'Trade-off Matrix', 'MoSCoW Method'
  optionA: DecisionOption;
  optionB: DecisionOption;
  winner: 'A' | 'B';
  reasoning: string;
}

const PENDING_TEXT = '[Impact Pending Verification]';

export function DecisionLog({
  conflict,
  framework = 'Trade-off Matrix',
  optionA,
  optionB,
  winner,
  reasoning
}: DecisionLogProps) {
  // Extract all unique metric keys from both options. 
  // Fallback to defaults if no metrics provided at all, fulfilling anti-hallucination constraints.
  const allMetricKeys = Array.from(
    new Set([...Object.keys(optionA.metrics || {}), ...Object.keys(optionB.metrics || {})])
  );

  const displayKeys = allMetricKeys.length > 0 ? allMetricKeys : ['cost', 'time', 'complexity'];

  return (
    <Card className="w-full bg-card text-card-foreground shadow-sm border-border overflow-hidden my-6">
      <CardHeader className="bg-muted/30 border-b border-border pb-4">
        <div className="flex items-center justify-between mb-2">
          <Badge variant="outline" className="font-mono text-xs uppercase tracking-wider text-muted-foreground border-border">
            {framework}
          </Badge>
          <Badge variant="secondary" className="font-mono text-xs text-primary/80 bg-primary/10">
            Decision Log
          </Badge>
        </div>
        <CardTitle className="text-xl font-semibold leading-tight">
          <span className="text-muted-foreground mr-2 font-normal">The Conflict:</span>
          {conflict || <span className="italic text-muted-foreground text-base">{PENDING_TEXT}</span>}
        </CardTitle>
      </CardHeader>
      
      <CardContent className="p-0">
        <div className="grid grid-cols-3 divide-x divide-border border-b border-border text-sm">
          {/* Header Row */}
          <div className="p-4 bg-muted/10 font-medium text-muted-foreground flex items-center">
            Constraint / Metric
          </div>
          <div className={`p-4 font-semibold text-center flex items-center justify-center transition-colors ${winner === 'A' ? 'bg-primary/5 text-primary' : ''}`}>
            <div className="flex items-center gap-2">
              {optionA.name || 'Option A'}
              {winner === 'A' && <Check className="w-4 h-4 text-primary" />}
            </div>
          </div>
          <div className={`p-4 font-semibold text-center flex items-center justify-center transition-colors ${winner === 'B' ? 'bg-primary/5 text-primary' : ''}`}>
            <div className="flex items-center gap-2">
              {optionB.name || 'Option B'}
              {winner === 'B' && <Check className="w-4 h-4 text-primary" />}
            </div>
          </div>
          
          {/* Data Rows */}
          {displayKeys.map(key => (
            <React.Fragment key={key}>
              <div className="p-4 bg-muted/10 font-mono text-xs uppercase text-muted-foreground tracking-wider flex items-center">
                {key}
              </div>
              <div className={`p-4 text-center flex items-center justify-center ${winner === 'A' ? 'bg-primary/5' : ''}`}>
                {optionA.metrics?.[key] ? (
                  <span>{optionA.metrics[key]}</span>
                ) : (
                  <span className="text-muted-foreground/60 italic text-xs">{PENDING_TEXT}</span>
                )}
              </div>
              <div className={`p-4 text-center flex items-center justify-center ${winner === 'B' ? 'bg-primary/5' : ''}`}>
                {optionB.metrics?.[key] ? (
                  <span>{optionB.metrics[key]}</span>
                ) : (
                  <span className="text-muted-foreground/60 italic text-xs">{PENDING_TEXT}</span>
                )}
              </div>
            </React.Fragment>
          ))}
        </div>

        {/* Reasoning Section */}
        <div className="p-6 bg-muted/5">
          <div className="text-xs font-mono text-muted-foreground uppercase tracking-wider mb-3">
            The Reasoning
          </div>
          <div className="text-sm leading-relaxed text-foreground/90 border-l-2 border-primary/40 pl-4 py-1">
            {reasoning ? (
              <p>{reasoning}</p>
            ) : (
              <p className="italic text-muted-foreground">{PENDING_TEXT}</p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
