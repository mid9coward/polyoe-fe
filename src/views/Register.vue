<template>
  <div class="register-page">
    <div class="container py-5">
      <div class="row justify-content-center">
        <div class="col-md-8 col-lg-6">
          <div class="card shadow">
            <div class="card-body p-4">
              <div class="text-center mb-4">
                <i class="fas fa-user-plus fa-3x text-primary mb-3"></i>
                <h3 class="fw-bold">Đăng Ký Tài Khoản</h3>
                <p class="text-muted">
                  Tạo tài khoản để trải nghiệm đầy đủ tính năng
                </p>
              </div>

              <form @submit.prevent="register">
                <div class="row">
                  <div class="col-md-6 mb-3">
                    <label for="userId" class="form-label"
                      >Tên đăng nhập *</label
                    >
                    <input
                      type="text"
                      class="form-control"
                      id="userId"
                      v-model="registerForm.id"
                      placeholder="Nhập tên đăng nhập"
                      required
                    />
                  </div>
                  <div class="col-md-6 mb-3">
                    <label for="fullname" class="form-label">Họ và tên *</label>
                    <input
                      type="text"
                      class="form-control"
                      id="fullname"
                      v-model="registerForm.fullname"
                      placeholder="Nhập họ và tên"
                      required
                    />
                  </div>
                </div>

                <div class="mb-3">
                  <label for="email" class="form-label">Email *</label>
                  <input
                    type="email"
                    class="form-control"
                    id="email"
                    v-model="registerForm.email"
                    placeholder="Nhập địa chỉ email"
                    required
                  />
                </div>

                <div class="row">
                  <div class="col-md-6 mb-3">
                    <label for="password" class="form-label">Mật khẩu *</label>
                    <input
                      type="password"
                      class="form-control"
                      id="password"
                      v-model="registerForm.password"
                      placeholder="Nhập mật khẩu"
                      required
                    />
                  </div>
                  <div class="col-md-6 mb-3">
                    <label for="confirmPassword" class="form-label"
                      >Xác nhận mật khẩu *</label
                    >
                    <input
                      type="password"
                      class="form-control"
                      id="confirmPassword"
                      v-model="registerForm.confirmPassword"
                      placeholder="Nhập lại mật khẩu"
                      required
                    />
                  </div>
                </div>

                <div class="mb-3 form-check">
                  <input
                    type="checkbox"
                    class="form-check-input"
                    id="agreeTerms"
                    v-model="registerForm.agreeTerms"
                    required
                  />
                  <label class="form-check-label" for="agreeTerms">
                    Tôi đồng ý với
                    <a href="#" class="text-decoration-none"
                      >Điều khoản sử dụng</a
                    >
                  </label>
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
                  <i v-else class="fas fa-user-plus me-2"></i>
                  {{ loading ? "Đang đăng ký..." : "Đăng Ký" }}
                </button>
              </form>

              <div class="text-center">
                Đã có tài khoản?
                <router-link to="/login" class="text-decoration-none">
                  <i class="fas fa-sign-in-alt me-1"></i>Đăng nhập ngay
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
  name: "Register",
  setup() {
    const router = useRouter();
    const { showNotification } = inject("notification");

    const loading = ref(false);
    const registerForm = ref({
      id: "",
      fullname: "",
      email: "",
      password: "",
      confirmPassword: "",
      agreeTerms: false,
    });

    const register = async () => {
      // Validate passwords match
      if (registerForm.value.password !== registerForm.value.confirmPassword) {
        showNotification("danger", "Lỗi", "Mật khẩu xác nhận không khớp");
        return;
      }

      // Validate password length
      if (registerForm.value.password.length < 6) {
        showNotification("danger", "Lỗi", "Mật khẩu phải có ít nhất 6 ký tự");
        return;
      }

      loading.value = true;

      try {
        const userData = {
          id: registerForm.value.id,
          fullname: registerForm.value.fullname,
          email: registerForm.value.email,
          password: registerForm.value.password,
          admin: false,
        };

        await userService.register(userData);

        showNotification(
          "success",
          "Đăng ký thành công",
          "Tài khoản đã được tạo. Vui lòng đăng nhập."
        );
        router.push("/login");
      } catch (error) {
        console.error("Registration error:", error);
        if (error.response?.status === 409) {
          showNotification(
            "danger",
            "Đăng ký thất bại",
            "Tên đăng nhập hoặc email đã tồn tại"
          );
        } else {
          showNotification(
            "danger",
            "Đăng ký thất bại",
            error.message || "Có lỗi xảy ra. Vui lòng thử lại."
          );
        }
      } finally {
        loading.value = false;
      }
    };

    return {
      loading,
      registerForm,
      register,
    };
  },
};
</script>

<style scoped>
.register-page {
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
