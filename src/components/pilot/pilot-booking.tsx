import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useEffectEvent,
  useMemo,
  useRef,
  useState,
  type FormEvent,
  type ReactNode,
} from "react";

import {
  BODY_LABELS,
  BOOKING_ENDPOINT,
  EXTRAS,
  FLEET_CARS,
  LOCATIONS,
  PILOT_PHONE_DISPLAY,
  PILOT_WHATSAPP,
  TIME_SLOTS,
  carLabel,
  carPoster,
  carVideo,
  formatDay,
  formatPrice,
  isoDay,
  rentalDays,
  type CarBody,
  type FleetCar,
} from "./pilot-content";
import { IconArrow, IconCheck, IconClose, IconWhatsApp, LoopVideo } from "./pilot-ui";

/* ── Public API ──────────────────────────────────────────────────── */

export interface BookingPrefill {
  pickupPlace?: string;
  pickupDate?: string;
  returnDate?: string;
  carId?: string;
}

const BookingContext = createContext<(prefill?: BookingPrefill) => void>(() => {});

/** Opens the reservation dialog, optionally pre-filled. */
export const useBooking = () => useContext(BookingContext);

export function BookingProvider({ children }: { children: ReactNode }) {
  const [request, setRequest] = useState<{ prefill: BookingPrefill; nonce: number } | null>(null);
  const openBooking = useCallback(
    (prefill: BookingPrefill = {}) => setRequest({ prefill, nonce: Date.now() }),
    [],
  );
  const onClosed = useCallback(() => setRequest(null), []);

  return (
    <BookingContext.Provider value={openBooking}>
      {children}
      <BookingDialog onClosed={onClosed} request={request} />
    </BookingContext.Provider>
  );
}

/* ── Draft model ─────────────────────────────────────────────────── */

const SAME_PLACE = "Alış noktasıyla aynı";
const STEP_LABELS = ["Tarih ve yer", "Araç", "Bilgileriniz"];

interface Draft {
  pickupPlace: string;
  returnPlace: string;
  pickupDate: string;
  pickupTime: string;
  returnDate: string;
  returnTime: string;
  carId: string;
  extras: string[];
  name: string;
  phone: string;
  email: string;
  flight: string;
  note: string;
  consent: boolean;
  /** Honeypot — real visitors never see or fill it. */
  honey: string;
}

const emptyDraft = (): Draft => ({
  pickupPlace: LOCATIONS[0],
  returnPlace: SAME_PLACE,
  pickupDate: "",
  pickupTime: "10:00",
  returnDate: "",
  returnTime: "10:00",
  carId: "",
  extras: [],
  name: "",
  phone: "",
  email: "",
  flight: "",
  note: "",
  consent: false,
  honey: "",
});

const addDays = (day: string, n: number) => {
  const d = new Date(`${day}T12:00:00`);
  d.setDate(d.getDate() + n);
  return isoDay(d);
};

const at = (day: string, time: string) => (day ? new Date(`${day}T${time}:00`) : null);

function makeCode() {
  const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  const bytes = new Uint8Array(4);
  crypto.getRandomValues(bytes);
  const tail = Array.from(bytes, (b) => alphabet[b % alphabet.length]).join("");
  return `PLT-${isoDay(new Date()).slice(2).replaceAll("-", "")}-${tail}`;
}

