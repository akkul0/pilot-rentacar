import { useEffect, useMemo, useState, useSyncExternalStore } from "react";

import { useBooking } from "./pilot-booking";
import {
  BODY_LABELS,
  CLAIMS,
  FAQS,
  FLEET_CARS,
  FLEET_TOTAL,
  LOCATIONS,
  STEPS,
  carLabel,
  carPoster,
  carVideo,
  formatPrice,
  isoToday,
  PILOT_MAP,
  PILOT_PHONE_DISPLAY,
  PILOT_PHONE_TEL,
  PILOT_WHATSAPP,
  ROUTES,
  type CarBody,
} from "./pilot-content";
import { PilotMark } from "./pilot-mark";
import {
  ClaimIcon,
  CtaCall,
  CtaPill,
  CtaRent,
  CtaWhatsApp,
  IconCalendar,
  IconOrbit,
  IconPhone,
  IconPlus,
  IconWhatsApp,
  LoopVideo,
  Rise,
} from "./pilot-ui";

/* ── Nav ─────────────────────────────────────────────────────────── */

export function SiteNav() {
  const openBooking = useBooking();
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
        <CtaPill onClick={() => openBooking()}>Rezervasyon</CtaPill>
      </div>
    </header>
  );
}

/* ── Booking bar — the instrument panel ──────────────────────────── */

const noSubscribe = () => () => {};

