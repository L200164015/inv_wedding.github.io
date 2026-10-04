(function(){
  const C = window.WEDDING;
  const $ = s => document.querySelector(s);
  const when = new Date(C.dateISO);
  const fmt = (o,l="id-ID") => new Intl.DateTimeFormat(l,{timeZone:"Asia/Jakarta",...o}).format(when);

  /* ---------- fill content ---------- */
  const text = (id,v)=>{const e=document.getElementById(id); if(e) e.textContent=v;};
  text("cvBride",C.bride.nick); text("cvGroom",C.groom.nick);
  text("cvDate",fmt({day:"numeric",month:"long",year:"numeric"}));
  text("brideFull",C.bride.full); text("groomFull",C.groom.full);
  text("clNames",`${C.bride.nick} & ${C.groom.nick}`);
  document.querySelectorAll("[data-k]").forEach(el=>{
    el.textContent = el.dataset.k.split(".").reduce((o,k)=>o[k],C);
  });
  text("evDow",fmt({weekday:"long"})); text("evDay",fmt({day:"numeric"}));
  text("evMonth",fmt({month:"long",year:"numeric"})); text("evTime",C.timeLabel);
  text("venueName",C.venueName); text("venueAddr",C.venueAddress);
  text("giftBank",C.gift.bankName); text("giftNum",C.gift.accountNumber);
  text("giftHolder","a.n. "+C.gift.accountHolder); text("giftAddr",C.gift.address);

  const to = new URLSearchParams(location.search).get("to");
  if(to) text("guestName",to);

  /* ---------- photos (graceful fallback) ---------- */
  document.querySelectorAll("[data-photo]").forEach(el=>{
    const src = C.photos[el.dataset.photo]; if(!src) return;
    const probe = new Image();
    probe.onload=()=>{
      if(el.tagName==="IMG") el.src=src; else {el.style.backgroundImage=`url(${src})`; el.classList.add("has");}
    };
    probe.src=src;
  });

  /* ---------- links ---------- */
  $("#venueLink").href=C.mapsUrl; $("#mapBtn").href=C.mapsUrl; $("#mapFrame").src=C.mapsEmbed;
  const z = d => d.toISOString().replace(/[-:]|\.\d{3}/g,"");
  const end = new Date(when.getTime()+C.durationHours*3600e3);
  $("#saveDate").href="https://calendar.google.com/calendar/render?action=TEMPLATE"
    +"&text="+encodeURIComponent(C.calendar.title)
    +"&dates="+z(when)+"/"+z(end)
    +"&details="+encodeURIComponent(C.calendar.description)
    +"&location="+encodeURIComponent(C.venueName+", "+C.venueAddress)
    +"&ctz=Asia/Jakarta";

  /* ---------- countdown ---------- */
  const pad=n=>String(n).padStart(2,"0");
  function tick(){
    let s=Math.max(0,Math.floor((when-Date.now())/1000));
    $("#cd-d").textContent=pad(Math.floor(s/86400)); s%=86400;
    $("#cd-h").textContent=pad(Math.floor(s/3600)); s%=3600;
    $("#cd-m").textContent=pad(Math.floor(s/60));
    $("#cd-s").textContent=pad(s%60);
  }
  tick(); setInterval(tick,1000);

  /* ---------- open cover, music, petals ---------- */
  const audio=$("#bgm"), mBtn=$("#musicBtn");
  if(C.music){ audio.src=C.music; mBtn.hidden=false; }
  const setMusic=on=>{ mBtn.classList.toggle("on",on); };
  mBtn.onclick=()=>{ if(audio.paused){audio.play().then(()=>setMusic(true)).catch(()=>{});} else {audio.pause();setMusic(false);} };

  $("#openBtn").onclick=()=>{
    $("#main").hidden=false; document.body.classList.remove("locked");
    $("#cover").classList.add("open");
    setTimeout(()=>{$("#cover").style.display="none";window.scrollTo(0,0);},1000);
    if(C.music) audio.play().then(()=>setMusic(true)).catch(()=>{});
    if(!matchMedia("(prefers-reduced-motion:reduce)").matches) petals();
  };
  function petals(){
    const box=$("#petals");
    for(let i=0;i<16;i++){
      const p=document.createElement("i"); p.className="petal";
      p.style.left=Math.random()*100+"vw";
      p.style.setProperty("--dx",(Math.random()*120-60)+"px");
      p.style.animationDuration=(7+Math.random()*6)+"s";
      p.style.animationDelay=(Math.random()*4)+"s";
      p.style.transform=`scale(${.6+Math.random()*.8})`;
      box.appendChild(p);
    }
    setTimeout(()=>box.innerHTML="",18000);
  }

  /* ---------- copy ---------- */
  $("#copyBtn").onclick=async e=>{
    try{await navigator.clipboard.writeText(C.gift.accountNumber);e.target.textContent="Tersalin";}
    catch{e.target.textContent="Salin manual";}
    setTimeout(()=>e.target.textContent="Salin nomor",2000);
  };

  /* ---------- RSVP + wishes ---------- */
  const form=$("#rsvpForm"), status=$("#formStatus"), list=$("#wishList");
  form.attendance.forEach(r=>r.addEventListener("change",()=>{
    $("#guestsRow").style.display = form.attendance.value==="Hadir" ? "" : "none";
  }));

  function renderWishes(items){
    list.innerHTML="";
    if(!items.length){ list.innerHTML='<p class="empty">Jadilah yang pertama mengirim ucapan.</p>'; return; }
    items.forEach(w=>{
      const d=document.createElement("div"); d.className="wish";
      const n=document.createElement("b"); n.textContent=w.name;
      const m=document.createElement("p"); m.textContent="“"+w.message+"”";
      d.append(n,m); list.appendChild(d);
    });
  }
  async function loadWishes(){
    if(!C.scriptUrl){ renderWishes([{name:"Ade Fitriyani",message:"Wishing you both a lifetime of happiness!"}]); return; }
    try{
      const r=await fetch(C.scriptUrl+"?action=wishes&_="+Date.now());
      const j=await r.json(); renderWishes(j.wishes||[]);
    }catch{ if(!list.children.length||list.querySelector(".empty")) list.innerHTML='<p class="empty">Ucapan belum dapat dimuat. Coba muat ulang halaman.</p>'; }
  }
  loadWishes(); setInterval(loadWishes,30000);

  form.addEventListener("submit",async e=>{
    e.preventDefault(); status.className="status";
    const name=form.name.value.trim();
    if(!name){ status.textContent="Isi nama lengkap Anda terlebih dahulu."; status.classList.add("err"); form.name.focus(); return; }
    if(form.website.value) return; // honeypot
    if(!C.scriptUrl){ status.textContent="Alamat Google Apps Script belum diisi di config.js."; status.classList.add("err"); return; }
    const attending=form.attendance.value==="Hadir";
    const payload={name,attendance:form.attendance.value,guests:attending?form.guests.value:"0",message:form.message.value.trim()};
    const btn=$("#sendBtn"); btn.disabled=true; btn.textContent="Mengirim…";
    try{
      await fetch(C.scriptUrl,{method:"POST",mode:"no-cors",headers:{"Content-Type":"text/plain;charset=utf-8"},body:JSON.stringify(payload)});
      status.textContent="Terima kasih, konfirmasi Anda sudah terkirim."; status.classList.add("ok");
      if(payload.message){
        const cur=[...list.querySelectorAll(".wish")].map(w=>({name:w.querySelector("b").textContent,message:w.querySelector("p").textContent.replace(/^“|”$/g,"")}));
        renderWishes([{name,message:payload.message},...cur]);
      }
      form.reset(); $("#guestsRow").style.display="";
      setTimeout(loadWishes,3000);
    }catch{ status.textContent="Gagal mengirim. Periksa koneksi lalu kirim ulang."; status.classList.add("err"); }
    btn.disabled=false; btn.textContent="Kirim Konfirmasi";
  });
})();
