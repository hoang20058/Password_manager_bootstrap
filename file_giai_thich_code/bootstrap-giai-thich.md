# 📘 Giải thích Bootstrap trong `index.html` – Password Manager Vault

> Tài liệu này phân tích **từng class Bootstrap được dùng trong file**, giải thích tác dụng và điều gì sẽ thay đổi nếu bạn chỉnh sửa chúng.

---

## 🗂️ MỤC LỤC

1. [Layout tổng thể](#1-layout-tổng-thể)
2. [Sidebar & Offcanvas (responsive)](#2-sidebar--offcanvas-responsive)
3. [Header / Navbar](#3-header--navbar)
4. [Grid hệ thống – Stat Cards](#4-grid-hệ-thống--stat-cards)
5. [Card component](#5-card-component)
6. [Table](#6-table)
7. [Modal](#7-modal)
8. [Form & Input](#8-form--input)
9. [Utilities – Spacing, Flexbox, Text](#9-utilities--spacing-flexbox-text)
10. [Dropdown](#10-dropdown)
11. [Badge](#11-badge)
12. [Responsive Utilities (d-none, d-lg-block…)](#12-responsive-utilities)

---

## 1. Layout tổng thể

```html
<body class="bg-light vh-100 d-flex">
  <div class="container-fluid p-0 d-flex">
```

| Class | Tác dụng | Thay đổi thành |
|---|---|---|
| `bg-light` | Nền xám nhạt (#f8f9fa) cho toàn trang | `bg-white` → nền trắng, `bg-dark` → nền tối |
| `vh-100` | Chiều cao = 100% viewport (màn hình) | `min-vh-100` → tối thiểu 100%, cho phép cuộn dọc |
| `d-flex` | Bật Flexbox – sidebar và main nằm cạnh nhau theo hàng ngang | Bỏ → sidebar sẽ xuống dòng |
| `container-fluid` | Container chiếm toàn bộ chiều rộng (không có max-width) | `container` → có max-width, căn giữa |
| `p-0` | Xóa padding mặc định của container | Bỏ → có khoảng trắng 2 bên |

---

## 2. Sidebar & Offcanvas (responsive)

```html
<aside class="offcanvas-lg offcanvas-start sidebar bg-primary-custom text-white p-3 d-flex flex-column"
       id="sidebar" tabindex="-1">
```

### `offcanvas-lg` và `offcanvas-start`

**Đây là component đặc biệt của Bootstrap 5** – biến sidebar thành drawer trượt từ cạnh màn hình trên mobile.

| Class | Tác dụng |
|---|---|
| `offcanvas-lg` | Dưới màn hình `lg` (< 992px): sidebar ẩn đi, trở thành offcanvas (drawer). Trên `lg`: hiện bình thường như sidebar cố định |
| `offcanvas-start` | Offcanvas trượt từ bên **trái** vào |
| `d-flex flex-column` | Sắp xếp nội dung bên trong sidebar theo cột dọc |

**Thay đổi:**
- `offcanvas-start` → `offcanvas-end` : drawer từ bên phải
- `offcanvas-lg` → `offcanvas-md` : sidebar sẽ ẩn sớm hơn (dưới 768px)

### Nút mở Offcanvas trên mobile

```html
<button class="btn btn-light me-3 d-lg-none"
        data-bs-toggle="offcanvas"
        data-bs-target="#sidebar">
```

- `data-bs-toggle="offcanvas"` + `data-bs-target="#sidebar"` : cặp thuộc tính Bootstrap để điều khiển offcanvas bằng JS tự động – **không cần viết JS**.
- `d-lg-none` : nút hamburger **chỉ hiện trên mobile**, ẩn trên desktop.

---

## 3. Header / Navbar

```html
<header class="navbar bg-white border-bottom px-4 py-3 shadow-sm flex-shrink-0">
```

| Class | Tác dụng | Thay đổi thành |
|---|---|---|
| `navbar` | Class Bootstrap cho thanh điều hướng ngang | — |
| `bg-white` | Nền trắng | `bg-dark` + `navbar-dark` → navbar tối |
| `border-bottom` | Đường viền dưới | `border-top` → đường viền trên |
| `px-4 py-3` | Padding ngang 1.5rem, dọc 1rem | `px-2` → thu hẹp padding |
| `shadow-sm` | Đổ bóng nhẹ | `shadow` → bóng đậm hơn, `shadow-none` → bỏ bóng |
| `flex-shrink-0` | Ngăn header bị co lại khi nội dung dài | Bỏ → header có thể bị co |

### Thanh tìm kiếm

```html
<div class="search-box position-relative w-50">
  <i class="... position-absolute top-50 start-0 translate-middle-y ms-3 text-muted"></i>
  <input type="text" class="form-control rounded-pill ps-5 shadow-sm" ...>
</div>
```

| Class | Tác dụng |
|---|---|
| `position-relative` | Đặt div làm vật chứa, để icon `position-absolute` bên trong định vị được |
| `position-absolute top-50 start-0 translate-middle-y` | Đặt icon ở cạnh trái, căn giữa dọc |
| `ms-3` | Margin-start (trái) 1rem – icon cách lề trái |
| `w-50` | Chiều rộng 50% thẻ cha |
| `form-control` | Style Bootstrap cho input: border, padding, focus effect |
| `rounded-pill` | Bo tròn hoàn toàn (dạng thuốc viên) |
| `ps-5` | Padding-start lớn để text không đè lên icon |

**Thay đổi:** `rounded-pill` → `rounded` : bo góc nhẹ thay vì hoàn toàn.

---

## 4. Grid hệ thống – Stat Cards

```html
<div class="row g-3 mb-4">
  <div class="col-12 col-md-4"> ... </div>
  <div class="col-12 col-md-4"> ... </div>
  <div class="col-12 col-md-4"> ... </div>
</div>
```

**Bootstrap Grid** chia trang thành 12 cột. Đây là hệ thống quan trọng nhất.

| Class | Tác dụng |
|---|---|
| `row` | Tạo một hàng – bắt buộc bao ngoài các `col-*` |
| `g-3` | Gap (khoảng cách) giữa các cột = 1rem |
| `col-12` | Mặc định: mỗi card chiếm hết 12/12 cột → full width → xếp dọc (mobile) |
| `col-md-4` | Từ breakpoint `md` (≥768px) trở lên: mỗi card chiếm 4/12 cột → 3 thẻ nằm cạnh nhau |

**Responsive logic:**
```
Mobile  (< 768px):  col-12     → mỗi card full width, xếp dọc
Tablet+ (≥ 768px):  col-md-4   → 3 card / hàng
```

**Thay đổi:**
- `col-md-4` → `col-md-6` : 2 card/hàng thay vì 3
- `g-3` → `g-0` : bỏ khoảng cách giữa card
- `g-3` → `g-5` : tăng khoảng cách

---

## 5. Card component

```html
<div class="card stat-card border-0 shadow-sm rounded-3 bg-primary-custom text-white h-100">
  <div class="card-body d-flex justify-content-between align-items-center p-4">
```

| Class | Tác dụng |
|---|---|
| `card` | Component Bootstrap – tạo khung có nền trắng, border, border-radius |
| `border-0` | Xóa border mặc định của card |
| `shadow-sm` | Đổ bóng nhẹ |
| `rounded-3` | Bo góc vừa (0.5rem). `rounded-4` to hơn, `rounded` nhỏ hơn |
| `h-100` | Chiều cao 100% thẻ cha → các card trong cùng hàng đều cao bằng nhau |
| `card-body` | Vùng nội dung trong card, có padding mặc định |
| `justify-content-between` | Flexbox: đẩy 2 phần tử về 2 đầu (số liệu và icon) |
| `align-items-center` | Căn giữa theo trục dọc |

**Thay đổi màu card:**
- `bg-primary-custom` → `bg-primary` : màu xanh Bootstrap mặc định
- `bg-success` → `bg-warning` : thẻ vàng
- `bg-danger` → `bg-info` : thẻ xanh nhạt

---

## 6. Table

```html
<div class="card-body p-0 table-responsive">
  <table class="table table-hover mb-0 align-middle">
    <thead class="table-light text-muted">
```

| Class | Tác dụng |
|---|---|
| `table-responsive` | Wrapper giúp bảng cuộn ngang trên mobile, không bị vỡ layout |
| `table` | Class Bootstrap cơ bản cho bảng |
| `table-hover` | Hover vào hàng thì highlight (màu nền nhạt) |
| `table-striped` | (không dùng nhưng có thể thêm) → màu xen kẽ các hàng |
| `mb-0` | Bỏ margin-bottom mặc định của table (tránh khoảng trắng thừa trong card) |
| `align-middle` | Căn giữa dọc nội dung trong các ô `td` |
| `table-light` | Nền thead xám nhạt |

---

## 7. Modal

```html
<div class="modal fade" id="passwordModal" tabindex="-1">
  <div class="modal-dialog modal-dialog-centered">
    <div class="modal-content border-0 shadow">
      <div class="modal-header ...">
      <div class="modal-body p-4">
      <div class="modal-footer ...">
```

Bootstrap Modal là component popup không cần JS tự viết.

| Class / Attribute | Tác dụng |
|---|---|
| `modal` | Đánh dấu đây là modal Bootstrap |
| `fade` | Hiệu ứng mờ dần khi mở/đóng |
| `modal-dialog-centered` | Hiển thị modal ở giữa màn hình (dọc) |
| `modal-content` | Khung chứa toàn bộ nội dung modal |
| `modal-header / body / footer` | Phân vùng cấu trúc modal |
| `data-bs-toggle="modal"` | Thuộc tính HTML để mở modal – **không cần JS** |
| `data-bs-target="#passwordModal"` | Chỉ định modal nào cần mở |
| `data-bs-dismiss="modal"` | Đặt trên nút đóng – **không cần JS** |

**Thay đổi kích thước modal:**
- `modal-dialog` (mặc định, ~500px)
- `modal-dialog modal-lg` → rộng hơn (~800px)
- `modal-dialog modal-sm` → nhỏ hơn (~300px)
- `modal-dialog modal-fullscreen` → toàn màn hình

---

## 8. Form & Input

### form-control

```html
<input type="text" class="form-control" id="serviceName" required>
<div class="invalid-feedback">Vui lòng nhập tên dịch vụ.</div>
```

| Class | Tác dụng |
|---|---|
| `form-control` | Style đầy đủ cho input: border, padding, focus ring xanh |
| `invalid-feedback` | Text đỏ hiện ra khi form validation thất bại (kết hợp với `required` và class `needs-validation` trên form) |

### input-group

```html
<div class="input-group">
  <input type="password" class="form-control" id="passWord">
  <button class="btn btn-outline-secondary" type="button">👁</button>
</div>
```

`input-group` gộp input và button thành 1 khối liền nhau. Nếu bỏ → input và button sẽ tách rời.

### form-floating

```html
<div class="form-floating">
  <input type="text" class="form-control" id="f_name" placeholder="Name">
  <label for="f_name">Họ và tên</label>
</div>
```

Label nổi lên trên khi người dùng gõ vào – hiệu ứng Material Design. **Bắt buộc phải có `placeholder` trên input** để form-floating hoạt động.

### form-check form-switch

```html
<div class="form-check form-switch m-0">
  <input class="form-check-input" type="checkbox" checked>
</div>
```

Biến checkbox thành toggle switch iOS-style.

### form-select

```html
<select class="form-select w-auto">
```

Style đẹp cho thẻ `<select>`. `w-auto` để select chỉ rộng vừa nội dung.

---

## 9. Utilities – Spacing, Flexbox, Text

### Spacing (margin & padding)

Bootstrap dùng hệ thống `{property}{side}-{size}`:
- **Property**: `m` (margin), `p` (padding)
- **Side**: `t` top, `b` bottom, `s` start/left, `e` end/right, `x` ngang, `y` dọc
- **Size**: `0` đến `5`, hoặc `auto`

Ví dụ trong code:

| Class | Tác dụng |
|---|---|
| `mb-4` | margin-bottom 1.5rem |
| `p-4` | padding tất cả cạnh 1.5rem |
| `ps-5` | padding-start 3rem |
| `px-4` | padding trái + phải 1.5rem |
| `me-2` | margin-end 0.5rem |
| `mt-5` | margin-top 3rem |

### Flexbox utilities

| Class | Tác dụng |
|---|---|
| `d-flex` | `display: flex` |
| `flex-column` | Sắp xếp con theo chiều dọc |
| `flex-grow-1` | Phần tử chiếm hết không gian còn lại |
| `flex-shrink-0` | Không co lại |
| `justify-content-between` | Căn 2 đầu |
| `justify-content-center` | Căn giữa theo trục ngang |
| `align-items-center` | Căn giữa theo trục dọc |
| `gap-2` | Khoảng cách giữa các phần tử flex = 0.5rem |

### Text utilities

| Class | Tác dụng |
|---|---|
| `fw-bold` | font-weight: 700 |
| `fw-semibold` | font-weight: 600 |
| `text-muted` | Màu xám nhạt |
| `text-white` | Màu trắng |
| `text-danger` | Màu đỏ Bootstrap |
| `text-center` | Căn giữa |
| `text-end` | Căn phải |
| `small` | font-size: 87.5% |
| `fs-1` | font-size tương đương h1 |
| `opacity-50` | Độ trong suốt 50% |
| `text-white-50` | Trắng với opacity 50% |

---

## 10. Dropdown

```html
<div class="dropdown">
  <button class="btn btn-light rounded-circle p-2"
          data-bs-toggle="dropdown">
    <i class="fa-solid fa-user"></i>
  </button>
  <ul class="dropdown-menu dropdown-menu-end">
    <li><a class="dropdown-item" href="#">Profile</a></li>
  </ul>
</div>
```

| Class / Attribute | Tác dụng |
|---|---|
| `dropdown` | Wrapper kích hoạt chức năng dropdown |
| `data-bs-toggle="dropdown"` | Mở dropdown khi click – **không cần JS** |
| `dropdown-menu` | Danh sách menu ẩn/hiện |
| `dropdown-menu-end` | Menu mở sang **trái** (căn theo cạnh phải button) |
| `dropdown-item` | Style cho từng item trong menu |

**Thay đổi:** `dropdown-menu-end` → bỏ đi → menu mở sang phải.

---

## 11. Badge

```html
<div class="badge bg-success-subtle text-success border border-success-subtle rounded-pill px-3 py-2">
  <i class="fa-solid fa-shield-check me-1"></i> Account Secured
</div>
```

| Class | Tác dụng |
|---|---|
| `badge` | Component nhỏ hiển thị nhãn |
| `bg-success-subtle` | Nền xanh lá **nhạt** (tông màu pastel – Bootstrap 5.3+) |
| `text-success` | Chữ màu xanh lá |
| `border border-success-subtle` | Viền xanh lá nhạt |
| `rounded-pill` | Bo tròn hoàn toàn |

---

## 12. Responsive Utilities

Bootstrap có hệ thống breakpoint:

| Breakpoint | Prefix | Kích thước |
|---|---|---|
| Extra small | (không có) | < 576px |
| Small | `sm` | ≥ 576px |
| Medium | `md` | ≥ 768px |
| Large | `lg` | ≥ 992px |
| Extra large | `xl` | ≥ 1200px |

### Dùng trong code:

```html
<!-- Chỉ ẩn trên lg+ (hiện trên mobile) -->
<button class="d-lg-none" ...>☰</button>

<!-- Chỉ hiện trên lg+ (ẩn trên mobile) -->
<h4 class="d-none d-lg-block">Vault</h4>
```

| Class | Tác dụng |
|---|---|
| `d-none` | Ẩn hoàn toàn |
| `d-lg-none` | Ẩn từ breakpoint `lg` trở lên |
| `d-none d-lg-block` | Ẩn trên mobile, hiện từ `lg` |

### Grid responsive:

```html
<div class="col-12 col-md-4 col-xl-8">
```

Kết hợp nhiều breakpoint: mobile full → tablet 4/12 → desktop xl 8/12.

---

## ✅ Tóm tắt các component Bootstrap đã dùng

| Component | Class chính | Dùng ở đâu |
|---|---|---|
| Grid | `row`, `col-*` | Stat cards, Profile layout |
| Flexbox | `d-flex`, `flex-*` | Layout tổng thể, header, card body |
| Card | `card`, `card-body`, `card-header` | Stat cards, bảng, settings |
| Modal | `modal`, `modal-dialog`, `modal-*` | Thêm/sửa mật khẩu, đổi master pass |
| Offcanvas | `offcanvas-lg`, `offcanvas-start` | Sidebar trên mobile |
| Dropdown | `dropdown`, `dropdown-menu` | Menu avatar |
| Table | `table`, `table-hover`, `table-responsive` | Danh sách mật khẩu |
| Form | `form-control`, `form-floating`, `form-switch`, `input-group` | Các form nhập liệu |
| Badge | `badge`, `bg-*-subtle` | Trạng thái tài khoản |
| Utilities | `p-*`, `m-*`, `text-*`, `fw-*`, `d-*`, `position-*` | Khắp nơi |

---

*Tài liệu được tạo cho mục đích học tập môn Lập trình Web.*
