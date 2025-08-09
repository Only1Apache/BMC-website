BMC — Posts: Edit & Delete (author or admin)

Frontend:
- Members page shows Edit/Delete buttons on each post IF current user is admin or the post author (email match).
- Edit uses a modal; update is simulated by creating a new submission then deleting the old one (Netlify Forms has no edit API).

Functions:
- get-posts.js returns submission id + email for ownership checks.
- delete-post.js deletes a submission (requires NETLIFY_TOKEN).
- update-post.js creates an edited submission then deletes the original (requires NETLIFY_TOKEN).
- submit-post.js unchanged logic (admin/member can post).

Env:
- NETLIFY_TOKEN (Personal Access Token with Forms access)
- WEB_ID or SITE_ID (Site API ID) — used by get-posts only.

Deploy:
- Add files, commit & push. Test in /#members.
