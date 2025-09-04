// api/subdomain.js
// Serverless function للحصول على subdomain من headers الخادم
export default function handler(req, res) {
  // السماح بـ CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  try {
    const host = req.headers.host; // => "electronics.patform.vercel.app"
    const parts = host.split('.');
    
    let subdomain = 'default';
    
    // دعم vercel.app: project.vercel.app أو store.project.vercel.app
    if (host.endsWith('.vercel.app')) {
      if (parts.length === 3) {
        subdomain = 'default';
      } else if (parts.length > 3) {
        subdomain = parts.slice(0, parts.length - 3).join('.');
      }
    } else {
      // دومين مخصص: store.domain.com
      if (parts.length > 2) {
        subdomain = parts.slice(0, -2).join('.');
      }
    }

    // إرجاع subdomain كـ JSON
    res.status(200).json({
      subdomain: subdomain,
      host: host,
      parts: parts,
      success: true
    });

  } catch (error) {
    res.status(500).json({
      error: error.message,
      success: false
    });
  }
}
