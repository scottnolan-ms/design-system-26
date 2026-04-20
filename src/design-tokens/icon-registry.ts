/**
 * Icon Registry — source of truth for all icon tokens.
 *
 * This file drives:
 *   - icons.ts (the ICONS lookup used by the Icon component)
 *   - The Icon Glossary token table and editor view
 *
 * To add or edit a token: modify ICON_REGISTRY here, or use the
 * Icon Glossary → Editor tab and paste the exported file content back here.
 *
 * Fields:
 *   token      Semantic key used in code: <Icon token="skills" />
 *   type       'symbol' = Material Symbols Rounded ligature; 'svg' = custom SVG
 *   source     Symbol ligature name (snake_case) or public SVG path (/icons/xxx.svg)
 *   figmaName  Original Figma component / symbol name — for syncing exports from Figma
 *   fill       Fill axis override for symbol tokens (0 = outlined, 1 = filled)
 *   usage      Human-readable description of what this icon represents
 *   category   Grouping label used in the Icon Glossary
 */

// ─── Types ────────────────────────────────────────────────────────────────────

export interface IconRegistryEntry {
  /** Semantic token used in code: <Icon token="skills" /> */
  token: string;
  /** Rendering type */
  type: 'symbol' | 'svg';
  /**
   * For type='symbol': the Material Symbols Rounded ligature name (snake_case).
   * For type='svg': the public path e.g. /icons/difficulty-easy.svg
   */
  source: string;
  /**
   * Original Figma component / symbol name.
   * Used to identify the correct asset when exporting SVGs from the Figma file.
   * Match this against the component name in Figma to keep the registry aligned.
   */
  figmaName?: string;
  /**
   * Fill axis (symbol tokens only).
   * 0 = outlined (default), 1 = filled.
   */
  fill?: 0 | 1;
  /** Human-readable description of what this icon represents and when to use it. */
  usage: string;
  /** Grouping category displayed in the Icon Glossary. */
  category: string;
}

// ─── Registry ─────────────────────────────────────────────────────────────────

