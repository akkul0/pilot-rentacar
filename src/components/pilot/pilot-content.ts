/** Content for the Pilot Rent a Car site. Fleet and prices mirror the
 *  client's current listing; contact details are their live ones. */

export const PILOT_PHONE_DISPLAY = "0552 942 10 11";
export const PILOT_PHONE_TEL = "+905529421011";
export const PILOT_WHATSAPP = "https://api.whatsapp.com/send?phone=905529421011";
export const PILOT_MAP = "https://maps.app.goo.gl/jKcofqjffFfbHt3BA";

export type CarBody = "sedan" | "hatchback" | "ticari";

export interface FleetCar {
  id: string;
  name: string;
  fuel: string;
  /** True only for user-requested, unverified fuel assumptions. */
  fuelAssumed?: boolean;
  year: number;
  dailyPrice: number;
  body: CarBody;
}

export const FLEET_CARS: FleetCar[] = [
  { id: "egea-dizel", name: "Fiat Egea", fuel: "Dizel", year: 2022, dailyPrice: 2200, body: "sedan" },
  { id: "egea-benzin", name: "Fiat Egea", fuel: "Benzinli", year: 2022, dailyPrice: 2000, body: "sedan" },
  { id: "fiorino-dizel", name: "Fiat Fiorino", fuel: "Dizel", year: 2023, dailyPrice: 2000, body: "ticari" },
  { id: "fiorino-benzin", name: "Fiat Fiorino", fuel: "Benzinli", year: 2021, dailyPrice: 2000, body: "ticari" },
  { id: "clio", name: "Renault Clio", fuel: "Benzinli", year: 2024, dailyPrice: 2500, body: "hatchback" },
  { id: "taliant", name: "Renault Taliant", fuel: "Benzinli", year: 2021, dailyPrice: 2500, body: "sedan" },
  { id: "passat", name: "Volkswagen Passat", fuel: "Benzinli", year: 2022, dailyPrice: 4500, body: "sedan" },
  { id: "symbol", name: "Renault Symbol", fuel: "Benzinli", year: 2021, dailyPrice: 2000, body: "sedan" },
  { id: "logan", name: "Dacia Logan", fuel: "Dizel", fuelAssumed: true, year: 2017, dailyPrice: 2300, body: "sedan" },
  { id: "courier", name: "Ford Courier", fuel: "Benzin / dizel", year: 2023, dailyPrice: 2000, body: "ticari" },
  { id: "i20", name: "Hyundai i20", fuel: "Benzinli", fuelAssumed: true, year: 2020, dailyPrice: 2500, body: "hatchback" },
  { id: "i10", name: "Hyundai i10", fuel: "Benzinli", fuelAssumed: true, year: 2015, dailyPrice: 2000, body: "hatchback" },
  { id: "megane", name: "Renault Megane", fuel: "Dizel", fuelAssumed: true, year: 2020, dailyPrice: 2500, body: "sedan" },
  { id: "focus", name: "Ford Focus", fuel: "Dizel", fuelAssumed: true, year: 2020, dailyPrice: 2500, body: "sedan" },
];

export const FLEET_TOTAL = FLEET_CARS.length;

/** One orbit clip per model; both fuel variants of a model share it. The
 *  poster is the exact first frame of the encoded loop. */
const carMedia = (car: FleetCar) => car.id.split("-")[0];
export const carVideo = (car: FleetCar) => `/assets/fleet/video/${carMedia(car)}.mp4`;
export const carPoster = (car: FleetCar) => `/assets/fleet/video/${carMedia(car)}.webp`;

export const BODY_LABELS: Record<CarBody, string> = {
  sedan: "Sedan",
  hatchback: "Hatchback",
  ticari: "Ticari",
};
export const formatPrice = (amount: number) =>
  new Intl.NumberFormat("tr-TR", { maximumFractionDigits: 0 }).format(amount) + " TL";
export const carLabel = (car: FleetCar) =>
  [car.name, car.year, car.fuel].filter(Boolean).join(" · ");

export interface Claim {
  icon: "clock" | "pin" | "shield" | "transfer";
  title: string;
  body: string;
}

export const CLAIMS: Claim[] = [
  {
    icon: "clock",
    title: "7/24 havalimanı karşılaması",
    body: "Uçuş kodunuzu alıyoruz. Rötar olursa bekliyoruz; gece yarısı inen uçak da karşılanıyor.",
  },
  {
    icon: "pin",
    title: "Otelinize teslim",
    body: "Belek, Kundu, Lara, Side ve Kemer bölgelerinde aracı bulunduğunuz yere getiriyoruz.",
  },
  {
    icon: "shield",
    title: "Filonun tamamı sigortalı",
    body: "Her araç sigorta kapsamında teslim edilir; ek güvence paketleri talep üzerine eklenir.",
  },
  {
    icon: "transfer",
    title: "Transfer de yapıyoruz",
    body: "Araç kiralamak istemeyen misafirler için şoförlü havalimanı ve otel transferi.",
  },
];

export interface RouteItem {
  name: string;
  note: string;
  time: string;
}

export const ROUTES: RouteItem[] = [
  { name: "Belek", note: "Golf sahaları ve çam ormanı", time: "~35 dk" },
  { name: "Side", note: "Antik tiyatro ve Apollon Tapınağı", time: "~55 dk" },
  { name: "Kemer", note: "Toros etekleri, koylar", time: "~60 dk" },
  { name: "Olympos", note: "Yanartaş ve kıyı patikaları", time: "~1 sa 30 dk" },
  { name: "Kaş", note: "Dalış ve Likya kıyısı", time: "~3 sa" },
];

