export const Components = {
  // 1. Thành phần dòng mật khẩu trong bảng
  passwordRow: (item, index, getDomainName) => {
    const domainClass = getDomainName(item.url);
    return `
      <tr data-index="${index}">
        <td class="ps-4 fw-semibold text-truncate" style="max-width: 200px;">
          <i class="fa-brands fa-${domainClass} me-2 text-muted"></i>
          <a href="${item.url}" target="_blank" class="text-decoration-none text-reset">${item.url}</a>
        </td>
        <td class="text-muted">${item.username}</td>
        <td>
          <span class="pwd-mask" id="pwd-${index}">••••••••</span>
          <input type="hidden" value="${item.password}" id="raw-${index}">
        </td>
        <td class="text-end pe-4">
          <button class="btn btn-sm btn-link action-btn" onclick="toggleView(${index})"><i class="fa-regular fa-eye"></i></button>
          <button class="btn btn-sm btn-link action-btn" onclick="copyPwd(${index})"><i class="fa-regular fa-copy"></i></button>
          <button class="btn btn-sm btn-link action-btn" onclick="editPwd(${index})"><i class="fa-regular fa-pen-to-square"></i></button>
          <button class="btn btn-sm btn-link action-btn delete" onclick="deletePwd(${index})"><i class="fa-regular fa-trash-can"></i></button>
        </td>
      </tr>
    `;
  },

  // 2. Thành phần dòng chỉnh sửa (Inline Edit)
  editRow: (item, index) => {
    return `
      <tr class="edit-row">
        <td colspan="4" class="p-0">
          <div class="p-4 bg-white custom-border-left shadow-sm my-2 rounded-3">
            <div class="d-flex flex-column gap-3">
              <div class="d-flex align-items-center">
                <div style="width: 120px" class="text-muted small fw-semibold">URL / ID</div>
                <div class="flex-grow-1"><input type="text" class="form-control" id="edit-url" value="${item.url}"></div>
              </div>
              <div class="d-flex align-items-center">
                <div style="width: 120px" class="text-muted small fw-semibold">Username</div>
                <div class="flex-grow-1"><input type="text" class="form-control" id="edit-username" value="${item.username}"></div>
              </div>
              <div class="d-flex align-items-center">
                <div style="width: 120px" class="text-muted small fw-semibold">Password</div>
                <div class="flex-grow-1">
                  <div class="input-group">
                    <input type="password" class="form-control" id="edit-password" value="${item.password}">
                    <button class="btn btn-outline-secondary" onclick="toggleEditPassword(this)"><i class="fa-regular fa-eye"></i></button>
                  </div>
                </div>
              </div>
              <div class="d-flex justify-content-end gap-2 pt-2">
                <button class="btn btn-light border text-muted" onclick="this.closest('tr').remove()">Cancel</button>
                <button class="btn btn-primary-custom px-4" onclick="saveInline(${index})">Lưu</button>
              </div>
            </div>
          </div>
        </td>
      </tr>
    `;
  },

  // 3. Thành phần khi không có dữ liệu (Empty State)
  emptyState: () => `
    <tr>
      <td colspan="4" class="text-center py-5">
        <i class="fa-solid fa-lock fa-3x text-muted opacity-25 mb-3"></i>
        <h6 class="fw-bold">Chưa có dữ liệu</h6>
      </td>
    </tr>
  `
};