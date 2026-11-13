'use strict';
/* GÜVEN BİRLİK — UI, i18n, live HUD panels. The WebGL globe lives in globe.js. */

const EMAIL = 'guvenbirlikicvedisticaret@gmail.com';
const RAD = Math.PI / 180;
const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ---------- Reference points (illustrative directions, not shipment tracking) ---------- */
const ORIGIN = { key: 'origin', code: 'IST', city: 'İSTANBUL', coord: [28.9784, 41.0082], tz: 'Europe/Istanbul' };
const HUBS = [
  { key: 'europe',     code: 'BER', city: 'BERLIN',   coord: [13.405, 52.52],    tz: 'Europe/Berlin' },
  { key: 'cis',        code: 'TAS', city: 'TASHKENT', coord: [69.2401, 41.2995], tz: 'Asia/Tashkent' },
  { key: 'middleEast', code: 'DXB', city: 'DUBAI',    coord: [55.2708, 25.2048], tz: 'Asia/Dubai' },
  { key: 'asia',       code: 'SHA', city: 'SHANGHAI', coord: [121.4737, 31.2304], tz: 'Asia/Shanghai' },
  { key: 'africa',     code: 'CAS', city: 'CASABLANCA', coord: [-7.5898, 33.5731], tz: 'Africa/Casablanca' }
];
const hubByKey = Object.fromEntries(HUBS.map(h => [h.key, h]));

function haversineKm([lon1, lat1], [lon2, lat2]) {
  const dLat = (lat2 - lat1) * RAD, dLon = (lon2 - lon1) * RAD;
  const a = Math.sin(dLat / 2) ** 2 + Math.cos(lat1 * RAD) * Math.cos(lat2 * RAD) * Math.sin(dLon / 2) ** 2;
  return 6371 * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}
/** Initial great-circle bearing from a to b, degrees clockwise from true north. */
function bearingDeg([lon1, lat1], [lon2, lat2]) {
  const p1 = lat1 * RAD, p2 = lat2 * RAD, dl = (lon2 - lon1) * RAD;
  const y = Math.sin(dl) * Math.cos(p2), x = Math.cos(p1) * Math.sin(p2) - Math.sin(p1) * Math.cos(p2) * Math.cos(dl);
  return (Math.atan2(y, x) / RAD + 360) % 360;
}
HUBS.forEach(h => { h.km = Math.round(haversineKm(ORIGIN.coord, h.coord) / 10) * 10; h.bearing = Math.round(bearingDeg(ORIGIN.coord, h.coord)); });
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
  europe: 'Европа', cis: 'Центральная Азия', middleEast: 'Ближний Восток', asia: 'Азия', africa: 'Африка',
  regionEurope: 'Европа: Германия, Италия, Польша, Нидерланды, Испания. Закупки в ЕС и сбыт турецких товаров на европейских рынках.',
  regionCis: 'Центральная Азия: Узбекистан, Казахстан, Кыргызстан. Поставки турецких товаров и встречные закупки.',
  regionMiddleEast: 'Персидский залив: ОАЭ, Саудовская Аравия, Катар. Поставки турецких товаров и закупки для ваших проектов в регионе.',
  regionAsia: 'Китай и Юго-Восточная Азия: Китай, Вьетнам, Индия. Проверка поставщика и инспекция партии на месте.',
  regionAfrica: 'Северная Африка: Марокко. Обсудим ваш запрос и подходящий формат торгового сотрудничества.',
  day: 'ДЕНЬ', night: 'НОЧЬ', hours: 'ч',
  wAria: 'Рабочие часы партнёров по времени Стамбула и их пересечение со стамбульским рабочим днём', wWeekend: 'выходной',
  bDraftEmpty: 'Выберите параметры — здесь появится текст запроса.', bFilled: 'Черновик перенесён в форму. Укажите имя и email.',
  stOpen: 'ИДЁТ', stClosed: 'ЗАКОНЧЕН', stWeekend: 'ВЫХОДНОЙ',
  deltaAhead: 'на {n} ч впереди Стамбула', deltaBehind: 'на {n} ч позади Стамбула', deltaSame: 'то же время, что в Стамбуле',
  distAria: 'Расстояние по дуге большого круга от Стамбула до ориентиров направлений',
  dayAria: 'Высота солнца в течение суток и общие рабочие часы со Стамбулом',
  copied: 'Скопировано', copyFail: 'Скопируйте вручную',
  errName: 'Укажите, как к вам обращаться.', errEmail: 'Проверьте адрес электронной почты.', errMessage: 'Опишите запрос — хотя бы 10 символов.',
  mailReady: 'Письмо подготовлено. Отправьте его в открывшемся почтовом сервисе. Если он не открылся, напишите на email слева.',
  subject: 'Торговый запрос', messageName: 'Имя', messageCompany: 'Компания', messageEmail: 'Email', messageInterest: 'Направление', messageBody: 'Запрос',
  metaDescription: 'GÜVEN BİRLİK — импорт и экспорт из Стамбула: поиск и проверка поставщиков, сделка по правилам, контроль качества. Партнёры в 30+ странах.'
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
  routesTitle: 'DIRECTIONS', regions: 'Trade regions', gaugeTitle: 'LOCAL TIME', boardTitle: 'DIRECTIONS BOARD', bhDest: 'Direction', bhCity: 'Point', bhCourse: 'Course', bhKm: 'Km', bhTime: 'Time', bhStatus: 'Business day', stOpen: 'OPEN', stClosed: 'CLOSED', stWeekend: 'WEEKEND', bearingTitle: 'COURSE FROM ISTANBUL', rCourse: 'Course', rDistance: 'Distance', rLocal: 'Time',
  distTitle: 'DISTANCE FROM ISTANBUL', dayTitle: 'DAY AT DESTINATION', legendSun: 'sun elevation', legendOverlap: 'shared business hours with Istanbul',
  clocksTitle: 'WORLD TIME',
  consoleNote: 'Routes illustrate trade directions; this is not shipment tracking. Time, distances and the sun’s position are calculated live.',
  europe: 'Europe', cis: 'Central Asia', middleEast: 'Middle East', asia: 'Asia', africa: 'Africa',
  regionEurope: 'European direction: discuss your trade enquiry between Türkiye and European markets.',
  regionCis: 'Central Asian direction: tell us which products and markets interest you, and we’ll discuss how to work together.',
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
  networkLabel: 'AN INTERNATIONAL PERSPECTIVE', networkTitle: 'Türkiye at the centre.<br>Opportunity everywhere.',
  networkText: 'Istanbul connects Europe and Asia. It is a starting point for conversations with new markets and the next chapter of your business.',
  networkFootnote: 'Destinations and supply terms are discussed individually for each project. We do not work with countries or parties under international sanctions, or with high-risk jurisdictions.',
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
  routesTitle: 'YÖNLER', regions: 'Ticaret bölgeleri', gaugeTitle: 'YEREL SAAT', boardTitle: 'YÖN PANOSU', bhDest: 'Yön', bhCity: 'Nokta', bhCourse: 'Rota', bhKm: 'Km', bhTime: 'Saat', bhStatus: 'İş günü', stOpen: 'AÇIK', stClosed: 'KAPALI', stWeekend: 'HAFTA SONU', bearingTitle: 'İSTANBUL’DAN ROTA', rCourse: 'Rota', rDistance: 'Mesafe', rLocal: 'Saat',
  distTitle: 'İSTANBUL’A UZAKLIK', dayTitle: 'VARIŞ NOKTASINDA GÜN', legendSun: 'güneş yüksekliği', legendOverlap: 'İstanbul ile ortak mesai saatleri',
  clocksTitle: 'DÜNYA SAATİ',
  consoleNote: 'Rotalar ticaret yönlerini gösteren bir illüstrasyondur, yük takibi değildir. Saat, mesafe ve güneşin konumu anlık hesaplanır.',
  europe: 'Avrupa', cis: 'Orta Asya', middleEast: 'Orta Doğu', asia: 'Asya', africa: 'Afrika',
  regionEurope: 'Avrupa yönü: Türkiye ve Avrupa pazarları arasındaki ticaret talebinizi görüşelim.',
  regionCis: 'Orta Asya yönü: ilgilendiğiniz ürünleri ve pazarları anlatın, iş birliği biçimini birlikte konuşalım.',
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
  networkLabel: 'ULUSLARARASI BAKIŞ', networkTitle: 'Merkezde Türkiye.<br>Her yerde fırsat.',
  networkText: 'İstanbul, Avrupa ile Asya’yı birbirine bağlar. Yeni pazarlarla diyaloğunuz ve işletmenizin sonraki adımı buradan başlar.',
  networkFootnote: 'Her projenin teslimat bölgesi ve koşulları ayrıca görüşülür. Uluslararası yaptırım altındaki ülkeler ve taraflarla ya da yüksek riskli bölgelerle çalışmıyoruz.',
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

