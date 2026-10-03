import React, { useMemo, useRef, useState } from "react";
import {
  Award,
  BedDouble,
  Building2,
  Car,
  Check,
  ChevronLeft,
  ChevronRight,
  Compass,
  Dumbbell,
  KeyRound,
  Layers,
  MapPin,
  Menu,
  Phone,
  Ruler,
  ShieldCheck,
  SlidersHorizontal,
  Sun,
  Trees,
  Waves,
  X,
} from "lucide-react";

/*
  Aura Towers – Luxury residential landing page
  React + Tailwind CSS + lucide-react. Hebrew, RTL.
  Font: Assistant (Google Fonts), loaded in index.html.
  Palette: warm stone / off-white ground, dark aluminium, deep navy, matte bronze (accents only).
*/

const nis = (v) =>
  new Intl.NumberFormat("he-IL", { style: "currency", currency: "ILS", maximumFractionDigits: 0 }).format(v);
const millions = (v) => `${(v / 1e6).toLocaleString("he-IL", { maximumFractionDigits: 2 })} מ׳ ₪`;

/* ---------- Data ---------- */

const UNITS = [
  { id: "N-0804", tower: "מגדל צפוני", floor: 8, rooms: 3, sqm: 92, balcony: 12, view: "מזרח · פארק", price: 3_450_000, status: "זמינה" },
  { id: "S-1103", tower: "מגדל דרומי", floor: 11, rooms: 3, sqm: 98, balcony: 14, view: "דרום · עיר", price: 3_790_000, status: "זמינה" },
  { id: "N-1402", tower: "מגדל צפוני", floor: 14, rooms: 4, sqm: 118, balcony: 15, view: "מערב · ים", price: 4_850_000, status: "אחרונות" },
  { id: "S-1605", tower: "מגדל דרומי", floor: 16, rooms: 4, sqm: 124, balcony: 18, view: "צפון · פארק", price: 5_120_000, status: "זמינה" },
  { id: "N-1901", tower: "מגדל צפוני", floor: 19, rooms: 4, sqm: 131, balcony: 16, view: "מערב · ים", price: 5_690_000, status: "זמינה" },
  { id: "S-2204", tower: "מגדל דרומי", floor: 22, rooms: 5, sqm: 152, balcony: 22, view: "דרום־מערב · ים", price: 6_980_000, status: "זמינה" },
  { id: "N-2503", tower: "מגדל צפוני", floor: 25, rooms: 5, sqm: 164, balcony: 24, view: "מערב · ים", price: 7_850_000, status: "אחרונות" },
  { id: "S-2802", tower: "מגדל דרומי", floor: 28, rooms: 5, sqm: 171, balcony: 26, view: "פנורמי", price: 8_400_000, status: "זמינה" },
  { id: "N-3401", tower: "מגדל צפוני", floor: 34, rooms: 6, sqm: 236, balcony: 95, view: "360° · גג פרטי", price: 13_900_000, status: "אחרונות" },
  { id: "S-3201", tower: "מגדל דרומי", floor: 32, rooms: 6, sqm: 214, balcony: 80, view: "360° · בריכה פרטית", price: 11_750_000, status: "זמינה" },
];

const ROOM_FILTERS = [
  { key: "all", label: "הכל" },
  { key: 3, label: "3 חדרים" },
  { key: 4, label: "4 חדרים" },
  { key: 5, label: "5 חדרים" },
  { key: 6, label: "פנטהאוז" },
];

const AMENITIES = [
  { icon: Waves, title: "בריכה מחוממת", text: "בריכת 25 מטר בקומת הספא, פתוחה כל השנה" },
  { icon: Dumbbell, title: "חדר כושר ו־ספא", text: "סאונה יבשה, חדר טיפולים ואזור סטודיו" },
  { icon: KeyRound, title: "לובי מלונאי", text: "קונסיירז׳ 24/7 וקבלת משלוחים מבוקרת" },
  { icon: Trees, title: "גן פרטי 2 דונם", text: "גינון ים־תיכוני ושבילי הליכה לדיירים" },
  { icon: Car, title: "2 חניות לדירה", text: "חניון תת־קרקעי עם עמדות טעינה לרכב חשמלי" },
  { icon: ShieldCheck, title: "תקן בנייה ירוקה", text: "דירוג אנרגטי A ומערכות בית חכם בכל דירה" },
];

/* ---------- Shared bits ---------- */

const ctaClass =
  "inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-l from-[#0F1B2D] to-[#3A4A5E] px-7 py-3.5 text-[15px] font-bold tracking-wide text-white shadow-[0_10px_30px_-10px_rgba(15,27,45,0.55)] transition duration-300 hover:-translate-y-0.5 hover:shadow-[0_16px_40px_-12px_rgba(15,27,45,0.6)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#9A7B4F] disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:translate-y-0";

const ghostClass =
  "inline-flex items-center justify-center gap-2 rounded-full border border-[#2B3138]/20 bg-white/60 px-6 py-3.5 text-[15px] font-semibold text-[#2B3138] transition hover:border-[#2B3138]/40 hover:bg-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#9A7B4F]";

function Eyebrow({ children }) {
  return (
    <p className="mb-3 text-[13px] font-semibold uppercase tracking-[0.18em] text-[#9A7B4F]">{children}</p>
  );
}

function SectionTitle({ eyebrow, title, text }) {
  return (
    <div className="max-w-2xl">
      <Eyebrow>{eyebrow}</Eyebrow>
      <h2 className="text-3xl font-bold leading-tight text-[#0F1B2D] [text-wrap:balance] sm:text-4xl">{title}</h2>
      {text && <p className="mt-4 text-lg font-light leading-relaxed text-[#6B6760]">{text}</p>}
    </div>
  );
}

