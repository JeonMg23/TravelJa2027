import { TripDay, SpotComment, ChecklistItem, BudgetItem, FriendCompanion } from '../types/travel';

const STORAGE_KEY_DAYS = 'tokyo_trip_days_v5';
const STORAGE_KEY_COMMENTS = 'tokyo_trip_comments_v1';
const STORAGE_KEY_CHECKLIST = 'tokyo_trip_checklist_v1';
const STORAGE_KEY_BUDGET = 'tokyo_trip_budget_v5';
const STORAGE_KEY_COMPANIONS = 'tokyo_trip_companions_v1';

// Cross-tab real-time sync channel
let syncChannel: BroadcastChannel | null = null;
try {
  if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
    syncChannel = new BroadcastChannel('tokyo_trip_sync_channel');
  }
} catch {
  // Graceful fallback for non-supported environments
  syncChannel = null;
}

export interface SyncPayload {
  type: 'DAYS_UPDATE' | 'COMMENT_ADD' | 'CHECKLIST_UPDATE' | 'BUDGET_UPDATE' | 'PRESENCE_UPDATE';
  data: unknown;
  timestamp: number;
}

export function subscribeToSync(onSyncMessage: (payload: SyncPayload) => void): () => void {
  if (!syncChannel) {
    // Fallback to storage event
    const handleStorage = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY_DAYS && e.newValue) {
        try {
          onSyncMessage({
            type: 'DAYS_UPDATE',
            data: JSON.parse(e.newValue),
            timestamp: Date.now()
          });
        } catch {
          // parse error
        }
      }
    };
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }

  const handler = (event: MessageEvent<SyncPayload>) => {
    if (event.data) {
      onSyncMessage(event.data);
    }
  };

  syncChannel.addEventListener('message', handler);
  return () => {
    syncChannel?.removeEventListener('message', handler);
  };
}

export function broadcastSync(payload: SyncPayload): void {
  if (syncChannel) {
    syncChannel.postMessage(payload);
  }
}

export function loadSavedDays(defaultDays: TripDay[]): TripDay[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_DAYS);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch {
    // fallback
  }
  return defaultDays;
}

export function saveDays(days: TripDay[]): void {
  try {
    localStorage.setItem(STORAGE_KEY_DAYS, JSON.stringify(days));
    broadcastSync({ type: 'DAYS_UPDATE', data: days, timestamp: Date.now() });
  } catch {
    // storage full or disabled
  }
}

export function loadSavedComments(defaultComments: SpotComment[]): SpotComment[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_COMMENTS);
    if (raw) return JSON.parse(raw);
  } catch {
    // fallback
  }
  return defaultComments;
}

export function saveComments(comments: SpotComment[]): void {
  try {
    localStorage.setItem(STORAGE_KEY_COMMENTS, JSON.stringify(comments));
    broadcastSync({ type: 'COMMENT_ADD', data: comments, timestamp: Date.now() });
  } catch {
    // fallback
  }
}

export function loadSavedChecklist(defaultChecklist: ChecklistItem[]): ChecklistItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_CHECKLIST);
    if (raw) return JSON.parse(raw);
  } catch {
    // fallback
  }
  return defaultChecklist;
}

export function saveChecklist(items: ChecklistItem[]): void {
  try {
    localStorage.setItem(STORAGE_KEY_CHECKLIST, JSON.stringify(items));
    broadcastSync({ type: 'CHECKLIST_UPDATE', data: items, timestamp: Date.now() });
  } catch {
    // fallback
  }
}

export function loadSavedBudget(defaultBudget: BudgetItem[]): BudgetItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_BUDGET);
    if (raw) return JSON.parse(raw);
  } catch {
    // fallback
  }
  return defaultBudget;
}

export function saveBudget(budget: BudgetItem[]): void {
  try {
    localStorage.setItem(STORAGE_KEY_BUDGET, JSON.stringify(budget));
    broadcastSync({ type: 'BUDGET_UPDATE', data: budget, timestamp: Date.now() });
  } catch {
    // fallback
  }
}

export function loadSavedCompanions(defaultCompanions: FriendCompanion[]): FriendCompanion[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_COMPANIONS);
    if (raw) return JSON.parse(raw);
  } catch {
    // fallback
  }
  return defaultCompanions;
}

export function saveCompanions(companions: FriendCompanion[]): void {
  try {
    localStorage.setItem(STORAGE_KEY_COMPANIONS, JSON.stringify(companions));
    broadcastSync({ type: 'PRESENCE_UPDATE', data: companions, timestamp: Date.now() });
  } catch {
    // fallback
  }
}
