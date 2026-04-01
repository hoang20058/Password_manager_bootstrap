// 1. Import các thành phần giao diện từ component.js
import { Components } from "./component.js";

document.addEventListener("DOMContentLoaded", () => {
  // ==========================================
  // 1. KHỞI TẠO BIẾN & CẤU HÌNH
  // ==========================================
  const passwordForm = document.getElementById("passwordForm");
  const passwordList = document.getElementById("passwordList");
  const modalElement = document.getElementById("passwordModal");
  const bootstrapModal = new bootstrap.Modal(modalElement);
  const changeModal = new bootstrap.Modal(
    document.getElementById("changePasswordModal"),
  );
  const html = document.documentElement;

  let vaults = JSON.parse(localStorage.getItem("vaults")) || [];

  // ==========================================
  // 2. TIỆN ÍCH (UTILITIES)
  // ==========================================
  const getDomainName = (url) => {
    try {
      const domain = url
        .replace(/^(?:https?:\/\/)?(?:www\.)?/i, "")
        .split("/")[0];
      return domain.split(".")[0].toLowerCase();
    } catch (e) {
      return "link";
    }
  };

  const showToast = (message, type = "success") => {
    let container =
      document.querySelector(".toast-container") ||
      (() => {
        const c = document.createElement("div");
        c.className = "toast-container position-fixed top-0 end-0 p-3";
        document.body.appendChild(c);
        return c;
      })();

    const icons = {
      success: "fa-check-circle",
      danger: "fa-circle-xmark",
      warning: "fa-triangle-exclamation",
      info: "fa-circle-info",
    };
    const toast = document.createElement("div");
    toast.className = `toast text-bg-${type} show mb-2`;
    toast.innerHTML = `
      <div class="toast-header">
        <i class="fa-solid ${icons[type]} me-2"></i>
        <strong class="me-auto">Thông báo</strong>
        <button class="btn-close" data-bs-dismiss="toast"></button>
      </div>
      <div class="toast-body">${message}</div>`;

    container.appendChild(toast);
    setTimeout(() => toast.remove(), 2500);
  };

  // ==========================================
  // 3. ĐIỀU HƯỚNG & PROFILE
  // ==========================================
  const links = document.querySelectorAll("#menuTabs a");
  links.forEach((link) => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      links.forEach((l) => l.classList.remove("active-nav"));
      link.classList.add("active-nav");
      ["passwordPage", "settingsPage"].forEach(
        (id) => (document.getElementById(id).style.display = "none"),
      );
      document.getElementById(link.dataset.page).style.display = "block";
    });
  });

  const profileForm = document.getElementById("profileForm");
  const profileDisplayName = document.querySelector(
    "#profileOverlay .col-md-4 h4",
  );
  const profileDisplayUser = document.querySelector(
    "#profileOverlay .col-md-4 p.text-muted",
  );
  const savedProfile = JSON.parse(localStorage.getItem("userProfile"));

  if (savedProfile) {
    document.getElementById("f_name").value = savedProfile.name;
    document.getElementById("f_user").value = savedProfile.username;
    document.getElementById("f_email").value = savedProfile.email;
    if (profileDisplayName) profileDisplayName.textContent = savedProfile.name;
    if (profileDisplayUser)
      profileDisplayUser.textContent = `@${savedProfile.username}`;
  }

  window.openProfile = () =>
    document.getElementById("profileOverlay")?.classList.remove("d-none");
  window.closeProfile = () =>
    document.getElementById("profileOverlay")?.classList.add("d-none");

  profileForm?.addEventListener("submit", (e) => {
    e.preventDefault();
    const data = {
      name: document.getElementById("f_name").value,
      username: document.getElementById("f_user").value,
      email: document.getElementById("f_email").value,
    };
    localStorage.setItem("userProfile", JSON.stringify(data));
    if (profileDisplayName) profileDisplayName.textContent = data.name;
    if (profileDisplayUser)
      profileDisplayUser.textContent = `@${data.username}`;
    showToast("Cập nhật thông tin thành công!", "success");
    closeProfile();
  });

  // ==========================================
  // 4. QUẢN LÝ MẬT KHẨU (SỬ DỤNG COMPONENTS)
  // ==========================================
  const renderVault = () => {
    passwordList.innerHTML = "";
    if (vaults.length === 0) {
      // SỬ DỤNG COMPONENT: emptyState
      passwordList.innerHTML = Components.emptyState();
      return;
    }

    vaults.forEach((item, index) => {
      // SỬ DỤNG COMPONENT: passwordRow
      // Tạo một template tạm để chuyển string thành Node nếu cần, hoặc cộng dồn chuỗi
      passwordList.insertAdjacentHTML(
        "beforeend",
        Components.passwordRow(item, index, getDomainName),
      );
    });
  };

  window.toggleView = (i) => {
    const s = document.getElementById(`pwd-${i}`);
    const r = document.getElementById(`raw-${i}`).value;
    s.innerText = s.innerText === "••••••••" ? r : "••••••••";
    s.classList.toggle("pwd-mask");
  };

  window.copyPwd = (i) => {
    navigator.clipboard.writeText(document.getElementById(`raw-${i}`).value);
    showToast("Đã copy mật khẩu!", "info");
  };

  window.deletePwd = (i) => {
    if (confirm("Xóa mục này?")) {
      vaults.splice(i, 1);
      saveAndRender();
      showToast("Đã xóa!", "warning");
    }
  };
  const updateStats = () => {
    // 1. Tính toán logic
    const total = vaults.length;

    // An toàn: Mật khẩu từ 8 ký tự trở lên
    const safe = vaults.filter((item) => item.password.length >= 8).length;

    // Rủi ro: Mật khẩu dưới 6 ký tự
    const risk = vaults.filter((item) => item.password.length < 6).length;

    // 2. Hiển thị ra màn hình
    const totalElem = document.getElementById("stat-total");
    const safeElem = document.getElementById("stat-safe");
    const riskElem = document.getElementById("stat-risk");

    if (totalElem) totalElem.innerText = total;
    if (safeElem) safeElem.innerText = safe;
    if (riskElem) riskElem.innerText = risk;
  };
  // Hàm lọc mật khẩu yếu
  window.filterWeakPasswords = () => {
    // 1. Lọc ra các mật khẩu yếu (dưới 6 ký tự)
    const weakVaults = vaults.filter((item) => item.password.length < 6);

    // 2. Xóa danh sách cũ
    passwordList.innerHTML = "";

    // 3. Nếu không có mật khẩu yếu nào
    if (weakVaults.length === 0) {
      passwordList.innerHTML = Components.emptyState();
      showToast("Không có mật khẩu nào yếu!", "success");
      return;
    }

    // 4. Render riêng danh sách mật khẩu yếu
    weakVaults.forEach((item, index) => {
      // Tìm lại index gốc trong mảng vaults để các nút Sửa/Xóa vẫn chạy đúng
      const originalIndex = vaults.findIndex((v) => v === item);
      passwordList.insertAdjacentHTML(
        "beforeend",
        Components.passwordRow(item, originalIndex, getDomainName),
      );
    });

    // 5. Thêm một nút "Quay lại" hoặc thông báo đang lọc
    showToast(`Đang hiển thị ${weakVaults.length} mật khẩu yếu`, "warning");
  };
  // Hàm lọc mật khẩu an toàn (Độ dài >= 8)
  window.filterSafePasswords = () => {
    // 1. Lọc ra các mật khẩu thỏa mãn điều kiện an toàn
    const safeVaults = vaults.filter((item) => item.password.length >= 8);

    // 2. Làm trống danh sách hiện tại
    passwordList.innerHTML = "";

    // 3. Xử lý trường hợp không có mật khẩu nào đạt chuẩn
    if (safeVaults.length === 0) {
      passwordList.innerHTML = Components.emptyState();
      showToast("Chưa có mật khẩu nào đạt chuẩn an toàn!", "info");
      return;
    }

    // 4. Render danh sách đã lọc
    safeVaults.forEach((item) => {
      // Tìm index gốc để các chức năng Sửa/Xóa vẫn hoạt động chính xác trên mảng vaults
      const originalIndex = vaults.findIndex((v) => v === item);
      passwordList.insertAdjacentHTML(
        "beforeend",
        Components.passwordRow(item, originalIndex, getDomainName),
      );
    });

    showToast(`Đang hiển thị ${safeVaults.length} mật khẩu an toàn`, "success");
  };
  const saveAndRender = () => {
    localStorage.setItem("vaults", JSON.stringify(vaults));
    renderVault();
    updateStats();
  };

  window.editPwd = (index) => {
    const item = vaults[index];
    const currentRow = document.querySelector(`tr[data-index="${index}"]`);

    if (currentRow.nextElementSibling?.classList.contains("edit-row")) {
      currentRow.nextElementSibling.remove();
      return;
    }
    document.querySelectorAll(".edit-row").forEach((e) => e.remove());

    // SỬ DỤNG COMPONENT: editRow
    currentRow.insertAdjacentHTML("afterend", Components.editRow(item, index));
  };

  window.saveInline = (i) => {
    vaults[i] = {
      url: document.getElementById("edit-url").value,
      username: document.getElementById("edit-username").value,
      password: document.getElementById("edit-password").value,
    };
    saveAndRender();
    showToast("Cập nhật thành công!", "success");
  };

  // Các hàm bổ trợ cho giao diện Edit
  window.toggleEditPassword = (btn) => {
    const input = btn.parentElement.querySelector("input");
    const icon = btn.querySelector("i");
    if (input.type === "password") {
      input.type = "text";
      icon.classList.replace("fa-eye", "fa-eye-slash");
    } else {
      input.type = "password";
      icon.classList.replace("fa-eye-slash", "fa-eye");
    }
  };

  // ==========================================
  // 5. CÁC LOGIC CÒN LẠI (GIỮ NGUYÊN)
  // ==========================================
  passwordForm.addEventListener("submit", (e) => {
    e.preventDefault();
    if (!passwordForm.checkValidity()) {
      passwordForm.classList.add("was-validated");
      return;
    }
    const editId = document.getElementById("editId").value;
    const newData = {
      url: document.getElementById("siteUrl").value,
      username: document.getElementById("userName").value,
      password: document.getElementById("passWord").value,
    };
    if (editId !== "") vaults[editId] = newData;
    else vaults.push(newData);
    saveAndRender();
    bootstrapModal.hide();
  });

  document.getElementById("changeMasterBtn").onclick = () => changeModal.show();
  document.getElementById("saveMasterPass").onclick = () => {
    const current = document.getElementById("currentPass").value;
    const newPass = document.getElementById("newPass").value;
    const confirmPass = document.getElementById("confirmPass").value;
    const savedPass = localStorage.getItem("masterPassword") || "123456";

    if (current !== savedPass) {
      showToast("Mật khẩu hiện tại không đúng!", "danger");
      return;
    }
    if (newPass !== confirmPass) {
      showToast("Xác nhận mật khẩu không khớp!", "warning");
      return;
    }

    localStorage.setItem("masterPassword", newPass);
    showToast("Đổi mật khẩu thành công!", "success");
    changeModal.hide();
  };

  document.getElementById("exportBtn").addEventListener("click", () => {
    const data = localStorage.getItem("vaults");
    const blob = new Blob([data], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "vault.json";
    a.click();
    showToast("Xuất dữ liệu thành công!", "success");
  });

  const fileInput = document.getElementById("importFile");
  document.getElementById("importBtn").onclick = () => fileInput.click();
  fileInput.onchange = (e) => {
    const reader = new FileReader();
    reader.onload = function () {
      localStorage.setItem("vaults", reader.result);
      showToast("Import thành công!", "success");
      location.reload();
    };
    reader.readAsText(e.target.files[0]);
  };

  const btnDarkMode = document.getElementById("btnDarkMode");
  const applyTheme = (theme) => {
    html.setAttribute("data-bs-theme", theme);
    localStorage.setItem("theme", theme);
    if (btnDarkMode) {
      const icon = btnDarkMode.querySelector("i");
      icon.className =
        theme === "dark" ? "fa-solid fa-sun" : "fa-solid fa-moon";
      btnDarkMode.className =
        theme === "dark" ? "btn btn-dark" : "btn btn-light";
    }
  };

  btnDarkMode?.addEventListener("click", () => {
    applyTheme(
      html.getAttribute("data-bs-theme") === "dark" ? "light" : "dark",
    );
  });

  applyTheme(
    localStorage.getItem("theme") ||
      (window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light"),
  );
  renderVault();
  updateStats();
  window.renderVault = renderVault;
});
