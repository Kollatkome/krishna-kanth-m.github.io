import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { parseObsidianNote } from '../src/services/obsidianParser.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..');

const CONTENT_DIR = path.join(ROOT_DIR, 'portfolio-content');
const PUBLIC_ASSETS_DIR = path.join(ROOT_DIR, 'public', 'assets', 'weekly');
const COMPILED_DIR = path.join(ROOT_DIR, 'src', 'content', 'blogs');
const JSON_OUTPUT_PATH = path.join(ROOT_DIR, 'src', 'data', 'compiledProtoSem.json');

const IMAGE_EXTENSIONS = new Set(['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg']);
const MEDIA_EXTENSIONS = new Set(['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg', 'mp4', 'webm', 'pdf', 'doc', 'docx', 'ppt', 'pptx']);

const DAY_FOLDERS = [
  '01_Monday',
  '02_Tuesday',
  '03_Wednesday',
  '04_Thursday',
  '05_Friday',
  '06_Saturday'
];

/**
 * Format byte size into human-readable string
 */
function formatFileSize(bytes) {
  if (!bytes || isNaN(bytes)) return '1.0 MB';
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

/**
 * Determine attachment type based on extension
 */
function getAttachmentType(ext) {
  if (IMAGE_EXTENSIONS.has(ext)) return 'IMAGE';
  if (['ppt', 'pptx'].includes(ext)) return 'PPT';
  return 'PDF';
}

/**
 * Clean & slugify
 */
function slugify(text) {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
}

/**
 * Main compilation routine
 */
async function buildTemplates() {
  console.log('🚀 [Obsidian Pipeline] Starting content compilation...');
  const startTime = Date.now();

  // Ensure output directories exist
  fs.mkdirSync(PUBLIC_ASSETS_DIR, { recursive: true });
  fs.mkdirSync(COMPILED_DIR, { recursive: true });
  fs.mkdirSync(path.dirname(JSON_OUTPUT_PATH), { recursive: true });

  const compiledDays = {};
  const compiledWeeks = [];
  const compiledEvidence = [];

  // Track overall stats
  let totalNotesProcessed = 0;
  let totalMediaCopied = 0;

  // Process Week_00 through Week_19
  for (let weekIdx = 0; weekIdx <= 19; weekIdx++) {
    const weekNumStr = weekIdx < 10 ? `0${weekIdx}` : `${weekIdx}`;
    const weekFolderName = `Week_${weekNumStr}`;
    const weekSlug = `week-${weekNumStr}`;
    const weekId = `week-${weekNumStr}`;
    const weekPath = path.join(CONTENT_DIR, weekFolderName);

    const weekEntries = [];
    const weeklyMarkdownSections = [];

    // Check if week folder exists in portfolio-content
    const weekExists = fs.existsSync(weekPath);

    let weekCustomName = '';

    for (let dayIdx = 0; dayIdx < DAY_FOLDERS.length; dayIdx++) {
      const dayFolder = DAY_FOLDERS[dayIdx];
      const dayPath = path.join(weekPath, dayFolder);

      if (!fs.existsSync(dayPath)) {
        continue;
      }

      const files = fs.readdirSync(dayPath, { withFileTypes: true });
      const mdFiles = [];
      const mediaFiles = [];

      // Categorize files
      for (const file of files) {
        if (!file.isFile()) continue;
        const ext = path.extname(file.name).slice(1).toLowerCase();

        if (ext === 'md') {
          mdFiles.push(file.name);
        } else if (MEDIA_EXTENSIONS.has(ext)) {
          mediaFiles.push(file.name);
        }
      }

      // Copy media files to public/assets/weekly/<Week>/<Day>/
      const targetMediaDir = path.join(PUBLIC_ASSETS_DIR, weekFolderName, dayFolder);
      if (mediaFiles.length > 0) {
        fs.mkdirSync(targetMediaDir, { recursive: true });
      }

      for (const mediaFile of mediaFiles) {
        const srcPath = path.join(dayPath, mediaFile);
        const destPath = path.join(targetMediaDir, mediaFile);
        fs.copyFileSync(srcPath, destPath);
        totalMediaCopied++;
      }

      // Track all media in this day
      const linkedMediaSet = new Set();
      const dayAttachments = [];

      // Process Markdown notes in this day
      if (mdFiles.length > 0) {
        for (const mdFile of mdFiles) {
          totalNotesProcessed++;
          const mdFilePath = path.join(dayPath, mdFile);
          const rawContent = fs.readFileSync(mdFilePath, 'utf-8');

          const parsed = parseObsidianNote(rawContent, {
            filePath: mdFilePath,
            week: weekFolderName,
            day: dayFolder,
            fileName: mdFile
          });

          if (parsed.frontmatter?.weekName && !weekCustomName) {
            weekCustomName = parsed.frontmatter.weekName;
          }

          // Mark linked media
          parsed.linkedMedia.forEach((m) => linkedMediaSet.add(m));

          // Create attachments for explicitly linked media
          for (const mediaName of parsed.linkedMedia) {
            const ext = mediaName.split('.').pop()?.toLowerCase() || '';
            const mediaUrl = `/assets/weekly/${weekFolderName}/${dayFolder}/${mediaName}`;
            let mediaSize = '1.0 MB';

            const localMediaPath = path.join(dayPath, mediaName);
            if (fs.existsSync(localMediaPath)) {
              const stats = fs.statSync(localMediaPath);
              mediaSize = formatFileSize(stats.size);
            }

            dayAttachments.push({
              id: `att-${weekSlug}-${dayFolder}-${slugify(mediaName)}`,
              type: getAttachmentType(ext),
              name: mediaName,
              url: mediaUrl,
              size: mediaSize,
              uploadedAt: new Date().toISOString(),
              description: `Evidence linked in ${parsed.title}`
            });
          }

          // Check for unlinked images in this day folder to generate Gallery
          const unlinkedMedia = mediaFiles.filter((m) => !linkedMediaSet.has(m));
          let finalNotes = parsed.body;

          if (unlinkedMedia.length > 0) {
            const galleryMarkdown = [
              '\n\n## Media & Evidence Gallery',
              ...unlinkedMedia.map((m) => {
                const ext = m.split('.').pop()?.toLowerCase() || '';
                const mUrl = `/assets/weekly/${weekFolderName}/${dayFolder}/${m}`;
                if (IMAGE_EXTENSIONS.has(ext)) {
                  return `![${m}](${mUrl})`;
                }
                return `- 📄 [${m}](${mUrl})`;
              })
            ].join('\n\n');

            finalNotes += galleryMarkdown;

            // Also add unlinked media to day attachments
            for (const unlinked of unlinkedMedia) {
              const ext = unlinked.split('.').pop()?.toLowerCase() || '';
              const mUrl = `/assets/weekly/${weekFolderName}/${dayFolder}/${unlinked}`;
              let mSize = '1.0 MB';
              const localMediaPath = path.join(dayPath, unlinked);
              if (fs.existsSync(localMediaPath)) {
                const stats = fs.statSync(localMediaPath);
                mSize = formatFileSize(stats.size);
              }

              dayAttachments.push({
                id: `att-${weekSlug}-${dayFolder}-${slugify(unlinked)}`,
                type: getAttachmentType(ext),
                name: unlinked,
                url: mUrl,
                size: mSize,
                uploadedAt: new Date().toISOString(),
                description: `Media asset from ${dayFolder}`
              });

              // Add to global evidence vault items
              compiledEvidence.push({
                id: `ev-${weekSlug}-${dayFolder}-${slugify(unlinked)}`,
                title: `${unlinked} (${weekFolderName} ${dayFolder.replace(/^\d+_/, '')})`,
                category: 'FORGE',
                description: `Artifact submitted during ${weekFolderName} sprint journal (${dayFolder.replace(/^\d+_/, '')}).`,
                format: IMAGE_EXTENSIONS.has(ext) ? 'IMAGE' : (ext === 'pdf' ? 'PDF' : 'REPORT'),
                date: parsed.date,
                size: mSize,
                downloadUrl: mUrl,
                viewUrl: mUrl,
                previewType: IMAGE_EXTENSIONS.has(ext) ? 'image' : 'pdf',
                highlights: [
                  `Sprint: ${weekFolderName}`,
                  `Day: ${dayFolder.replace(/^\d+_/, '')}`,
                  `File: ${unlinked}`
                ],
                verified: true
              });
            }
          }

          // Deduplicate attachments
          const uniqueAttachments = [];
          const seenAttIds = new Set();
          for (const att of dayAttachments) {
            if (!seenAttIds.has(att.id)) {
              seenAttIds.add(att.id);
              uniqueAttachments.push(att);
            }
          }

          const entryId = `entry-${weekSlug}-${dayFolder}-${slugify(parsed.title || mdFile)}`;
          const dateEntry = {
            id: entryId,
            weekId,
            date: parsed.date,
            title: parsed.title,
            notes: finalNotes,
            status: parsed.status,
            attachments: uniqueAttachments,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          };

          weekEntries.push(dateEntry);
          compiledDays[`${weekFolderName}/${dayFolder}`] = dateEntry;

          weeklyMarkdownSections.push(`### ${parsed.title} (${parsed.date})\n\n${finalNotes}`);
        }
      } else if (mediaFiles.length > 0) {
        // There are media files in this day folder even without a dedicated markdown note
        const dayDisplayName = dayFolder.replace(/^\d+_/, '').replace(/_/g, ' ');
        const dayMediaAttachments = [];

        const galleryMarkdown = [
          `## ${dayDisplayName} Artifacts`,
          ...mediaFiles.map((m) => {
            const ext = m.split('.').pop()?.toLowerCase() || '';
            const mUrl = `/assets/weekly/${weekFolderName}/${dayFolder}/${m}`;
            if (IMAGE_EXTENSIONS.has(ext)) {
              return `![${m}](${mUrl})`;
            }
            return `- 📄 [${m}](${mUrl})`;
          })
        ].join('\n\n');

        for (const m of mediaFiles) {
          const ext = m.split('.').pop()?.toLowerCase() || '';
          const mUrl = `/assets/weekly/${weekFolderName}/${dayFolder}/${m}`;
          let mSize = '1.0 MB';
          const localMediaPath = path.join(dayPath, m);
          if (fs.existsSync(localMediaPath)) {
            const stats = fs.statSync(localMediaPath);
            mSize = formatFileSize(stats.size);
          }

          const att = {
            id: `att-${weekSlug}-${dayFolder}-${slugify(m)}`,
            type: getAttachmentType(ext),
            name: m,
            url: mUrl,
            size: mSize,
            uploadedAt: new Date().toISOString(),
            description: `Media asset from ${dayFolder}`
          };
          dayMediaAttachments.push(att);

          compiledEvidence.push({
            id: `ev-${weekSlug}-${dayFolder}-${slugify(m)}`,
            title: `${m} (${weekFolderName} ${dayDisplayName})`,
            category: 'FORGE',
            description: `Artifact collected during ${weekFolderName} sprint (${dayDisplayName}).`,
            format: IMAGE_EXTENSIONS.has(ext) ? 'IMAGE' : (ext === 'pdf' ? 'PDF' : 'REPORT'),
            date: new Date().toISOString().split('T')[0],
            size: mSize,
            downloadUrl: mUrl,
            viewUrl: mUrl,
            previewType: IMAGE_EXTENSIONS.has(ext) ? 'image' : 'pdf',
            highlights: [
              `Sprint: ${weekFolderName}`,
              `Day: ${dayDisplayName}`,
              `Asset: ${m}`
            ],
            verified: true
          });
        }

        const dateEntry = {
          id: `entry-${weekSlug}-${dayFolder}-media`,
          weekId,
          date: new Date().toISOString().split('T')[0],
          title: `${dayDisplayName} Media & Artifacts`,
          notes: galleryMarkdown,
          status: 'PUBLISHED',
          attachments: dayMediaAttachments,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };

        weekEntries.push(dateEntry);
        compiledDays[`${weekFolderName}/${dayFolder}`] = dateEntry;
        weeklyMarkdownSections.push(galleryMarkdown);
      }
    }

    // Build Week representation
    const weekObj = {
      id: weekId,
      weekNumber: weekIdx,
      slug: weekSlug,
      name: weekCustomName || '',
      order: weekIdx,
      entries: weekEntries,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    compiledWeeks.push(weekObj);

    // Generate Weekly Markdown File: src/content/blogs/Week_XX.md
    const weeklyBlogContent = [
      `# ${weekFolderName}${weekCustomName ? ` - ${weekCustomName}` : ''}`,
      `*Sprint Week ${weekNumStr} Journal and Innovation Dossier*`,
      '',
      weeklyMarkdownSections.length > 0
        ? weeklyMarkdownSections.join('\n\n---\n\n')
        : '_No daily notes recorded for this sprint week yet._'
    ].join('\n');

    const weeklyMdPath = path.join(COMPILED_DIR, `${weekFolderName}.md`);
    fs.writeFileSync(weeklyMdPath, weeklyBlogContent, 'utf-8');
  }

  // Generate structured JSON output: src/data/compiledProtoSem.json
  const finalJson = {
    compiledAt: new Date().toISOString(),
    days: compiledDays,
    weeks: compiledWeeks,
    evidence: compiledEvidence
  };

  fs.writeFileSync(JSON_OUTPUT_PATH, JSON.stringify(finalJson, null, 2), 'utf-8');

  const duration = Date.now() - startTime;
  console.log(`✅ [Obsidian Pipeline] Compilation complete in ${duration}ms:`);
  console.log(`   - 20 Weeks processed (Week_00 to Week_19)`);
  console.log(`   - ${totalNotesProcessed} Markdown notes parsed`);
  console.log(`   - ${totalMediaCopied} Media files synced to public/assets/weekly/`);
  console.log(`   - ${compiledEvidence.length} Evidence vault items indexed`);
  console.log(`   - Weekly blogs written to src/content/blogs/`);
  console.log(`   - Master JSON generated at ${JSON_OUTPUT_PATH}`);
}

buildTemplates().catch((err) => {
  console.error('❌ [Obsidian Pipeline] Compilation error:', err);
  process.exit(1);
});
