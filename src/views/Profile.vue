<template>
  <div class="container py-5">
    <div class="row">
      <div class="col-lg-4">
        <div class="card shadow-sm">
          <div class="card-body text-center">
            <i class="fas fa-user-circle fa-5x text-primary mb-3"></i>
            <h4>{{ user.fullname || user.id }}</h4>
            <p class="text-muted">
              {{ user.admin ? "Administrator" : "User" }}
            </p>
            <span
              class="badge"
              :class="user.admin ? 'bg-danger' : 'bg-primary'"
            >
              {{ user.admin ? "Admin" : "Member" }}
            </span>
          </div>
        </div>

        <div class="card shadow-sm mt-4">
          <div class="card-header">
            <h6 class="mb-0">Quick Stats</h6>
          </div>
          <div class="card-body">
            <div class="table-responsive">
              <table class="table table-borderless">
                <tbody>
                  <tr>
                    <td>Favorite Videos:</td>
                    <td>
                      <strong>{{ userStats.favorites }}</strong>
                    </td>
                  </tr>
                  <tr>
                    <td>Videos Shared:</td>
                    <td>
                      <strong>{{ userStats.shares }}</strong>
                    </td>
                  </tr>
                  <tr>
                    <td>Videos Watched:</td>
                    <td>
                      <strong>{{ userStats.views }}</strong>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      <div class="col-lg-8">
        <div class="card shadow-sm">
          <div class="card-header">
            <h5 class="mb-0">Profile Information</h5>
          </div>
          <div class="card-body">
            <form @submit.prevent="updateProfile">
              <div class="row">
                <div class="col-md-6 mb-3">
                  <label for="username" class="form-label">Username</label>
                  <input
                    type="text"
                    class="form-control"
                    id="username"
                    v-model="user.id"
                    disabled
                  />
                </div>
                <div class="col-md-6 mb-3">
                  <label for="email" class="form-label">Email</label>
                  <input
                    type="email"
                    class="form-control"
                    id="email"
                    v-model="user.email"
                  />
                </div>
              </div>
              <div class="mb-3">
                <label for="fullname" class="form-label">Full Name</label>
                <input
                  type="text"
                  class="form-control"
                  id="fullname"
                  v-model="user.fullname"
                />
              </div>
              <div class="mb-3">
                <label for="bio" class="form-label">Bio</label>
                <textarea
                  class="form-control"
                  id="bio"
                  rows="3"
                  v-model="user.bio"
                  placeholder="Tell us about yourself..."
                ></textarea>
              </div>
              <button type="submit" class="btn btn-primary">
                <i class="fas fa-save me-1"></i>Update Profile
              </button>
            </form>
          </div>
        </div>

        <div class="card shadow-sm mt-4">
          <div class="card-header">
            <h5 class="mb-0">Change Password</h5>
          </div>
          <div class="card-body">
            <form @submit.prevent="changePassword">
              <div class="mb-3">
                <label for="currentPassword" class="form-label"
                  >Current Password</label
                >
                <input
                  type="password"
                  class="form-control"
                  id="currentPassword"
                  v-model="passwordForm.current"
                />
              </div>
              <div class="mb-3">
                <label for="newPassword" class="form-label">New Password</label>
                <input
                  type="password"
                  class="form-control"
                  id="newPassword"
                  v-model="passwordForm.new"
                />
              </div>
              <div class="mb-3">
                <label for="confirmPassword" class="form-label"
                  >Confirm New Password</label
                >
                <input
                  type="password"
                  class="form-control"
                  id="confirmPassword"
                  v-model="passwordForm.confirm"
                />
              </div>
              <button type="submit" class="btn btn-warning">
                <i class="fas fa-key me-1"></i>Change Password
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, inject, onMounted } from "vue";
import { userService } from "../services/api";

export default {
  name: "Profile",
  setup() {
    const { showNotification } = inject("notification");
    const currentUser = inject("currentUser");

    const user = ref({
      id: "", // Changed from username to id
      fullname: "",
      email: "",
      bio: "",
      admin: false, // Changed from isAdmin to admin
    });

    const userStats = ref({
      favorites: 0,
      shares: 0,
      views: 0,
    });

    const passwordForm = ref({
      current: "",
      new: "",
      confirm: "",
    });

    onMounted(() => {
      if (currentUser.value) {
        // When currentUser is set from localStorage, it's already the unwrapped user object
        // So, we can assign it directly.
        user.value = { ...currentUser.value };
        loadUserStats();
      }
    });

    const loadUserStats = () => {
      // Mock stats - in real app, fetch from API
      userStats.value = {
        favorites: Math.floor(Math.random() * 50),
        shares: Math.floor(Math.random() * 20),
        views: Math.floor(Math.random() * 100),
      };
    };

    const updateProfile = async () => {
      try {
        // Gửi toàn bộ đối tượng user.value, bao gồm cả id
        const response = await userService.updateProfile(user.value);

        // Update current user in local storage and reactive state
        // Access response.data because api.js interceptor returns the full ApiResponse object
        // and the actual user data is in response.data
        Object.assign(currentUser.value, response.data);
        localStorage.setItem("currentUser", JSON.stringify(currentUser.value));

        showNotification(
          "success",
          "Profile Updated",
          "Your profile has been updated successfully"
        );
      } catch (error) {
        console.error("Update profile error:", error);
        showNotification(
          "danger",
          "Error",
          error.message || "Failed to update profile"
        );
      }
    };

    const changePassword = async () => {
      if (passwordForm.value.new !== passwordForm.value.confirm) {
        showNotification("danger", "Lỗi", "Mật khẩu mới không khớp");
        return;
      }

      if (passwordForm.value.new.length < 6) {
        showNotification("danger", "Lỗi", "Mật khẩu phải có ít nhất 6 ký tự");
        return;
      }

      try {
        await userService.changePassword({
          currentPassword: passwordForm.value.current,
          newPassword: passwordForm.value.new,
        });

        showNotification(
          "success",
          "Password Changed",
          "Your password has been changed successfully"
        );
        passwordForm.value = { current: "", new: "", confirm: "" };
      } catch (error) {
        console.error("Change password error:", error);
        showNotification(
          "danger",
          "Lỗi",
          error.message || "Failed to change password"
        );
      }
    };

    return {
      user,
      userStats,
      passwordForm,
      updateProfile,
      changePassword,
    };
  },
};
</script>