// Content update: services, goods, process, FAQ (adapted, trade without logistics)
Object.assign(en, {
  navGoods: 'Goods',
  navFaq: 'FAQ',
  heroDescription: 'Import and export from Istanbul. We find and vet the supplier, run the deal by the rules and check the quality of the lot — you get one contact and clear terms.',
  heroMeta: 'Partners in 30+ countries · reply to enquiries within 2–4 business hours',
  aboutText: 'GÜVEN BİRLİK İÇ VE DIŞ TİCARET A.Ş. is a trading company from Istanbul. We run import and export deals — from finding a supplier to a signed contract and an inspected lot.',
  aboutText2: 'We are accountable for the outcome of the whole deal, not for a single stage of it. So we first understand the task — product, volume, market, timing — and only then propose a solution.',
  pillar1Title: 'One contact, one accountability',
  pillar1Text: 'Supplier search, vetting, contract and quality control sit with one partner. No need to coordinate several middlemen.',
  pillar2Title: 'Supplier vetted before payment',
  pillar2Text: 'Company registration, signing authority, production capacity and delivery history. A pre-shipment inspection of the lot when it matters for the deal.',
  pillar3Title: 'A deal by the rules',
  pillar3Text: 'HS code, restrictions, licences and certification are checked in advance. The contract meets customs and currency requirements.',
  pillar4Title: 'Transparent pricing',
  pillar4Text: 'Goods, certification and our fee as separate lines. No “other charges” line.',
  pillar5Title: 'Istanbul as the hub',
  pillar5Text: 'Access to Türkiye, the EU, the Gulf, Central Asia and China — from one place, with one partner.',
  solutionsIntro: 'We don’t sell “just goods”. We run the deal: we match a supplier to your requirements, vet it and make sure the lot matches the contract.',
  importText: 'Sourcing in and through Türkiye: finding and vetting the manufacturer, price negotiation, contract and quality control of the lot.',
  exportText: 'Taking Turkish products abroad: finding buyers, checking the destination market’s requirements, terms and deal paperwork.',
  partnerTitle: 'Quality control',
  partnerText: 'Samples, factory audit and pre-shipment inspection — you see the goods before paying the balance, not after.',
  partnerCta: 'Discuss quality control',
  goodsTitle: 'Goods we work with',
  goodsIntro: 'We focus on categories where classification, market requirements and production lead times decide the deal.',
  g1Title: 'Raw materials',
  g1Text: 'Rolled steel, polymers, chemical feedstock, pulp',
  g2Title: 'Industrial equipment',
  g2Text: 'Machine tools, production lines, units and spare parts',
  g3Title: 'Electronics and components',
  g3Text: 'Electrical goods, components, conformity and marking checks',
  g4Title: 'Construction materials',
  g4Text: 'Finishing, sanitary ware, insulation, steel structures',
  g5Title: 'Textiles and apparel',
  g5Text: 'Fabrics, trims, finished goods, production to your spec',
  g6Title: 'Food and FMCG',
  g6Text: 'Meeting the destination market’s labelling and shelf-life rules',
  g7Title: 'Chemicals and polymers',
  g7Text: 'Including goods with special storage and handling requirements',
  g8Title: 'Automotive parts',
  g8Text: 'Spares, consumables, units for commercial vehicles',
  g9Title: 'On request',
  g9Text: 'Categories not listed — feasibility confirmed case by case',
  networkText: 'Istanbul connects Europe and Asia. Our partners are in 30+ countries — from the EU and the Gulf to Central Asia and China. Pick a direction and the instrument shows the course.',
  regionEurope: 'Europe: Germany, Italy, Poland, the Netherlands, Spain. Sourcing in the EU and selling Turkish goods on European markets.',
  regionCis: 'Central Asia: Uzbekistan, Kazakhstan, Kyrgyzstan. Supplying Turkish goods and counter-purchases.',
  regionMiddleEast: 'The Gulf: UAE, Saudi Arabia, Qatar. Supplying Turkish goods and sourcing for your projects in the region.',
  regionAsia: 'China and South-East Asia: China, Vietnam, India. Supplier vetting and on-site inspection of the lot.',
  regionAfrica: 'North Africa: Morocco. Let’s discuss your enquiry and a suitable form of trade cooperation.',
  processTitle: 'Six steps of a deal.',
  step1Title: 'Enquiry and brief',
  step1Text: 'Product, volume, market, timing. We determine the HS code and check restrictions and certification requirements.',
  step2Title: 'Feasibility check',
  step2Text: 'We confirm the deal is possible legally and on time. Risks are disclosed before payment, not after.',
  step3Title: 'Commercial offer',
  step3Text: 'A line-by-line price: goods, certification, our fee. The supplier’s terms and production lead time.',
  step4Title: 'Contract and payment',
  step4Text: 'Contract, Incoterms, payment schedule and liability. A letter of credit or documentary collection where the deal calls for it.',
  step5Title: 'Purchase and quality control',
  step5Text: 'Order with a vetted supplier, production and packing monitored, pre-shipment inspection and photo report.',
  step6Title: 'Documents and handover',
  step6Text: 'A full document set and handover of goods under the contract’s Incoterms. We stay in touch until the deal is closed.',
  faqTitle: 'Frequently asked questions',
  faqAsk: 'Ask your own question',
  q1: 'What is included in the price?',
  a1: 'A line-by-line breakdown: the goods, certification and our fee. There is no “other charges” line — everything is visible before the contract is signed.',
  q2: 'What are the payment terms?',
  a2: 'Usually an advance and the balance against documents. For large lots and new suppliers, a letter of credit or documentary collection is possible, so the supplier is paid only once shipment is confirmed.',
  q3: 'How do you vet a supplier?',
  a3: 'Company registration, signing authority, production capacity and delivery history. Where needed, an inspection of the lot and a photo report before shipment.',
  q4: 'Who handles certification?',
  a4: 'We check the requirements against the HS code and the destination market, and arrange testing and conformity assessment before the goods ship.',
  q5: 'Is there a minimum order?',
  a5: 'There is no hard minimum. If a small lot doesn’t make economic sense, we will say so plainly.',
  q6: 'How fast do you reply?',
  a6: 'Within 2–4 business hours of receiving your enquiry.',
  q7: 'Which countries don’t you work with?',
  a7: 'Countries and parties under international sanctions, and high-risk jurisdictions.',
  contactResponse: 'We reply within 2–4 business hours. Describe the task — we’ll come back with an answer on price, timing and feasibility.',
  messagePlaceholder: 'Product, quantity, destination market and timing…',
  metaDescription: 'GÜVEN BİRLİK — import and export from Istanbul: supplier sourcing and vetting, deals by the rules, quality control. Partners in 30+ countries.'
});
Object.assign(tr, {
  navGoods: 'Ürünler',
  navFaq: 'SSS',
  heroDescription: 'İstanbul’dan ithalat ve ihracat. Tedarikçiyi bulur ve doğrularız, anlaşmayı kurallara uygun yürütür, partinin kalitesini kontrol ederiz — tek muhatap, net koşullar.',
  heroMeta: '30+ ülkede iş ortakları · taleplere 2–4 iş saati içinde yanıt',
  aboutText: 'GÜVEN BİRLİK İÇ VE DIŞ TİCARET A.Ş., İstanbul merkezli bir ticaret şirketidir. İthalat ve ihracat işlemlerini tedarikçi aramasından imzalı sözleşmeye ve denetlenmiş partiye kadar yürütürüz.',
  aboutText2: 'Tek bir aşamadan değil, anlaşmanın bütün sonucundan sorumluyuz. Bu yüzden önce işi anlarız — ürün, miktar, pazar, zamanlama — ve ancak sonra bir çözüm öneririz.',
  pillar1Title: 'Tek muhatap, tek sorumluluk',
  pillar1Text: 'Tedarikçi arama, doğrulama, sözleşme ve kalite kontrol tek ortakta. Birden çok aracıyı koordine etmenize gerek yok.',
  pillar2Title: 'Ödemeden önce doğrulanan tedarikçi',
  pillar2Text: 'Şirket kaydı, imza yetkisi, üretim kapasitesi ve teslimat geçmişi. Anlaşma için önemliyse sevkiyat öncesi parti denetimi.',
  pillar3Title: 'Kurallara uygun anlaşma',
  pillar3Text: 'GTİP kodu, kısıtlamalar, lisanslar ve sertifikasyon önceden kontrol edilir. Sözleşme gümrük ve döviz mevzuatına uygundur.',
  pillar4Title: 'Şeffaf fiyat',
  pillar4Text: 'Ürün, sertifikasyon ve hizmet bedelimiz ayrı satırlarda. “Diğer giderler” satırı yok.',
  pillar5Title: 'Merkez olarak İstanbul',
  pillar5Text: 'Türkiye, AB, Körfez, Orta Asya ve Çin pazarlarına tek noktadan, tek ortakla erişim.',
  solutionsIntro: '“Sadece ürün” satmıyoruz. Anlaşmayı yürütüyoruz: gereksinimlerinize uygun tedarikçiyi bulur, doğrular ve partinin sözleşmeye uygunluğundan sorumlu oluruz.',
  importText: 'Türkiye’de ve Türkiye üzerinden satın alma: üreticiyi bulma ve doğrulama, fiyat görüşmesi, sözleşme ve parti kalite kontrolü.',
  exportText: 'Türk ürününü yurt dışına taşımak: alıcı bulma, hedef pazarın gerekliliklerini kontrol etme, koşullar ve anlaşma belgeleri.',
  partnerTitle: 'Kalite kontrol',
  partnerText: 'Numuneler, fabrika denetimi ve sevkiyat öncesi parti kontrolü — ürünü kalan ödemeden önce görürsünüz, sonra değil.',
  partnerCta: 'Kalite kontrolü görüşelim',
  goodsTitle: 'Çalıştığımız ürünler',
  goodsIntro: 'Anlaşmanın sonucunu sınıflandırma, pazar gereklilikleri ve üretim sürelerinin belirlediği kategorilere odaklanırız.',
  g1Title: 'Hammadde',
  g1Text: 'Hadde ürünleri, polimerler, kimyasal hammadde, selüloz',
  g2Title: 'Endüstriyel ekipman',
  g2Text: 'Tezgâhlar, üretim hatları, üniteler ve yedek parçalar',
  g3Title: 'Elektronik ve bileşenler',
  g3Text: 'Elektrikli ürünler, bileşenler, uygunluk ve işaretleme kontrolü',
  g4Title: 'Yapı malzemeleri',
  g4Text: 'İnce işler, vitrifiye, yalıtım, çelik yapılar',
  g5Title: 'Tekstil ve hazır giyim',
  g5Text: 'Kumaş, aksesuar, bitmiş ürün, şartnamenize göre üretim',
  g6Title: 'Gıda ve FMCG',
  g6Text: 'Hedef pazarın etiketleme ve raf ömrü kurallarına uygun',
  g7Title: 'Kimyasallar ve polimerler',
  g7Text: 'Özel depolama ve elleçleme gerektiren ürünler dahil',
  g8Title: 'Otomotiv parçaları',
  g8Text: 'Yedek parça, sarf malzemesi, ticari araç üniteleri',
  g9Title: 'Talep üzerine',
  g9Text: 'Listede olmayan kategoriler — uygulanabilirlik her durumda ayrıca teyit edilir',
  networkText: 'İstanbul Avrupa ile Asya’yı birleştirir. İş ortaklarımız 30+ ülkede — AB ve Körfez’den Orta Asya ve Çin’e. Bir yön seçin, cihaz rotayı göstersin.',
  regionEurope: 'Avrupa: Almanya, İtalya, Polonya, Hollanda, İspanya. AB’den satın alma ve Türk ürünlerinin Avrupa pazarlarında satışı.',
  regionCis: 'Orta Asya: Özbekistan, Kazakistan, Kırgızistan. Türk ürünlerinin tedariki ve karşılıklı alımlar.',
  regionMiddleEast: 'Körfez: BAE, Suudi Arabistan, Katar. Türk ürünlerinin tedariki ve bölgedeki projeleriniz için satın alma.',
  regionAsia: 'Çin ve Güneydoğu Asya: Çin, Vietnam, Hindistan. Tedarikçi doğrulama ve yerinde parti denetimi.',
  regionAfrica: 'Kuzey Afrika: Fas. Talebinizi ve uygun ticari iş birliği biçimini görüşelim.',
  processTitle: 'Anlaşmanın altı adımı.',
  step1Title: 'Talep ve brif',
  step1Text: 'Ürün, miktar, pazar, zamanlama. GTİP kodunu belirler, kısıtlamaları ve sertifikasyon gerekliliklerini kontrol ederiz.',
  step2Title: 'Uygulanabilirlik kontrolü',
  step2Text: 'Anlaşmanın hukuken ve zamanlama açısından mümkün olduğunu teyit ederiz. Riskleri ödemeden önce açıklarız.',
  step3Title: 'Ticari teklif',
  step3Text: 'Satır satır fiyat: ürün, sertifikasyon, hizmet bedelimiz. Tedarikçinin koşulları ve üretim süresi.',
  step4Title: 'Sözleşme ve ödeme',
  step4Text: 'Sözleşme, Incoterms, ödeme planı ve sorumluluklar. Anlaşma gerektiriyorsa akreditif veya vesaik mukabili ödeme.',
  step5Title: 'Satın alma ve kalite kontrol',
  step5Text: 'Doğrulanmış tedarikçiye sipariş, üretim ve ambalaj takibi, sevkiyat öncesi denetim ve fotoğraflı rapor.',
  step6Title: 'Belgeler ve teslim',
  step6Text: 'Eksiksiz belge seti ve sözleşmedeki Incoterms koşullarına göre ürün teslimi. Anlaşma kapanana kadar iletişimdeyiz.',
  faqTitle: 'Sık sorulan sorular',
  faqAsk: 'Kendi sorunuzu sorun',
  q1: 'Fiyata neler dahil?',
  a1: 'Satır satır döküm: ürün bedeli, sertifikasyon ve hizmet bedelimiz. “Diğer giderler” satırı yok — her şey sözleşmeden önce görünür.',
  q2: 'Ödeme koşulları neler?',
  a2: 'Genellikle avans ve bakiye belgeler karşılığında. Büyük partilerde ve yeni tedarikçilerde akreditif veya vesaik mukabili ödeme mümkündür; tedarikçi ödemeyi ancak sevkiyat teyit edildikten sonra alır.',
  q3: 'Tedarikçiyi nasıl doğruluyorsunuz?',
  a3: 'Şirket kaydı, imza yetkisi, üretim kapasitesi ve teslimat geçmişi. Gerekirse sevkiyattan önce parti denetimi ve fotoğraflı rapor.',
  q4: 'Sertifikasyonla kim ilgileniyor?',
  a4: 'Gereklilikleri GTİP koduna ve hedef pazara göre kontrol eder, testleri ve uygunluk değerlendirmesini sevkiyattan önce organize ederiz.',
  q5: 'Asgari sipariş var mı?',
  a5: 'Katı bir alt sınır yok. Küçük bir parti ekonomik olarak anlamlı değilse bunu açıkça söyleriz.',
  q6: 'Ne kadar hızlı yanıt veriyorsunuz?',
  a6: 'Talebiniz ulaştıktan sonra 2–4 iş saati içinde.',
  q7: 'Hangi ülkelerle çalışmıyorsunuz?',
  a7: 'Uluslararası yaptırım altındaki ülkeler ve taraflarla, ayrıca yüksek riskli bölgelerle.',
  contactResponse: '2–4 iş saati içinde yanıt veriyoruz. İşinizi anlatın — fiyat, süre ve uygulanabilirlik hakkında dönüş yapalım.',
  messagePlaceholder: 'Ürün, miktar, hedef pazar ve zamanlama…',
  metaDescription: 'GÜVEN BİRLİK — İstanbul’dan ithalat ve ihracat: tedarikçi bulma ve doğrulama, kurallara uygun anlaşma, kalite kontrol. 30+ ülkede iş ortakları.'
});

