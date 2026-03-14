import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, X, Send, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import { supabase } from '@/lib/supabase_v2';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
}

interface ProfileChatBotProps {
  profileId: string;
  profileName: string;
  slug?: string;
}

const CHAT_URL = `https://fjmcjsffeycwygicflfk.supabase.co/functions/v1/profile-chat`;
const HARDCODED_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZqbWNqc2ZmZXljd3lnaWNmbGZrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzAwMzA0MjYsImV4cCI6MjA4NTYwNjQyNn0.blzGaOlPRVyM90RWoA7tshfGBXFPdkY6XWaspMdOou8";

const QUALIFYING_QUESTIONS = [
  "Hi! Before I share details, which company are you reaching out from?",
  "Great, thanks! What role are you looking to fill?",
  "And what's your timeline for this hire?",
];

export function ProfileChatBot({ profileId, profileName, slug }: ProfileChatBotProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [qualificationStep, setQualificationStep] = useState(0);
  const [visitorCompany, setVisitorCompany] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'initial',
      role: 'assistant',
      content: QUALIFYING_QUESTIONS[0],
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: crypto.randomUUID(),
      role: 'user',
      content: input.trim(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');

    if (qualificationStep < QUALIFYING_QUESTIONS.length) {
      if (qualificationStep === 0) setVisitorCompany(userMessage.content);
      const nextStep = qualificationStep + 1;
      setQualificationStep(nextStep);

      if (nextStep < QUALIFYING_QUESTIONS.length) {
        setMessages((prev) => [
          ...prev,
          { id: crypto.randomUUID(), role: 'assistant', content: QUALIFYING_QUESTIONS[nextStep] },
        ]);
        return;
      } else {
        setMessages((prev) => [
          ...prev,
          {
            id: crypto.randomUUID(),
            role: 'assistant',
            content: `Thanks for the context! I'm ready to tell you about ${profileName || 'this professional'}. What would you like to know?`,
          },
        ]);
        return;
      }
    }

    setIsLoading(true);
    const assistantId = crypto.randomUUID();

    setMessages((prev) => [
      ...prev,
      { id: assistantId, role: 'assistant', content: '' },
    ]);

    try {
      const conversationHistory = messages
        .filter((m) => m.id !== 'initial')
        .map((m) => ({ role: m.role, content: m.content }));

      const headers = {
        'Content-Type': 'application/json',
        'apikey': HARDCODED_ANON_KEY,
        'Authorization': `Bearer ${HARDCODED_ANON_KEY}`,
      };

      const response = await fetch(CHAT_URL, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          userQuery: userMessage.content,
          profileId,
          portfolioSlug: slug || 'default',
          conversationHistory,
          visitorCompany,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text().catch(() => "Unknown Error");
        throw new Error(errorText);
      }

      const data = await response.json();
      const reply = data.reply || data.content || "Neural Sync: Connectivity restored.";

      setMessages((prev) =>
        prev.map((m) =>
          m.id === assistantId ? { ...m, content: reply } : m
        )
      );
    } catch (error: any) {
      console.error("Neural Sync Error:", error);
      setMessages((prev) =>
        prev.map((m) =>
          m.id === assistantId
            ? { ...m, content: `Neural Sync Error: ${error.message || "Core offline"}.` }
            : m
        )
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <>
      <motion.button
        onClick={() => setIsOpen(true)}
        className={cn(
          "fixed bottom-24 right-6 z-[100] h-14 w-14 rounded-full bg-primary text-primary-foreground shadow-lg flex items-center justify-center transition-colors hover:bg-primary/90",
          isOpen && "hidden"
        )}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
      >
        <MessageSquare className="h-6 w-6" />
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-24 right-6 z-[100] w-[380px] max-w-[calc(100vw-3rem)] bg-background border border-border rounded-2xl shadow-2xl overflow-hidden"
          >
            <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-muted/50">
              <div className="flex items-center gap-2">
                <MessageSquare className="h-4 w-4 text-primary" />
                <p className="text-sm font-medium">Chat with {profileName}</p>
              </div>
              <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setIsOpen(false)}>
                <X className="h-4 w-4" />
              </Button>
            </div>

            <ScrollArea className="h-[350px] p-4" ref={scrollRef}>
              <div className="space-y-4">
                {messages.map((message) => (
                  <div key={message.id} className={cn("flex", message.role === 'user' ? "justify-end" : "justify-start")}>
                    <div className={cn("max-w-[85%] rounded-2xl px-4 py-2.5 text-sm", message.role === 'user' ? "bg-primary text-primary-foreground rounded-br-md" : "bg-muted text-foreground rounded-bl-md")}>
                      {message.content || <Loader2 className="h-3 w-3 animate-spin" />}
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>

            <div className="p-4 border-t border-border bg-muted/30">
              <div className="flex gap-2">
                <Input
                  ref={inputRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Ask a question..."
                  disabled={isLoading}
                  className="flex-1 bg-background"
                />
                <Button onClick={sendMessage} disabled={!input.trim() || isLoading} size="icon">
                  {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
