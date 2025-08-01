<template>
  <div class="forgot-password-page">
    <div class="container py-5">
      <div class="row justify-content-center">
        <div class="col-md-6 col-lg-4">
          <div class="card shadow">
            <div class="card-body p-4">
              <div class="text-center mb-4">
                <i class="fas fa-key fa-3x text-primary mb-3"></i>
                <h3 class="fw-bold">Quên Mật Khẩu</h3>
                <p class="text-muted">Nhập email để lấy lại mật khẩu</p>
              </div>

              <form @submit.prevent="retrievePassword">
                <div class="mb-3">
                  <label for="email" class="form-label">Email đã đăng ký</label>
                  <input
                    type="email"
                    class="form-control"
                    id="email"
                    v-model="forgotForm.email"
                    placeholder="Nhập địa chỉ email"
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
                  <i v-else class="fas fa-paper-plane me-2"></i>
                  {{ loading ? "Đang gửi..." : "Gửi Mật Khẩu" }}
                </button>
              </form>

              <div class="text-center">
                <div class="mb-2">
                  <router-link to="/login" class="text-decoration-none">
                    <i class="fas fa-arrow-left me-1"></i>Quay lại đăng nhập
                  </router-link>
                </div>
                <div>
                  Chưa có tài khoản?
                  <router-link to="/register" class="text-decoration-none">
                    <i class="fas fa-user-plus me-1"></i>Đăng ký ngay
                  </router-link>
                </div>
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
  name: "ForgotPassword",
  setup() {
    const router = useRouter();
    const { showNotification } = inject("notification");

    const loading = ref(false);
    const forgotForm = ref({
      email: "",
    });

    const retrievePassword = async () => {
      loading.value = true;

      try {
        await userService.forgotPassword(forgotForm.value.email);

        showNotification(
          "success",
          "Email đã được gửi",
          "Vui lòng kiểm tra email để lấy lại mật khẩu"
        );
        router.push("/login");
      } catch (error) {
        console.error("Forgot password error:", error);
        if (error.response?.status === 404) {
          showNotification(
            "danger",
            "Không tìm thấy",
            "Email này chưa được đăng ký"
          );
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
      forgotForm,
      retrievePassword,
    };
  },
};
</script>

<style scoped>
.forgot-password-page {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  min-height: 100vh;
  display: flex;
  align-items: center;
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
