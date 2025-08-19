// Auto slider scroll
document.addEventListener("DOMContentLoaded", () => {
    const slider = document.querySelector(".slider");
    let scrollAmount = 0;

    if (slider) { // Pastikan slider ada sebelum menjalankan skripnya
        const scrollNext = () => {
            const slideWidth = slider.clientWidth;
            if (scrollAmount >= (slider.scrollWidth - slideWidth)) {
                scrollAmount = 0; // kembali ke awal
            } else {
                scrollAmount += slideWidth;
            }

            slider.scrollTo({
                left: scrollAmount,
                behavior: 'smooth'
            });
        };

        setInterval(scrollNext, 5000); // setiap 5 detik
    }

    // --- Skrip untuk Menu Toggle Navigasi Mobile ---
    const mobileMenu = document.getElementById('mobile-menu');
    const navMenu = document.querySelector('.nav-menu');

    if (mobileMenu && navMenu) { // Pastikan elemen-elemen ada di DOM
        mobileMenu.addEventListener('click', function() {
            navMenu.classList.toggle('active');
        });

        // Opsional: Tutup menu ketika link di dalam menu diklik
        navMenu.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                // Periksa apakah menu sedang aktif di mobile sebelum menutup
                if (window.innerWidth <= 768 && navMenu.classList.contains('active')) {
                    navMenu.classList.remove('active');
                }
            });
        });
    }

    // --- Skrip untuk Animasi Penghitungan Jumlah Penduduk (demografi.html) ---
    const jumlahPendudukElement = document.getElementById('jumlahPenduduk');
    if (jumlahPendudukElement) { // Hanya jalankan jika elemen ada di halaman
        const target = parseInt(jumlahPendudukElement.getAttribute('data-target'));
        let current = 0;
        const duration = 2000; // Durasi animasi dalam ms
        const increment = target / (duration / 10); // Perhitungan per 10ms

        const animateCount = () => {
            if (current < target) {
                current += increment;
                if (current > target) current = target;
                jumlahPendudukElement.textContent = Math.floor(current);
                requestAnimationFrame(animateCount);
            } else {
                jumlahPendudukElement.textContent = target;
            }
        };
        animateCount();
    }
});