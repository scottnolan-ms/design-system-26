import { useState, useRef } from 'react';
import { Icon } from '../components/Icon';
import { Text } from '../components/Text';
import { Input } from '../components/Input';
import { ICONS, IconToken } from '../design-tokens/icons';
import {
  ICON_REGISTRY,
  KNOWN_SVG_FILES,
  type IconRegistryEntry,
  type IconName,
} from '../design-tokens/icon-registry';

// ─── Helpers ──────────────────────────────────────────────────────────────────

function groupByCategory(entries: readonly IconRegistryEntry[]) {
  const order: string[] = [];
  const map = new Map<string, IconRegistryEntry[]>();
  for (const entry of entries) {
    if (!map.has(entry.category)) {
      map.set(entry.category, []);
      order.push(entry.category);
    }
    map.get(entry.category)!.push(entry);
  }
  return order.map(label => ({ label, entries: map.get(label)! }));
}

function sourceLabel(t: IconToken): string {
  return 'name' in t ? t.name : t.src;
}

// ─── Token table (Semantic Tokens tab) ───────────────────────────────────────

function TokenRow({ entry }: { entry: IconRegistryEntry }) {
  const [copied, setCopied] = useState<'token' | 'source' | null>(null);
  const resolved = ICONS[entry.token as IconName];
  const isSvg = resolved ? 'src' in resolved : entry.type === 'svg';

  function copyText(text: string, which: 'token' | 'source') {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(which);
      setTimeout(() => setCopied(null), 1500);
    });
  }

  const cellBase: React.CSSProperties = {
    padding: '8px 12px',
    verticalAlign: 'middle',
    borderBottom: '1px solid var(--sys-outline-variant, #f3f4f6)',
  };

  const srcText = resolved ? sourceLabel(resolved) : entry.source;

  return (
    <tr>
      {/* Icon preview */}
      <td style={{ ...cellBase, width: 48, textAlign: 'center' }}>
        {resolved
          ? <Icon token={entry.token as IconName} size="md" />
          : <span style={{ fontSize: 11, color: '#f59e0b', fontFamily: 'monospace' }}>⚠ missing</span>}
      </td>

      {/* Token name */}
      <td style={cellBase}>
        <button
          onClick={() => copyText(`ICONS.${entry.token}`, 'token')}
          title="Copy token name"
          style={{
            background: copied === 'token' ? 'var(--sys-primary-container, #ede9ff)' : 'var(--sys-surface-variant, #f4f4f6)',
            border: 'none', borderRadius: 4, padding: '2px 6px',
            cursor: 'pointer', fontFamily: 'monospace', fontSize: 13,
            color: copied === 'token' ? 'var(--sys-primary, #7c3aed)' : 'inherit',
            transition: 'background 0.15s',
          }}
        >
          {copied === 'token' ? 'Copied!' : `ICONS.${entry.token}`}
        </button>
      </td>

      {/* Source */}
      <td style={cellBase}>
        <button
          onClick={() => copyText(srcText, 'source')}
          title="Copy source"
          style={{
            background: copied === 'source' ? 'var(--sys-primary-container, #ede9ff)' : 'transparent',
            border: 'none', borderRadius: 4, padding: '2px 6px',
            cursor: 'pointer', fontFamily: 'monospace', fontSize: 12,
            color: copied === 'source' ? 'var(--sys-primary, #7c3aed)' : isSvg ? 'var(--sys-outline, #6b7280)' : 'inherit',
            transition: 'background 0.15s',
          }}
        >
          {copied === 'source' ? 'Copied!' : srcText}
        </button>
        {isSvg && (
          <span style={{
            marginLeft: 6, fontSize: 10, fontFamily: 'var(--font-body)',
            background: '#fff3cd', color: '#92400e',
            padding: '1px 5px', borderRadius: 3, verticalAlign: 'middle',
          }}>SVG</span>
        )}
      </td>

      {/* Usage */}
      <td style={{ ...cellBase, color: 'var(--sys-background-on-variant, #6b7280)', fontSize: 13 }}>
        {entry.usage}
      </td>
    </tr>
  );
}

