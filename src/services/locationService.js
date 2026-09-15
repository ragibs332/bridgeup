import { Geolocation } from '@capacitor/geolocation';

/**
 * Reverse-geocodes coordinates into a clean, human-readable address.
 * Uses Nominatim (OSM) as primary, BigDataCloud as secondary fallback.
 */
export async function reverseGeocode(lat, lng) {
  if (!lat || !lng) return null;

  // 1. Try OpenStreetMap Nominatim
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3500);

    const res = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`,
      {
        signal: controller.signal,
        headers: {
          'Accept-Language': 'en',
          'User-Agent': 'BridgeUp-Emergency-App/1.0'
        }
      }
    );
    clearTimeout(timeoutId);

    if (res.ok) {
      const data = await res.json();
      if (data && data.address) {
        const addr = data.address;
        const street = addr.road || addr.pedestrian || addr.footway || addr.suburb || addr.neighbourhood || addr.residential || '';
        const area = addr.suburb || addr.neighbourhood || addr.city_district || '';
        const city = addr.city || addr.town || addr.village || addr.county || '';
        const state = addr.state || '';

        const parts = [street, area !== street ? area : '', city, state].filter(Boolean);
        if (parts.length > 0) {
          const readable = parts.slice(0, 3).join(', ');
          return `${readable} (${Number(lat).toFixed(4)}° N, ${Number(lng).toFixed(4)}° E)`;
        }
        if (data.display_name) {
          const shortName = data.display_name.split(',').slice(0, 3).join(',').trim();
          return `${shortName} (${Number(lat).toFixed(4)}° N, ${Number(lng).toFixed(4)}° E)`;
        }
      }
    }
  } catch (err) {
    // Silently fall through to secondary reverse geocoder
  }

  // 2. Try BigDataCloud Client Reverse Geocode (free, fast, no rate limit)
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3000);

    const res = await fetch(
      `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lng}&localityLanguage=en`,
      { signal: controller.signal }
    );
    clearTimeout(timeoutId);

    if (res.ok) {
      const data = await res.json();
      const locality = data.locality || data.localityInfo?.administrative?.[3]?.name || '';
      const city = data.city || data.principalSubdivision || '';
      const parts = [locality, city].filter(Boolean);
      if (parts.length > 0) {
        return `${parts.join(', ')} (${Number(lat).toFixed(4)}° N, ${Number(lng).toFixed(4)}° E)`;
      }
    }
  } catch (err) {
    // Fall back to coordinate string
  }

  // Fallback: Formatted GPS string
  return `GPS Location (${Number(lat).toFixed(4)}° N, ${Number(lng).toFixed(4)}° E)`;
}

/**
 * Fetches approximate location using public IP geolocation APIs.
 * Useful when device GPS chip is disabled or permissions are blocked.
 */
export async function getIpLocation() {
  // Try freeipapi.com
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 4000);
    const res = await fetch('https://freeipapi.com/api/json', { signal: controller.signal });
    clearTimeout(timeoutId);

    if (res.ok) {
      const data = await res.json();
      if (data && data.latitude && data.longitude) {
        const city = data.cityName || '';
        const region = data.regionName || '';
        const country = data.countryName || 'India';
        const label = [city, region, country].filter(Boolean).join(', ');
        return {
          success: true,
          coordinates: { lat: Number(data.latitude), lng: Number(data.longitude) },
          accuracy: 2500, // Estimated IP accuracy in meters
          address: `${label} (Approx. Network Location: ${Number(data.latitude).toFixed(4)}° N, ${Number(data.longitude).toFixed(4)}° E)`,
          source: 'ip'
        };
      }
    }
  } catch (err) {
    // Try secondary IP service
  }

  // Fallback: ipapi.co
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 4000);
    const res = await fetch('https://ipapi.co/json/', { signal: controller.signal });
    clearTimeout(timeoutId);

    if (res.ok) {
      const data = await res.json();
      if (data && data.latitude && data.longitude) {
        const city = data.city || '';
        const region = data.region || '';
        const label = [city, region].filter(Boolean).join(', ');
        return {
          success: true,
          coordinates: { lat: Number(data.latitude), lng: Number(data.longitude) },
          accuracy: 3000,
          address: `${label} (Approx. Network Location: ${Number(data.latitude).toFixed(4)}° N, ${Number(data.longitude).toFixed(4)}° E)`,
          source: 'ip'
        };
      }
    }
  } catch (err) {
    // Both failed
  }

  return null;
}

/**
 * Robust Live GPS locator for Capacitor Native Android & Web Browsers.
 * Tier 1: Native Capacitor / High Accuracy Satellite GPS (10s timeout)
 * Tier 2: Low-power / Wi-Fi / Cell Tower Triangulation (8s timeout)
 * Tier 3: Browser navigator.geolocation fallback
 * Tier 4: IP-based Network Geolocation fallback
 */
export async function getLiveLocation(onStatusUpdate = () => {}) {
  // Step 1: Check & Request Permissions on Native Device
  try {
    if (typeof Geolocation !== 'undefined' && Geolocation.checkPermissions) {
      const perm = await Geolocation.checkPermissions();
      if (perm.location !== 'granted') {
        onStatusUpdate('Requesting location permissions...');
        const req = await Geolocation.requestPermissions();
        if (req.location === 'denied') {
          // If denied, try IP location as gentle fallback
          const ipResult = await getIpLocation();
          if (ipResult) {
            return {
              ...ipResult,
              warning: 'GPS permission denied. Using approximate network location.'
            };
          }
          return {
            success: false,
            error: 'PERMISSION_DENIED',
            message: 'Location permission was denied. Please allow location access in your device settings.'
          };
        }
      }
    }
  } catch (permErr) {
    console.warn('Capacitor permission check bypassed:', permErr);
  }

  // Helper to execute Capacitor Geolocation with timeout
  const tryCapacitorPosition = async (highAccuracy, timeoutMs) => {
    return new Promise((resolve, reject) => {
      const timer = setTimeout(() => reject(new Error('TIMEOUT')), timeoutMs);
      Geolocation.getCurrentPosition({
        enableHighAccuracy: highAccuracy,
        timeout: timeoutMs,
        maximumAge: 10000
      })
        .then(pos => {
          clearTimeout(timer);
          resolve(pos);
        })
        .catch(err => {
          clearTimeout(timer);
          reject(err);
        });
    });
  };

  // Helper for standard navigator.geolocation fallback
  const tryBrowserPosition = (highAccuracy, timeoutMs) => {
    return new Promise((resolve, reject) => {
      if (typeof window === 'undefined' || !navigator.geolocation) {
        return reject(new Error('NOT_SUPPORTED'));
      }
      navigator.geolocation.getCurrentPosition(
        resolve,
        reject,
        { enableHighAccuracy: highAccuracy, timeout: timeoutMs, maximumAge: 10000 }
      );
    });
  };

  let rawPosition = null;
  let source = 'gps';

  // Tier 1: Try High-Accuracy GPS (Satellite)
  onStatusUpdate('Acquiring high-accuracy GPS fix...');
  try {
    rawPosition = await tryCapacitorPosition(true, 10000);
  } catch (err1) {
    console.warn('High accuracy GPS timed out or failed, falling back to standard accuracy:', err1);
    
    // Tier 2: Try Fast Standard Accuracy (Cellular / Wi-Fi Triangulation)
    onStatusUpdate('Triangulating location via Wi-Fi/Cellular...');
    try {
      rawPosition = await tryCapacitorPosition(false, 8000);
      source = 'network';
    } catch (err2) {
      console.warn('Capacitor standard location failed, testing browser navigator:', err2);
      
      // Tier 3: Direct browser navigator.geolocation
      try {
        rawPosition = await tryBrowserPosition(true, 8000);
      } catch (err3) {
        try {
          rawPosition = await tryBrowserPosition(false, 6000);
          source = 'network';
        } catch (err4) {
          console.warn('Direct browser geolocation failed:', err4);
        }
      }
    }
  }

  // If GPS / Device Position succeeded!
  if (rawPosition && rawPosition.coords) {
    const lat = rawPosition.coords.latitude;
    const lng = rawPosition.coords.longitude;
    const accuracy = Math.round(rawPosition.coords.accuracy || 10);

    onStatusUpdate('Resolving street address...');
    const address = await reverseGeocode(lat, lng);

    return {
      success: true,
      coordinates: { lat, lng },
      accuracy,
      address,
      source
    };
  }

  // Tier 4: IP-based Network Geolocation Fallback
  onStatusUpdate('Fetching approximate network location...');
  const ipResult = await getIpLocation();
  if (ipResult) {
    return {
      ...ipResult,
      warning: 'GPS satellite unavailable indoors. Used network location.'
    };
  }

  // Absolute fallback if everything is blocked or device is completely offline
  return {
    success: false,
    error: 'UNAVAILABLE',
    message: 'Could not detect live location. Please check that GPS is enabled on your phone.'
  };
}
