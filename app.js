const K='fa_data',LOGO='https://i.postimg.cc/Jn48Z4Bk/bshbsh.png';
const e=s=>String(s).replace(/[&<>"]/g,c=>'&#'+c.charCodeAt(0)+';');
const def=()=>({count:8,mode:'groups',
 teams:Array.from({length:8},(_,i)=>({n:'Team '+(i+1),p:0,gf:0,ga:0,pts:0})),
 com:['معلق 1','معلق 2'],spo:['beIN SPORTS','On Time Sports'],
 clubs:['Real Madrid','Man United','Barcelona','Liverpool','Bayern','PSG'].map(n=>({n,l:''})),
 fb:[{n:'أحمد',t:'أفضل بطولة عربية، تنظيم رائع!'},{n:'محمد',t:'المعلقين والنتايج بتتحدث لحظيا.'},{n:'يوسف',t:'موقع شيك وسهل.'}]});
const load=()=>{try{return JSON.parse(localStorage.getItem(K))||def()}catch(_){return def()}};
const save=d=>localStorage.setItem(K,JSON.stringify(d));
const cmp=(a,b)=>b.pts-a.pts||(b.gf-b.ga)-(a.gf-a.ga)||b.gf-a.gf;
const chunks=d=>{const s=d.mode==='groups'?4:d.count,o=[];for(let i=0;i<d.teams.length;i+=s)o.push(d.teams.slice(i,i+s));return o};
const sortAll=d=>{d.teams=chunks(d).flatMap(c=>c.sort(cmp))};
const P=document.body.dataset.p,D=load(),M=document.getElementById('m');
const pages=[['index','الرئيسية','home'],['tournament','البطولة','tour'],['staff','المعلقين والرعاة','staff'],['admin','لوحة التحكم','admin']];
document.getElementById('hdr').innerHTML=`<header><a class="brand" href="index.html"><img src="${LOGO}" alt="">FIFA ARAB</a>
<button id="bt" onclick="document.querySelector('nav').classList.toggle('open')">☰</button>
<nav>${pages.map(p=>`<a href="${p[0]}.html" class="${p[2]==P?'on':''}">${p[1]}</a>`).join('')}</nav>
<span class="pt">${document.body.dataset.t}</span></header>`;
const sp=a=>`<div class="row">${a.map(s=>`<div class="spo">${e(s)}</div>`).join('')}</div>`;
const tbl=(t,title)=>`<h2>${title}</h2><div class="tw"><table><tr><th>#</th><th>الفريق</th><th>لعب</th><th>له</th><th>عليه</th><th>فارق</th><th>نقاط</th></tr>${t.map((x,i)=>`<tr><td>${i+1}</td><td class="n">${e(x.n)}</td><td>${x.p}</td><td>${x.gf}</td><td>${x.ga}</td><td>${x.gf-x.ga}</td><td><b>${x.pts}</b></td></tr>`).join('')}</table></div>`;
const standings=()=>{sortAll(D);return chunks(D).map((c,i)=>tbl(c,D.mode==='groups'?'المجموعة '+String.fromCharCode(65+i):'جدول التصفيات')).join('')};
if(P=='home')M.innerHTML=`<div class="ban"><img src="${LOGO}" alt=""><h1>FIFA ARAB OFFICIAL</h1><p>Website for fifa arab , club , staff and other ..</p></div>
<div class="sec"><h2>الأندية</h2><div class="row">${D.clubs.map(c=>`<div class="club"><i>${c.l?`<img src="${e(c.l)}" alt="">`:e(c.n.slice(0,2).toUpperCase())}</i>${e(c.n)}</div>`).join('')}</div></div>
<div class="sec"><h2>الفيدباكات</h2><div class="row">${D.fb.map(f=>`<div class="card">“${e(f.t)}”<br><br><b>— ${e(f.n)}</b></div>`).join('')}</div></div>
<div class="sec"><h2>الرعاة الرسميين</h2>${sp(D.spo)}</div>`;
if(P=='tour')M.innerHTML=`<div class="sec"><h2>البطولة (${D.count} فريق - ${D.mode=='groups'?'نظام مجموعات':'تصفيات'})</h2>${standings()}</div>`;
if(P=='staff')M.innerHTML=`<div class="sec"><h2>المعلقين</h2><div class="row">${D.com.map(c=>`<div class="card"><b>🎙️ ${e(c)}</b></div>`).join('')}</div></div><div class="sec"><h2>الرعاة الرسميين</h2>${sp(D.spo)}</div>`;
if(P=='admin'){
 if(sessionStorage.fa_ok!='1'){M.innerHTML=`<div class="sec"><h2>لوحة التحكم</h2><div class="card">أدخل الكود:<br><br><input id="cd" type="password" inputmode="numeric"> <button class="btn" onclick="if(cd.value=='112233'){sessionStorage.fa_ok='1';location.reload()}else alert('كود خطأ')">دخول</button></div></div>`}
 else{
  const rows=()=>D.teams.map((t,i)=>`<tr><td>${i+1}</td><td><input class="nm" value="${e(t.n)}"></td><td><input type="number" value="${t.p}"></td><td><input type="number" value="${t.gf}"></td><td><input type="number" value="${t.ga}"></td><td><input type="number" value="${t.pts}"></td></tr>`).join('');
  const draw=()=>{M.innerHTML=`<div class="sec"><h2>لوحة التحكم</h2>
  <div class="ctl">عدد الفرق: <select id="cn">${[8,16,32].map(n=>`<option ${n==D.count?'selected':''}>${n}</option>`).join('')}</select>
  النظام: <select id="md"><option value="groups" ${D.mode=='groups'?'selected':''}>مجموعات</option><option value="league" ${D.mode=='league'?'selected':''}>تصفيات</option></select></div>
  <div class="tw"><table id="tt"><tr><th>#</th><th>الفريق</th><th>لعب</th><th>له</th><th>عليه</th><th>نقاط</th></tr>${rows()}</table></div>
  <h2>المعلقين (سطر لكل اسم)</h2><textarea id="cm">${e(D.com.join('\n'))}</textarea>
  <h2>الرعاة (سطر لكل راعي)</h2><textarea id="sp">${e(D.spo.join('\n'))}</textarea>
  <h2>الأندية (اسم|رابط لوجو اختياري)</h2><textarea id="cl">${e(D.clubs.map(c=>c.n+(c.l?'|'+c.l:'')).join('\n'))}</textarea>
  <h2>الفيدباكات (اسم|نص)</h2><textarea id="fb">${e(D.fb.map(f=>f.n+'|'+f.t).join('\n'))}</textarea>
  <br><br><button class="btn" id="sv">💾 حفظ</button></div>`;
  cn.onchange=md.onchange=()=>{grab();D.count=+cn.value;D.mode=md.value;while(D.teams.length<D.count)D.teams.push({n:'Team '+(D.teams.length+1),p:0,gf:0,ga:0,pts:0});D.teams.length=D.count;draw()};
  sv.onclick=()=>{grab();D.count=+cn.value;D.mode=md.value;const L=id=>document.getElementById(id).value.split('\n').map(s=>s.trim()).filter(Boolean);
   D.com=L('cm');D.spo=L('sp');D.clubs=L('cl').map(s=>{const[a,...b]=s.split('|');return{n:a,l:b.join('|')}});D.fb=L('fb').map(s=>{const[a,...b]=s.split('|');return{n:a,t:b.join('|')}});
   sortAll(D);save(D);draw();alert('تم الحفظ وترتيب الفرق ✅')};};
  const grab=()=>{D.teams=[...document.querySelectorAll('#tt tr')].slice(1).map(r=>{const i=r.querySelectorAll('input');return{n:i[0].value,p:+i[1].value||0,gf:+i[2].value||0,ga:+i[3].value||0,pts:+i[4].value||0}})};
  draw();
 }
}