function stepErrors(step: number, draft: Draft, today: string) {
  const errors: string[] = [];
  if (step === 0) {
    const start = at(draft.pickupDate, draft.pickupTime);
    const end = at(draft.returnDate, draft.returnTime);
    if (!draft.pickupDate) errors.push("Alış tarihini seçin.");
    else if (draft.pickupDate < today) errors.push("Alış tarihi geçmiş bir gün olamaz.");
    if (!draft.returnDate) errors.push("İade tarihini seçin.");
    else if (start && end && rentalDays(start, end) === 0)
      errors.push("İade, alış zamanından sonra olmalıdır.");
  }
  if (step === 1 && !draft.carId) errors.push("Devam etmek için bir araç seçin.");
  if (step === 2) {
    if (draft.name.trim().length < 3) errors.push("Adınızı ve soyadınızı yazın.");
    if (draft.phone.replace(/\D/g, "").length < 10)
      errors.push("Size ulaşabileceğimiz bir telefon numarası yazın.");
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(draft.email.trim()))
      errors.push("Geçerli bir e-posta adresi yazın; onay özeti oraya gelir.");
    if (!draft.consent) errors.push("Bilgilerinizin rezervasyon için kullanılmasını onaylayın.");
  }
  return errors;
}

function summaryLines(draft: Draft, car: FleetCar | undefined, days: number) {
  const returnPlace = draft.returnPlace === SAME_PLACE ? draft.pickupPlace : draft.returnPlace;
  const extras = EXTRAS.filter((e) => draft.extras.includes(e.id)).map((e) => e.label);
  return [
    car ? `Araç: ${carLabel(car)}` : null,
    `Alış: ${draft.pickupPlace} · ${formatDay(draft.pickupDate)} ${draft.pickupTime}`,
    `İade: ${returnPlace} · ${formatDay(draft.returnDate)} ${draft.returnTime}`,
    days ? `Süre: ${days} gün` : null,
    car ? `Günlük fiyat: ${formatPrice(car.dailyPrice)}` : null,
    car && days ? `Tahmini toplam: ${formatPrice(car.dailyPrice * days)}` : null,
    extras.length ? `Ek talepler: ${extras.join(", ")}` : null,
    draft.flight.trim() ? `Uçuş kodu: ${draft.flight.trim()}` : null,
  ].filter((line): line is string => Boolean(line));
}

/* ── Dialog ──────────────────────────────────────────────────────── */

type Status = "idle" | "sending" | "sent" | "error";