Object.assign(en, {
  builderTitle: 'ENQUIRY BUILDER',
  bType: 'Service',
  bGoods: 'Product group',
  bMarket: 'Market',
  bVolume: 'Lot size',
  bVolumePh: 'e.g. 2 containers',
  bTiming: 'Timing',
  bT1: 'Urgent',
  bT2: '1–3 months',
  bT3: '3+ months',
  bT4: 'Not decided yet',
  bDraft: 'Draft',
  bApply: 'Move to the enquiry form',
  bDraftEmpty: 'Pick the parameters — your enquiry text appears here.',
  bFilled: 'The draft is in the form. Add your name and email.',
  windowsTitle: 'CONTACT WINDOWS',
  windowsTz: 'ISTANBUL TIME',
  wLegendWork: 'partner business hours',
  wLegendOverlap: 'overlap with Istanbul',
  wLegendNow: 'now',
  wAria: 'Partners’ business hours on Istanbul time and their overlap with the Istanbul working day',
  wWeekend: 'weekend',
  consoleNote: 'Routes illustrate directions. Time, distances and business hours are calculated live; a business day is Mon–Fri, 09:00–18:00 local time.'
});
Object.assign(tr, {
  builderTitle: 'TALEP OLUŞTURUCU',
  bType: 'Hizmet',
  bGoods: 'Ürün grubu',
  bMarket: 'Pazar',
  bVolume: 'Parti büyüklüğü',
  bVolumePh: 'örn. 2 konteyner',
  bTiming: 'Zamanlama',
  bT1: 'Acil',
  bT2: '1–3 ay',
  bT3: '3+ ay',
  bT4: 'Henüz belli değil',
  bDraft: 'Taslak',
  bApply: 'Talep formuna aktar',
  bDraftEmpty: 'Parametreleri seçin — talep metniniz burada görünecek.',
  bFilled: 'Taslak forma aktarıldı. Adınızı ve e-postanızı ekleyin.',
  windowsTitle: 'İLETİŞİM PENCERELERİ',
  windowsTz: 'İSTANBUL SAATİYLE',
  wLegendWork: 'ortağın mesai saatleri',
  wLegendOverlap: 'İstanbul ile ortak',
  wLegendNow: 'şimdi',
  wAria: 'Ortakların mesai saatleri İstanbul saatiyle ve İstanbul iş günüyle örtüşmesi',
  wWeekend: 'hafta sonu',
  consoleNote: 'Rotalar yönleri gösterir. Saat, mesafe ve mesai saatleri anlık hesaplanır; iş günü pzt–cuma, yerel saatle 09:00–18:00.'
});
Object.assign(en, {
  dsTitle: 'COMPANY DOSSIER',
  dsCompany: 'Company',
  dsForm: 'Legal form',
  dsFormV: 'Joint-stock company (Anonim Şirket), Türkiye',
  dsOffice: 'Office',
  dsOfficeV: 'Eyüpsultan, Istanbul',
  dsDeals: 'Deals',
  dsDealsV: 'Import · Export · Quality control',
  dsReach: 'Reach',
  dsReachV: 'Partners in 30+ countries',
  dsLangs: 'Languages',
  dsReply: 'Enquiry reply',
  dsReplyV: '2–4 business hours',
  dsCompliance: 'Compliance',
  dsComplianceV: 'No sanctioned countries or high-risk jurisdictions'
});
Object.assign(tr, {
  dsTitle: 'ŞİRKET DOSYASI',
  dsCompany: 'Şirket',
  dsForm: 'Hukuki yapı',
  dsFormV: 'Anonim Şirket, Türkiye',
  dsOffice: 'Ofis',
  dsOfficeV: 'Eyüpsultan, İstanbul',
  dsDeals: 'İşlemler',
  dsDealsV: 'İthalat · İhracat · Kalite kontrol',
  dsReach: 'Erişim',
  dsReachV: '30+ ülkede iş ortakları',
  dsLangs: 'Diller',
  dsReply: 'Talebe yanıt',
  dsReplyV: '2–4 iş saati',
  dsCompliance: 'Uyum',
  dsComplianceV: 'Yaptırım altındaki ülkeler ve yüksek riskli bölgeler hariç'
});
Object.assign(en, {
  fSupplier: 'Supplier',
  fCheck: 'Vetting & contract',
  fYourMarket: 'Your market',
  fTrMaker: 'Maker in Türkiye',
  fBuyerSearch: 'Finding buyers',
  fBuyerAbroad: 'Buyer abroad',
  fOrigin: 'Production',
  fViaTr: 'Inspection',
  fThird: 'Report to you',
  incLabel: 'Included',
  incImport: 'Supplier vetting · Contract · Lot inspection',
  incExport: 'Finding buyers · Market requirements · Deal paperwork',
  incReexport: 'Samples · Factory audit · Photo report'
});
Object.assign(tr, {
  fSupplier: 'Tedarikçi',
  fCheck: 'Doğrulama ve sözleşme',
  fYourMarket: 'Sizin pazarınız',
  fTrMaker: 'Türkiye’deki üretici',
  fBuyerSearch: 'Alıcı arama',
  fBuyerAbroad: 'Yurt dışındaki alıcı',
  fOrigin: 'Üretim',
  fViaTr: 'Denetim',
  fThird: 'Size rapor',
  incLabel: 'Dahil',
  incImport: 'Tedarikçi doğrulama · Sözleşme · Parti denetimi',
  incExport: 'Alıcı arama · Pazar gereklilikleri · Anlaşma belgeleri',
  incReexport: 'Numuneler · Fabrika denetimi · Fotoğraflı rapor'
});
Object.assign(en, { mapHead: 'OFFICE ON THE MAP' });
Object.assign(tr, { mapHead: 'HARİTADA OFİS' });
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
  if ($('#route-list')) $('#route-list').innerHTML = HUBS.map((h, i) => `
    <button type="button" class="route" data-region="${h.key}" aria-pressed="false">
      <span class="r-idx">0${i + 1}</span><span class="r-name">${t(h.key)}</span><span class="r-code">${h.code}</span>
      <span class="r-km">≈${fmtKm(h.km)} km</span><span class="r-bar"><i style="width:${(h.km / MAX_KM * 100).toFixed(1)}%"></i></span>
    </button>`).join('');
  $('#region-options').innerHTML = HUBS.map((h, i) => `
    <button type="button" class="region" data-region="${h.key}" aria-pressed="false">
      <span class="region-idx">0${i + 1}</span><span class="region-name">${t(h.key)}</span><span class="region-code">${h.code} · ≈${fmtKm(h.km)} km</span><svg class="ic region-arrow" aria-hidden="true"><use href="#i-ne"/></svg>
    </button>`).join('');
  $$('[data-region]').forEach(btn => btn.addEventListener('click', () => setRegion(btn.dataset.region)));
  // Rows in the Geography plate set the course, then bring the instrument into view to show it turning.
  $$('#region-options [data-region]').forEach(btn => btn.addEventListener('click', () => {
    $('#globe-stage').scrollIntoView({ behavior: reducedMotion ? 'auto' : 'smooth', block: 'center' });
  }));
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
  if (!$('#dist-chart')) return;
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
  if (!$('#day-chart')) return;
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

