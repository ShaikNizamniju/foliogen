import { supabase } from './supabase_v2';

export type AnalyticsEvent = 
  | 'resume_upload_success'
  | 'persona_switch'
  | 'checkout_started'
  | 'payment_success_viewed'
  | 'feedback_submitted';

export async function trackEvent(eventName: AnalyticsEvent, metadata: Record<string, any> = {}) {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    const eventData = {
      event_name: eventName,
      user_id: user?.id || null,
      metadata: metadata,
      created_at: new Date().toISOString(),
    };

    console.log(`Analytics Event Logged: [${eventName}]`, metadata);

    const { error } = await supabase
      .from('analytics_events')
      .insert(eventData);

    if (error) {
      console.warn('Failed to log analytics event to database:', error.message);
    }
  } catch (err) {
    console.error('Error in trackEvent:', err);
  }
}
