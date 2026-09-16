/** Content for the Pilot Rent a Car site. Fleet and prices mirror the
 *  client's current listing; contact details are their live ones. */

export const PILOT_PHONE_DISPLAY = "0552 942 10 11";
export const PILOT_PHONE_TEL = "+905529421011";
export const PILOT_WHATSAPP = "https://api.whatsapp.com/send?phone=905529421011";
export const PILOT_MAP = "https://maps.app.goo.gl/jKcofqjffFfbHt3BA";

export interface FleetCar {
  id: string;
  name: string;
  fuel: string;
  /** True only for user-requested, unverified fuel assumptions. */
  fuelAssumed?: boolean;
  year: number;
  dailyPrice: number;
}

export const FLEET_CARS: FleetCar[] = [
  { id: "egea-dizel", name: "Fiat Egea", fuel: "Dizel", year: 2022, dailyPrice: 2200 },
  { id: "egea-benzin", name: "Fiat Egea", fuel: "Benzinli", year: 2022, dailyPrice: 2000 },
  { id: "fiorino-dizel", name: "Fiat Fiorino", fuel: "Dizel", year: 2023, dailyPrice: 2000 },
  { id: "fiorino-benzin", name: "Fiat Fiorino", fuel: "Benzinli", year: 2021, dailyPrice: 2000 },
  { id: "clio", name: "Renault Clio", fuel: "Benzinli", year: 2024, dailyPrice: 2500 },
  { id: "taliant", name: "Renault Taliant", fuel: "Benzinli", year: 2021, dailyPrice: 2500 },
  { id: "passat", name: "Volkswagen Passat", fuel: "Benzinli", year: 2022, dailyPrice: 4500 },
  { id: "symbol", name: "Renault Symbol", fuel: "Benzinli", year: 2021, dailyPrice: 2000 },
  { id: "logan", name: "Dacia Logan", fuel: "Dizel", fuelAssumed: true, year: 2017, dailyPrice: 2300 },
  { id: "courier", name: "Ford Courier", fuel: "Benzin / dizel", year: 2023, dailyPrice: 2000 },
  { id: "i20", name: "Hyundai i20", fuel: "Benzinli", fuelAssumed: true, year: 2020, dailyPrice: 2500 },
  { id: "i10", name: "Hyundai i10", fuel: "Benzinli", fuelAssumed: true, year: 2015, dailyPrice: 2000 },
  { id: "megane", name: "Renault Megane", fuel: "Dizel", fuelAssumed: true, year: 2020, dailyPrice: 2500 },
  { id: "focus", name: "Ford Focus", fuel: "Dizel", fuelAssumed: true, year: 2020, dailyPrice: 2500 },
];

export const FLEET_TOTAL = FLEET_CARS.length;
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
    title: "Tarih ve araç seçin",
    body: "Alış tarihini, iade tarihini ve hangi aracı istediğinizi belirtin. Rezervasyon için ön ödeme almıyoruz.",
  },
  {
    no: "02",
    title: "WhatsApp'tan onaylayın",
    body: "Uygunluğu ve toplam tutarı yazılı olarak dönüyoruz. Onayınız gelince araç adınıza ayrılır.",
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