/* Chronometer sub-dials: one analog face per city; hands move every second. */
function dialFace() {
  return `<svg class="sd" viewBox="0 0 64 64" aria-hidden="true"><circle class="sd-rim" cx="32" cy="32" r="31"/><circle class="sd-face" cx="32" cy="32" r="28.5"/><circle class="sd-min" cx="32" cy="32" r="26"/><circle class="sd-hr" cx="32" cy="32" r="26"/><line class="sd-h" x1="32" y1="34" x2="32" y2="18"/><line class="sd-m" x1="32" y1="35" x2="32" y2="10"/><line class="sd-s" x1="32" y1="38" x2="32" y2="8"/><circle class="sd-pin" cx="32" cy="32" r="2.2"/></svg>`;
}
function renderClocks() {
  const now = new Date();
  $('#clock-list').innerHTML = [ORIGIN, ...HUBS].map(h => {
    const off = tzOffsetMin(h.tz, now); const day = sunElevation(h.coord, now) > -0.833;
    const active = h.key === GB.region ? ' active' : '', origin = h === ORIGIN ? ' home' : '';
    return `<li class="clock${active}${origin}" data-tz="${h.tz}">${dialFace()}<span class="ck-code">${h.code}</span><b class="ck-time seg" data-ghost="88:88">${timeIn(h.tz, now)}</b><span class="ck-utc">${utcLabel(off)} · <span class="ck-dn ${day ? 'day' : 'night'}">${t(day ? 'day' : 'night')}</span></span></li>`;
  }).join('');
  setHands(now);
}
function setHands(now = new Date()) {
  $$('#clock-list .clock').forEach(li => {
    const [h, m, sec] = timeIn(li.dataset.tz, now, true).split(':').map(Number);
    const rot = (sel, deg) => { li.querySelector(sel).style.transform = `rotate(${deg}deg)`; };
    rot('.sd-h', (h % 12) * 30 + m * 0.5); rot('.sd-m', m * 6 + sec * 0.1); rot('.sd-s', sec * 6);
  });
}

