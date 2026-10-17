import { BudgetItem } from '../types/travel';
import { getStoredBudgetPasscode } from './budgetAuth';

export interface BudgetApiResponse {
  success: boolean;
  count?: number;
  items?: BudgetItem[];
  item?: BudgetItem;
  message?: string;
  role?: string;
}

function getAuthHeaders(): HeadersInit {
  const passcode = getStoredBudgetPasscode();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json'
  };
  if (passcode) {
    headers['x-budget-password'] = passcode;
  }
  return headers;
}

async function safeParseJson(res: Response): Promise<BudgetApiResponse | null> {
  const contentType = res.headers.get('content-type') || '';
  if (!contentType.includes('application/json')) {
    return null;
  }
  try {
    return (await res.json()) as BudgetApiResponse;
  } catch {
    return null;
  }
}

// Fetch all budget items from DB
export async function fetchBudgetFromDB(passcodeOverride?: string): Promise<BudgetItem[] | null> {
  try {
    const passcode = passcodeOverride || getStoredBudgetPasscode();
    if (!passcode) return null;

    const res = await fetch('/api/budget', {
      cache: 'no-store',
      headers: {
        Accept: 'application/json',
        'x-budget-password': passcode
      }
    });
    if (!res.ok) {
      if (res.status === 401) {
        console.warn('Unauthorized budget access. Valid passcode required.');
      }
      return null;
    }
    const data = await safeParseJson(res);
    if (data && data.success && Array.isArray(data.items)) {
      return data.items;
    }
  } catch {
    // Offline or static preview mode: silently fallback to local cache
  }
  return null;
}

// Save or sync all budget items to DB
export async function syncBudgetToDB(items: BudgetItem[]): Promise<boolean> {
  try {
    const res = await fetch('/api/budget/sync', {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify({ items })
    });
    if (!res.ok) return false;
    const data = await safeParseJson(res);
    return !!data?.success;
  } catch {
    return false;
  }
}

// Add a single budget item to DB
export async function addBudgetItemToDB(item: BudgetItem): Promise<BudgetItem | null> {
  try {
    const res = await fetch('/api/budget', {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(item)
    });
    if (!res.ok) return null;
    const data = await safeParseJson(res);
    if (data?.success && data.item) {
      return data.item;
    }
  } catch {
    // Fallback to local state
  }
  return null;
}

// Update an existing budget item in DB
export async function updateBudgetItemInDB(
  id: string,
  updates: Partial<BudgetItem>
): Promise<BudgetItem | null> {
  try {
    const res = await fetch(`/api/budget/${encodeURIComponent(id)}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(updates)
    });
    if (!res.ok) return null;
    const data = await safeParseJson(res);
    if (data?.success && data.item) {
      return data.item;
    }
  } catch {
    // Fallback to local state
  }
  return null;
}

// Delete item by ID from DB
export async function deleteBudgetItemFromDB(id: string): Promise<boolean> {
  try {
    const res = await fetch(`/api/budget/${encodeURIComponent(id)}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });
    if (!res.ok) return false;
    const data = await safeParseJson(res);
    return !!data?.success;
  } catch {
    return false;
  }
}

// Reset DB with default items
export async function resetBudgetInDB(defaultItems: BudgetItem[]): Promise<boolean> {
  try {
    const res = await fetch('/api/budget/reset', {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ defaultItems })
    });
    if (!res.ok) return false;
    const data = await safeParseJson(res);
    return !!data?.success;
  } catch {
    return false;
  }
}
