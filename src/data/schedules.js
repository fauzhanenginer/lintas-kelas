// Data 8 Penanggung Jawab Mata Kuliah (PJMK)
export const LIST_PJMK = [
  { id: 1, nama: "Dzikri", roleName: "PJMK Pancasila", matkul: "Pendidikan Pancasila", noHp: "6288905758365" },
  { id: 2, nama: "Sofia", roleName: "PJMK English", matkul: "General English", noHp: "6289655694389" },
  { id: 3, nama: "Rafitama", roleName: "PJMK Pengantar TI", matkul: "Pengantar Teknik Industri", noHp: "6285693254975" },
  { id: 4, nama: "Sawian", roleName: "PJMK Kimia Dasar", matkul: "Kimia Dasar I", noHp: "6281288132350" },
  { id: 5, nama: "Reyhan", roleName: "PJMK Kalkulus I", matkul: "Kalkulus I", noHp: "6285774607356" },
  { id: 6, nama: "Dimas", roleName: "PJMK Fisika Dasar", matkul: "Fisika Dasar I", noHp: "6285715839979" },
  { id: 7, nama: "Isam", roleName: "PJMK Biologi", matkul: "Biologi: Anatomi dan Fisiologi manusia", noHp: "6285157137011" },
  { id: 8, nama: "Ilyas", roleName: "PJMK Gambar Teknik", matkul: "Menggambar Teknik", noHp: "6281319608605" }
];

// Jadwal Kelas Asal TI26G
export const SCHEDULE_DATA = [
  { hari: "Senin", matkul: "Kimia Dasar I", tipe: "Teori (T)", jam: "18.15 - 19.55", ruangan: "F207", dosen: "Weni Tri Sasmi, S.Pd.,M.Pd", pjmk: "Sawian", kelas: "TI26G" },
  { hari: "Selasa", matkul: "Pengantar Teknik Industri", tipe: "Teori", jam: "13.00 - 14.40", ruangan: "A304", dosen: "Suryadi, S.T., M.T", pjmk: "Rafitama", kelas: "TI26G" },
  { hari: "Selasa", matkul: "Menggambar Teknik", tipe: "Praktikum (P)", jam: "18.15 - 19.55", ruangan: "LAB", dosen: "Roban, S.T., M.T", pjmk: "Ilyas", kelas: "TI26G" },
  { hari: "Selasa", matkul: "Menggambar Teknik", tipe: "Teori (T)", jam: "20.00 - 21.40", ruangan: "F404", dosen: "Roban, S.T., M.T", pjmk: "Ilyas", kelas: "TI26G" },
  { hari: "Rabu", matkul: "Fisika Dasar I", tipe: "Teori", jam: "15.00 - 16.40", ruangan: "A306", dosen: "Karnadi, S.T., M.T", pjmk: "Dimas", kelas: "TI26G" },
  { hari: "Rabu", matkul: "Pendidikan Pancasila", tipe: "Teori", jam: "18.15 - 19.55", ruangan: "F302", dosen: "Dr. Aris Riswandi Sanusi, M.Pd.", pjmk: "Dzikri", kelas: "TI26G" },
  { hari: "Rabu", matkul: "Biologi: Anatomi dan Fisiologi manusia", tipe: "Teori", jam: "20.00 - 21.40", ruangan: "F407", dosen: "Surya Amal, S.Si., M.Kes, Apt", pjmk: "Isam", kelas: "TI26G" },
  { hari: "Kamis", matkul: "Kalkulus I", tipe: "Teori", jam: "15.00 - 16.40", ruangan: "F308", dosen: "Imas Indah Mutiara, S.Pd., M.Pd", pjmk: "Reyhan", kelas: "TI26G" },
  { hari: "Kamis", matkul: "Kimia Dasar I", tipe: "Praktikum (P)", jam: "18.15 - 19.55", ruangan: "LAB", dosen: "Weni Tri Sasmi, S.Pd.,M.Pd", pjmk: "Sawian", kelas: "TI26G" },
  { hari: "Kamis", matkul: "General English", tipe: "Teori", jam: "20.00 - 21.40", ruangan: "A403", dosen: "Hilda Tri Yulianti, S.Pd.,M.Pd", pjmk: "Sofia", kelas: "TI26G" }
];

