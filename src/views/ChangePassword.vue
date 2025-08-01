<template>
  <div class="change-password">
    <div class="container py-5">
      <div class="row justify-content-center">
        <div class="col-md-6 col-lg-4">
          <div class="card shadow">
            <div class="card-body p-4">
              <div class="text-center mb-4">
                <i class="fas fa-lock fa-3x text-primary mb-3"></i>
                <h3 class="fw-bold">Đổi Mật Khẩu</h3>
                <p class="text-muted">Cập nhật mật khẩu của bạn</p>
              </div>

              <form @submit.prevent="changePassword">
                <div class="mb-3">
                  <label for="currentPassword" class="form-label"
                    >Mật khẩu hiện tại</label
                  >
                  <input
                    type="password"
                    class="form-control"
                    id="currentPassword"
                    v-model="passwordForm.currentPassword"
                    placeholder="Nhập mật khẩu hiện tại"
                    required
                  />
                </div>

                <div class="mb-3">
                  <label for="newPassword" class="form-label"
                    >Mật khẩu mới</label
                  >
                  <input
                    type="password"
                    class="form-control"
                    id="newPassword"
                    v-model="passwordForm.newPassword"
                    placeholder="Nhập mật khẩu mới"
                    required
                  />
                </div>

                <div class="mb-3">
                  <label for="confirmPassword" class="form-label"
                    >Xác nhận mật khẩu mới</label
                  >
                  <input
                    type="password"
                    class="form-control"
                    id="confirmPassword"
                    v-model="passwordForm.confirmPassword"
                    placeholder="Nhập lại mật khẩu mới"
                    required
                  />
                </div>

                <button
                  type="submit"
                  class="btn btn-primary w-100 mb-3"
                  :disabled="loading"
                >
                  <span
                    v-if="loading"
                    class="spinner-border spinner-border-sm me-2"
                  ></span>
                  <i v-else class="fas fa-key me-2"></i>
                  {{ loading ? "Đang cập nhật..." : "Đổi Mật Khẩu" }}
                </button>
              </form>

              <div class="text-center">
                <router-link to="/profile" class="text-decoration-none">
                  <i class="fas fa-arrow-left me-1"></i>Quay lại hồ sơ
                </router-link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, inject } from "vue";
import { useRouter } from "vue-router";
import { userService } from "../services/api";

export default {
  name: "ChangePassword",
  setup() {
    const router = useRouter();
    const { showNotification } = inject("notification");
    const currentUser = inject("currentUser");

    const loading = ref(false);
    const passwordForm = ref({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });

    const changePassword = async () => {
      // Validate new passwords match
      if (
        passwordForm.value.newPassword !== passwordForm.value.confirmPassword
      ) {
        showNotification("danger", "Lỗi", "Mật khẩu mới không khớp");
        return;
      }

      // Validate password length
      if (passwordForm.value.newPassword.length < 6) {
        showNotification(
          "danger",
          "Lỗi",
          "Mật khẩu mới phải có ít nhất 6 ký tự"
        );
        return;
      }

      loading.value = true;

      try {
        await userService.changePassword({
          userId: currentUser.value.id, // Thêm userId vào đây
          currentPassword: passwordForm.value.currentPassword,
          newPassword: passwordForm.value.newPassword,
        });

        showNotification("success", "Thành công", "Mật khẩu đã được cập nhật");

        // Reset form
        passwordForm.value = {
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        };

        // Redirect to profile
        router.push("/profile");
      } catch (error) {
        console.error("Change password error:", error);
        if (error.response?.status === 400) {
          showNotification("danger", "Lỗi", "Mật khẩu hiện tại không đúng");
        } else {
          showNotification(
            "danger",
            "Lỗi",
            error.message || "Có lỗi xảy ra. Vui lòng thử lại."
          );
        }
      } finally {
        loading.value = false;
      }
    };

    return {
      loading,
      passwordForm,
      changePassword,
    };
  },
};
</script>

<style scoped>
.change-password {
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
  min-height: 100vh;
  padding-top: 2rem;
}

.card {
  border: none;
  border-radius: 1rem;
}

.form-control:focus {
  border-color: #667eea;
  box-shadow: 0 0 0 0.2rem rgba(102, 126, 234, 0.25);
}

.btn-primary {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border: none;
}

.btn-primary:hover {
  background: linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%);
}
</style>
