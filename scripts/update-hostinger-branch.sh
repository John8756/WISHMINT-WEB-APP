#!/usr/bin/env bash
set -e

REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$REPO_ROOT"

echo "=== 1. Building Vite production bundle for Hostinger ==="
NODE_ENV=production npx vite build

echo "=== 2. Staging build in isolated workspace ==="
TEMP_DIR=$(mktemp -d)
cp -r dist/* "$TEMP_DIR/"
if [ -f dist/.htaccess ]; then
  cp dist/.htaccess "$TEMP_DIR/"
fi
if [ -f WISHMINT-HOSTINGER-BUILD.zip ]; then
  cp WISHMINT-HOSTINGER-BUILD.zip "$TEMP_DIR/"
fi

# Ensure node_modules and logs are never tracked on hostinger branch
cat << 'EOF' > "$TEMP_DIR/.gitignore"
node_modules/
dist/
.DS_Store
*.log
EOF

echo "=== 3. Creating atomic deployment commit ==="
cd "$TEMP_DIR"
git init -q
git config user.name "John8756"
git config user.email "iliasmondal837@gmail.com"
git add -A
git commit -q -m "deploy: hostinger static root build $(date -u +'%Y-%m-%d %H:%M:%SZ')"

echo "=== 4. Updating local 'hostinger' branch ==="
git push -q "$REPO_ROOT" HEAD:refs/heads/hostinger --force

cd "$REPO_ROOT"
rm -rf "$TEMP_DIR"

echo "=== Successfully updated 'hostinger' deployment branch! ==="
echo "The hostinger branch now contains the static website directly at its root."
echo "To push changes to GitHub, run:"
echo "  git push -u origin hostinger --force"