function TokenTable({ query }: { query: string }) {
  const lq = query.toLowerCase();

  const filteredGroups = groupByCategory(ICON_REGISTRY).map(group => ({
    ...group,
    entries: query.trim()
      ? group.entries.filter(
          e =>
            e.token.toLowerCase().includes(lq) ||
            e.usage.toLowerCase().includes(lq) ||
            e.source.toLowerCase().includes(lq) ||
            (e.figmaName ?? '').toLowerCase().includes(lq),
        )
      : group.entries,
  })).filter(g => g.entries.length > 0);

  if (filteredGroups.length === 0) return null;

  return (
    <div style={{ overflowX: 'auto' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', fontFamily: 'var(--font-body)', fontSize: 13 }}>
        <thead>
          <tr style={{ background: 'var(--sys-surface-variant, #f4f4f6)' }}>
            {['', 'Token', 'Source', 'Usage'].map(h => (
              <th key={h} style={{
                padding: '8px 12px', textAlign: 'left', fontWeight: 600, fontSize: 12,
                color: 'var(--sys-background-on-variant, #6b7280)',
                borderBottom: '1px solid var(--sys-outline-variant, #e5e7eb)',
                whiteSpace: 'nowrap',
              }}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {filteredGroups.map(group => (
            <>
              <tr key={group.label} style={{ background: '#fafafa' }}>
                <td colSpan={4} style={{
                  padding: '10px 12px 6px', fontWeight: 600, fontSize: 11,
                  textTransform: 'uppercase', letterSpacing: '0.06em',
                  color: 'var(--sys-outline, #9ca3af)',
                  borderBottom: '1px solid var(--sys-outline-variant, #f3f4f6)',
                }}>{group.label}</td>
              </tr>
              {group.entries.map(entry => (
                <TokenRow key={entry.token} entry={entry} />
              ))}
            </>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// ─── Full catalog (raw symbol browser) ───────────────────────────────────────

interface IconEntry { name: string; usage: string; showFill?: boolean; }
interface IconCategory { label: string; icons: IconEntry[]; }

const ICON_CATEGORIES: IconCategory[] = [
  {
    label: 'Navigation',
    icons: [
      { name: 'home',            usage: 'Dashboard home' },
      { name: 'menu',            usage: 'Sidebar / hamburger toggle' },
      { name: 'arrow_forward',   usage: 'Forward navigation' },
      { name: 'arrow_back',      usage: 'Back navigation' },
      { name: 'chevron_right',   usage: 'Inline forward / list row' },
      { name: 'chevron_left',    usage: 'Inline back' },
      { name: 'expand_more',     usage: 'Accordion open / dropdown' },
      { name: 'expand_less',     usage: 'Accordion close' },
      { name: 'open_in_new',     usage: 'External link' },
      { name: 'fullscreen',      usage: 'Enter fullscreen' },
      { name: 'fullscreen_exit', usage: 'Exit fullscreen' },
      { name: 'swap_horiz',      usage: 'Switch / alternate between two views' },
    ],
  },
  {
    label: 'Actions',
    icons: [
      { name: 'add',          usage: 'Create / add new item' },
      { name: 'close',        usage: 'Dismiss / close / remove tag' },
      { name: 'edit',         usage: 'Edit / modify in place' },
      { name: 'delete',       usage: 'Permanently delete' },
      { name: 'search',       usage: 'Search / find' },
      { name: 'filter_list',  usage: 'Filter results' },
      { name: 'sort',         usage: 'Sort order' },
      { name: 'more_horiz',   usage: 'Overflow menu (horizontal)' },
      { name: 'more_vert',    usage: 'Overflow menu (vertical)' },
      { name: 'settings',     usage: 'Settings / configuration' },
      { name: 'tune',         usage: 'Advanced settings / fine-tune' },
      { name: 'download',     usage: 'Download / export data' },
      { name: 'upload',       usage: 'Upload / import file' },
      { name: 'share',        usage: 'Share / distribute' },
      { name: 'content_copy', usage: 'Copy to clipboard' },
      { name: 'refresh',      usage: 'Reload / refresh data' },
      { name: 'undo',         usage: 'Undo last action' },
      { name: 'redo',         usage: 'Redo action' },
    ],
  },
  {
    label: 'Status & Feedback',
    icons: [
      { name: 'check',        usage: 'Confirmed / small tick mark' },
      { name: 'check_circle', usage: 'Success state / correct answer', showFill: true },
      { name: 'cancel',       usage: 'Error state / incorrect answer', showFill: true },
      { name: 'warning',      usage: 'Warning / caution', showFill: true },
      { name: 'error',        usage: 'Critical error', showFill: true },
      { name: 'info',         usage: 'Informational tip', showFill: true },
      { name: 'help',         usage: 'Help / contextual guidance', showFill: true },
      { name: 'flag',         usage: 'Flagged / at-risk marker', showFill: true },
      { name: 'star',         usage: 'Rating / favourite', showFill: true },
      { name: 'thumb_up',     usage: 'Positive feedback / yes', showFill: true },
      { name: 'thumb_down',   usage: 'Negative feedback / no', showFill: true },
      { name: 'new_releases', usage: 'New / recently added badge' },
      { name: 'block',        usage: 'Blocked / not permitted' },
    ],
  },
  {
    label: 'Education',
    icons: [
      { name: 'school',               usage: 'School / institution' },
      { name: 'calculate',            usage: 'Maths / calculation' },
      { name: 'quiz',                 usage: 'Quiz / short assessment' },
      { name: 'assignment',           usage: 'Task / worksheet / homework' },
      { name: 'menu_book',            usage: 'Curriculum / textbook' },
      { name: 'lightbulb',            usage: 'Hint / insight / idea', showFill: true },
      { name: 'psychology',           usage: 'Learning / cognition / mental model' },
      { name: 'workspace_premium',    usage: 'Achievement / premium milestone' },
      { name: 'emoji_events',         usage: 'Trophy / top result' },
      { name: 'timer',                usage: 'Timed task / countdown' },
      { name: 'calendar_today',       usage: 'Due date / schedule' },
      { name: 'auto_awesome',         usage: 'Adaptive / AI-powered recommendation' },
      { name: 'edit_note',            usage: 'Written response / working-out entry' },
      { name: 'format_list_numbered', usage: 'Ordered list / question sequence' },
    ],
  },
  {
    label: 'Progress & Data',
    icons: [
      { name: 'trending_up',   usage: 'Positive growth trend' },
      { name: 'trending_down', usage: 'Negative growth trend' },
      { name: 'trending_flat', usage: 'Neutral / no change' },
      { name: 'bar_chart',     usage: 'Chart / analytics view' },
      { name: 'show_chart',    usage: 'Line graph / trend over time' },
      { name: 'percent',       usage: 'Percentage score' },
      { name: 'leaderboard',   usage: 'Ranking / leaderboard' },
      { name: 'insights',      usage: 'Data insights summary' },
    ],
  },
  {
    label: 'Users & People',
    icons: [
      { name: 'person',             usage: 'Individual student or user' },
      { name: 'group',              usage: 'Class / student group' },
      { name: 'people',             usage: 'Cohort / school-wide' },
      { name: 'supervisor_account', usage: 'Teacher / supervisor' },
      { name: 'manage_accounts',    usage: 'Account management / admin' },
      { name: 'notifications',      usage: 'Notification bell', showFill: true },
      { name: 'mail',               usage: 'Email / message' },
      { name: 'logout',             usage: 'Sign out' },
    ],
  },
  {
    label: 'Content & Files',
    icons: [
      { name: 'folder',       usage: 'Collection / folder', showFill: true },
      { name: 'folder_open',  usage: 'Open / expanded folder' },
      { name: 'description',  usage: 'Document / file' },
      { name: 'image',        usage: 'Image content / media' },
      { name: 'attach_file',  usage: 'Attachment' },
      { name: 'link',         usage: 'Hyperlink / URL' },
      { name: 'print',        usage: 'Print / export to PDF' },
    ],
  },
  {
    label: 'Bookmarks & Labels',
    icons: [
      { name: 'bookmark',  usage: 'Saved / bookmarked topic', showFill: true },
      { name: 'label',     usage: 'Tag / category label', showFill: true },
      { name: 'favorite',  usage: 'Liked / favourited item', showFill: true },
      { name: 'push_pin',  usage: 'Pinned / sticky item', showFill: true },
      { name: 'lock',      usage: 'Locked / results not yet released', showFill: true },
      { name: 'lock_open', usage: 'Unlocked / results released' },
    ],
  },
];

function IconCard({ entry }: { entry: IconEntry }) {
  const [copied, setCopied] = useState(false);

  function handleCopy() {
    navigator.clipboard.writeText(entry.name).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    });
  }

  return (
    <button
      onClick={handleCopy}
      title={`Click to copy "${entry.name}"`}
      style={{
        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8,
        padding: '16px 12px 12px',
        background: copied ? 'var(--sys-primary-container, #ede9ff)' : 'var(--sys-surface-variant, #f4f4f6)',
        border: '1px solid transparent', borderRadius: 8,
        cursor: 'pointer', textAlign: 'center',
        transition: 'background 0.15s, border-color 0.15s',
        width: '100%', minWidth: 0,
      }}
      onMouseEnter={e => { if (!copied) (e.currentTarget as HTMLElement).style.borderColor = 'var(--sys-outline, #ccc)'; }}
      onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = 'transparent'; }}
    >
      <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
        <Icon name={entry.name} size="md" />
        {entry.showFill && <Icon name={entry.name} size="md" fill={1} />}
      </div>
      <span style={{ width: '100%' }}>
        <Text as="span" style="label-xs" color={copied ? 'primary' : undefined}>
          {copied ? 'Copied!' : entry.name}
        </Text>
      </span>
      <span style={{ width: '100%' }}>
        <Text as="span" style="label-xs" color="subtle">{entry.usage}</Text>
      </span>
    </button>
  );
}

function CatalogSection({ category, query }: { category: IconCategory; query: string }) {
  const filtered = query.trim()
    ? category.icons.filter(
        i =>
          i.name.toLowerCase().includes(query.toLowerCase()) ||
          i.usage.toLowerCase().includes(query.toLowerCase()),
      )
    : category.icons;

  if (filtered.length === 0) return null;

  return (
    <div>
      <Text as="h3" style="heading-xs" color="subtle">{category.label}</Text>
      <div style={{ marginTop: 12, display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))', gap: 8 }}>
        {filtered.map(icon => <IconCard key={icon.name} entry={icon} />)}
      </div>
    </div>
  );
}

// ─── Registry editor ──────────────────────────────────────────────────────────

function generateRegistryTs(rows: IconRegistryEntry[]): string {
  const groups = groupByCategory(rows);
  const sep = (label: string) =>
    `\n  // ── ${label} ${'─'.repeat(Math.max(2, 60 - label.length))}─\n`;

  const entryLine = (e: IconRegistryEntry): string => {
    const q = (s: string) => `'${s.replace(/'/g, "\\'")}'`;
    const parts = [
      `token: ${q(e.token)}`,
      `type: ${q(e.type)}`,
      `source: ${q(e.source)}`,
    ];
    if (e.figmaName) parts.push(`figmaName: ${q(e.figmaName)}`);
    if (e.fill !== undefined) parts.push(`fill: ${e.fill}`);
    parts.push(`usage: ${q(e.usage)}`);
    parts.push(`category: ${q(e.category)}`);
    return `  { ${parts.join(', ')} },`;
  };

  const body = groups
    .map(g => sep(g.label) + g.entries.map(entryLine).join('\n'))
    .join('\n');

  const svgFiles = [...new Set(rows.filter(r => r.type === 'svg').map(r => r.source.replace('/icons/', '')))];
  const knownLines = svgFiles.map(f => `  '${f}',`).join('\n');

  return [
    `/**`,
    ` * Icon Registry — source of truth for all icon tokens.`,
    ` * Edit via the Icon Glossary → Editor tab, then paste back here.`,
    ` */`,
    ``,
    `export interface IconRegistryEntry {`,
    `  token: string;`,
    `  type: 'symbol' | 'svg';`,
    `  source: string;`,
    `  figmaName?: string;`,
    `  fill?: 0 | 1;`,
    `  usage: string;`,
    `  category: string;`,
    `}`,
    ``,
    `export const ICON_REGISTRY = [`,
    body,
    `] as const satisfies ReadonlyArray<IconRegistryEntry>;`,
    ``,
    `export type IconName = (typeof ICON_REGISTRY)[number]['token'];`,
    ``,
    `export const KNOWN_SVG_FILES: readonly string[] = [`,
    knownLines,
    `] as const;`,
  ].join('\n');
}

// ── Editable cell ─────────────────────────────────────────────────────────────

function EditableCell({
  value,
  onSave,
  mono = false,
  placeholder = '—',
  wide = false,
}: {
  value: string;
  onSave: (v: string) => void;
  mono?: boolean;
  placeholder?: string;
  wide?: boolean;
}) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(value);

  const baseStyle: React.CSSProperties = {
    fontFamily: mono ? 'monospace' : 'var(--font-body)',
    fontSize: mono ? 12 : 13,
    width: wide ? '100%' : undefined,
    minWidth: wide ? 180 : 80,
  };

  if (!editing) {
    return (
      <span
        onClick={() => { setDraft(value); setEditing(true); }}
        title="Click to edit"
        style={{
          ...baseStyle,
          cursor: 'text',
          padding: '2px 4px',
          borderRadius: 3,
          display: 'inline-block',
          color: value ? 'inherit' : '#aaa',
          background: 'transparent',
          transition: 'background 0.1s',
        }}
        onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = '#f0f0f0'; }}
        onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'transparent'; }}
      >
        {value || placeholder}
      </span>
    );
  }

  return (
    <input
      autoFocus
      value={draft}
      onChange={e => setDraft(e.target.value)}
      onBlur={() => { onSave(draft); setEditing(false); }}
      onKeyDown={e => {
        if (e.key === 'Enter') { onSave(draft); setEditing(false); }
        if (e.key === 'Escape') setEditing(false);
      }}
      style={{
        ...baseStyle,
        border: '1px solid var(--sys-primary, #7c3aed)',
        borderRadius: 3,
        padding: '1px 4px',
        outline: 'none',
        background: '#faf9ff',
      }}
    />
  );
}

// ── Type toggle cell ──────────────────────────────────────────────────────────

function TypeCell({ value, onSave }: { value: 'symbol' | 'svg'; onSave: (v: 'symbol' | 'svg') => void }) {
  return (
    <button
      onClick={() => onSave(value === 'symbol' ? 'svg' : 'symbol')}
      title="Click to toggle type"
      style={{
        background: value === 'svg' ? '#fff3cd' : 'var(--sys-surface-variant, #f4f4f6)',
        color: value === 'svg' ? '#92400e' : 'inherit',
        border: 'none', borderRadius: 3, padding: '2px 7px',
        cursor: 'pointer', fontSize: 11, fontFamily: 'monospace',
        fontWeight: 600,
      }}
    >
      {value}
    </button>
  );
}

// ── Fill cell ─────────────────────────────────────────────────────────────────

function FillCell({ value, type, onSave }: { value: 0 | 1 | undefined; type: 'symbol' | 'svg'; onSave: (v: 0 | 1 | undefined) => void }) {
  if (type !== 'symbol') {
    return <span style={{ color: '#ccc', fontSize: 12 }}>—</span>;
  }
  const options: Array<{ label: string; val: 0 | 1 | undefined }> = [
    { label: '—', val: undefined },
    { label: '0', val: 0 },
    { label: '1', val: 1 },
  ];
  const current = options.find(o => o.val === value) ?? options[0];
  const next = options[(options.indexOf(current) + 1) % options.length];
  return (
    <button
      onClick={() => onSave(next.val)}
      title="Click to cycle fill value"
      style={{
        background: value === 1 ? 'var(--sys-primary-container, #ede9ff)' : 'var(--sys-surface-variant, #f4f4f6)',
        color: value === 1 ? 'var(--sys-primary, #7c3aed)' : 'inherit',
        border: 'none', borderRadius: 3, padding: '2px 7px',
        cursor: 'pointer', fontSize: 12, fontFamily: 'monospace',
      }}
    >
      {current.label}
    </button>
  );
}

// ── File status badge ─────────────────────────────────────────────────────────

function FileStatusBadge({ entry }: { entry: IconRegistryEntry }) {
  if (entry.type !== 'svg') return null;
  const filename = entry.source.replace('/icons/', '');
  const exists = (KNOWN_SVG_FILES as readonly string[]).includes(filename);
  return (
    <span
      title={exists ? `File found: public/icons/${filename}` : `File not found: public/icons/${filename} — export from Figma`}
      style={{
        display: 'inline-block', marginLeft: 6,
        fontSize: 10, fontFamily: 'var(--font-body)',
        background: exists ? '#dcfce7' : '#fff3cd',
        color: exists ? '#166534' : '#92400e',
        padding: '1px 5px', borderRadius: 3, verticalAlign: 'middle',
        cursor: 'help',
      }}
    >
      {exists ? '✓ file' : '⚠ missing'}
    </span>
  );
}

// ── Editor row ────────────────────────────────────────────────────────────────

function EditorRow({
  entry,
  onUpdate,
  onDelete,
}: {
  entry: IconRegistryEntry;
  onUpdate: (patch: Partial<IconRegistryEntry>) => void;
  onDelete: () => void;
}) {
  const cellBase: React.CSSProperties = {
    padding: '6px 8px',
    verticalAlign: 'middle',
    borderBottom: '1px solid var(--sys-outline-variant, #f3f4f6)',
  };

  return (
    <tr>
      {/* Preview */}
      <td style={{ ...cellBase, width: 40, textAlign: 'center' }}>
        {ICONS[entry.token as IconName]
          ? <Icon token={entry.token as IconName} size="sm" />
          : <span style={{ fontSize: 10, color: '#f59e0b' }}>⚠</span>}
      </td>

      {/* Category */}
      <td style={cellBase}>
        <EditableCell value={entry.category} onSave={v => onUpdate({ category: v })} wide />
      </td>

      {/* Token */}
      <td style={cellBase}>
        <EditableCell value={entry.token} onSave={v => onUpdate({ token: v })} mono />
      </td>

      {/* Type */}
      <td style={cellBase}>
        <TypeCell value={entry.type} onSave={v => onUpdate({ type: v })} />
      </td>

      {/* Source */}
      <td style={cellBase}>
        <EditableCell value={entry.source} onSave={v => onUpdate({ source: v })} mono wide />
        <FileStatusBadge entry={entry} />
      </td>

      {/* Figma name */}
      <td style={cellBase}>
        <EditableCell
          value={entry.figmaName ?? ''}
          onSave={v => onUpdate({ figmaName: v || undefined })}
          placeholder="—"
          wide
        />
      </td>

      {/* Fill */}
      <td style={{ ...cellBase, textAlign: 'center' }}>
        <FillCell value={entry.fill} type={entry.type} onSave={v => onUpdate({ fill: v })} />
      </td>

      {/* Usage */}
      <td style={cellBase}>
        <EditableCell value={entry.usage} onSave={v => onUpdate({ usage: v })} wide />
      </td>

      {/* Delete */}
      <td style={{ ...cellBase, textAlign: 'center', width: 32 }}>
        <button
          onClick={onDelete}
          title="Delete this token"
          style={{
            background: 'none', border: 'none', cursor: 'pointer',
            color: 'var(--sys-outline, #9ca3af)', fontSize: 16, lineHeight: 1,
            padding: '2px 4px', borderRadius: 3,
          }}
          onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = '#b91c1c'; }}
          onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = 'var(--sys-outline, #9ca3af)'; }}
        >
          ×
        </button>
      </td>
    </tr>
  );
}

