<template>
  <div class="container py-5">
    <h2 class="mb-4">Quản Lý Người Dùng</h2>

    <div class="d-flex justify-content-between mb-3">
      <button class="btn btn-primary" @click="openCreateUserModal">
        <i class="fas fa-plus me-2"></i>Thêm Người Dùng Mới
      </button>
      <div class="input-group w-25">
        <input
          type="text"
          class="form-control"
          placeholder="Tìm kiếm người dùng..."
          v-model="searchQuery"
        />
        <button
          class="btn btn-outline-secondary"
          type="button"
          @click="fetchUsers"
        >
          <i class="fas fa-search"></i>
        </button>
      </div>
    </div>

    <div v-if="loading" class="text-center py-5">
      <div class="spinner-border text-primary" role="status">
        <span class="visually-hidden">Đang tải...</span>
      </div>
      <p class="mt-3">Đang tải danh sách người dùng...</p>
    </div>

    <div v-else-if="users.length > 0" class="table-responsive">
      <table
        class="table table-hover table-striped shadow-sm rounded overflow-hidden"
      >
        <thead class="bg-primary text-white">
          <tr>
            <th>Avatar</th>
            <th>ID</th>
            <th>Họ Tên</th>
            <th>Email</th>
            <th>Quản Trị</th>
            <th>Hành Động</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="user in filteredUsers" :key="user.id">
            <td>
              <img
                :src="
                  user.avatarUrl
                    ? `http://localhost:1212${user.avatarUrl}`
                    : '/default-avatar.png'
                "
                alt="Avatar"
                class="rounded-circle"
                style="width: 40px; height: 40px; object-fit: cover"
              />
            </td>
            <td>{{ user.id }}</td>
            <td>{{ user.fullname }}</td>
            <td>{{ user.email }}</td>
            <td>
              <span
                :class="user.admin ? 'badge bg-danger' : 'badge bg-primary'"
              >
                {{ user.admin ? "Có" : "Không" }}
              </span>
            </td>
            <td>
              <button
                class="btn btn-sm btn-warning me-2"
                @click="openEditUserModal(user)"
              >
                <i class="fas fa-edit"></i>
              </button>
              <button
                class="btn btn-sm btn-danger"
                @click="deleteUser(user.id)"
              >
                <i class="fas fa-trash-alt"></i>
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <div v-else class="alert alert-info text-center">
      Không có người dùng nào được tìm thấy.
    </div>

    <!-- User Modal (Create/Edit) -->
    <div
      class="modal fade"
      id="userModal"
      tabindex="-1"
      aria-labelledby="userModalLabel"
      aria-hidden="true"
    >
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="userModalLabel">
              {{ isEditMode ? "Chỉnh Sửa Người Dùng" : "Thêm Người Dùng Mới" }}
            </h5>
            <button
              type="button"
              class="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>
          <div class="modal-body">
            <form @submit.prevent="saveUser">
              <div class="mb-3">
                <label for="userId" class="form-label">ID Người Dùng</label>
                <input
                  type="text"
                  class="form-control"
                  id="userId"
                  v-model="currentEditUser.id"
                  :disabled="isEditMode"
                  required
                />
              </div>
              <div class="mb-3">
                <label for="userPassword" class="form-label">Mật Khẩu</label>
                <input
                  type="password"
                  class="form-control"
                  id="userPassword"
                  v-model="currentEditUser.password"
                  :required="!isEditMode"
                />
                <small v-if="isEditMode" class="form-text text-muted"
                  >Để trống nếu không muốn thay đổi mật khẩu.</small
                >
              </div>
              <div class="mb-3">
                <label for="userFullname" class="form-label">Họ Tên</label>
                <input
                  type="text"
                  class="form-control"
                  id="userFullname"
                  v-model="currentEditUser.fullname"
                  required
                />
              </div>
              <div class="mb-3">
                <label for="userEmail" class="form-label">Email</label>
                <input
                  type="email"
                  class="form-control"
                  id="userEmail"
                  v-model="currentEditUser.email"
                  required
                />
              </div>
              <div class="mb-3">
                <label for="userBio" class="form-label">Bio</label>
                <textarea
                  class="form-control"
                  id="userBio"
                  rows="3"
                  v-model="currentEditUser.bio"
                  placeholder="Thông tin giới thiệu..."
                ></textarea>
              </div>
              <div class="form-check mb-3">
                <input
                  class="form-check-input"
                  type="checkbox"
                  id="userAdmin"
                  v-model="currentEditUser.admin"
                />
                <label class="form-check-label" for="userAdmin">
                  Là Quản Trị Viên
                </label>
              </div>
              <button type="submit" class="btn btn-primary" :disabled="saving">
                <span
                  v-if="saving"
                  class="spinner-border spinner-border-sm"
                  role="status"
                  aria-hidden="true"
                ></span>
                <span v-if="saving">Đang lưu...</span>
                <span v-else>Lưu</span>
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, computed, inject } from "vue";
import { userService } from "../../services/api";
import { Modal } from "bootstrap";

