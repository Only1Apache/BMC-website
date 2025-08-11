BMC — Full working site

Includes:
- Home (Latest + Community posts feed)
- Explore Worlds page + community-submitted worlds (members only to publish)
- Members page with login, post, edit/delete (owner or admin)
- Netlify Functions: get-posts, submit-post, delete-post, update-post

Setup:
1) In Netlify site env vars:
   - NETLIFY_TOKEN: Personal Access Token (Sites: read, Forms: read, Submissions: read/delete)
   - WEB_ID (or SITE_ID): your Netlify Site ID
2) Enable Identity + roles (admin, member). Invite your account and assign role.
3) Deploy from Git or drag-and-drop this folder.
