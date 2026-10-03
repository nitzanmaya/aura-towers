import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  Accessibility,
  Award,
  BedDouble,
  Building2,
  Car,
  Check,
  ChevronLeft,
  ChevronRight,
  Compass,
  Contrast,
  Cookie,
  Dumbbell,
  FileText,
  KeyRound,
  Layers,
  Link2,
  Lock,
  MapPin,
  Menu,
  Minus,
  Pause,
  Phone,
  Plus,
  RotateCcw,
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
    <div className="max-w-2xl" data-reveal>
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

/* ---------- Local storage helpers (fail quietly in private mode) ---------- */

function loadPref(key, fallback) {
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? { ...fallback, ...JSON.parse(raw) } : fallback;
  } catch {
    return fallback;
  }
}

function savePref(key, value) {
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* storage unavailable */
  }
}

/* ---------- Motion: reveals, parallax, tilt ---------- */

// Turns on scroll-linked motion unless the visitor prefers reduced motion or switched animations off.
function useMotionFX(rootRef, enabled) {
  const [on, setOn] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setOn(enabled && !mq.matches);
    update();
    mq.addEventListener?.("change", update);
    return () => mq.removeEventListener?.("change", update);
  }, [enabled]);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return undefined;
    const layers = [...root.querySelectorAll("[data-parallax], [data-drift]")];
    if (!on) {
      layers.forEach((el) => (el.style.transform = ""));
      return undefined;
    }

    const io = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("is-in");
            io.unobserve(e.target);
          }
        }),
      { rootMargin: "0px 0px -12% 0px", threshold: 0.12 }
    );
    root.querySelectorAll("[data-reveal]:not(.is-in)").forEach((el) => io.observe(el));

    let frame = 0;
    const paint = () => {
      frame = 0;
      const vh = window.innerHeight;
      const max = document.documentElement.scrollHeight - vh;
      root.style.setProperty("--sp", max > 0 ? (window.scrollY / max).toFixed(4) : "0");
      layers.forEach((el) => {
        if (!el.isConnected) return;
        const r = el.parentElement.getBoundingClientRect();
        if (r.bottom < -200 || r.top > vh + 200) return;
        const offset = r.top + r.height / 2 - vh / 2;
        if (el.dataset.drift) el.style.transform = `translate3d(${(offset * Number(el.dataset.drift)).toFixed(1)}px,0,0)`;
        else el.style.transform = `translate3d(0,${(offset * Number(el.dataset.parallax)).toFixed(1)}px,0)`;
      });
    };
    const onScroll = () => !frame && (frame = requestAnimationFrame(paint));
    paint();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);

    // Pointer tilt on the hero image (mouse and trackpad only)
    const tilt = root.querySelector("[data-tilt]");
    const fine = window.matchMedia("(pointer: fine)").matches;
    const onMove = (e) => {
      const r = tilt.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width;
      const py = (e.clientY - r.top) / r.height;
      tilt.style.transform = `rotateY(${((px - 0.5) * 7).toFixed(2)}deg) rotateX(${((0.5 - py) * 6).toFixed(2)}deg)`;
      tilt.style.setProperty("--gx", `${(px * 100).toFixed(1)}%`);
      tilt.style.setProperty("--gy", `${(py * 100).toFixed(1)}%`);
    };
    const onLeave = () => (tilt.style.transform = "");
    if (tilt && fine) {
      tilt.addEventListener("pointermove", onMove);
      tilt.addEventListener("pointerleave", onLeave);
    }

    return () => {
      io.disconnect();
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (tilt) {
        tilt.removeEventListener("pointermove", onMove);
        tilt.removeEventListener("pointerleave", onLeave);
        tilt.style.transform = "";
      }
      layers.forEach((el) => (el.style.transform = ""));
    };
  }, [on, rootRef]);

  return on;
}

// Counts up to `to` once the number scrolls into view; shows the final value without motion.
function CountUp({ to, active, duration = 1600 }) {
  const ref = useRef(null);
  const [n, setN] = useState(to);

  useEffect(() => {
    const el = ref.current;
    if (!el || !active) return undefined;
    let raf = 0;
    setN(0);
    const io = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return;
      io.disconnect();
      const start = performance.now();
      const step = (t) => {
        const k = Math.min(1, (t - start) / duration);
        setN(Math.round(to * (1 - Math.pow(1 - k, 4))));
        if (k < 1) raf = requestAnimationFrame(step);
      };
      raf = requestAnimationFrame(step);
    });
    io.observe(el);
    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
      setN(to);
    };
  }, [to, active, duration]);

  return <span ref={ref}>{n}</span>;
}

/* ---------- Rotating seal ---------- */

function TrustBadge({ size = 148 }) {
  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg
        viewBox="0 0 200 200"
        className="aura-spin h-full w-full drop-shadow-[0_12px_24px_rgba(15,27,45,0.18)]"
        aria-hidden="true"
        direction="ltr"
        shapeRendering="geometricPrecision"
        textRendering="geometricPrecision"
      >
        <defs>
          <path id="aura-badge-circle" d="M100,100 m-78,0 a78,78 0 1,1 156,0 a78,78 0 1,1 -156,0" />
        </defs>
        <circle cx="100" cy="100" r="99" fill="#FBFAF7" />
        <circle cx="100" cy="100" r="96.5" fill="none" stroke="#0F1B2D" strokeWidth="0.6" />
        <circle cx="100" cy="100" r="92.5" fill="none" stroke="#9A7B4F" strokeWidth="0.4" strokeOpacity="0.7" />
        <circle cx="100" cy="100" r="64" fill="none" stroke="#0F1B2D" strokeWidth="0.6" />
        <circle cx="100" cy="100" r="61" fill="none" stroke="#9A7B4F" strokeWidth="0.4" strokeOpacity="0.7" />
        <text fill="#0F1B2D" fontSize="10.5" fontWeight="400" fontFamily="Assistant, sans-serif">
          {/* One pass stretched to the full circumference (2π·78 ≈ 490) so the loop is seamless */}
          <textPath href="#aura-badge-circle" startOffset="0" textLength="486" lengthAdjust="spacing">
            • AURA TOWERS • ARCHITECTURAL MASTERPIECE • HERZLIYA PITUACH
          </textPath>
        </text>
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-[22px] font-light leading-none tracking-[0.12em] text-[#0F1B2D]">AT</span>
        <span className="mt-1.5 h-px w-8 bg-[#9A7B4F]" />
        <span className="mt-1.5 text-[8.5px] font-normal tracking-[0.32em] text-[#2B3138]">EST. 2026</span>
      </div>
    </div>
  );
}