export default {
  name: "AdminUsers",
  setup() {
    const { showNotification } = inject("notification");
    const users = ref([]);
    const loading = ref(true);
    const searchQuery = ref("");
    const currentEditUser = ref({
      id: "",
      password: "",
      fullname: "",
      email: "",
      admin: false,
      bio: "",
      avatarUrl: "", // Không set default avatar ở đây, để backend hoặc frontend tự xử lý
    });
    const isEditMode = ref(false);
    const saving = ref(false);

    let userModalInstance = null;

    const fetchUsers = async () => {
      loading.value = true;
      try {
        const response = await userService.getAll();
        users.value = response.data;
      } catch (error) {
        console.error("Error fetching users:", error);
        showNotification(
          "danger",
          "Lỗi",
          error.message || "Không thể tải danh sách người dùng."
        );
      } finally {
        loading.value = false;
      }
    };

    const filteredUsers = computed(() => {
      if (!searchQuery.value) {
        return users.value;
      }
      const query = searchQuery.value.toLowerCase();
      return users.value.filter(
        (user) =>
          user.id.toLowerCase().includes(query) ||
          user.fullname.toLowerCase().includes(query) ||
          user.email.toLowerCase().includes(query)
      );
    });

    const openCreateUserModal = () => {
      isEditMode.value = false;
      currentEditUser.value = {
        id: "",
        password: "",
        fullname: "",
        email: "",
        admin: false,
        bio: "",
        avatarUrl: "", // Để rỗng, frontend sẽ dùng ảnh mặc định cục bộ
      };
      if (userModalInstance) {
        userModalInstance.show();
      }
    };

    const openEditUserModal = (user) => {
      isEditMode.value = true;
      currentEditUser.value = { ...user }; // Copy user data to form
      if (userModalInstance) {
        userModalInstance.show();
      }
    };

    const saveUser = async () => {
      saving.value = true;
      try {
        if (isEditMode.value) {
          // If password is empty, do not send it to backend for update
          const userToUpdate = { ...currentEditUser.value };
          if (!userToUpdate.password) {
            delete userToUpdate.password; // Remove password field if empty
          }
          await userService.update(userToUpdate.id, userToUpdate);
          showNotification(
            "success",
            "Thành công",
            "Người dùng đã được cập nhật."
          );
        } else {
          await userService.create(currentEditUser.value);
          showNotification(
            "success",
            "Thành công",
            "Người dùng mới đã được thêm."
          );
        }
        if (userModalInstance) {
          userModalInstance.hide();
        }
        fetchUsers(); // Refresh list
      } catch (error) {
        console.error("Error saving user:", error);
        showNotification(
          "danger",
          "Lỗi",
          error.message || "Không thể lưu người dùng."
        );
      } finally {
        saving.value = false;
      }
    };

    const deleteUser = async (id) => {
      if (confirm("Bạn có chắc chắn muốn xóa người dùng này?")) {
        try {
          await userService.delete(id);
          showNotification("success", "Thành công", "Người dùng đã được xóa.");
          fetchUsers(); // Refresh list
        } catch (error) {
          console.error("Error deleting user:", error);
          showNotification(
            "danger",
            "Lỗi",
            error.message || "Không thể xóa người dùng."
          );
        }
      }
    };

    onMounted(() => {
      fetchUsers();
      const userModalElement = document.getElementById("userModal");
      if (userModalElement) {
        userModalInstance = new Modal(userModalElement);
      }
    });

    return {
      users,
      loading,
      searchQuery,
      filteredUsers,
      currentEditUser,
      isEditMode,
      saving,
      openCreateUserModal,
      openEditUserModal,
      saveUser,
      deleteUser,
    };
  },
};
</script>