function BookingDialog({
  request,
  onClosed,
}: {
  request: { prefill: BookingPrefill; nonce: number } | null;
  onClosed: () => void;
}) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const bodyRef = useRef<HTMLDivElement>(null);
  const [draft, setDraft] = useState<Draft>(emptyDraft);
  const [step, setStep] = useState(0);
  const [tried, setTried] = useState<boolean[]>([false, false, false]);
  const [today, setToday] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [code, setCode] = useState("");
  const [bodyFilter, setBodyFilter] = useState<CarBody | "all">("all");

  // Open on every new request; merge the prefill and start at the first
  // step that still needs input. A finished booking starts a fresh draft.
  const openWith = useEffectEvent((requested: BookingPrefill) => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    const now = isoDay(new Date());
    const base = status === "sent" ? { ...emptyDraft(), ...pick(draft) } : draft;
    const prefill = Object.fromEntries(
      Object.entries(requested).filter(([, value]) => Boolean(value)),
    ) as BookingPrefill;
    const next: Draft = { ...base, ...prefill };
    if (next.pickupDate && next.returnDate && next.returnDate < next.pickupDate) next.returnDate = "";

    const first = [0, 1, 2].find((s) => stepErrors(s, next, now).length > 0) ?? 2;
    setToday(now);
    setDraft(next);
    setStep(Math.min(first, 2));
    setTried([false, false, false]);
    setStatus("idle");
    setCode("");
    if (!dialog.open) dialog.showModal();
    document.documentElement.classList.add("pilot-locked");
  });

  useEffect(() => {
    if (request) openWith(request.prefill);
  }, [request]);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    const handleClose = () => {
      document.documentElement.classList.remove("pilot-locked");
      onClosed();
    };
    dialog.addEventListener("close", handleClose);
    return () => {
      dialog.removeEventListener("close", handleClose);
      document.documentElement.classList.remove("pilot-locked");
    };
  }, [onClosed]);

  useEffect(() => {
    bodyRef.current?.scrollTo({ top: 0 });
  }, [step, status]);

  const car = FLEET_CARS.find((c) => c.id === draft.carId);
  const start = at(draft.pickupDate, draft.pickupTime);
  const end = at(draft.returnDate, draft.returnTime);
  const days = start && end ? rentalDays(start, end) : 0;
  const total = car && days ? car.dailyPrice * days : 0;
  const errors = useMemo(() => stepErrors(step, draft, today), [step, draft, today]);
  const showErrors = tried[step] && errors.length > 0;

  const set = <K extends keyof Draft>(key: K, value: Draft[K]) =>
    setDraft((d) => ({ ...d, [key]: value }));

  const close = () => dialogRef.current?.close();

  const goTo = (target: number) => {
    if (target <= step) {
      setStep(target);
      return;
    }
    for (let s = step; s < target; s += 1) {
      if (stepErrors(s, draft, today).length) {
        setStep(s);
        setTried((t) => t.map((v, i) => (i === s ? true : v)));
        return;
      }
    }
    setStep(target);
  };

  const whatsappHref = useMemo(() => {
    const lines = [
      "Merhaba, Pilot Rent a Car için rezervasyon talebim:",
      code ? `Rezervasyon no: ${code}` : null,
      ...summaryLines(draft, car, days),
      draft.name.trim() ? `Ad soyad: ${draft.name.trim()}` : null,
      draft.note.trim() ? `Not: ${draft.note.trim()}` : null,
    ].filter(Boolean);
    return `${PILOT_WHATSAPP}&text=${encodeURIComponent(lines.join("\n"))}`;
  }, [draft, car, days, code]);

  async function send(event?: FormEvent) {
    event?.preventDefault();
    if (step < 2) {
      goTo(step + 1);
      return;
    }
    const blocking = [0, 1, 2].find((s) => stepErrors(s, draft, today).length > 0);
    if (blocking !== undefined) {
      setStep(blocking);
      setTried((t) => t.map((v, i) => (i === blocking ? true : v)));
      return;
    }
    if (!car) return;

    const reservation = code || makeCode();
    setCode(reservation);
    setStatus("sending");

    const lines = summaryLines(draft, car, days);
    const returnPlace = draft.returnPlace === SAME_PLACE ? draft.pickupPlace : draft.returnPlace;
    const extras = EXTRAS.filter((e) => draft.extras.includes(e.id)).map((e) => e.label);
    const payload = {
      _subject: `Yeni rezervasyon ${reservation} — ${car.name}, ${formatDay(draft.pickupDate)}`,
      _template: "table",
      _captcha: "false",
      _honey: draft.honey,
      _autoresponse: [
        `Merhaba ${draft.name.trim()},`,
        "",
        "Pilot Rent a Car rezervasyon talebiniz bize ulaştı.",
        `Rezervasyon no: ${reservation}`,
        ...lines,
        "",
        "Aracın uygunluğunu ve kesin tutarı telefon veya WhatsApp üzerinden teyit edeceğiz. Ön ödeme alınmaz.",
        `Sorularınız için: ${PILOT_PHONE_DISPLAY}`,
      ].join("\n"),
      "Rezervasyon no": reservation,
      "Ad soyad": draft.name.trim(),
      Telefon: draft.phone.trim(),
      email: draft.email.trim(),
      Araç: carLabel(car),
      Alış: `${draft.pickupPlace} · ${formatDay(draft.pickupDate)} ${draft.pickupTime}`,
      İade: `${returnPlace} · ${formatDay(draft.returnDate)} ${draft.returnTime}`,
      Süre: `${days} gün`,
      "Günlük fiyat": formatPrice(car.dailyPrice),
      "Tahmini toplam": formatPrice(total),
      "Ek talepler": extras.length ? extras.join(", ") : "Yok",
      "Uçuş kodu": draft.flight.trim() || "—",
      Not: draft.note.trim() || "—",
    };

    const controller = new AbortController();
    const timer = window.setTimeout(() => controller.abort(), 20_000);
    try {
      const response = await fetch(BOOKING_ENDPOINT, {
        body: JSON.stringify(payload),
        headers: { Accept: "application/json", "Content-Type": "application/json" },
        method: "POST",
        signal: controller.signal,
      });
      const data = (await response.json().catch(() => ({}))) as { success?: unknown };
      if (!response.ok || String(data.success) !== "true") throw new Error("not delivered");
      setStatus("sent");
    } catch {
      setStatus("error");
    } finally {
      window.clearTimeout(timer);
    }
  }

  const cars = FLEET_CARS.filter((c) => bodyFilter === "all" || c.body === bodyFilter);

  return (
    <dialog
      aria-labelledby="pilot-book-title"
      className="pilot-book"
      onClick={(event) => {
        if (event.target === event.currentTarget) close();
      }}
      ref={dialogRef}
    >
      <form className="pilot-book__frame" noValidate onSubmit={send}>
        <header className="pilot-book__head">
          <div>
            <p className="pilot-eyebrow">Online rezervasyon</p>
            <h2 className="pilot-book__title" id="pilot-book-title">
              {status === "sent" ? "Talebiniz alındı" : "Aracınızı ayırtın"}
            </h2>
          </div>
          <button aria-label="Kapat" className="pilot-book__close" onClick={close} type="button">
            <IconClose />
          </button>
          {status !== "sent" ? (
            <ol className="pilot-book__steps">
              {STEP_LABELS.map((label, i) => (
                <li key={label}>
                  <button
                    aria-current={i === step ? "step" : undefined}
                    className="pilot-book__step"
                    data-done={i < step}
                    onClick={() => goTo(i)}
                    type="button"
                  >
                    <span className="pilot-book__step-no">{i < step ? <IconCheck size={13} /> : i + 1}</span>
                    <span>{label}</span>
                  </button>
                </li>
              ))}
            </ol>
          ) : null}
        </header>

        <div className="pilot-book__body" ref={bodyRef}>
          {status === "sent" ? (
            <Done
              code={code}
              draft={draft}
              lines={summaryLines(draft, car, days)}
              onClose={close}
              whatsappHref={whatsappHref}
            />
          ) : (
            <div className="pilot-book__layout">
              <div className="pilot-book__main" key={step}>
                {step === 0 ? (
                  <div className="pilot-book__grid">
                    <Field label="Alış noktası">
                      <select
                        className="pilot-input"
                        onChange={(e) => set("pickupPlace", e.target.value)}
                        value={draft.pickupPlace}
                      >
                        {LOCATIONS.map((p) => (
                          <option key={p}>{p}</option>
                        ))}
                      </select>
                    </Field>
                    <Field label="İade noktası">
                      <select
                        className="pilot-input"
                        onChange={(e) => set("returnPlace", e.target.value)}
                        value={draft.returnPlace}
                      >
                        <option>{SAME_PLACE}</option>
                        {LOCATIONS.map((p) => (
                          <option key={p}>{p}</option>
                        ))}
                      </select>
                    </Field>
                    <Field label="Alış tarihi">
                      <input
                        className="pilot-input"
                        min={today || undefined}
                        onChange={(e) => {
                          const value = e.target.value;
                          setDraft((d) => ({
                            ...d,
                            pickupDate: value,
                            returnDate:
                              value && (!d.returnDate || d.returnDate < value) ? addDays(value, 1) : d.returnDate,
                          }));
                        }}
                        type="date"
                        value={draft.pickupDate}
                      />
                    </Field>
                    <Field label="Alış saati">
                      <select
                        className="pilot-input"
                        onChange={(e) => set("pickupTime", e.target.value)}
                        value={draft.pickupTime}
                      >
                        {TIME_SLOTS.map((t) => (
                          <option key={t}>{t}</option>
                        ))}
                      </select>
                    </Field>
                    <Field label="İade tarihi">
                      <input
                        className="pilot-input"
                        min={draft.pickupDate || today || undefined}
                        onChange={(e) => set("returnDate", e.target.value)}
                        type="date"
                        value={draft.returnDate}
                      />
                    </Field>
                    <Field label="İade saati">
                      <select
                        className="pilot-input"
                        onChange={(e) => set("returnTime", e.target.value)}
                        value={draft.returnTime}
                      >
                        {TIME_SLOTS.map((t) => (
                          <option key={t}>{t}</option>
                        ))}
                      </select>
                    </Field>
                    <div className="pilot-book__span pilot-book__days" aria-live="polite">
                      {days > 0 ? (
                        <>
                          <strong>{days} gün</strong> kiralama · {formatDay(draft.pickupDate)} →{" "}
                          {formatDay(draft.returnDate)}
                        </>
                      ) : (
                        "Tarihleri seçtiğinizde kiralama süresi burada hesaplanır."
                      )}
                    </div>
                  </div>
                ) : null}

                {step === 1 ? (
                  <div>
                    <div className="pilot-chips" role="group" aria-label="Kasa tipine göre süz">
                      {(["all", "sedan", "hatchback", "ticari"] as const).map((key) => (
                        <button
                          aria-pressed={bodyFilter === key}
                          className="pilot-chip"
                          key={key}
                          onClick={() => setBodyFilter(key)}
                          type="button"
                        >
                          {key === "all" ? "Tümü" : BODY_LABELS[key]}
                        </button>
                      ))}
                    </div>
                    <div className="pilot-picks" role="radiogroup" aria-label="Araç seçimi">
                      {cars.map((c) => (
                        <label className="pilot-pick" data-selected={c.id === draft.carId} key={c.id}>
                          <input
                            checked={c.id === draft.carId}
                            className="pilot-sr"
                            name="pilot-car"
                            onChange={() => set("carId", c.id)}
                            type="radio"
                            value={c.id}
                          />
                          <img alt="" className="pilot-pick__img" height={160} loading="lazy" src={carPoster(c)} width={240} />
                          <span className="pilot-pick__text">
                            <span className="pilot-pick__name">{c.name}</span>
                            <span className="pilot-pick__meta">
                              {c.year} · {c.fuel} · {BODY_LABELS[c.body]}
                            </span>
                            <span className="pilot-pick__price">
                              {formatPrice(c.dailyPrice)} <small>/ gün</small>
                              {days ? <em>{formatPrice(c.dailyPrice * days)} toplam</em> : null}
                            </span>
                          </span>
                          <span className="pilot-pick__tick">
                            <IconCheck size={14} />
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>
                ) : null}

                {step === 2 ? (
                  <div className="pilot-book__grid">
                    <Field label="Ad soyad">
                      <input
                        autoComplete="name"
                        className="pilot-input"
                        onChange={(e) => set("name", e.target.value)}
                        placeholder="Sürücünün adı ve soyadı"
                        value={draft.name}
                      />
                    </Field>
                    <Field label="Telefon (WhatsApp)">
                      <input
                        autoComplete="tel"
                        className="pilot-input"
                        inputMode="tel"
                        onChange={(e) => set("phone", e.target.value)}
                        placeholder="+90 5xx xxx xx xx"
                        type="tel"
                        value={draft.phone}
                      />
                    </Field>
                    <Field label="E-posta">
                      <input
                        autoComplete="email"
                        className="pilot-input"
                        inputMode="email"
                        onChange={(e) => set("email", e.target.value)}
                        placeholder="Onay özeti bu adrese gelir"
                        type="email"
                        value={draft.email}
                      />
                    </Field>
                    <Field label="Uçuş kodu (isteğe bağlı)">
                      <input
                        className="pilot-input"
                        onChange={(e) => set("flight", e.target.value.toUpperCase())}
                        placeholder="Örn. TK2412"
                        value={draft.flight}
                      />
                    </Field>
                    <fieldset className="pilot-book__span pilot-extras">
                      <legend className="pilot-field__label">Ek talepler · ücret onayda bildirilir</legend>
                      {EXTRAS.map((extra) => {
                        const on = draft.extras.includes(extra.id);
                        return (
                          <label className="pilot-extra" data-on={on} key={extra.id}>
                            <input
                              checked={on}
                              className="pilot-sr"
                              onChange={() =>
                                set(
                                  "extras",
                                  on ? draft.extras.filter((x) => x !== extra.id) : [...draft.extras, extra.id],
                                )
                              }
                              type="checkbox"
                            />
                            <span className="pilot-extra__box">
                              <IconCheck size={12} />
                            </span>
                            <span>
                              <span className="pilot-extra__label">{extra.label}</span>
                              <span className="pilot-extra__note">{extra.note}</span>
                            </span>
                          </label>
                        );
                      })}
                    </fieldset>
                    <Field label="Not (isteğe bağlı)" span>
                      <textarea
                        className="pilot-input pilot-input--area"
                        onChange={(e) => set("note", e.target.value)}
                        placeholder="Otel adı, teslim adresi, çocuk koltuğu yaşı…"
                        rows={3}
                        value={draft.note}
                      />
                    </Field>
                    <label className="pilot-book__span pilot-consent">
                      <input
                        checked={draft.consent}
                        onChange={(e) => set("consent", e.target.checked)}
                        type="checkbox"
                      />
                      <span>
                        Bilgilerimin yalnızca bu rezervasyon için kullanılmasını ve benimle telefon, WhatsApp
                        veya e-posta ile iletişime geçilmesini onaylıyorum.
                      </span>
                    </label>
                    <input
                      aria-hidden="true"
                      autoComplete="off"
                      className="pilot-honey"
                      name="_honey"
                      onChange={(e) => set("honey", e.target.value)}
                      tabIndex={-1}
                      value={draft.honey}
                    />
                  </div>
                ) : null}

                {showErrors ? (
                  <ul className="pilot-book__errors" role="alert">
                    {errors.map((error) => (
                      <li key={error}>{error}</li>
                    ))}
                  </ul>
                ) : null}

                {status === "error" ? (
                  <div className="pilot-book__fail" role="alert">
                    <p>
                      Talebiniz şu an e-postayla iletilemedi. Bilgileriniz duruyor: WhatsApp'tan tek dokunuşla
                      gönderebilir ya da tekrar deneyebilirsiniz.
                    </p>
                    <a className="pilot-cta-whatsapp" href={whatsappHref} rel="noreferrer" target="_blank">
                      <IconWhatsApp />
                      <span>WhatsApp ile gönder</span>
                    </a>
                  </div>
                ) : null}
              </div>

              <aside className="pilot-book__summary" aria-label="Rezervasyon özeti">
                <div className="pilot-book__media">
                  {car ? (
                    <LoopVideo
                      className="pilot-book__video"
                      key={car.id}
                      label={`${car.name} çevresinde dönen görünüm`}
                      poster={carPoster(car)}
                      src={carVideo(car)}
                    />
                  ) : (
                    <p className="pilot-book__media-empty">Araç seçtiğinizde burada döner.</p>
                  )}
                </div>
                <div className="pilot-book__receipt">
                  <p className="pilot-book__car">{car ? car.name : "Araç seçilmedi"}</p>
                  {car ? (
                    <p className="pilot-book__car-meta">
                      {car.year} · {car.fuel}
                    </p>
                  ) : null}
                  <dl className="pilot-book__lines">
                    <div>
                      <dt>Alış</dt>
                      <dd>
                        {draft.pickupPlace}
                        {draft.pickupDate ? (
                          <span>
                            {formatDay(draft.pickupDate)} · {draft.pickupTime}
                          </span>
                        ) : null}
                      </dd>
                    </div>
                    <div>
                      <dt>İade</dt>
                      <dd>
                        {draft.returnPlace === SAME_PLACE ? draft.pickupPlace : draft.returnPlace}
                        {draft.returnDate ? (
                          <span>
                            {formatDay(draft.returnDate)} · {draft.returnTime}
                          </span>
                        ) : null}
                      </dd>
                    </div>
                    {car ? (
                      <div>
                        <dt>Günlük</dt>
                        <dd>{formatPrice(car.dailyPrice)}</dd>
                      </div>
                    ) : null}
                    {days ? (
                      <div>
                        <dt>Süre</dt>
                        <dd>{days} gün</dd>
                      </div>
                    ) : null}
                  </dl>
                  <div className="pilot-book__total">
                    <span>Tahmini toplam</span>
                    <strong>{total ? formatPrice(total) : "—"}</strong>
                  </div>
                  <p className="pilot-book__fine">Ön ödeme yok. Kesin tutar onayda bildirilir.</p>
                </div>
              </aside>
            </div>
          )}
        </div>

        {status !== "sent" ? (
          <footer className="pilot-book__foot">
            <p className="pilot-book__mini">
              {car ? car.name : "Araç seçilmedi"}
              {total ? <strong>{formatPrice(total)}</strong> : null}
            </p>
            <div className="pilot-book__nav">
              {step > 0 ? (
                <button className="pilot-book__back" onClick={() => setStep(step - 1)} type="button">
                  Geri
                </button>
              ) : null}
              <button
                className="pilot-cta-quote pilot-book__next"
                data-busy={status === "sending"}
                disabled={status === "sending"}
                type="submit"
              >
                {step < 2 ? "Devam" : status === "sending" ? "Gönderiliyor…" : status === "error" ? "Tekrar dene" : "Rezervasyonu gönder"}
                {status !== "sending" ? <IconArrow /> : null}
              </button>
            </div>
          </footer>
        ) : null}
      </form>
    </dialog>
  );
}

/** Contact details survive a finished booking so a second car is quick. */
const pick = (d: Draft) => ({ name: d.name, phone: d.phone, email: d.email });

function Field({ label, span, children }: { label: string; span?: boolean; children: ReactNode }) {
  return (
    <label className={span ? "pilot-book__field pilot-book__span" : "pilot-book__field"}>
      <span className="pilot-field__label">{label}</span>
      {children}
    </label>
  );
}

function Done({
  code,
  draft,
  lines,
  onClose,
  whatsappHref,
}: {
  code: string;
  draft: Draft;
  lines: string[];
  onClose: () => void;
  whatsappHref: string;
}) {
  return (
    <div className="pilot-book__done">
      <span className="pilot-book__seal">
        <IconCheck size={30} />
      </span>
      <p className="pilot-book__code">
        Rezervasyon no <strong>{code}</strong>
      </p>
      <p className="pilot-lede pilot-book__done-text">
        Talebiniz bize ulaştı ve özeti <strong>{draft.email.trim()}</strong> adresine gönderildi. Aracın
        uygunluğunu ve kesin tutarı telefon veya WhatsApp üzerinden teyit edeceğiz.
      </p>
      <ul className="pilot-book__done-lines">
        {lines.map((line) => (
          <li key={line}>{line}</li>
        ))}
      </ul>
      <div className="pilot-close__actions">
        <a className="pilot-cta-whatsapp" href={whatsappHref} rel="noreferrer" target="_blank">
          <IconWhatsApp />
          <span>WhatsApp'tan da ilet</span>
        </a>
        <button className="pilot-cta-call pilot-book__done-close" onClick={onClose} type="button">
          Kapat
        </button>
      </div>
    </div>
  );
}
