"""Build doorstep/fonts/Padauk-{Regular,Bold}.woff2 from the repository's own dist/fonts/*.ttf.
Full glyph set (no subsetting), so every Myanmar string is covered. Run from the repo root:
    pip install fonttools brotli && python3 doorstep/tools/build-fonts.py
Prints SHA-256 of each output; compare with doorstep/fonts/EXPECTED-SHA256.txt (fonttools 4.60.2 + brotli)."""
import hashlib, os
from fontTools.ttLib import TTFont
for w in ('Regular', 'Bold'):
    src, dst = f'dist/fonts/Padauk-{w}.ttf', f'doorstep/fonts/Padauk-{w}.woff2'
    f = TTFont(src, recalcTimestamp=False); f.flavor = 'woff2'; f.save(dst, reorderTables=True)
    print(hashlib.sha256(open(dst, 'rb').read()).hexdigest(), os.path.getsize(dst), dst)
# Coverage: every Myanmar character used anywhere in the app copy must exist in the font.
import re, json
copy = open('doorstep/js/copy.js', encoding='utf8').read()
chars = sorted(set(c for c in copy if 'က' <= c <= '႟' or 'ꩠ' <= c <= 'ꩿ' or 'ꧠ' <= c <= '꧿'))
for w in ('Regular', 'Bold'):
    cmap = TTFont(f'doorstep/fonts/Padauk-{w}.woff2').getBestCmap()
    missing = [c for c in chars if ord(c) not in cmap]
    print(f'coverage {w}: {len(chars) - len(missing)}/{len(chars)} Myanmar characters', 'OK' if not missing else f'MISSING {missing}')
    if missing: raise SystemExit(1)
