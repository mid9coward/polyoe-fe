import { createApp } from "vue";
import { createRouter, createWebHistory } from "vue-router";
import App from "./App.vue";

// Bootstrap CSS only
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";

// Components
import Home from "./views/Home.vue";
import VideoDetail from "./views/VideoDetail.vue";
import MyFavorites from "./views/MyFavorites.vue";
import Login from "./views/Login.vue";
import Register from "./views/Register.vue";
import ForgotPassword from "./views/ForgotPassword.vue";
import ChangePassword from "./views/ChangePassword.vue";
import Profile from "./views/Profile.vue";

// Admin Components
import AdminVideos from "./views/admin/AdminVideos.vue";
import AdminUsers from "./views/admin/AdminUsers.vue";
import AdminReports from "./views/admin/AdminReports.vue";

const routes = [
  // Public routes
  { path: "/", component: Home },
  { path: "/video/:id", component: VideoDetail },
  { path: "/login", component: Login },
  { path: "/register", component: Register },
  { path: "/forgot-password", component: ForgotPassword },

  // Protected user routes
  {
    path: "/my-favorites",
    component: MyFavorites,
    meta: { requiresAuth: true },
  },
  {
    path: "/change-password",
    component: ChangePassword,
    meta: { requiresAuth: true },
  },
  {
    path: "/profile",
    component: Profile,
    meta: { requiresAuth: true },
  },

  // Admin routes
  {
    path: "/admin/videos",
    component: AdminVideos,
    meta: { requiresAuth: true, requiresAdmin: true },
  },
  {
    path: "/admin/users",
    component: AdminUsers,
    meta: { requiresAuth: true, requiresAdmin: true },
  },
  {
    path: "/admin/reports",
    component: AdminReports,
    meta: { requiresAuth: true, requiresAdmin: true },
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

// Route guard - Authentication & Authorization
router.beforeEach((to, from, next) => {
  const savedUserString = localStorage.getItem("currentUser");
  let currentUser = null;
  if (savedUserString && savedUserString !== "undefined") {
    try {
      currentUser = JSON.parse(savedUserString);
    } catch (e) {
      console.error("Error parsing currentUser in router guard:", e);
      localStorage.removeItem("currentUser"); // Clear invalid data
    }
  }

  // Check if route requires authentication
  if (to.meta.requiresAuth && !currentUser) {
    // Store the intended route for redirect after login
    localStorage.setItem("intendedRoute", to.fullPath);
    next("/login");
    return;
  }

  // Check if route requires admin privileges
  if (to.meta.requiresAdmin && (!currentUser || !currentUser.admin)) {
    alert("Truy cập bị từ chối. Yêu cầu quyền quản trị viên.");
    next("/");
    return;
  }

  // If user is logged in and trying to access login/register, redirect to home
  if (currentUser && (to.path === "/login" || to.path === "/register")) {
    next("/");
    return;
  }

  next();
});

const app = createApp(App);
app.use(router);
app.mount("#app");
