<template>
  <div class="login-page">
    <div class="container py-5">
      <div class="row justify-content-center">
        <div class="col-md-6 col-lg-4">
          <div class="card shadow">
            <div class="card-body p-4">
              <div class="text-center mb-4">
                <i class="fas fa-video fa-3x text-primary mb-3"></i>
                <h3 class="fw-bold">Đăng Nhập</h3>
                <p class="text-muted">
                  Đăng nhập để trải nghiệm đầy đủ tính năng
                </p>
              </div>

              <form @submit.prevent="login">
                <div class="mb-3">
                  <label for="username" class="form-label">Tên đăng nhập</label>
                  <input
                    type="text"
                    class="form-control"
                    id="username"
                    v-model="loginForm.id"
                    placeholder="Nhập tên đăng nhập"
                    required
                  />
                </div>

                <div class="mb-3">
                  <label for="password" class="form-label">Mật khẩu</label>
                  <input
                    type="password"
                    class="form-control"
                    id="password"
                    v-model="loginForm.password"
                    placeholder="Nhập mật khẩu"
                    required
                  />
                </div>

                <div class="mb-3 form-check">
                  <input
                    type="checkbox"
                    class="form-check-input"
                    id="rememberMe"
                    v-model="loginForm.rememberMe"
                  />
                  <label class="form-check-label" for="rememberMe">
                    Ghi nhớ đăng nhập
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
                  <i v-else class="fas fa-sign-in-alt me-2"></i>
                  {{ loading ? "Đang đăng nhập..." : "Đăng Nhập" }}
                </button>
              </form>

              <div class="text-center">
                <div class="mb-2">
                  <router-link
                    to="/forgot-password"
                    class="text-decoration-none"
                  >
                    <i class="fas fa-key me-1"></i>Quên mật khẩu?
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
import { ref, inject, onMounted } from "vue";
import { useRouter } from "vue-router";
import { userService } from "../services/api";

export default {
  name: "Login",
  setup() {
    const router = useRouter();
    const { showNotification } = inject("notification");
    const currentUser = inject("currentUser");

    const loading = ref(false);
    const loginForm = ref({
      id: "",
      password: "",
      rememberMe: false,
    });

    // Load remembered credentials on mount
    onMounted(() => {
      const rememberedUser = localStorage.getItem("rememberedUser");
      if (rememberedUser) {
        const userData = JSON.parse(rememberedUser);
        loginForm.value.id = userData.id || "";
        loginForm.value.rememberMe = true;
      }
    });

    const login = async () => {
      loading.value = true;

      try {
        const response = await userService.login({
          id: loginForm.value.id,
          password: loginForm.value.password,
        });

        // Save user to localStorage and reactive state
        // Access response.data.data because api.js interceptor returns the full ApiResponse object
        currentUser.value = response.data;
        localStorage.setItem("currentUser", JSON.stringify(response.data));

        // Handle remember me
        if (loginForm.value.rememberMe) {
          localStorage.setItem(
            "rememberedUser",
            JSON.stringify({
              id: loginForm.value.id,
            })
          );
        } else {
          localStorage.removeItem("rememberedUser");
        }

        showNotification(
          "success",
          "Đăng nhập thành công",
          `Chào mừng ${response.data.fullname || response.data.id}!`
        );

        // Redirect to intended route or home
        const intendedRoute = localStorage.getItem("intendedRoute");
        if (intendedRoute) {
          localStorage.removeItem("intendedRoute");
          router.push(intendedRoute);
        } else {
          router.push("/");
        }
      } catch (error) {
        showNotification(
          "danger",
          "Đăng nhập thất bại",
          error.message || "Tên đăng nhập hoặc mật khẩu không đúng"
        );
      } finally {
        loading.value = false;
      }
    };

    return {
      loading,
      loginForm,
      login,
    };
  },
};
</script>

<style scoped>
.login-page {
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