/* ---------- Hero showcase: architectural photo + interactive hotspots ---------- */

// Unsplash photo by Allen Y (Unsplash License, hotlinked as Unsplash asks). Swap for the project's own renders.
const HERO_PHOTO = "https://images.unsplash.com/photo-1762758731316-419c3c283ed9?auto=format&fit=crop&w=1100&h=1375&q=80";

const HOTSPOTS = [
  { id: "ph", label: "פנטהאוז זמין", x: 62, y: 16, unit: "N-3401", note: "גג פרטי של 95 מ״ר עם ג׳קוזי ומטבח חוץ" },
  { id: "sea", label: "נוף פנורמי לים", x: 26, y: 40, unit: "N-2503", note: "חזית מערבית, שקיעה מעל הים בכל ערב" },
  { id: "park", label: "מבט לפארק", x: 60, y: 66, unit: "S-1605", note: "חלונות מקיר לקיר מול הגן הפרטי" },
];

function Hotspot({ spot, open, onToggle, onPick }) {
  const unit = UNITS.find((u) => u.id === spot.unit);
  const side = spot.x > 50 ? { right: `${100 - spot.x}%` } : { left: `${spot.x}%` };
  return (
    <>
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={open}
        aria-controls={`spot-${spot.id}`}
        className="group absolute z-10 flex -translate-x-1/2 -translate-y-1/2 items-center gap-2 focus-visible:outline-none"
        style={{ left: `${spot.x}%`, top: `${spot.y}%` }}
      >
        <span className="relative flex h-9 w-9 items-center justify-center">
          <span className="aura-ping absolute inline-flex h-full w-full rounded-full bg-white/70" />
          <span className="absolute inline-flex h-9 w-9 rounded-full border border-white/70 bg-white/20 backdrop-blur-md" />
          <span className={`relative h-3 w-3 rounded-full ring-2 ring-white transition ${open ? "bg-[#0F1B2D]" : "bg-[#B8945A]"}`} />
        </span>
        <span className="whitespace-nowrap rounded-full border border-stone-200/50 bg-white/75 px-3 py-1.5 text-[13px] font-semibold text-[#0F1B2D] shadow-[0_10px_30px_-12px_rgba(15,27,45,0.5)] backdrop-blur-md transition group-hover:bg-white group-focus-visible:ring-2 group-focus-visible:ring-[#9A7B4F]">
          {spot.label}
        </span>
      </button>
      {open && unit && (
        <div
          id={`spot-${spot.id}`}
          role="dialog"
          aria-label={spot.label}
          className="aura-pop absolute z-20 w-[min(16rem,80%)] rounded-[20px] border border-stone-200/60 bg-white/85 p-4 shadow-[0_30px_60px_-25px_rgba(15,27,45,0.65)] backdrop-blur-xl"
          style={{ top: `calc(${spot.y}% + 28px)`, ...side }}
        >
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#7A5F38]">{unit.tower}</p>
          <p className="mt-1 text-[17px] font-bold text-[#0F1B2D]">
            {unit.rooms === 6 ? "פנטהאוז" : `דירת ${unit.rooms} חדרים`} · קומה {unit.floor}
          </p>
          <p className="mt-1 text-[13px] leading-snug text-[#6B6760]">{spot.note}</p>
          <dl className="mt-3 grid grid-cols-3 gap-2 border-t border-[#ECE7DF] pt-3 text-[12px]">
            <div>
              <dt className="text-[#6B6760]">שטח</dt>
              <dd className="font-semibold tabular-nums text-[#2B3138]">{unit.sqm} מ״ר</dd>
            </div>
            <div>
              <dt className="text-[#6B6760]">מרפסת</dt>
              <dd className="font-semibold tabular-nums text-[#2B3138]">{unit.balcony} מ״ר</dd>
            </div>
            <div>
              <dt className="text-[#6B6760]">קומה</dt>
              <dd className="font-semibold tabular-nums text-[#2B3138]">{unit.floor}</dd>
            </div>
          </dl>
          <div className="mt-3 flex items-end justify-between gap-2">
            <div>
              <p className="text-[11px] text-[#6B6760]">מחיר פתיחה</p>
              <p className="text-[18px] font-bold tabular-nums text-[#0F1B2D]">{nis(unit.price)}</p>
            </div>
            <button
              type="button"
              onClick={() => onPick(unit)}
              className="inline-flex shrink-0 items-center gap-1 whitespace-nowrap rounded-full bg-[#0F1B2D] px-3 py-2 text-[12px] font-semibold text-white transition hover:bg-[#3A4A5E] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#9A7B4F]"
            >
              חישוב החזר <ChevronLeft className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      )}
    </>
  );
}