// Pilihan Kelas Tujuan
export const TARGET_CLASSES_LIST = [
  "TI26A", "TI26B", "TI26C", "TI26D", "TI26E", "TI26F", 
  "TI26H", "TI26I", "TI26J", "TI26K", "TI26L"
];

// Database Lengkap Jadwal Seluruh Kelas (TI26A s/d TI26L) untuk Pencocokan Otomatis
export const ALL_CLASSES_SCHEDULES = [
  // TI26A
  { kelas: "TI26A", matkul: "Pendidikan Pancasila", tipe: "Teori", hari: "Kamis", jam: "07.00 - 08.40", ruangan: "F309", dosen: "Fitri Silvia Sofyan, M.Pd." },
  { kelas: "TI26A", matkul: "General English", tipe: "Teori", hari: "Selasa", jam: "11.00 - 12.40", ruangan: "A305", dosen: "Hilda Tri Yulianti, S.Pd.,M.Pd" },
  { kelas: "TI26A", matkul: "Pengantar Teknik Industri", tipe: "Teori", hari: "Kamis", jam: "11.00 - 12.40", ruangan: "A304", dosen: "Ir. Ade Suhara, S.T., M.T IPU" },
  { kelas: "TI26A", matkul: "Kimia Dasar I", tipe: "Teori (T)", hari: "Kamis", jam: "13.00 - 14.40", ruangan: "F207", dosen: "Akda Zahrotul Wahtoni, S.S.i.,M.Si" },
  { kelas: "TI26A", matkul: "Kimia Dasar I", tipe: "Praktikum (P)", hari: "Kamis", jam: "09.00 - 10.40", ruangan: "LAB", dosen: "Yuni Syifau Rohmah, S.Pd.,M.Pd" },
  { kelas: "TI26A", matkul: "Kalkulus I", tipe: "Teori", hari: "Rabu", jam: "07.00 - 08.40", ruangan: "F207", dosen: "Imas Indah Mutiara, S.Pd., M.Pd" },
  { kelas: "TI26A", matkul: "Fisika Dasar I", tipe: "Teori", hari: "Jumat", jam: "07.00 - 08.40", ruangan: "A306", dosen: "Karnadi, S.T., M.T" },
  { kelas: "TI26A", matkul: "Biologi: Anatomi dan Fisiologi manusia", tipe: "Teori", hari: "Rabu", jam: "09.00 - 10.40", ruangan: "A306", dosen: "Surya Amal, S.Si., M.Kes, Apt" },
  { kelas: "TI26A", matkul: "Menggambar Teknik", tipe: "Teori (T)", hari: "Jumat", jam: "13.00 - 14.40", ruangan: "A406", dosen: "Roban, S.T., M.T" },
  { kelas: "TI26A", matkul: "Menggambar Teknik", tipe: "Praktikum (P)", hari: "Jumat", jam: "15.00 - 16.40", ruangan: "LAB", dosen: "Roban, S.T., M.T" },

  // TI26B
  { kelas: "TI26B", matkul: "Pendidikan Pancasila", tipe: "Teori", hari: "Kamis", jam: "09.00 - 10.40", ruangan: "F309", dosen: "Fitri Silvia Sofyan, M.Pd." },
  { kelas: "TI26B", matkul: "General English", tipe: "Teori", hari: "Selasa", jam: "07.00 - 08.40", ruangan: "A305", dosen: "Hilda Tri Yulianti, S.Pd.,M.Pd" },
  { kelas: "TI26B", matkul: "Pengantar Teknik Industri", tipe: "Teori", hari: "Selasa", jam: "15.00 - 16.40", ruangan: "A304", dosen: "Suryadi, S.T., M.T" },
  { kelas: "TI26B", matkul: "Kimia Dasar I", tipe: "Teori (T)", hari: "Kamis", jam: "07.00 - 08.40", ruangan: "F207", dosen: "Akda Zahrotul Wahtoni, S.S.i.,M.Si" },
  { kelas: "TI26B", matkul: "Kimia Dasar I", tipe: "Praktikum (P)", hari: "Kamis", jam: "11.00 - 12.40", ruangan: "LAB", dosen: "Yuni Syifau Rohmah, S.Pd.,M.Pd" },
  { kelas: "TI26B", matkul: "Kalkulus I", tipe: "Teori", hari: "Rabu", jam: "09.00 - 10.40", ruangan: "F207", dosen: "Imas Indah Mutiara, S.Pd., M.Pd" },
  { kelas: "TI26B", matkul: "Fisika Dasar I", tipe: "Teori", hari: "Jumat", jam: "09.00 - 10.40", ruangan: "A306", dosen: "Karnadi, S.T., M.T" },
  { kelas: "TI26B", matkul: "Biologi: Anatomi dan Fisiologi manusia", tipe: "Teori", hari: "Rabu", jam: "07.00 - 08.40", ruangan: "A306", dosen: "Surya Amal, S.Si., M.Kes, Apt" },
  { kelas: "TI26B", matkul: "Menggambar Teknik", tipe: "Teori (T)", hari: "Senin", jam: "09.00 - 10.40", ruangan: "A406", dosen: "Roban, S.T., M.T" },
  { kelas: "TI26B", matkul: "Menggambar Teknik", tipe: "Praktikum (P)", hari: "Jumat", jam: "07.00 - 08.40", ruangan: "LAB", dosen: "Roban, S.T., M.T" },

  // TI26C
  { kelas: "TI26C", matkul: "Pendidikan Pancasila", tipe: "Teori", hari: "Kamis", jam: "13.00 - 14.40", ruangan: "F309", dosen: "Fitri Silvia Sofyan, M.Pd." },
  { kelas: "TI26C", matkul: "General English", tipe: "Teori", hari: "Kamis", jam: "11.00 - 12.40", ruangan: "A403", dosen: "Hilda Tri Yulianti, S.Pd.,M.Pd" },
  { kelas: "TI26C", matkul: "Pengantar Teknik Industri", tipe: "Teori", hari: "Selasa", jam: "09.00 - 10.40", ruangan: "A304", dosen: "Ir. Ade Suhara, S.T., M.T IPU" },
  { kelas: "TI26C", matkul: "Kimia Dasar I", tipe: "Teori (T)", hari: "Kamis", jam: "09.00 - 10.40", ruangan: "F207", dosen: "Akda Zahrotul Wahtoni, S.S.i.,M.Si" },
  { kelas: "TI26C", matkul: "Kimia Dasar I", tipe: "Praktikum (P)", hari: "Kamis", jam: "07.00 - 08.40", ruangan: "LAB", dosen: "Yuni Syifau Rohmah, S.Pd.,M.Pd" },
  { kelas: "TI26C", matkul: "Kalkulus I", tipe: "Teori", hari: "Rabu", jam: "11.00 - 12.40", ruangan: "F207", dosen: "Imas Indah Mutiara, S.Pd., M.Pd" },
  { kelas: "TI26C", matkul: "Fisika Dasar I", tipe: "Teori", hari: "Senin", jam: "13.00 - 14.40", ruangan: "A404", dosen: "Karnadi, S.T., M.T" },
  { kelas: "TI26C", matkul: "Biologi: Anatomi dan Fisiologi manusia", tipe: "Teori", hari: "Rabu", jam: "13.00 - 14.40", ruangan: "A306", dosen: "Surya Amal, S.Si., M.Kes, Apt" },
  { kelas: "TI26C", matkul: "Menggambar Teknik", tipe: "Teori (T)", hari: "Senin", jam: "11.00 - 12.40", ruangan: "A406", dosen: "Roban, S.T., M.T" },
  { kelas: "TI26C", matkul: "Menggambar Teknik", tipe: "Praktikum (P)", hari: "Selasa", jam: "11.00 - 12.40", ruangan: "LAB", dosen: "Roban, S.T., M.T" },

  // TI26D
  { kelas: "TI26D", matkul: "Pendidikan Pancasila", tipe: "Teori", hari: "Kamis", jam: "11.00 - 12.40", ruangan: "F309", dosen: "Fitri Silvia Sofyan, M.Pd." },
  { kelas: "TI26D", matkul: "General English", tipe: "Teori", hari: "Kamis", jam: "09.00 - 10.40", ruangan: "A403", dosen: "Hilda Tri Yulianti, S.Pd.,M.Pd" },
  { kelas: "TI26D", matkul: "Pengantar Teknik Industri", tipe: "Teori", hari: "Selasa", jam: "11.00 - 12.40", ruangan: "A304", dosen: "Ir. Ade Suhara, S.T., M.T IPU" },
  { kelas: "TI26D", matkul: "Kimia Dasar I", tipe: "Teori (T)", hari: "Senin", jam: "07.00 - 08.40", ruangan: "F207", dosen: "Weni Tri Sasmi, S.Pd.,M.Pd" },
  { kelas: "TI26D", matkul: "Kimia Dasar I", tipe: "Praktikum (P)", hari: "Senin", jam: "11.00 - 12.40", ruangan: "LAB", dosen: "Weni Tri Sasmi, S.Pd.,M.Pd" },
  { kelas: "TI26D", matkul: "Kalkulus I", tipe: "Teori", hari: "Kamis", jam: "07.00 - 08.40", ruangan: "F308", dosen: "Imas Indah Mutiara, S.Pd., M.Pd" },
  { kelas: "TI26D", matkul: "Fisika Dasar I", tipe: "Teori", hari: "Jumat", jam: "13.00 - 14.40", ruangan: "A306", dosen: "Karnadi, S.T., M.T" },
  { kelas: "TI26D", matkul: "Biologi: Anatomi dan Fisiologi manusia", tipe: "Teori", hari: "Rabu", jam: "11.00 - 12.40", ruangan: "A306", dosen: "Surya Amal, S.Si., M.Kes, Apt" },
  { kelas: "TI26D", matkul: "Menggambar Teknik", tipe: "Teori (T)", hari: "Selasa", jam: "07.00 - 08.40", ruangan: "A406", dosen: "Roban, S.T., M.T" },
  { kelas: "TI26D", matkul: "Menggambar Teknik", tipe: "Praktikum (P)", hari: "Selasa", jam: "09.00 - 10.40", ruangan: "LAB", dosen: "Roban, S.T., M.T" },

  // TI26E
  { kelas: "TI26E", matkul: "Pendidikan Pancasila", tipe: "Teori", hari: "Rabu", jam: "09.00 - 10.40", ruangan: "F309", dosen: "Dr. Aris Riswandi Sanusi, M.Pd." },
  { kelas: "TI26E", matkul: "General English", tipe: "Teori", hari: "Selasa", jam: "09.00 - 10.40", ruangan: "A305", dosen: "Hilda Tri Yulianti, S.Pd.,M.Pd" },
  { kelas: "TI26E", matkul: "Pengantar Teknik Industri", tipe: "Teori", hari: "Kamis", jam: "07.00 - 08.40", ruangan: "A404", dosen: "Suryadi, S.T., M.T" },
  { kelas: "TI26E", matkul: "Kimia Dasar I", tipe: "Teori (T)", hari: "Senin", jam: "09.00 - 10.40", ruangan: "F207", dosen: "Weni Tri Sasmi, S.Pd.,M.Pd" },
  { kelas: "TI26E", matkul: "Kimia Dasar I", tipe: "Praktikum (P)", hari: "Selasa", jam: "07.00 - 08.40", ruangan: "LAB", dosen: "Weni Tri Sasmi, S.Pd.,M.Pd" },
  { kelas: "TI26E", matkul: "Kalkulus I", tipe: "Teori", hari: "Kamis", jam: "09.00 - 10.40", ruangan: "F308", dosen: "Imas Indah Mutiara, S.Pd., M.Pd" },
  { kelas: "TI26E", matkul: "Fisika Dasar I", tipe: "Teori", hari: "Rabu", jam: "07.00 - 08.40", ruangan: "A406", dosen: "Iin Lidia Putama Mursal, S.Si., M.Si." },
  { kelas: "TI26E", matkul: "Biologi: Anatomi dan Fisiologi manusia", tipe: "Teori", hari: "Senin", jam: "07.00 - 08.40", ruangan: "F404", dosen: "Surya Amal, S.Si., M.Kes, Apt" },
  { kelas: "TI26E", matkul: "Menggambar Teknik", tipe: "Teori (T)", hari: "Senin", jam: "13.00 - 14.40", ruangan: "A406", dosen: "Roban, S.T., M.T" },
  { kelas: "TI26E", matkul: "Menggambar Teknik", tipe: "Praktikum (P)", hari: "Jumat", jam: "09.00 - 10.40", ruangan: "LAB", dosen: "Roban, S.T., M.T" },

  // TI26F
  { kelas: "TI26F", matkul: "Pendidikan Pancasila", tipe: "Teori", hari: "Rabu", jam: "11.00 - 12.40", ruangan: "F309", dosen: "Dr. Aris Riswandi Sanusi, M.Pd." },
  { kelas: "TI26F", matkul: "General English", tipe: "Teori", hari: "Rabu", jam: "13.00 - 14.40", ruangan: "A404", dosen: "Hilda Tri Yulianti, S.Pd.,M.Pd" },
  { kelas: "TI26F", matkul: "Pengantar Teknik Industri", tipe: "Teori", hari: "Kamis", jam: "09.00 - 10.40", ruangan: "A404", dosen: "Suryadi, S.T., M.T" },
  { kelas: "TI26F", matkul: "Kimia Dasar I", tipe: "Teori (T)", hari: "Selasa", jam: "11.00 - 12.40", ruangan: "F308", dosen: "Weni Tri Sasmi, S.Pd.,M.Pd" },
  { kelas: "TI26F", matkul: "Kimia Dasar I", tipe: "Praktikum (P)", hari: "Selasa", jam: "09.00 - 10.40", ruangan: "LAB", dosen: "Weni Tri Sasmi, S.Pd.,M.Pd" },
  { kelas: "TI26F", matkul: "Kalkulus I", tipe: "Teori", hari: "Senin", jam: "07.00 - 08.40", ruangan: "A306", dosen: "Yuni Syifau Rohmah, S.Pd.,M.Pd" },
  { kelas: "TI26F", matkul: "Fisika Dasar I", tipe: "Teori", hari: "Kamis", jam: "07.00 - 08.40", ruangan: "A406", dosen: "Iin Lidia Putama Mursal, S.Si., M.Si." },
  { kelas: "TI26F", matkul: "Biologi: Anatomi dan Fisiologi manusia", tipe: "Teori", hari: "Senin", jam: "09.00 - 10.40", ruangan: "F404", dosen: "Surya Amal, S.Si., M.Kes, Apt" },
  { kelas: "TI26F", matkul: "Menggambar Teknik", tipe: "Teori (T)", hari: "Jumat", jam: "18.15 - 19.55", ruangan: "A306", dosen: "Roban, S.T., M.T" },
  { kelas: "TI26F", matkul: "Menggambar Teknik", tipe: "Praktikum (P)", hari: "Selasa", jam: "15.00 - 16.40", ruangan: "LAB", dosen: "Roban, S.T., M.T" },

  // TI26H
  { kelas: "TI26H", matkul: "Pendidikan Pancasila", tipe: "Teori", hari: "Rabu", jam: "13.00 - 14.40", ruangan: "F309", dosen: "Dr. Aris Riswandi Sanusi, M.Pd." },
  { kelas: "TI26H", matkul: "General English", tipe: "Teori", hari: "Rabu", jam: "18.15 - 19.55", ruangan: "F207", dosen: "Hilda Tri Yulianti, S.Pd.,M.Pd" },
  { kelas: "TI26H", matkul: "Pengantar Teknik Industri", tipe: "Teori", hari: "Rabu", jam: "20.00 - 21.40", ruangan: "A404", dosen: "Suryadi, S.T., M.T" },
  { kelas: "TI26H", matkul: "Kimia Dasar I", tipe: "Teori (T)", hari: "Kamis", jam: "20.00 - 21.40", ruangan: "A406", dosen: "Weni Tri Sasmi, S.Pd.,M.Pd" },
  { kelas: "TI26H", matkul: "Kimia Dasar I", tipe: "Praktikum (P)", hari: "Selasa", jam: "15.00 - 16.40", ruangan: "LAB", dosen: "Weni Tri Sasmi, S.Pd.,M.Pd" },
  { kelas: "TI26H", matkul: "Kalkulus I", tipe: "Teori", hari: "Senin", jam: "18.15 - 19.55", ruangan: "A404", dosen: "Yuni Syifau Rohmah, S.Pd.,M.Pd" },
  { kelas: "TI26H", matkul: "Fisika Dasar I", tipe: "Teori", hari: "Senin", jam: "20.00 - 21.40", ruangan: "A306", dosen: "Karnadi, S.T., M.T" },
  { kelas: "TI26H", matkul: "Biologi: Anatomi dan Fisiologi manusia", tipe: "Teori", hari: "Kamis", jam: "18.15 - 19.55", ruangan: "A408", dosen: "Surya Amal, S.Si., M.Kes, Apt" },
  { kelas: "TI26H", matkul: "Menggambar Teknik", tipe: "Teori (T)", hari: "Selasa", jam: "18.15 - 19.55", ruangan: "F406", dosen: "Ir. Fathurohman, S.Pd.,M.T" },
  { kelas: "TI26H", matkul: "Menggambar Teknik", tipe: "Praktikum (P)", hari: "Selasa", jam: "20.00 - 21.40", ruangan: "LAB", dosen: "Ir. Fathurohman, S.Pd.,M.T" },

  // TI26I
  { kelas: "TI26I", matkul: "Pendidikan Pancasila", tipe: "Teori", hari: "Rabu", jam: "15.00 - 16.40", ruangan: "F309", dosen: "Dr. Aris Riswandi Sanusi, M.Pd." },
  { kelas: "TI26I", matkul: "General English", tipe: "Teori", hari: "Kamis", jam: "18.15 - 19.55", ruangan: "A403", dosen: "Hilda Tri Yulianti, S.Pd.,M.Pd" },
  { kelas: "TI26I", matkul: "Pengantar Teknik Industri", tipe: "Teori", hari: "Jumat", jam: "18.15 - 19.55", ruangan: "A405", dosen: "Suryadi, S.T., M.T" },
  { kelas: "TI26I", matkul: "Kimia Dasar I", tipe: "Teori (T)", hari: "Senin", jam: "15.00 - 16.40", ruangan: "F207", dosen: "Weni Tri Sasmi, S.Pd.,M.Pd" },
  { kelas: "TI26I", matkul: "Kimia Dasar I", tipe: "Praktikum (P)", hari: "Selasa", jam: "20.00 - 21.40", ruangan: "LAB", dosen: "Weni Tri Sasmi, S.Pd.,M.Pd" },
  { kelas: "TI26I", matkul: "Kalkulus I", tipe: "Teori", hari: "Rabu", jam: "20.00 - 21.40", ruangan: "F405", dosen: "Imas Indah Mutiara, S.Pd., M.Pd" },
  { kelas: "TI26I", matkul: "Fisika Dasar I", tipe: "Teori", hari: "Jumat", jam: "20.00 - 21.40", ruangan: "A304", dosen: "Iin Lidia Putama Mursal, S.Si., M.Si." },
  { kelas: "TI26I", matkul: "Biologi: Anatomi dan Fisiologi manusia", tipe: "Teori", hari: "Rabu", jam: "18.15 - 19.55", ruangan: "F407", dosen: "Surya Amal, S.Si., M.Kes, Apt" },
  { kelas: "TI26I", matkul: "Menggambar Teknik", tipe: "Teori (T)", hari: "Senin", jam: "20.00 - 21.40", ruangan: "A407", dosen: "Ir. Fathurohman, S.Pd.,M.T" },
  { kelas: "TI26I", matkul: "Menggambar Teknik", tipe: "Praktikum (P)", hari: "Senin", jam: "18.15 - 19.55", ruangan: "LAB", dosen: "Ir. Fathurohman, S.Pd.,M.T" },

  // TI26J
  { kelas: "TI26J", matkul: "Pendidikan Pancasila", tipe: "Teori", hari: "Rabu", jam: "20.00 - 21.40", ruangan: "F302", dosen: "Dr. Aris Riswandi Sanusi, M.Pd." },
  { kelas: "TI26J", matkul: "General English", tipe: "Teori", hari: "Rabu", jam: "15.00 - 16.40", ruangan: "A404", dosen: "Hilda Tri Yulianti, S.Pd.,M.Pd" },
  { kelas: "TI26J", matkul: "Pengantar Teknik Industri", tipe: "Teori", hari: "Senin", jam: "18.15 - 19.55", ruangan: "A304", dosen: "Suryadi, S.T., M.T" },
  { kelas: "TI26J", matkul: "Kimia Dasar I", tipe: "Teori (T)", hari: "Senin", jam: "20.00 - 21.40", ruangan: "F207", dosen: "Weni Tri Sasmi, S.Pd.,M.Pd" },
  { kelas: "TI26J", matkul: "Kimia Dasar I", tipe: "Praktikum (P)", hari: "Selasa", jam: "18.15 - 19.55", ruangan: "LAB", dosen: "Weni Tri Sasmi, S.Pd.,M.Pd" },
  { kelas: "TI26J", matkul: "Kalkulus I", tipe: "Teori", hari: "Rabu", jam: "18.15 - 19.55", ruangan: "F405", dosen: "Imas Indah Mutiara, S.Pd., M.Pd" },
  { kelas: "TI26J", matkul: "Fisika Dasar I", tipe: "Teori", hari: "Selasa", jam: "20.00 - 21.40", ruangan: "F405", dosen: "Iin Lidia Putama Mursal, S.Si., M.Si." },
  { kelas: "TI26J", matkul: "Biologi: Anatomi dan Fisiologi manusia", tipe: "Teori", hari: "Kamis", jam: "15.00 - 16.40", ruangan: "A405", dosen: "Surya Amal, S.Si., M.Kes, Apt" },
  { kelas: "TI26J", matkul: "Menggambar Teknik", tipe: "Teori (T)", hari: "Kamis", jam: "18.15 - 19.55", ruangan: "F406", dosen: "Ir. Fathurohman, S.Pd.,M.T" },
  { kelas: "TI26J", matkul: "Menggambar Teknik", tipe: "Praktikum (P)", hari: "Kamis", jam: "20.00 - 21.40", ruangan: "LAB", dosen: "Ir. Fathurohman, S.Pd.,M.T" },

  // TI26K
  { kelas: "TI26K", matkul: "Pendidikan Pancasila", tipe: "Teori", hari: "Kamis", jam: "18.15 - 19.55", ruangan: "B305", dosen: "Fitri Silvia Sofyan, M.Pd." },
  { kelas: "TI26K", matkul: "General English", tipe: "Teori", hari: "Selasa", jam: "18.15 - 19.55", ruangan: "A305", dosen: "Hilda Tri Yulianti, S.Pd.,M.Pd" },
  { kelas: "TI26K", matkul: "Pengantar Teknik Industri", tipe: "Teori", hari: "Senin", jam: "20.00 - 21.40", ruangan: "A304", dosen: "Suryadi, S.T., M.T" },
  { kelas: "TI26K", matkul: "Kimia Dasar I", tipe: "Teori (T)", hari: "Selasa", jam: "20.00 - 21.40", ruangan: "A405", dosen: "Akda Zahrotul Wahtoni, S.S.i.,M.Si" },
  { kelas: "TI26K", matkul: "Kimia Dasar I", tipe: "Praktikum (P)", hari: "Jumat", jam: "20.00 - 21.40", ruangan: "LAB", dosen: "Yuni Syifau Rohmah, S.Pd.,M.Pd" },
  { kelas: "TI26K", matkul: "Kalkulus I", tipe: "Teori", hari: "Kamis", jam: "20.00 - 21.40", ruangan: "F405", dosen: "Imas Indah Mutiara, S.Pd., M.Pd" },
  { kelas: "TI26K", matkul: "Fisika Dasar I", tipe: "Teori", hari: "Rabu", jam: "20.00 - 21.40", ruangan: "F207", dosen: "Iin Lidia Putama Mursal, S.Si., M.Si." },
  { kelas: "TI26K", matkul: "Biologi: Anatomi dan Fisiologi manusia", tipe: "Teori", hari: "Senin", jam: "18.15 - 19.55", ruangan: "D308", dosen: "Surya Amal, S.Si., M.Kes, Apt" },
  { kelas: "TI26K", matkul: "Menggambar Teknik", tipe: "Teori (T)", hari: "Rabu", jam: "18.15 - 19.55", ruangan: "F406", dosen: "Ir. Fathurohman, S.Pd.,M.T" },
  { kelas: "TI26K", matkul: "Menggambar Teknik", tipe: "Praktikum (P)", hari: "Jumat", jam: "18.15 - 19.55", ruangan: "LAB", dosen: "Ir. Fathurohman, S.Pd.,M.T" },

  // TI26L
  { kelas: "TI26L", matkul: "Pendidikan Pancasila", tipe: "Teori", hari: "Kamis", jam: "20.00 - 21.40", ruangan: "B305", dosen: "Fitri Silvia Sofyan, M.Pd." },
  { kelas: "TI26L", matkul: "General English", tipe: "Teori", hari: "Selasa", jam: "20.00 - 21.40", ruangan: "A305", dosen: "Hilda Tri Yulianti, S.Pd.,M.Pd" },
  { kelas: "TI26L", matkul: "Pengantar Teknik Industri", tipe: "Teori", hari: "Rabu", jam: "18.15 - 19.55", ruangan: "A305", dosen: "Ir. Ade Suhara, S.T., M.T IPU" },
  { kelas: "TI26L", matkul: "Kimia Dasar I", tipe: "Teori (T)", hari: "Selasa", jam: "18.15 - 19.55", ruangan: "A405", dosen: "Akda Zahrotul Wahtoni, S.S.i.,M.Si" },
  { kelas: "TI26L", matkul: "Kimia Dasar I", tipe: "Praktikum (P)", hari: "Jumat", jam: "18.15 - 19.55", ruangan: "LAB", dosen: "Yuni Syifau Rohmah, S.Pd.,M.Pd" },
  { kelas: "TI26L", matkul: "Kalkulus I", tipe: "Teori", hari: "Kamis", jam: "18.15 - 19.55", ruangan: "F405", dosen: "Imas Indah Mutiara, S.Pd., M.Pd" },
  { kelas: "TI26L", matkul: "Fisika Dasar I", tipe: "Teori", hari: "Senin", jam: "18.15 - 19.55", ruangan: "A306", dosen: "Karnadi, S.T., M.T" },
  { kelas: "TI26L", matkul: "Biologi: Anatomi dan Fisiologi manusia", tipe: "Teori", hari: "Senin", jam: "20.00 - 21.40", ruangan: "D308", dosen: "Surya Amal, S.Si., M.Kes, Apt" },
  { kelas: "TI26L", matkul: "Menggambar Teknik", tipe: "Teori (T)", hari: "Rabu", jam: "20.00 - 21.40", ruangan: "F406", dosen: "Ir. Fathurohman, S.Pd.,M.T" },
  { kelas: "TI26L", matkul: "Menggambar Teknik", tipe: "Praktikum (P)", hari: "Jumat", jam: "20.00 - 21.40", ruangan: "LAB", dosen: "Ir. Fathurohman, S.Pd.,M.T" }
];