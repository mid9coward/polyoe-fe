<template>
  <div id="app" :class="{ 'dark-theme': isDarkMode }">
    <!-- Navigation -->
    <nav class="navbar navbar-expand-lg navbar-dark bg-primary sticky-top">
      <div class="container">
        <router-link class="navbar-brand fw-bold" to="/">
          <i class="fas fa-video me-2"></i>
          Online Entertainment
        </router-link>

        <button
          class="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span class="navbar-toggler-icon"></span>
        </button>

        <div class="collapse navbar-collapse" id="navbarNav">
          <ul class="navbar-nav me-auto">
            <li class="nav-item">
              <router-link class="nav-link" to="/">
                <i class="fas fa-home me-1"></i>Trang Chủ
              </router-link>
            </li>

            <!-- User Menu -->
            <li v-if="currentUser && !currentUser.admin" class="nav-item">
              <router-link class="nav-link" to="/my-favorites">
                <i class="fas fa-heart me-1"></i>Yêu Thích
              </router-link>
            </li>

            <!-- Admin Menu -->
            <li
              v-if="currentUser && currentUser.admin"
              class="nav-item dropdown"
            >
              <a
                class="nav-link dropdown-toggle"
                href="#"
                id="adminDropdown"
                role="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                <i class="fas fa-cog me-1"></i>Quản Trị
              </a>
              <ul class="dropdown-menu" aria-labelledby="adminDropdown">
                <li>
                  <router-link class="dropdown-item" to="/admin/videos">
                    <i class="fas fa-video me-2"></i>Quản Lý Video
                  </router-link>
                </li>
                <li>
                  <router-link class="dropdown-item" to="/admin/users">
                    <i class="fas fa-users me-2"></i>Quản Lý Người Dùng
                  </router-link>
                </li>
                <li>
                  <router-link class="dropdown-item" to="/admin/reports">
                    <i class="fas fa-chart-bar me-2"></i>Báo Cáo - Thống Kê
                  </router-link>
                </li>
              </ul>
            </li>
          </ul>

          <ul class="navbar-nav">
            <!-- Account Menu -->
            <li v-if="!currentUser" class="nav-item dropdown">
              <a
                class="nav-link dropdown-toggle"
                href="#"
                id="accountDropdown"
                role="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                <i class="fas fa-user me-1"></i>Tài Khoản
              </a>
              <ul class="dropdown-menu" aria-labelledby="accountDropdown">
                <li>
                  <router-link class="dropdown-item" to="/login">
                    <i class="fas fa-sign-in-alt me-2"></i>Đăng Nhập
                  </router-link>
                </li>
                <li>
                  <router-link class="dropdown-item" to="/register">
                    <i class="fas fa-user-plus me-2"></i>Đăng Ký
                  </router-link>
                </li>
                <li><hr class="dropdown-divider" /></li>
                <li>
                  <router-link class="dropdown-item" to="/forgot-password">
                    <i class="fas fa-key me-2"></i>Quên Mật Khẩu
                  </router-link>
                </li>
              </ul>
            </li>

            <!-- Logged in user menu -->
            <li v-if="currentUser" class="nav-item dropdown">
              <a
                class="nav-link dropdown-toggle"
                href="#"
                id="userDropdown"
                role="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                <img
                  :src="
                    currentUser.avatarUrl
                      ? `http://localhost:1212${currentUser.avatarUrl}`
                      : '/default-avatar.png'
                  "
                  alt="Avatar"
                  class="rounded-circle me-1"
                  style="width: 24px; height: 24px; object-fit: cover"
                />
                {{ currentUser.fullname || currentUser.id }}
              </a>
              <ul
                class="dropdown-menu dropdown-menu-end"
                aria-labelledby="userDropdown"
              >
                <li>
                  <router-link class="dropdown-item" to="/profile">
                    <i class="fas fa-user me-2"></i>Cập Nhật Tài Khoản
                  </router-link>
                </li>
                <li>
                  <router-link class="dropdown-item" to="/change-password">
                    <i class="fas fa-lock me-2"></i>Đổi Mật Khẩu
                  </router-link>
                </li>
                <li><hr class="dropdown-divider" /></li>
                <li>
                  <a class="dropdown-item" href="#" @click.prevent="logout">
                    <i class="fas fa-sign-out-alt me-2"></i>Đăng Xuất
                  </a>
                </li>
              </ul>
            </li>
          </ul>
        </div>
      </div>
    </nav>

    <!-- Main Content -->
    <main class="min-vh-100">
      <router-view />
    </main>

    <!-- Footer -->
    <footer class="bg-dark text-light py-4 mt-5">
      <div class="container">
        <div class="row">
          <div class="col-md-6">
            <h5 class="fw-bold mb-3">
              <i class="fas fa-video me-2"></i>Online Entertainment
            </h5>
            <p>
              Nền tảng giải trí trực tuyến hàng đầu với những tiểu phẩm hài hước
              và chất lượng cao.
            </p>
          </div>
          <div class="col-md-6">
            <h6 class="fw-bold mb-3">Liên Hệ</h6>
            <ul class="list-unstyled">
              <li class="mb-2">
                <i class="fas fa-envelope me-2"></i>
                contact@oe.com
              </li>
              <li class="mb-2">
                <i class="fas fa-phone me-2"></i>
                (84) 123-456-789
              </li>
              <li class="mb-2">
                <i class="fas fa-map-marker-alt me-2"></i>
                Hà Nội, Việt Nam
              </li>
            </ul>
          </div>
        </div>

        <hr class="my-4" />

        <div class="row align-items-center">
          <div class="col-md-6">
            <p class="small mb-0">
              © {{ currentYear }} Online Entertainment. All rights reserved.
            </p>
          </div>
          <div class="col-md-6 text-md-end">
            <p class="small mb-0">Được phát triển bởi Java 4 Assignment</p>
          </div>
        </div>
      </div>
    </footer>

    <!-- Toast Container for notifications -->
    <div class="toast-container position-fixed bottom-0 end-0 p-3">
      <div
        v-if="notification.show"
        class="toast show"
        :class="notification.type"
      >
        <div class="toast-header">
          <strong class="me-auto">{{ notification.title }}</strong>
          <button
            type="button"
            class="btn-close"
            @click="hideNotification"
          ></button>
        </div>
        <div class="toast-body">
          {{ notification.message }}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, provide, computed, onMounted } from "vue";