// ── Unregistered SVGs panel ───────────────────────────────────────────────────

function UnregisteredSvgsPanel({ rows }: { rows: IconRegistryEntry[] }) {
  const registeredPaths = new Set(
    rows.filter(r => r.type === 'svg').map(r => r.source.replace('/icons/', '')),
  );
  const unregistered = (KNOWN_SVG_FILES as readonly string[]).filter(f => !registeredPaths.has(f));

  if (unregistered.length === 0) {
    return (
      <div style={{
        padding: '12px 16px', background: '#dcfce7', borderRadius: 6,
        fontFamily: 'var(--font-body)', fontSize: 13, color: '#166534',
      }}>
        ✓ All SVG files in public/icons/ are registered as tokens.
      </div>
    );
  }

  return (
    <div style={{ padding: '12px 16px', background: '#fff3cd', borderRadius: 6 }}>
      <div style={{ fontFamily: 'var(--font-body)', fontSize: 13, fontWeight: 600, color: '#92400e', marginBottom: 8 }}>
        ⚠ {unregistered.length} SVG file{unregistered.length !== 1 ? 's' : ''} in public/icons/ not yet registered:
      </div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
        {unregistered.map(f => (
          <code key={f} style={{
            fontSize: 12, background: '#fef9c3', padding: '2px 8px',
            borderRadius: 4, color: '#713f12', fontFamily: 'monospace',
          }}>
            {f}
          </code>
        ))}
      </div>
    </div>
  );
}