export const ICON_REGISTRY = [

  // ── Navigation ──────────────────────────────────────────────────────────────
  { token: 'home',           type: 'symbol', source: 'home',            figmaName: 'home',            usage: 'Dashboard home',                              category: 'Navigation' },
  { token: 'menuOpen',       type: 'symbol', source: 'menu',            figmaName: 'menu',            usage: 'Sidebar / hamburger toggle',                  category: 'Navigation' },
  { token: 'navBack',        type: 'symbol', source: 'arrow_back',      figmaName: 'arrow_back',      usage: 'Back navigation',                             category: 'Navigation' },
  { token: 'navForward',     type: 'symbol', source: 'arrow_forward',   figmaName: 'arrow_forward',   usage: 'Forward navigation',                          category: 'Navigation' },
  { token: 'chevronRight',   type: 'symbol', source: 'chevron_right',   figmaName: 'chevron_right',   usage: 'Inline forward / list row disclosure',         category: 'Navigation' },
  { token: 'chevronLeft',    type: 'symbol', source: 'chevron_left',    figmaName: 'chevron_left',    usage: 'Inline back',                                 category: 'Navigation' },
  { token: 'expandMore',     type: 'symbol', source: 'expand_more',     figmaName: 'expand_more',     usage: 'Accordion open / dropdown',                   category: 'Navigation' },
  { token: 'expandLess',     type: 'symbol', source: 'expand_less',     figmaName: 'expand_less',     usage: 'Accordion close',                             category: 'Navigation' },
  { token: 'externalLink',   type: 'symbol', source: 'open_in_new',     figmaName: 'open_in_new',     usage: 'Opens in new tab',                            category: 'Navigation' },
  { token: 'fullscreen',     type: 'symbol', source: 'fullscreen',      figmaName: 'fullscreen',      usage: 'Enter fullscreen',                            category: 'Navigation' },
  { token: 'fullscreenExit', type: 'symbol', source: 'fullscreen_exit', figmaName: 'fullscreen_exit', usage: 'Exit fullscreen',                             category: 'Navigation' },

  // ── Actions ──────────────────────────────────────────────────────────────────
  { token: 'add',       type: 'symbol', source: 'add',          usage: 'Create / add new item',                      category: 'Actions' },
  { token: 'close',     type: 'symbol', source: 'close',        usage: 'Dismiss / close / remove tag',               category: 'Actions' },
  { token: 'edit',      type: 'symbol', source: 'edit',         usage: 'Edit in place',                              category: 'Actions' },
  { token: 'delete',    type: 'symbol', source: 'delete',       usage: 'Permanently delete',                         category: 'Actions' },
  { token: 'search',    type: 'symbol', source: 'search',       usage: 'Search / find',                              category: 'Actions' },
  { token: 'filter',    type: 'symbol', source: 'filter_list',  usage: 'Filter results',                             category: 'Actions' },
  { token: 'sort',      type: 'symbol', source: 'sort',         usage: 'Sort order',                                 category: 'Actions' },
  { token: 'overflowH', type: 'symbol', source: 'more_horiz',   usage: 'Overflow menu (horizontal)',                 category: 'Actions' },
  { token: 'overflowV', type: 'symbol', source: 'more_vert',    usage: 'Overflow menu (vertical)',                   category: 'Actions' },
  { token: 'settings',  type: 'symbol', source: 'settings',     usage: 'Settings / configuration',                  category: 'Actions' },
  { token: 'download',  type: 'symbol', source: 'download',     usage: 'Download / export',                          category: 'Actions' },
  { token: 'upload',    type: 'symbol', source: 'upload',       usage: 'Upload / import',                            category: 'Actions' },
  { token: 'share',     type: 'symbol', source: 'share',        usage: 'Share / distribute',                         category: 'Actions' },
  { token: 'copy',      type: 'symbol', source: 'content_copy', usage: 'Copy to clipboard',                          category: 'Actions' },
  { token: 'refresh',   type: 'symbol', source: 'refresh',      usage: 'Reload / refresh data',                      category: 'Actions' },
  { token: 'undo',      type: 'symbol', source: 'undo',         usage: 'Undo last action',                           category: 'Actions' },
  { token: 'redo',      type: 'symbol', source: 'redo',         usage: 'Redo action',                                category: 'Actions' },

  // ── Status & Feedback ────────────────────────────────────────────────────────
  { token: 'check',     type: 'symbol', source: 'check',        usage: 'Confirmed / small tick mark',                category: 'Status & Feedback' },
  { token: 'correct',   type: 'symbol', source: 'check_circle', usage: 'Success state / correct answer (symbol)',    category: 'Status & Feedback' },
  { token: 'incorrect', type: 'symbol', source: 'cancel',       usage: 'Error state / incorrect answer (symbol)',    category: 'Status & Feedback' },
  { token: 'warning',   type: 'symbol', source: 'warning',      usage: 'Warning / caution',                          category: 'Status & Feedback' },
  { token: 'error',     type: 'symbol', source: 'error',        usage: 'Critical error',                             category: 'Status & Feedback' },
  { token: 'info',      type: 'symbol', source: 'info',         usage: 'Informational tip',                          category: 'Status & Feedback' },
  { token: 'help',      type: 'symbol', source: 'help',         usage: 'Help / contextual guidance',                 category: 'Status & Feedback' },
  { token: 'flag',      type: 'symbol', source: 'flag',         usage: 'Flagged / at-risk student or question',      category: 'Status & Feedback' },
  { token: 'block',     type: 'symbol', source: 'block',        usage: 'Blocked / not permitted',                    category: 'Status & Feedback' },

  // ── Education ────────────────────────────────────────────────────────────────
  { token: 'skills',          type: 'symbol', source: 'psychology',        figmaName: 'psychology',                      usage: 'Student learning skills / ability level',            category: 'Education' },
  { token: 'topic',           type: 'symbol', source: 'menu_book',         figmaName: 'Topic - Dash',                    usage: 'Curriculum topic or chapter (outlined)',              category: 'Education' },
  { token: 'topicFilled',     type: 'svg',    source: '/icons/Topic-Fill.svg',     figmaName: 'Topic - Fill',            usage: 'Curriculum topic — filled / active state',           category: 'Education' },
  { token: 'topicMastered',   type: 'svg',    source: '/icons/Topic-Mastered.svg', figmaName: 'Topic - Mastered',        usage: 'Topic fully mastered by student',                    category: 'Education' },
  { token: 'task',            type: 'symbol', source: 'assignment',        figmaName: 'assignment',                      usage: 'Generic assigned task or homework',                   category: 'Education' },
  { token: 'quiz',            type: 'symbol', source: 'quiz',              figmaName: 'quiz',                            usage: 'Quiz / short assessment',                             category: 'Education' },
  { token: 'school',          type: 'symbol', source: 'school',            figmaName: 'school',                          usage: 'School / institution',                                category: 'Education' },
  { token: 'hint',            type: 'symbol', source: 'lightbulb',         figmaName: 'lightbulb',                       usage: 'Hint or insight prompt during practice',              category: 'Education' },
  { token: 'achievement',     type: 'symbol', source: 'workspace_premium', figmaName: 'workspace_premium',               usage: 'Achievement / premium milestone',                     category: 'Education' },
  { token: 'trophy',          type: 'symbol', source: 'emoji_events',      figmaName: 'emoji_events',                    usage: 'Top result / leaderboard trophy',                     category: 'Education' },
  { token: 'timer',           type: 'symbol', source: 'timer',             figmaName: 'timer',                           usage: 'Timed task / countdown',                              category: 'Education' },
  { token: 'dueDate',         type: 'symbol', source: 'calendar_today',    figmaName: 'calendar_today',                  usage: 'Due date / schedule',                                 category: 'Education' },
  { token: 'adaptive',        type: 'symbol', source: 'auto_awesome',      figmaName: 'AI-Stars',                        usage: 'AI / adaptive practice recommendation',               category: 'Education' },
  { token: 'writtenResponse', type: 'symbol', source: 'edit_note',         figmaName: 'edit_note',                       usage: 'Written response / working-out entry',                category: 'Education' },

  // ── Task types ───────────────────────────────────────────────────────────────
  //
  // Custom Mathspace SVG icons for specific task type variants.
  // Export from Figma using the figmaName and save to the source path.
  //
  { token: 'taskAdaptive', type: 'svg', source: '/icons/Task-Adaptive.svg',  figmaName: 'Task - Adaptive - flowchart',    usage: 'Adaptive AI-powered task',                            category: 'Task types' },
  { token: 'taskCustom',   type: 'svg', source: '/icons/Task-Custom.svg',    figmaName: 'Task - Custom - lists',          usage: 'Custom teacher-created task',                         category: 'Task types' },
  { token: 'taskLesson',   type: 'svg', source: '/icons/Lesson.svg',         figmaName: 'Task - Lesson',                  usage: 'Lesson task with guided content',                     category: 'Task types' },
  { token: 'worksheet',    type: 'svg', source: '/icons/Worksheet.svg',      figmaName: 'docs - Worksheet',               usage: 'Worksheet / printed document task',                   category: 'Task types' },
  { token: 'test',         type: 'svg', source: '/icons/Docs - Test.svg',    figmaName: 'docs - Test',                    usage: 'Test / formal assessment',                            category: 'Task types' },
  { token: 'revision',     type: 'svg', source: '/icons/Revision.svg',       figmaName: 'Revision',                       usage: 'Revision task / review prior content',                category: 'Task types' },
  { token: 'checkIn',      type: 'svg', source: '/icons/Task-Checkin.svg',   figmaName: 'Task - Checkin - MS-flag',       usage: 'Check-in diagnostic assessment',                      category: 'Task types' },

  // ── Answer states ────────────────────────────────────────────────────────────
  //
  // Mathspace custom SVG pictograms for student response feedback.
  // Use these for answer result screens and review modes (not generic status chips).
  //
  { token: 'answerCorrect',   type: 'svg', source: '/icons/Check_circle-Correct.svg', figmaName: 'check_circle-Correct',   usage: 'Answer marked as correct',                            category: 'Answer states' },
  { token: 'answerIncorrect', type: 'svg', source: '/icons/Cancel-incorrect.svg',   figmaName: 'cancel-incorrect',       usage: 'Answer marked as incorrect',                          category: 'Answer states' },
  { token: 'answerPartial',   type: 'svg', source: '/icons/Check-partial.svg',      figmaName: 'check-partial',          usage: 'Answer partially correct',                            category: 'Answer states' },
  { token: 'answerSkip',      type: 'svg', source: '/icons/Skip.svg',               figmaName: 'next_plan-skip',         usage: 'Question skipped by student',                         category: 'Answer states' },
  { token: 'answerBlank',     type: 'svg', source: '/icons/Block-no-answer.svg',    figmaName: 'block-no answer',        usage: 'No answer provided',                                  category: 'Answer states' },

  // ── Mastery pictograms ───────────────────────────────────────────────────────
  //
  // Mathspace-specific SVG pictograms, one per mastery band.
  // Updating the source path here changes every mastery icon across the product.
  //
  { token: 'masteryExploring',  type: 'svg', source: '/icons/Mastery - Skills/Earned - 01 - Exploring 0-25.svg',  figmaName: 'Subtopic-Mastery-lvl-01 Exploring',  usage: 'Mastery level 1 — Exploring (0–25%)',    category: 'Mastery' },
  { token: 'masteryEmerging',   type: 'svg', source: '/icons/Mastery - Skills/Earned - 02 - Emerging 25-50.svg',  figmaName: 'Subtopic-Mastery-lvl-02 Emerging',   usage: 'Mastery level 2 — Emerging (25–50%)',   category: 'Mastery' },
  { token: 'masteryFamiliar',   type: 'svg', source: '/icons/Mastery - Skills/Earned - 03 - Familiar 50-75.svg',  figmaName: 'Subtopic-Mastery-lvl-03 Familiar',   usage: 'Mastery level 3 — Familiar (50–75%)',   category: 'Mastery' },
  { token: 'masteryProficient', type: 'svg', source: '/icons/Mastery - Skills/Earned - 04 Proficient 75-99.svg',  figmaName: 'Subtopic-Mastery-lvl-04 Proficient', usage: 'Mastery level 4 — Proficient (75–99%)', category: 'Mastery' },
  { token: 'masteryMastered',   type: 'svg', source: '/icons/Mastery - Skills/Earned - 05 Mastered.svg',          figmaName: 'Subtopic-Mastery-lvl-05 Mastered',   usage: 'Mastery level 5 — Mastered (100%)',     category: 'Mastery' },

  // ── Difficulty pictograms ────────────────────────────────────────────────────
  //
  // Mathspace-specific SVG pictograms for question difficulty.
  // Updating the source path here changes every difficulty icon across the product.
  //
  { token: 'difficultyEasy',   type: 'svg', source: '/icons/Difficulty-01 Easy.svg',   figmaName: 'Difficulty-Status-Mt02 - 01 Easy',   usage: 'Easy question difficulty',    category: 'Difficulty' },
  { token: 'difficultyMedium', type: 'svg', source: '/icons/Difficulty-02 Medium.svg', figmaName: 'Difficulty-Status-Mt02 - 02 Medium', usage: 'Medium question difficulty',  category: 'Difficulty' },
  { token: 'difficultyHard',   type: 'svg', source: '/icons/Difficulty-03 Hard.svg',   figmaName: 'Difficulty-Status-Mt02 - 03 Hard',   usage: 'Hard question difficulty',    category: 'Difficulty' },

  // ── Readiness ────────────────────────────────────────────────────────────────
  //
  // Student readiness indicators for upcoming topics.
  //
  { token: 'readinessUnknown',  type: 'svg', source: '/icons/Readiness-01-Unknown.svg',    figmaName: 'Readiness-01-Unknown',   usage: 'Readiness unknown — insufficient data',   category: 'Readiness' },
  { token: 'readinessNotReady', type: 'svg', source: '/icons/Readiness-02-Not Ready.svg',  figmaName: 'Readiness-02-Not-Ready', usage: 'Not ready for this topic',                category: 'Readiness' },
  { token: 'readinessPartial',  type: 'svg', source: '/icons/Readiness-03a-Partially.svg', figmaName: 'Readiness-03-Partial',   usage: 'Partially ready for this topic',          category: 'Readiness' },
  { token: 'readinessReady',    type: 'svg', source: '/icons/Readiness-04a-Ready.svg',     figmaName: 'Readiness-04-Ready',     usage: 'Ready for this topic',                    category: 'Readiness' },

  // ── Brand ────────────────────────────────────────────────────────────────────
  { token: 'brand',   type: 'svg',    source: '/icons/Mathspace-logo-mono-Icon.svg', figmaName: 'Mathspace-Icon', usage: 'Mathspace brand / product icon',                 category: 'Brand' },
  { token: 'aiMilo',  type: 'svg',    source: '/icons/AI-Milo.svg',                figmaName: 'AI-Milo-Dog',   usage: 'AI tutor Milo dog character',                    category: 'Brand' },
  { token: 'aiStars', type: 'symbol', source: 'auto_awesome',               figmaName: 'AI-Stars',      usage: 'AI sparkle — generative / adaptive indicator',   category: 'Brand' },

  // ── Progress & Data ──────────────────────────────────────────────────────────
  { token: 'trendUp',     type: 'symbol', source: 'trending_up',   usage: 'Positive growth trend',      category: 'Progress & Data' },
  { token: 'trendDown',   type: 'symbol', source: 'trending_down', usage: 'Negative growth trend',      category: 'Progress & Data' },
  { token: 'trendFlat',   type: 'symbol', source: 'trending_flat', usage: 'Neutral / no change',        category: 'Progress & Data' },
  { token: 'chart',       type: 'symbol', source: 'bar_chart',     usage: 'Bar chart / analytics',      category: 'Progress & Data' },
  { token: 'lineChart',   type: 'symbol', source: 'show_chart',    usage: 'Line graph / trend',         category: 'Progress & Data' },
  { token: 'leaderboard', type: 'symbol', source: 'leaderboard',   usage: 'Ranking / leaderboard',      category: 'Progress & Data' },
  { token: 'insights',    type: 'symbol', source: 'insights',      usage: 'Data insights summary',      category: 'Progress & Data' },

  // ── Users & People ───────────────────────────────────────────────────────────
  { token: 'student',      type: 'symbol', source: 'person',             figmaName: 'person-local_library - Practice', usage: 'Individual student or user',    category: 'Users & People' },
  { token: 'class',        type: 'symbol', source: 'group',              usage: 'Class / student group',                                                          category: 'Users & People' },
  { token: 'cohort',       type: 'symbol', source: 'people',             usage: 'Cohort / school-wide audience',                                                  category: 'Users & People' },
  { token: 'teacher',      type: 'symbol', source: 'supervisor_account', figmaName: 'graduation - Teacher',            usage: 'Teacher / supervisor',          category: 'Users & People' },
  { token: 'notification', type: 'symbol', source: 'notifications',      usage: 'Notification bell',                                                              category: 'Users & People' },
  { token: 'mail',         type: 'symbol', source: 'mail',               usage: 'Email / message',                                                                category: 'Users & People' },
  { token: 'logout',       type: 'symbol', source: 'logout',             usage: 'Sign out',                                                                       category: 'Users & People' },

  // ── Bookmarks & Labels ───────────────────────────────────────────────────────
  { token: 'bookmark',        type: 'symbol', source: 'bookmark',  usage: 'Save topic — outlined (default state)',      category: 'Bookmarks & Labels' },
  { token: 'bookmarkFilled',  type: 'symbol', source: 'bookmark',  fill: 1, usage: 'Save topic — filled (active / saved state)', category: 'Bookmarks & Labels' },
  { token: 'label',           type: 'symbol', source: 'label',     usage: 'Tag / category label — outlined',            category: 'Bookmarks & Labels' },
  { token: 'labelFilled',     type: 'symbol', source: 'label',     fill: 1, usage: 'Tag — filled (active)',              category: 'Bookmarks & Labels' },
  { token: 'favourite',       type: 'symbol', source: 'favorite',  usage: 'Favourite item — outlined',                  category: 'Bookmarks & Labels' },
  { token: 'favouriteFilled', type: 'symbol', source: 'favorite',  fill: 1, usage: 'Favourite item — filled (active)',   category: 'Bookmarks & Labels' },
  { token: 'pin',             type: 'symbol', source: 'push_pin',  usage: 'Pinned / sticky item',                       category: 'Bookmarks & Labels' },
  { token: 'lock',            type: 'symbol', source: 'lock',      usage: 'Locked / results not yet released',          category: 'Bookmarks & Labels' },
  { token: 'unlock',          type: 'symbol', source: 'lock_open', usage: 'Unlocked / results released',                category: 'Bookmarks & Labels' },

  // ── Content & Files ──────────────────────────────────────────────────────────
  { token: 'folder',     type: 'symbol', source: 'folder',      usage: 'Collection / folder',     category: 'Content & Files' },
  { token: 'folderOpen', type: 'symbol', source: 'folder_open', usage: 'Open / expanded folder',  category: 'Content & Files' },
  { token: 'document',   type: 'symbol', source: 'description', usage: 'Document / file',         category: 'Content & Files' },
  { token: 'image',      type: 'symbol', source: 'image',       usage: 'Image content / media',   category: 'Content & Files' },
  { token: 'attachment', type: 'symbol', source: 'attach_file', usage: 'File attachment',         category: 'Content & Files' },
  { token: 'link',       type: 'symbol', source: 'link',        usage: 'Hyperlink / URL',         category: 'Content & Files' },
  { token: 'print',      type: 'symbol', source: 'print',       usage: 'Print / export to PDF',   category: 'Content & Files' },

] as const satisfies ReadonlyArray<IconRegistryEntry>;