function RangeField({ id, label, value, min, max, step, onChange, display }) {
  const pct = ((value - min) / (max - min)) * 100;
  return (
    <div>
      <div className="mb-2 flex items-baseline justify-between gap-4">
        <label htmlFor={id} className="text-[15px] font-medium text-[#2B3138]">
          {label}
        </label>
        <span className="text-lg font-bold tabular-nums text-[#0F1B2D]">{display}</span>
      </div>
      <input
        id={id}
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="aura-range w-full"
        style={{ "--pct": `${pct}%` }}
      />
    </div>
  );
}

/* ---------- Rotating trust badge ---------- */

function TrustBadge({ size = 148 }) {
  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg viewBox="0 0 200 200" className="aura-spin h-full w-full" aria-hidden="true" direction="ltr">
        <defs>
          <path id="aura-badge-circle" d="M100,100 m-74,0 a74,74 0 1,1 148,0 a74,74 0 1,1 -148,0" />
        </defs>
        <circle cx="100" cy="100" r="98" fill="#F7F5F1" />
        <circle cx="100" cy="100" r="96" fill="none" stroke="#2B3138" strokeOpacity="0.18" />
        <circle cx="100" cy="100" r="56" fill="none" stroke="#9A7B4F" strokeOpacity="0.5" />
        <text fill="#2B3138" fontSize="19" fontWeight="700" fontFamily="Assistant, sans-serif">
          {/* One pass of the phrase stretched to the full circumference (2π·74 ≈ 465) so it loops seamlessly */}
          <textPath href="#aura-badge-circle" startOffset="0" textLength="458" lengthAdjust="spacing">
            • פרויקט יוקרה נבחר • פרימיום לוקיישן
          </textPath>
        </text>
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <Award className="h-7 w-7 text-[#9A7B4F]" strokeWidth={1.4} />
        <span className="mt-1 text-[11px] font-bold tracking-[0.2em] text-[#2B3138]">2026</span>
      </div>
    </div>
  );
}

/* ---------- Hero illustration (drawn, no external imagery) ---------- */

function TowersArt() {
  const floorsA = 34;
  const floorsB = 28;
  const lit = new Set([3, 7, 12, 15, 19, 22, 26, 30, 33]);
  return (
    <svg viewBox="0 0 420 520" className="h-auto w-full" role="img" aria-label="הדמיית שני מגדלי Aura Towers">
      <defs>
        <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#E6E0D6" />
          <stop offset="1" stopColor="#F7F5F1" />
        </linearGradient>
        <linearGradient id="aluA" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#3B434C" />
          <stop offset="0.55" stopColor="#2B3138" />
          <stop offset="1" stopColor="#1F242A" />
        </linearGradient>
        <linearGradient id="aluB" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#56606B" />
          <stop offset="1" stopColor="#38404A" />
        </linearGradient>
        <linearGradient id="glass" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#FFFFFF" stopOpacity="0.16" />
          <stop offset="1" stopColor="#FFFFFF" stopOpacity="0" />
        </linearGradient>
      </defs>
      <rect x="0" y="0" width="420" height="520" rx="28" fill="url(#sky)" />
      <circle cx="318" cy="96" r="44" fill="#9A7B4F" fillOpacity="0.12" />
      {/* Tower B (back) */}
      <g>
        <rect x="236" y="150" width="104" height="330" fill="url(#aluB)" />
        {Array.from({ length: floorsB }).map((_, i) => (
          <line key={i} x1="236" x2="340" y1={160 + i * 11.4} y2={160 + i * 11.4} stroke="#8A939D" strokeOpacity="0.35" />
        ))}
        {[262, 288, 314].map((x) => (
          <line key={x} x1={x} x2={x} y1="150" y2="480" stroke="#8A939D" strokeOpacity="0.25" />
        ))}
        <rect x="236" y="150" width="104" height="330" fill="url(#glass)" />
      </g>
      {/* Tower A (front) */}
      <g>
        <rect x="96" y="62" width="128" height="418" fill="url(#aluA)" />
        <rect x="108" y="48" width="104" height="14" fill="#2B3138" />
        {Array.from({ length: floorsA }).map((_, i) => {
          const y = 74 + i * 11.8;
          return (
            <g key={i}>
              <line x1="96" x2="224" y1={y} y2={y} stroke="#7C858F" strokeOpacity="0.4" />
              {lit.has(i) && <rect x={i % 2 ? 128 : 160} y={y + 2.5} width="30" height="6.5" fill="#C9A86E" fillOpacity="0.85" />}
            </g>
          );
        })}
        {[128, 160, 192].map((x) => (
          <line key={x} x1={x} x2={x} y1="62" y2="480" stroke="#7C858F" strokeOpacity="0.3" />
        ))}
        <rect x="96" y="62" width="128" height="418" fill="url(#glass)" />
      </g>
      {/* Podium and ground */}
      <rect x="70" y="456" width="300" height="24" fill="#D6CFC3" />
      <rect x="70" y="456" width="300" height="3" fill="#9A7B4F" fillOpacity="0.55" />
      <rect x="40" y="480" width="340" height="2" fill="#2B3138" fillOpacity="0.25" />
      <g fill="#7E8B6E" fillOpacity="0.55">
        <circle cx="60" cy="468" r="12" />
        <circle cx="80" cy="472" r="9" />
        <circle cx="360" cy="468" r="11" />
        <circle cx="384" cy="472" r="8" />
      </g>
    </svg>
  );
}

/* ---------- Unit finder ---------- */

