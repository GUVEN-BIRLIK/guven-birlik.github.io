'use strict';
/* GÜVEN BİRLİK — UI, i18n, live HUD panels. The WebGL globe lives in globe.js. */

const EMAIL = 'guvenbirlikicvedisticaret@gmail.com';
const RAD = Math.PI / 180;
const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ---------- Reference points (illustrative directions, not shipment tracking) ---------- */
const ORIGIN = { key: 'origin', code: 'IST', city: 'İSTANBUL', coord: [28.9784, 41.0082], tz: 'Europe/Istanbul' };
const HUBS = [
  { key: 'europe',     code: 'BER', city: 'BERLIN',   coord: [13.405, 52.52],    tz: 'Europe/Berlin' },
  { key: 'cis',        code: 'MOW', city: 'MOSCOW',   coord: [37.6173, 55.7558], tz: 'Europe/Moscow' },
  { key: 'middleEast', code: 'DXB', city: 'DUBAI',    coord: [55.2708, 25.2048], tz: 'Asia/Dubai' },
  { key: 'asia',       code: 'SHA', city: 'SHANGHAI', coord: [121.4737, 31.2304], tz: 'Asia/Shanghai' },
  { key: 'africa',     code: 'LOS', city: 'LAGOS',    coord: [3.3792, 6.5244],   tz: 'Africa/Lagos' }
];
const hubByKey = Object.fromEntries(HUBS.map(h => [h.key, h]));

function haversineKm([lon1, lat1], [lon2, lat2]) {
  const dLat = (lat2 - lat1) * RAD, dLon = (lon2 - lon1) * RAD;
  const a = Math.sin(dLat / 2) ** 2 + Math.cos(lat1 * RAD) * Math.cos(lat2 * RAD) * Math.sin(dLon / 2) ** 2;
  return 6371 * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}
HUBS.forEach(h => { h.km = Math.round(haversineKm(ORIGIN.coord, h.coord) / 10) * 10; });
const MAX_KM = Math.max(...HUBS.map(h => h.km));

/* ---------- Translations ---------- */
// Russian is the document's source language: it is collected from the markup, then extended.
const ru = {};
document.querySelectorAll('[data-i18n]').forEach(el => { ru[el.dataset.i18n] = el.innerHTML; });
document.querySelectorAll('[data-i18n-ph]').forEach(el => { ru[el.dataset.i18nPh] = el.placeholder; });
document.querySelectorAll('[data-i18n-aria]').forEach(el => { ru[el.dataset.i18nAria] = el.getAttribute('aria-label'); });
document.querySelectorAll('[data-i18n-alt]').forEach(el => { ru[el.dataset.i18nAlt] = el.alt; });
Object.assign(ru, {
  navigation: 'Навигация', menu: 'Меню', regions: 'Торговые направления',
  globeAria: 'Интерактивный 3D-глобус. Вращайте мышью, пальцем или стрелками. Плюс и минус меняют масштаб.',
  zoomIn: 'Приблизить', zoomOut: 'Отдалить', reset: 'Вернуть Стамбул в центр', pause: 'Остановить вращение', resume: 'Включить вращение',
  europe: 'Европа', cis: 'СНГ', middleEast: 'Ближний Восток', asia: 'Азия', africa: 'Африка',
  regionEurope: 'Европейское направление: обсудим ваш запрос на торговлю между Турцией и европейскими рынками.',
  regionCis: 'Направление СНГ: расскажите о товарах и рынках, которые вас интересуют, — обсудим формат сотрудничества.',
  regionMiddleEast: 'Ближневосточное направление: обсудим возможности поставок и делового сотрудничества.',
  regionAsia: 'Азиатское направление: расскажите о потребностях в закупках или выходе на рынки Азии.',
  regionAfrica: 'Африканское направление: обсудим ваш запрос и возможные пути торгового взаимодействия.',
  day: 'ДЕНЬ', night: 'НОЧЬ', hours: 'ч',
  deltaAhead: 'на {n} ч впереди Стамбула', deltaBehind: 'на {n} ч позади Стамбула', deltaSame: 'то же время, что в Стамбуле',
  distAria: 'Расстояние по дуге большого круга от Стамбула до ориентиров направлений',
  dayAria: 'Высота солнца в течение суток и общие рабочие часы со Стамбулом',
  copied: 'Скопировано', copyFail: 'Скопируйте вручную',
  errName: 'Укажите, как к вам обращаться.', errEmail: 'Проверьте адрес электронной почты.', errMessage: 'Опишите запрос — хотя бы 10 символов.',
  mailReady: 'Письмо подготовлено. Отправьте его в открывшемся почтовом сервисе. Если он не открылся, напишите на email слева.',
  subject: 'Торговый запрос', messageName: 'Имя', messageCompany: 'Компания', messageEmail: 'Email', messageInterest: 'Направление', messageBody: 'Запрос',
  metaDescription: 'GÜVEN BİRLİK — импорт, экспорт и международное торговое сотрудничество. Стамбул, Турция.'
});