/* Readouts change in one step with a small overshoot, never a glide. */
function stepText(el, text) {
  if (el.textContent === text) return;
  el.textContent = text;
  if (reducedMotion || !el.animate) return;
  el.animate([{ transform: 'translateY(-55%)', opacity: 0 }, { transform: 'translateY(8%)', opacity: 1, offset: 0.72 }, { transform: 'translateY(0)' }],
    { duration: 340, easing: 'cubic-bezier(0.23, 1, 0.32, 1)' });
}

/* Compass needle as a damped spring, like a liquid-filled compass: it swings onto the course,
   overshoots and settles in a few decaying oscillations, jolts when the page is scrolled,
   and keeps a faint living sway. Runs only while the compass is on screen. */
const needle = { el: null, angle: 0, vel: 0, target: 0, raf: 0, last: 0, visible: false };
const NEEDLE_K = 38;   // stiffness → ~1 s swing period
const NEEDLE_C = 4.3;  // damping   → ζ≈0.35: a clear overshoot, then a couple of small swings
function applyNeedle() { needle.el.style.transform = `rotate(${needle.angle.toFixed(2)}deg)`; }
function needleStep(t) {
  needle.raf = 0;
  const dt = Math.min(0.05, needle.last ? (t - needle.last) / 1000 : 1 / 60); needle.last = t;
  const sec = t / 1000;
  const sway = 0.9 * Math.sin(sec * 0.83) + 0.5 * Math.sin(sec * 2.1 + 1.3);
  const acc = NEEDLE_K * (needle.target + sway - needle.angle) - NEEDLE_C * needle.vel;
  needle.vel += acc * dt; needle.angle += needle.vel * dt;
  applyNeedle();
  if (needle.visible && !document.hidden) needle.raf = requestAnimationFrame(needleStep);
}
function wakeNeedle() { if (!needle.raf && needle.visible && !document.hidden) { needle.last = 0; needle.raf = requestAnimationFrame(needleStep); } }
function setNeedleTarget(bearing) {
  if (!needle.el) needle.el = $('#cp-needle');
  needle.target += ((bearing - needle.target + 540) % 360) - 180; // shortest way round
  if (reducedMotion) { needle.angle = needle.target; applyNeedle(); return; }
  wakeNeedle();
}
function initNeedle() {
  if (reducedMotion) return;
  needle.el = $('#cp-needle');
  if ('IntersectionObserver' in window) {
    new IntersectionObserver(([en]) => { needle.visible = en.isIntersecting; wakeNeedle(); }).observe($('.compass'));
  } else { needle.visible = true; }
  let lastY = scrollY;
  addEventListener('scroll', () => {
    const dy = scrollY - lastY; lastY = scrollY;
    needle.vel += Math.max(-160, Math.min(160, dy * 1.6)); // moving the instrument jolts the card
    wakeNeedle();
  }, { passive: true });
  document.addEventListener('visibilitychange', wakeNeedle);
}