function UnitFinder({ onPick }) {
  const [rooms, setRooms] = useState("all");
  const [budget, setBudget] = useState(7_000_000);

  const results = useMemo(
    () =>
      UNITS.filter((u) => (rooms === "all" || u.rooms === rooms) && u.price <= budget).sort((a, b) => a.price - b.price),
    [rooms, budget]
  );

  return (
    <section id="units" className="scroll-mt-24 px-4 py-20 sm:px-8 lg:py-28">
      <div className="mx-auto max-w-6xl">
        <SectionTitle
          eyebrow="מאתר הדירות"
          title="מצאו את הדירה שמתאימה לכם"
          text="סננו לפי מספר חדרים ותקציב. המחירים כוללים מע״מ, חניה ומחסן."
        />

        <div className="mt-10 grid gap-6 rounded-[28px] border border-[#DDD6CB] bg-white p-5 shadow-[0_20px_60px_-40px_rgba(43,49,56,0.35)] sm:p-8 lg:grid-cols-[1.1fr_1fr] lg:items-end">
          <fieldset>
            <legend className="mb-3 flex items-center gap-2 text-[15px] font-medium text-[#2B3138]">
              <SlidersHorizontal className="h-4 w-4 text-[#9A7B4F]" /> מספר חדרים
            </legend>
            <div className="flex flex-wrap gap-2">
              {ROOM_FILTERS.map((f) => {
                const active = rooms === f.key;
                return (
                  <button
                    key={f.key}
                    type="button"
                    onClick={() => setRooms(f.key)}
                    aria-pressed={active}
                    className={`rounded-full border px-5 py-2.5 text-[15px] transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#9A7B4F] ${
                      active
                        ? "border-[#0F1B2D] bg-[#0F1B2D] font-semibold text-white"
                        : "border-[#DDD6CB] bg-[#F7F5F1] text-[#2B3138] hover:border-[#2B3138]/40"
                    }`}
                  >
                    {f.label}
                  </button>
                );
              })}
            </div>
          </fieldset>
          <RangeField
            id="budget"
            label="תקציב מקסימלי"
            value={budget}
            min={3_000_000}
            max={14_000_000}
            step={100_000}
            onChange={setBudget}
            display={millions(budget)}
          />
        </div>

        <div className="mt-8 flex items-center justify-between text-[15px] text-[#6B6760]">
          <p>
            <span className="font-bold text-[#0F1B2D]">{results.length}</span> דירות תואמות מתוך {UNITS.length}
          </p>
          <p className="hidden sm:block">ממוין לפי מחיר</p>
        </div>

        {results.length === 0 ? (
          <div className="mt-6 rounded-[24px] border border-dashed border-[#DDD6CB] bg-white/60 p-10 text-center">
            <p className="text-lg font-semibold text-[#2B3138]">אין דירה זמינה בטווח הזה</p>
            <p className="mt-2 text-[#6B6760]">הגדילו את התקציב או בחרו מספר חדרים אחר.</p>
          </div>
        ) : (
          <ul className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {results.map((u) => (
              <li
                key={u.id}
                className="group flex flex-col rounded-[24px] border border-[#DDD6CB] bg-white p-6 transition duration-300 hover:-translate-y-1 hover:shadow-[0_24px_50px_-30px_rgba(15,27,45,0.45)]"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-[13px] font-medium tracking-wide text-[#6B6760]">
                      {u.tower} · קומה {u.floor}
                    </p>
                    <h3 className="mt-1 text-xl font-bold text-[#0F1B2D]">
                      {u.rooms === 6 ? "פנטהאוז" : `דירת ${u.rooms} חדרים`}
                    </h3>
                  </div>
                  <span
                    className={`shrink-0 rounded-full px-3 py-1 text-[12px] font-semibold ${
                      u.status === "אחרונות" ? "bg-[#9A7B4F]/12 text-[#7A5F38]" : "bg-[#2B3138]/[0.06] text-[#2B3138]"
                    }`}
                  >
                    {u.status === "אחרונות" ? "יחידות אחרונות" : "זמינה"}
                  </span>
                </div>

                <dl className="mt-5 grid grid-cols-3 gap-3 border-y border-[#ECE7DF] py-4 text-[14px]">
                  <div>
                    <dt className="flex items-center gap-1 text-[#6B6760]">
                      <Ruler className="h-3.5 w-3.5" /> שטח
                    </dt>
                    <dd className="mt-1 font-semibold tabular-nums text-[#2B3138]">{u.sqm} מ״ר</dd>
                  </div>
                  <div>
                    <dt className="flex items-center gap-1 text-[#6B6760]">
                      <Sun className="h-3.5 w-3.5" /> מרפסת
                    </dt>
                    <dd className="mt-1 font-semibold tabular-nums text-[#2B3138]">{u.balcony} מ״ר</dd>
                  </div>
                  <div>
                    <dt className="flex items-center gap-1 text-[#6B6760]">
                      <BedDouble className="h-3.5 w-3.5" /> חדרים
                    </dt>
                    <dd className="mt-1 font-semibold tabular-nums text-[#2B3138]">{u.rooms}</dd>
                  </div>
                </dl>

                <p className="mt-4 flex items-center gap-2 text-[14px] text-[#6B6760]">
                  <Compass className="h-4 w-4 text-[#9A7B4F]" /> כיוון: {u.view}
                </p>

                <div className="mt-auto flex items-end justify-between gap-3 pt-6">
                  <div>
                    <p className="text-[12px] text-[#6B6760]">החל מ־</p>
                    <p className="text-2xl font-bold tabular-nums text-[#0F1B2D]">{nis(u.price)}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => onPick(u)}
                    className="inline-flex items-center gap-1 rounded-full px-3 py-2 text-[14px] font-semibold text-[#0F1B2D] transition hover:bg-[#F7F5F1] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#9A7B4F]"
                  >
                    חשבו משכנתא <ChevronLeft className="h-4 w-4 transition group-hover:-translate-x-0.5" />
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}

/* ---------- Mortgage calculator ---------- */

function useMortgage(price, equityPct, years, rate) {
  return useMemo(() => {
    const loan = Math.max(price * (1 - equityPct / 100), 0);
    const n = years * 12;
    const r = rate / 100 / 12;
    const monthly = r === 0 ? loan / n : (loan * r) / (1 - Math.pow(1 + r, -n));
    const series = [];
    for (let y = 0; y <= years; y++) {
      const k = y * 12;
      const balance = r === 0 ? loan - monthly * k : loan * Math.pow(1 + r, k) - (monthly * (Math.pow(1 + r, k) - 1)) / r;
      const b = Math.max(balance, 0);
      series.push({ year: y, balance: b, interest: monthly * k - (loan - b) });
    }
    const totalPaid = monthly * n;
    return { loan, monthly, totalPaid, totalInterest: totalPaid - loan, series };
  }, [price, equityPct, years, rate]);
}

function niceStep(max) {
  const raw = max / 4;
  const mag = Math.pow(10, Math.floor(Math.log10(raw)));
  const n = raw / mag;
  return (n <= 1 ? 1 : n <= 2 ? 2 : n <= 2.5 ? 2.5 : n <= 5 ? 5 : 10) * mag;
}

function MortgageChart({ series, years }) {
  const W = 640;
  const H = 280;
  const pad = { t: 16, r: 16, b: 34, l: 64 };
  const iw = W - pad.l - pad.r;
  const ih = H - pad.t - pad.b;
  const peak = Math.max(series[0].balance, series[series.length - 1].interest, 1);
  const step = niceStep(peak);
  const yMax = Math.ceil(peak / step) * step;
  const x = (yr) => pad.l + (yr / years) * iw;
  const y = (v) => pad.t + ih - (v / yMax) * ih;
  const [hover, setHover] = useState(null);
  const ref = useRef(null);

  const balLine = series.map((p, i) => `${i ? "L" : "M"}${x(p.year).toFixed(1)},${y(p.balance).toFixed(1)}`).join(" ");
  const balArea = `${balLine} L${x(years)},${y(0)} L${x(0)},${y(0)} Z`;
  const intLine = series.map((p, i) => `${i ? "L" : "M"}${x(p.year).toFixed(1)},${y(p.interest).toFixed(1)}`).join(" ");

  const ticksY = [];
  for (let v = 0; v <= yMax + 1; v += step) ticksY.push(v);
  const xEvery = years > 20 ? 5 : years > 10 ? 2 : 1;
  const ticksX = series.filter((p) => p.year % xEvery === 0);

  const onMove = (e) => {
    const box = ref.current.getBoundingClientRect();
    const px = ((e.clientX - box.left) / box.width) * W;
    const yr = Math.round(((px - pad.l) / iw) * years);
    setHover(Math.min(Math.max(yr, 0), years));
  };
  const hp = hover !== null ? series[hover] : null;

  return (
    <div dir="ltr" className="relative">
      <svg
        ref={ref}
        viewBox={`0 0 ${W} ${H}`}
        className="h-auto w-full touch-none select-none"
        onPointerMove={onMove}
        onPointerLeave={() => setHover(null)}
        role="img"
        aria-label="גרף יתרת הלוואה וריבית מצטברת לאורך השנים"
      >
        <defs>
          <linearGradient id="balFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#0F1B2D" stopOpacity="0.22" />
            <stop offset="1" stopColor="#0F1B2D" stopOpacity="0.02" />
          </linearGradient>
        </defs>
        {ticksY.map((v) => (
          <g key={v}>
            <line x1={pad.l} x2={W - pad.r} y1={y(v)} y2={y(v)} stroke="#DDD6CB" strokeDasharray={v ? "3 5" : "0"} />
            <text x={pad.l - 10} y={y(v) + 4} textAnchor="end" fontSize="12" fill="#6B6760" fontFamily="Assistant, sans-serif">
              {v === 0 ? "0" : `₪${(v / 1e6).toLocaleString("he-IL", { maximumFractionDigits: 2 })}M`}
            </text>
          </g>
        ))}
        {ticksX.map((p) => (
          <text key={p.year} x={x(p.year)} y={H - 10} textAnchor="middle" fontSize="12" fill="#6B6760" fontFamily="Assistant, sans-serif">
            {p.year}
          </text>
        ))}
        <path d={balArea} fill="url(#balFill)" />
        <path d={balLine} fill="none" stroke="#0F1B2D" strokeWidth="2.5" strokeLinejoin="round" />
        <path d={intLine} fill="none" stroke="#9A7B4F" strokeWidth="2.5" strokeLinejoin="round" />
        <circle cx={x(years)} cy={y(series[series.length - 1].interest)} r="4.5" fill="#9A7B4F" />
        <circle cx={x(0)} cy={y(series[0].balance)} r="4.5" fill="#0F1B2D" />
        {hp && (
          <g>
            <line x1={x(hp.year)} x2={x(hp.year)} y1={pad.t} y2={pad.t + ih} stroke="#2B3138" strokeOpacity="0.35" />
            <circle cx={x(hp.year)} cy={y(hp.balance)} r="5" fill="#FFFFFF" stroke="#0F1B2D" strokeWidth="2" />
            <circle cx={x(hp.year)} cy={y(hp.interest)} r="5" fill="#FFFFFF" stroke="#9A7B4F" strokeWidth="2" />
          </g>
        )}
      </svg>
      {hp && (
        <div
          dir="rtl"
          className="pointer-events-none absolute top-2 rounded-xl border border-[#DDD6CB] bg-white/95 px-3 py-2 text-[13px] shadow-lg"
          style={{ left: `${(x(hp.year) / W) * 100}%`, transform: hp.year > years / 2 ? "translateX(-108%)" : "translateX(8%)" }}
        >
          <p className="font-bold text-[#0F1B2D]">שנה {hp.year}</p>
          <p className="tabular-nums text-[#2B3138]">יתרה: {nis(hp.balance)}</p>
          <p className="tabular-nums text-[#7A5F38]">ריבית ששולמה: {nis(hp.interest)}</p>
        </div>
      )}
    </div>
  );
}

function MortgageCalculator({ price, setPrice }) {
  const [equity, setEquity] = useState(30);
  const [years, setYears] = useState(25);
  const [rate, setRate] = useState(4.6);
  const m = useMortgage(price, equity, years, rate);

  return (
    <section id="mortgage" className="scroll-mt-24 bg-[#ECE7DF]/60 px-4 py-20 sm:px-8 lg:py-28">
      <div className="mx-auto max-w-6xl">
        <SectionTitle
          eyebrow="מחשבון משכנתא"
          title="כמה תשלמו בכל חודש"
          text="הזיזו את הסליידרים והגרף יתעדכן מיד. החישוב לפי שיטת שפיצר, בריבית קבועה לכל התקופה."
        />

        <div className="mt-10 grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.35fr)]">
          <div className="flex flex-col gap-7 rounded-[28px] border border-[#DDD6CB] bg-white p-6 sm:p-8">
            <RangeField
              id="price"
              label="מחיר הדירה"
              value={price}
              min={3_000_000}
              max={14_000_000}
              step={50_000}
              onChange={setPrice}
              display={millions(price)}
            />
            <RangeField
              id="equity"
              label="הון עצמי"
              value={equity}
              min={25}
              max={80}
              step={1}
              onChange={setEquity}
              display={`${equity}% · ${nis((price * equity) / 100)}`}
            />
            <RangeField id="years" label="תקופה" value={years} min={5} max={30} step={1} onChange={setYears} display={`${years} שנים`} />
            <RangeField
              id="rate"
              label="ריבית שנתית"
              value={rate}
              min={2}
              max={7}
              step={0.05}
              onChange={setRate}
              display={`${rate.toFixed(2)}%`}
            />
            <p className="text-[13px] leading-relaxed text-[#6B6760]">
              לפי הנחיות בנק ישראל, מימון לדירה יחידה מוגבל ל־75% משווי הנכס, ולכן ההון העצמי מתחיל ב־25%.
            </p>
          </div>

          <div className="flex min-w-0 flex-col rounded-[28px] border border-[#DDD6CB] bg-white p-6 sm:p-8">
            <div className="flex flex-wrap items-end justify-between gap-6">
              <div>
                <p className="text-[14px] text-[#6B6760]">החזר חודשי משוער</p>
                <p className="mt-1 text-4xl font-bold tabular-nums text-[#0F1B2D] sm:text-5xl">{nis(m.monthly)}</p>
              </div>
              <dl className="grid grid-cols-3 gap-5 text-[14px]">
                <div>
                  <dt className="text-[#6B6760]">סכום ההלוואה</dt>
                  <dd className="mt-1 font-semibold tabular-nums text-[#2B3138]">{millions(m.loan)}</dd>
                </div>
                <div>
                  <dt className="text-[#6B6760]">סך ריבית</dt>
                  <dd className="mt-1 font-semibold tabular-nums text-[#7A5F38]">{millions(m.totalInterest)}</dd>
                </div>
                <div>
                  <dt className="text-[#6B6760]">סך החזר</dt>
                  <dd className="mt-1 font-semibold tabular-nums text-[#2B3138]">{millions(m.totalPaid)}</dd>
                </div>
              </dl>
            </div>

            <div className="mt-6 flex flex-wrap gap-5 text-[13px] text-[#2B3138]">
              <span className="flex items-center gap-2">
                <span className="h-2.5 w-5 rounded-full bg-[#0F1B2D]" /> יתרת הלוואה
              </span>
              <span className="flex items-center gap-2">
                <span className="h-2.5 w-5 rounded-full bg-[#9A7B4F]" /> ריבית מצטברת
              </span>
              <span className="text-[#6B6760]">ציר אופקי: שנים</span>
            </div>
            <div className="mt-3">
              <MortgageChart series={m.series} years={years} />
            </div>
            <p className="mt-4 text-[12px] text-[#6B6760]">
              הסימולציה להמחשה בלבד ואינה מהווה הצעת מימון. התנאים בפועל נקבעים על ידי הבנק המלווה.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------- 3-step match quiz ---------- */

const PURPOSES = [
  { key: "home", label: "מגורים למשפחה", hint: "דירה שתגדל איתכם" },
  { key: "upgrade", label: "שדרוג דירה", hint: "מכירה ומעבר לדירה גדולה יותר" },
  { key: "invest", label: "השקעה", hint: "תשואה והשבחה לאורך זמן" },
];
const SIZES = [
  { key: 3, label: "3 חדרים" },
  { key: 4, label: "4 חדרים" },
  { key: 5, label: "5 חדרים" },
  { key: 6, label: "פנטהאוז" },
];
const TIMING = ["מיידי", "עד חצי שנה", "תוך שנה", "רק בודקים"];

function LeadQuiz({ presetRooms }) {
  const [step, setStep] = useState(1);
  const [done, setDone] = useState(false);
  const [a, setA] = useState({ purpose: null, rooms: presetRooms ?? null, timing: null, name: "", phone: "", consent: false });
  const set = (k, v) => setA((s) => ({ ...s, [k]: v }));

  const phoneOk = /^0(5\d|[2-4]|[8-9]|7\d)\d{7}$/.test(a.phone.replace(/[\s-]/g, ""));
  const canNext = step === 1 ? !!a.purpose : step === 2 ? !!a.rooms && !!a.timing : a.name.trim().length > 1 && phoneOk && a.consent;
  const matches = UNITS.filter((u) => u.rooms === a.rooms);
  const from = matches.length ? Math.min(...matches.map((u) => u.price)) : null;

  const submit = (e) => {
    e.preventDefault();
    if (!canNext) return;
    // TODO: send `a` to your CRM / lead endpoint here.
    setDone(true);
  };

  const steps = ["מטרת הרכישה", "הדירה שלכם", "פרטי קשר"];

  return (
    <section id="quiz" className="scroll-mt-24 px-4 py-20 sm:px-8 lg:py-28">
      <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:items-start">
        <div>
          <SectionTitle
            eyebrow="שאלון התאמה"
            title="שלוש שאלות, הצעת מחיר אישית"
            text="ספרו לנו מה אתם מחפשים ויועץ המכירות יחזור אליכם עם הדירות המתאימות ומחיר מעודכן."
          />
          <ul className="mt-8 space-y-3 text-[15px] text-[#2B3138]">
            {["מחירון מעודכן לקומה ולכיוון", "תוכנית תשלומים מותאמת אישית", "תיאום סיור בדירה לדוגמה"].map((t) => (
              <li key={t} className="flex items-center gap-3">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#0F1B2D] text-white">
                  <Check className="h-3.5 w-3.5" strokeWidth={3} />
                </span>
                {t}
              </li>
            ))}
          </ul>
        </div>

        <div className="rounded-[28px] border border-[#DDD6CB] bg-white p-6 shadow-[0_30px_80px_-50px_rgba(15,27,45,0.5)] sm:p-9">
          {done ? (
            <div className="py-6 text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-l from-[#0F1B2D] to-[#3A4A5E] text-white shadow-lg">
                <Check className="h-8 w-8" strokeWidth={2.5} />
              </div>
              <h3 className="mt-6 text-2xl font-bold text-[#0F1B2D]">תודה, {a.name.trim().split(" ")[0]}</h3>
              <p className="mx-auto mt-3 max-w-sm leading-relaxed text-[#6B6760]">
                קיבלנו את הפרטים. יועץ המכירות יחזור אליכם למספר <span dir="ltr" className="font-semibold text-[#2B3138]">{a.phone}</span>.
              </p>
              {from && (
                <div className="mx-auto mt-7 max-w-sm rounded-2xl bg-[#F7F5F1] p-5 text-right">
                  <p className="text-[13px] text-[#6B6760]">התאמות ראשוניות עבורכם</p>
                  <p className="mt-1 text-lg font-bold text-[#0F1B2D]">
                    {matches.length} {a.rooms === 6 ? "פנטהאוזים" : `דירות ${a.rooms} חדרים`}, החל מ־
                    <span className="text-[#7A5F38]">{nis(from)}</span>
                  </p>
                </div>
              )}
              <button
                type="button"
                className={`${ghostClass} mt-7`}
                onClick={() => {
                  setDone(false);
                  setStep(1);
                }}
              >
                מילוי שאלון חדש
              </button>
            </div>
          ) : (
            <form onSubmit={submit} noValidate>
              <ol className="mb-8 grid grid-cols-3 gap-2" aria-label="שלבי השאלון">
                {steps.map((s, i) => {
                  const n = i + 1;
                  const state = n < step ? "done" : n === step ? "now" : "next";
                  return (
                    <li key={s}>
                      <div className={`h-1 rounded-full transition-colors duration-500 ${state === "next" ? "bg-[#ECE7DF]" : "bg-[#0F1B2D]"}`} />
                      <p className={`mt-2 text-[13px] ${state === "now" ? "font-bold text-[#0F1B2D]" : "text-[#6B6760]"}`}>
                        {n}. {s}
                      </p>
                    </li>
                  );
                })}
              </ol>

              {step === 1 && (
                <fieldset>
                  <legend className="text-xl font-bold text-[#0F1B2D]">מה מטרת הרכישה?</legend>
                  <div className="mt-5 grid gap-3">
                    {PURPOSES.map((p) => {
                      const on = a.purpose === p.key;
                      return (
                        <button
                          key={p.key}
                          type="button"
                          onClick={() => set("purpose", p.key)}
                          aria-pressed={on}
                          className={`flex items-center justify-between rounded-2xl border p-4 text-right transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#9A7B4F] ${
                            on ? "border-[#0F1B2D] bg-[#0F1B2D]/[0.04]" : "border-[#DDD6CB] hover:border-[#2B3138]/40"
                          }`}
                        >
                          <span>
                            <span className="block font-semibold text-[#2B3138]">{p.label}</span>
                            <span className="text-[14px] text-[#6B6760]">{p.hint}</span>
                          </span>
                          <span
                            className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full border ${
                              on ? "border-[#0F1B2D] bg-[#0F1B2D] text-white" : "border-[#DDD6CB]"
                            }`}
                          >
                            {on && <Check className="h-3.5 w-3.5" strokeWidth={3} />}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </fieldset>
              )}

              {step === 2 && (
                <div className="space-y-7">
                  <fieldset>
                    <legend className="text-xl font-bold text-[#0F1B2D]">איזה גודל דירה?</legend>
                    <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
                      {SIZES.map((s) => {
                        const on = a.rooms === s.key;
                        return (
                          <button
                            key={s.key}
                            type="button"
                            onClick={() => set("rooms", s.key)}
                            aria-pressed={on}
                            className={`rounded-2xl border px-3 py-4 text-[15px] transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#9A7B4F] ${
                              on ? "border-[#0F1B2D] bg-[#0F1B2D] font-semibold text-white" : "border-[#DDD6CB] text-[#2B3138] hover:border-[#2B3138]/40"
                            }`}
                          >
                            {s.label}
                          </button>
                        );
                      })}
                    </div>
                  </fieldset>
                  <fieldset>
                    <legend className="text-xl font-bold text-[#0F1B2D]">מתי תרצו להיכנס?</legend>
                    <div className="mt-4 flex flex-wrap gap-2">
                      {TIMING.map((t) => {
                        const on = a.timing === t;
                        return (
                          <button
                            key={t}
                            type="button"
                            onClick={() => set("timing", t)}
                            aria-pressed={on}
                            className={`rounded-full border px-5 py-2.5 text-[15px] transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#9A7B4F] ${
                              on ? "border-[#0F1B2D] bg-[#0F1B2D] font-semibold text-white" : "border-[#DDD6CB] text-[#2B3138] hover:border-[#2B3138]/40"
                            }`}
                          >
                            {t}
                          </button>
                        );
                      })}
                    </div>
                  </fieldset>
                </div>
              )}

              {step === 3 && (
                <fieldset className="space-y-5">
                  <legend className="mb-1 text-xl font-bold text-[#0F1B2D]">לאן לשלוח את ההצעה?</legend>
                  <div>
                    <label htmlFor="lead-name" className="mb-2 block text-[15px] font-medium text-[#2B3138]">
                      שם מלא
                    </label>
                    <input
                      id="lead-name"
                      autoComplete="name"
                      value={a.name}
                      onChange={(e) => set("name", e.target.value)}
                      className="w-full rounded-2xl border border-[#DDD6CB] bg-[#F7F5F1] px-4 py-3.5 text-[16px] text-[#2B3138] outline-none transition placeholder:text-[#A9A399] focus:border-[#0F1B2D] focus:bg-white"
                      placeholder="ישראל ישראלי"
                    />
                  </div>
                  <div>
                    <label htmlFor="lead-phone" className="mb-2 block text-[15px] font-medium text-[#2B3138]">
                      טלפון נייד
                    </label>
                    <input
                      id="lead-phone"
                      type="tel"
                      inputMode="tel"
                      autoComplete="tel"
                      dir="ltr"
                      value={a.phone}
                      onChange={(e) => set("phone", e.target.value)}
                      className="w-full rounded-2xl border border-[#DDD6CB] bg-[#F7F5F1] px-4 py-3.5 text-right text-[16px] tabular-nums text-[#2B3138] outline-none transition placeholder:text-[#A9A399] focus:border-[#0F1B2D] focus:bg-white"
                      placeholder="050-000-0000"
                    />
                    {a.phone.length > 3 && !phoneOk && (
                      <p className="mt-2 text-[13px] text-[#9B3B2E]">מספר טלפון ישראלי מתחיל ב־0 וכולל 9 או 10 ספרות.</p>
                    )}
                  </div>
                  <label htmlFor="lead-consent" className="flex cursor-pointer items-start gap-3 text-[14px] leading-relaxed text-[#6B6760]">
                    <input
                      id="lead-consent"
                      type="checkbox"
                      checked={a.consent}
                      onChange={(e) => set("consent", e.target.checked)}
                      className="mt-1 h-4 w-4 accent-[#0F1B2D]"
                    />
                    אני מאשר/ת ליצור איתי קשר בנוגע לפרויקט Aura Towers
                  </label>
                </fieldset>
              )}

              <div className="mt-9 flex items-center justify-between gap-3">
                {step > 1 ? (
                  <button type="button" onClick={() => setStep(step - 1)} className={ghostClass}>
                    <ChevronRight className="h-4 w-4" /> חזרה
                  </button>
                ) : (
                  <span />
                )}
                {step < 3 ? (
                  <button type="button" disabled={!canNext} onClick={() => setStep(step + 1)} className={ctaClass}>
                    המשך <ChevronLeft className="h-4 w-4" />
                  </button>
                ) : (
                  <button type="submit" disabled={!canNext} className={ctaClass}>
                    קבלו הצעת מחיר <ChevronLeft className="h-4 w-4" />
                  </button>
                )}
              </div>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}

/* ---------- Page ---------- */

export default function AuraTowers() {
  const [menu, setMenu] = useState(false);
  const [price, setPrice] = useState(4_850_000);
  const [pickedRooms, setPickedRooms] = useState(null);

  const pickUnit = (u) => {
    setPrice(u.price);
    setPickedRooms(u.rooms);
    document.getElementById("mortgage")?.scrollIntoView({ behavior: "smooth" });
  };

  const nav = [
    ["#units", "דירות"],
    ["#mortgage", "מחשבון משכנתא"],
    ["#amenities", "שירותי הבניין"],
    ["#quiz", "הצעת מחיר"],
  ];

  return (
    <div dir="rtl" lang="he" className="aura min-h-screen overflow-x-hidden bg-[#F7F5F1] text-[#2B3138] antialiased">
      <style>{`
        .aura, .aura button, .aura input { font-family: 'Assistant', 'Arial Hebrew', Arial, sans-serif; }
        @keyframes aura-spin { to { transform: rotate(360deg); } }
        .aura-spin { animation: aura-spin 22s linear infinite; transform-origin: 50% 50%; }
        @media (prefers-reduced-motion: reduce) { .aura-spin { animation: none; } }
        .aura-range { -webkit-appearance: none; appearance: none; height: 6px; border-radius: 999px; cursor: pointer;
          background: linear-gradient(to left, #0F1B2D 0, #3A4A5E var(--pct), #E4DED4 var(--pct)); }
        .aura-range:focus-visible { outline: 2px solid #9A7B4F; outline-offset: 6px; }
        .aura-range::-webkit-slider-thumb { -webkit-appearance: none; width: 22px; height: 22px; border-radius: 50%;
          background: #fff; border: 2px solid #0F1B2D; box-shadow: 0 4px 12px -2px rgba(15,27,45,.35); transition: transform .15s; }
        .aura-range::-webkit-slider-thumb:hover { transform: scale(1.12); }
        .aura-range::-moz-range-thumb { width: 20px; height: 20px; border-radius: 50%; background: #fff;
          border: 2px solid #0F1B2D; box-shadow: 0 4px 12px -2px rgba(15,27,45,.35); }
      `}</style>

      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-[#DDD6CB]/70 bg-[#F7F5F1]/85 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-4 sm:px-8">
          <a href="#top" className="flex items-center gap-2.5">
            <Building2 className="h-6 w-6 text-[#0F1B2D]" strokeWidth={1.5} />
            <span className="text-[17px] font-extrabold tracking-[0.22em] text-[#0F1B2D]" dir="ltr">
              AURA TOWERS
            </span>
          </a>
          <nav className="hidden items-center gap-8 text-[15px] font-medium text-[#2B3138] md:flex">
            {nav.map(([href, label]) => (
              <a key={href} href={href} className="transition hover:text-[#9A7B4F]">
                {label}
              </a>
            ))}
          </nav>
          <a href="#quiz" className={`${ctaClass} hidden !px-5 !py-2.5 md:inline-flex`}>
            תיאום פגישה
          </a>
          <button
            type="button"
            className="rounded-full p-2 text-[#0F1B2D] md:hidden"
            onClick={() => setMenu((v) => !v)}
            aria-label={menu ? "סגירת תפריט" : "פתיחת תפריט"}
            aria-expanded={menu}
          >
            {menu ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
        {menu && (
          <nav className="border-t border-[#DDD6CB] px-4 pb-5 pt-2 md:hidden">
            {nav.map(([href, label]) => (
              <a key={href} href={href} onClick={() => setMenu(false)} className="block py-3 text-[17px] font-medium text-[#2B3138]">
                {label}
              </a>
            ))}
          </nav>
        )}
      </header>

      {/* Hero */}
      <section id="top" className="px-4 pb-16 pt-12 sm:px-8 lg:pb-24 lg:pt-20">
        <div className="mx-auto grid max-w-6xl items-center gap-12 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)]">
          <div>
            <p className="flex items-center gap-2 text-[14px] font-medium text-[#6B6760]">
              <MapPin className="h-4 w-4 text-[#9A7B4F]" /> שדרות הים, הרצליה פיתוח · אכלוס 2028
            </p>
            <h1 className="mt-5 text-[44px] font-bold leading-[1.05] tracking-tight text-[#0F1B2D] [text-wrap:balance] sm:text-6xl lg:text-[76px]">
              לגור מעל הכל.
              <span className="block font-light text-[#2B3138]">
                שני מגדלים, <span className="font-bold text-[#9A7B4F]">אור אחד</span>.
              </span>
            </h1>
            <p className="mt-6 max-w-xl text-lg font-light leading-relaxed text-[#6B6760] sm:text-xl">
              148 דירות בלבד ב־34 קומות, חיפוי אבן טבעית ואלומיניום אדריכלי, נוף פתוח לים ולובי בניהול מלונאי.
            </p>
            <div className="mt-9 flex flex-wrap items-center gap-3">
              <a href="#quiz" className={ctaClass}>
                קבלו הצעת מחיר אישית <ChevronLeft className="h-4 w-4" />
              </a>
              <a href="#units" className={ghostClass}>
                צפייה בדירות זמינות
              </a>
            </div>
            <dl className="mt-12 grid max-w-lg grid-cols-3 gap-6 border-t border-[#DDD6CB] pt-7">
              {[
                ["34", "קומות"],
                ["148", "יחידות דיור"],
                ["2", "דונם גן פרטי"],
              ].map(([v, l]) => (
                <div key={l}>
                  <dt className="sr-only">{l}</dt>
                  <dd className="text-3xl font-bold tabular-nums text-[#0F1B2D] sm:text-4xl">{v}</dd>
                  <dd className="mt-1 text-[14px] text-[#6B6760]">{l}</dd>
                </div>
              ))}
            </dl>
          </div>

          <div className="relative mx-auto w-full max-w-[460px]">
            <TowersArt />
            <div className="absolute -bottom-8 -left-2 sm:-left-8">
              <TrustBadge />
            </div>
            <div className="absolute right-4 top-4 rounded-2xl border border-white/60 bg-white/80 px-4 py-3 shadow-[0_10px_30px_-15px_rgba(15,27,45,0.4)] backdrop-blur">
              <p className="text-[12px] text-[#6B6760]">פנטהאוז קומה 34</p>
              <p className="text-[15px] font-bold text-[#0F1B2D]">236 מ״ר + 95 מ״ר גג</p>
            </div>
          </div>
        </div>
      </section>

      {/* Materials strip */}
      <div className="border-y border-[#DDD6CB] bg-white/60 px-4 py-6 sm:px-8">
        <ul className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-x-8 gap-y-3 text-[14px] text-[#6B6760]">
          {[
            [Layers, "חיפוי אבן טרוורטין"],
            [Building2, "מטבחי שף בתכנון אישי"],
            [ShieldCheck, "ערבות חוק מכר בנקאית"],
            [Sun, "תקרות בגובה 3.10 מ׳"],
          ].map(([Icon, t]) => (
            <li key={t} className="flex items-center gap-2">
              <Icon className="h-4 w-4 text-[#9A7B4F]" strokeWidth={1.6} /> {t}
            </li>
          ))}
        </ul>
      </div>

      <UnitFinder onPick={pickUnit} />
      <MortgageCalculator price={price} setPrice={setPrice} />

      {/* Amenities */}
      <section id="amenities" className="scroll-mt-24 px-4 py-20 sm:px-8 lg:py-28">
        <div className="mx-auto max-w-6xl">
          <SectionTitle eyebrow="שירותי הבניין" title="רמת שירות של מלון, בבית שלכם" />
          <ul className="mt-12 grid gap-x-10 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
            {AMENITIES.map(({ icon: Icon, title, text }) => (
              <li key={title} className="flex gap-4">
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#ECE7DF] text-[#0F1B2D]">
                  <Icon className="h-5 w-5" strokeWidth={1.6} />
                </span>
                <div>
                  <h3 className="text-lg font-bold text-[#0F1B2D]">{title}</h3>
                  <p className="mt-1 font-light leading-relaxed text-[#6B6760]">{text}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <div className="border-t border-[#DDD6CB]">
        <LeadQuiz key={pickedRooms ?? "none"} presetRooms={pickedRooms} />
      </div>

      {/* Footer */}
      <footer className="bg-[#0F1B2D] px-4 py-14 text-[#C9CDD3] sm:px-8">
        <div className="mx-auto flex max-w-6xl flex-col gap-10 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-[17px] font-extrabold tracking-[0.22em] text-white" dir="ltr">
              AURA TOWERS
            </p>
            <p className="mt-3 max-w-sm font-light leading-relaxed">
              משרד מכירות: שדרות הים 12, הרצליה פיתוח. א׳–ה׳ 10:00–19:00, ו׳ 9:00–13:00.
            </p>
          </div>
          <div className="flex flex-col gap-3 md:items-end">
            <p className="flex items-center gap-2 text-white">
              <Phone className="h-4 w-4 text-[#C9A86E]" />
              <span dir="ltr" className="text-lg font-semibold tabular-nums">*5520</span>
            </p>
            <p className="text-[13px] text-[#8D96A3]">ההדמיות והנתונים להמחשה בלבד. © 2026 Aura Towers</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
