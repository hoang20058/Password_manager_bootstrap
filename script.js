// 1. Import các thành phần giao diện từ component.js
import { Components } from "./component.js";

document.addEventListener("DOMContentLoaded", () => {
  // 1. KHỞI TẠO BIẾN & CẤU HÌNH
  const passwordForm = document.getElementById("passwordForm");
  const passwordList = document.getElementById("passwordList");
  const modalElement = document.getElementById("passwordModal");
  const bootstrapModal = new bootstrap.Modal(modalElement);
  const changeModal = new bootstrap.Modal(
    document.getElementById("changePasswordModal"),
  );
  const deleteModal = new bootstrap.Modal(
    document.getElementById("confirmDeleteModal"),
  );
  const profileModal = new bootstrap.Modal(
    document.getElementById("profileModal"),
  );
  const html = document.documentElement;

  let vaults = JSON.parse(localStorage.getItem("vaults")) || [];

  // 2. TIỆN ÍCH (UTILITIES)
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

  const showToast = (message, type = "success", action = null) => {
    let container =
      document.querySelector(".toast-container") ||
      (() => {
        const c = document.createElement("div");
        c.className = "toast-container position-fixed top-0 end-0 p-3";
        document.body.appendChild(c);
        return c;
      })();

    const toast = document.createElement("div");
    toast.className = `toast text-bg-${type} show mb-2`;
    toast.innerHTML = `
    <div class="d-flex align-items-center justify-content-between p-2">
      <div class="d-flex align-items-center gap-2">
        <span>${message}</span>
      </div>
      <div class="d-flex align-items-center gap-2">
        ${
          action
            ? `<button class="btn btn-sm btn-light">${action.text}</button>`
            : ""
        }
        <button class="btn-close btn-close-white"></button>
      </div>
    </div>
  `;

    container.appendChild(toast);

    // undo
    if (action) {
      toast.querySelector(".btn-light").onclick = () => {
        action.onClick();
        toast.remove();
      };
    }

    // nút X
    toast.querySelector(".btn-close").onclick = () => {
      toast.remove();
    };

    // auto hide
    setTimeout(() => {
      toast.remove();
    }, 2500);
  };
  // 3. ĐIỀU HƯỚNG & PROFILE
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
  const loadProfile = () => {
    const saved = JSON.parse(localStorage.getItem("userProfile"));
    if (!saved) return;

    // input
    document.getElementById("f_name").value = saved.name;
    document.getElementById("f_user").value = saved.username;
    document.getElementById("f_email").value = saved.email;
    document.getElementById("f_bio").value = saved.bio || "";
    document.getElementById("profileBio").innerText = saved.bio || "";

    // hiển thị bên trái modal
    document.getElementById("profileName").innerText = saved.name;

    const profileUser = document.getElementById("profileUser");
    if (profileUser) profileUser.innerText = `@${saved.username}`;
  };
  window.openProfile = () => {
    loadProfile();
    profileModal.show();
  };

  document.getElementById("profileForm").addEventListener("submit", (e) => {
    e.preventDefault();
    const data = {
      name: document.getElementById("f_name").value,
      username: document.getElementById("f_user").value,
      email: document.getElementById("f_email").value,
      bio: document.getElementById("f_bio").value,
    };
    localStorage.setItem("userProfile", JSON.stringify(data));
    loadProfile();
    showToast("Cập nhật thông tin thành công!", "success");
  });
  // 4. QUẢN LÝ MẬT KHẨU
  const renderVault = () => {
    passwordList.innerHTML = "";
    if (vaults.length === 0) {
      // emptyState
      passwordList.innerHTML = Components.emptyState();
      return;
    }

    vaults.forEach((item, index) => {
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
    const deleted = vaults[i];

    vaults.splice(i, 1);
    saveAndRender();

    showToast("Đã xóa!", "warning", {
      text: "Undo",
      onClick: () => {
        vaults.splice(i, 0, deleted);
        saveAndRender();
      },
    });
  };
  const updateStats = () => {
    const total = vaults.length;
    const safe = vaults.filter((item) => item.password.length >= 8).length;
    const risk = vaults.filter((item) => item.password.length < 8).length;

    const totalElem = document.getElementById("stat-total");
    const safeElem = document.getElementById("stat-safe");
    const riskElem = document.getElementById("stat-risk");

    if (totalElem) totalElem.innerText = total;
    if (safeElem) safeElem.innerText = safe;
    if (riskElem) riskElem.innerText = risk;
  };
  window.filterWeakPasswords = () => {
    const weakVaults = vaults.filter((item) => item.password.length < 8);

    passwordList.innerHTML = "";

    if (weakVaults.length === 0) {
      passwordList.innerHTML = Components.emptyState();
      showToast("Không có mật khẩu nào yếu!", "success");
      return;
    }

    weakVaults.forEach((item, index) => {
      // tìm lại index gốc trong vaults, tránh xung đột
      const originalIndex = vaults.findIndex((v) => v === item);
      passwordList.insertAdjacentHTML(
        "beforeend",
        Components.passwordRow(item, originalIndex, getDomainName),
      );
    });
    showToast(`Đang hiển thị ${weakVaults.length} mật khẩu yếu`, "warning");
  };

  window.filterSafePasswords = () => {
    const safeVaults = vaults.filter((item) => item.password.length >= 8);

    passwordList.innerHTML = "";

    if (safeVaults.length === 0) {
      passwordList.innerHTML = Components.emptyState();
      showToast("Chưa có mật khẩu nào đạt chuẩn an toàn!", "info");
      return;
    }
    safeVaults.forEach((item) => {
      const originalIndex = vaults.findIndex((v) => v === item);
      passwordList.insertAdjacentHTML(
        "beforeend",
        Components.passwordRow(item, originalIndex, getDomainName),
      );
    });

    showToast(`Đang hiển thị ${safeVaults.length} mật khẩu an toàn`, "success");
  };
  const saveAndRender = () => {
    // chuyển vaults từ object -> string
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
  // Hàm ẩn hiện mật khẩu
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

  // 5. CÁC LOGIC
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

  let changePasswordMode = "master";
  window.openChangePasswordModal = () => {
    changePasswordMode = "account";

    document.querySelector("#changePasswordModal .modal-title").innerText =
      "Đổi mật khẩu tài khoản";
    const profileModalEl = document.getElementById("profileModal");
    const profileModal = bootstrap.Modal.getInstance(profileModalEl);

    profileModalEl.addEventListener(
      "hidden.bs.modal",
      () => {
        changeModal.show();
      },
      { once: true },
    );

    profileModal.hide();
  };
  document.getElementById("changeMasterBtn").onclick = () => {
    changePasswordMode = "master";

    document.querySelector("#changePasswordModal .modal-title").innerText =
      "Đổi Master Password";

    changeModal.show();
  };
  document.getElementById("saveMasterPass").onclick = () => {
    const current = document.getElementById("currentPass").value;
    const newPass = document.getElementById("newPass").value;
    const confirmPass = document.getElementById("confirmPass").value;
    // if (newPass.length < 6) {
    //   showToast("Mật khẩu phải >= 6 ký tự!", "warning");
    //   return;
    // }
    if (newPass !== confirmPass) {
      showToast("Xác nhận mật khẩu không khớp!", "warning");
      return;
    }

    if (changePasswordMode === "master") {
      const savedPass = localStorage.getItem("masterPassword") || "123456";

      if (current !== savedPass) {
        showToast("Sai master password!", "danger");
        return;
      }

      localStorage.setItem("masterPassword", newPass);
      showToast("Đổi master password thành công!", "success");
    } else if (changePasswordMode === "account") {
      const savedAccountPass =
        localStorage.getItem("accountPassword") || "123456";

      if (current !== savedAccountPass) {
        showToast("Sai mật khẩu tài khoản!", "danger");
        return;
      }

      localStorage.setItem("accountPassword", newPass);
      showToast("Đổi mật khẩu tài khoản thành công!", "success");
    }

    changeModal.hide();
  };
  document
    .getElementById("changePasswordModal")
    .addEventListener("hidden.bs.modal", () => {
      document.getElementById("currentPass").value = "";
      document.getElementById("newPass").value = "";
      document.getElementById("confirmPass").value = "";
    });

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
  document.getElementById("btnDeleteAll").addEventListener("click", () => {
    openDeleteModal();
  });
  window.openDeleteModal = () => {
    const input = document.getElementById("confirmInput");
    input.value = "";
    deleteModal.show();
    setTimeout(() => input.focus(), 300);
  };

  document.getElementById("confirmDeleteBtn").onclick = () => {
    const input = document.getElementById("confirmInput").value;
    const savedPass = localStorage.getItem("masterPassword") || "123456";

    if (input !== savedPass) {
      showToast("Sai master password!", "danger");

      const inputBox = document.getElementById("confirmInput");
      inputBox.classList.add("is-invalid");
      setTimeout(() => inputBox.classList.remove("is-invalid"), 500);
      return;
    }

    localStorage.removeItem("vaults");
    vaults = [];

    passwordList.innerHTML = Components.emptyState();
    updateStats();

    deleteModal.hide();
    showToast("Đã xóa toàn bộ dữ liệu!", "danger");
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
