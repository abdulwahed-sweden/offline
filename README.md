# Gaza Blocks

Three standalone maps of the same 620 population blocks. Each is a single self-contained
HTML file — open it directly in a browser, no build step.

| File | Name | What it is |
| --- | --- | --- |
| `index.html` | **Gaza Block Atlas** | Satellite reference view. Esri imagery, dimmed surroundings, block search, hectares, GPS block lookup, `#block=NNN` deep links. English. |
| `gaza-block-finder.html` | **Gaza Block Finder** | Dark UI for searching and filtering blocks by area, with a details side panel. English. |
| `gaza-block-guide.html` | **Gaza Block Guide** | Bilingual Arabic/English guide for residents: search by block number or area name, my location, distance measuring, point picking, offline notice. |

Block geometry: 620 polygons, WGS84, 11,363 vertices — validated (no duplicate block
numbers, no self-intersections, no unclosed rings).

## Offline

Leaflet is vendored in `vendor/leaflet/` and the block geometry is inlined in each
page, so all three maps open and draw with no network at all — including straight
from disk over `file://`. Only the basemap tiles need the internet; without them the
blocks render on a plain background.

`data/base-map.js` is a tile-free vector base map — the Gaza Strip land outline, 1,093
road segments and 68 place names in Arabic and English, extracted from OpenStreetMap
and simplified to 89 KB. Pick **Offline vector** (Atlas, Finder) or **Offline base**
(Guide) and the map draws roads and place names with no tiles at all. Place labels
follow the interface language in the Guide, and collide-avoid as you zoom.

On the published site a service worker (`sw.js`) precaches the pages, Leaflet, the
geometry and the vector base, and caches basemap tiles as they are viewed: pan an area
once while online and it stays available offline. Tiles are capped at 1500 entries,
oldest evicted first.

Base map data © OpenStreetMap contributors, ODbL.

Live: https://abdulwahed-sweden.github.io/offline/
