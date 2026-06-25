export function formatDate(dateStr) {
  if (!dateStr) return '';
  try {
    const date = new Date(dateStr);
    const now = new Date();
    const diff = now - date;
    const mins = Math.floor(diff / 60000);
    const hrs = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (mins < 1) return 'இப்போது';
    if (mins < 60) return `${mins} நிமிடம் முன்`;
    if (hrs < 24) return `${hrs} மணி நேரம் முன்`;
    if (days < 7) return `${days} நாள் முன்`;

    return date.toLocaleDateString('ta-IN', {
      day: 'numeric', month: 'short', year: 'numeric'
    });
  } catch {
    return dateStr;
  }
}

export function truncate(str, len) {
  if (!str) return '';
  if (str.length <= len) return str;
  return str.slice(0, len).trimEnd() + '…';
}

export function stripHtml(html) {
  if (!html) return '';
  return html
    .replace(/<[^>]*>/g, '')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#039;/g, "'")
    .replace(/&#x27;/g, "'")
    .replace(/&nbsp;/g, ' ')
    .trim();
}

export function extractImage(item) {
  // Try media:content (namespaced)
  const mediaContent = item.getElementsByTagNameNS('http://search.yahoo.com/mrss/', 'content');
  if (mediaContent.length > 0) {
    const url = mediaContent[0].getAttribute('url');
    if (url) return url;
  }

  // Try enclosure
  const enclosure = item.querySelector('enclosure');
  if (enclosure) {
    const url = enclosure.getAttribute('url');
    if (url) return url;
  }

  // Try img tag in description
  const desc = item.querySelector('description')?.textContent || '';
  const imgMatch = desc.match(/<img[^>]+src="([^">]+)"/);
  if (imgMatch) return imgMatch[1];

  return '';
}

export function getText(description, content) {
  return stripHtml(description || content || '');
}

export function parseRSSItems(xmlText) {
  try {
    const parser = new DOMParser();
    const xml = parser.parseFromString(xmlText, 'text/xml');

    const parseError = xml.querySelector('parsererror');
    if (parseError) {
      console.warn('[rss] XML parse error:', parseError.textContent?.slice(0, 200));
      return [];
    }

    const items = xml.querySelectorAll('item');
    if (items.length === 0) {
      console.warn('[rss] No <item> elements found');
      return [];
    }

    return Array.from(items).map(item => {
      const get = (tag) => item.querySelector(tag)?.textContent?.trim() || '';

      const title = stripHtml(get('title'));
      const description = get('description');
      const content = get('content\\:encoded') || description;
      const imageUrl = extractImage(item);
      const link = get('link');
      const pubDate = get('pubDate');
      const guid = get('guid');

      let source = 'unknown';
      try {
        if (link) source = new URL(link).hostname.replace('www.', '');
      } catch {}

      return {
        guid: guid || `${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
        title,
        description: getText(description, content),
        pubDate,
        link,
        imageUrl,
        source,
        category: 'all',
        isBreaking: false,
        isRead: false,
        readCount: 0,
      };
    }).filter(a => a.title && a.title.length > 5);
  } catch (err) {
    console.error('[rss] parseRSSItems error:', err);
    return [];
  }
}

export function shuffleArray(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export function removeDuplicates(articles) {
  const seen = new Set();
  return articles.filter(a => {
    const key = a.title?.slice(0, 50);
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}
