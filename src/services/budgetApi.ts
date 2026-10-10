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

// Fetch all budget items from DB
export async function fetchBudgetFromDB(passcodeOverride?: string): Promise<BudgetItem[] | null> {
  try {
    const passcode = passcodeOverride || getStoredBudgetPasscode();
    if (!passcode) return null;

    const res = await fetch('/api/budget', {
      headers: {
        'x-budget-password': passcode
      }
    });
    if (!res.ok) {
      if (res.status === 401) {
        console.warn('Unauthorized budget access. Valid passcode required.');
      }
      return null;
    }
    const data: BudgetApiResponse = await res.json();
    if (data.success && Array.isArray(data.items)) {
      return data.items;
    }
  } catch (err) {
    console.warn('Backend DB not available or offline, fallback to local cache:', err);
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
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data: BudgetApiResponse = await res.json();
    return !!data.success;
  } catch (err) {
    console.warn('Failed to sync budget to DB:', err);
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
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data: BudgetApiResponse = await res.json();
    if (data.success && data.item) {
      return data.item;
    }
  } catch (err) {
    console.warn('Failed to add budget item to DB:', err);
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
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data: BudgetApiResponse = await res.json();
    if (data.success && data.item) {
      return data.item;
    }
  } catch (err) {
    console.warn('Failed to update budget item in DB:', err);
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
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data: BudgetApiResponse = await res.json();
    return !!data.success;
  } catch (err) {
    console.warn('Failed to delete budget item from DB:', err);
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
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data: BudgetApiResponse = await res.json();
    return !!data.success;
  } catch (err) {
    console.warn('Failed to reset budget in DB:', err);
    return false;
  }
}
