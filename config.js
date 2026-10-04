/* ============================================================
   EDIT ONLY THIS FILE to change names, date, venue, gifts, etc.
   ============================================================ */
window.WEDDING = {
  groom: { full: "Arrotama Hafedmawan", nick: "Arrotama", father: "XXX", mother: "XXX" },
  bride: { full: "Assyati Amadjida Tamimi Marzuki", nick: "Assyati", father: "XXX", mother: "XXX" },

  // Date + time in Jakarta time (WIB, +07:00). Change the time when confirmed.
  dateISO: "2026-11-14T10:00:00+07:00",
  durationHours: 3,
  timeLabel: "10.00 WIB – selesai",

  venueName: "SMP Mekar Tanjung",
  venueAddress: "SMP Mekar Tanjung, Jakarta Utara",
  mapsUrl: "https://www.google.com/maps/place/Sekolah+Menengah+Pertama+Mekar+Tanjung/@-6.1220597,106.8772953,17z/data=!3m1!4b1!4m6!3m5!1s0x2e6a1fc56154254f:0x84eb30899205e3d5!8m2!3d-6.1220597!4d106.8772953!16s%2Fg%2F1hm3zj4nv!18m1!1e1?entry=ttu&g_ep=EgoyMDI2MDkzMC4wIKXMDSoASAFQAw%3D%3D",
  // Embedded map (no API key needed)
  mapsEmbed: "https://maps.google.com/maps?q=-6.1220597,106.8772953&z=17&output=embed",

  calendar: {
    title: "Wedding of Assyati & Arrotama",
    description: "Kami mengundang Anda untuk hadir di hari bahagia kami. Merupakan kehormatan bagi kami atas kehadiran dan doa restu Anda."
  },

  gift: {
    bankName: "Nama Bank",
    accountNumber: "XXX",
    accountHolder: "XXX",
    address: "XXX"
  },

  // Paste your Google Apps Script Web App URL here (ends with /exec). See README.
  scriptUrl: "https://docs.google.com/spreadsheets/d/1ThSZIkxWgS1VrJZWCSDOOoCDOHujK3UdVHQRcIbQMJI/edit?gid=0#gid=0",

  // Put an mp3 at assets/music.mp3 (see README). Leave "" to hide the music button.
  music: "assets/music.mp3",

  // Photos in /assets (jpg/webp). Missing files fall back to a soft gradient.
  photos: {
    cover:   "assets/cover.jpg",
    closing: "assets/cover.jpg",
    g1: "assets/groom.jpg",   // tall photo
    g2: "assets/cover.jpg",
    g3: "assets/bride.jpg"
  }
};
