import { useState } from 'react';
import { Button } from './components/Button';
import { Chip } from './components/Chip';
import { Icon } from './components/Icon';
import { Input } from './components/Input';
import { Select } from './components/Select';
import { Text } from './components/Text';
import { IconGlossary } from './views/IconGlossary';


type View = 'design-system' | 'icon-glossary';

// ─── Preview sections ─────────────────────────────────────────────────────────

function TypeScale() {
  return (
    <section style={{ padding: '40px 32px', borderBottom: '1px solid #e5e7eb' }}>
      <Text as="h2" style="heading-xs" color="subtle">Typography — Heading scale</Text>
      <div style={{ marginTop: 24, display: 'flex', flexDirection: 'column', gap: 16 }}>

        {/* Same visual size (heading-m), different semantic levels — the key principle */}
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 16 }}>
          <Text as="h1" style="heading-xl">Heading XL</Text>
          <Text as="span" style="body-xs" color="subtle">as=h1 · 56/62 · Gilroy ExtraBold</Text>
        </div>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 16 }}>
          <Text as="h2" style="heading-l">Heading L</Text>
          <Text as="span" style="body-xs" color="subtle">as=h2 · 32/38</Text>
        </div>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 16 }}>
          <Text as="h3" style="heading-m">Heading M</Text>
          <Text as="span" style="body-xs" color="subtle">as=h3 · 28/34</Text>
        </div>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 16 }}>
          <Text as="h4" style="heading-s">Heading S</Text>
          <Text as="span" style="body-xs" color="subtle">as=h4 · 20/24</Text>
        </div>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 16 }}>
          <Text as="h5" style="heading-xs">Heading XS</Text>
          <Text as="span" style="body-xs" color="subtle">as=h5 · 16/20</Text>
        </div>
      </div>

      {/* Demonstrate size/semantic decoupling */}
      <div style={{ marginTop: 32, padding: 20, background: '#f9fafb', borderRadius: 8 }}>
        <Text as="h2" style="body-xs--strong" color="subtle">
          Semantic vs Visual decoupling — same h2 tag, different visual sizes
        </Text>
        <div style={{ marginTop: 12, display: 'flex', flexDirection: 'column', gap: 8 }}>
          <Text as="h2" style="heading-xl">h2 styled as heading-xl (hero)</Text>
          <Text as="h2" style="heading-m">h2 styled as heading-m (section)</Text>
          <Text as="h2" style="heading-xs">h2 styled as heading-xs (widget)</Text>
        </div>
      </div>
    </section>
  );
}

function BodyScale() {
  return (
    <section style={{ padding: '40px 32px', borderBottom: '1px solid #e5e7eb' }}>
      <Text as="h2" style="heading-xs" color="subtle">Typography — Body + Label scale</Text>
      <div style={{ marginTop: 24, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 32 }}>

        <div>
          <Text as="p" style="body-xs--strong" color="subtle">Body — Proxima Nova</Text>
          <div style={{ marginTop: 12, display: 'flex', flexDirection: 'column', gap: 8 }}>
            <Text as="p" style="body-xl">Body XL · 20px regular</Text>
            <Text as="p" style="body-xl--strong">Body XL · 20px strong</Text>
            <Text as="p" style="body-l">Body L · 18px regular</Text>
            <Text as="p" style="body-l--strong">Body L · 18px strong</Text>
            <Text as="p" style="body">Body · 16px regular</Text>
            <Text as="p" style="body--strong">Body · 16px strong</Text>
            <Text as="p" style="body-s">Body S · 14px regular</Text>
            <Text as="p" style="body-s--strong">Body S · 14px strong</Text>
            <Text as="p" style="body-xs">Body XS · 12px regular</Text>
            <Text as="p" style="body-xs--strong">Body XS · 12px strong</Text>
          </div>
        </div>

        <div>
          <Text as="p" style="body-xs--strong" color="subtle">Labels — tight line-height</Text>
          <div style={{ marginTop: 12, display: 'flex', flexDirection: 'column', gap: 8 }}>
            <Text as="span" style="label-l">Label L · 18px medium</Text>
            <Text as="span" style="label-l--strong">Label L · 18px strong</Text>
            <Text as="span" style="label">Label · 16px medium</Text>
            <Text as="span" style="label--strong">Label · 16px strong</Text>
            <Text as="span" style="label-s">Label S · 14px medium</Text>
            <Text as="span" style="label-s--strong">Label S · 14px strong</Text>
            <Text as="span" style="label-xs">Label XS · 12px medium</Text>
            <Text as="span" style="label-xs--strong">Label XS · 12px strong</Text>
          </div>
        </div>
      </div>
    </section>
  );
}

function MiloScale() {
  return (
    <section style={{ padding: '40px 32px', background: '#faf7ff', borderBottom: '1px solid #e5e7eb' }}>
      <Text as="h2" style="heading-xs" color="subtle">Milo voice — Playpen Sans (student audience)</Text>
      <div style={{ marginTop: 16 }}>
        <Text as="p" style="body-s" color="subtle">
          Same size scale as headings + body, different font family.
          Used for Milo character moments, encouragement, student-facing narrative.
        </Text>
      </div>
      <div style={{ marginTop: 24, display: 'flex', flexDirection: 'column', gap: 12 }}>
        <Text as="p" style="milo-heading-l">Yay! First question of the day</Text>
        <Text as="p" style="milo-heading-m">Let's try something new!</Text>
        <Text as="p" style="milo-l">Great work — you're on a roll.</Text>
        <Text as="p" style="milo">Keep going, you've got this!</Text>
        <Text as="p" style="milo-s">You answered 3 in a row correctly.</Text>
        <Text as="p" style="milo-s--strong">+50 XP earned!</Text>
      </div>
    </section>
  );
}

