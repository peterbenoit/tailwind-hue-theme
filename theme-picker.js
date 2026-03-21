/* ── Hue Picker — self-contained, no deps ────────────────────── */
import './theme-picker.css';

const DEFAULT_HUE = 250;
const PRESETS = [
	{ hue: 250, label: 'Indigo (default)' },
	{ hue: 195, label: 'Teal' },
	{ hue: 295, label: 'Purple' },
	{ hue: 10, label: 'Rose' },
	{ hue: 75, label: 'Amber' },
	{ hue: 155, label: 'Emerald' },
];
const WHEEL_SIZE = 160;
const RING_RADIUS = 61;
const CENTER = WHEEL_SIZE / 2;

// ── Build DOM ─────────────────────────────────────────────────
function buildWidget() {
	const picker = document.createElement('div');
	picker.id = 'hue-picker';
	picker.setAttribute('role', 'complementary');
	picker.setAttribute('aria-label', 'Theme colour picker');

	picker.innerHTML = `
		<button id="hue-trigger" aria-expanded="false" aria-controls="hue-panel"
			aria-label="Change theme colour — drag wheel or pick a preset">
			<span id="hue-trigger-dot"></span>
		</button>
		<div id="hue-panel" hidden>
			<button id="hue-promo-btn" type="button" aria-expanded="false" aria-controls="hue-promo-popup"
				title="Use this on your site">
				?
			</button>
			<div id="hue-promo-popup" hidden>
				<p>One CSS variable, every component recolors. A Tailwind CSS plugin.</p>
				<a href="https://peterbenoit.com/tailwindcss-hue-theme/" target="_blank" rel="noopener noreferrer">
					tailwindcss-hue-theme →
				</a>
			</div>
			<div class="hue-wheel-container" id="hue-wheel-container"
				role="slider" tabindex="0"
				aria-label="Hue wheel — use arrow keys to adjust"
				aria-valuemin="0" aria-valuemax="360" aria-valuenow="${DEFAULT_HUE}">
				<div class="hue-wheel-ring"></div>
				<div class="hue-wheel-hole">
					<div class="hue-wheel-swatch"></div>
				</div>
				<div class="hue-handle" id="hue-handle" aria-hidden="true"></div>
			</div>
			<div class="hue-presets" role="group" aria-label="Colour presets">
				${PRESETS.map(p => `<button class="hue-preset" data-hue="${p.hue}"
					aria-label="${p.label}" title="${p.label}"
					style="background:oklch(62% 0.18 ${p.hue})"></button>`).join('')}
			</div>
			<button id="hue-reset" title="Reset to default indigo">↩ Reset to default</button>
		</div>
	`;

	document.body.appendChild(picker);
}

buildWidget();

const root = document.documentElement;
const trigger = document.getElementById('hue-trigger');
const panel = document.getElementById('hue-panel');
const wheelEl = document.getElementById('hue-wheel-container');
const handle = document.getElementById('hue-handle');
const presets = document.querySelectorAll('.hue-preset');
const resetBtn = document.getElementById('hue-reset');
const promoBtn = document.getElementById('hue-promo-btn');
const promoPopup = document.getElementById('hue-promo-popup');

let currentHue = DEFAULT_HUE;
let isDragging = false;

// ── Init ─────────────────────────────────────────────────────
const saved = localStorage.getItem('brand-hue');
applyHue(saved !== null ? Number(saved) : DEFAULT_HUE, false);

// ── Toggle panel ─────────────────────────────────────────────
trigger.addEventListener('click', () => {
	const wasHidden = panel.hidden;
	panel.hidden = !wasHidden;
	trigger.setAttribute('aria-expanded', String(wasHidden));
	if (!wasHidden) {
		// panel just closed — collapse promo popup too
		promoPopup.hidden = true;
		promoBtn.setAttribute('aria-expanded', 'false');
	}
});

document.addEventListener('pointerdown', (e) => {
	if (!panel.hidden && !document.getElementById('hue-picker').contains(e.target)) {
		panel.hidden = true;
		trigger.setAttribute('aria-expanded', 'false');
	}
});

// ── Drag to rotate ───────────────────────────────────────────
wheelEl.addEventListener('pointerdown', (e) => {
	e.preventDefault();
	isDragging = true;
	wheelEl.setPointerCapture(e.pointerId);
	updateFromPointer(e);
});

wheelEl.addEventListener('pointermove', (e) => {
	if (!isDragging) return;
	updateFromPointer(e);
});

wheelEl.addEventListener('pointerup', () => { isDragging = false; });
wheelEl.addEventListener('pointercancel', () => { isDragging = false; });

function updateFromPointer(e) {
	const rect = wheelEl.getBoundingClientRect();
	const dx = e.clientX - rect.left - CENTER;
	const dy = e.clientY - rect.top - CENTER;
	let h = Math.atan2(dx, -dy) * 180 / Math.PI;
	if (h < 0) h += 360;
	applyHue(Math.round(h), true);
}

// ── Keyboard ─────────────────────────────────────────────────
wheelEl.addEventListener('keydown', (e) => {
	const step = e.shiftKey ? 15 : 5;
	if (e.key === 'ArrowLeft' || e.key === 'ArrowDown') {
		e.preventDefault();
		applyHue((currentHue - step + 360) % 360, true);
	} else if (e.key === 'ArrowRight' || e.key === 'ArrowUp') {
		e.preventDefault();
		applyHue((currentHue + step) % 360, true);
	}
});

// ── Presets ──────────────────────────────────────────────────
presets.forEach((btn) => {
	btn.addEventListener('click', () => applyHue(Number(btn.dataset.hue), true));
});

// ── Reset ────────────────────────────────────────────────────
resetBtn.addEventListener('click', () => applyHue(DEFAULT_HUE, true));

// ── Promo ─────────────────────────────────────────────────────
promoBtn.addEventListener('click', () => {
	const willExpand = promoPopup.hidden;
	promoPopup.hidden = !willExpand;
	promoBtn.setAttribute('aria-expanded', String(willExpand));
});

// ── Core ─────────────────────────────────────────────────────
function applyHue(hue, save) {
	currentHue = hue;
	root.style.setProperty('--brand-h', String(hue));
	positionHandle(hue);
	markActivePreset(hue);
	wheelEl.setAttribute('aria-valuenow', String(hue));
	if (save) localStorage.setItem('brand-hue', String(hue));
}

function positionHandle(hue) {
	const rad = hue * Math.PI / 180;
	const x = CENTER + RING_RADIUS * Math.sin(rad);
	const y = CENTER - RING_RADIUS * Math.cos(rad);
	handle.style.left = x + 'px';
	handle.style.top = y + 'px';
}

function markActivePreset(hue) {
	presets.forEach((btn) => {
		const ph = Number(btn.dataset.hue);
		const diff = Math.abs(((ph - hue + 540) % 360) - 180);
		btn.classList.toggle('active', diff < 8);
	});
}
