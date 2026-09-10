import { createClient } from '@supabase/supabase-js';

// Helper to strip accidental /rest/v1 or trailing slashes from Supabase project URLs
export function cleanSupabaseUrl(rawUrl) {
  if (!rawUrl) return '';
  let cleaned = rawUrl.trim();
  cleaned = cleaned.replace(/\/rest\/v1\/?$/i, '');
  cleaned = cleaned.replace(/\/+$/, '');
  return cleaned;
}

// Read from Environment variables or user-configured LocalStorage
export function getSupabaseCredentials() {
  const envUrl = cleanSupabaseUrl(import.meta.env.VITE_SUPABASE_URL);
  const envKey = (import.meta.env.VITE_SUPABASE_ANON_KEY || '').trim();

  let localUrl = null;
  let localKey = null;

  try {
    localUrl = cleanSupabaseUrl(localStorage.getItem('bridgeup_supabase_url'));
    localKey = (localStorage.getItem('bridgeup_supabase_anon_key') || '').trim();
  } catch (e) {}

  const url = localUrl || envUrl || '';
  const key = localKey || envKey || '';

  const isConfigured = Boolean(url && key && url.includes('supabase.co') && key.length > 20);

  return { url, key, isConfigured };
}

export function resetSupabaseClient() {
  supabaseInstance = null;
}

export function saveSupabaseCredentials(url, key) {
  try {
    const cleaned = cleanSupabaseUrl(url);
    if (cleaned) localStorage.setItem('bridgeup_supabase_url', cleaned);
    if (key) localStorage.setItem('bridgeup_supabase_anon_key', key.trim());
    resetSupabaseClient();
  } catch (e) {}
}

export async function testSupabaseConnection(testUrl, testKey) {
  const url = cleanSupabaseUrl(testUrl);
  const key = (testKey || '').trim();
  if (!url || !key) {
    return { success: false, error: 'URL and Key cannot be empty.' };
  }
  try {
    const testClient = createClient(url, key, {
      auth: { persistSession: false }
    });

    const { data, error } = await testClient.from('incidents').select('id').limit(1);
    if (error) {
      return { success: false, error: error.message };
    }
    return { success: true };
  } catch (err) {
    return { success: false, error: err?.message || 'Network request failed' };
  }
}

let supabaseInstance = null;

export function getSupabaseClient() {
  const { url, key, isConfigured } = getSupabaseCredentials();

  if (!isConfigured) return null;

  if (!supabaseInstance || supabaseInstance.supabaseUrl !== url) {
    try {
      supabaseInstance = createClient(url, key, {
        auth: { persistSession: false },
        realtime: { params: { eventsPerSecond: 10 } }
      });
    } catch (e) {
      console.warn('Could not initialize Supabase client:', e);
      return null;
    }
  }

  return supabaseInstance;
}

// ----------------------------------------------------
// INCIDENTS CLOUD API
// ----------------------------------------------------

export async function fetchCloudIncidents() {
  const client = getSupabaseClient();
  if (!client) return null;

  try {
    const { data, error } = await client
      .from('incidents')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.warn('Supabase fetch incidents notice:', error.message);
      return null;
    }

    return (data || []).map(row => ({
      id: row.id,
      title: row.title,
      category: row.category,
      severity: row.severity,
      status: row.status,
      location: row.location,
      coordinates: row.coordinates || { lat: 28.6139, lng: 77.2090 },
      description: row.description,
      photo: row.photo,
      reporterName: row.reporter_name,
      reporterEmail: row.reporter_email,
      reporterPhone: row.reporter_phone,
      createdAt: row.created_at,
      assignedNgoId: row.assigned_ngo_id,
      assignedNgoName: row.assigned_ngo_name,
      resolutionNotes: row.resolution_notes,
      resolutionPhoto: row.resolution_photo,
      resolvedAt: row.resolved_at,
      adminModerationNote: row.admin_moderation_note
    }));
  } catch (err) {
    console.warn('Supabase fetch error:', err);
    return null;
  }
}