// ── Export panel ──────────────────────────────────────────────────────────────

function ExportPanel({ rows }: { rows: IconRegistryEntry[] }) {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const generated = open ? generateRegistryTs(rows) : '';

  function handleCopy() {
    navigator.clipboard.writeText(generated).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  return (
    <div>
      <button
        onClick={() => setOpen(o => !o)}
        style={{
          display: 'flex', alignItems: 'center', gap: 6,
          padding: '8px 16px', borderRadius: 6, cursor: 'pointer',
          background: open ? 'var(--sys-primary, #7c3aed)' : 'var(--sys-surface-variant, #f4f4f6)',
          color: open ? '#fff' : 'inherit',
          border: '1px solid ' + (open ? 'var(--sys-primary, #7c3aed)' : 'var(--sys-outline-variant, #e5e7eb)'),
          fontFamily: 'var(--font-body)', fontSize: 14, fontWeight: 500,
        }}
      >
        <Icon name={open ? 'expand_less' : 'code'} size="sm" />
        {open ? 'Hide generated code' : 'Export icon-registry.ts'}
      </button>

      {open && (
        <div style={{ marginTop: 12 }}>
          <div style={{ marginBottom: 8, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Text as="p" style="body-xs" color="subtle">
              Copy and paste into <code style={{ fontFamily: 'monospace', background: '#f4f4f6', padding: '1px 4px', borderRadius: 3 }}>src/design-tokens/icon-registry.ts</code>
            </Text>
            <button
              onClick={handleCopy}
              style={{
                display: 'flex', alignItems: 'center', gap: 4,
                padding: '4px 12px', borderRadius: 4, cursor: 'pointer',
                background: copied ? '#dcfce7' : 'var(--sys-surface-variant, #f4f4f6)',
                color: copied ? '#166534' : 'inherit',
                border: '1px solid ' + (copied ? '#86efac' : 'var(--sys-outline-variant, #e5e7eb)'),
                fontFamily: 'var(--font-body)', fontSize: 13,
                transition: 'background 0.15s',
              }}
            >
              <Icon name={copied ? 'check' : 'content_copy'} size="sm" />
              {copied ? 'Copied!' : 'Copy all'}
            </button>
          </div>
          <pre style={{
            background: '#1e1b2e', color: '#c4b5fd',
            padding: '16px 20px', borderRadius: 8,
            fontSize: 11, lineHeight: 1.6, fontFamily: 'monospace',
            overflowX: 'auto', maxHeight: 480,
            margin: 0,
          }}>
            {generated}
          </pre>
        </div>
      )}
    </div>
  );
}

// ── Registry editor ───────────────────────────────────────────────────────────

const BLANK_ENTRY: IconRegistryEntry = {
  token: 'newToken',
  type: 'symbol',
  source: '',
  figmaName: '',
  usage: '',
  category: 'Navigation',
};

function RegistryEditor() {
  const [rows, setRows] = useState<IconRegistryEntry[]>(() =>
    (ICON_REGISTRY as ReadonlyArray<IconRegistryEntry>).map(e => ({ ...e })),
  );
  const [filterQuery, setFilterQuery] = useState('');
  const tableRef = useRef<HTMLDivElement>(null);

  function updateRow(idx: number, patch: Partial<IconRegistryEntry>) {
    setRows(prev => prev.map((r, i) => i === idx ? { ...r, ...patch } : r));
  }

  function deleteRow(idx: number) {
    setRows(prev => prev.filter((_, i) => i !== idx));
  }

  function addRow() {
    setRows(prev => [...prev, { ...BLANK_ENTRY }]);
    // Scroll to bottom of table after render
    setTimeout(() => {
      tableRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
    }, 50);
  }

  const lq = filterQuery.toLowerCase();
  const displayRows = filterQuery.trim()
    ? rows.filter(
        r =>
          r.token.toLowerCase().includes(lq) ||
          r.source.toLowerCase().includes(lq) ||
          r.usage.toLowerCase().includes(lq) ||
          r.category.toLowerCase().includes(lq) ||
          (r.figmaName ?? '').toLowerCase().includes(lq),
      )
    : rows;

  const colHeaders = ['', 'Category', 'Token', 'Type', 'Source', 'Figma name', 'Fill', 'Usage', ''];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

      {/* Toolbar */}
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12, flexWrap: 'wrap' }}>
        <div style={{ flex: '1 1 240px', maxWidth: 360 }}>
          <Input
            label="Filter rows"
            placeholder="e.g. mastery, svg, Task…"
            iconLeft={{ name: 'search', label: 'Search' }}
            value={filterQuery}
            onChange={e => setFilterQuery(e.target.value)}
            size="sm"
          />
        </div>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center', paddingTop: 22 }}>
          <button
            onClick={addRow}
            style={{
              display: 'flex', alignItems: 'center', gap: 4,
              padding: '6px 14px', borderRadius: 6, cursor: 'pointer',
              background: 'var(--sys-surface-variant, #f4f4f6)',
              border: '1px solid var(--sys-outline-variant, #e5e7eb)',
              fontFamily: 'var(--font-body)', fontSize: 13,
            }}
          >
            <Icon name="add" size="sm" />
            Add token
          </button>
          <span style={{ fontFamily: 'var(--font-body)', fontSize: 12, color: '#9ca3af' }}>
            {rows.length} token{rows.length !== 1 ? 's' : ''}
            {filterQuery.trim() && ` · ${displayRows.length} shown`}
          </span>
        </div>
      </div>

      {/* Unregistered SVGs */}
      <UnregisteredSvgsPanel rows={rows} />

      {/* Export */}
      <ExportPanel rows={rows} />

      {/* Table */}
      <div ref={tableRef} style={{ overflowX: 'auto' }}>
        <table style={{
          width: '100%', borderCollapse: 'collapse',
          fontFamily: 'var(--font-body)', fontSize: 13,
        }}>
          <thead>
            <tr style={{ background: 'var(--sys-surface-variant, #f4f4f6)' }}>
              {colHeaders.map((h, i) => (
                <th key={i} style={{
                  padding: '8px 8px', textAlign: 'left', fontWeight: 600, fontSize: 11,
                  color: 'var(--sys-background-on-variant, #6b7280)',
                  borderBottom: '1px solid var(--sys-outline-variant, #e5e7eb)',
                  whiteSpace: 'nowrap',
                }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {displayRows.map((entry) => {
              // find real index in rows array for updates (filter may have shifted it)
              const realIdx = rows.indexOf(entry);
              return (
                <EditorRow
                  key={realIdx}
                  entry={entry}
                  onUpdate={patch => updateRow(realIdx, patch)}
                  onDelete={() => deleteRow(realIdx)}
                />
              );
            })}
          </tbody>
        </table>
        {displayRows.length === 0 && (
          <div style={{ padding: '24px 12px', color: '#9ca3af', fontFamily: 'var(--font-body)', fontSize: 13 }}>
            No tokens matched "{filterQuery}"
          </div>
        )}
      </div>

      {/* Bottom add button */}
      <div>
        <button
          onClick={addRow}
          style={{
            display: 'flex', alignItems: 'center', gap: 4,
            padding: '6px 14px', borderRadius: 6, cursor: 'pointer',
            background: 'none',
            border: '1px dashed var(--sys-outline-variant, #d1d5db)',
            fontFamily: 'var(--font-body)', fontSize: 13,
            color: 'var(--sys-outline, #9ca3af)', width: '100%',
            justifyContent: 'center',
          }}
        >
          <Icon name="add" size="sm" />
          Add token
        </button>
      </div>

    </div>
  );
}

// ─── Tabs ─────────────────────────────────────────────────────────────────────

type GlossaryTab = 'tokens' | 'catalog' | 'editor';

// ─── View ─────────────────────────────────────────────────────────────────────

export function IconGlossary() {
  const [tab, setTab]     = useState<GlossaryTab>('tokens');
  const [query, setQuery] = useState('');

  const catalogCount = ICON_CATEGORIES.flatMap(c =>
    query.trim()
      ? c.icons.filter(
          i =>
            i.name.toLowerCase().includes(query.toLowerCase()) ||
            i.usage.toLowerCase().includes(query.toLowerCase()),
        )
      : c.icons,
  ).length;

  const tabs: { id: GlossaryTab; label: string; icon: string }[] = [
    { id: 'tokens',  label: 'Semantic Tokens', icon: 'label' },
    { id: 'catalog', label: 'Full Catalog',     icon: 'grid_view' },
    { id: 'editor',  label: 'Editor',           icon: 'edit_note' },
  ];

  return (
    <section style={{ padding: '40px 32px' }}>

      {/* Header */}
      <div style={{ marginBottom: 24 }}>
        <Text as="h2" style="heading-s">Icon Glossary</Text>
        <div style={{ marginTop: 6 }}>
          <Text as="p" style="body-s" color="subtle">
            Material Symbols Rounded · Weight 400 · Optical size 24dp.
            Mastery and difficulty icons are custom Mathspace SVGs.
          </Text>
        </div>
      </div>

      {/* Inner tab bar */}
      <div style={{
        display: 'flex', gap: 0,
        borderBottom: '1px solid var(--sys-outline-variant, #e5e7eb)',
        marginBottom: 32,
      }}>
        {tabs.map(t => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            style={{
              display: 'flex', alignItems: 'center', gap: 6,
              padding: '10px 20px', background: 'none', border: 'none',
              borderBottom: tab === t.id
                ? '2px solid var(--sys-primary, #7c3aed)'
                : '2px solid transparent',
              color: tab === t.id
                ? 'var(--sys-primary, #7c3aed)'
                : 'var(--sys-background-on-variant, #6b7280)',
              cursor: 'pointer', fontFamily: 'var(--font-body)', fontSize: 14,
              fontWeight: tab === t.id ? 600 : 400,
              marginBottom: -1,
              transition: 'color 0.15s, border-color 0.15s',
            }}
          >
            <Icon name={t.icon} size="sm" />
            {t.label}
          </button>
        ))}
      </div>

      {/* Search (tokens + catalog only) */}
      {tab !== 'editor' && (
        <div style={{ maxWidth: 360, marginBottom: 32 }}>
          <Input
            label={tab === 'tokens' ? 'Search tokens' : 'Search icons'}
            placeholder={tab === 'tokens'
              ? 'e.g. skills, mastery, difficulty…'
              : 'e.g. star, bookmark, correct…'}
            iconLeft={{ name: 'search', label: 'Search' }}
            value={query}
            onChange={e => setQuery(e.target.value)}
          />
          {query.trim() && tab === 'catalog' && (
            <div style={{ marginTop: 8 }}>
              <Text as="p" style="body-xs" color="subtle">
                {catalogCount} icon{catalogCount !== 1 ? 's' : ''} matched
              </Text>
            </div>
          )}
        </div>
      )}

      {/* Token table */}
      {tab === 'tokens' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <div style={{ marginBottom: 16 }}>
            <Text as="p" style="body-xs" color="subtle">
              Use the <code style={{ fontFamily: 'monospace', background: '#f4f4f6', padding: '1px 4px', borderRadius: 3 }}>token</code> prop
              instead of <code style={{ fontFamily: 'monospace', background: '#f4f4f6', padding: '1px 4px', borderRadius: 3 }}>name</code> or{' '}
              <code style={{ fontFamily: 'monospace', background: '#f4f4f6', padding: '1px 4px', borderRadius: 3 }}>src</code> — changing a token
              in <code style={{ fontFamily: 'monospace', background: '#f4f4f6', padding: '1px 4px', borderRadius: 3 }}>icon-registry.ts</code> updates every usage automatically.
              Click any cell to copy.
            </Text>
            <div style={{ marginTop: 8 }}>
              <code style={{
                fontFamily: 'monospace', fontSize: 13,
                background: '#1e1b2e', color: '#c4b5fd',
                padding: '8px 14px', borderRadius: 6, display: 'inline-block',
              }}>
                {'<Icon token="skills" size="sm" />'}
              </code>
            </div>
          </div>
          <TokenTable query={query} />
        </div>
      )}

      {/* Full catalog */}
      {tab === 'catalog' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 40 }}>
          {ICON_CATEGORIES.map(category => (
            <CatalogSection key={category.label} category={category} query={query} />
          ))}
          {catalogCount === 0 && (
            <Text as="p" style="body-s" color="subtle">
              No icons matched "{query}". Try searching by icon name or description.
            </Text>
          )}
        </div>
      )}

      {/* Editor */}
      {tab === 'editor' && (
        <div>
          <div style={{ marginBottom: 24 }}>
            <Text as="p" style="body-s" color="subtle">
              Edit tokens inline. Click any cell to modify it. Changes are in-memory only —
              use <strong>Export icon-registry.ts</strong> to copy the generated file and paste it
              back into <code style={{ fontFamily: 'monospace', background: '#f4f4f6', padding: '1px 4px', borderRadius: 3 }}>src/design-tokens/icon-registry.ts</code> to persist.
            </Text>
            <div style={{ marginTop: 8 }}>
              <Text as="p" style="body-xs" color="subtle">
                File status badge: <span style={{ background: '#dcfce7', color: '#166534', padding: '1px 5px', borderRadius: 3, fontSize: 10 }}>✓ file</span> = SVG exists in public/icons/ · <span style={{ background: '#fff3cd', color: '#92400e', padding: '1px 5px', borderRadius: 3, fontSize: 10 }}>⚠ missing</span> = needs export from Figma
              </Text>
            </div>
          </div>
          <RegistryEditor />
        </div>
      )}

    </section>
  );
}
