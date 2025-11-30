// Array untuk menyimpan data sementara (Simulasi Database)
let studentsData = [];

// Seleksi Elemen DOM
const form = document.getElementById('data-form');
const tableBody = document.getElementById('table-body');
const totalStudentEl = document.getElementById('total-students');
const totalPassEl = document.getElementById('total-pass');

// Navigasi Halaman (Sederhana, menyembunyikan/menampilkan section)
function showPage(pageId) {
    // Sembunyikan semua view
    document.querySelectorAll('.view').forEach(view => {
        view.classList.remove('active');
        view.classList.add('hidden');
    });

    // Tampilkan view yang dipilih
    const target = document.getElementById(pageId === 'dashboard' ? 'dashboard-view' : 'input-view');
    target.classList.remove('hidden');
    target.classList.add('active');

    // Update state navigasi sidebar
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.classList.remove('active');
    });
    // Logika sederhana untuk highlight menu (optional improvement)
    if(pageId === 'dashboard') document.querySelector('.nav-links li:first-child a').classList.add('active');
    else document.querySelector('.nav-links li:last-child a').classList.add('active');
}

// Event Listener saat Form disubmit
form.addEventListener('submit', function(event) {
    event.preventDefault(); // Mencegah reload halaman

    // Ambil nilai dari input
    const nim = document.getElementById('nim').value;
    const nama = document.getElementById('nama').value;
    const prodi = document.getElementById('prodi').value;
    const angkatan = document.getElementById('angkatan').value;
    const matkul = document.getElementById('matkul').value;
    const nilai = parseInt(document.getElementById('nilai').value);

    // Validasi Sederhana
    if (!nim || !nama || !matkul) {
        alert("Mohon lengkapi data!");
        return;
    }

    // Tentukan Status Kelulusan (Logika Bisnis Sederhana)
    const status = nilai >= 60 ? 'Lulus' : 'Tidak Lulus';

    // Buat Object Data Baru
    const newStudent = {
        id: Date.now(), // ID unik menggunakan timestamp
        nim,
        nama,
        prodi,
        angkatan,
        matkul,
        nilai,
        status
    };

    // Simpan ke Array
    studentsData.push(newStudent);

    // Reset Form
    form.reset();

    // Render ulang tabel
    renderTable();

    // Kembali ke halaman dashboard
    showPage('dashboard');
});

// Fungsi untuk me-render tabel dari data Array
function renderTable() {
    tableBody.innerHTML = ''; // Kosongkan tabel saat ini

    if (studentsData.length === 0) {
        tableBody.innerHTML = `
            <tr class="empty-row">
                <td colspan="7" style="text-align:center;">Belum ada data mahasiswa.</td>
            </tr>`;
        updateStats();
        return;
    }

    studentsData.forEach((student, index) => {
        // Tentukan class CSS untuk badge status
        const statusClass = student.status === 'Lulus' ? 'status-pass' : 'status-fail';

        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${student.nim}</td>
            <td><strong>${student.nama}</strong></td>
            <td>${student.prodi} (${student.angkatan})</td>
            <td>${student.matkul}</td>
            <td>${student.nilai}</td>
            <td><span class="${statusClass}">${student.status}</span></td>
            <td>
                <button class="btn-delete" onclick="deleteStudent(${student.id})">Hapus</button>
            </td>
        `;
        tableBody.appendChild(row);
    });

    updateStats();
}

// Fungsi Menghapus Data
function deleteStudent(id) {
    if(confirm('Yakin ingin menghapus data ini?')) {
        studentsData = studentsData.filter(student => student.id !== id);
        renderTable();
    }
}

// Fungsi Update Statistik di Dashboard
function updateStats() {
    totalStudentEl.textContent = studentsData.length;
    
    const passedCount = studentsData.filter(s => s.status === 'Lulus').length;
    totalPassEl.textContent = passedCount;
}