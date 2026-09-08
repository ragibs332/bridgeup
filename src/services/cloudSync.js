/**
 * BridgeUp Real-Time Cross-Device Cloud Synchronization Service
 * 
 * Synchronizes incidents, NGO resolutions, adoptions, campaigns, and user accounts
 * across ALL physical devices (Phones, Tablets, PCs, Web, and Native Android App)
 * via high-availability persistent cloud backend.
 */

const CLOUD_OBJECT_ID = 'ff808181a067127101a08227f4b14cc7';
const CLOUD_API_URL = `https://api.restful-api.dev/objects/${CLOUD_OBJECT_ID}`;

// Local BroadcastChannel for same-device tabs
let broadcastChannel = null;
try {
  if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
    broadcastChannel = new BroadcastChannel('bridgeup_cross_device_sync');
  }
} catch (e) {
  console.warn('BroadcastChannel not supported', e);
}

let syncListeners = [];
let isPushing = false;
let isFetching = false;
let lastCloudSyncTimestamp = 0;

export function subscribeToCloudSync(callback) {
  syncListeners.push(callback);
  return () => {
    syncListeners = syncListeners.filter(cb => cb !== callback);
  };
}

function notifySyncListeners(data) {
  syncListeners.forEach(cb => {
    try {
      cb(data);
    } catch (e) {
      console.error('Error notifying sync listener:', e);
    }
  });
}

// Listen to local BroadcastChannel
if (broadcastChannel) {
  broadcastChannel.onmessage = (event) => {
    if (event?.data?.type === 'CLOUD_DATA_UPDATE') {
      notifySyncListeners(event.data.payload);
    }
  };
}

/**
 * Fetch latest global state from Cloud API
 */
export async function pullFromCloud() {
  if (isFetching || isPushing) return null;
  isFetching = true;

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 6000);

    const response = await fetch(CLOUD_API_URL, {
      method: 'GET',
      headers: { 'Accept': 'application/json' },
      signal: controller.signal
    });
    clearTimeout(timeoutId);

    if (response.ok) {
      const result = await response.json();
      const cloudData = result?.data;
      if (cloudData && typeof cloudData === 'object') {
        lastCloudSyncTimestamp = Date.now();
        notifySyncListeners({
          type: 'FULL_SYNC',
          payload: cloudData,
          timestamp: lastCloudSyncTimestamp
        });
        isFetching = false;
        return cloudData;
      }
    }
  } catch (err) {
    // Network / offline fallback
    console.debug('Cloud pull notice (offline or connecting):', err?.message);
  }

  isFetching = false;
  return null;
}

/**
 * Push full updated state to Cloud API and broadcast across devices
 */
export async function pushFullStateToCloud(state) {
  if (!state || isPushing) return;
  isPushing = true;

  const payload = {
    incidents: state.incidents || [],
    ngos: state.ngos || [],
    registeredUsers: state.registeredUsers || [],
    adoptions: state.adoptions || [],
    campaigns: state.campaigns || [],
    requirements: state.requirements || [],
    lastUpdated: Date.now()
  };

  // 1. Broadcast locally
  if (broadcastChannel) {
    try {
      broadcastChannel.postMessage({
        type: 'CLOUD_DATA_UPDATE',
        payload: { type: 'FULL_SYNC', payload, timestamp: Date.now() }
      });
    } catch (e) {}
  }

  // 2. Push to persistent Global Cloud API
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 8000);

    await fetch(CLOUD_API_URL, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        name: 'bridgeup_global_state_v1',
        data: payload
      }),
      signal: controller.signal
    });
    clearTimeout(timeoutId);
    lastCloudSyncTimestamp = Date.now();
  } catch (err) {
    console.warn('Failed to push state to cloud:', err?.message);
  } finally {
    isPushing = false;
  }
}

/**
 * Merge remote and local entity arrays (deduplicates by ID and prefers latest updates)
 */
export function mergeEntities(localList = [], remoteList = []) {
  if (!Array.isArray(remoteList) || !remoteList.length) return localList;
  if (!Array.isArray(localList) || !localList.length) return remoteList;

  const map = new Map();
  // Add local first
  localList.forEach(item => {
    if (item && item.id) map.set(item.id, item);
  });

  // Merge remote items
  remoteList.forEach(item => {
    if (item && item.id) {
      const existing = map.get(item.id);
      if (!existing) {
        map.set(item.id, item);
      } else {
        // If remote has newer updatedAt timestamp or status update, accept remote
        const remoteTime = item.updatedAt || 0;
        const localTime = existing.updatedAt || 0;
        if (remoteTime >= localTime) {
          map.set(item.id, { ...existing, ...item });
        }
      }
    }
  });

  return Array.from(map.values());
}
