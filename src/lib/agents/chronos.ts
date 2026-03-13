
import { supabase } from '@/lib/supabase';

interface CalendarEvent {
    start_time: string;
    end_time: string;
}

export const findInterviewSlot = async (userId: string, durationMinutes: number): Promise<string> => {
    const now = new Date();
    const sevenDaysFromNow = new Date();
    sevenDaysFromNow.setDate(now.getDate() + 7);

    const { data: events, error } = await supabase
        .from('calendar_events')
        .select('start_time, end_time')
        .eq('user_id', userId)
        .gte('start_time', now.toISOString())
        .lte('end_time', sevenDaysFromNow.toISOString());

    if (error) {

        throw new Error('Failed to find interview slot');
    }

    // Work hours: 9 AM to 6 PM (local time implies we need to handle timezones, but for simplicity assuming simplistic local check or UTC if stored as such. 
    // The prompt implies simple logic. I'll construct dates based on the current day.)

    for (let i = 0; i < 7; i++) {
        const currentDay = new Date();
        currentDay.setDate(now.getDate() + i);
        currentDay.setSeconds(0, 0);

        // Set work hours for this day: 9 AM
        const workStart = new Date(currentDay);
        workStart.setHours(9, 0, 0, 0);

        // Set work hours for this day: 6 PM
        const workEnd = new Date(currentDay);
        workEnd.setHours(18, 0, 0, 0);

        // If currentDay is today, and it's already past 6 PM, skip
        if (i === 0 && now > workEnd) continue;

        // If currentDay is today, start checking from now (or next hour) if it's within work hours
        let potentialStart = new Date(workStart);
        if (i === 0 && now > workStart) {
            // Round up to next 30 min or just use now? Let's simply use now if it's after 9am
            potentialStart = new Date(now);
            // Maybe add a buffer so it's not "right now"? 
            // Let's stick to simple logic: scan from max(now, 9am) to 6pm
        }

        // We scan in steps (e.g. 30 min) or just look for gaps? 
        // Simplest approach: "Look for a free gap". 
        // We can iterate minute by minute or every 15 mins? 
        // Or we can sort events and find gaps.

        // Let's sort events for this day
        const dayEvents = (events || [])
            .map((e: any) => ({ start: new Date(e.start_time), end: new Date(e.end_time) }))
            .filter(e => e.start < workEnd && e.end > workStart) // overlaps with work day
            .sort((a, b) => a.start.getTime() - b.start.getTime());

        // Check gap from potentialStart to first event
        // Then gap between events
        // Then gap from last event to workEnd

        let validStart = null;

        let currentSearch = potentialStart;

        // Check gap before first event
        if (dayEvents.length === 0) {
            // Whole day is free from currentSearch to workEnd
            const diffMinutes = (workEnd.getTime() - currentSearch.getTime()) / 60000;
            if (diffMinutes >= durationMinutes) {
                validStart = currentSearch;
            }
        } else {
            // Gap before first event
            for (const event of dayEvents) {
                const diffMinutes = (event.start.getTime() - currentSearch.getTime()) / 60000;
                if (diffMinutes >= durationMinutes) {
                    validStart = currentSearch;
                    break;
                }
                // Move currentSearch to end of this event
                if (event.end > currentSearch) {
                    currentSearch = event.end;
                }
            }

            // Check after last event
            if (!validStart) {
                const diffMinutes = (workEnd.getTime() - currentSearch.getTime()) / 60000;
                if (diffMinutes >= durationMinutes) {
                    validStart = currentSearch;
                }
            }
        }

        if (validStart) {
            // Format date string
            const dateStr = validStart.toLocaleDateString();
            const timeStr = validStart.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
            return `I found a free slot for your interview on ${dateStr} at ${timeStr}. Shall I book it?`;
        }
    }

    return 'Your week is fully booked. Suggest next Monday.';
};
