import { getSupabaseClient } from './supabaseClient';

export interface SyncMessage<T = unknown> {
  type: string;
  payload: T;
  senderId: string;
  timestamp: number;
}

type SyncHandler = (message: SyncMessage) => void;

class RealtimeSyncManager {
  private broadcastChannel: BroadcastChannel | null = null;
  private handlers: Set<SyncHandler> = new Set();
  private clientId: string = 'client_' + Math.random().toString(36).substring(2, 9);
  private supabaseChannel: any = null;
  private isSupabaseSubscribed = false;

  constructor() {
    // Initialize BroadcastChannel if available
    if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
      try {
        this.broadcastChannel = new BroadcastChannel('offrails_events');
        this.broadcastChannel.onmessage = (event) => {
          if (event.data && event.data.senderId !== this.clientId) {
            this.notifyHandlers(event.data);
          }
        };
      } catch (e) {
        console.warn('BroadcastChannel initialization failed:', e);
      }
    }

    // Storage event fallback for older browsers or if BroadcastChannel is restricted
    if (typeof window !== 'undefined') {
      window.addEventListener('storage', (e) => {
        if ((e.key === 'offrails_last_event' || e.key === 'railsync_last_event') && e.newValue) {
          try {
            const data: SyncMessage = JSON.parse(e.newValue);
            if (data && data.senderId !== this.clientId) {
              this.notifyHandlers(data);
            }
          } catch (err) {
            // Ignore parse errors
          }
        }
      });
    }

    this.initSupabaseRealtime();
  }

  public initSupabaseRealtime() {
    const supabase = getSupabaseClient();
    if (supabase && !this.isSupabaseSubscribed) {
      try {
        this.supabaseChannel = supabase.channel('offrails_room');
        this.supabaseChannel
          .on('broadcast', { event: 'state_action' }, (payload: any) => {
            if (payload && payload.payload && payload.payload.senderId !== this.clientId) {
              this.notifyHandlers(payload.payload);
            }
          })
          .subscribe((status: string) => {
            if (status === 'SUBSCRIBED') {
              this.isSupabaseSubscribed = true;
              console.log('[OFF-RAILS] Connected to Supabase Realtime channel');
            }
          });
      } catch (e) {
        console.warn('Supabase realtime subscription failed:', e);
      }
    }
  }

  public subscribe(handler: SyncHandler): () => void {
    this.handlers.add(handler);
    return () => {
      this.handlers.delete(handler);
    };
  }

  public broadcast(type: string, payload: any) {
    const message: SyncMessage = {
      type,
      payload,
      senderId: this.clientId,
      timestamp: Date.now(),
    };

    // 1. BroadcastChannel (fast local tab sync)
    if (this.broadcastChannel) {
      try {
        this.broadcastChannel.postMessage(message);
      } catch (e) {
        console.warn('BroadcastChannel postMessage failed:', e);
      }
    }

    // 2. LocalStorage event trigger
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('offrails_last_event', JSON.stringify(message));
      } catch (e) {
        // storage quota or incognito
      }
    }

    // 3. Supabase Realtime Broadcast (cross-device over internet)
    if (this.supabaseChannel && this.isSupabaseSubscribed) {
      try {
        this.supabaseChannel.send({
          type: 'broadcast',
          event: 'state_action',
          payload: message,
        });
      } catch (e) {
        console.warn('Supabase send failed:', e);
      }
    }
  }

  private notifyHandlers(message: SyncMessage) {
    this.handlers.forEach((handler) => {
      try {
        handler(message);
      } catch (err) {
        console.error('Error in sync handler:', err);
      }
    });
  }

  public getClientId(): string {
    return this.clientId;
  }
}

export const realtimeSync = new RealtimeSyncManager();
