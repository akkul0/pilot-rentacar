import { useMemo, useState } from "react";

import {
  CLAIMS,
  FAQS,
  FLEET_CARS,
  carLabel,
  formatPrice,
  PILOT_MAP,
  PILOT_PHONE_DISPLAY,
  PILOT_PHONE_TEL,
  PILOT_WHATSAPP,
  ROUTES,
} from "./pilot-content";
import { PilotMark } from "./pilot-mark";
import {
  ClaimIcon,
  CtaCall,
  CtaPill,
  CtaRent,
  CtaWhatsApp,
  IconPlus,
  Rise,
} from "./pilot-ui";

const PICKUPS = [
  "Antalya Havalimanı",
  "Belek",
  "Lara / Kundu",
  "Side",
  "Kemer",
  "Antalya şehir merkezi",
];

/* ── Nav ─────────────────────────────────────────────────────────── */

export function SiteNav() {
  return (
    <header className="pilot-nav">
      <a href="#ust">
        <PilotMark height={26} />
      </a>
      <nav className="pilot-nav__links">
        <a className="pilot-nav__link" href="#filo">
          Filo
        </a>
        <a className="pilot-nav__link" href="#neden">
          Neden Pilot
        </a>
        <a className="pilot-nav__link" href="#rotalar">
          Rotalar
        </a>
        <a className="pilot-nav__link" href="#sss">
          Sık sorulanlar
        </a>
        <a className="pilot-nav__link" href="#iletisim">
          İletişim
        </a>
      </nav>
      <div className="pilot-nav__tail">
        <CtaPill href="#rezervasyon">Rezervasyon</CtaPill>
      </div>
    </header>
  );
}

/* ── Booking bar — the instrument panel ──────────────────────────── */

export function BookingBar() {
  const [pickup, setPickup] = useState(PICKUPS[0]);
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");
  const [carId, setCarId] = useState(FLEET_CARS[0].id);
  const car = FLEET_CARS.find((item) => item.id === carId) ?? FLEET_CARS[0];
  const [error, setError] = useState("");

  const nights = useMemo(() => {
    if (!start || !end) return 0;
    const ms = new Date(end).getTime() - new Date(start).getTime();
    return ms > 0 ? Math.round(ms / 86400000) : 0;
  }, [start, end]);

  const message = useMemo(() => {
    const lines = [
      "Merhaba, Pilot Rent a Car için fiyat almak istiyorum.",
      `Alış yeri: ${pickup}`,
      start ? `Alış tarihi: ${start}` : null,
      end ? `İade tarihi: ${end}` : null,
      nights ? `Süre: ${nights} gün` : null,
      `Araç: ${carLabel(car)}`,
      `Günlük fiyat: ${formatPrice(car.dailyPrice)}`,
      nights ? `Tahmini toplam: ${formatPrice(nights * car.dailyPrice)}` : null,
    ].filter(Boolean);
    return lines.join("\n");
  }, [pickup, start, end, nights, car]);

  function submit() {
    if (!start || !end || nights <= 0) {
      setError("Alış ve iade tarihlerini seçin. İade tarihi alış tarihinden sonra olmalıdır.");
      return;
    }
    setError("");
    const url = `${PILOT_WHATSAPP}&text=${encodeURIComponent(message)}`;
    window.open(url, "_blank", "noopener,noreferrer");
  }

  return (
    <section className="pilot-booking" id="rezervasyon">
      <div className="pilot-shell">
        <Rise>
          <div className="pilot-booking__grid">
            <label className="pilot-field">
              <span className="pilot-field__label">Alış yeri</span>
              <select
                className="pilot-field__control"
                onChange={(e) => setPickup(e.target.value)}
                value={pickup}
              >
                {PICKUPS.map((p) => (
                  <option key={p} value={p}>
                    {p}
                  </option>
                ))}
              </select>
            </label>

            <label className="pilot-field">
              <span className="pilot-field__label">Alış tarihi</span>
              <input
                className="pilot-field__control"
                onChange={(e) => { setStart(e.target.value); setError(""); }}
                onInput={(e) => { setStart(e.currentTarget.value); setError(""); }}
                type="date"
                value={start}
              />
            </label>

            <label className="pilot-field">
              <span className="pilot-field__label">İade tarihi</span>
              <input
                className="pilot-field__control"
                min={start || undefined}
                onChange={(e) => { setEnd(e.target.value); setError(""); }}
                onInput={(e) => { setEnd(e.currentTarget.value); setError(""); }}
                type="date"
                value={end}
              />
            </label>

            <label className="pilot-field">
              <span className="pilot-field__label">Araç</span>
              <select
                className="pilot-field__control"
                onChange={(e) => setCarId(e.target.value)}
                value={carId}
              >
                {FLEET_CARS.map((c) => (
                  <option key={c.id} value={c.id}>
                    {carLabel(c)} · {formatPrice(c.dailyPrice)} / gün
                  </option>
                ))}
              </select>
            </label>

            <div className="pilot-booking__submit">
              <button className="pilot-cta-quote" onClick={submit} type="button">
                Fiyat al
              </button>
            </div>
          </div>
        </Rise>

        {error && <p className="pilot-booking__error" role="alert">{error}</p>}
        <p className="pilot-booking__note">
          Ön ödeme yok. Fiyat ve uygunluk WhatsApp üzerinden yazılı olarak dönülür.
        </p>

        <div className="pilot-booking__out">
          <p>
            {nights > 0 ? (
              <>
                <strong>{pickup}</strong> · <strong>{nights} gün</strong> ·{" "}
                <strong>{carLabel(car)}</strong>.<br />
                Günlük {formatPrice(car.dailyPrice)} · Tahmini toplam: <strong>{formatPrice(nights * car.dailyPrice)}</strong>.
                Kesin fiyat ve uygunluk rezervasyon sırasında onaylanır.
              </>
            ) : (
              <>
                Tarihleri seçtiğinizde süre burada hesaplanır ve talep özeti{" "}
                <strong>WhatsApp</strong>'a hazır gider.
              </>
            )}
          </p>
        </div>
      </div>
    </section>
  );
}

