import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { JobApplication } from '@/hooks/useJobApplications';
import { Loader2, Brain, Mic, Lightbulb, MessageSquare, Save, Sparkles, Building2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';

interface AiPrep {
  company_summary: string;
  likely_questions: string[];
  questions_to_ask: string[];
}

interface InterviewPrepModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  job: JobApplication;
  aiPrep: AiPrep | null;
  onSaveNotes: (notes: string) => Promise<void>;
}

export function InterviewPrepModal({
  open,
  onOpenChange,
  job,
  aiPrep,
  onSaveNotes,
}: InterviewPrepModalProps) {
  const [practiceAnswers, setPracticeAnswers] = useState<Record<number, string>>({});
  const [saving, setSaving] = useState(false);

  const handleSaveNotes = async () => {
    setSaving(true);
    try {
      // Compile practice answers into notes
      const notesContent = aiPrep?.likely_questions
        .map((q, i) => {
          const answer = practiceAnswers[i];
          if (answer?.trim()) {
            return `Q: ${q}\nA: ${answer}`;
          }
          return null;
        })
        .filter(Boolean)
        .join('\n\n---\n\n');

      if (notesContent) {
        const fullNotes = `## Interview Practice Notes\n\n${notesContent}`;
        await onSaveNotes(job.notes ? `${job.notes}\n\n${fullNotes}` : fullNotes);
        toast.success('Practice notes saved!');
      } else {
        toast.info('No answers to save yet');
      }
    } catch (error) {
      toast.error('Failed to save notes');
    } finally {
      setSaving(false);
    }
  };

  if (!aiPrep) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl max-h-[85vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-gradient-to-br from-violet-500/20 to-purple-500/20">
              <Building2 className="h-5 w-5 text-violet-500" />
            </div>
            <div>
              <DialogTitle className="text-xl">{job.company} Interview Strategy</DialogTitle>
              <DialogDescription>{job.role}</DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <Tabs defaultValue="cheatsheet" className="flex-1 flex flex-col overflow-hidden">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="cheatsheet" className="gap-2">
              <Brain className="h-4 w-4" />
              The Cheat Sheet
            </TabsTrigger>
            <TabsTrigger value="practice" className="gap-2">
              <Mic className="h-4 w-4" />
              Practice
            </TabsTrigger>
          </TabsList>

          <ScrollArea className="flex-1 mt-4">
            <TabsContent value="cheatsheet" className="mt-0 space-y-6">
              {/* Company Summary */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="rounded-xl border border-border bg-gradient-to-br from-primary/5 to-transparent p-5"
              >
                <div className="flex items-center gap-2 mb-3">
                  <Sparkles className="h-4 w-4 text-primary" />
                  <h3 className="font-semibold text-foreground">Company Intel</h3>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {aiPrep.company_summary}
                </p>
              </motion.div>

              {/* Questions to Ask */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="rounded-xl border border-border bg-card p-5"
              >
                <div className="flex items-center gap-2 mb-4">
                  <Lightbulb className="h-4 w-4 text-amber-500" />
                  <h3 className="font-semibold text-foreground">Smart Questions to Ask</h3>
                  <Badge variant="secondary" className="text-xs ml-auto">
                    Impress them!
                  </Badge>
                </div>
                <ul className="space-y-3">
                  {aiPrep.questions_to_ask.map((question, index) => (
                    <motion.li
                      key={index}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.15 + index * 0.05 }}
                      className="flex items-start gap-3 text-sm"
                    >
                      <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-amber-500/10 text-amber-600 text-xs font-medium">
                        {index + 1}
                      </span>
                      <span className="text-muted-foreground pt-0.5">{question}</span>
                    </motion.li>
                  ))}
                </ul>
              </motion.div>
            </TabsContent>

            <TabsContent value="practice" className="mt-0 space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <MessageSquare className="h-4 w-4 text-violet-500" />
                  <h3 className="font-semibold text-foreground">Practice Your Answers</h3>
                </div>
                <Button size="sm" onClick={handleSaveNotes} disabled={saving}>
                  {saving ? (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <Save className="h-4 w-4 mr-2" />
                  )}
                  Save Notes
                </Button>
              </div>

              <AnimatePresence>
                {aiPrep.likely_questions.map((question, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="rounded-xl border border-border bg-card p-4 space-y-3"
                  >
                    <div className="flex items-start gap-3">
                      <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-violet-500/10 text-violet-600 text-xs font-medium">
                        {index + 1}
                      </span>
                      <p className="text-sm font-medium text-foreground pt-0.5">{question}</p>
                    </div>
                    <Textarea
                      placeholder="Type your answer here to practice..."
                      value={practiceAnswers[index] || ''}
                      onChange={(e) =>
                        setPracticeAnswers((prev) => ({ ...prev, [index]: e.target.value }))
                      }
                      rows={3}
                      className="resize-none"
                    />
                  </motion.div>
                ))}
              </AnimatePresence>
            </TabsContent>
          </ScrollArea>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
