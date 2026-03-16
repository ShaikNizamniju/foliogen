import { supabase } from './supabase_v2';

export async function logError(component: string, error: any, metadata: Record<string, any> = {}) {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    // Detailed error logging
    const errorData = {
      component,
      error_message: error?.message || String(error),
      error_stack: error?.stack || null,
      user_id: user?.id || null,
      metadata: {
        ...metadata,
        url: window.location.href,
        userAgent: navigator.userAgent,
        timestamp: new Date().toISOString(),
      },
      created_at: new Date().toISOString(),
    };

    console.error(`[AI Error Tracker] Error in ${component}:`, errorData);

    const { error: dbError } = await supabase
      .from('error_logs')
      .insert(errorData);

    if (dbError) {
      console.warn('Failed to save error log to database:', dbError.message);
    }
  } catch (err) {
    // Fail silently to avoid interrupting the user experience
    console.error('Critical failure in logError utility:', err);
  }
}