function renderGauge() {
  const hub = hubByKey[GB.region], now = new Date();
  // shortest turn to the new course, so the needle never spins the long way round
  setNeedleTarget(hub.bearing);
  // the lit course arc from N and the target bug on the ring (the needle swings around it)
  const CIRC = 2 * Math.PI * 78;
  const arc = $('#cp-course');
  if (arc) {
    // shortest way from N: clockwise up to 180°, otherwise counter-clockwise
    const cw = hub.bearing <= 180, span = cw ? hub.bearing : 360 - hub.bearing;
    arc.style.strokeDasharray = `${(CIRC * span / 360).toFixed(1)} ${CIRC.toFixed(1)}`;
    arc.style.transform = `rotate(${cw ? -90 : -90 + hub.bearing}deg)`;
  }
  const bug = $('#cp-bug'); if (bug) bug.style.transform = `rotate(${needle.target}deg)`;
  stepText($('#ro-bearing'), String(hub.bearing).padStart(3, '0'));
  stepText($('#ro-km'), `≈${fmtKm(hub.km)}`);
  stepText($('#gauge-time'), timeIn(hub.tz, now));
  $('#gauge-code').textContent = hub.code;
  const off = tzOffsetMin(hub.tz, now); $('#gauge-utc').textContent = utcLabel(off);
  const d = (off - tzOffsetMin(ORIGIN.tz, now)) / 60;
  $('#gauge-delta').textContent = d === 0 ? t('deltaSame') : t(d > 0 ? 'deltaAhead' : 'deltaBehind').replace('{n}', Math.abs(d));
}

function renderRegionText() {
  const hub = hubByKey[GB.region];
  $('#region-description').textContent = t(regionDescKey[GB.region]);
}

function renderAll() { renderClocks(); renderGauge(); renderRegionText(); renderBoard(); renderBuilder(); renderWindows(); }

