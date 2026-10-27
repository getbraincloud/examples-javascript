// Canvas coverage % + win-ranking (BCLOUD-14472/14490) — port of cpp's coverage.cpp.
//
// Rasterizes a COVERAGE_GRID_CELL_SIZE grid, stamping each splotch as a filled circle
// in paint order so later splotches overwrite earlier ones (matches what's on screen).
// coveragePct = owned cells * cell-area / canvas-area — absolute coverage, not a share
// of painted area.
//
// Attribution: by sender cxId first, falling back to a colorIndex match only when
// unattributed. Unmatched splotches still overwrite the grid but credit no one.
//
// Constants (CANVAS_W/H, SPLOTCH_RADIUS, COVERAGE_GRID_CELL_SIZE) must match other ports.
const CANVAS_W = 800
const CANVAS_H = 600
const SPLOTCH_RADIUS = 32 // SPLOTCH_DISPLAY_SIZE (64) * 0.5
const COVERAGE_GRID_CELL_SIZE = 2

const GRID_W = Math.floor(CANVAS_W / COVERAGE_GRID_CELL_SIZE)
const GRID_H = Math.floor(CANVAS_H / COVERAGE_GRID_CELL_SIZE)
const CELL_RADIUS = Math.ceil(SPLOTCH_RADIUS / COVERAGE_GRID_CELL_SIZE)
const R2 = SPLOTCH_RADIUS * SPLOTCH_RADIUS

// Reused across calls (this runs every ~250ms mid-match).
let ownerGrid = new Int16Array(GRID_W * GRID_H)

// splotches: [{x, y (normalized 0-1), colorIndex, ...}]
// members: [{cxId, extra: {colorIndex}}]
// Returns entries sorted best-first: [{cxId, colorIndex, visibleCount, coveragePct, rank, beaten}]
export function computeCoverage (splotches, members) {
  const result = members.map(m => ({
    cxId: m.cxId,
    colorIndex: (m.extra && m.extra.colorIndex !== undefined) ? m.extra.colorIndex : 0,
    visibleCount: 0,
    coveragePct: 0,
    rank: 1,
    beaten: 0
  }))

  const indexByCxId = {}
  result.forEach((e, k) => { indexByCxId[e.cxId] = k })

  const N = splotches.length
  if (N > 0) {
    ownerGrid.fill(-1)

    for (let i = 0; i < N; i++) {
      const s = splotches[i]
      const px = s.x * CANVAS_W
      const py = s.y * CANVAS_H

      // Attribute by the sender's actual cxId first — required so two players who picked
      // the same colour don't get merged into a single coverage total. Falls back to a
      // colorIndex match only for unattributed splotches (a JIP sync entry whose owning
      // netId couldn't be resolved, or a legacy sender).
      let idx = -1
      if (s.cxId !== undefined && s.cxId !== '' && Object.prototype.hasOwnProperty.call(indexByCxId, s.cxId)) {
        idx = indexByCxId[s.cxId]
      } else {
        for (let k = 0; k < result.length; k++) {
          if (result[k].colorIndex === s.colorIndex) { idx = k; break }
        }
      }

      const cx = Math.floor(px / COVERAGE_GRID_CELL_SIZE)
      const cy = Math.floor(py / COVERAGE_GRID_CELL_SIZE)
      for (let dy = -CELL_RADIUS; dy <= CELL_RADIUS; dy++) {
        const gy = cy + dy
        if (gy < 0 || gy >= GRID_H) continue
        const cellPy = (gy + 0.5) * COVERAGE_GRID_CELL_SIZE
        const ddy = cellPy - py
        const rowBase = gy * GRID_W
        for (let dx = -CELL_RADIUS; dx <= CELL_RADIUS; dx++) {
          const gx = cx + dx
          if (gx < 0 || gx >= GRID_W) continue
          const cellPx = (gx + 0.5) * COVERAGE_GRID_CELL_SIZE
          const ddx = cellPx - px
          if (ddx * ddx + ddy * ddy <= R2) {
            ownerGrid[rowBase + gx] = idx // may be -1 — still overwrites, credits no one
          }
        }
      }
    }

    for (let c = 0, count = GRID_W * GRID_H; c < count; c++) {
      const idx = ownerGrid[c]
      if (idx >= 0) result[idx].visibleCount++
    }
  }

  const cellArea = COVERAGE_GRID_CELL_SIZE * COVERAGE_GRID_CELL_SIZE
  const canvasArea = CANVAS_W * CANVAS_H
  result.forEach(e => {
    e.coveragePct = Math.min(100, (e.visibleCount * cellArea / canvasArea) * 100)
  })

  result.sort((a, b) => {
    if (a.coveragePct !== b.coveragePct) return b.coveragePct - a.coveragePct
    if (a.visibleCount !== b.visibleCount) return b.visibleCount - a.visibleCount
    return a.cxId < b.cxId ? -1 : (a.cxId > b.cxId ? 1 : 0)
  })

  for (let i = 0; i < result.length; i++) {
    result[i].rank = (i > 0 &&
      result[i].coveragePct === result[i - 1].coveragePct &&
      result[i].visibleCount === result[i - 1].visibleCount)
      ? result[i - 1].rank // tie shares rank
      : i + 1
  }
  result.forEach(e => {
    e.beaten = result.filter(other => other.rank > e.rank).length
  })

  return result
}