// ─── Derived types ────────────────────────────────────────────────────────────

/** Union of all valid icon token names. Derived from the registry at compile time. */
export type IconName = (typeof ICON_REGISTRY)[number]['token'];

// ─── Known SVG files ──────────────────────────────────────────────────────────

/**
 * SVG paths (relative to public/icons/) that are confirmed present on disk.
 * Matches the source paths in ICON_REGISTRY minus the leading '/icons/' prefix.
 * Update when you add or remove files from public/icons/.
 * Used by the Icon Glossary editor to show the ✓ file / ⚠ missing badge.
 */
export const KNOWN_SVG_FILES: readonly string[] = [
  // Difficulty
  'Difficulty-01 Easy.svg',
  'Difficulty-02 Medium.svg',
  'Difficulty-03 Hard.svg',
  // Topic
  'Topic-Fill.svg',
  'Topic-Mastered.svg',
  // Task types
  'Task-Adaptive.svg',
  'Task-Custom.svg',
  'Lesson.svg',
  'Worksheet.svg',
  'Docs - Test.svg',
  'Revision.svg',
  'Task-Checkin.svg',
  // Answer states
  'Check_circle-Correct.svg',
  'Cancel-incorrect.svg',
  'Check-partial.svg',
  'Skip.svg',
  'Block-no-answer.svg',
  // Mastery — coloured rich icons, stay in subfolder
  'Mastery - Skills/Earned - 01 - Exploring 0-25.svg',
  'Mastery - Skills/Earned - 02 - Emerging 25-50.svg',
  'Mastery - Skills/Earned - 03 - Familiar 50-75.svg',
  'Mastery - Skills/Earned - 04 Proficient 75-99.svg',
  'Mastery - Skills/Earned - 05 Mastered.svg',
  // Readiness
  'Readiness-01-Unknown.svg',
  'Readiness-02-Not Ready.svg',
  'Readiness-03a-Partially.svg',
  'Readiness-04a-Ready.svg',
  // Brand
  'Mathspace-logo-mono-Icon.svg',
  'AI-Milo.svg',
] as const;