/* ---------- Clock tick ---------- */
let lastMinute = -1;
function tick() {
  const now = new Date();
  $('#utc-clock').textContent = timeIn('UTC', now, true);
  if (now.getUTCMinutes() !== lastMinute) { lastMinute = now.getUTCMinutes(); renderClocks(); renderGauge(); renderBoard(); renderWindows(); }
  else setHands(now);
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
  
}

/* ---------- Process: the six stages light up in sequence when the plate comes into view ---------- */
function initSteps() {
  // card groups light up in sequence the first time they come into view
  const groups = $$('.process-grid, .pillars, .service-grid, .goods-scale');
  if (reducedMotion || !('IntersectionObserver' in window)) { groups.forEach(g => g.classList.add('lit')); return; }
  const io = new IntersectionObserver(entries => entries.forEach(en => { if (en.isIntersecting) { en.target.classList.add('lit'); io.unobserve(en.target); } }), { threshold: 0.2 });
  groups.forEach(g => io.observe(g));
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

/* ---------- Inquiry builder: compose a structured enquiry, then hand it to the form ---------- */
const builder = { type: 'import', goods: 0, };
const TYPE_KEYS = [['import', 'importTitle'], ['export', 'exportTitle'], ['partnership', 'partnerTitle']];
function builderText(withLabels = true) {
  const hub = hubByKey[GB.region];
  const type = t(TYPE_KEYS.find(k => k[0] === builder.type)[1]);
  const goods = builder.goods ? t(`g${builder.goods}Title`) : '—';
  const vol = ($('#b-volume')?.value || '').trim() || '—';
  const timing = $('#b-timing') ? $('#b-timing').selectedOptions[0].textContent : '—';
  if (!withLabels) return `${type} · ${goods} · ${t(hub.key)} (${hub.code}) · ${vol} · ${timing}`;
  return [`${t('bType')}: ${type}`, `${t('bGoods')}: ${goods}`, `${t('bMarket')}: ${t(hub.key)} — ${hub.city}`, `${t('bVolume')}: ${vol}`, `${t('bTiming')}: ${timing}`].join('\n');
}
function renderBuilder() {
  const typeEl = $('#b-type'); if (!typeEl) return;
  typeEl.innerHTML = TYPE_KEYS.map(([v, k]) => `<button type="button" role="radio" aria-checked="${builder.type === v}" data-v="${v}">${t(k)}</button>`).join('');
  $('#b-goods').innerHTML = Array.from({ length: 9 }, (_, i) => `<button type="button" class="chip" role="radio" aria-checked="${builder.goods === i + 1}" data-v="${i + 1}"><b>G${String(i + 1).padStart(2, '0')}</b>${t(`g${i + 1}Title`)}</button>`).join('');
  $('#b-market').innerHTML = HUBS.map(h => `<button type="button" class="chip" role="radio" aria-checked="${GB.region === h.key}" data-v="${h.key}"><b>${h.code}</b>${t(h.key)}</button>`).join('');
  $$('#b-type button').forEach(b => b.addEventListener('click', () => { builder.type = b.dataset.v; renderBuilder(); }));
  $$('#b-goods button').forEach(b => b.addEventListener('click', () => { builder.goods = +b.dataset.v; renderBuilder(); }));
  $$('#b-market button').forEach(b => b.addEventListener('click', () => setRegion(b.dataset.v)));
  updateDraft();
}
function updateDraft() { const o = $('#b-draft'); if (o) o.textContent = builder.goods ? builderText(false) : t('bDraftEmpty'); }
function initBuilder() {
  if (!$('#b-type')) return;
  // a goods row picks that group in the builder and brings the builder into view
  $$('.good[data-good]').forEach(row => {
    const pick = () => { builder.goods = +row.dataset.good; renderBuilder(); $('.builder').scrollIntoView({ behavior: reducedMotion ? 'auto' : 'smooth', block: 'center' }); };
    row.addEventListener('click', pick);
    row.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); pick(); } });
  });
  $('#b-volume').addEventListener('input', updateDraft);
  $('#b-timing').addEventListener('change', updateDraft);
  $('#b-apply').addEventListener('click', () => {
    const form = $('#inquiry-form');
    form.elements.interest.value = builder.type;
    form.elements.message.value = builderText(true) + '\n\n';
    $('#contact').scrollIntoView({ behavior: reducedMotion ? 'auto' : 'smooth', block: 'start' });
    const status = $('#form-status'); status.classList.remove('error'); status.textContent = t('bFilled');
    setTimeout(() => form.elements.name.focus({ preventScroll: true }), reducedMotion ? 0 : 700);
  });
}