const en = {
  skip: 'Skip to content', navigation: 'Navigation', menu: 'Menu',
  navAbout: 'About', navServices: 'Solutions', navNetwork: 'Our reach', navProcess: 'How we work', navContact: 'Contact', discuss: 'Discuss a project',
  consoleTitle: 'GLOBAL TRADE NETWORK',
  heroEyebrow: 'FROM ISTANBUL TO THE WORLD', heroLine1: 'A closer world.', heroLine2: 'A wider vision.',
  heroDescription: 'Connecting markets, people and possibilities. Import and export with your business at the centre.',
  startProject: 'Start a conversation', ourSolutions: 'Our solutions', originCaption: 'At the crossroads of global trade',
  globeAria: 'Interactive 3D globe. Drag or use arrow keys to rotate. Use plus and minus to zoom.',
  rotateHint: 'DRAG TO ROTATE', zoomIn: 'Zoom in', zoomOut: 'Zoom out', reset: 'Centre on Istanbul', pause: 'Pause rotation', resume: 'Start rotation',
  routesTitle: 'DIRECTIONS', regions: 'Trade regions', gaugeTitle: 'LOCAL TIME',
  distTitle: 'DISTANCE FROM ISTANBUL', dayTitle: 'DAY AT DESTINATION', legendSun: 'sun elevation', legendOverlap: 'shared business hours with Istanbul',
  clocksTitle: 'WORLD TIME',
  consoleNote: 'Routes illustrate trade directions; this is not shipment tracking. Time, distances and the sun’s position are calculated live.',
  europe: 'Europe', cis: 'CIS', middleEast: 'Middle East', asia: 'Asia', africa: 'Africa',
  regionEurope: 'European direction: discuss your trade enquiry between Türkiye and European markets.',
  regionCis: 'CIS direction: tell us which products and markets interest you, and we’ll discuss how to work together.',
  regionMiddleEast: 'Middle Eastern direction: discuss supply opportunities and business cooperation.',
  regionAsia: 'Asian direction: share your sourcing needs or your plans to reach markets in Asia.',
  regionAfrica: 'African direction: let’s discuss your enquiry and possible routes for trade cooperation.',
  day: 'DAY', night: 'NIGHT', hours: 'h',
  deltaAhead: '{n} h ahead of Istanbul', deltaBehind: '{n} h behind Istanbul', deltaSame: 'same time as Istanbul',
  distAria: 'Great-circle distance from Istanbul to each direction’s reference city',
  dayAria: 'Sun elevation over the day and shared business hours with Istanbul',
  aboutLabel: 'ABOUT THE COMPANY', aboutTitle: 'Local understanding.<br>Global thinking.',
  aboutText: 'GÜVEN BİRLİK İÇ VE DIŞ TİCARET ANONİM ŞİRKETİ is an Istanbul-based company focused on domestic and international trade. We help build business connections between Türkiye and overseas markets.',
  aboutText2: 'Every project starts with understanding your needs: what to supply, where from, where to and on what terms. These details shape a solution for your business.',
  pillar1Title: 'Trust', pillar1Text: 'GÜVEN is Turkish for “trust”. It is the principle we start every conversation with.',
  pillar2Title: 'A bridge between markets', pillar2Text: 'Istanbul connects Europe and Asia, a convenient point for dialogue with very different markets.',
  pillar3Title: 'A personal approach', pillar3Text: 'A solution shaped around your task, not a template. A clear contact and clear next steps.',
  aboutSignature: 'TRUST IS THE FOUNDATION OF PARTNERSHIP',
  solutionsLabel: 'TRADE SOLUTIONS', solutionsTitle: 'Your business.<br>Beyond borders.',
  solutionsIntro: 'From your first enquiry to an agreed supply plan, we help define a clear path for your project.',
  importTitle: 'Import', importText: 'Explore new sourcing opportunities. Let’s discuss the product, requirements and supply terms for your market.', importCta: 'Discuss import',
  exportTitle: 'Export', exportText: 'Give your product an international perspective. Define your target market and the right form of trade cooperation.', exportCta: 'Discuss export',
  partnerTitle: 'Trade connections', partnerText: 'Connect your business needs with market opportunities. Start a conversation about sourcing and partnership.', partnerCta: 'Find a solution',
  portAlt: 'Container ship and port cranes',
  networkLabel: 'AN INTERNATIONAL PERSPECTIVE', networkTitle: 'Türkiye at the centre.<br>Opportunity everywhere.',
  networkText: 'Istanbul connects Europe and Asia. It is a starting point for conversations with new markets and the next chapter of your business.',
  networkFootnote: 'Destinations and supply terms are discussed individually for each project.',
  processLabel: 'A CLEAR PATH TO PARTNERSHIP', processTitle: 'From enquiry to a solution.', letsStart: 'Let’s start with a conversation',
  step1Title: 'Tell us what you need', step1Text: 'Share your product, quantity, destination and preferred timeline.',
  step2Title: 'Explore the details', step2Text: 'We clarify your requirements and discuss a suitable way to work together.',
  step3Title: 'Agree on the next step', step3Text: 'Define the terms, the action plan and your point of contact for the project.',
  contactLabel: 'LET’S START A CONVERSATION', contactLine1: 'Your next market', contactLine2: 'starts with', contactLine3: 'a connection.',
  copy: 'Copy', copied: 'Copied', copyFail: 'Copy manually',
  office: 'OFFICE / İSTANBUL', map: 'View on map', formHead: 'INQUIRY / TALEP', formTitle: 'Tell us about your project',
  nameLabel: 'Your name', namePlaceholder: 'How should we address you?', companyLabel: 'Company', companyPlaceholder: 'Company name',
  interestLabel: 'What are you interested in?', other: 'Other enquiry', messageLabel: 'Your enquiry', messagePlaceholder: 'Product, quantity, destination and timing…',
  formNote: 'This button opens your email app with a prepared message. Send the email to get in touch with us.', send: 'Prepare enquiry',
  errName: 'Please tell us how to address you.', errEmail: 'Please check your email address.', errMessage: 'Please describe your enquiry (at least 10 characters).',
  mailReady: 'Your email is ready. Send it in your email app. If it did not open, write to the email address on the left.',
  subject: 'Trade enquiry', messageName: 'Name', messageCompany: 'Company', messageEmail: 'Email', messageInterest: 'Interest', messageBody: 'Enquiry',
  backTop: 'Back to top', rights: 'All rights reserved.',
  metaDescription: 'GÜVEN BİRLİK — import, export and international trade cooperation. Istanbul, Türkiye.'
};