export async function insertCloudIncident(inc) {
  const client = getSupabaseClient();
  if (!client) return false;

  try {
    const { error } = await client.from('incidents').upsert({
      id: inc.id,
      title: inc.title,
      category: inc.category,
      severity: inc.severity,
      status: inc.status || 'Reported',
      location: inc.location,
      coordinates: inc.coordinates,
      description: inc.description,
      photo: inc.photo,
      reporter_name: inc.reporterName,
      reporter_email: inc.reporterEmail,
      reporter_phone: inc.reporterPhone,
      created_at: inc.createdAt || new Date().toISOString(),
      assigned_ngo_id: inc.assignedNgoId,
      assigned_ngo_name: inc.assignedNgoName,
      resolution_notes: inc.resolutionNotes,
      resolution_photo: inc.resolutionPhoto,
      resolved_at: inc.resolvedAt,
      admin_moderation_note: inc.adminModerationNote
    });

    if (error) {
      console.warn('Supabase insert incident error:', error.message);
      return false;
    }
    return true;
  } catch (err) {
    console.warn('Supabase insert exception:', err);
    return false;
  }
}

export async function updateCloudIncident(id, fields) {
  const client = getSupabaseClient();
  if (!client) return false;

  try {
    const updates = {};
    if (fields.status !== undefined) updates.status = fields.status;
    if (fields.assignedNgoId !== undefined) updates.assigned_ngo_id = fields.assignedNgoId;
    if (fields.assignedNgoName !== undefined) updates.assigned_ngo_name = fields.assignedNgoName;
    if (fields.resolutionNotes !== undefined) updates.resolution_notes = fields.resolutionNotes;
    if (fields.resolutionPhoto !== undefined) updates.resolution_photo = fields.resolutionPhoto;
    if (fields.resolvedAt !== undefined) updates.resolved_at = fields.resolvedAt;
    if (fields.adminModerationNote !== undefined) updates.admin_moderation_note = fields.adminModerationNote;

    const { error } = await client.from('incidents').update(updates).eq('id', id);
    if (error) {
      console.warn('Supabase update incident error:', error.message);
      return false;
    }
    return true;
  } catch (err) {
    console.warn('Supabase update exception:', err);
    return false;
  }
}

// ----------------------------------------------------
// USERS CLOUD API
// ----------------------------------------------------

export async function fetchCloudUsers() {
  const client = getSupabaseClient();
  if (!client) return null;

  try {
    const { data, error } = await client.from('registered_users').select('*');
    if (error) {
      console.warn('Supabase fetch users notice:', error.message);
      return null;
    }

    return (data || []).map(row => ({
      id: row.id,
      username: row.username,
      email: row.email,
      password: row.password,
      name: row.name,
      phone: row.phone,
      location: row.location,
      avatar: row.avatar,
      totalDonated: Number(row.total_donated) || 0,
      donationsCount: Number(row.donations_count) || 0,
      volunteerHours: Number(row.volunteer_hours) || 0,
      badges: row.badges || [],
      savedAdoptions: row.saved_adoptions || [],
      donationHistory: row.donation_history || [],
      createdAt: row.created_at
    }));
  } catch (err) {
    console.warn('Supabase fetch users error:', err);
    return null;
  }
}

export async function insertCloudUser(user) {
  const client = getSupabaseClient();
  if (!client) return false;

  try {
    const { error } = await client.from('registered_users').upsert({
      id: user.id,
      username: user.username,
      email: user.email,
      password: user.password,
      name: user.name,
      phone: user.phone,
      location: user.location,
      avatar: user.avatar,
      total_donated: user.totalDonated || 0,
      donations_count: user.donationsCount || 0,
      volunteer_hours: user.volunteerHours || 0,
      badges: user.badges || [],
      saved_adoptions: user.savedAdoptions || [],
      donation_history: user.donationHistory || [],
      created_at: user.createdAt || new Date().toISOString()
    });

    if (error) {
      console.warn('Supabase insert user error:', error.message);
      return false;
    }
    return true;
  } catch (err) {
    console.warn('Supabase insert user exception:', err);
    return false;
  }
}

