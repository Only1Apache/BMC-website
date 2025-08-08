#!/usr/bin/env bash
set -e
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/Only1Apache/BMC-website.git
git push -u origin main
echo "Done. Now connect the repo in Netlify (Import from Git)."