function HeroShowcase({ onPick }) {
  const [active, setActive] = useState(null);
  const [photo, setPhoto] = useState(true);
  const ref = useRef(null);

  useEffect(() => {
    if (!active) return undefined;
    const onDown = (e) => !ref.current?.contains(e.target) && setActive(null);
    const onKey = (e) => e.key === "Escape" && setActive(null);
    document.addEventListener("pointerdown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [active]);

  // Fallback facade render, shown until (or instead of) the photo
  const glass = {
    backgroundImage: [
      "linear-gradient(180deg, rgba(255,255,255,0.28) 0%, rgba(255,255,255,0) 38%)",
      "repeating-linear-gradient(90deg, rgba(24,29,35,0.92) 0 3px, transparent 3px 44px)",
      "repeating-linear-gradient(180deg, rgba(24,29,35,0.9) 0 5px, transparent 5px 30px)",
      "linear-gradient(165deg, #9DB0C0 0%, #CFC6B6 42%, #7C8894 70%, #4A5561 100%)",
    ].join(","),
  };

  return (
    <div ref={ref} data-intro style={{ "--d": 2 }} className="relative mx-auto w-full max-w-[480px] [perspective:1200px]">
      <div className="pointer-events-none absolute -bottom-8 -right-4 h-40 w-40 sm:-right-10" aria-hidden="true">
        <div data-parallax="0.1" className="h-full w-full rounded-[28px] border border-[#9A7B4F]/45" />
      </div>
      <figure data-tilt className="aura-tilt relative aspect-[4/5] w-full max-w-full overflow-hidden rounded-[32px] border border-stone-200/50 bg-[#D9D2C6] shadow-[0_40px_90px_-45px_rgba(15,27,45,0.6)]">
        <div className="absolute inset-y-0 left-[14%] right-[14%]" style={{ ...glass, clipPath: "polygon(16% 0, 84% 0, 100% 100%, 0 100%)" }} aria-hidden="true" />
        {photo && (
          <div data-parallax="-0.12" className="absolute -inset-y-[8%] inset-x-0">
          <img
            src={HERO_PHOTO}
            alt="מגדל מגורים מודרני עם מרפסות על רקע שמיים כחולים"
            className="aura-kenburns absolute inset-0 h-full w-full object-cover"
            loading="eager"
            fetchpriority="high"
            onError={() => setPhoto(false)}
          />
          </div>
        )}
        {/* Material grading: warm bronze tone, glass sheen, brass edge */}
        <div className="pointer-events-none absolute inset-0 bg-[#9A7B4F]/25 mix-blend-soft-light" aria-hidden="true" />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#1C160F]/55 via-transparent to-[#F7F5F1]/15" aria-hidden="true" />
        <div className="aura-sheen pointer-events-none absolute inset-0 mix-blend-overlay" aria-hidden="true" />
        <div className="aura-glare pointer-events-none absolute inset-0" aria-hidden="true" />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-[3px] bg-gradient-to-l from-[#7A5F38] via-[#D8BC86] to-[#7A5F38]" aria-hidden="true" />

        {HOTSPOTS.map((s) => (
          <Hotspot key={s.id} spot={s} open={active === s.id} onToggle={() => setActive((a) => (a === s.id ? null : s.id))} onPick={onPick} />
        ))}

        <figcaption className="absolute bottom-3 right-4 text-[10px] tracking-wide text-white/75">
          {photo ? "צילום: Allen Y / Unsplash · להמחשה בלבד" : "הדמיה להמחשה בלבד"}
        </figcaption>
      </figure>
      <div className="absolute left-1 -top-8 origin-top-left scale-75 sm:-left-5 sm:-top-10 sm:scale-100">
        <div data-parallax="0.18">
          <TrustBadge size={132} />
        </div>
      </div>
    </div>
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

        <div data-reveal style={{ "--d": 2 }} className="mt-10 grid gap-6 rounded-[28px] border border-[#DDD6CB] bg-white p-5 shadow-[0_20px_60px_-40px_rgba(43,49,56,0.35)] sm:p-8 lg:grid-cols-[1.1fr_1fr] lg:items-end">
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

        <div data-reveal style={{ "--d": 2 }} className="mt-10 grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.35fr)]">
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

/* ---------- Legal documents (sample wording for the demo) ---------- */

const LEGAL = {
  terms: {
    title: "תקנון ותנאי שימוש",
    sections: [
      {
        h: "כללי",
        p: [
          "אתר Aura Towers (להלן: \"האתר\") מופעל לצורך הצגת פרויקט המגורים Aura Towers. השימוש באתר כפוף לתנאים המפורטים להלן, והגלישה בו מהווה הסכמה להם.",
          "התקנון מנוסח בלשון רבים מטעמי נוחות בלבד, והוא מתייחס לכל המגדרים.",
        ],
      },
      {
        h: "מידע, הדמיות ומחירים",
        p: [
          "ההדמיות, התוכניות, המפרטים והמחירים באתר מוצגים להמחשה בלבד ואינם מהווים הצעה מחייבת. הנתונים הקובעים הם אלה שבהסכם המכר ובמפרט המכר לפי חוק המכר (דירות), התשל״ג-1973.",
          "מחשבון המשכנתא מספק הערכה בלבד ואינו מהווה ייעוץ פיננסי או הצעת מימון. תנאי ההלוואה בפועל נקבעים על ידי הגוף המממן.",
        ],
      },
      {
        h: "קניין רוחני",
        p: ["כל התכנים באתר, לרבות עיצוב, טקסטים, הדמיות וסימני מסחר, שייכים למפעילי האתר. אין להעתיק, להפיץ או לעשות בהם שימוש מסחרי ללא אישור מראש ובכתב."],
      },
      {
        h: "השארת פרטים",
        p: ["השארת פרטים בשאלון ההתאמה מהווה הסכמה ליצירת קשר בנוגע לפרויקט. ניתן לבקש בכל עת להסיר את הפרטים מרשימת הפניות, כמפורט במדיניות הפרטיות."],
      },
      {
        h: "הגבלת אחריות",
        p: ["האתר ניתן לשימוש כפי שהוא (AS IS). מפעילי האתר אינם אחראים לנזק שייגרם עקב הסתמכות על מידע באתר, תקלות טכניות או הפסקות בשירות."],
      },
      {
        h: "דין וסמכות שיפוט",
        p: ["על השימוש באתר יחולו דיני מדינת ישראל בלבד. סמכות השיפוט הבלעדית נתונה לבתי המשפט המוסמכים במחוז תל אביב-יפו."],
      },
    ],
  },
  privacy: {
    title: "מדיניות פרטיות",
    sections: [
      {
        h: "מי אנחנו",
        p: [
          "מדיניות זו מסבירה איך נאסף ומעובד מידע אישי באתר, בהתאם לחוק הגנת הפרטיות, התשמ״א-1981 ותקנותיו (כולל תיקון 13), ולתקנה האירופית להגנת מידע (GDPR) ככל שהיא חלה.",
        ],
      },
      {
        h: "איזה מידע נאסף",
        p: [
          "מידע שתמסרו בשאלון: שם, טלפון, מטרת הרכישה, גודל הדירה המבוקש ומועד כניסה רצוי.",
          "מידע טכני: סוג הדפדפן, כתובת IP ונתוני גלישה מצטברים, וזאת רק אם אישרתם עוגיות סטטיסטיקה.",
        ],
      },
      {
        h: "מטרות השימוש והבסיס החוקי",
        p: [
          "יצירת קשר והצגת הצעות מחיר, על בסיס הסכמתכם. שיפור האתר, על בסיס הסכמה לעוגיות סטטיסטיקה. עמידה בחובות חוקיות, ככל שנדרש.",
          "המידע לא יימכר לצדדים שלישיים. הוא עשוי לעבור לספקי שירות (למשל מערכת CRM או אחסון ענן) המחויבים לסודיות ולאבטחת מידע.",
        ],
      },
      {
        h: "עוגיות",
        p: ["עוגיות חיוניות נדרשות לתפקוד האתר ופועלות תמיד. עוגיות סטטיסטיקה ושיווק מופעלות רק לאחר הסכמה, וניתן לשנות את הבחירה בכל עת דרך \"הגדרות עוגיות\" בתחתית העמוד."],
      },
      {
        h: "שמירת מידע ואבטחה",
        p: ["פרטי פניות נשמרים עד 24 חודשים ממועד הפנייה האחרונה ולאחר מכן נמחקים. המידע מאובטח בהצפנה בהעברה (TLS) ובהרשאות גישה מוגבלות."],
      },
      {
        h: "הזכויות שלכם",
        p: [
          "אתם רשאים לעיין במידע עליכם, לבקש לתקן או למחוק אותו, להתנגד לעיבוד או לבטל הסכמה. GDPR מקנה גם זכות לניידות מידע ולהגשת תלונה לרשות פיקוח.",
          "פניות בנושא פרטיות: privacy@auratowers.example. נשיב תוך 30 ימים.",
        ],
      },
    ],
  },
  a11y: {
    title: "הצהרת נגישות",
    sections: [
      {
        h: "מחויבות לנגישות",
        p: ["אנו רואים חשיבות בהנגשת האתר לאנשים עם מוגבלות, בהתאם לחוק שוויון זכויות לאנשים עם מוגבלות, התשנ״ח-1998, ולתקנות שוויון זכויות לאנשים עם מוגבלות (התאמות נגישות לשירות), התשע״ג-2013."],
      },
      {
        h: "רמת הנגישות",
        p: [
          "האתר הונגש בהתאם לתקן הישראלי ת״י 5568, המבוסס על הנחיות WCAG 2.1 ברמה AA.",
          "האתר נבדק בדפדפנים Chrome, Safari, Firefox ו-Edge, במחשב ובנייד, ובשילוב קורא המסך NVDA.",
        ],
      },
      {
        h: "התאמות שבוצעו",
        p: [
          "ניווט מלא במקלדת עם סימון פוקוס ברור; מבנה כותרות היררכי; תוויות לכל שדות הטופס; טקסט חלופי לתמונות ולגרפים; ניגודיות צבעים תקנית; תמיכה בהגדלת טקסט עד 200%.",
          "תפריט הנגישות מאפשר הגדלה והקטנה של הטקסט, מצב ניגודיות גבוהה, הדגשת קישורים ועצירת אנימציות.",
        ],
      },
      {
        h: "מגבלות ידועות",
        p: ["הגרף במחשבון המשכנתא הוא רכיב חזותי. כל הנתונים שבו מוצגים גם כטקסט מעליו, כך שהמידע נגיש גם בלי הגרף."],
      },
      {
        h: "רכז/ת נגישות",
        p: [
          "נתקלתם בבעיית נגישות? נשמח לשמוע ולתקן. דוא״ל: accessibility@auratowers.example, טלפון: ‎*5520.",
          "הצהרה זו עודכנה לאחרונה באוקטובר 2026.",
        ],
      },
    ],
  },
};

function LegalDialog({ docKey, onClose }) {
  const closeRef = useRef(null);
  const doc = LEGAL[docKey];

  useEffect(() => {
    if (!doc) return undefined;
    const prev = document.activeElement;
    closeRef.current?.focus();
    const onKey = (e) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    const overflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = overflow;
      prev?.focus?.();
    };
  }, [doc, onClose]);

  if (!doc) return null;
  return (
    <div className="fixed inset-0 z-[70] flex items-end justify-center bg-[#0F1B2D]/45 p-0 backdrop-blur-sm sm:items-center sm:p-6" onClick={onClose}>
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="legal-title"
        onClick={(e) => e.stopPropagation()}
        className="flex max-h-[88vh] w-full max-w-2xl flex-col rounded-t-[28px] border border-[#DDD6CB] bg-white shadow-2xl sm:rounded-[28px]"
      >
        <div className="flex items-start justify-between gap-4 border-b border-[#ECE7DF] px-6 py-5 sm:px-8">
          <div>
            <p className="text-[12px] font-semibold uppercase tracking-[0.16em] text-[#7A5F38]">Aura Towers · מסמך משפטי</p>
            <h2 id="legal-title" className="mt-1 text-2xl font-bold text-[#0F1B2D]">
              {doc.title}
            </h2>
          </div>
          <button
            ref={closeRef}
            type="button"
            onClick={onClose}
            aria-label="סגירה"
            className="rounded-full p-2 text-[#2B3138] transition hover:bg-[#F7F5F1] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#9A7B4F]"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="overflow-y-auto px-6 py-6 sm:px-8">
          <p className="mb-6 rounded-xl bg-[#F7F5F1] px-4 py-3 text-[13px] text-[#6B6760]">
            נוסח לדוגמה, שנכתב לצורך הדגמת הפרויקט ואינו מהווה ייעוץ משפטי.
          </p>
          <div className="space-y-6">
            {doc.sections.map((s, i) => (
              <section key={s.h}>
                <h3 className="text-[17px] font-bold text-[#0F1B2D]">
                  {i + 1}. {s.h}
                </h3>
                {s.p.map((t) => (
                  <p key={t} className="mt-2 max-w-[65ch] leading-relaxed text-[#2B3138]">
                    {t}
                  </p>
                ))}
              </section>
            ))}
          </div>
        </div>
        <div className="border-t border-[#ECE7DF] px-6 py-4 sm:px-8">
          <button type="button" onClick={onClose} className={`${ctaClass} w-full sm:w-auto`}>
            הבנתי, סגירה
          </button>
        </div>
      </div>
    </div>
  );
}

/* ---------- Accessibility widget ---------- */

const A11Y_DEFAULT = { scale: 1, contrast: false, links: false, still: false };

function Switch({ id, label, icon: Icon, checked, onChange }) {
  return (
    <button
      id={id}
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className={`flex w-full items-center justify-between gap-3 rounded-2xl border px-4 py-3 text-[15px] font-medium transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#9A7B4F] ${
        checked ? "border-[#0F1B2D] bg-[#0F1B2D]/[0.05] text-[#0F1B2D]" : "border-[#DDD6CB] text-[#2B3138] hover:border-[#2B3138]/40"
      }`}
    >
      <span className="flex items-center gap-2.5">
        <Icon className="h-4 w-4" /> {label}
      </span>
      <span className={`relative h-6 w-11 shrink-0 rounded-full transition ${checked ? "bg-[#0F1B2D]" : "bg-[#DDD6CB]"}`}>
        <span className={`absolute top-1 h-4 w-4 rounded-full bg-white shadow transition-all ${checked ? "right-6" : "right-1"}`} />
      </span>
    </button>
  );
}

function A11yWidget({ prefs, setPrefs, onStatement }) {
  const [open, setOpen] = useState(false);
  const panelRef = useRef(null);
  const set = (k, v) => setPrefs((p) => ({ ...p, [k]: v }));
  const step = (d) => set("scale", Math.min(1.4, Math.max(0.9, Math.round((prefs.scale + d) * 100) / 100)));

  useEffect(() => {
    if (!open) return undefined;
    const onKey = (e) => e.key === "Escape" && setOpen(false);
    document.addEventListener("keydown", onKey);
    panelRef.current?.querySelector("button")?.focus();
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <div className="fixed bottom-4 left-4 z-[60]" dir="rtl">
      {open && (
        <div
          ref={panelRef}
          id="a11y-panel"
          role="dialog"
          aria-label="תפריט נגישות"
          className="absolute bottom-16 left-0 w-[min(20rem,calc(100vw-2rem))] rounded-[24px] border border-[#DDD6CB] bg-white p-5 shadow-[0_30px_70px_-30px_rgba(15,27,45,0.55)]"
        >
          <div className="flex items-center justify-between">
            <p className="text-lg font-bold text-[#0F1B2D]">נגישות</p>
            <button type="button" onClick={() => setOpen(false)} aria-label="סגירת תפריט הנגישות" className="rounded-full p-1.5 text-[#2B3138] hover:bg-[#F7F5F1]">
              <X className="h-4 w-4" />
            </button>
          </div>

          <div className="mt-4 rounded-2xl border border-[#DDD6CB] px-4 py-3">
            <p className="text-[15px] font-medium text-[#2B3138]">גודל טקסט</p>
            <div className="mt-2 flex items-center justify-between gap-3">
              <button type="button" onClick={() => step(-0.1)} disabled={prefs.scale <= 0.9} aria-label="הקטנת טקסט" className="flex h-10 w-10 items-center justify-center rounded-full border border-[#DDD6CB] text-[#0F1B2D] transition hover:bg-[#F7F5F1] disabled:opacity-40">
                <Minus className="h-4 w-4" />
              </button>
              <span className="text-lg font-bold tabular-nums text-[#0F1B2D]" aria-live="polite">
                {Math.round(prefs.scale * 100)}%
              </span>
              <button type="button" onClick={() => step(0.1)} disabled={prefs.scale >= 1.4} aria-label="הגדלת טקסט" className="flex h-10 w-10 items-center justify-center rounded-full border border-[#DDD6CB] text-[#0F1B2D] transition hover:bg-[#F7F5F1] disabled:opacity-40">
                <Plus className="h-4 w-4" />
              </button>
            </div>
          </div>

          <div className="mt-3 space-y-2">
            <Switch id="a11y-contrast" label="ניגודיות גבוהה" icon={Contrast} checked={prefs.contrast} onChange={(v) => set("contrast", v)} />
            <Switch id="a11y-links" label="הדגשת קישורים" icon={Link2} checked={prefs.links} onChange={(v) => set("links", v)} />
            <Switch id="a11y-still" label="עצירת אנימציות" icon={Pause} checked={prefs.still} onChange={(v) => set("still", v)} />
          </div>

          <div className="mt-4 flex items-center justify-between gap-3 text-[14px]">
            <button type="button" onClick={() => setPrefs(A11Y_DEFAULT)} className="inline-flex items-center gap-1.5 font-semibold text-[#2B3138] hover:text-[#0F1B2D]">
              <RotateCcw className="h-4 w-4" /> איפוס
            </button>
            <button type="button" data-link onClick={() => { setOpen(false); onStatement(); }} className="font-semibold text-[#0F1B2D] underline underline-offset-4">
              הצהרת נגישות
            </button>
          </div>
        </div>
      )}
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-controls="a11y-panel"
        aria-label={open ? "סגירת תפריט הנגישות" : "פתיחת תפריט הנגישות"}
        className="flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-l from-[#0F1B2D] to-[#3A4A5E] text-white shadow-[0_12px_30px_-8px_rgba(15,27,45,0.6)] transition hover:scale-105 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#9A7B4F]"
      >
        <Accessibility className="h-7 w-7" strokeWidth={1.8} />
      </button>
    </div>
  );
}

/* ---------- Cookie consent ---------- */

const COOKIE_KEY = "aura-cookie-consent";
const COOKIE_TYPES = [
  { key: "necessary", label: "עוגיות חיוניות", hint: "נדרשות לתפקוד האתר ולשמירת ההעדפות שלכם", locked: true },
  { key: "analytics", label: "סטטיסטיקה", hint: "עוזרות לנו להבין איך משתמשים באתר" },
  { key: "marketing", label: "שיווק", hint: "התאמת פרסומות ומדידת קמפיינים" },
];

function CookieBanner({ open, settingsFirst, onDone, onPrivacy }) {
  const [settings, setSettings] = useState(settingsFirst);
  const [choice, setChoice] = useState(() => loadPref(COOKIE_KEY, { necessary: true, analytics: false, marketing: false }));

  useEffect(() => setSettings(settingsFirst), [settingsFirst, open]);
  if (!open) return null;

  const save = (value) => {
    const record = { ...value, necessary: true, savedAt: new Date().toISOString() };
    savePref(COOKIE_KEY, record);
    onDone(record);
  };

  return (
    <div className="fixed bottom-20 left-4 right-4 z-[55] sm:bottom-4 sm:left-24 md:right-auto md:max-w-[480px]" dir="rtl" role="region" aria-label="הסכמה לשימוש בעוגיות">
      <div className="rounded-[24px] border border-stone-200/60 bg-white/90 p-5 shadow-[0_30px_70px_-30px_rgba(15,27,45,0.55)] backdrop-blur-md">
        <div className="flex items-start gap-3">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#ECE7DF] text-[#7A5F38]">
            <Cookie className="h-5 w-5" />
          </span>
          <div className="min-w-0 flex-1">
            <p className="font-bold text-[#0F1B2D]">אנו משתמשים בעוגיות כדי להבטיח את החוויה הטובה ביותר באתר</p>
            <p className="mt-1 text-[13px] leading-relaxed text-[#6B6760]">
              אפשר לאשר את כולן או לבחור אילו להפעיל.{" "}
              <button type="button" data-link onClick={onPrivacy} className="font-semibold text-[#0F1B2D] underline underline-offset-2">
                מדיניות פרטיות
              </button>
            </p>
          </div>
          <button
            type="button"
            onClick={() => save({ analytics: false, marketing: false })}
            aria-label="סגירה (עוגיות חיוניות בלבד)"
            className="rounded-full p-1.5 text-[#6B6760] hover:bg-[#F7F5F1]"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {settings && (
          <ul className="mt-4 space-y-2">
            {COOKIE_TYPES.map((t) => (
              <li key={t.key} className="flex items-center justify-between gap-3 rounded-2xl border border-[#ECE7DF] px-4 py-3">
                <div className="min-w-0">
                  <p className="flex items-center gap-1.5 text-[14px] font-semibold text-[#2B3138]">
                    {t.label} {t.locked && <Lock className="h-3.5 w-3.5 text-[#6B6760]" />}
                  </p>
                  <p className="text-[12px] text-[#6B6760]">{t.hint}</p>
                </div>
                <input
                  id={`cookie-${t.key}`}
                  type="checkbox"
                  aria-label={t.label}
                  checked={t.locked ? true : !!choice[t.key]}
                  disabled={t.locked}
                  onChange={(e) => setChoice((c) => ({ ...c, [t.key]: e.target.checked }))}
                  className="h-5 w-5 shrink-0 accent-[#0F1B2D]"
                />
              </li>
            ))}
          </ul>
        )}

        <div className="mt-4 flex flex-wrap items-center gap-2">
          <button type="button" onClick={() => save({ analytics: true, marketing: true })} className={`${ctaClass} !px-6 !py-3`}>
            אישור והסכמה
          </button>
          {settings ? (
            <button type="button" onClick={() => save(choice)} className={`${ghostClass} !py-3`}>
              שמירת ההעדפות
            </button>
          ) : (
            <button type="button" onClick={() => setSettings(true)} className={`${ghostClass} !py-3`}>
              הגדרות
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

/* ---------- Page ---------- */

export default function AuraTowers() {
  const [menu, setMenu] = useState(false);
  const [price, setPrice] = useState(4_850_000);
  const [pickedRooms, setPickedRooms] = useState(null);
  const [legal, setLegal] = useState(null);
  const [a11y, setA11y] = useState(A11Y_DEFAULT);
  const [cookie, setCookie] = useState({ open: false, settings: false });
  const rootRef = useRef(null);

  useEffect(() => {
    setA11y(loadPref("aura-a11y", A11Y_DEFAULT));
    const saved = loadPref(COOKIE_KEY, null);
    if (!saved || !saved.savedAt) setCookie({ open: true, settings: false });
  }, []);
  useEffect(() => savePref("aura-a11y", a11y), [a11y]);
  const motion = useMotionFX(rootRef, !a11y.still);

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
    <div
      dir="rtl"
      lang="he"
      ref={rootRef}
      className={`aura ${motion ? "motion" : ""} min-h-screen overflow-x-hidden bg-[#F7F5F1] text-[#2B3138] antialiased ${a11y.contrast ? "hc" : ""} ${a11y.links ? "hl" : ""} ${a11y.still ? "still" : ""}`}
    >
      <style>{`
        .aura, .aura button, .aura input { font-family: 'Assistant', 'Arial Hebrew', Arial, sans-serif; }
        @keyframes aura-spin { to { transform: rotate(360deg); } }
        .aura-spin { animation: aura-spin 48s linear infinite; transform-origin: 50% 50%; }
        @media (prefers-reduced-motion: reduce) { .aura-spin { animation: none; } }
        .aura-range { -webkit-appearance: none; appearance: none; height: 6px; border-radius: 999px; cursor: pointer;
          background: linear-gradient(to left, #0F1B2D 0, #3A4A5E var(--pct), #E4DED4 var(--pct)); }
        .aura-range:focus-visible { outline: 2px solid #9A7B4F; outline-offset: 6px; }
        .aura-range::-webkit-slider-thumb { -webkit-appearance: none; width: 22px; height: 22px; border-radius: 50%;
          background: #fff; border: 2px solid #0F1B2D; box-shadow: 0 4px 12px -2px rgba(15,27,45,.35); transition: transform .15s; }
        .aura-range::-webkit-slider-thumb:hover { transform: scale(1.12); }
        .aura-range::-moz-range-thumb { width: 20px; height: 20px; border-radius: 50%; background: #fff;
          border: 2px solid #0F1B2D; box-shadow: 0 4px 12px -2px rgba(15,27,45,.35); }
        @keyframes aura-ping { 75%, 100% { transform: scale(2.2); opacity: 0; } }
        .aura-ping { animation: aura-ping 2.2s cubic-bezier(0, 0, 0.2, 1) infinite; }
        .aura-scroll { scrollbar-width: none; }
        .aura-scroll::-webkit-scrollbar { display: none; }
        @keyframes aura-pop { from { opacity: 0; transform: translateY(6px) scale(.97); } to { opacity: 1; transform: none; } }
        .aura-pop { animation: aura-pop .22s ease-out; }
        @keyframes aura-kenburns { from { transform: scale(1.04); } to { transform: scale(1.12) translateY(-1.5%); } }
        .aura-kenburns { animation: aura-kenburns 24s ease-in-out infinite alternate; }
        @keyframes aura-sheen-move { 0%, 55% { background-position: 160% 0; } 100% { background-position: -60% 0; } }
        .aura-sheen { background: linear-gradient(115deg, transparent 35%, rgba(255,240,215,.55) 50%, transparent 65%) no-repeat;
          background-size: 220% 100%; animation: aura-sheen-move 9s ease-in-out infinite; }
        .aura-cta { position: relative; isolation: isolate; }
        .aura-cta::before { content: ""; position: absolute; inset: 0; border-radius: inherit; background: #0F1B2D; z-index: -1;
          animation: aura-halo 2.8s ease-out infinite; }
        @keyframes aura-halo { 0% { transform: scale(1); opacity: .35; } 70%, 100% { transform: scale(1.12, 1.4); opacity: 0; } }
        .aura-shine { position: relative; overflow: hidden; }
        .aura-shine::after { content: ""; position: absolute; inset: 0; transform: translateX(-130%);
          background: linear-gradient(110deg, transparent 30%, rgba(255,255,255,.3) 50%, transparent 70%); animation: aura-shine 5s ease-in-out infinite; }
        @keyframes aura-shine { 0%, 65% { transform: translateX(-130%); } 100% { transform: translateX(130%); } }
        @media (prefers-reduced-motion: reduce) { .aura-ping, .aura-kenburns, .aura-sheen, .aura-cta::before, .aura-shine::after, .aura-pop { animation: none; } }
        .aura.hc .aura-gold { background: none; color: #000; }

        /* Motion: scroll reveals, headline rise, parallax, tilt (only when .motion is on) */
        .aura-line { display: block; overflow: hidden; padding-bottom: .08em; }
        .aura-line > span { display: inline-block; }
        .aura.motion .aura-line > span { animation: aura-rise 1.1s cubic-bezier(.16,1,.3,1) both; animation-delay: calc(var(--d, 0) * 140ms + 100ms); }
        @keyframes aura-rise { from { transform: translateY(105%); opacity: 0; } to { transform: none; opacity: 1; } }
        .aura.motion [data-intro] { animation: aura-fade-up 1s cubic-bezier(.16,1,.3,1) both; animation-delay: calc(var(--d, 0) * 120ms + 150ms); }
        @keyframes aura-fade-up { from { opacity: 0; transform: translateY(24px); } to { opacity: 1; transform: none; } }
        .aura.motion [data-reveal] { opacity: 0; transform: translateY(36px); filter: blur(4px);
          transition: opacity .9s cubic-bezier(.16,1,.3,1), transform .9s cubic-bezier(.16,1,.3,1), filter .9s ease;
          transition-delay: calc(var(--d, 0) * 110ms); }
        .aura.motion [data-reveal].is-in { opacity: 1; transform: none; filter: none; }
        .aura-gold { background: linear-gradient(100deg, #7A5F38 0%, #B8945A 35%, #E6CF9F 50%, #B8945A 65%, #7A5F38 100%);
          background-size: 250% 100%; -webkit-background-clip: text; background-clip: text; color: transparent; }
        .aura.motion .aura-gold { animation: aura-gold 7s ease-in-out infinite; }
        @keyframes aura-gold { 0%, 100% { background-position: 100% 0; } 50% { background-position: 0 0; } }
        .aura-outline { color: transparent; -webkit-text-stroke: 1px rgba(15,27,45,.28); }
        .aura-tilt { transform-style: preserve-3d; transition: transform .6s cubic-bezier(.16,1,.3,1); will-change: transform; }
        .aura-glare { opacity: 0; transition: opacity .4s; background: radial-gradient(circle at var(--gx, 50%) var(--gy, 30%), rgba(255,246,228,.35), transparent 45%); }
        .aura.motion .aura-tilt:hover .aura-glare { opacity: 1; }
        .aura-progress { transform: scaleX(var(--sp, 0)); }
        .aura:not(.motion) .aura-progress { display: none; }
        [data-parallax], [data-drift] { will-change: transform; }

        /* Accessibility modes */
        .aura.still *, .aura.still *::before, .aura.still *::after { animation: none !important; transition: none !important; scroll-behavior: auto !important; }
        .aura.hl a, .aura.hl [data-link] { text-decoration: underline !important; text-decoration-thickness: 2px !important;
          text-underline-offset: 4px; outline: 2px dashed #9A7B4F; outline-offset: 3px; }
        .aura.hc, .aura.hc [class*="bg-[#F7F5F1]"], .aura.hc [class*="bg-[#ECE7DF]"], .aura.hc [class*="bg-white"] { background-color: #fff !important; }
        .aura.hc [class*="text-[#6B6760]"], .aura.hc [class*="text-[#2B3138]"], .aura.hc [class*="text-[#0F1B2D]"],
        .aura.hc [class*="text-[#7A5F38]"], .aura.hc [class*="text-[#9A7B4F]"] { color: #000 !important; }
        .aura.hc [class*="border-[#DDD6CB]"], .aura.hc [class*="border-[#ECE7DF]"], .aura.hc [class*="border-stone-200"] { border-color: #000 !important; }
        .aura.hc footer, .aura.hc footer * { background-color: #000 !important; color: #fff !important; }
        .aura.hc :focus-visible { outline: 3px solid #000 !important; outline-offset: 3px; }
      `}</style>

      <div style={{ zoom: a11y.scale }}>

      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-[#DDD6CB]/70 bg-[#F7F5F1]/85 backdrop-blur-md">
        <span aria-hidden="true" className="aura-progress absolute inset-x-0 bottom-[-1px] h-[2px] origin-right bg-gradient-to-l from-[#7A5F38] via-[#D8BC86] to-[#0F1B2D]" />
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
          <a href="#quiz" className={`${ctaClass} aura-shine hidden !bg-none !bg-[#0F1B2D] !px-5 !py-2.5 ring-1 ring-[#9A7B4F]/40 md:inline-flex`}>
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
              <span className="aura-line"><span style={{ "--d": 0 }}>לגור מעל הכל.</span></span>
              <span className="aura-line font-light text-[#2B3138]">
                <span style={{ "--d": 1 }}>
                  שני מגדלים, <span className="aura-gold font-bold">אור אחד</span>.
                </span>
              </span>
            </h1>
            <p data-intro style={{ "--d": 3 }} className="mt-6 max-w-xl text-lg font-light leading-relaxed text-[#6B6760] sm:text-xl">
              148 דירות בלבד ב־34 קומות, חיפוי אבן טבעית ואלומיניום אדריכלי, נוף פתוח לים ולובי בניהול מלונאי.
            </p>
            <div data-intro style={{ "--d": 4 }} className="mt-9 flex flex-wrap items-center gap-3">
              <a href="#quiz" className={`${ctaClass} aura-cta`}>
                קבלו הצעת מחיר אישית <ChevronLeft className="h-4 w-4" />
              </a>
              <a href="#units" className={ghostClass}>
                צפייה בדירות זמינות
              </a>
            </div>
            <dl data-intro style={{ "--d": 5 }} className="mt-12 grid max-w-lg grid-cols-3 gap-6 border-t border-[#DDD6CB] pt-7">
              {[
                ["34", "קומות"],
                ["148", "יחידות דיור"],
                ["2", "דונם גן פרטי"],
              ].map(([v, l]) => (
                <div key={l}>
                  <dt className="sr-only">{l}</dt>
                  <dd className="text-3xl font-bold tabular-nums text-[#0F1B2D] sm:text-4xl">
                    <CountUp to={Number(v)} active={motion} />
                  </dd>
                  <dd className="mt-1 text-[14px] text-[#6B6760]">{l}</dd>
                </div>
              ))}
            </dl>
          </div>

          <HeroShowcase onPick={pickUnit} />
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

      {/* Architectural word band, slides sideways with scroll */}
      <div aria-hidden="true" className="pointer-events-none select-none overflow-hidden border-t border-[#DDD6CB] py-10 sm:py-14">
        <p data-drift="0.35" dir="ltr" className="aura-outline whitespace-nowrap text-[64px] font-extrabold leading-none tracking-[0.08em] sm:text-[120px]">
          AURA TOWERS · HERZLIYA PITUACH · AURA TOWERS · HERZLIYA PITUACH
        </p>
        <p data-drift="-0.25" dir="ltr" className="mt-2 whitespace-nowrap text-[28px] font-light leading-none tracking-[0.4em] text-[#9A7B4F]/70 sm:text-[44px]">
          STONE · GLASS · BRASS · LIGHT · STONE · GLASS · BRASS · LIGHT · STONE · GLASS · BRASS
        </p>
      </div>

      {/* Amenities */}
      <section id="amenities" className="scroll-mt-24 px-4 py-20 sm:px-8 lg:py-28">
        <div className="mx-auto max-w-6xl">
          <SectionTitle eyebrow="שירותי הבניין" title="רמת שירות של מלון, בבית שלכם" />
          <ul className="mt-12 grid gap-x-10 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
            {AMENITIES.map(({ icon: Icon, title, text }, i) => (
              <li key={title} data-reveal style={{ "--d": i % 3 }} className="flex gap-4">
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
      <footer className="bg-[#0F1B2D] px-4 pb-24 pt-14 text-[#C9CDD3] sm:px-8">
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
          </div>
        </div>
        <div className="mx-auto mt-10 flex max-w-6xl flex-col gap-4 border-t border-white/10 pt-6 text-[14px] md:flex-row md:items-center md:justify-between">
          <nav aria-label="מסמכים משפטיים" className="flex flex-wrap gap-x-6 gap-y-2">
            {[
              ["terms", "תקנון ותנאי שימוש"],
              ["privacy", "מדיניות פרטיות"],
              ["a11y", "הצהרת נגישות"],
            ].map(([key, label]) => (
              <button
                key={key}
                type="button"
                data-link
                onClick={() => setLegal(key)}
                className="inline-flex items-center gap-1.5 text-[#C9CDD3] transition hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#C9A86E]"
              >
                <FileText className="h-3.5 w-3.5 text-[#C9A86E]" /> {label}
              </button>
            ))}
            <button
              type="button"
              data-link
              onClick={() => setCookie({ open: true, settings: true })}
              className="inline-flex items-center gap-1.5 text-[#C9CDD3] transition hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#C9A86E]"
            >
              <Cookie className="h-3.5 w-3.5 text-[#C9A86E]" /> הגדרות עוגיות
            </button>
          </nav>
          <p className="text-[13px] text-[#8D96A3]">ההדמיות והנתונים להמחשה בלבד. © 2026 Aura Towers</p>
        </div>
      </footer>
      </div>

      <A11yWidget prefs={a11y} setPrefs={setA11y} onStatement={() => setLegal("a11y")} />
      <CookieBanner
        open={cookie.open}
        settingsFirst={cookie.settings}
        onDone={() => setCookie({ open: false, settings: false })}
        onPrivacy={() => setLegal("privacy")}
      />
      <LegalDialog docKey={legal} onClose={() => setLegal(null)} />
    </div>
  );
}
