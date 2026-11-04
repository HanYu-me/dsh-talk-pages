#!/bin/sh
# Install this checkout into the dsh desktop profile. QUIT dsh first (⌘Q): replacing
# client/client.js under a running dsh can make the next reload fail to boot.
set -e
HERE="$(cd "$(dirname "$0")/.." && pwd)"
PROFILE="${DSH_PROFILE:-$HOME/.dsh/profiles/desktop}"
DEST="$PROFILE/node_modules/dsh-talk-pages"
if pgrep -f "DeepSeek Harness.app/Contents/MacOS" >/dev/null 2>&1; then
  echo "dsh is still running — quit it (⌘Q) and run this again." >&2
  exit 1
fi
VERSION="$(node -p "require('$HERE/package.json').version")"
rm -rf "$DEST"
mkdir -p "$DEST"
cp -R "$HERE/lib" "$HERE/client" "$HERE/cordis.patch.yml" "$HERE/LICENSE" "$HERE/README.md" "$HERE/package.json" "$DEST/"
rm -f "$DEST/client/client.dev.js"
node -e "
const fs=require('fs'),p='$PROFILE/package.json',d=JSON.parse(fs.readFileSync(p,'utf8'));
d.dependencies['dsh-talk-pages']='github:HanYu-me/dsh-talk-pages#v$VERSION';
fs.writeFileSync(p,JSON.stringify(d,null,2)+'\n');"
echo "installed dsh-talk-pages $VERSION into $DEST — start dsh."
