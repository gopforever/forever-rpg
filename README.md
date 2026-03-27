# forever-rpg

## Running the game

**Do NOT open `index.html` directly via `file://`** (e.g., by double-clicking it in your file manager). Browsers block certain operations (such as `fetch()` and ES module loading) when a page is served from a `file://` URL due to same-origin security restrictions.

Instead, serve the project through a local HTTP server:

```bash
# Option 1 – Node.js (npx, no install required)
npx serve .

# Option 2 – Python 3
python -m http.server 8080
```

Then open [http://localhost:8080](http://localhost:8080) in your browser.
