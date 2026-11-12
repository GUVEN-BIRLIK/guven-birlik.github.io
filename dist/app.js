'use strict';
const EMAIL = 'guvenbirlikicvedisticaret@gmail.com';
const ru = {};
document.querySelectorAll('[data-i18n]').forEach(el => {ru[el.dataset.i18n] = el.innerHTML;});
document.querySelectorAll('[data-placeholder]').forEach(el => {ru[el.dataset.placeholder] = el.placeholder;});
Object.assign(ru, {
  regionEurope:'Европейское направление: обсудим ваш запрос на торговлю между Турцией и европейскими рынками.',
  regionAsia:'Азиатское направление: расскажите о потребностях в закупках или выходе на рынки Азии.',
  regionMiddleEast:'Ближневосточное направление: обсудим возможности поставок и делового сотрудничества.',
  mailReady:'Письмо подготовлено. Отправьте его в открывшемся почтовом сервисе. Если он не открылся, напишите на email слева.',
  subject:'Торговый запрос', messageName:'Имя', messageCompany:'Компания', messageEmail:'Email', messageInterest:'Направление', messageBody:'Запрос',
  globeAria:'Интерактивный 3D-глобус. Вращайте мышью, пальцем или стрелками. Клавиши плюс и минус меняют масштаб.', pause:'Остановить вращение', resume:'Включить вращение', reset:'Вернуть Стамбул в центр', navigation:'Навигация', regions:'Торговые направления'
});
const en = {
 navAbout:'About us',navServices:'Solutions',navNetwork:'Our reach',navContact:'Contact',discuss:'Discuss a project',heroEyebrow:'FROM ISTANBUL TO THE WORLD',heroLine1:'A closer world.',heroLine2:'A wider vision.',heroDescription:'Connecting markets, people and possibilities. Import and export with your business at the centre.',startProject:'Start a conversation',ourSolutions:'Our solutions',originCaption:'At the crossroads of global trade',globeLabel:'YOUR GATEWAY TO NEW MARKETS',heroNote:'INTERNATIONAL TRADE. A PERSONAL APPROACH.',explore:'EXPLORE MORE',aboutLabel:'ABOUT THE COMPANY',aboutTitle:'Local understanding.<br>Global thinking.',aboutText:'GÜVEN BİRLİK İÇ VE DIŞ TİCARET ANONİM ŞİRKETİ is an Istanbul-based company focused on domestic and international trade. We help build business connections between Türkiye and overseas markets.',aboutText2:'Every project starts with understanding your needs: what to supply, where from, where to and on what terms. These details shape a solution for your business.',meet:'Let’s get acquainted',aboutSignature:'TRUST IS THE FOUNDATION OF PARTNERSHIP',solutionsLabel:'TRADE SOLUTIONS',solutionsTitle:'Your business.<br>Beyond borders.',solutionsIntro:'From your first enquiry to an agreed supply plan, we help define a clear path for your project.',importTitle:'Import',importText:'Explore new sourcing opportunities. Let’s discuss the product, requirements and supply terms for your market.',importCta:'Discuss import',exportTitle:'Export',exportText:'Give your product an international perspective. Define your target market and the right form of trade cooperation.',exportCta:'Discuss export',partnerTitle:'Trade connections',partnerText:'Connect your business needs with market opportunities. Start a conversation about sourcing and partnership.',partnerCta:'Find a solution',networkLabel:'AN INTERNATIONAL PERSPECTIVE',networkTitle:'Türkiye at the centre.<br>Opportunity everywhere.',networkText:'Istanbul connects Europe and Asia. It is a starting point for conversations with new markets and the next chapter of your business.',europe:'Europe',asia:'Asia',middleEast:'Middle East',networkFootnote:'Destinations and supply terms are discussed individually for each project.',processLabel:'A CLEAR PATH TO PARTNERSHIP',processTitle:'From enquiry to a solution.',letsStart:'Let’s start with a conversation',step1Title:'Tell us what you need',step1Text:'Share your product, quantity, destination and preferred timeline.',step2Title:'Explore the details',step2Text:'We clarify your requirements and discuss a suitable way to work together.',step3Title:'Agree on the next step',step3Text:'Define the terms, the action plan and your point of contact for the project.',contactLabel:'LET’S START A CONVERSATION',contactLine1:'Your next market',contactLine2:'starts with',contactLine3:'a connection.',office:'OFFICE / İSTANBUL',map:'View on map',formTitle:'Tell us about your project',nameLabel:'Your name',companyLabel:'Company',namePlaceholder:'How should we address you?',companyPlaceholder:'Company name',interestLabel:'What are you interested in?',other:'Other enquiry',messageLabel:'Your enquiry',messagePlaceholder:'Product, quantity, destination and timing…',formNote:'This button opens your email app with a prepared message. Send the email to get in touch with us.',send:'Prepare enquiry',backTop:'Back to top',rights:'All rights reserved.',rotateHint:'DRAG TO ROTATE · PINCH TO ZOOM',regionEurope:'European direction: discuss your trade enquiry between Türkiye and European markets.',regionAsia:'Asian direction: share your sourcing needs or your plans to reach markets in Asia.',regionMiddleEast:'Middle Eastern direction: discuss supply opportunities and business cooperation.',mailReady:'Your email is ready. Send it in your email app. If it did not open, write to the email address on the left.',subject:'Trade enquiry',messageName:'Name',messageCompany:'Company',messageEmail:'Email',messageInterest:'Interest',messageBody:'Enquiry',globeAria:'Interactive 3D globe. Drag or use arrow keys to rotate. Use plus and minus to zoom.',pause:'Pause rotation',resume:'Start rotation',reset:'Centre on Istanbul',navigation:'Navigation',regions:'Trade regions'
};
const tr = {
 navAbout:'Hakkımızda',navServices:'Çözümler',navNetwork:'Coğrafya',navContact:'İletişim',discuss:'Projenizi konuşalım',heroEyebrow:'İSTANBUL’DAN DÜNYAYA',heroLine1:'Dünya daha yakın.',heroLine2:'Ufkunuz daha geniş.',heroDescription:'Pazarları, insanları ve fırsatları bir araya getiriyoruz. İşletmenize odaklanan ithalat ve ihracat çözümleri.',startProject:'İş birliğine başlayalım',ourSolutions:'Çözümlerimiz',originCaption:'Küresel ticaret yollarının kesişiminde',globeLabel:'YENİ PAZARLARA AÇILAN KAPINIZ',heroNote:'ULUSLARARASI TİCARET. SİZE ÖZEL YAKLAŞIM.',explore:'DAHA FAZLASI',aboutLabel:'HAKKIMIZDA',aboutTitle:'Yerel bakış.<br>Küresel düşünce.',aboutText:'GÜVEN BİRLİK İÇ VE DIŞ TİCARET ANONİM ŞİRKETİ, İstanbul merkezli, iç ve dış ticarete odaklanan bir şirkettir. Türkiye ile yurt dışı pazarlar arasında iş bağlantıları kurulmasına yardımcı oluyoruz.',aboutText2:'Her proje ihtiyacınızı anlamakla başlar: hangi ürün, nereden, nereye ve hangi koşullarla? İşletmeniz için çözümü bu ayrıntılar şekillendirir.',meet:'Tanışalım',aboutSignature:'İŞ BİRLİĞİNİN TEMELİ GÜVENDİR',solutionsLabel:'TİCARET ÇÖZÜMLERİ',solutionsTitle:'İşletmeniz için<br>sınırların ötesinde.',solutionsIntro:'İlk talepten mutabık kalınan tedarik planına kadar projeniz için anlaşılır bir yol oluşturalım.',importTitle:'İthalat',importText:'Yeni satın alma fırsatlarını keşfedin. Pazarınıza yönelik ürün, gereksinim ve tedarik koşullarını konuşalım.',importCta:'İthalatı görüşelim',exportTitle:'İhracat',exportText:'Ürününüze uluslararası bir perspektif kazandırın. Hedef pazarı ve ticari iş birliği biçimini birlikte belirleyelim.',exportCta:'İhracatı görüşelim',partnerTitle:'Ticari bağlantılar',partnerText:'İhtiyaçlarınız ile pazarın sunduğu fırsatları buluşturalım. Tedarik ve iş ortaklığı için diyaloğa başlayın.',partnerCta:'Çözüm bulalım',networkLabel:'ULUSLARARASI BAKIŞ',networkTitle:'Merkezde Türkiye.<br>Her yerde fırsat.',networkText:'İstanbul, Avrupa ile Asya’yı birbirine bağlar. Yeni pazarlarla diyaloğunuz ve işletmenizin sonraki adımı buradan başlar.',europe:'Avrupa',asia:'Asya',middleEast:'Orta Doğu',networkFootnote:'Her projenin teslimat bölgesi ve koşulları ayrıca görüşülür.',processLabel:'İŞ BİRLİĞİNE GİDEN AÇIK BİR YOL',processTitle:'Talepten çözüme.',letsStart:'Bir görüşmeyle başlayalım',step1Title:'İhtiyacınızı anlatın',step1Text:'Ürün, miktar, hedef bölge ve planladığınız zamanı paylaşın.',step2Title:'Ayrıntıları konuşalım',step2Text:'Gereksinimleri netleştirelim ve uygun iş birliği biçimini değerlendirelim.',step3Title:'Sonraki adımı belirleyelim',step3Text:'Koşulları, ilerleme planını ve proje için iletişim kişisini belirleyelim.',contactLabel:'DİYALOĞA BAŞLAYALIM',contactLine1:'Bir sonraki',contactLine2:'pazarınız bir',contactLine3:'iletişimle başlar.',office:'OFİS / İSTANBUL',map:'Haritada görüntüle',formTitle:'Projenizden bahsedin',nameLabel:'Adınız',companyLabel:'Şirket',namePlaceholder:'Size nasıl hitap edelim?',companyPlaceholder:'Şirket adı',interestLabel:'Hangi konuda görüşmek istersiniz?',other:'Diğer',messageLabel:'Talebiniz',messagePlaceholder:'Ürün, miktar, hedef bölge ve zamanlama…',formNote:'Bu düğme, hazırlanan mesajı e-posta uygulamanızda açar. Bizimle iletişime geçmek için e-postayı gönderin.',send:'Talebi hazırla',backTop:'Yukarı',rights:'Tüm hakları saklıdır.',rotateHint:'DÖNDÜRMEK İÇİN SÜRÜKLEYİN',regionEurope:'Avrupa yönü: Türkiye ve Avrupa pazarları arasındaki ticaret talebinizi görüşelim.',regionAsia:'Asya yönü: tedarik ihtiyacınızı veya Asya pazarlarına açılma planınızı paylaşın.',regionMiddleEast:'Orta Doğu yönü: tedarik fırsatlarını ve ticari iş birliğini konuşalım.',mailReady:'E-postanız hazır. Açılan e-posta uygulamasından gönderin. Uygulama açılmadıysa soldaki adrese yazabilirsiniz.',subject:'Ticari talep',messageName:'Ad',messageCompany:'Şirket',messageEmail:'E-posta',messageInterest:'Konu',messageBody:'Talep',globeAria:'Etkileşimli 3B dünya. Döndürmek için sürükleyin veya ok tuşlarını kullanın. Yakınlaştırmak için artı ve eksi tuşlarını kullanın.',pause:'Döndürmeyi durdur',resume:'Döndürmeyi başlat',reset:'İstanbul’u merkeze al',navigation:'Gezinme',regions:'Ticaret bölgeleri'
};
const translations={ru,en,tr};
let language='ru';
let selectedRegion='europe';
let globeController=null;
const descriptions={europe:'regionEurope',asia:'regionAsia',middleEast:'regionMiddleEast'};
function setLanguage(lang){
 if(!translations[lang])return;
 language=lang;
 const strings=translations[lang];
 document.documentElement.lang=lang;
 document.querySelectorAll('[data-i18n]').forEach(el=>{const value=strings[el.dataset.i18n];if(value!==undefined)el.innerHTML=value;});
 document.querySelectorAll('[data-placeholder]').forEach(el=>el.placeholder=strings[el.dataset.placeholder]||'');
 document.querySelectorAll('[data-lang]').forEach(el=>{el.classList.toggle('active',el.dataset.lang===lang);el.setAttribute('aria-pressed',el.dataset.lang===lang);});
 document.querySelector('.nav').setAttribute('aria-label',strings.navigation);
 document.querySelector('.region-options').setAttribute('aria-label',strings.regions);
 document.getElementById('globe').setAttribute('aria-label',strings.globeAria);
 document.getElementById('globe-reset').setAttribute('aria-label',strings.reset);
 document.getElementById('globe-zoom-in').setAttribute('aria-label',{ru:'Приблизить',en:'Zoom in',tr:'Yakınlaştır'}[lang]);
 document.getElementById('globe-zoom-out').setAttribute('aria-label',{ru:'Отдалить',en:'Zoom out',tr:'Uzaklaştır'}[lang]);
 document.getElementById('globe-pause').setAttribute('aria-label',globeController?.paused?strings.resume:strings.pause);
 document.getElementById('region-description').textContent=strings[descriptions[selectedRegion]];
 document.getElementById('form-status').textContent='';
 document.querySelector('meta[name="description"]').content={ru:'GÜVEN BİRLİK — импорт, экспорт и международное торговое сотрудничество. Стамбул, Турция.',en:'GÜVEN BİRLİK — import, export and international trade cooperation. Istanbul, Türkiye.',tr:'GÜVEN BİRLİK — ithalat, ihracat ve uluslararası ticari iş birliği. İstanbul, Türkiye.'}[lang];
 try{localStorage.setItem('gb-language',lang);}catch{}
}
document.querySelectorAll('[data-lang]').forEach(button=>button.addEventListener('click',()=>setLanguage(button.dataset.lang)));
try{const saved=localStorage.getItem('gb-language');if(translations[saved])language=saved;}catch{}
setLanguage(language);
document.querySelector('.menu-toggle').addEventListener('click',event=>{
 const button=event.currentTarget;const open=button.getAttribute('aria-expanded')!=='true';button.setAttribute('aria-expanded',open);document.querySelector('.nav').classList.toggle('open',open);
});
document.querySelectorAll('.nav a').forEach(link=>link.addEventListener('click',()=>{document.querySelector('.nav').classList.remove('open');document.querySelector('.menu-toggle').setAttribute('aria-expanded','false');}));
document.addEventListener('keydown',event=>{if(event.key==='Escape'){document.querySelector('.nav').classList.remove('open');document.querySelector('.menu-toggle').setAttribute('aria-expanded','false');}});
document.querySelectorAll('[data-service]').forEach(link=>link.addEventListener('click',()=>{document.querySelector('[name="interest"]').value=link.dataset.service;}));
document.querySelectorAll('[data-region]').forEach(button=>button.addEventListener('click',()=>{
 selectedRegion=button.dataset.region;
 document.querySelectorAll('[data-region]').forEach(el=>{const active=el===button;el.classList.toggle('active',active);el.setAttribute('aria-pressed',active);});
 document.getElementById('region-description').textContent=translations[language][descriptions[selectedRegion]];
 document.getElementById('route-name').textContent={europe:'EUROPE',asia:'ASIA',middleEast:'MIDDLE EAST'}[selectedRegion];
 if(globeController)globeController.setRegion(selectedRegion);
}));
document.getElementById('inquiry-form').addEventListener('submit',event=>{
 event.preventDefault();const form=event.currentTarget;if(!form.reportValidity())return;
 const data=new FormData(form);const t=translations[language];
 const interest={import:t.importTitle,export:t.exportTitle,partnership:t.partnerTitle,other:t.other}[data.get('interest')];
 const subject=`${t.subject} — ${interest} — ${String(data.get('company')||data.get('name')).trim()}`;
 const body=`${t.messageName}: ${String(data.get('name')).trim()}\n${t.messageCompany}: ${String(data.get('company')).trim()}\n${t.messageEmail}: ${String(data.get('email')).trim()}\n${t.messageInterest}: ${interest}\n\n${t.messageBody}:\n${String(data.get('message')).trim()}`;
 const link=document.createElement('a');link.href=`mailto:${EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;link.click();
 document.getElementById('form-status').textContent=t.mailReady;
});

// A 3D spherical model, orthographically projected into a high-resolution canvas.
// Land, meridians and elevated great-circle routes all rotate around two axes.
(async function initialiseGlobe(){
 const canvas=document.getElementById('globe');const ctx=canvas.getContext('2d');if(!ctx)return;
 const rad=Math.PI/180;let width=0,height=0,dpr=1;
 let longitude=24,latitude=18,zoom=1,paused=matchMedia('(prefers-reduced-motion: reduce)').matches;
 let dragging=false,lastX=0,lastY=0,lastInteraction=performance.now(),visible=true,frame=0,lastTime=0;
 const points=[],coastlines=[],pointers=new Map();let pinchDistance=0;
 const targets={europe:[10,51],asia:[103,35],middleEast:[47,27]};
 const origin=[28.9784,41.0082];
 const toVector=([lon,lat])=>{const p=lat*rad,l=lon*rad;return [Math.cos(p)*Math.sin(l),Math.sin(p),Math.cos(p)*Math.cos(l)];};
 const polygonContains=(point,ring)=>{let inside=false;for(let i=0,j=ring.length-1;i<ring.length;j=i++){const a=ring[i],b=ring[j];if((a[1]>point[1])!==(b[1]>point[1])&&point[0]<(b[0]-a[0])*(point[1]-a[1])/(b[1]-a[1])+a[0])inside=!inside;}return inside;};
 try{
  const response=await fetch('assets/world.geojson');if(!response.ok)throw new Error('Globe geography unavailable');const world=await response.json();const polygons=[];
  world.features.forEach(feature=>{
   const shapes=feature.geometry.type==='Polygon'?[feature.geometry.coordinates]:feature.geometry.type==='MultiPolygon'?feature.geometry.coordinates:[];
   shapes.forEach(rings=>{const ring=rings[0];const bounds=ring.reduce((b,p)=>[Math.min(b[0],p[0]),Math.min(b[1],p[1]),Math.max(b[2],p[0]),Math.max(b[3],p[1])],[180,90,-180,-90]);polygons.push({rings,bounds});coastlines.push(ring.map(toVector));});
  });
  for(let lat=-56;lat<83;lat+=2.1){const step=2.1/Math.max(.25,Math.cos(lat*rad));for(let lon=-180;lon<180;lon+=step){if(polygons.some(({rings,bounds:b})=>lon>=b[0]&&lon<=b[2]&&lat>=b[1]&&lat<=b[3]&&polygonContains([lon,lat],rings[0])&&!rings.slice(1).some(hole=>polygonContains([lon,lat],hole))))points.push(toVector([lon,lat]));}}
 }catch(error){console.warn(error.message);}
 const resize=()=>{const bounds=canvas.getBoundingClientRect();width=bounds.width;height=bounds.height;dpr=Math.min(devicePixelRatio||1,2);canvas.width=Math.round(width*dpr);canvas.height=Math.round(height*dpr);};
 new ResizeObserver(resize).observe(canvas);resize();
 const observer=new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;if(visible&&!frame){lastTime=0;frame=requestAnimationFrame(render);}});observer.observe(canvas);
 let sinLon,cosLon,sinLat,cosLat,radius,cx,cy;
 function project(v,scale=1){const x=v[0]*cosLon-v[2]*sinLon;const z=v[0]*sinLon+v[2]*cosLon;const y=v[1]*cosLat-z*sinLat;const depth=v[1]*sinLat+z*cosLat;return [cx+x*radius*scale,cy-y*radius*scale,depth];}
 const grid=[];
 for(let l=-180;l<180;l+=30){const line=[];for(let p=-90;p<=90;p+=3)line.push(toVector([l,p]));grid.push(line);}
 for(let p=-60;p<=60;p+=30){const line=[];for(let l=-180;l<=180;l+=3)line.push(toVector([l,p]));grid.push(line);}
 const routes={};
 for(const [key,destination]of Object.entries(targets)){const a=toVector(origin),b=toVector(destination);const angle=Math.acos(Math.max(-1,Math.min(1,a.reduce((sum,x,i)=>sum+x*b[i],0))));routes[key]=Array.from({length:71},(_,i)=>{const t=i/70,s=Math.sin(angle);const v=a.map((x,j)=>(Math.sin((1-t)*angle)*x+Math.sin(t*angle)*b[j])/s);return {v,scale:1+.22*Math.sin(Math.PI*t)};});}
 function strokeLine(vectors,color,lineWidth){ctx.beginPath();let previous=false;for(const v of vectors){const p=project(v);if(p[2]>.025){if(previous)ctx.lineTo(p[0],p[1]);else ctx.moveTo(p[0],p[1]);previous=true;}else previous=false;}ctx.strokeStyle=color;ctx.lineWidth=lineWidth;ctx.stroke();}
 function drawMarker(coordinates,label,color){const p=project(toVector(coordinates));if(p[2]<.12)return;ctx.beginPath();ctx.arc(p[0],p[1],3,0,Math.PI*2);ctx.fillStyle=color;ctx.shadowColor=color;ctx.shadowBlur=12;ctx.fill();ctx.shadowBlur=0;ctx.beginPath();ctx.arc(p[0],p[1],7,0,Math.PI*2);ctx.strokeStyle=color+'55';ctx.lineWidth=1;ctx.stroke();if(label){ctx.font='600 8px "Space Grotesk", monospace';const labelWidth=ctx.measureText(label).width;let labelX=p[0]+13;if(labelX+labelWidth>width-10)labelX=p[0]-labelWidth-13;ctx.fillStyle='#090b0fe0';ctx.fillRect(labelX-4,p[1]-9,labelWidth+8,15);ctx.fillStyle=color;ctx.fillText(label,labelX,p[1]+2);}}
 function render(time){
  frame=0;if(!visible)return;
  const dt=lastTime?Math.min(time-lastTime,50):16;lastTime=time;
  if(!paused&&!dragging&&time-lastInteraction>4500)longitude+=dt*.002;
  ctx.setTransform(dpr,0,0,dpr,0,0);ctx.clearRect(0,0,width,height);
  cx=width/2;cy=height*.46;radius=Math.min(width*.405,height*.405)*zoom;
  sinLon=Math.sin(longitude*rad);cosLon=Math.cos(longitude*rad);sinLat=Math.sin(latitude*rad);cosLat=Math.cos(latitude*rad);
  const glow=ctx.createRadialGradient(cx,cy,radius*.6,cx,cy,radius*1.3);glow.addColorStop(0,'#f5324500');glow.addColorStop(.65,'#f532450d');glow.addColorStop(1,'#f5324500');ctx.fillStyle=glow;ctx.fillRect(0,0,width,height);
  const sphere=ctx.createRadialGradient(cx-radius*.35,cy-radius*.45,0,cx+radius*.15,cy+radius*.2,radius*1.1);sphere.addColorStop(0,'#252432');sphere.addColorStop(.5,'#151721');sphere.addColorStop(1,'#080b11');ctx.beginPath();ctx.arc(cx,cy,radius,0,Math.PI*2);ctx.fillStyle=sphere;ctx.fill();ctx.strokeStyle='#8f6a7c44';ctx.lineWidth=1;ctx.stroke();
  grid.forEach(line=>strokeLine(line,'#9397b417',.6));
  coastlines.forEach(line=>strokeLine(line,'#fa536c38',.6));
  for(const v of points){const p=project(v);if(p[2]<=0)continue;const alpha=.12+.68*p[2];ctx.fillStyle=`rgba(235,82,112,${alpha})`;ctx.beginPath();ctx.arc(p[0],p[1],(.5+.55*p[2])*Math.min(zoom,1.3),0,Math.PI*2);ctx.fill();}
  for(const[key,route]of Object.entries(routes)){const active=key===selectedRegion;ctx.beginPath();let previous=false;for(const point of route){const p=project(point.v,point.scale);if(p[2]>.03){if(previous)ctx.lineTo(p[0],p[1]);else ctx.moveTo(p[0],p[1]);previous=true;}else previous=false;}ctx.strokeStyle=active?'#fa485eaa':'#fa344b3b';ctx.lineWidth=active?1.3:.7;ctx.stroke();
   const progress=paused?.5:(time*.00012+(key==='asia'?.3:key==='middleEast'?.6:0))%1;const point=route[Math.floor(progress*70)];const p=project(point.v,point.scale);if(p[2]>.03){ctx.beginPath();ctx.arc(p[0],p[1],active?2.1:1.4,0,Math.PI*2);ctx.fillStyle=active?'#fff2f3':'#fa344b';ctx.shadowColor='#fa344b';ctx.shadowBlur=12;ctx.fill();ctx.shadowBlur=0;}
   drawMarker(targets[key],null,active?'#fa5266':'#ae3b50');
  }
  drawMarker(origin,'İSTANBUL','#ff6478');
  frame=requestAnimationFrame(render);
 }
 const interact=()=>{lastInteraction=performance.now();};
 canvas.addEventListener('pointerdown',event=>{canvas.setPointerCapture(event.pointerId);pointers.set(event.pointerId,{x:event.clientX,y:event.clientY});dragging=true;lastX=event.clientX;lastY=event.clientY;interact();if(pointers.size===2){const[a,b]=[...pointers.values()];pinchDistance=Math.hypot(a.x-b.x,a.y-b.y);}});
 canvas.addEventListener('pointermove',event=>{if(!pointers.has(event.pointerId))return;pointers.set(event.pointerId,{x:event.clientX,y:event.clientY});if(pointers.size===2){const[a,b]=[...pointers.values()];const distance=Math.hypot(a.x-b.x,a.y-b.y);if(pinchDistance>0)zoom=Math.max(.72,Math.min(1.2,zoom*distance/pinchDistance));pinchDistance=distance;}else{longitude-=(event.clientX-lastX)*.4;latitude=Math.max(-75,Math.min(75,latitude+(event.clientY-lastY)*.35));}lastX=event.clientX;lastY=event.clientY;interact();});
 const endDrag=event=>{pointers.delete(event.pointerId);dragging=pointers.size>0;pinchDistance=0;if(dragging){const p=[...pointers.values()][0];lastX=p.x;lastY=p.y;}interact();};
 canvas.addEventListener('pointerup',endDrag);canvas.addEventListener('pointercancel',endDrag);canvas.addEventListener('lostpointercapture',endDrag);
 canvas.addEventListener('keydown',event=>{const actions={ArrowLeft:()=>longitude-=7,ArrowRight:()=>longitude+=7,ArrowUp:()=>latitude=Math.min(75,latitude+7),ArrowDown:()=>latitude=Math.max(-75,latitude-7),'+':()=>zoom=Math.min(1.2,zoom+.05),'=':()=>zoom=Math.min(1.2,zoom+.05),'-':()=>zoom=Math.max(.72,zoom-.05)};if(actions[event.key]){event.preventDefault();actions[event.key]();interact();}});
 const pauseButton=document.getElementById('globe-pause');
 const updatePause=()=>{pauseButton.textContent=paused?'▶':'Ⅱ';pauseButton.setAttribute('aria-pressed',paused);pauseButton.setAttribute('aria-label',translations[language][paused?'resume':'pause']);};
 pauseButton.addEventListener('click',()=>{paused=!paused;updatePause();});
 document.getElementById('globe-reset').addEventListener('click',()=>{longitude=24;latitude=18;zoom=1;interact();});
 document.getElementById('globe-zoom-in').addEventListener('click',()=>{zoom=Math.min(1.2,zoom+.08);interact();});
 document.getElementById('globe-zoom-out').addEventListener('click',()=>{zoom=Math.max(.72,zoom-.08);interact();});
 globeController={get paused(){return paused;},setRegion(key){const target=targets[key];longitude=(origin[0]+target[0])*.5;latitude=(origin[1]+target[1])*.35;interact();}};
 updatePause();frame=requestAnimationFrame(render);
})();
