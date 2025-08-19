// File: js/berita-detail-loader.js

// LANGKAH 1: Import fungsi yang kita butuhkan langsung di sini.
// Ini cara yang lebih modern dan aman untuk memuat library.
import { documentToHtmlString } from 'https://cdn.skypack.dev/@contentful/rich-text-html-renderer';

// Ambil slug dari parameter URL
const params = new URLSearchParams(window.location.search);
const slug = params.get('slug');

// Fungsi untuk mengambil satu data berita spesifik berdasarkan slug
async function fetchBeritaDetail(slug) {
    const url = `https://cdn.contentful.com/spaces/${SPACE_ID}/environments/master/entries?access_token=${ACCESS_TOKEN}&content_type=berita&fields.slug=${slug}`;

    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error('Gagal memuat berita.');
        const data = await response.json();

        if (data.items.length === 0) {
            document.getElementById('detail-berita-container').innerHTML = '<p>Berita tidak ditemukan.</p>';
            return;
        }

        const item = data.items[0];
        const imageUrl = data.includes.Asset.find(asset => asset.sys.id === item.fields.gambarUtama.sys.id).fields.file.url;

        displayBeritaDetail({
            judul: item.fields.judul,
            tanggal: new Date(item.fields.tanggalPublikasi).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }),
            gambar: `https:${imageUrl}`,
            isiBerita: item.fields.isiBerita,
            penulis: item.fields.penulis
        });

    } catch (error) {
        console.error(error);
        document.getElementById('detail-berita-container').innerHTML = `<p>Terjadi kesalahan saat memuat berita. Coba lagi nanti.</p>`;
    }
}

// Fungsi untuk menampilkan data detail di elemen HTML
function displayBeritaDetail(post) {
    const loadingEl = document.getElementById('loading-detail');
    const contentEl = document.querySelector('.berita-detail-content');
    
    loadingEl.style.display = 'none';
    contentEl.style.display = 'block';

    document.title = `${post.judul} - Padukuhan Nasri`;
    document.getElementById('detail-judul').textContent = post.judul;
    document.getElementById('detail-tanggal').innerHTML = `<i class="far fa-calendar-alt"></i> ${post.tanggal}`;
    document.getElementById('detail-penulis').innerHTML = `<i class="far fa-user"></i> Oleh: ${post.penulis}`; // <-- TAMBAHKAN INI

    const gambarEl = document.getElementById('detail-gambar');
    gambarEl.src = post.gambar;
    gambarEl.alt = post.judul;

    const isiContainer = document.getElementById('detail-isi');
    const htmlIsi = documentToHtmlString(post.isiBerita);
    isiContainer.innerHTML = htmlIsi;
}

// Jalankan fungsi utama jika ada slug di URL
if (slug) {
    fetchBeritaDetail(slug);
} else {
    document.getElementById('detail-berita-container').innerHTML = '<p>Berita yang Anda cari tidak tersedia.</p>';
}