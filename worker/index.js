// /api/songs だけ、Concentus の曲一覧を中継する。
// Concentus は他サイトからの読み込みを許可していないため、ブラウザから直接は読めない
const SONGS_URL = 'https://concentus.whitelily-goldeneagle-inn.workers.dev/data/songs.json'

export default {
  async fetch(request, env) {
    const url = new URL(request.url)
    if (url.pathname === '/api/songs') return songs()
    return env.ASSETS.fetch(request)
  },
}

async function songs() {
  const res = await fetch(SONGS_URL, { cf: { cacheTtl: 3600, cacheEverything: true } })
  if (!res.ok) return Response.json({ error: `Concentus ${res.status}` }, { status: 502 })
  const rows = await res.json()
  // 候補に要るのは曲名とアーティストだけなので、それだけに絞って返す
  return Response.json(rows.map((s) => ({ title: s.title, artist: s.artist })), {
    headers: { 'Cache-Control': 'public, max-age=3600' },
  })
}
