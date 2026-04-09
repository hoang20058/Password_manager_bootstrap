# Password Manager Vault - FE Static Bootstrap

## 1) Gioi thieu
Du an nay la mot ung dung frontend tinh (khong can backend) duoc xay dung bang:
- HTML5
- CSS3
- Bootstrap 5
- JavaScript ES Modules

Ung dung mo phong trinh quan ly mat khau voi:
- Dang nhap/Dang ky giao dien
- Dashboard quan ly vault
- Them, sua inline, xoa, copy, an/hien mat khau
- Thong ke mat khau an toan/rui ro
- Quan ly profile
- Doi master password / account password
- Import/Export du lieu JSON
- Dark mode

Toan bo du lieu duoc luu tren `localStorage` trong trinh duyet.

---

## 2) Cau truc tong the du an

```text
exercise2_WP/
|-- index.html
|-- auth.html
|-- style.css
|-- auth-style.css
|-- script.js
|-- component.js
|-- Fake_data/
|   |-- vaults.json
|   |-- vaults_20data.json
|   `-- test_export.json
`-- file_giai_thich_code/
    |-- bootstrap-giai-thich.md
    |-- code.txt
    |-- scipt_bao_cao.txt
    |-- script-giai-thich.txt
    `-- tu_nghiem.txt
```

---

## 3) Mo ta chi tiet tung file/folder

### 3.1 Trang va giao dien

- `index.html`
  - Trang chinh cua ung dung sau khi dang nhap.
  - Chua cac khu vuc:
    - Sidebar dieu huong (Quan ly mat khau / Cai dat)
    - Header (search box, user dropdown)
    - Dashboard thong ke
    - Bang danh sach mat khau
    - Cac modal: Them/Sua mat khau, Doi password, Profile, Xac nhan xoa du lieu
  - Nap `style.css` va `script.js`.

- `auth.html`
  - Trang xac thuc nguoi dung (Dang nhap / Dang ky) bang tab Bootstrap.
  - Co toggle an/hien password o form dang nhap.
  - Nap `auth-style.css`.

### 3.2 Stylesheet

- `style.css`
  - CSS cho trang dashboard (`index.html`).
  - Dinh nghia bien mau chu dao (`--primary-blue`, ...).
  - Tuỳ bien giao dien sidebar, card, bang, setting item, profile, hover effects.

- `auth-style.css`
  - CSS cho trang xac thuc (`auth.html`).
  - Tao layout center card, glassmorphism nhe, style nav-pills, social buttons.

### 3.3 JavaScript

- `component.js`
  - Xuat object `Components` chua cac ham render HTML dang string:
    - `passwordRow(...)`: dong du lieu mat khau trong bang
    - `editRow(...)`: dong form sua inline
    - `emptyState()`: giao dien khi danh sach rong
  - Dong vai tro tach template UI khoi logic xu ly.

- `script.js`
  - File logic chinh cua ung dung tai trang `index.html`.
  - Chuc nang chinh:
    - Khoi tao du lieu `vaults` tu `localStorage`
    - Render danh sach mat khau va thong ke
    - Them/sua/xoa mat khau + Undo xoa
    - Filter mat khau yeu/an toan
    - Toggle hien mat khau va copy clipboard
    - Quan ly profile nguoi dung (`userProfile`)
    - Doi `masterPassword` va `accountPassword`
    - Import/Export file JSON
    - Xoa toan bo vault voi xac thuc master password
    - Chuyen dark/light mode va luu `theme`

### 3.4 Du lieu mau

- `Fake_data/vaults.json`
  - Danh sach mau vault (so luong vua) cho test import.

- `Fake_data/vaults_20data.json`
  - Danh sach mau lon hon (20 ban ghi) de test bang, thong ke va hieu nang render.

- `Fake_data/test_export.json`
  - File mau mo phong ket qua export/import.

### 3.5 Tai lieu noi bo

- `file_giai_thich_code/`
  - Chua cac file ghi chu, bao cao, dien giai bootstrap va script.
  - Muc dich hoc tap/bao cao, khong anh huong runtime ung dung.

---

## 4) Luong du lieu trong localStorage

Ung dung hien dang su dung cac key chinh:
- `vaults`: mang cac doi tuong `{ url, username, password }`
- `userProfile`: thong tin ho so nguoi dung
- `masterPassword`: mat khau master (mac dinh fallback: `123456`)
- `accountPassword`: mat khau tai khoan (mac dinh fallback: `123456`)
- `theme`: `light` hoac `dark`

Luu y:
- Day la du an FE tinh, du lieu khong duoc ma hoa cap backend.
- Khong nen dung cho du lieu nhay cam that trong moi truong production.

---

## 5) Cach chay du an

### Cach 1 - Mo truc tiep
1. Mo file `auth.html` bang trinh duyet.
2. Dang nhap de chuyen sang `index.html`.

### Cach 2 - Dung Live Server (khuyen nghi)
1. Mo thu muc du an bang VS Code.
2. Cai extension Live Server (neu chua co).
3. Right click `auth.html` -> Open with Live Server.

---

## 6) Goi y phat trien tiep

- Tach logic thanh modules theo domain (vault, profile, settings).
- Bo sung validate password manh (length, uppercase, number, special char).
- Them tim kiem that su cho bang mat khau (search theo url/username).
- Dong bo hoa ngon ngu (VI/EN) thay vi text hardcode.
- Tich hop backend + ma hoa du lieu neu nang cap san pham that.

---

## 7) Tom tat

Day la mot codebase FE tinh gon, de hoc Bootstrap + JS DOM + localStorage, to chuc theo huong:
- UI pages (`index.html`, `auth.html`)
- Style tach rieng (`style.css`, `auth-style.css`)
- Logic xu ly (`script.js`)
- UI templates (`component.js`)
- Du lieu mau + tai lieu dien giai (`Fake_data/`, `file_giai_thich_code/`)