export default {
  name: "App",
  setup() {
    const notification = ref({
      show: false,
      type: "",
      title: "",
      message: "",
    });

    const isDarkMode = ref(false);
    const currentUser = ref(null);

    const currentYear = computed(() => new Date().getFullYear());

    // Load user from localStorage on app start
    onMounted(() => {
      const savedUser = localStorage.getItem("currentUser");
      if (savedUser && savedUser !== "undefined") {
        try {
          currentUser.value = JSON.parse(savedUser);
        } catch (e) {
          console.error("Error parsing currentUser from localStorage:", e);
          localStorage.removeItem("currentUser"); // Clear invalid data
          currentUser.value = null; // Ensure currentUser is null
        }
      }
    });

    const showNotification = (type, title, message) => {
      notification.value = {
        show: true,
        type: `bg-${type}`,
        title,
        message,
      };
      setTimeout(() => {
        hideNotification();
      }, 5000);
    };

    const hideNotification = () => {
      notification.value.show = false;
    };

    const logout = () => {
      currentUser.value = null;
      localStorage.removeItem("currentUser");
      localStorage.removeItem("intendedRoute");
      showNotification("info", "Đăng Xuất", "Bạn đã đăng xuất thành công");

      // Redirect to home page
      window.location.href = "/";
    };

    // Provide notification methods to child components
    provide("notification", { showNotification });
    provide("currentUser", currentUser);

    return {
      notification,
      isDarkMode,
      currentUser,
      currentYear,
      hideNotification,
      logout,
    };
  },
};
</script>

<style>
.router-link-active {
  font-weight: bold;
}

.toast {
  min-width: 300px;
}

.navbar-brand {
  font-size: 1.5rem;
}

.dropdown-menu {
  border: none;
  box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.15);
}

.min-vh-100 {
  min-height: calc(100vh - 200px);
}

footer a:hover {
  color: #fff !important;
  transition: color 0.3s ease;
}

/* Dark Theme */
.dark-theme {
  background-color: #1a1a1a;
  color: #ffffff;
}

.dark-theme .bg-light {
  background-color: #2d2d2d !important;
}

.dark-theme .card {
  background-color: #2d2d2d;
  border-color: #404040;
}

.dark-theme .card-body {
  color: #ffffff;
}

.dark-theme .text-muted {
  color: #b0b0b0 !important;
}

.dark-theme .modal-content {
  background-color: #2d2d2d;
  color: #ffffff;
}

.dark-theme .form-control {
  background-color: #404040;
  border-color: #555555;
  color: #ffffff;
}

.dark-theme .form-control:focus {
  background-color: #404040;
  border-color: #007bff;
  color: #ffffff;
}

.dark-theme .table {
  color: #ffffff;
}

@media (max-width: 768px) {
  .navbar-brand {
    font-size: 1.25rem;
  }
}
</style>