export interface Step {
  no: string;
  title: string;
  body: string;
}

export const STEPS: Step[] = [
  {
    no: "01",
    title: "Aracı ve tarihleri seçin",
    body: "Alış ve iade noktası, tarih ve saat, ardından araç. Tahmini toplam tutarı anında görürsünüz; ön ödeme alınmaz.",
  },
  {
    no: "02",
    title: "Onayınızı alın",
    body: "Talebiniz rezervasyon numarasıyla bize ulaşır. Uygunluğu ve kesin tutarı telefon ya da WhatsApp üzerinden teyit ederiz.",
  },
  {
    no: "03",
    title: "Anahtarı teslim alın",
    body: "Havalimanı çıkışında ya da otelinizin önünde karşılıyoruz. Evrak işi araç başında biter.",
  },
];

export interface Faq {
  q: string;
  a: string;
}

export const FAQS: Faq[] = [
  {
    q: "Online rezervasyonum nasıl onaylanıyor?",
    a: "Formu gönderdiğiniz anda talebiniz bir rezervasyon numarasıyla bize iletilir ve özeti e-posta adresinize gönderilir. Aracın uygunluğunu ve kesin tutarı telefon veya WhatsApp üzerinden teyit ettiğimizde rezervasyonunuz kesinleşir.",
  },
  {
    q: "Aracı Antalya Havalimanı'nda teslim alabilir miyim?",
    a: "Evet. İç ve dış hatlar çıkışında 7/24 karşılama yapıyoruz. Rezervasyon sırasında uçuş kodunuzu bildirmeniz yeterli; uçuş takip edilir ve rötar durumunda beklenir.",
  },
  {
    q: "Kiralama için hangi belgeler gerekiyor?",
    a: "Geçerli bir sürücü belgesi, kimlik ya da pasaport ve sürücü adına düzenlenmiş kredi kartı. Yurt dışından gelen misafirlerden ülkesine göre uluslararası sürücü belgesi istenebilir.",
  },
  {
    q: "Depozito alıyor musunuz?",
    a: "Araç sınıfına göre değişen bir tutar kredi kartından provizyon olarak bloke edilir, tahsil edilmez. Araç eksiksiz teslim edildiğinde blokaj çözülür.",
  },
  {
    q: "Kilometre sınırı var mı?",
    a: "Günlük kiralamalarda standart bir kilometre limiti uygulanır. Kaş, Pamukkale gibi uzun rotalar planlıyorsanız sınırsız kilometre paketini rezervasyon sırasında ekleyebilirsiniz.",
  },
  {
    q: "Aracı başka bir noktada bırakabilir miyim?",
    a: "Belek, Kundu, Lara, Side ve Kemer bölgelerinde farklı noktaya bırakma mümkün. Bölge dışı iadeler için önceden bilgi vermeniz gerekiyor.",
  },
  {
    q: "Şoförlü kiralama veya transfer yapıyor musunuz?",
    a: "Evet. Tecrübeli şoförlerle şoförlü kiralama ve havalimanı ve otel transferi sunuyoruz. Grup büyüklüğünü belirtmeniz yeterli.",
  },
];

/* ── Reservation ─────────────────────────────────────────────────── */

/** Reservation requests are delivered to this inbox. */
export const BOOKING_EMAIL = "Mekanantalya@hotmail.com";
/** FormSubmit relays a JSON post from the static site to the inbox above.
 *  The very first submission sends an "Activate Form" mail to that inbox;
 *  requests are delivered once it has been confirmed. */
export const BOOKING_ENDPOINT = `https://formsubmit.co/ajax/${BOOKING_EMAIL}`;

export const LOCATIONS = [
  "Antalya Havalimanı (AYT)",
  "Antalya şehir merkezi",
  "Lara / Kundu",
  "Belek",
  "Side",
  "Kemer",
];

export interface Extra {
  id: string;
  label: string;
  note: string;
}

export const EXTRAS: Extra[] = [
  { id: "cocuk-koltugu", label: "Çocuk koltuğu", note: "Yaş grubunu not alanına yazın" },
  { id: "ek-surucu", label: "Ek sürücü", note: "Belgeleri teslimde istenir" },
  { id: "sinirsiz-km", label: "Sınırsız km paketi", note: "Uzun rotalar için" },
  { id: "ek-guvence", label: "Ek güvence paketi", note: "Kapsam onayda iletilir" },
];

/** Half-hour slots for pick-up and return. */
export const TIME_SLOTS = Array.from({ length: 48 }, (_, i) => {
  const h = String(Math.floor(i / 2)).padStart(2, "0");
  return `${h}:${i % 2 ? "30" : "00"}`;
});

/** Whole rental days between two local date-times, minimum one. A short
 *  grace hour keeps a 10:00 → 10:30 return from billing an extra day. */
export function rentalDays(start: Date, end: Date) {
  const hours = (end.getTime() - start.getTime()) / 3_600_000;
  if (!Number.isFinite(hours) || hours <= 0) return 0;
  return Math.max(1, Math.ceil((hours - 1) / 24));
}

/** Local calendar date as YYYY-MM-DD (what <input type="date"> speaks). */
export const isoDay = (date: Date) =>
  new Date(date.getTime() - date.getTimezoneOffset() * 60_000).toISOString().slice(0, 10);

export const isoToday = () => isoDay(new Date());

export const formatDay = (value: string) =>
  value
    ? new Intl.DateTimeFormat("tr-TR", { day: "numeric", month: "long", weekday: "short" }).format(
        new Date(`${value}T12:00:00`),
      )
    : "";