// ----------------------------------------------------
// NGOS CLOUD API
// ----------------------------------------------------

export async function fetchCloudNgos() {
  const client = getSupabaseClient();
  if (!client) return null;

  try {
    const { data, error } = await client.from('ngos').select('*');
    if (error) {
      console.warn('Supabase fetch ngos notice:', error.message);
      return null;
    }

    return (data || []).map(row => ({
      id: row.id,
      name: row.name,
      registrationNumber: row.registration_number,
      panNumber: row.pan_number,
      fcraNumber: row.fcra_number,
      focusArea: row.focus_area,
      verified: row.verified,
      verificationStatus: row.verification_status,
      verificationDate: row.verification_date,
      verifiedBy: row.verified_by,
      location: row.location,
      address: row.address,
      contactEmail: row.contact_email,
      phone: row.phone,
      bio: row.bio,
      logo: row.logo,
      banner: row.banner,
      documents: row.documents || [],
      stats: row.stats || {},
      createdAt: row.created_at
    }));
  } catch (err) {
    console.warn('Supabase fetch ngos error:', err);
    return null;
  }
}

export async function updateCloudNgo(id, fields) {
  const client = getSupabaseClient();
  if (!client) return false;

  try {
    const updates = {};
    if (fields.verified !== undefined) updates.verified = fields.verified;
    if (fields.verificationStatus !== undefined) updates.verification_status = fields.verificationStatus;
    if (fields.verificationDate !== undefined) updates.verification_date = fields.verificationDate;
    if (fields.verifiedBy !== undefined) updates.verified_by = fields.verifiedBy;
    if (fields.stats !== undefined) updates.stats = fields.stats;

    const { error } = await client.from('ngos').update(updates).eq('id', id);
    if (error) {
      console.warn('Supabase update ngo error:', error.message);
      return false;
    }
    return true;
  } catch (err) {
    console.warn('Supabase update ngo exception:', err);
    return false;
  }
}

// ----------------------------------------------------
// REAL-TIME SUBSCRIBER (Instant Postgres Change Stream)
// ----------------------------------------------------

export function subscribeToSupabaseRealtime(onIncident, onUser, onNgo) {
  const client = getSupabaseClient();
  if (!client) return () => {};

  try {
    const channel = client
      .channel('bridgeup_public_changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'incidents' }, (payload) => {
        if (onIncident && payload.new) {
          const row = payload.new;
          onIncident({
            id: row.id,
            title: row.title,
            category: row.category,
            severity: row.severity,
            status: row.status,
            location: row.location,
            coordinates: row.coordinates,
            description: row.description,
            photo: row.photo,
            reporterName: row.reporter_name,
            reporterEmail: row.reporter_email,
            reporterPhone: row.reporter_phone,
            createdAt: row.created_at,
            assignedNgoId: row.assigned_ngo_id,
            assignedNgoName: row.assigned_ngo_name,
            resolutionNotes: row.resolution_notes,
            resolutionPhoto: row.resolution_photo,
            resolvedAt: row.resolved_at,
            adminModerationNote: row.admin_moderation_note
          });
        }
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'registered_users' }, (payload) => {
        if (onUser && payload.new) {
          const row = payload.new;
          onUser({
            id: row.id,
            username: row.username,
            email: row.email,
            password: row.password,
            name: row.name,
            phone: row.phone,
            location: row.location,
            avatar: row.avatar,
            totalDonated: Number(row.total_donated) || 0,
            donationsCount: Number(row.donations_count) || 0,
            volunteerHours: Number(row.volunteer_hours) || 0,
            badges: row.badges || [],
            savedAdoptions: row.saved_adoptions || [],
            donationHistory: row.donation_history || [],
            createdAt: row.created_at
          });
        }
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'ngos' }, (payload) => {
        if (onNgo && payload.new) {
          onNgo(payload.new);
        }
      })
      .subscribe();

    return () => {
      client.removeChannel(channel);
    };
  } catch (e) {
    console.warn('Realtime subscription error:', e);
    return () => {};
  }
}