/* ---------- Contact windows: partners' business hours on Istanbul's clock ---------- */
function renderWindows() {
  const svg = $('#windows-chart'); if (!svg) return;
  const now = new Date(), offIst = tzOffsetMin(ORIGIN.tz, now);
  const W = 520, X0 = 92, X1 = 508, top = 36, rowH = 56, rows = [ORIGIN, ...HUBS];
  const x = h => X0 + (X1 - X0) * h / 24;
  const nowH = (timeIn(ORIGIN.tz, now).split(':').map(Number)).reduce((a, b, i) => a + (i ? b / 60 : b), 0);
  const isWeekend = tz => ['Sat', 'Sun'].includes(new Intl.DateTimeFormat('en-GB', { timeZone: tz, weekday: 'short' }).format(now));
  const segs = (a, b) => { const out = []; let s0 = ((a % 24) + 24) % 24, len = b - a; while (len > 0) { const e = Math.min(24, s0 + len); out.push([s0, e]); len -= e - s0; s0 = 0; } return out; };
  let o = `<defs><pattern id="w-hatch" width="5" height="5" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><rect width="1.4" height="5" fill="#8fbcff" fill-opacity=".35"/></pattern>
    <linearGradient id="w-lit" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#8fbcff"/><stop offset="1" stop-color="#3d7cf0"/></linearGradient>
    <filter id="w-glow" x="-20%" y="-50%" width="140%" height="200%"><feGaussianBlur stdDeviation="2.2" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter></defs>`;
  // Istanbul's own working band across all rows
  o += `<rect x="${x(9)}" y="${top - 6}" width="${x(18) - x(9)}" height="${rows.length * rowH + 4}" fill="rgba(143,188,255,.05)" stroke="rgba(143,188,255,.18)" stroke-dasharray="2 3"/>`;
  for (let hh = 0; hh <= 24; hh += 3) o += `<line class="c-grid" x1="${x(hh)}" x2="${x(hh)}" y1="${top - 6}" y2="${top + rows.length * rowH - 2}"/><text class="c-lbl" x="${x(hh)}" y="${top - 12}" text-anchor="middle">${String(hh).padStart(2, '0')}</text>`;
  rows.forEach((h, i) => {
    const y = top + i * rowH, cy = y + rowH / 2 - 2, active = h.key === GB.region, home = h === ORIGIN;
    const shift = (tzOffsetMin(h.tz, now) - offIst) / 60, wk = isWeekend(h.tz);
    // the partner's 09–18 expressed in Istanbul time
    const a = 9 - shift, b = 18 - shift;
    const ov = Math.max(0, Math.min(18, b) - Math.max(9, a));
    o += `<g class="w-row${active ? ' on' : ''}${home ? ' home' : ''}" data-key="${h.key}">`;
    o += `<rect x="${X0}" y="${cy - 7}" width="${X1 - X0}" height="14" fill="rgba(143,188,255,.04)"/>`;
    for (const [s0, e0] of segs(a, b)) o += `<rect x="${x(s0)}" y="${cy - 6}" width="${x(e0) - x(s0)}" height="12" rx="2" fill="${wk ? 'url(#w-hatch)' : 'rgba(77,148,255,.35)'}"/>`;
    if (!wk && !home && ov > 0) o += `<rect x="${x(Math.max(9, a))}" y="${cy - 6}" width="${x(Math.min(18, b)) - x(Math.max(9, a))}" height="12" rx="2" fill="url(#w-lit)" filter="url(#w-glow)"/>`;
    if (home && !wk) o += `<rect x="${x(9)}" y="${cy - 6}" width="${x(18) - x(9)}" height="12" rx="2" fill="#dbe9ff" opacity=".9"/>`;
    o += `<text class="w-code" x="8" y="${cy + 4}">${h.code}</text>`;
    o += `<text class="w-ov" x="${X0 - 8}" y="${cy + 4}" text-anchor="end">${wk ? t('wWeekend') : home ? '09–18' : `${ov % 1 ? ov.toFixed(1) : ov} ${t('hours')}`}</text></g>`;
  });
  o += `<line class="w-now" x1="${x(nowH)}" x2="${x(nowH)}" y1="${top - 8}" y2="${top + rows.length * rowH}"/><circle cx="${x(nowH)}" cy="${top - 8}" r="3" fill="#fff"/>`;
  svg.innerHTML = o;
  svg.setAttribute('aria-label', t('wAria'));
  $$('.w-row', svg).forEach(g => { if (g.dataset.key && g.dataset.key !== 'origin') g.addEventListener('click', () => setRegion(g.dataset.key)); });
}

/* ---------- Split-flap directions board ---------- */
// Business day = Mon–Fri, 09:00–18:00 local time at the destination (a convention, not a claim about any office).
const FLAP_SET = 'ABCDEFGHIJKLMNOPRSTUVYZАБВГДЕЖЗИКЛМНОПРСТУФЦЧШЭЮЯ0123456789';
const BOARD_W = { name: 16, city: 10, course: 4, km: 5, time: 5, status: 10 };
function setFlaps(cell, text, width, delay = 0) {
  const target = text.toLocaleUpperCase(language === 'tr' ? 'tr' : language).padEnd(width).slice(0, width);
  if (cell.children.length !== width) cell.innerHTML = '<span class="flap">&nbsp;</span>'.repeat(width);
  [...cell.children].forEach((el, i) => {
    const ch = target[i];
    if (el.dataset.c === ch) return;
    el.dataset.c = ch;
    const show = c => { el.textContent = c === ' ' ? ' ' : c; };
    if (reducedMotion || !el.animate) { show(ch); return; }
    let spins = ch === ' ' ? 1 : 3 + ((i * 7) % 4);
    const step = () => {
      show(spins-- > 0 ? FLAP_SET[(Math.random() * FLAP_SET.length) | 0] : ch);
      el.animate([{ transform: 'perspective(70px) rotateX(-78deg)', filter: 'brightness(1.8)' }, { transform: 'none', filter: 'none' }], { duration: 70, easing: 'ease-out' });
      if (spins >= 0) setTimeout(step, 58);
    };
    setTimeout(step, delay + i * 16);
  });
}
function businessState(tz, now) {
  const wd = new Intl.DateTimeFormat('en-GB', { timeZone: tz, weekday: 'short' }).format(now);
  if (wd === 'Sat' || wd === 'Sun') return 'weekend';
  const [hh, mm] = timeIn(tz, now).split(':').map(Number), m = hh * 60 + mm;
  return m >= 540 && m < 1080 ? 'open' : 'closed';
}
let boardBuiltFor = '';
function renderBoard() {
  const wrap = $('#board-rows'); if (!wrap) return;
  const now = new Date();
  if (boardBuiltFor !== language) {
    wrap.innerHTML = HUBS.map(h => `<button type="button" class="board-row" data-region="${h.key}" aria-pressed="false"><span class="bc bc-name"></span><span class="bc bc-city"></span><span class="bc bc-course"></span><span class="bc bc-km"></span><span class="bc bc-time"></span><span class="bc bc-status"></span></button>`).join('');
    $$('.board-row[data-region]', wrap).forEach(btn => btn.addEventListener('click', () => setRegion(btn.dataset.region)));
    boardBuiltFor = language;
  }
  HUBS.forEach((h, r) => {
    const row = wrap.querySelector(`[data-region="${h.key}"]`), d = r * 90, st = businessState(h.tz, now);
    const on = h.key === GB.region; row.classList.toggle('active', on); row.setAttribute('aria-pressed', on);
    row.dataset.state = st;
    setFlaps(row.querySelector('.bc-name'), t(h.key), BOARD_W.name, d);
    setFlaps(row.querySelector('.bc-city'), h.city, BOARD_W.city, d + 60);
    setFlaps(row.querySelector('.bc-course'), `${String(h.bearing).padStart(3, '0')}°`, BOARD_W.course, d + 120);
    setFlaps(row.querySelector('.bc-km'), String(h.km), BOARD_W.km, d + 150);
    setFlaps(row.querySelector('.bc-time'), timeIn(h.tz, now), BOARD_W.time, d + 180);
    setFlaps(row.querySelector('.bc-status'), t(st === 'open' ? 'stOpen' : st === 'weekend' ? 'stWeekend' : 'stClosed'), BOARD_W.status, d + 220);
    row.setAttribute('aria-label', `${t(h.key)} ${h.city}, ${h.bearing}°, ≈${fmtKm(h.km)} km, ${timeIn(h.tz, now)}, ${t(st === 'open' ? 'stOpen' : st === 'weekend' ? 'stWeekend' : 'stClosed')}`);
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
initNeedle();
initSteps();
initBuilder();
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
