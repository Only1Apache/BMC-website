// /.netlify/functions/submit-post
exports.handler = async (event, context) => {
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 204, headers: corsHeaders() };
  }
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, headers: corsHeaders(), body: 'Method Not Allowed' };
  }

  const user = context.clientContext && context.clientContext.user;
  const roles = (user && user.app_metadata && user.app_metadata.roles) || [];
  const allowed = roles.map(r => String(r).toLowerCase()).some(r => r === 'official' || r === 'admin');
  if (!user) {
    return { statusCode: 401, headers: corsHeaders(), body: 'Unauthorized (login required)' };
  }
  if (!allowed) {
    return { statusCode: 403, headers: corsHeaders(), body: 'Forbidden (official/admin role required)' };
  }

  let payload;
  try {
    payload = JSON.parse(event.body || '{}');
  } catch (e) {
    return { statusCode: 400, headers: corsHeaders(), body: 'Invalid JSON body' };
  }
  const title = (payload.title || '').trim();
  const content = (payload.content || '').trim();
  const author = user.email || (user.user_metadata && user.user_metadata.full_name) || 'Member';
  if (!title || !content) {
    return { statusCode: 400, headers: corsHeaders(), body: 'Missing title/content' };
  }

  const formBody = new URLSearchParams();
  formBody.set('form-name', 'member-posts');
  formBody.set('author', author);
  formBody.set('title', title);
  formBody.set('content', content);

  const host = event.headers['x-forwarded-host'] || event.headers.host;
  const siteUrl = `https://${host}`;

  try {
    const resp = await fetch(siteUrl + '/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: formBody.toString()
    });
    if (!resp.ok) {
      const text = await resp.text();
      return { statusCode: 502, headers: corsHeaders(), body: 'Upstream submit failed: ' + resp.status + ' ' + text };
    }
    return { statusCode: 200, headers: corsHeadersJson(), body: JSON.stringify({ ok: true }) };
  } catch (err) {
    return { statusCode: 500, headers: corsHeaders(), body: 'Error: ' + (err.message || 'Unknown') };
  }
};

function corsHeaders(){
  return {
    'access-control-allow-origin': '*',
    'access-control-allow-methods': 'POST, OPTIONS',
    'access-control-allow-headers': 'authorization, content-type'
  };
}
function corsHeadersJson(){
  return { ...corsHeaders(), 'content-type': 'application/json' };
}
