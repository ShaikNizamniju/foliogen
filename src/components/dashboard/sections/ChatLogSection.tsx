import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase_v2';
import { useAuth } from '@/contexts/AuthContext';
import { Card } from '@/components/ui/card';
import { MessageSquareText, Building2, Clock } from 'lucide-react';
import { format } from 'date-fns';
import { useGlobalData } from '@/pages/Dashboard';

interface ChatQuery {
  id: string;
  visitor_company: string | null;
  visitor_question: string | null;
  ai_response: string | null;
  created_at: string;
}

export function ChatLogSection() {
  const { user } = useAuth();

  const globalData = useGlobalData();
  const [localQueries, setLocalQueries] = useState<ChatQuery[]>([]);
  const [localLoading, setLocalLoading] = useState(true);

  const queries = globalData ? globalData.chats : localQueries;
  const loading = globalData ? (globalData.chatStatus !== 'success') : localLoading;
  const setQueriesState = globalData ? (data: any) => globalData.setGlobalData((prev: any) => ({ ...prev, chats: data })) : setLocalQueries;

  useEffect(() => {
    // Skip if cached
    if (globalData && globalData.chatStatus === 'success') return;

    if (!user) {
      if (!globalData) setLocalLoading(false);
      return;
    }
    const fetchQueries = async () => {
      if (!globalData) setLocalLoading(true);
      const { data } = await supabase
        .from('chat_queries')
        .select('*')
        .eq('profile_user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(100);
      setQueriesState((data as ChatQuery[]) || []);
      if (!globalData) setLocalLoading(false);
    };
    fetchQueries();
  }, [user, globalData, setQueriesState]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Chat Log</h1>
        <p className="text-muted-foreground mt-1">
          Track questions visitors have asked about your portfolio.
        </p>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-16">
          <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
        </div>
      ) : queries.length === 0 ? (
        <Card className="p-12 text-center border-dashed">
          <MessageSquareText className="h-10 w-10 text-muted-foreground/40 mx-auto mb-3" />
          <p className="text-muted-foreground text-sm">No visitor chats yet. Share your portfolio to start receiving queries.</p>
        </Card>
      ) : (
        <div className="space-y-3">
          {queries.map((q) => (
            <Card key={q.id} className="p-4 border-border/50 bg-card/50">
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-lg bg-primary/10 shrink-0 mt-0.5">
                  <Building2 className="h-4 w-4 text-primary" />
                </div>
                <div className="flex-1 min-w-0 space-y-2">
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    {q.visitor_company && (
                      <span className="font-medium text-foreground">{q.visitor_company}</span>
                    )}
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {format(new Date(q.created_at), 'MMM d, yyyy · h:mm a')}
                    </span>
                  </div>
                  {q.visitor_question && (
                    <p className="text-sm font-medium text-foreground">{q.visitor_question}</p>
                  )}
                  {q.ai_response && (
                    <p className="text-sm text-muted-foreground line-clamp-3">{q.ai_response}</p>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