export function BookingBar() {
  const openBooking = useBooking();
  const [pickup, setPickup] = useState(LOCATIONS[0]);
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");
  const [carId, setCarId] = useState("");
  // Empty on the server, today's local date once hydrated.
  const today = useSyncExternalStore(noSubscribe, isoToday, () => "");
  const car = FLEET_CARS.find((item) => item.id === carId);

  const nights = useMemo(() => {
    if (!start || !end) return 0;
    const ms = new Date(end).getTime() - new Date(start).getTime();
    return ms > 0 ? Math.round(ms / 86400000) : 0;
  }, [start, end]);

  return (
    <section className="pilot-booking" id="rezervasyon">
      <div className="pilot-shell">
        <Rise>
          <form
            className="pilot-booking__grid"
            onSubmit={(event) => {
              event.preventDefault();
              openBooking({ pickupPlace: pickup, pickupDate: start, returnDate: end, carId });
            }}
          >
            <label className="pilot-field">
              <span className="pilot-field__label">Alış yeri</span>
              <select
                className="pilot-field__control"
                onChange={(e) => setPickup(e.target.value)}
                value={pickup}
              >
                {LOCATIONS.map((p) => (
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
                min={today || undefined}
                onChange={(e) => setStart(e.target.value)}
                type="date"
                value={start}
              />
            </label>

            <label className="pilot-field">
              <span className="pilot-field__label">İade tarihi</span>
              <input
                className="pilot-field__control"
                min={start || today || undefined}
                onChange={(e) => setEnd(e.target.value)}
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
                <option value="">Tüm araçlar</option>
                {FLEET_CARS.map((c) => (
                  <option key={c.id} value={c.id}>
                    {carLabel(c)} · {formatPrice(c.dailyPrice)} / gün
                  </option>
                ))}
              </select>
            </label>

            <div className="pilot-booking__submit">
              <button className="pilot-cta-quote" type="submit">
                Rezervasyon yap
              </button>
            </div>
          </form>
        </Rise>

        <div className="pilot-booking__out">
          <span className="pilot-booking__live" aria-hidden="true" />
          <p aria-live="polite">
            {nights > 0 && car ? (
              <>
                <strong>{pickup}</strong> · <strong>{nights} gün</strong> · <strong>{carLabel(car)}</strong> ·
                Tahmini toplam <strong>{formatPrice(nights * car.dailyPrice)}</strong>. Ön ödeme yok; kesin
                tutar onayda bildirilir.
              </>
            ) : nights > 0 ? (
              <>
                <strong>{nights} gün</strong> için {FLEET_TOTAL} araçtan seçin; toplam tutarı rezervasyon
                ekranında anında görürsünüz.
              </>
            ) : (
              <>
                Online rezervasyon üç adımda biter: tarih, araç, iletişim. Onay özeti e-postanıza gelir,{" "}
                <strong>ön ödeme alınmaz</strong>.
              </>
            )}
          </p>
        </div>
      </div>
    </section>
  );
}

/* ── Ticker — places and promises, always moving ─────────────────── */

const TICKER = [
  "Antalya Havalimanı",
  "7/24 karşılama",
  "Lara",
  "Kundu",
  "Ön ödeme yok",
  "Belek",
  "Side",
  "Otelinize teslim",
  "Kemer",
  "Konyaaltı",
  "Şoförlü kiralama",
];

export function Ticker() {
  const run = (hidden: boolean) => (
    <ul aria-hidden={hidden || undefined} className="pilot-ticker__run">
      {TICKER.map((item) => (
        <li key={item}>{item}</li>
      ))}
    </ul>
  );
  return (
    <div className="pilot-ticker">
      <div className="pilot-ticker__track">
        {run(false)}
        {run(true)}
      </div>
    </div>
  );
}

/* ── Fleet ───────────────────────────────────────────────────────── */

type FleetFilter = "all" | CarBody | "dizel";

const FILTERS: { key: FleetFilter; label: string }[] = [
  { key: "all", label: "Tümü" },
  { key: "sedan", label: BODY_LABELS.sedan },
  { key: "hatchback", label: BODY_LABELS.hatchback },
  { key: "ticari", label: BODY_LABELS.ticari },
  { key: "dizel", label: "Dizel" },
];

const matches = (filter: FleetFilter) => (car: (typeof FLEET_CARS)[number]) =>
  filter === "all" ? true : filter === "dizel" ? /dizel/i.test(car.fuel) : car.body === filter;

export function Fleet() {
  const openBooking = useBooking();
  const [filter, setFilter] = useState<FleetFilter>("all");
  const cars = FLEET_CARS.filter(matches(filter));

  return (
    <section className="pilot-section" id="filo">
      <div className="pilot-shell">
        <div className="pilot-section__head pilot-section__head--split">
          <div>
            <p className="pilot-eyebrow">Filo</p>
            <h2 className="pilot-h2">Kiralık araçlarımız</h2>
          </div>
          <p className="pilot-lede">
            Her aracın çevresinde dönün, günlük fiyatı görün ve tek dokunuşla rezervasyon yapın.
          </p>
        </div>

        <div className="pilot-fleet__bar">
          <div className="pilot-chips" role="group" aria-label="Filoyu süz">
            {FILTERS.map(({ key, label }) => (
              <button
                aria-pressed={filter === key}
                className="pilot-chip"
                key={key}
                onClick={() => setFilter(key)}
                type="button"
              >
                {label}
                <span className="pilot-chip__count">{FLEET_CARS.filter(matches(key)).length}</span>
              </button>
            ))}
          </div>
          <p className="pilot-fleet__note">
            <IconOrbit /> Görüntüler temsilidir; renk ve donanım farklı olabilir.
          </p>
        </div>

        <div className="pilot-fleet">
          {cars.map((car, i) => (
            <Rise delay={(i % 3) * 90} key={car.id}>
              <article className="pilot-vehicle">
                <figure className="pilot-vehicle__photo">
                  <LoopVideo
                    className="pilot-vehicle__video"
                    label={`${car.name}, çevresinde dönen kamera görünümü`}
                    poster={carPoster(car)}
                    src={carVideo(car)}
                  />
                  <span className="pilot-vehicle__badge">{BODY_LABELS[car.body]}</span>
                  <span className="pilot-vehicle__orbit" aria-hidden="true">
                    <IconOrbit size={14} /> 360°
                  </span>
                </figure>
                <div className="pilot-vehicle__heading">
                  <span className="pilot-vehicle__year">
                    {car.year} model · {car.fuel}
                  </span>
                  <h3 className="pilot-class__name">{car.name}</h3>
                </div>
                <div className="pilot-vehicle__foot">
                  <p className="pilot-vehicle__price">
                    {formatPrice(car.dailyPrice)} <span>/ gün</span>
                  </p>
                  <div className="pilot-vehicle__actions">
                    <a
                      aria-label={`${car.name} için WhatsApp'tan müsaitlik sor`}
                      className="pilot-vehicle__wa"
                      href={`${PILOT_WHATSAPP}&text=${encodeURIComponent(
                        `Merhaba, ${carLabel(car)} için müsaitlik sormak istiyorum. Günlük fiyat: ${formatPrice(car.dailyPrice)}.`,
                      )}`}
                      rel="noreferrer"
                      target="_blank"
                    >
                      <IconWhatsApp size={18} />
                    </a>
                    <CtaRent onClick={() => openBooking({ carId: car.id })}>Hemen kirala</CtaRent>
                  </div>
                </div>
              </article>
            </Rise>
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
            <LoopVideo
              className="pilot-why__video"
              poster="/assets/place/video/kabin.webp"
              src="/assets/place/video/kabin.mp4"
            />
          </Rise>

          <div>
            <p className="pilot-eyebrow">Neden Pilot</p>
            <h2 className="pilot-h2">Kiralama ve teslimat hizmetleri</h2>
            <div className="pilot-stats">
              <div>
                <strong>{FLEET_TOTAL}</strong>
                <span>araç seçeneği</span>
              </div>
              <div>
                <strong>7/24</strong>
                <span>havalimanı karşılama</span>
              </div>
              <div>
                <strong>0 TL</strong>
                <span>ön ödeme</span>
              </div>
            </div>
            <div className="pilot-claims">
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
            <h2 className="pilot-h2">Antalya’dan yol mesafeleri</h2>
          </div>
          <p className="pilot-lede">Antalya Havalimanı’ndan bazı bölgelere yaklaşık sürüş süreleri.</p>
        </div>

        <div className="pilot-places">
          <Rise className="pilot-places__plate">
            <LoopVideo
              className="pilot-places__video"
              poster="/assets/place/video/belek-yol.webp"
              src="/assets/place/video/belek-yol.mp4"
            />
            <div className="pilot-places__caption">
              <p className="pilot-spec">D400 · Belek çıkışı</p>
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

/* ── Steps — numbered timeline ───────────────────────────────────── */

export function Steps() {
  const openBooking = useBooking();
  return (
    <section className="pilot-section pilot-section--well" id="adimlar">
      <div className="pilot-shell">
        <div className="pilot-section__head pilot-section__head--split">
          <h2 className="pilot-h2">Üç adımda anahtar elinizde.</h2>
          <div className="pilot-steps__cta">
            <p className="pilot-lede">Rezervasyon birkaç dakika sürer; onay özeti e-postanıza gelir.</p>
            <button className="pilot-cta-quote" onClick={() => openBooking()} type="button">
              <IconCalendar size={16} /> Rezervasyona başla
            </button>
          </div>
        </div>
        <div className="pilot-steps">
          {STEPS.map((s, i) => (
            <Rise delay={i * 120} key={s.no}>
              <div className="pilot-step">
                <span className="pilot-step__no">{s.no}</span>
                <h3 className="pilot-step__title">{s.title}</h3>
                <p className="pilot-step__body">{s.body}</p>
              </div>
            </Rise>
          ))}
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
            <div className="pilot-faq__item" data-open={open === i} key={f.q}>
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
              <div className="pilot-faq__panel" id={`faq-a-${i}`} role="region" aria-labelledby={`faq-q-${i}`}>
                <div>
                  <p className="pilot-faq__a">{f.a}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ── Closing plate ───────────────────────────────────────────────── */

export function ClosingPlate() {
  const openBooking = useBooking();
  return (
    <section className="pilot-close" id="iletisim">
      <LoopVideo
        className="pilot-close__bg"
        poster="/assets/brand/video/cover.webp"
        src="/assets/brand/video/cover.mp4"
      />
      <div className="pilot-close__veil" />
      <div className="pilot-close__inner">
        <div className="pilot-shell">
          <div className="pilot-close__card">
            <p className="pilot-eyebrow">İletişim</p>
            <h2 className="pilot-h2">Rezervasyon ve bilgi</h2>
            <p className="pilot-lede" style={{ marginTop: "1rem" }}>
              Online rezervasyon yapın, arayın veya WhatsApp’tan yazın. Gece inen uçak da karşılanır.
            </p>
            <div className="pilot-close__actions">
              <button className="pilot-cta-quote" onClick={() => openBooking()} type="button">
                Rezervasyon yap
              </button>
              <CtaWhatsApp>WhatsApp'tan yaz</CtaWhatsApp>
              <CtaCall />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ── Mobile dock — the three ways to book, always within reach ───── */

export function MobileDock() {
  const openBooking = useBooking();
  const [shown, setShown] = useState(false);

  useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      setShown(window.scrollY > window.innerHeight * 0.6);
    };
    const onScroll = () => {
      if (!frame) frame = window.requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <div className="pilot-dock" data-shown={shown}>
      <a aria-label="Hemen ara" className="pilot-dock__icon" href={`tel:${PILOT_PHONE_TEL}`}>
        <IconPhone />
      </a>
      <a aria-label="WhatsApp" className="pilot-dock__icon" href={PILOT_WHATSAPP} rel="noreferrer" target="_blank">
        <IconWhatsApp size={19} />
      </a>
      <button className="pilot-dock__book" onClick={() => openBooking()} type="button">
        <span className="pilot-cta-pill__dot" />
        Rezervasyon yap
      </button>
    </div>
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
              Antalya ve Antalya Havalimanı'nda oto kiralama, şoförlü kiralama ve transfer.
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
