<template>
  <div class="admin-users">
    <div class="container py-4">
      <div class="d-flex justify-content-between align-items-center mb-4">
        <h2>
          <i class="fas fa-users me-2"></i>
          Quản Lý Người Dùng
        </h2>
      </div>

      <div class="row">
        <!-- Form Section -->
        <div class="col-lg-4">
          <div class="card shadow-sm">
            <div class="card-header">
              <h5 class="mb-0">
                {{ isEditing ? "Cập Nhật Người Dùng" : "Thông Tin Người Dùng" }}
              </h5>
            </div>
            <div class="card-body">
              <form @submit.prevent="saveUser">
                <div class="mb-3">
                  <label for="userId" class="form-label">User ID</label>
                  <input
                    type="text"
                    class="form-control"
                    id="userId"
                    v-model="currentUser.id"
                    disabled
                  />
                </div>

                <div class="mb-3">
                  <label for="fullname" class="form-label">Họ và tên</label>
                  <input
                    type="text"
                    class="form-control"
                    id="fullname"
                    v-model="currentUser.fullname"
                    :disabled="!isEditing"
                    required
                  />
                </div>

                <div class="mb-3">
                  <label for="email" class="form-label">Email</label>
                  <input
                    type="email"
                    class="form-control"
                    id="email"
                    v-model="currentUser.email"
                    :disabled="!isEditing"
                    required
                  />
                </div>

                <div class="mb-3 form-check">
                  <input
                    type="checkbox"
                    class="form-check-input"
                    id="admin"
                    v-model="currentUser.admin"
                    :disabled="!isEditing"
                  />
                  <label class="form-check-label" for="admin">
                    Quản trị viên
                  </label>
                </div>

                <div class="d-grid gap-2" v-if="isEditing">
                  <button
                    type="submit"
                    class="btn btn-primary"
                    :disabled="loading"
                  >
                    <i class="fas fa-save me-1"></i>Cập Nhật
                  </button>

                  <button
                    type="button"
                    class="btn btn-danger"
                    @click="deleteUser"
                    :disabled="loading"
                  >
                    <i class="fas fa-trash me-1"></i>Xóa
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>

        <!-- Users List Section -->
        <div class="col-lg-8">
          <div class="card shadow-sm">
            <div class="card-header">
              <h5 class="mb-0">Danh Sách Người Dùng</h5>
            </div>
            <div class="card-body">
              <!-- Loading -->
              <div v-if="loading" class="text-center py-4">
                <div class="spinner-border text-primary" role="status">
                  <span class="visually-hidden">Đang tải...</span>
                </div>
              </div>

              <!-- Users Table -->
              <div v-else class="table-responsive">
                <table class="table table-hover">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Họ và tên</th>
                      <th>Email</th>
                      <th>Vai trò</th>
                      <th>Thao tác</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="user in paginatedUsers" :key="user.id">
                      <td>
                        <strong>{{ user.id }}</strong>
                      </td>
                      <td>{{ user.fullname }}</td>
                      <td>{{ user.email }}</td>
                      <td>
                        <span
                          class="badge"
                          :class="user.admin ? 'bg-danger' : 'bg-primary'"
                        >
                          {{ user.admin ? "Admin" : "User" }}
                        </span>
                      </td>
                      <td>
                        <button
                          class="btn btn-sm btn-outline-primary"
                          @click="editUser(user)"
                        >
                          <i class="fas fa-edit"></i>
                        </button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <!-- Pagination -->
              <nav v-if="totalPages > 1" class="mt-4">
                <div class="d-flex justify-content-center">
                  <div class="btn-group" role="group">
                    <button
                      class="btn btn-outline-primary btn-sm"
                      @click="goToPage(1)"
                      :disabled="currentPage === 1"
                      title="Trang đầu"
                    >
                      <i class="fas fa-angle-double-left"></i>
                    </button>
                    <button
                      class="btn btn-outline-primary btn-sm"
                      @click="goToPage(currentPage - 1)"
                      :disabled="currentPage === 1"
                      title="Trang trước"
                    >
                      <i class="fas fa-angle-left"></i>
                    </button>
                    <span class="btn btn-primary btn-sm disabled">
                      {{ currentPage }} / {{ totalPages }}
                    </span>
                    <button
                      class="btn btn-outline-primary btn-sm"
                      @click="goToPage(currentPage + 1)"
                      :disabled="currentPage === totalPages"
                      title="Trang sau"
                    >
                      <i class="fas fa-angle-right"></i>
                    </button>
                    <button
                      class="btn btn-outline-primary btn-sm"
                      @click="goToPage(totalPages)"
                      :disabled="currentPage === totalPages"
                      title="Trang cuối"
                    >
                      <i class="fas fa-angle-double-right"></i>
                    </button>
                  </div>
                </div>
              </nav>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted, inject } from "vue";
import { userService } from "../../services/api";

export default {
  name: "AdminUsers",
  setup() {
    const { showNotification } = inject("notification");

    const users = ref([]);
    const loading = ref(false);
    const isEditing = ref(false);
    const currentPage = ref(1);
    const usersPerPage = 10;

    const currentUser = ref({
      id: "",
      fullname: "",
      email: "",
      admin: false,
    });

    // Computed
    const totalPages = computed(() =>
      Math.ceil(users.value.length / usersPerPage)
    );

    const paginatedUsers = computed(() => {
      const start = (currentPage.value - 1) * usersPerPage;
      const end = start + usersPerPage;
      return users.value.slice(start, end);
    });

    // Methods
    const loadUsers = async () => {
      loading.value = true;
      try {
        const response = await userService.getAll();
        users.value = response.data || [];
      } catch (error) {
        showNotification("danger", "Lỗi", "Không thể tải danh sách người dùng");
      } finally {
        loading.value = false;
      }
    };

    const editUser = (user) => {
      isEditing.value = true;
      currentUser.value = { ...user };
    };

    const saveUser = async () => {
      loading.value = true;

      try {
        await userService.update(currentUser.value.id, currentUser.value);
        showNotification(
          "success",
          "Thành công",
          "Người dùng đã được cập nhật"
        );
        loadUsers();
      } catch (error) {
        showNotification("danger", "Lỗi", "Không thể cập nhật người dùng");
      } finally {
        loading.value = false;
      }
    };

    const deleteUser = async () => {
      if (confirm("Bạn có chắc muốn xóa người dùng này?")) {
        loading.value = true;

        try {
          await userService.delete(currentUser.value.id);
          showNotification("success", "Thành công", "Người dùng đã được xóa");
          isEditing.value = false;
          currentUser.value = { id: "", fullname: "", email: "", admin: false };
          loadUsers();
        } catch (error) {
          showNotification("danger", "Lỗi", "Không thể xóa người dùng");
        } finally {
          loading.value = false;
        }
      }
    };

    const goToPage = (page) => {
      if (page >= 1 && page <= totalPages.value) {
        currentPage.value = page;
        isEditing.value = false;
        currentUser.value = { id: "", fullname: "", email: "", admin: false };
      }
    };

    onMounted(() => {
      loadUsers();
    });

    return {
      users,
      loading,
      isEditing,
      currentPage,
      totalPages,
      currentUser,
      paginatedUsers,
      loadUsers,
      editUser,
      saveUser,
      deleteUser,
      goToPage,
    };
  },
};
</script>

<style scoped>
.table th {
  background-color: #f8f9fa;
  font-weight: 600;
}

.btn-group .btn {
  border-radius: 0.375rem;
  margin-right: 0.25rem;
}

.btn-group .btn:last-child {
  margin-right: 0;
}
</style>
