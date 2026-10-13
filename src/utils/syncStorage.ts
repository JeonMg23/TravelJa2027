import { TripDay, SpotComment, ChecklistItem, BudgetItem, FriendCompanion } from '../types/travel';

const STORAGE_KEY_DAYS = 'tokyo_trip_days_v8';
const STORAGE_KEY_COMMENTS = 'tokyo_trip_comments_v1';
const STORAGE_KEY_CHECKLIST = 'tokyo_trip_checklist_v3';
const STORAGE_KEY_BUDGET = 'tokyo_trip_budget_v6';
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
    const raw =
      localStorage.getItem(STORAGE_KEY_DAYS) ||
      localStorage.getItem('tokyo_trip_days_v6') ||
      localStorage.getItem('tokyo_trip_days_v5');
    if (raw) {
      const parsed: TripDay[] = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        // Merge newest default spots (including new izakayas and tips) while retaining user likes and custom spots
        const merged = defaultDays.map((defaultDay) => {
          const userDay = parsed.find((p) => p.dayNumber === defaultDay.dayNumber);
          if (!userDay) return defaultDay;

          const defaultSpotIds = new Set(defaultDay.spots.map((s) => s.id));
          // Preserve any custom spots the user added to this day
          const userCustomSpots = userDay.spots.filter((s) => !defaultSpotIds.has(s.id));

          // For default spots, update to newest tips & recommendedFoods (izakayas) while preserving user likes/notes
          const updatedDefaultSpots = defaultDay.spots.map((defaultSpot) => {
            const userSpot = userDay.spots.find((us) => us.id === defaultSpot.id);
            if (!userSpot) return defaultSpot;
            return {
              ...defaultSpot,
              likes: userSpot.likes ?? defaultSpot.likes,
              hasLiked: userSpot.hasLiked ?? defaultSpot.hasLiked,
              userNotes: userSpot.userNotes || defaultSpot.userNotes
            };
          });

          return {
            ...defaultDay,
            spots: [...updatedDefaultSpots, ...userCustomSpots]
          };
        });

        localStorage.setItem(STORAGE_KEY_DAYS, JSON.stringify(merged));
        return merged;
      }
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
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.some((c) => c.author.includes('현우맘') || c.author.includes('세현맘'))) {
        return parsed;
      }
    }
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
    const rawV3 = localStorage.getItem(STORAGE_KEY_CHECKLIST);
    if (rawV3) {
      const parsed: ChecklistItem[] = JSON.parse(rawV3);
      if (Array.isArray(parsed) && parsed.length > 0) {
        // Merge missing default items so newly added travel essentials appear automatically
        const existingIds = new Set(parsed.map((item) => item.id));
        const existingTexts = new Set(parsed.map((item) => item.text.trim()));
        const missingDefaults = defaultChecklist.filter(
          (d) => !existingIds.has(d.id) && !existingTexts.has(d.text.trim())
        );

        if (missingDefaults.length > 0) {
          const merged = [...parsed, ...missingDefaults];
          localStorage.setItem(STORAGE_KEY_CHECKLIST, JSON.stringify(merged));
          return merged;
        }
        return parsed;
      }
    }

    // When migrating from legacy v2 or v1, user specifically requested all items unchecked with muffler and gloves added
    const rawLegacy =
      localStorage.getItem('tokyo_trip_checklist_v2') ||
      localStorage.getItem('tokyo_trip_checklist_v1');
    if (rawLegacy) {
      const parsedLegacy: ChecklistItem[] = JSON.parse(rawLegacy);
      if (Array.isArray(parsedLegacy)) {
        // Keep any user-added custom items from previous sessions, but ensure all items start unchecked
        const defaultIds = new Set(defaultChecklist.map((d) => d.id));
        const defaultTexts = new Set(defaultChecklist.map((d) => d.text.trim()));
        const customItems = parsedLegacy
          .filter((p) => !defaultIds.has(p.id) && !defaultTexts.has(p.text.trim()))
          .map((item) => ({ ...item, completed: false }));

        const allUnchecked = [...defaultChecklist.map((d) => ({ ...d, completed: false })), ...customItems];
        localStorage.setItem(STORAGE_KEY_CHECKLIST, JSON.stringify(allUnchecked));
        return allUnchecked;
      }
    }
  } catch {
    // fallback to defaults
  }
  return defaultChecklist;
}

export function resetSavedChecklist(defaultChecklist: ChecklistItem[]): ChecklistItem[] {
  try {
    localStorage.setItem(STORAGE_KEY_CHECKLIST, JSON.stringify(defaultChecklist));
    broadcastSync({ type: 'CHECKLIST_UPDATE', data: defaultChecklist, timestamp: Date.now() });
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
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        // Ensure items have proper structure
        return parsed.map((item: any) => ({
          ...item,
          type: item.type || 'EXPENSE',
          paymentMethod: item.paymentMethod || (item.paidBy === '공동경비' || item.paidBy?.includes('현금') ? 'CASH' : 'CARD'),
          scope: item.scope || (item.paidBy === '공동경비' || item.paidBy?.includes('현금') ? 'SHARED' : 'HYEONWOO'),
          paidBy: item.paidBy || '공동경비(현금)'
        }));
      }
    }
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
  try {
    const passcode = localStorage.getItem('tokyo_budget_passcode');
    if (passcode && ['3539', '0901'].includes(passcode)) {
      fetch('/api/budget/sync', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'x-budget-password': passcode
        },
        body: JSON.stringify({ items: budget })
      }).catch(() => {
        // offline or dev fallback
      });
    }
  } catch {
    // ignore
  }
}

export function resetSavedBudget(defaultBudget: BudgetItem[]): BudgetItem[] {
  try {
    localStorage.setItem(STORAGE_KEY_BUDGET, JSON.stringify(defaultBudget));
    broadcastSync({ type: 'BUDGET_UPDATE', data: defaultBudget, timestamp: Date.now() });
  } catch {
    // fallback
  }
  try {
    const passcode = localStorage.getItem('tokyo_budget_passcode');
    if (passcode && ['3539', '0901'].includes(passcode)) {
      fetch('/api/budget/reset', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-budget-password': passcode
        },
        body: JSON.stringify({ defaultItems: defaultBudget })
      }).catch(() => {
        // offline or dev fallback
      });
    }
  } catch {
    // ignore
  }
  return defaultBudget;
}

export function loadSavedCompanions(defaultCompanions: FriendCompanion[]): FriendCompanion[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_COMPANIONS);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.some((c) => c.name.includes('현우맘'))) {
        return parsed;
      }
    }
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
