/**
 * Obsidian Markdown Parser & Link Transformer
 * 
 * Parses daily/weekly Obsidian notes, extracts YAML frontmatter,
 * parses structured sections (Topics, Activities, Evidence, Learnings),
 * and converts Obsidian wikilinks & image embeddings to web-ready asset paths.
 */

/**
 * Parses YAML frontmatter if present at the top of the markdown file.
 * @param {string} content 
 * @returns {{ frontmatter: Record<string, any>, body: string }}
 */
export function parseFrontmatter(content) {
  const frontmatter = {};
  if (!content || typeof content !== 'string') {
    return { frontmatter, body: '' };
  }

  const trimmed = content.trimStart();
  if (!trimmed.startsWith('---')) {
    return { frontmatter, body: content };
  }

  const endIdx = trimmed.indexOf('\n---', 3);
  if (endIdx === -1) {
    return { frontmatter, body: content };
  }

  const rawYaml = trimmed.slice(3, endIdx).trim();
  const body = trimmed.slice(endIdx + 4).trimStart();

  const lines = rawYaml.split('\n');
  for (const line of lines) {
    const colonIdx = line.indexOf(':');
    if (colonIdx !== -1) {
      const key = line.slice(0, colonIdx).trim();
      let val = line.slice(colonIdx + 1).trim();

      // Remove wrapping quotes if present
      if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
        val = val.slice(1, -1);
      }

      // Parse booleans and numbers
      if (val.toLowerCase() === 'true') val = true;
      else if (val.toLowerCase() === 'false') val = false;
      else if (!isNaN(val) && val !== '') val = Number(val);

      if (key) {
        frontmatter[key] = val;
      }
    }
  }

  return { frontmatter, body };
}

/**
 * Converts Obsidian image links `![[filename.png]]` or `![[filename.png|caption]]`
 * and relative markdown images `![](filename.png)` to web-compatible URLs.
 * 
 * @param {string} content 
 * @param {{ week: string, day: string }} context 
 * @returns {string}
 */
export function convertObsidianLinks(content, { week, day }) {
  if (!content) return '';

  const basePath = `/assets/weekly/${week}/${day}`;

  // 1. Convert Obsidian image embeds: ![[image.ext|Optional Caption]] or ![[image.ext]]
  let processed = content.replace(/!\[\[([^\]|]+)(?:\|([^\]]+))?\]\]/g, (match, fileName, caption) => {
    const cleanFileName = fileName.trim();
    const altText = (caption || cleanFileName).trim();
    return `![${altText}](${basePath}/${cleanFileName})`;
  });

  // 2. Convert standard markdown relative images: ![alt](filename.ext) or ![alt](./filename.ext)
  processed = processed.replace(/!\[([^\]]*)\]\((?:\.\/)?([^):]+)\)/g, (match, alt, target) => {
    if (target.startsWith('http://') || target.startsWith('https://') || target.startsWith('/') || target.startsWith('data:')) {
      return match;
    }
    return `![${alt}](${basePath}/${target.trim()})`;
  });

  // 3. Convert Obsidian document embeds/links: [[filename.pdf|Optional Label]] or [[filename.pdf]]
  processed = processed.replace(/(?<!!)\[\[([^\]|]+)(?:\|([^\]]+))?\]\]/g, (match, target, label) => {
    const cleanTarget = target.trim();
    const ext = cleanTarget.split('.').pop()?.toLowerCase();
    const isDoc = ['pdf', 'doc', 'docx', 'ppt', 'pptx', 'zip', 'mp4', 'webm'].includes(ext);
    const displayText = (label || cleanTarget).trim();

    if (isDoc) {
      return `[${displayText}](${basePath}/${cleanTarget})`;
    }
    return displayText;
  });

  return processed;
}

/**
 * Extracts all media references explicitly mentioned in markdown content.
 * @param {string} rawContent 
 * @returns {string[]} List of referenced filenames
 */
export function extractLinkedMedia(rawContent) {
  if (!rawContent) return [];
  const linked = new Set();

  // Find ![[filename.ext]]
  const obsidianEmbeds = rawContent.matchAll(/!\[\[([^\]|]+)/g);
  for (const match of obsidianEmbeds) {
    if (match[1]) linked.add(match[1].trim());
  }

  // Find standard markdown links/images: [text](filename.ext) or ![alt](filename.ext)
  const mdEmbeds = rawContent.matchAll(/\[(?:[^\]]*)\]\((?:\.\/)?([^):]+)\)/g);
  for (const match of mdEmbeds) {
    const target = match[1]?.trim();
    if (target && !target.startsWith('http') && !target.startsWith('/') && !target.startsWith('#')) {
      linked.add(target);
    }
  }

  // Find document wikilinks: [[file.pdf]]
  const docWiki = rawContent.matchAll(/(?<!!)\[\[([^\]|]+)/g);
  for (const match of docWiki) {
    const target = match[1]?.trim();
    if (target && target.includes('.')) {
      linked.add(target);
    }
  }

  return Array.from(linked);
}

/**
 * Parses daily note markdown content into structured metadata, notes, and attachment records.
 * 
 * @param {string} rawContent 
 * @param {{ filePath?: string, week: string, day: string, fileName?: string }} options 
 * @returns {Object} Structured daily note representation
 */
export function parseObsidianNote(rawContent, { filePath = '', week, day, fileName = '' }) {
  const { frontmatter, body } = parseFrontmatter(rawContent);

  // Convert image and media links to public asset paths
  const transformedBody = convertObsidianLinks(body, { week, day });

  // Extract title
  let title = frontmatter.title || '';
  if (!title) {
    const headingMatch = body.match(/^#\s+(.+)$/m);
    if (headingMatch) {
      title = headingMatch[1].trim();
    } else {
      // Humanize day name (e.g. 01_Monday -> Monday)
      const dayName = day.replace(/^\d+_/, '').replace(/_/g, ' ');
      title = `${dayName} Sprint & Log`;
    }
  }

  // Extract date
  let date = frontmatter.date || '';
  if (!date) {
    // Try to extract date pattern YYYY-MM-DD from text or frontmatter
    const dateMatch = rawContent.match(/\b(20\d{2}-\d{2}-\d{2})\b/);
    if (dateMatch) {
      date = dateMatch[1];
    } else {
      date = new Date().toISOString().split('T')[0];
    }
  }

  // Status (DRAFT | PUBLISHED)
  const status = (frontmatter.status && String(frontmatter.status).toUpperCase() === 'DRAFT')
    ? 'DRAFT'
    : 'PUBLISHED';

  // Extract linked media
  const linkedMedia = extractLinkedMedia(rawContent);

  return {
    title,
    date,
    status,
    frontmatter,
    body: transformedBody,
    originalBody: body,
    linkedMedia,
    week,
    day,
    fileName,
    filePath
  };
}