function IconShowcase() {
  return (
    <section style={{ padding: '40px 32px', borderBottom: '1px solid #e5e7eb' }}>
      <Text as="h2" style="heading-xs" color="subtle">Icons — Material Symbols Rounded</Text>
      <div style={{ marginTop: 4 }}>
        <Text as="p" style="body-xs" color="subtle">Weight 400 · Fill 0 · Grade 0 · Optical size 24dp</Text>
      </div>

      <div style={{ marginTop: 24, display: 'flex', flexDirection: 'column', gap: 32 }}>

        {/* Sizes */}
        <div>
          <Text as="p" style="body-xs--strong" color="subtle">Sizes — sm / md / lg</Text>
          <div style={{ marginTop: 12, display: 'flex', alignItems: 'center', gap: 24 }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
              <Icon name="home" size="sm" label="Home" />
              <Text as="span" style="label-xs" color="subtle">sm · 20px</Text>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
              <Icon name="home" size="md" label="Home" />
              <Text as="span" style="label-xs" color="subtle">md · 24px</Text>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
              <Icon name="home" size="lg" label="Home" />
              <Text as="span" style="label-xs" color="subtle">lg · 28px</Text>
            </div>
          </div>
        </div>

        {/* Fill axis */}
        <div>
          <Text as="p" style="body-xs--strong" color="subtle">Fill axis — outlined vs filled</Text>
          <div style={{ marginTop: 12, display: 'flex', alignItems: 'center', gap: 24 }}>
            {(['star', 'bookmark', 'favorite', 'thumb_up'] as const).map(name => (
              <div key={name} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
                <div style={{ display: 'flex', gap: 8 }}>
                  <Icon name={name} fill={0} />
                  <Icon name={name} fill={1} />
                </div>
                <Text as="span" style="label-xs" color="subtle">{name}</Text>
              </div>
            ))}
          </div>
        </div>

        {/* Core UI actions */}
        <div>
          <Text as="p" style="body-xs--strong" color="subtle">Core UI actions</Text>
          <div style={{ marginTop: 12, display: 'flex', flexWrap: 'wrap', gap: 16 }}>
            {[
              'add', 'close', 'check', 'search', 'menu', 'more_horiz', 'more_vert',
              'edit', 'delete', 'settings', 'arrow_forward', 'arrow_back',
              'chevron_right', 'chevron_left', 'expand_more', 'expand_less',
              'notifications', 'person', 'logout', 'home', 'folder',
            ].map(name => (
              <div key={name} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, width: 56 }}>
                <Icon name={name} />
                <span style={{ textAlign: 'center', wordBreak: 'break-all' }}>
                  <Text as="span" style="label-xs" color="subtle">{name}</Text>
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Education domain icons */}
        <div>
          <Text as="p" style="body-xs--strong" color="subtle">Education domain</Text>
          <div style={{ marginTop: 12, display: 'flex', flexWrap: 'wrap', gap: 16 }}>
            {[
              'calculate', 'school', 'lightbulb', 'psychology', 'quiz',
              'assignment', 'menu_book', 'workspace_premium', 'emoji_events',
              'timer', 'calendar_today', 'flag', 'lock', 'lock_open',
            ].map(name => (
              <div key={name} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, width: 56 }}>
                <Icon name={name} />
                <span style={{ textAlign: 'center', wordBreak: 'break-all' }}>
                  <Text as="span" style="label-xs" color="subtle">{name}</Text>
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Colour inheritance */}
        <div>
          <Text as="p" style="body-xs--strong" color="subtle">Colour inheritance — icons take parent color</Text>
          <div style={{ marginTop: 12, display: 'flex', gap: 24, alignItems: 'center' }}>
            <div style={{ color: 'var(--sys-primary)', display: 'flex', alignItems: 'center', gap: 6 }}>
              <Icon name="star" fill={1} />
              <Text as="span" style="body-s" color="primary">Primary</Text>
            </div>
            <div style={{ color: 'var(--sys-error, #b91c1c)', display: 'flex', alignItems: 'center', gap: 6 }}>
              <Icon name="warning" />
              <Text as="span" style="body-s">Error</Text>
            </div>
            <div style={{ color: 'var(--sys-outline)', display: 'flex', alignItems: 'center', gap: 6 }}>
              <Icon name="info" />
              <Text as="span" style="body-s" color="subtle">Subtle</Text>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function ButtonShowcase() {
  return (
    <section style={{ padding: '40px 32px', borderBottom: '1px solid #e5e7eb' }}>
      <Text as="h2" style="heading-xs" color="subtle">Buttons</Text>

      {/* Display variant — Gilroy ExtraBold, depth border */}
      <div style={{ marginTop: 20 }}>
        <Text as="p" style="body-xs--strong" color="subtle">Display variant — Gilroy ExtraBold · pill · depth border</Text>
        <div style={{ marginTop: 12, display: 'flex', flexWrap: 'wrap', gap: 12, alignItems: 'center' }}>
          <Button emphasis="high" variant="display" color="primary"
            iconLeft={{ name: 'add', label: 'Add' }}
            iconRight={{ name: 'arrow_forward', label: 'Next' }}>
            High
          </Button>
          <Button emphasis="medium" variant="display" color="primary">Medium</Button>
          <Button emphasis="outline" variant="display" color="primary">Outline</Button>
          <Button emphasis="low" variant="display" color="primary">Low</Button>
          <Button emphasis="text" variant="display" color="primary">Text link</Button>
          <Button emphasis="high" variant="display" color="primary" disabled>Disabled</Button>
          <Button emphasis="high" variant="display" color="primary" selected>Selected</Button>
        </div>
      </div>

      {/* Default variant — Proxima Nova Medium, no depth border */}
      <div style={{ marginTop: 24 }}>
        <Text as="p" style="body-xs--strong" color="subtle">Default variant — Proxima Nova Medium · pill · no depth border</Text>
        <div style={{ marginTop: 12, display: 'flex', flexWrap: 'wrap', gap: 12, alignItems: 'center' }}>
          <Button emphasis="high" variant="default" color="primary"
            iconLeft={{ name: 'add', label: 'Add' }}>
            High
          </Button>
          <Button emphasis="medium" variant="default" color="primary">Medium</Button>
          <Button emphasis="outline" variant="default" color="primary">Outline</Button>
          <Button emphasis="low" variant="default" color="primary">Low</Button>
          <Button emphasis="text" variant="default" color="primary">Text link</Button>
          <Button emphasis="high" variant="default" color="primary" disabled>Disabled</Button>
        </div>
      </div>

      {/* Neutral colour family */}
      <div style={{ marginTop: 24 }}>
        <Text as="p" style="body-xs--strong" color="subtle">Neutral colour family</Text>
        <div style={{ marginTop: 12, display: 'flex', flexWrap: 'wrap', gap: 12, alignItems: 'center' }}>
          <Button emphasis="high" variant="default" color="neutral">High</Button>
          <Button emphasis="medium" variant="default" color="neutral">Medium</Button>
          <Button emphasis="outline" variant="default" color="neutral">Outline</Button>
          <Button emphasis="low" variant="default" color="neutral">Low</Button>
        </div>
      </div>

      {/* Destructive colour family */}
      <div style={{ marginTop: 24 }}>
        <Text as="p" style="body-xs--strong" color="subtle">Destructive colour family</Text>
        <div style={{ marginTop: 12, display: 'flex', flexWrap: 'wrap', gap: 12, alignItems: 'center' }}>
          <Button emphasis="medium" variant="default" color="destructive">Medium</Button>
          <Button emphasis="outline" variant="default" color="destructive">Outline</Button>
          <Button emphasis="low" variant="default" color="destructive">Low</Button>
        </div>
      </div>
    </section>
  );
}

// ─── Multiselect chip demo ─────────────────────────────────────────────────────

type DifficultyLevel = 'Easy' | 'Medium' | 'Hard';

const DIFFICULTY_CONFIG: Record<DifficultyLevel, { chipColor: string }> = {
  Easy:   { chipColor: 'turquoise' },
  Medium: { chipColor: 'yellow' },
  Hard:   { chipColor: 'orange' },
};

/**
 * Maps difficulty level → icon registry token.
 * Icons are SVGs in public/icons/, routed through the ICONS registry.
 * Scaling: Icon uses mask-size:contain + mask-position:center, so the SVG
 * fills the target size box proportionately regardless of source dimensions.
 * Pass size="sm" (20px) for md chips and size="md" (24px) for lg chips.
 */
const DIFFICULTY_TOKENS = {
  Easy:   'difficultyEasy',
  Medium: 'difficultyMedium',
  Hard:   'difficultyHard',
} as const;

function DifficultyIcon({ level, size = 'sm' }: { level: DifficultyLevel; size?: 'sm' | 'md' }) {
  return (
    <Icon
      token={DIFFICULTY_TOKENS[level]}
      size={size}
      className="chip__icon"
    />
  );
}

function MultiSelectChipDemo() {
  const [selected, setSelected] = useState<Set<DifficultyLevel>>(new Set());

  function toggle(level: DifficultyLevel) {
    setSelected(prev => {
      const next = new Set(prev);
      next.has(level) ? next.delete(level) : next.add(level);
      return next;
    });
  }

  return (
    <div style={{ marginTop: 16 }}>
      <Text as="p" style="body-xs--strong" color="subtle">
        Multiselect — difficulty icon left · checkbox right · whole chip toggles
      </Text>
      <div style={{ marginTop: 8, display: 'flex', flexWrap: 'wrap', gap: 8 }}>
        {(Object.keys(DIFFICULTY_CONFIG) as DifficultyLevel[]).map(level => {
          const isSelected = selected.has(level);
          const { chipColor } = DIFFICULTY_CONFIG[level];
          return (
            <button
              key={level}
              type="button"
              className={`chip chip--filled chip--${chipColor}`}
              data-selected={isSelected || undefined}
              onClick={() => toggle(level)}
            >
              <span className="chip__state-layer">
                <DifficultyIcon level={level} />
                <span className="chip__label">{level}</span>
                <Icon
                  name={isSelected ? 'check_box' : 'check_box_outline_blank'}
                  fill={isSelected ? 1 : 0}
                  size="sm"
                  className="chip__icon"
                />
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

function ChipShowcase() {
  return (
    <section style={{ padding: '40px 32px', borderBottom: '1px solid #e5e7eb' }}>
      <Text as="h2" style="heading-xs" color="subtle">Chips</Text>
      <div style={{ marginTop: 4 }}>
        <Text as="p" style="body-xs" color="subtle">4px corner radius · 32px tall · Proxima Nova Medium 14px · icons 20px</Text>
      </div>

      {/* Emphasis variants */}
      <div style={{ marginTop: 24, display: 'flex', flexDirection: 'column', gap: 20 }}>

        <div>
          <Text as="p" style="body-xs--strong" color="subtle">Filled (tonal) — with icons</Text>
          <div style={{ marginTop: 8, display: 'flex', flexWrap: 'wrap', gap: 8, alignItems: 'center' }}>
            <Chip emphasis="filled" color="primary" iconLeft={{ name: 'add' }}>Primary</Chip>
            <Chip emphasis="filled" color="primary" iconLeft={{ name: 'check' }} selected>Primary · Selected</Chip>
            <Chip emphasis="filled" color="neutral" iconLeft={{ name: 'filter_list' }}>Neutral</Chip>
            <Chip emphasis="filled" color="green" iconLeft={{ name: 'check_circle' }}>Green</Chip>
            <Chip emphasis="filled" color="red" iconLeft={{ name: 'cancel' }}>Red</Chip>
            <Chip emphasis="filled" color="orange">Orange</Chip>
            <Chip emphasis="filled" color="blue">Blue</Chip>
            <Chip emphasis="filled" color="turquoise">Turquoise</Chip>
            <Chip emphasis="filled" color="yellow">Yellow</Chip>
            <Chip emphasis="filled" color="silver">Silver</Chip>
            <Chip emphasis="filled" color="tan">Tan</Chip>
          </div>
        </div>

        <div>
          <Text as="p" style="body-xs--strong" color="subtle">Outline</Text>
          <div style={{ marginTop: 8, display: 'flex', flexWrap: 'wrap', gap: 8, alignItems: 'center' }}>
            <Chip emphasis="outline" color="primary">Primary</Chip>
            <Chip emphasis="outline" color="primary" selected>Primary · Selected</Chip>
            <Chip emphasis="outline" color="neutral">Neutral</Chip>
            <Chip emphasis="outline" color="green">Green</Chip>
            <Chip emphasis="outline" color="red">Red</Chip>
          </div>
        </div>

        <div>
          <Text as="p" style="body-xs--strong" color="subtle">Outline dashed</Text>
          <div style={{ marginTop: 8, display: 'flex', flexWrap: 'wrap', gap: 8, alignItems: 'center' }}>
            <Chip emphasis="outline-dashed" color="neutral">Add filter</Chip>
            <Chip emphasis="outline-dashed" color="primary">Add topic</Chip>
          </div>
        </div>

        <div>
          <Text as="p" style="body-xs--strong" color="subtle">Data — non-interactive labels, no fill</Text>
          <div style={{ marginTop: 8, display: 'flex', flexWrap: 'wrap', gap: 8, alignItems: 'center' }}>
            <Chip emphasis="data" color="primary" iconLeft={{ name: 'label' }}>Primary</Chip>
            <Chip emphasis="data" color="neutral">Neutral</Chip>
            <Chip emphasis="data" color="green">Green</Chip>
            <Chip emphasis="data" color="red">Red</Chip>
            <Chip emphasis="data" color="orange">Orange</Chip>
            <Chip emphasis="data" color="blue">Blue</Chip>
          </div>
        </div>

        {/* Interaction states — using data-demo-* to freeze the state visually */}
        <div>
          <Text as="p" style="body-xs--strong" color="subtle">Interaction states</Text>
          <Text as="p" style="body-xs" color="subtle">
            Interactive chips (as="button") show hover/press/focus on interaction. States shown
            frozen below for reference — try hovering the live row at the bottom.
          </Text>

          {/* State grid: columns = state, rows = colour/emphasis combos */}
          <div style={{
            marginTop: 12,
            display: 'grid',
            gridTemplateColumns: '80px repeat(8, auto)',
            gap: '8px 12px',
            alignItems: 'center',
          }}>
            {/* Header row */}
            <div />
            {['Default', 'Hover', 'Press', 'Selected', 'Sel+Hover', 'Sel+Press', 'Disabled', 'Focus'].map(label => (
              <Text key={label} as="span" style="label-xs" color="subtle">{label}</Text>
            ))}

            {/* Filled primary */}
            <Text as="span" style="label-xs" color="subtle">filled · primary</Text>
            <Chip emphasis="filled" color="primary">Topic</Chip>
            <Chip emphasis="filled" color="primary" data-demo-hover>Topic</Chip>
            <Chip emphasis="filled" color="primary" data-demo-press>Topic</Chip>
            <Chip emphasis="filled" color="primary" selected>Topic</Chip>
            <Chip emphasis="filled" color="primary" selected data-demo-hover>Topic</Chip>
            <Chip emphasis="filled" color="primary" selected data-demo-press>Topic</Chip>
            <Chip as="button" emphasis="filled" color="primary" disabled>Topic</Chip>
            <Chip emphasis="filled" color="primary" data-demo-focus>Topic</Chip>

            {/* Filled green */}
            <Text as="span" style="label-xs" color="subtle">filled · green</Text>
            <Chip emphasis="filled" color="green">Correct</Chip>
            <Chip emphasis="filled" color="green" data-demo-hover>Correct</Chip>
            <Chip emphasis="filled" color="green" data-demo-press>Correct</Chip>
            <Chip emphasis="filled" color="green" selected>Correct</Chip>
            <Chip emphasis="filled" color="green" selected data-demo-hover>Correct</Chip>
            <Chip emphasis="filled" color="green" selected data-demo-press>Correct</Chip>
            <Chip as="button" emphasis="filled" color="green" disabled>Correct</Chip>
            <Chip emphasis="filled" color="green" data-demo-focus>Correct</Chip>

            {/* Outline neutral */}
            <Text as="span" style="label-xs" color="subtle">outline · neutral</Text>
            <Chip emphasis="outline" color="neutral">Grade 7</Chip>
            <Chip emphasis="outline" color="neutral" data-demo-hover>Grade 7</Chip>
            <Chip emphasis="outline" color="neutral" data-demo-press>Grade 7</Chip>
            <Chip emphasis="outline" color="neutral" selected>Grade 7</Chip>
            <Chip emphasis="outline" color="neutral" selected data-demo-hover>Grade 7</Chip>
            <Chip emphasis="outline" color="neutral" selected data-demo-press>Grade 7</Chip>
            <Chip as="button" emphasis="outline" color="neutral" disabled>Grade 7</Chip>
            <Chip emphasis="outline" color="neutral" data-demo-focus>Grade 7</Chip>

            {/* Filled red */}
            <Text as="span" style="label-xs" color="subtle">filled · red</Text>
            <Chip emphasis="filled" color="red">At risk</Chip>
            <Chip emphasis="filled" color="red" data-demo-hover>At risk</Chip>
            <Chip emphasis="filled" color="red" data-demo-press>At risk</Chip>
            <Chip emphasis="filled" color="red" selected>At risk</Chip>
            <Chip emphasis="filled" color="red" selected data-demo-hover>At risk</Chip>
            <Chip emphasis="filled" color="red" selected data-demo-press>At risk</Chip>
            <Chip as="button" emphasis="filled" color="red" disabled>At risk</Chip>
            <Chip emphasis="filled" color="red" data-demo-focus>At risk</Chip>
          </div>

          {/* Live interactive row */}
          <div style={{ marginTop: 16 }}>
            <Text as="p" style="body-xs--strong" color="subtle">Live interactive — hover, press and focus these</Text>
            <div style={{ marginTop: 8, display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              <Chip as="button" emphasis="filled" color="primary" iconRight={{ name: 'close' }}>Algebra</Chip>
              <Chip as="button" emphasis="filled" color="green" iconLeft={{ name: 'check_circle' }}>Correct</Chip>
              <Chip as="button" emphasis="outline" color="neutral">Grade 7</Chip>
              <Chip as="button" emphasis="filled" color="red" iconLeft={{ name: 'flag' }}>At risk</Chip>
              <Chip as="button" emphasis="outline-dashed" color="primary">Add filter</Chip>
            </div>
          </div>

          <MultiSelectChipDemo />
        </div>
      </div>
    </section>
  );
}

function InputShowcase() {
  return (
    <section style={{ padding: '40px 32px', borderBottom: '1px solid #e5e7eb' }}>
      <Text as="h2" style="heading-xs" color="subtle">Input</Text>
      <div style={{ marginTop: 4 }}>
        <Text as="p" style="body-xs" color="subtle">
          Native &lt;input&gt; · 40px · 4px radius · Proxima Nova Medium 16px · full ARIA support
        </Text>
      </div>

      <div style={{ marginTop: 24, display: 'flex', flexDirection: 'column', gap: 32 }}>

        {/* Validation states */}
        <div>
          <Text as="p" style="body-xs--strong" color="subtle">Validation states</Text>
          <div style={{ marginTop: 12, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px 24px', maxWidth: 640 }}>
            <Input
              label="Default"
              helpText="Supplementary description for the field"
              placeholder="Placeholder text"
            />
            <Input
              label="Focused (tab into this field)"
              placeholder="Focus me to see the ring"
            />
            <Input
              label="Error"
              helpText="Enter your full legal name"
              placeholder="Full name"
              validation="error"
              hint="Name is required"
              defaultValue=""
            />
            <Input
              label="Success"
              placeholder="Score"
              validation="success"
              hint="Looks good!"
              defaultValue="95"
            />
            <Input
              label="Disabled"
              placeholder="Not available"
              validation="disabled"
            />
            <Input
              label="Read only"
              validation="readonly"
              defaultValue="Read-only value"
            />
          </div>
        </div>

        {/* With icons */}
        <div>
          <Text as="p" style="body-xs--strong" color="subtle">With icons</Text>
          <div style={{ marginTop: 12, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px 24px', maxWidth: 640 }}>
            <Input
              label="Search"
              placeholder="Search students…"
              iconLeft={{ name: 'search', label: 'Search' }}
            />
            <Input
              label="With trailing icon"
              placeholder="Username"
              iconLeft={{ name: 'person' }}
              iconRight={{ name: 'check_circle' }}
            />
          </div>
        </div>

        {/* Input types */}
        <div>
          <Text as="p" style="body-xs--strong" color="subtle">Input types</Text>
          <div style={{ marginTop: 12, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px 24px', maxWidth: 640 }}>
            <Input
              label="Email"
              type="email"
              placeholder="you@school.edu.au"
              required
            />
            <Input
              label="Password"
              type="password"
              placeholder="Enter your password"
            />
            <Input
              label="Number"
              type="number"
              placeholder="0"
              iconRight={{ name: 'calculate' }}
            />
            <Input
              label="Date"
              type="date"
            />
          </div>
        </div>

      </div>
    </section>
  );
}

function SelectShowcase() {
  const yearLevels = [
    { value: '7', label: 'Year 7' },
    { value: '8', label: 'Year 8' },
    { value: '9', label: 'Year 9' },
    { value: '10', label: 'Year 10' },
    { value: '11', label: 'Year 11' },
    { value: '12', label: 'Year 12' },
  ];

  const states = [
    { value: 'nsw', label: 'New South Wales' },
    { value: 'vic', label: 'Victoria' },
    { value: 'qld', label: 'Queensland' },
    { value: 'sa',  label: 'South Australia' },
    { value: 'wa',  label: 'Western Australia' },
    { value: 'tas', label: 'Tasmania' },
    { value: 'nt',  label: 'Northern Territory' },
    { value: 'act', label: 'Australian Capital Territory' },
  ];

  const curricula = [
    { value: 'nsw', label: 'NSW — NESA' },
    { value: 'vic', label: 'VIC — VCAA' },
    { value: 'qld', label: 'QLD — QCAA' },
    { value: 'aus', label: 'Australian Curriculum (F–10)' },
  ];

  return (
    <section style={{ padding: '40px 32px', borderBottom: '1px solid #e5e7eb' }}>
      <Text as="h2" style="heading-xs" color="subtle">Select (Dropdown)</Text>
      <div style={{ marginTop: 4 }}>
        <Text as="p" style="body-xs" color="subtle">
          Native &lt;select&gt; · styled with appearance:none · full keyboard + screen-reader support
        </Text>
      </div>

      <div style={{ marginTop: 24, display: 'flex', flexDirection: 'column', gap: 32 }}>

        {/* Validation states */}
        <div>
          <Text as="p" style="body-xs--strong" color="subtle">Validation states</Text>
          <div style={{ marginTop: 12, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px 24px', maxWidth: 640 }}>
            <Select
              label="Year level"
              helpText="The student's current year"
              placeholder="Select a year…"
              options={yearLevels}
            />
            <Select
              label="State / Territory"
              placeholder="Select a state…"
              options={states}
              defaultValue="vic"
            />
            <Select
              label="Curriculum"
              placeholder="Select a curriculum…"
              options={curricula}
              validation="error"
              hint="Please select a curriculum"
            />
            <Select
              label="Curriculum"
              placeholder="Select a curriculum…"
              options={curricula}
              validation="success"
              hint="Curriculum confirmed"
              defaultValue="aus"
            />
            <Select
              label="Disabled"
              placeholder="Not available"
              options={yearLevels}
              validation="disabled"
            />
          </div>
        </div>

        {/* With leading icon */}
        <div>
          <Text as="p" style="body-xs--strong" color="subtle">With leading icon</Text>
          <div style={{ marginTop: 12, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px 24px', maxWidth: 640 }}>
            <Select
              label="State"
              placeholder="Select a state…"
              options={states}
              iconLeft={{ name: 'location_on' }}
            />
            <Select
              label="Year level"
              placeholder="Select a year…"
              options={yearLevels}
              iconLeft={{ name: 'school' }}
              required
            />
          </div>
        </div>

      </div>
    </section>
  );
}

function ScalingShowcase() {
  const filterOptions = [
    { value: 'all',   label: 'All students' },
    { value: 'at-risk', label: 'At risk' },
    { value: 'on-track', label: 'On track' },
  ];
  const yearOptions = [
    { value: '7', label: 'Year 7' },
    { value: '8', label: 'Year 8' },
    { value: '9', label: 'Year 9' },
  ];

  return (
    <section style={{ padding: '40px 32px', borderBottom: '1px solid #e5e7eb' }}>
      <Text as="h2" style="heading-xs" color="subtle">Scaling — Size prop + Viewport breakpoints</Text>
      <div style={{ marginTop: 4 }}>
        <Text as="p" style="body-xs" color="subtle">
          Two scaling axes: explicit <code>size</code> prop (available space / emphasis context) and
          automatic viewport breakpoints (sm default on mobile, lg default on large desktop).
        </Text>
      </div>

      {/* ── Buttons ─────────────────────────────────────────────────────────── */}
      <div style={{ marginTop: 32 }}>
        <Text as="p" style="body-xs--strong" color="subtle">Button — xs / sm / md (default) / lg / xl</Text>

        {/* All sizes in a row */}
        <div style={{ marginTop: 12, display: 'flex', flexWrap: 'wrap', gap: 12, alignItems: 'center' }}>
          <Button emphasis="high" color="primary" size="xs" iconLeft={{ name: 'add' }}>xs · 28px</Button>
          <Button emphasis="high" color="primary" size="sm" iconLeft={{ name: 'add' }}>sm · 32px</Button>
          <Button emphasis="high" color="primary" iconLeft={{ name: 'add' }}>md · 40px</Button>
          <Button emphasis="high" color="primary" size="lg" iconLeft={{ name: 'add' }}>lg · 48px</Button>
          <Button emphasis="high" color="primary" size="xl" iconLeft={{ name: 'add' }}>xl · 56px</Button>
        </div>

        {/* Contextual examples */}
        <div style={{ marginTop: 20, display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16 }}>
          <div style={{ padding: 16, background: 'var(--sys-primary-container, #ede9fe)', borderRadius: 8 }}>
            <Text as="p" style="body-xs--strong" color="subtle">Landing page / Hero — xl</Text>
            <div style={{ marginTop: 12, display: 'flex', gap: 10 }}>
              <Button emphasis="high" variant="display" color="primary" size="xl">Get started</Button>
              <Button emphasis="outline" variant="display" color="primary" size="xl">Learn more</Button>
            </div>
          </div>
          <div style={{ padding: 16, background: '#f9fafb', borderRadius: 8 }}>
            <Text as="p" style="body-xs--strong" color="subtle">Standard UI — md (default)</Text>
            <div style={{ marginTop: 12, display: 'flex', gap: 8 }}>
              <Button emphasis="high" color="primary" iconLeft={{ name: 'save' }}>Save</Button>
              <Button emphasis="outline" color="neutral">Cancel</Button>
            </div>
          </div>
          <div style={{ padding: 16, background: '#f9fafb', borderRadius: 8 }}>
            <Text as="p" style="body-xs--strong" color="subtle">Table toolbar — xs / sm</Text>
            <div style={{ marginTop: 12, display: 'flex', gap: 6 }}>
              <Button emphasis="outline" color="neutral" size="xs" iconLeft={{ name: 'filter_list' }}>Filter</Button>
              <Button emphasis="outline" color="neutral" size="xs" iconLeft={{ name: 'download' }}>Export</Button>
              <Button emphasis="high" color="primary" size="xs" iconLeft={{ name: 'add' }}>Add</Button>
            </div>
          </div>
        </div>
      </div>

      {/* ── Chips ───────────────────────────────────────────────────────────── */}
      <div style={{ marginTop: 32 }}>
        <Text as="p" style="body-xs--strong" color="subtle">Chip — sm / md (default) / lg</Text>

        <div style={{ marginTop: 12, display: 'flex', flexWrap: 'wrap', gap: 10, alignItems: 'center' }}>
          <Chip color="primary" size="sm">sm · 24px</Chip>
          <Chip color="primary">md · 32px</Chip>
          <Chip color="primary" size="lg">lg · 40px</Chip>
          <Chip color="green" size="sm" iconLeft={{ name: 'check' }}>Correct (sm)</Chip>
          <Chip color="green" iconLeft={{ name: 'check' }}>Correct (md)</Chip>
          <Chip color="green" size="lg" iconLeft={{ name: 'check' }}>Correct (lg)</Chip>
        </div>

        <div style={{ marginTop: 16, display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16 }}>
          <div style={{ padding: 16, background: 'var(--sys-primary-container, #ede9fe)', borderRadius: 8 }}>
            <Text as="p" style="body-xs--strong" color="subtle">Hero tags — lg</Text>
            <div style={{ marginTop: 10, display: 'flex', flexWrap: 'wrap', gap: 6 }}>
              <Chip color="primary" size="lg" emphasis="filled">Mathematics</Chip>
              <Chip color="blue" size="lg" emphasis="filled">Year 9</Chip>
              <Chip color="green" size="lg" emphasis="filled">On track</Chip>
            </div>
          </div>
          <div style={{ padding: 16, background: '#f9fafb', borderRadius: 8 }}>
            <Text as="p" style="body-xs--strong" color="subtle">Standard filters — md</Text>
            <div style={{ marginTop: 10, display: 'flex', flexWrap: 'wrap', gap: 6 }}>
              <Chip as="button" color="primary" emphasis="outline">Algebra</Chip>
              <Chip as="button" color="neutral" emphasis="outline" selected>Year 8</Chip>
              <Chip as="button" color="red" emphasis="filled">At risk</Chip>
            </div>
          </div>
          <div style={{ padding: 16, background: '#f9fafb', borderRadius: 8 }}>
            <Text as="p" style="body-xs--strong" color="subtle">Table cells — sm</Text>
            <div style={{ marginTop: 10, display: 'flex', flexWrap: 'wrap', gap: 4 }}>
              <Chip color="green" size="sm" emphasis="filled">Mastered</Chip>
              <Chip color="orange" size="sm" emphasis="filled">Developing</Chip>
              <Chip color="red" size="sm" emphasis="filled">Needs support</Chip>
            </div>
          </div>
        </div>
      </div>

      {/* ── Inputs & Selects ────────────────────────────────────────────────── */}
      <div style={{ marginTop: 32 }}>
        <Text as="p" style="body-xs--strong" color="subtle">Input / Select — sm (32px) / md (40px, default) / lg (48px)</Text>

        <div style={{ marginTop: 16, display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 20, maxWidth: 880 }}>

          {/* Landing page — lg */}
          <div style={{ padding: 16, background: 'var(--sys-primary-container, #ede9fe)', borderRadius: 8 }}>
            <Text as="p" style="body-xs--strong" color="subtle">Landing page — lg</Text>
            <div style={{ marginTop: 12, display: 'flex', flexDirection: 'column', gap: 12 }}>
              <Input
                size="lg"
                label="Email address"
                type="email"
                placeholder="you@school.edu.au"
                iconLeft={{ name: 'mail' }}
                required
              />
              <Select
                size="lg"
                label="Year level"
                placeholder="Select year…"
                options={yearOptions}
                iconLeft={{ name: 'school' }}
              />
              <Button emphasis="high" variant="display" color="primary" size="lg">
                Create free account
              </Button>
            </div>
          </div>

          {/* Standard UI — md */}
          <div style={{ padding: 16, background: '#f9fafb', borderRadius: 8 }}>
            <Text as="p" style="body-xs--strong" color="subtle">Standard UI — md (default)</Text>
            <div style={{ marginTop: 12, display: 'flex', flexDirection: 'column', gap: 12 }}>
              <Input
                label="Student name"
                placeholder="Full name"
                iconLeft={{ name: 'person' }}
              />
              <Select
                label="Filter by status"
                placeholder="All students"
                options={filterOptions}
              />
              <Button emphasis="high" color="primary" iconLeft={{ name: 'search' }}>
                Search
              </Button>
            </div>
          </div>

          {/* Table / compact — sm */}
          <div style={{ padding: 16, background: '#f9fafb', borderRadius: 8 }}>
            <Text as="p" style="body-xs--strong" color="subtle">Table toolbar — sm (32px)</Text>
            <div style={{ marginTop: 12, display: 'flex', flexDirection: 'column', gap: 8 }}>
              <Input
                size="sm"
                label="Quick search"
                placeholder="Search…"
                iconLeft={{ name: 'search' }}
              />
              <Select
                size="sm"
                label="Year"
                placeholder="All years"
                options={yearOptions}
              />
              <div style={{ display: 'flex', gap: 6 }}>
                <Button emphasis="high" color="primary" size="sm" iconLeft={{ name: 'filter_list' }}>Filter</Button>
                <Button emphasis="outline" color="neutral" size="sm" iconLeft={{ name: 'download' }}>Export</Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Viewport breakpoint reference ────────────────────────────────────── */}
      <div style={{ marginTop: 32 }}>
        <Text as="p" style="body-xs--strong" color="subtle">Viewport breakpoints — automatic token override via breakpoints.css</Text>
        <Text as="p" style="body-xs" color="subtle" >
          Explicit <code>size</code> prop always wins. Breakpoints only adjust the default (unsized) components.
        </Text>
        <div style={{ marginTop: 12, overflowX: 'auto' }}>
          <table style={{
            borderCollapse: 'collapse',
            fontSize: 13,
            fontFamily: 'var(--font-body)',
            width: '100%',
          }}>
            <thead>
              <tr style={{ background: '#f3f4f6' }}>
                {['Breakpoint', 'Viewport', 'Button default', 'Chip default', 'Input default'].map(h => (
                  <th key={h} style={{ padding: '8px 12px', textAlign: 'left', borderBottom: '1px solid #e5e7eb', fontWeight: 600 }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[
                ['Mobile',        '< 640px',    'sm (32px)', 'sm (24px)', 'sm (32px)'],
                ['Tablet',        '640–1023px', 'md (40px)', 'md (32px)', 'md (40px)'],
                ['Chromebook',    '1024–1279px','md (40px)', 'md (32px)', 'md (40px)'],
                ['MacBook Pro+',  '1280–1599px','md (40px)', 'md (32px)', 'md (40px)'],
                ['27″ desktop+',  '≥ 1600px',   'lg (48px)', 'lg (40px)', 'lg (48px)'],
              ].map(([bp, vp, btn, chip, inp]) => (
                <tr key={bp} style={{ borderBottom: '1px solid #f3f4f6' }}>
                  <td style={{ padding: '8px 12px', fontWeight: 500 }}>{bp}</td>
                  <td style={{ padding: '8px 12px', color: '#6b7280' }}>{vp}</td>
                  <td style={{ padding: '8px 12px' }}>{btn}</td>
                  <td style={{ padding: '8px 12px' }}>{chip}</td>
                  <td style={{ padding: '8px 12px' }}>{inp}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}

// ─── App Nav ──────────────────────────────────────────────────────────────────

const NAV_ITEMS: { id: View; label: string; icon: string }[] = [
  { id: 'design-system', label: 'DS Preview',    icon: 'grid_view' },
  { id: 'icon-glossary', label: 'Icon Glossary', icon: 'interests' },
];

function AppNav({ current, onNavigate }: { current: View; onNavigate: (v: View) => void }) {
  return (
    <nav
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 100,
        background: 'var(--sys-surface, #fff)',
        borderBottom: '1px solid var(--sys-outline-variant, #e5e7eb)',
        padding: '0 32px',
        display: 'flex',
        gap: 4,
      }}
    >
      {NAV_ITEMS.map(item => {
        const active = current === item.id;
        return (
          <button
            key={item.id}
            onClick={() => onNavigate(item.id)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              padding: '12px 16px',
              background: 'none',
              border: 'none',
              borderBottom: active
                ? '2px solid var(--sys-primary, #7c3aed)'
                : '2px solid transparent',
              color: active
                ? 'var(--sys-primary, #7c3aed)'
                : 'var(--sys-background-on-variant, #6b7280)',
              cursor: 'pointer',
              fontFamily: 'var(--font-body)',
              fontSize: 14,
              fontWeight: active ? 600 : 400,
              lineHeight: 1.25,
              marginBottom: -1,
              transition: 'color 0.15s, border-color 0.15s',
            }}
          >
            <Icon name={item.icon} size="sm" />
            {item.label}
          </button>
        );
      })}
    </nav>
  );
}

// ─── App ──────────────────────────────────────────────────────────────────────

export default function App() {
  const [view, setView] = useState<View>('design-system');

  return (
    <div style={{ fontFamily: 'var(--font-body)', color: 'var(--sys-background-on)', minHeight: '100vh' }}>
      <AppNav current={view} onNavigate={setView} />

      <main style={{ maxWidth: 960, margin: '0 auto' }}>
        {view === 'design-system' && (
          <>
            <TypeScale />
            <BodyScale />
            <MiloScale />
            <IconShowcase />
            <ButtonShowcase />
            <ChipShowcase />
            <InputShowcase />
            <SelectShowcase />
            <ScalingShowcase />
          </>
        )}

        {view === 'icon-glossary' && <IconGlossary />}
      </main>
    </div>
  );
}