const tr = {
  skip: 'İçeriğe geç', navigation: 'Gezinme', menu: 'Menü',
  navAbout: 'Hakkımızda', navServices: 'Çözümler', navNetwork: 'Coğrafya', navProcess: 'Nasıl çalışırız', navContact: 'İletişim', discuss: 'Projenizi konuşalım',
  consoleTitle: 'KÜRESEL TİCARET AĞI',
  heroEyebrow: 'İSTANBUL’DAN DÜNYAYA', heroLine1: 'Dünya daha yakın.', heroLine2: 'Ufkunuz daha geniş.',
  heroDescription: 'Pazarları, insanları ve fırsatları bir araya getiriyoruz. İşletmenize odaklanan ithalat ve ihracat çözümleri.',
  startProject: 'İş birliğine başlayalım', ourSolutions: 'Çözümlerimiz', originCaption: 'Küresel ticaret yollarının kesişiminde',
  globeAria: 'Etkileşimli 3B dünya. Döndürmek için sürükleyin veya ok tuşlarını kullanın. Yakınlaştırmak için artı ve eksi tuşlarını kullanın.',
  rotateHint: 'DÖNDÜRMEK İÇİN SÜRÜKLEYİN', zoomIn: 'Yakınlaştır', zoomOut: 'Uzaklaştır', reset: 'İstanbul’u merkeze al', pause: 'Döndürmeyi durdur', resume: 'Döndürmeyi başlat',
  routesTitle: 'YÖNLER', regions: 'Ticaret bölgeleri', gaugeTitle: 'YEREL SAAT',
  distTitle: 'İSTANBUL’A UZAKLIK', dayTitle: 'VARIŞ NOKTASINDA GÜN', legendSun: 'güneş yüksekliği', legendOverlap: 'İstanbul ile ortak mesai saatleri',
  clocksTitle: 'DÜNYA SAATİ',
  consoleNote: 'Rotalar ticaret yönlerini gösteren bir illüstrasyondur, yük takibi değildir. Saat, mesafe ve güneşin konumu anlık hesaplanır.',
  europe: 'Avrupa', cis: 'BDT', middleEast: 'Orta Doğu', asia: 'Asya', africa: 'Afrika',
  regionEurope: 'Avrupa yönü: Türkiye ve Avrupa pazarları arasındaki ticaret talebinizi görüşelim.',
  regionCis: 'BDT yönü: ilgilendiğiniz ürünleri ve pazarları anlatın, iş birliği biçimini birlikte konuşalım.',
  regionMiddleEast: 'Orta Doğu yönü: tedarik fırsatlarını ve ticari iş birliğini konuşalım.',
  regionAsia: 'Asya yönü: tedarik ihtiyacınızı veya Asya pazarlarına açılma planınızı paylaşın.',
  regionAfrica: 'Afrika yönü: talebinizi ve olası ticari iş birliği yollarını görüşelim.',
  day: 'GÜNDÜZ', night: 'GECE', hours: 'sa',
  deltaAhead: 'İstanbul’dan {n} sa ileride', deltaBehind: 'İstanbul’dan {n} sa geride', deltaSame: 'İstanbul ile aynı saat',
  distAria: 'İstanbul’dan her yönün referans şehrine büyük daire mesafesi',
  dayAria: 'Gün boyunca güneş yüksekliği ve İstanbul ile ortak mesai saatleri',
  aboutLabel: 'HAKKIMIZDA', aboutTitle: 'Yerel bakış.<br>Küresel düşünce.',
  aboutText: 'GÜVEN BİRLİK İÇ VE DIŞ TİCARET ANONİM ŞİRKETİ, İstanbul merkezli, iç ve dış ticarete odaklanan bir şirkettir. Türkiye ile yurt dışı pazarlar arasında iş bağlantıları kurulmasına yardımcı oluyoruz.',
  aboutText2: 'Her proje ihtiyacınızı anlamakla başlar: hangi ürün, nereden, nereye ve hangi koşullarla? İşletmeniz için çözümü bu ayrıntılar şekillendirir.',
  pillar1Title: 'Güven', pillar1Text: 'Adımız bir ilkedir: her görüşmeye güvenle başlarız.',
  pillar2Title: 'Pazarlar arasında köprü', pillar2Text: 'İstanbul Avrupa ile Asya’yı birleştirir; çok farklı pazarlarla diyalog için elverişli bir nokta.',
  pillar3Title: 'Size özel yaklaşım', pillar3Text: 'Şablon değil, işinize göre şekillenen bir çözüm. Net bir muhatap ve net sonraki adımlar.',
  aboutSignature: 'İŞ BİRLİĞİNİN TEMELİ GÜVENDİR',
  solutionsLabel: 'TİCARET ÇÖZÜMLERİ', solutionsTitle: 'İşletmeniz için<br>sınırların ötesinde.',
  solutionsIntro: 'İlk talepten mutabık kalınan tedarik planına kadar projeniz için anlaşılır bir yol oluşturalım.',
  importTitle: 'İthalat', importText: 'Yeni satın alma fırsatlarını keşfedin. Pazarınıza yönelik ürün, gereksinim ve tedarik koşullarını konuşalım.', importCta: 'İthalatı görüşelim',
  exportTitle: 'İhracat', exportText: 'Ürününüze uluslararası bir perspektif kazandırın. Hedef pazarı ve ticari iş birliği biçimini birlikte belirleyelim.', exportCta: 'İhracatı görüşelim',
  partnerTitle: 'Ticari bağlantılar', partnerText: 'İhtiyaçlarınız ile pazarın sunduğu fırsatları buluşturalım. Tedarik ve iş ortaklığı için diyaloğa başlayın.', partnerCta: 'Çözüm bulalım',
  portAlt: 'Konteyner gemisi ve liman vinçleri',
  networkLabel: 'ULUSLARARASI BAKIŞ', networkTitle: 'Merkezde Türkiye.<br>Her yerde fırsat.',
  networkText: 'İstanbul, Avrupa ile Asya’yı birbirine bağlar. Yeni pazarlarla diyaloğunuz ve işletmenizin sonraki adımı buradan başlar.',
  networkFootnote: 'Her projenin teslimat bölgesi ve koşulları ayrıca görüşülür.',
  processLabel: 'İŞ BİRLİĞİNE GİDEN AÇIK BİR YOL', processTitle: 'Talepten çözüme.', letsStart: 'Bir görüşmeyle başlayalım',
  step1Title: 'İhtiyacınızı anlatın', step1Text: 'Ürün, miktar, hedef bölge ve planladığınız zamanı paylaşın.',
  step2Title: 'Ayrıntıları konuşalım', step2Text: 'Gereksinimleri netleştirelim ve uygun iş birliği biçimini değerlendirelim.',
  step3Title: 'Sonraki adımı belirleyelim', step3Text: 'Koşulları, ilerleme planını ve proje için iletişim kişisini belirleyelim.',
  contactLabel: 'DİYALOĞA BAŞLAYALIM', contactLine1: 'Bir sonraki', contactLine2: 'pazarınız bir', contactLine3: 'iletişimle başlar.',
  copy: 'Kopyala', copied: 'Kopyalandı', copyFail: 'Elle kopyalayın',
  office: 'OFİS / İSTANBUL', map: 'Haritada görüntüle', formHead: 'TALEP / INQUIRY', formTitle: 'Projenizden bahsedin',
  nameLabel: 'Adınız', namePlaceholder: 'Size nasıl hitap edelim?', companyLabel: 'Şirket', companyPlaceholder: 'Şirket adı',
  interestLabel: 'Hangi konuda görüşmek istersiniz?', other: 'Diğer', messageLabel: 'Talebiniz', messagePlaceholder: 'Ürün, miktar, hedef bölge ve zamanlama…',
  formNote: 'Bu düğme, hazırlanan mesajı e-posta uygulamanızda açar. Bizimle iletişime geçmek için e-postayı gönderin.', send: 'Talebi hazırla',
  errName: 'Lütfen size nasıl hitap edeceğimizi yazın.', errEmail: 'Lütfen e-posta adresinizi kontrol edin.', errMessage: 'Lütfen talebinizi açıklayın (en az 10 karakter).',
  mailReady: 'E-postanız hazır. Açılan e-posta uygulamasından gönderin. Uygulama açılmadıysa soldaki adrese yazabilirsiniz.',
  subject: 'Ticari talep', messageName: 'Ad', messageCompany: 'Şirket', messageEmail: 'E-posta', messageInterest: 'Konu', messageBody: 'Talep',
  backTop: 'Yukarı', rights: 'Tüm hakları saklıdır.',
  metaDescription: 'GÜVEN BİRLİK — ithalat, ihracat ve uluslararası ticari iş birliği. İstanbul, Türkiye.'
};

