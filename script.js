function masuk() {
  const nama = document.getElementById("username").value.trim();
  if (!nama) return alert("Nama tidak boleh kosong!");
  localStorage.setItem("nama", nama);
  localStorage.setItem("coin", "0");

  const uid = authCore.currentUser.uid;
  dbCore.ref("data/" + uid + "/profile").set({
    nama: nama,
    waktu_login: new Date().toISOString()
  });

  document.getElementById("login-screen").classList.add("fade-out");
  setTimeout(() => {
    document.getElementById("login-screen").style.display = "none";
    document.getElementById("dashboard").style.display = "block";
    tampilkan("beranda");
  }, 1000);
}

function tampilkan(halaman) {
  const content = document.getElementById("content");
  content.innerHTML = "";

  if (halaman === "beranda") {
    const produkList = [
      { nama: "Tampilan NEXUS", harga: 2400, gambar: "https://files.catbox.moe/uws3hf.jpg" },
      { nama: "Tampilan MPO", harga: 4300, gambar: "https://img1.pixhost.to/images/6985/618710396_imgtmp.jpg" },
      { nama: "Tampilan UG", harga: 3500, gambar: "https://files.catbox.moe/8kfqt1.jpg" },
      { nama: "Tampilan IDN", harga: 2700000, gambar: "https://img1.pixhost.to/images/6985/618710873_imgtmp.jpg" }
    ];
    produkList.forEach((p) => {
      const card = document.createElement("div");
      card.className = "produk-card";
      card.innerHTML = `
        <img src="${p.gambar}" alt="${p.nama}" />
        <h3>${p.nama}</h3>
        <p>Harga: 💰 Rp${p.harga.toLocaleString()} (${Math.floor(p.harga / 1000)} coin)</p>
        <button onclick="pesanProduk('${p.nama}', ${p.harga})">💬 Pesan Sekarang</button>
      `;
      content.appendChild(card);
    });
  }

  if (halaman === "deposit") {
    content.innerHTML = `
      <h2>💸 Deposit Coin</h2>
      <input type="number" id="jumlah-deposit" placeholder="Masukkan jumlah (Rp)" />
      <button class="kirim-wa" onclick="kirimDeposit()">Kirim ke WhatsApp</button>
    `;
  }

  if (halaman === "akun") {
    const nama = localStorage.getItem("nama");
    const coin = localStorage.getItem("coin") || "0";
    content.innerHTML = `
      <h2>👤 Akun Saya</h2>
      <img src="https://img1.pixhost.to/images/6988/618738275_reyytourl.jpg" width="80" />
      <p>Nama: <strong>${nama}</strong></p>
      <p>Coin: <strong id="coin-count">💰 ${coin}</strong></p>
      <input type="text" id="nama-baru" placeholder="Ganti Nama Anda" />
      <button onclick="gantiNama()">🔁 Simpan Nama Baru</button>
      <button onclick="logout()">🚪 Log Out</button>
    `;
  }
}

function pesanProduk(namaProduk, harga) {
  const nama = localStorage.getItem("nama");
  const uid = authCore.currentUser.uid;
  const pesan = `Halo Admin, saya beli *${namaProduk}* seharga Rp${harga.toLocaleString()} (${Math.floor(harga / 1000)} coin).\nNama: ${nama}`;
  const url = `https://wa.me/6283142313394?text=${encodeURIComponent(pesan)}`;
  window.open(url, "_blank");

  dbCore.ref("data/" + uid + "/orders").push({
    produk: namaProduk,
    harga: harga,
    coin: Math.floor(harga / 1000),
    waktu: new Date().toISOString()
  });
}

function kirimDeposit() {
  const nominal = parseInt(document.getElementById("jumlah-deposit").value);
  if (!nominal || nominal < 10000) return alert("Minimal deposit Rp10.000");
  const coin = Math.floor(nominal / 1000);
  const nama = localStorage.getItem("nama");
  const uid = authCore.currentUser.uid;

  const pesan = `Halo Admin, saya ingin deposit Rp${nominal.toLocaleString()} untuk ${coin} coin.\nNama: ${nama}`;
  const url = `https://wa.me/6283142313394?text=${encodeURIComponent(pesan)}`;
  window.open(url, "_blank