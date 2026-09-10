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