/* ── Fleet ───────────────────────────────────────────────────────── */

export function Fleet() {
  return (
    <section className="pilot-section" id="filo">
      <div className="pilot-shell">
        <div className="pilot-section__head pilot-section__head--split">
          <div>
            <p className="pilot-eyebrow">Filo</p>
            <h2 className="pilot-h2">Kiralık araçlarımız</h2>
          </div>
          <p className="pilot-lede">
            Günlük kiralama ücretleri aşağıdadır. Tarihlerinize uygun araç için bize ulaşın.
          </p>
        </div>
        <p className="pilot-fleet__note">Görseller temsilidir; araçların renk ve donanımları farklı olabilir.</p>
        <div className="pilot-fleet">
          {FLEET_CARS.map((car) => (
            <article className="pilot-vehicle" key={car.id}>
              <figure className="pilot-vehicle__photo">
                <img
                  src={`/assets/fleet/cars/${car.id.split("-")[0]}.png`}
                  alt={`${car.name}, marka logosuyla koyu stüdyo ortamında`}
                  width={1536}
                  height={1024}
                  loading="lazy"
                  decoding="async"
                />
              </figure>
              <div className="pilot-vehicle__heading">
                <span className="pilot-vehicle__year">{car.year} model</span>
                <h3 className="pilot-class__name">{car.name}</h3>
                <p className="pilot-vehicle__fuel">{car.fuel}</p>
              </div>
              <p className="pilot-vehicle__price">{formatPrice(car.dailyPrice)} <span>/ gün</span></p>
              <CtaRent href={`${PILOT_WHATSAPP}&text=${encodeURIComponent(
                `Merhaba, ${carLabel(car)} için müsaitlik sormak istiyorum. Günlük fiyat: ${formatPrice(car.dailyPrice)}.`,
              )}`}>
                Müsaitlik sor
              </CtaRent>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ── Why ─────────────────────────────────────────────────────────── */

export function Why() {
  return (
    <section className="pilot-section pilot-section--well" id="neden">
      <div className="pilot-shell">
        <div className="pilot-why">
          <Rise className="pilot-why__figure">
            <img
              alt="Gece yolda ilerleyen aracın direksiyon ve gösterge paneli"
              height={1200}
              loading="lazy"
              src="/assets/place/kabin.webp"
              width={1800}
            />
          </Rise>

          <div>
            <p className="pilot-eyebrow">Neden Pilot</p>
            <h2 className="pilot-h2">Kiralama ve teslimat hizmetleri</h2>
            <div className="pilot-claims" style={{ marginTop: "2rem" }}>
              {CLAIMS.map((c, i) => (
                <Rise delay={i * 80} key={c.title}>
                  <div className="pilot-claim">
                    <span className="pilot-claim__icon">
                      <ClaimIcon name={c.icon} />
                    </span>
                    <div>
                      <h3 className="pilot-claim__title">{c.title}</h3>
                      <p className="pilot-claim__body">{c.body}</p>
                    </div>
                  </div>
                </Rise>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ── Routes ──────────────────────────────────────────────────────── */

export function Places() {
  return (
    <section className="pilot-section" id="rotalar">
      <div className="pilot-shell">
        <div className="pilot-section__head pilot-section__head--split">
          <div>
            <p className="pilot-eyebrow">Rotalar</p>
            <h2 className="pilot-h2">
              Antalya’dan yol mesafeleri
            </h2>
          </div>
          <p className="pilot-lede">
            Antalya Havalimanı’ndan bazı bölgelere yaklaşık sürüş süreleri.
          </p>
        </div>

        <div className="pilot-places">
          <Rise className="pilot-places__plate">
            <img
              alt="Çamların arasından denize açılan boş sahil yolu"
              height={1200}
              loading="lazy"
              src="/assets/place/belek-yol.webp"
              width={1800}
            />
            <div className="pilot-places__caption">
              <p className="pilot-spec" style={{ color: "var(--pilot-travertine)" }}>
                D400 · Belek çıkışı
              </p>
            </div>
          </Rise>

          <div className="pilot-routes">
            {ROUTES.map((r, i) => (
              <Rise delay={i * 70} key={r.name}>
                <div className="pilot-route">
                  <div>
                    <p className="pilot-route__name">{r.name}</p>
                    <p className="pilot-route__note">{r.note}</p>
                  </div>
                  <span className="pilot-route__time">{r.time}</span>
                </div>
              </Rise>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ── FAQ ─────────────────────────────────────────────────────────── */

export function Faq() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section className="pilot-section" id="sss">
      <div className="pilot-shell">
        <div className="pilot-section__head">
          <p className="pilot-eyebrow">Sık sorulanlar</p>
          <h2 className="pilot-h2">Merak edilenler.</h2>
        </div>

        <div className="pilot-faq">
          {FAQS.map((f, i) => (
            <div className="pilot-faq__item" key={f.q}>
              <button
                aria-controls={`faq-a-${i}`}
                aria-expanded={open === i}
                className="pilot-faq__q"
                id={`faq-q-${i}`}
                onClick={() => setOpen(open === i ? null : i)}
                type="button"
              >
                <span>{f.q}</span>
                <IconPlus />
              </button>
              {open === i ? (
                <p aria-labelledby={`faq-q-${i}`} className="pilot-faq__a" id={`faq-a-${i}`}>
                  {f.a}
                </p>
              ) : null}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ── Closing plate ───────────────────────────────────────────────── */

export function ClosingPlate() {
  return (
    <section className="pilot-close" id="iletisim">
      <img
        alt=""
        className="pilot-close__bg"
        loading="lazy"
        src="/assets/brand/cover.webp"
      />
      <div className="pilot-close__veil" />
      <div className="pilot-close__inner">
        <div className="pilot-shell">
          <div className="pilot-close__card">
            <p className="pilot-eyebrow">İletişim</p>
            <h2 className="pilot-h2">Rezervasyon ve bilgi</h2>
            <p className="pilot-lede" style={{ marginTop: "1rem" }}>
              Araç uygunluğu, teslimat ve kiralama koşulları için arayın veya WhatsApp’tan yazın.
            </p>
            <div className="pilot-close__actions">
              <CtaWhatsApp>WhatsApp'tan yaz</CtaWhatsApp>
              <CtaCall />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ── Footer ──────────────────────────────────────────────────────── */

export function Footer() {
  return (
    <footer className="pilot-footer">
      <div className="pilot-shell">
        <div className="pilot-footer__grid">
          <div>
            <PilotMark height={30} />
            <p className="pilot-lede" style={{ marginTop: "1rem", fontSize: "0.9375rem" }}>
              Antalya ve Antalya Havalimanı'nda oto kiralama, şoförlü kiralama ve
              transfer.
            </p>
          </div>

          <div>
            <p className="pilot-footer__title">Rezervasyon</p>
            <div className="pilot-footer__list">
              <a href={`tel:${PILOT_PHONE_TEL}`}>{PILOT_PHONE_DISPLAY}</a>
              <a href={PILOT_WHATSAPP} rel="noreferrer" target="_blank">
                WhatsApp
              </a>
              <a href={PILOT_MAP} rel="noreferrer" target="_blank">
                Ofis konumu
              </a>
            </div>
          </div>

          <div>
            <p className="pilot-footer__title">Sayfalar</p>
            <div className="pilot-footer__list">
              <a href="#filo">Filo ve fiyatlar</a>
              <a href="#neden">Neden Pilot</a>
              <a href="#rotalar">Rotalar</a>
              <a href="#sss">Sık sorulanlar</a>
            </div>
          </div>
        </div>

        <div className="pilot-footer__legal">
          <span>© {new Date().getFullYear()} Pilot Rent a Car</span>
          <span>Antalya · Belek · Side · Kemer</span>
        </div>
      </div>
    </footer>
  );
}
