document.addEventListener("DOMContentLoaded", () => {
  const passwordForm = document.getElementById("passwordForm");
  const passwordList = document.getElementById("passwordList");
  const modalElement = document.getElementById("passwordModal");
  const bootstrapModal = new bootstrap.Modal(modalElement);
  const links = document.querySelectorAll("#menuTabs a");
  const toggleBtn = document.getElementById("toggleSidebar");
  const sidebar = document.querySelector(".sidebar");
  const overlay = document.getElementById("profileOverlay");
  links.forEach((link) => {
    link.addEventListener("click", (e) => {
      e.preventDefault();

      // đổi active
      links.forEach((l) => l.classList.remove("active-nav"));
      link.classList.add("active-nav");

      // ẩn tất cả
      document.getElementById("passwordPage").style.display = "none";
      document.getElementById("settingsPage").style.display = "none";

      // hiện cái được chọn
      const page = link.dataset.page;
      document.getElementById(page).style.display = "block";
    });
  });

  toggleBtn.addEventListener("click", () => {
    sidebar.classList.toggle("hide");
  });

  // Định nghĩa hàm toggle password còn thiếu để tránh lỗi Console
  window.toggleEditPassword = function (btn) {
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
  // --- XỬ LÝ FORM PROFILE ---

  const profileForm = document.getElementById("profileForm");

  // Lấy các phần tử hiển thị thông tin ở cột trái Profile
  const profileDisplayName = document.querySelector(
    "#profileOverlay .col-md-4 h4",
  );
  const profileDisplayUser = document.querySelector(
    "#profileOverlay .col-md-4 p.text-muted",
  );

  // Lấy thông tin đã lưu (nếu có) từ localStorage
  const savedProfile = JSON.parse(localStorage.getItem("userProfile"));

  // Nếu có thông tin đã lưu, cập nhật giao diện
  if (savedProfile) {
    // Cập nhật giá trị các input trong form
    document.getElementById("f_name").value = savedProfile.name;
    document.getElementById("f_user").value = savedProfile.username;
    document.getElementById("f_email").value = savedProfile.email;

    // Cập nhật tên hiển thị ở cột trái
    if (profileDisplayName) profileDisplayName.textContent = savedProfile.name;
    if (profileDisplayUser)
      profileDisplayUser.textContent = `@${savedProfile.username}`;
  }

  // Xử lý sự kiện Submit của Form
  if (profileForm) {
    profileForm.addEventListener("submit", (e) => {
      e.preventDefault(); // Ngăn chặn tải lại trang

      // Lấy giá trị mới từ các input
      const name = document.getElementById("f_name").value;
      const username = document.getElementById("f_user").value;
      const email = document.getElementById("f_email").value;

      // Tạo đối tượng dữ liệu
      const profileData = { name, username, email };

      // Lưu vào localStorage
      localStorage.setItem("userProfile", JSON.stringify(profileData));

      // Cập nhật tên hiển thị trực tiếp trên giao diện (Cột trái Profile)
      if (profileDisplayName) profileDisplayName.textContent = name;
      if (profileDisplayUser) profileDisplayUser.textContent = `@${username}`;

      // Hiển thị thông báo (Toast hoặc Alert)
      showToast("Cập nhật thông tin thành công!", "success");

      // Đóng overlay
      closeProfile();
    });
  }
  // Khởi tạo data từ LocalStorage
  let vaults = JSON.parse(localStorage.getItem("vaults")) || [];

  // Render danh sách
  const renderVault = () => {
    passwordList.innerHTML = "";
    if (vaults.length === 0) {
      passwordList.innerHTML = `<tr><td colspan="4" class="text-center py-4 text-muted">No passwords found. Add one!</td></tr>`;
      return;
    }

    vaults.forEach((item, index) => {
      const tr = document.createElement("tr");
      tr.setAttribute("data-index", index);
      tr.innerHTML = `
                  <td class="ps-4 fw-semibold"><i class="fa-brands fa-${item.service.toLowerCase()} me-2 text-muted"></i>${item.service}</td>
                  <td class="text-muted">${item.username}</td>
                  <td>
                      <span class="pwd-mask" id="pwd-${index}">••••••••</span>
                      <input type="hidden" value="${item.password}" id="raw-${index}">
                  </td>
                  <td class="text-end pe-4">
                      <button class="btn btn-sm btn-link action-btn" onclick="toggleView(${index})" title="View"><i class="fa-regular fa-eye"></i></button>
                      <button class="btn btn-sm btn-link action-btn" onclick="copyPwd(${index})" title="Copy"><i class="fa-regular fa-copy"></i></button>
                      <button class="btn btn-sm btn-link action-btn" onclick="editPwd(${index})" title="Edit"><i class="fa-regular fa-pen-to-square"></i></button>
                      <button class="btn btn-sm btn-link action-btn delete" onclick="deletePwd(${index})" title="Delete"><i class="fa-regular fa-trash-can"></i></button>
                  </td>
              `;
      passwordList.appendChild(tr);
    });
  };
  window.openProfile = function () {
    const overlay = document.getElementById("profileOverlay");
    if (overlay) {
      overlay.classList.remove("d-none");
    }
  };

  window.closeProfile = function () {
    const overlay = document.getElementById("profileOverlay");
    if (overlay) {
      overlay.classList.add("d-none");
    }
  };
  // Toggle Password in List
  window.toggleView = (index) => {
    const span = document.getElementById(`pwd-${index}`);
    const raw = document.getElementById(`raw-${index}`).value;
    span.innerText = span.innerText === "••••••••" ? raw : "••••••••";
    span.classList.toggle("pwd-mask");
  };

  // Copy to Clipboard
  window.copyPwd = (index) => {
    const raw = document.getElementById(`raw-${index}`).value;
    navigator.clipboard.writeText(raw).then(() => {
      showToast("Đã copy mật khẩu!", "info");
    });
  };

  // Handle Form Submit (Add/Edit)
  passwordForm.addEventListener("submit", (e) => {
    e.preventDefault();

    // Bootstrap Validation
    if (!passwordForm.checkValidity()) {
      e.stopPropagation();
      passwordForm.classList.add("was-validated");
      return;
    }

    const editId = document.getElementById("editId").value;
    const newData = {
      service: document.getElementById("serviceName").value,
      username: document.getElementById("userName").value,
      password: document.getElementById("passWord").value,
    };

    if (editId !== "") {
      vaults[editId] = newData;
    } else {
      vaults.push(newData);
    }

    localStorage.setItem("vaults", JSON.stringify(vaults));
    bootstrapModal.hide();
    renderVault();
  });

  // Reset form khi đóng modal
  modalElement.addEventListener("hidden.bs.modal", () => {
    passwordForm.reset();
    document.getElementById("editId").value = "";
    passwordForm.classList.remove("was-validated");
    document.getElementById("modalTitle").innerText = "Add New Password";
  });

  // Hàm Edit (gắn dữ liệu lên modal)
  //   window.editPwd = (index) => {
  //     const item = vaults[index];
  //     document.getElementById("editId").value = index;
  //     document.getElementById("serviceName").value = item.service;
  //     document.getElementById("userName").value = item.username;
  //     document.getElementById("passWord").value = item.password;
  //     document.getElementById("modalTitle").innerText = "Edit Password";
  //     bootstrapModal.show();
  //   };
  window.editPwd = (index) => {
    const item = vaults[index];

    // tìm dòng hiện tại
    const currentRow = document.querySelector(`tr[data-index="${index}"]`);

    // nếu đã mở rồi thì đóng
    if (
      currentRow.nextElementSibling &&
      currentRow.nextElementSibling.classList.contains("edit-row")
    ) {
      currentRow.nextElementSibling.remove();
      return;
    }

    // đóng tất cả form khác
    document.querySelectorAll(".edit-row").forEach((e) => e.remove());

    // tạo row edit
    const editRow = document.createElement("tr");
    editRow.classList.add("edit-row");

    editRow.innerHTML = `
    <td colspan="4" class="p-0">
        <div class="p-4 bg-white custom-border-left shadow-sm my-2 rounded-3">

            <div class="d-flex flex-column gap-3">

                <!-- Service -->
                <div class="d-flex align-items-center">
                    <div style="width: 120px" class="text-muted small fw-semibold">
                        Service
                    </div>
                    <div class="flex-grow-1">
                        <input type="text" class="form-control border-light-subtle shadow-none" id="edit-service"
                            value="${item.service}">
                    </div>
                </div>

                <!-- Username -->
                <div class="d-flex align-items-center">
                    <div style="width: 120px" class="text-muted small fw-semibold">
                        Username
                    </div>
                    <div class="flex-grow-1">
                        <input type="text" class="form-control border-light-subtle shadow-none" id="edit-username"
                            value="${item.username}">
                    </div>
                </div>

                <!-- Password -->
                <div class="d-flex align-items-center">
                    <div style="width: 120px" class="text-muted small fw-semibold">
                        Password
                    </div>
                    <div class="flex-grow-1">
                        <div class="input-group">
                            <input type="password" class="form-control border-light-subtle shadow-none" id="edit-password"
                                value="${item.password}">
                            <button class="btn btn-outline-secondary border-light-subtle" type="button"
                                onclick="toggleEditPassword(this)">
                                <i class="fa-regular fa-eye"></i>
                            </button>
                        </div>
                    </div>
                </div>

                <!-- Action -->
                <div class="d-flex justify-content-end gap-2 pt-2">
                    <button class="btn btn-light border text-muted px-3" onclick="this.closest('tr').remove()">
                        Cancel
                    </button>

                    <button class="btn btn-primary-custom px-4 shadow-sm" onclick="saveInline(${index})">
                        <i class="fa-solid fa-check me-1"></i> Save
                    </button>
                </div>

            </div>

        </div>
    </td>
    `;

    currentRow.after(editRow);
  };
  window.saveInline = (index) => {
    const service = document.getElementById("edit-service").value;
    const username = document.getElementById("edit-username").value;
    const password = document.getElementById("edit-password").value;

    vaults[index] = { service, username, password };

    localStorage.setItem("vaults", JSON.stringify(vaults));

    renderVault();
    showToast("Cập nhật thành công!", "success");
  };
  // Hàm Delete
  window.deletePwd = (index) => {
    if (confirm("Xóa mật khẩu này?")) {
      vaults.splice(index, 1);
      localStorage.setItem("vaults", JSON.stringify(vaults));
      renderVault();

      showToast("Đã xóa mật khẩu!", "warning");
    }
  };

  // Toggle password visibility trong Modal
  document
    .getElementById("toggleModalPass")
    .addEventListener("click", function () {
      const pwdInput = document.getElementById("passWord");
      const icon = this.querySelector("i");
      if (pwdInput.type === "password") {
        pwdInput.type = "text";
        icon.classList.replace("fa-eye", "fa-eye-slash");
      } else {
        pwdInput.type = "password";
        icon.classList.replace("fa-eye-slash", "fa-eye");
      }
    });

  renderVault(); // Render lần đầu
  showToast("Đã lưu mật khẩu!", "success");
  // ===== TOAST FUNCTION =====
  function showToast(message, type = "success") {
    let container = document.querySelector(".toast-container");

    if (!container) {
      container = document.createElement("div");
      container.className = "toast-container position-fixed top-0 end-0 p-3";
      document.body.appendChild(container);
    }

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
      <small>Now</small>
      <button class="btn-close" data-bs-dismiss="toast"></button>
    </div>
    <div class="toast-body">
      ${message}
    </div>
  `;

    container.appendChild(toast);

    setTimeout(() => toast.remove(), 2500);
  }
});
