// File: js/berita-loader.js

const CONTENTFUL_URL = `https://cdn.contentful.com/spaces/${SPACE_ID}/environments/master/entries?access_token=${ACCESS_TOKEN}&content_type=berita`;

// Variabel untuk menyimpan status pagination
let currentPage = 1;
const POSTS_PER_PAGE = 10; // Atur berapa berita yang tampil per halaman/klik

// Fungsi untuk mengambil data berita, sekarang lebih canggih
async function fetchBerita(page = 1, limit = POSTS_PER_PAGE) {
    try {
        const skip = (page - 1) * limit;
        let url = `${CONTENTFUL_URL}&limit=${limit}&skip=${skip}&order=-fields.tanggalPublikasi`;

        const response = await fetch(url);
        if (!response.ok) throw new Error('Gagal mengambil data dari Contentful.');
        
        const data = await response.json();
        
        const posts = data.items.map(item => {
            const imageUrl = data.includes.Asset.find(asset => asset.sys.id === item.fields.gambarUtama.sys.id).fields.file.url;
            return {
                judul: item.fields.judul,
                tanggal: new Date(item.fields.tanggalPublikasi).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }),
                gambar: `https:${imageUrl}`,
                slug: item.fields.slug,
                penulis: item.fields.penulis
            };
        });
        
        // Kembalikan posts dan total jumlahnya
        return { posts: posts, total: data.total };

    } catch (error) {
        console.error('Error:', error);
        return { posts: [], total: 0 };
    }
}

// Fungsi untuk menampilkan berita di HTML
function tampilkanBerita(posts, container, isSidebar = false, append = false) {
    if (!container) return;

    const loadingEl = document.getElementById('loading-berita');
    if (loadingEl) loadingEl.style.display = 'none';

    if (!append) { // Jika bukan append, kosongkan dulu
        container.innerHTML = '';
    }
    
    if (posts.length === 0 && !append) {
        container.innerHTML = '<p>Belum ada berita yang dipublikasikan.</p>';
        return;
    }
    
    posts.forEach(post => {
        const postHTML = isSidebar ? `
            <div class="berita-item">
                <img src="${post.gambar}" alt="${post.judul}" class="berita-thumbnail">
                <div class="berita-content-text">
                    <h4><a href="berita-detail.html?slug=${post.slug}">${post.judul}</a></h4>
                    <div class="meta-info-sidebar">
                        <span><i class="far fa-calendar-alt"></i> ${post.tanggal}</span>
                        <span><i class="far fa-user"></i> ${post.penulis}</span>
                    </div>
                </div>
            </div>
        ` : `
            <div class="berita-card">
                <img src="${post.gambar}" alt="${post.judul}" class="berita-card-img">
                <div class="berita-card-content">
                    <div class="meta-info">
                        <span class="tanggal-berita"><i class="far fa-calendar-alt"></i> ${post.tanggal}</span>
                        <span class="penulis-berita"><i class="far fa-user"></i> ${post.penulis}</span>
                    </div>
                    <h3><a href="berita-detail.html?slug=${post.slug}">${post.judul}</a></h3>
                    <a href="berita-detail.html?slug=${post.slug}" class="btn-read-more">Baca Selengkapnya</a>
                </div>
            </div>
        `;
        container.innerHTML += postHTML;
    });
}

// Fungsi utama yang dijalankan saat halaman dimuat
document.addEventListener('DOMContentLoaded', async () => {
    const sidebarContainer = document.getElementById('berita-sidebar-container');
    const arsipContainer = document.getElementById('daftar-berita-container');

    // Untuk sidebar di index.html (ambil 4 berita)
    if (sidebarContainer) {
        const { posts } = await fetchBerita(1, 4);
        tampilkanBerita(posts, sidebarContainer, true);
    }

    // Untuk halaman arsip berita
    if (arsipContainer) {
        const { posts, total } = await fetchBerita(currentPage, POSTS_PER_PAGE);
        tampilkanBerita(posts, arsipContainer, false);
        
        const totalLoaded = arsipContainer.children.length;
        if (totalLoaded < total) {
            setupLoadMoreButton(total);
        }
    }
});

// Fungsi untuk membuat dan menangani tombol "Load More"
function setupLoadMoreButton(totalPosts) {
    const container = document.getElementById('load-more-container');
    container.innerHTML = `<button id="load-more-btn" class="btn-read-more">Muat Lebih Banyak</button>`;
    
    const button = document.getElementById('load-more-btn');
    
    button.addEventListener('click', async () => {
        button.textContent = 'Memuat...';
        button.disabled = true;
        
        currentPage++;
        const { posts } = await fetchBerita(currentPage, POSTS_PER_PAGE);
        
        const arsipContainer = document.getElementById('daftar-berita-container');
        tampilkanBerita(posts, arsipContainer, false, true); // `true` untuk append
        
        const totalLoaded = arsipContainer.children.length;
        if (totalLoaded >= totalPosts) {
            container.remove(); // Hapus tombol jika semua berita sudah dimuat
        } else {
            button.textContent = 'Muat Lebih Banyak';
            button.disabled = false;
        }
    });
}