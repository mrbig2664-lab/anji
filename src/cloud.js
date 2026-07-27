import { createClient } from '@supabase/supabase-js'

const url = import.meta.env.VITE_SUPABASE_URL
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const cloudEnabled = Boolean(url && anonKey)
export const supabase = cloudEnabled ? createClient(url, anonKey) : null

const photoFromRow = row => ({
  id: row.id,
  day: row.day_id,
  src: row.public_url,
  storagePath: row.storage_path,
  caption: row.caption || '',
  type: row.photo_type || 'Us',
  uploadedBy: row.uploaded_by,
  isDayCover: Boolean(row.is_day_cover),
  isTripCover: Boolean(row.is_trip_cover),
  createdAt: row.created_at,
})

const packingFromRow = row => ({
  id: row.id,
  label: row.title,
  category: row.category,
  owner: row.owner || 'Both',
  checked: Boolean(row.checked),
  createdBy: row.created_by,
  updatedBy: row.updated_by,
  custom: true,
})

const placeFromRow = (row, votes = {}) => ({
  id: row.id,
  title: row.title,
  type: row.type || 'other',
  description: row.description || '',
  dayHint: row.day_hint || '',
  mapUrl: row.map_url || '',
  addedBy: row.added_by,
  votes,
  createdAt: row.created_at,
  isRemote: true,
})

export async function fetchPhotos() {
  const { data, error } = await supabase.from('photos').select('*').order('created_at', { ascending: false })
  if (error) throw error
  return (data || []).map(photoFromRow)
}

export async function fetchPackingItems() {
  const { data, error } = await supabase.from('packing_items').select('*').order('created_at')
  if (error) throw error
  return (data || []).map(packingFromRow)
}

export async function fetchPlaces() {
  const [{ data: places, error: placesError }, { data: votes, error: votesError }] = await Promise.all([
    supabase.from('place_candidates').select('*').order('created_at'),
    supabase.from('place_votes').select('*'),
  ])
  if (placesError) throw placesError
  if (votesError) throw votesError
  const voteMap = (votes || []).reduce((result, vote) => {
    result[vote.candidate_id] = { ...(result[vote.candidate_id] || {}), [vote.user_name]: vote.vote }
    return result
  }, {})
  return (places || []).map(place => placeFromRow(place, voteMap[place.id] || {}))
}

export async function seedPlaces(rows) {
  if (!rows.length) return fetchPlaces()
  const { error } = await supabase.from('place_candidates').insert(rows)
  if (error) throw error
  return fetchPlaces()
}

export async function seedPackingItems(rows) {
  if (!rows.length) return fetchPackingItems()
  const { error } = await supabase.from('packing_items').insert(rows)
  if (error) throw error
  return fetchPackingItems()
}

export async function createPackingItem(item) {
  const { data, error } = await supabase.from('packing_items').insert(item).select().single()
  if (error) throw error
  return packingFromRow(data)
}

export async function updatePackingItem(id, patch) {
  const rowPatch = {}
  if (patch.title !== undefined) rowPatch.title = patch.title
  if (patch.category !== undefined) rowPatch.category = patch.category
  if (patch.owner !== undefined) rowPatch.owner = patch.owner
  if (patch.checked !== undefined) rowPatch.checked = patch.checked
  if (patch.updated_by !== undefined) rowPatch.updated_by = patch.updated_by
  const { data, error } = await supabase.from('packing_items').update(rowPatch).eq('id', id).select().single()
  if (error) throw error
  return packingFromRow(data)
}

export async function deletePackingItem(id) {
  const { error } = await supabase.from('packing_items').delete().eq('id', id)
  if (error) throw error
}

export async function createPlace(place) {
  const row = { title: place.title, type: place.type || 'other', description: place.description || '', day_hint: place.day_hint || place.dayHint || '', map_url: place.map_url || place.mapUrl || '', added_by: place.added_by || place.addedBy }
  const { data, error } = await supabase.from('place_candidates').insert(row).select().single()
  if (error) throw error
  return placeFromRow(data, {})
}

export async function updatePlace(id, patch) {
  const { data, error } = await supabase.from('place_candidates').update(patch).eq('id', id).select().single()
  if (error) throw error
  return placeFromRow(data, {})
}

export async function deletePlace(id) {
  const { error } = await supabase.from('place_candidates').delete().eq('id', id)
  if (error) throw error
}

export async function savePlaceVote(candidateId, userName, vote) {
  const { error } = await supabase.from('place_votes').upsert({ candidate_id: candidateId, user_name: userName, vote, updated_at: new Date().toISOString() }, { onConflict: 'candidate_id,user_name' })
  if (error) throw error
}

export async function uploadPhoto(file, { day, type, caption, uploadedBy }) {
  const extension = file.name.split('.').pop()?.toLowerCase() || 'jpg'
  const storagePath = `${day}/${crypto.randomUUID()}.${extension}`
  const { error: uploadError } = await supabase.storage.from('anji-photos').upload(storagePath, file, { contentType: file.type || 'image/jpeg', upsert: false })
  if (uploadError) throw uploadError
  const { data: publicData } = supabase.storage.from('anji-photos').getPublicUrl(storagePath)
  const { data, error } = await supabase.from('photos').insert({ storage_path: storagePath, public_url: publicData.publicUrl, day_id: day, caption: caption || '', photo_type: type, uploaded_by: uploadedBy }).select().single()
  if (error) {
    await supabase.storage.from('anji-photos').remove([storagePath])
    throw error
  }
  return photoFromRow(data)
}

export async function updatePhoto(id, patch) {
  const rowPatch = {}
  if (patch.caption !== undefined) rowPatch.caption = patch.caption
  if (patch.isDayCover !== undefined) rowPatch.is_day_cover = patch.isDayCover
  if (patch.isTripCover !== undefined) rowPatch.is_trip_cover = patch.isTripCover
  const { data, error } = await supabase.from('photos').update(rowPatch).eq('id', id).select().single()
  if (error) throw error
  return photoFromRow(data)
}

export async function deletePhoto(photo) {
  const { error: rowError } = await supabase.from('photos').delete().eq('id', photo.id)
  if (rowError) throw rowError
  if (photo.storagePath) {
    const { error: storageError } = await supabase.storage.from('anji-photos').remove([photo.storagePath])
    if (storageError) console.warn('Photo record deleted but storage cleanup failed', storageError)
  }
}

export function subscribeToSharedData(onChange) {
  if (!supabase) return () => {}
  const channel = supabase.channel('anji-shared-os')
    .on('postgres_changes', { event: '*', schema: 'public', table: 'photos' }, onChange)
    .on('postgres_changes', { event: '*', schema: 'public', table: 'packing_items' }, onChange)
    .on('postgres_changes', { event: '*', schema: 'public', table: 'place_candidates' }, onChange)
    .on('postgres_changes', { event: '*', schema: 'public', table: 'place_votes' }, onChange)
    .subscribe()
  return () => { supabase.removeChannel(channel) }
}