const translations = { ru, en, tr };
const locales = { ru: 'ru-RU', en: 'en-GB', tr: 'tr-TR' };
let language = 'ru';
const t = key => translations[language][key] ?? ru[key] ?? key;

/* ---------- Shared state for globe.js ---------- */
const GB = window.GB = {
  origin: ORIGIN, hubs: HUBS, region: 'europe', reducedMotion,
  events: new EventTarget(), t, get lang() { return language; },
  sunPosition, // used by the globe for the live day/night terminator
  emit(type, detail) { this.events.dispatchEvent(new CustomEvent(type, { detail })); }
};

/* ---------- Time & sun helpers ---------- */
const dtfCache = new Map();
function dtf(tz, opts) {
  const key = tz + JSON.stringify(opts);
  if (!dtfCache.has(key)) dtfCache.set(key, new Intl.DateTimeFormat('en-GB', { timeZone: tz, hourCycle: 'h23', ...opts }));
  return dtfCache.get(key);
}
function tzOffsetMin(tz, date = new Date()) {
  const p = Object.fromEntries(dtf(tz, { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit' })
    .formatToParts(date).map(x => [x.type, x.value]));
  const asUTC = Date.UTC(+p.year, +p.month - 1, +p.day, +p.hour % 24, +p.minute, +p.second);
  return Math.round((asUTC - date.getTime()) / 60000);
}
const timeIn = (tz, date = new Date(), seconds = false) =>
  dtf(tz, seconds ? { hour: '2-digit', minute: '2-digit', second: '2-digit' } : { hour: '2-digit', minute: '2-digit' }).format(date);
const utcLabel = min => { const h = min / 60; return 'UTC' + (h >= 0 ? '+' : '−') + (Number.isInteger(Math.abs(h)) ? Math.abs(h) : Math.abs(h).toFixed(1)); };

function declination(date) {
  const start = Date.UTC(date.getUTCFullYear(), 0, 0);
  const day = (date.getTime() - start) / 864e5;
  return -23.44 * Math.cos(2 * Math.PI / 365 * (day + 10));
}
/** Sub-solar point [lon, lat] in degrees (equation of time ignored, ~±4 min). */
function sunPosition(date = new Date()) {
  const utcH = date.getUTCHours() + date.getUTCMinutes() / 60 + date.getUTCSeconds() / 3600;
  let lon = (12 - utcH) * 15;
  lon = ((lon + 540) % 360) - 180;
  return [lon, declination(date)];
}
function sunElevation([lon, lat], date) {
  const [sLon, decl] = sunPosition(date);
  const H = (lon - sLon) * RAD, p = lat * RAD, d = decl * RAD;
  return Math.asin(Math.sin(p) * Math.sin(d) + Math.cos(p) * Math.cos(d) * Math.cos(H)) / RAD;
}

/* ---------- i18n application ---------- */
const $ = (s, root = document) => root.querySelector(s);
const $$ = (s, root = document) => [...root.querySelectorAll(s)];

function setLanguage(lang) {
  if (!translations[lang]) return;
  language = lang;
  document.documentElement.lang = lang;
  $$('[data-i18n]').forEach(el => { const v = t(el.dataset.i18n); if (v !== undefined) el.innerHTML = v; });
  $$('[data-i18n-ph]').forEach(el => { el.placeholder = t(el.dataset.i18nPh); });
  $$('[data-i18n-aria]').forEach(el => { el.setAttribute('aria-label', t(el.dataset.i18nAria)); });
  $$('[data-i18n-alt]').forEach(el => { el.alt = t(el.dataset.i18nAlt); });
  $$('[data-lang]').forEach(el => { const on = el.dataset.lang === lang; el.classList.toggle('active', on); el.setAttribute('aria-pressed', on); });
  $('meta[name="description"]').content = t('metaDescription');
  $('#form-status').textContent = '';
  try { localStorage.setItem('gb-language', lang); } catch { /* storage unavailable */ }
  renderRegionLists();
  renderAll();
  GB.emit('lang', lang);
}

/* ---------- Region selectors (hero list + network section) ---------- */
const regionDescKey = { europe: 'regionEurope', cis: 'regionCis', middleEast: 'regionMiddleEast', asia: 'regionAsia', africa: 'regionAfrica' };
const fmtKm = km => new Intl.NumberFormat(locales[language]).format(km);

function renderRegionLists() {
  $('#route-list').innerHTML = HUBS.map((h, i) => `
    <button type="button" class="route" data-region="${h.key}" aria-pressed="false">
      <span class="r-idx">0${i + 1}</span><span class="r-name">${t(h.key)}</span><span class="r-code">${h.code}</span>
      <span class="r-km">≈${fmtKm(h.km)} km</span><span class="r-bar"><i style="width:${(h.km / MAX_KM * 100).toFixed(1)}%"></i></span>
    </button>`).join('');
  $('#region-options').innerHTML = HUBS.map((h, i) => `
    <button type="button" class="region" data-region="${h.key}" aria-pressed="false">
      <span class="region-idx">0${i + 1}</span><span class="region-name">${t(h.key)}</span><span class="region-code">${h.code} · ≈${fmtKm(h.km)} km</span><span class="region-arrow" aria-hidden="true">↗</span>
    </button>`).join('');
  $$('[data-region]').forEach(btn => btn.addEventListener('click', () => setRegion(btn.dataset.region)));
  markRegion();
}
function markRegion() {
  $$('[data-region]').forEach(el => { const on = el.dataset.region === GB.region; el.classList.toggle('active', on); el.setAttribute('aria-pressed', on); });
}
function setRegion(key) {
  if (!hubByKey[key]) return;
  GB.region = key;
  markRegion();
  renderAll();
  GB.emit('region', key);
}

/* ---------- Charts & panels ---------- */
const svgNS = 'http://www.w3.org/2000/svg';
const GLOW = p => `<defs>
  <filter id="${p}neon" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="2.4" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
  <linearGradient id="${p}barHot" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#7aa6ff"/><stop offset="1" stop-color="#3f7dff" stop-opacity=".25"/></linearGradient>
  <linearGradient id="${p}barDim" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#3f7dff" stop-opacity=".55"/><stop offset="1" stop-color="#3f7dff" stop-opacity=".06"/></linearGradient>
  <linearGradient id="${p}areaHot" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#3f7dff" stop-opacity=".5"/><stop offset="1" stop-color="#3f7dff" stop-opacity="0"/></linearGradient>
  <pattern id="${p}hatch" width="4" height="4" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><rect width="1.4" height="4" fill="#3f7dff" fill-opacity=".45"/></pattern>
</defs>`;

function renderDistChart() {
  const svg = $('#dist-chart'); const W = 320, H = 150, top = 20, bottom = 22, left = 6, right = 6;
  const plotH = H - top - bottom, slot = (W - left - right) / HUBS.length, bw = Math.min(30, slot * 0.38);
  let out = GLOW('d-');
  [0.25, 0.5, 0.75, 1].forEach(f => { const y = top + plotH * (1 - f); out += `<line class="c-grid" x1="${left}" x2="${W - right}" y1="${y}" y2="${y}"/>`; });
  HUBS.forEach((h, i) => {
    const active = h.key === GB.region; const cx = left + slot * (i + 0.5);
    const bh = Math.max(3, plotH * h.km / MAX_KM); const y = top + plotH - bh;
    // faint "ghost" columns echo the reference look without inventing data
    out += `<rect class="c-ghost" x="${cx - bw / 2 - 6}" y="${top}" width="${bw + 12}" height="${plotH}"/>`;
    out += `<g class="c-bar ${active ? 'on' : ''}" data-key="${h.key}"><rect x="${cx - bw / 2}" y="${y}" width="${bw}" height="${bh}" fill="url(#d-${active ? 'barHot' : 'barDim'})" ${active ? 'filter="url(#d-neon)"' : ''}/>`;
    out += `<rect x="${cx - bw / 2}" y="${y}" width="${bw}" height="1.6" class="c-cap"/>`;
    out += `<text class="c-val" x="${cx}" y="${y - 6}" text-anchor="middle">${fmtKm(h.km)}</text>`;
    out += `<text class="c-lbl" x="${cx}" y="${H - 7}" text-anchor="middle">${h.code}</text></g>`;
  });
  out += `<line class="c-axis" x1="${left}" x2="${W - right}" y1="${top + plotH}" y2="${top + plotH}"/>`;
  svg.innerHTML = out;
  svg.setAttribute('aria-label', t('distAria') + ': ' + HUBS.map(h => `${t(h.key)} ${h.code} ≈${fmtKm(h.km)} km`).join(', '));
  $$('.c-bar', svg).forEach(g => g.addEventListener('click', () => setRegion(g.dataset.key)));
}

function renderDayChart() {
  const svg = $('#day-chart'); const hub = hubByKey[GB.region]; const now = new Date();
  const W = 320, H = 150, top = 10, bottom = 20, left = 4, right = 4, plotW = W - left - right, plotH = H - top - bottom;
  const off = tzOffsetMin(hub.tz, now), offIst = tzOffsetMin(ORIGIN.tz, now);
  const x = h => left + plotW * h / 24, y = e => top + plotH * (1 - (e + 75) / 160);
  const localMid = Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()) - off * 60000;
  const pts = [];
  for (let i = 0; i <= 96; i++) { const h = i / 4; pts.push([x(h), y(sunElevation(hub.coord, new Date(localMid + h * 3600000)))]); }
  const line = pts.map((p, i) => (i ? 'L' : 'M') + p[0].toFixed(1) + ' ' + p[1].toFixed(1)).join('');
  const y0 = y(0);
  // Business hours 09–18 local at destination and Istanbul's 09–18 expressed in destination time
  const shift = (off - offIst) / 60; const a = Math.max(9, 9 + shift), b = Math.min(18, 18 + shift); const overlap = Math.max(0, b - a);
  let out = GLOW('s-') + `<clipPath id="s-aboveHorizon"><rect x="0" y="0" width="${W}" height="${y0}"/></clipPath>`;
  [0, 6, 12, 18, 24].forEach(h => { out += `<line class="c-grid" x1="${x(h)}" x2="${x(h)}" y1="${top}" y2="${top + plotH}"/><text class="c-lbl" x="${Math.min(W - 10, Math.max(10, x(h)))}" y="${H - 5}" text-anchor="middle">${String(h).padStart(2, '0')}</text>`; });
  out += `<rect class="c-work" x="${x(9)}" y="${top}" width="${x(18) - x(9)}" height="${plotH}"/>`;
  if (overlap > 0) out += `<rect x="${x(a)}" y="${top}" width="${x(b) - x(a)}" height="${plotH}" fill="url(#s-hatch)"/><line class="c-edge" x1="${x(a)}" x2="${x(a)}" y1="${top}" y2="${top + plotH}"/><line class="c-edge" x1="${x(b)}" x2="${x(b)}" y1="${top}" y2="${top + plotH}"/>`;
  out += `<path d="${line}L${x(24)} ${top + plotH}L${x(0)} ${top + plotH}Z" fill="url(#s-areaHot)" clip-path="url(#s-aboveHorizon)"/>`;
  out += `<line class="c-axis" x1="${left}" x2="${W - right}" y1="${y0}" y2="${y0}"/>`;
  out += `<path class="c-line" d="${line}" filter="url(#s-neon)"/>`;
  const nowH = ((now.getTime() - localMid) / 3600000 + 24) % 24; const nowE = sunElevation(hub.coord, now);
  out += `<line class="c-now" x1="${x(nowH)}" x2="${x(nowH)}" y1="${top}" y2="${top + plotH}"/><circle class="c-dot" cx="${x(nowH)}" cy="${y(nowE)}" r="3.2" filter="url(#s-neon)"/>`;
  svg.innerHTML = out;
  $('#day-code').textContent = hub.code;
  $('#overlap-hours').textContent = `${overlap % 1 ? overlap.toFixed(1) : overlap} ${t('hours')}`;
  svg.setAttribute('aria-label', `${t('dayAria')} — ${hub.city}: ${overlap} ${t('hours')}`);
}

function renderClocks() {
  const now = new Date();
  $('#clock-list').innerHTML = [ORIGIN, ...HUBS].map(h => {
    const off = tzOffsetMin(h.tz, now); const day = sunElevation(h.coord, now) > -0.833;
    const active = h.key === GB.region ? ' active' : '', origin = h === ORIGIN ? ' origin' : '';
    return `<li class="clock${active}${origin}"><span class="ck-code">${h.code}</span><span class="ck-city">${h.city}</span><span class="ck-utc">${utcLabel(off)}</span><span class="ck-dn ${day ? 'day' : 'night'}"><i></i>${t(day ? 'day' : 'night')}</span><b class="ck-time">${timeIn(h.tz, now)}</b></li>`;
  }).join('');
}

function renderGauge() {
  const hub = hubByKey[GB.region], now = new Date();
  const [hh, mm] = timeIn(hub.tz, now).split(':').map(Number);
  const C = 2 * Math.PI * 56, frac = (hh * 60 + mm) / 1440;
  $('#gauge-arc').style.strokeDasharray = `${(C * frac).toFixed(1)} ${C.toFixed(1)}`;
  $('#gauge-time').textContent = timeIn(hub.tz, now);
  $('#gauge-city').textContent = hub.city;
  $('#gauge-code').textContent = hub.code;
  const off = tzOffsetMin(hub.tz, now); $('#gauge-utc').textContent = utcLabel(off);
  const d = (off - tzOffsetMin(ORIGIN.tz, now)) / 60;
  $('#gauge-delta').textContent = d === 0 ? t('deltaSame') : t(d > 0 ? 'deltaAhead' : 'deltaBehind').replace('{n}', Math.abs(d));
}

function renderRegionText() {
  const hub = hubByKey[GB.region];
  $('#region-description').textContent = t(regionDescKey[GB.region]);
  $('#photo-target').textContent = `⟶ ${hub.city}`;
}

function renderAll() { renderDistChart(); renderDayChart(); renderClocks(); renderGauge(); renderRegionText(); }

/* ---------- Clock tick ---------- */
let lastMinute = -1;
function tick() {
  const now = new Date();
  $('#utc-clock').textContent = timeIn('UTC', now, true);
  if (now.getUTCMinutes() !== lastMinute) { lastMinute = now.getUTCMinutes(); renderClocks(); renderGauge(); renderDayChart(); }
}

/* ---------- Header, menu, nav highlighting ---------- */
function initChrome() {
  const header = $('#header'), nav = $('#nav'), toggle = $('.menu-toggle');
  const onScroll = () => header.classList.toggle('scrolled', scrollY > 8);
  addEventListener('scroll', onScroll, { passive: true }); onScroll();
  const closeMenu = () => { nav.classList.remove('open'); toggle.setAttribute('aria-expanded', 'false'); document.body.classList.remove('menu-open'); };
  toggle.addEventListener('click', () => { const open = toggle.getAttribute('aria-expanded') !== 'true'; toggle.setAttribute('aria-expanded', open); nav.classList.toggle('open', open); document.body.classList.toggle('menu-open', open); });
  $$('.nav a').forEach(a => a.addEventListener('click', closeMenu));
  addEventListener('keydown', e => { if (e.key === 'Escape') closeMenu(); });
  matchMedia('(min-width: 981px)').addEventListener('change', e => { if (e.matches) closeMenu(); });

  if ('IntersectionObserver' in window) {
    const links = new Map($$('.nav a').map(a => [a.getAttribute('href').slice(1), a]));
    const io = new IntersectionObserver(entries => entries.forEach(en => {
      if (en.isIntersecting) { links.forEach(a => a.classList.remove('current')); links.get(en.target.id)?.classList.add('current'); }
    }), { rootMargin: '-45% 0px -50% 0px' });
    $$('main section[id]').forEach(s => io.observe(s));
  }
}

/* ---------- Reveal on scroll, marquee ---------- */
function initMotion() {
  const items = $$('.reveal');
  items.forEach(el => { const sib = [...el.parentElement.children].filter(c => c.classList.contains('reveal')); el.style.setProperty('--d', `${sib.indexOf(el) * 70}ms`); });
  if (!('IntersectionObserver' in window) || reducedMotion) { items.forEach(el => el.classList.add('in')); }
  else {
    const io = new IntersectionObserver(entries => entries.forEach(en => { if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); } }), { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    items.forEach(el => io.observe(el));
  }
  const track = $('.marquee-track'); if (track) track.innerHTML = track.innerHTML.repeat(4);
}

/* ---------- Contact ---------- */
function initContact() {
  $$('[data-service]').forEach(link => link.addEventListener('click', () => { $('[name="interest"]').value = link.dataset.service; }));
  const copyBtn = $('#copy-email');
  copyBtn.addEventListener('click', async () => {
    let ok = false;
    try { await navigator.clipboard.writeText(EMAIL); ok = true; } catch { /* clipboard blocked */ }
    copyBtn.textContent = t(ok ? 'copied' : 'copyFail'); copyBtn.classList.toggle('done', ok);
    setTimeout(() => { copyBtn.textContent = t('copy'); copyBtn.classList.remove('done'); }, 2200);
  });

  const form = $('#inquiry-form'), status = $('#form-status');
  const fail = (field, key) => { field.setAttribute('aria-invalid', 'true'); status.textContent = t(key); status.classList.add('error'); field.focus(); return false; };
  form.addEventListener('input', e => { if (e.target.matches('[aria-invalid]')) e.target.removeAttribute('aria-invalid'); });
  form.addEventListener('submit', e => {
    e.preventDefault(); status.classList.remove('error');
    const name = form.elements.name, email = form.elements.email, message = form.elements.message;
    $$('[aria-invalid]', form).forEach(f => f.removeAttribute('aria-invalid'));
    if (!name.value.trim()) return fail(name, 'errName');
    if (!email.value.trim() || !email.checkValidity()) return fail(email, 'errEmail');
    if (message.value.trim().length < 10) return fail(message, 'errMessage');
    const data = new FormData(form);
    const interest = { import: t('importTitle'), export: t('exportTitle'), partnership: t('partnerTitle'), other: t('other') }[data.get('interest')];
    const val = k => String(data.get(k) || '').trim();
    const subject = `${t('subject')} — ${interest} — ${val('company') || val('name')}`;
    const body = `${t('messageName')}: ${val('name')}\n${t('messageCompany')}: ${val('company')}\n${t('messageEmail')}: ${val('email')}\n${t('messageInterest')}: ${interest}\n\n${t('messageBody')}:\n${val('message')}`;
    location.href = `mailto:${EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    status.textContent = t('mailReady');
  });
}

/* ---------- Intro splash (shown once per session; CSS hides it on repeat visits) ---------- */
function initIntro() {
  const el = $('#intro');
  if (!el) return;
  if (document.documentElement.classList.contains('intro-seen') || reducedMotion) { el.remove(); return; }
  const start = performance.now(); let closed = false;
  const close = () => {
    if (closed) return; closed = true;
    setTimeout(() => { el.classList.add('done'); setTimeout(() => el.remove(), 800); }, Math.max(0, 1500 - (performance.now() - start)));
  };
  GB.events.addEventListener('globe-ready', close, { once: true });
  setTimeout(close, 2600); // never hold the page hostage to a slow globe
}

/* ---------- Boot ---------- */
$('#year').textContent = new Date().getFullYear();
$$('[data-lang]').forEach(b => b.addEventListener('click', () => setLanguage(b.dataset.lang)));
try { const saved = localStorage.getItem('gb-language'); if (translations[saved]) language = saved; } catch { /* ignore */ }
initIntro();
initChrome();
initMotion();
initContact();
setLanguage(language);
tick(); setInterval(tick, 1000);
// If the WebGL module never boots (very old browser, blocked script), show the static fallback sphere.
setTimeout(() => { if (!GB.globeReady) document.getElementById('globe-stage').classList.add('globe-failed'); }, 9000);

// Brand reel: play only while on screen; reduced-motion visitors get the still poster.
(() => {
  const video = document.querySelector('.brand-reel-video');
  if (!video) return;
  if (reducedMotion) { video.removeAttribute('autoplay'); video.pause(); return; }
  if (!('IntersectionObserver' in window)) return;
  new IntersectionObserver(([entry]) => {
    if (entry.isIntersecting) video.play().catch(() => {}); else video.pause();
  }, { threshold: .15 }).observe(video);
})();
