<template>
  <div class="container py-5">
    <div class="row">
      <div class="col-lg-4">
        <div class="card shadow-sm">
          <div class="card-body text-center">
            <!-- Avatar Display -->
            <img
              :src="
                user.avatarUrl
                  ? `https://poly-backend.onrender.com${user.avatarUrl}`
                  : '/default-avatar.png'
              "
              alt="User Avatar"
              class="rounded-circle mb-3"
              style="
                width: 128px;
                height: 128px;
                object-fit: cover;
                border: 3px solid #007bff;
              "
            />
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

            <!-- Avatar Upload -->
            <div class="mt-3">
              <label for="avatarUpload" class="btn btn-outline-primary btn-sm">
                <i class="fas fa-upload me-1"></i>Tải ảnh đại diện
              </label>
              <input
                type="file"
                id="avatarUpload"
                ref="avatarInput"
                @change="handleAvatarUpload"
                accept="image/*"
                class="d-none"
              />
              <div
                v-if="uploadingAvatar"
                class="spinner-border spinner-border-sm text-primary ms-2"
                role="status"
              >
                <span class="visually-hidden">Đang tải...</span>
              </div>
            </div>
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
      id: "",
      fullname: "",
      email: "",
      bio: "",
      admin: false,
      avatarUrl: "", // Thêm trường này
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

    const uploadingAvatar = ref(false); // Trạng thái tải lên avatar

    onMounted(() => {
      if (currentUser.value) {
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
        const response = await userService.updateProfile(user.value);

        // Cập nhật currentUser trong localStorage và trạng thái reactive
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
          userId: currentUser.value.id,
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

    const handleAvatarUpload = async (event) => {
      const file = event.target.files[0];
      if (!file) {
        return;
      }

      if (!file.type.startsWith("image/")) {
        showNotification("danger", "Lỗi", "Vui lòng chọn một file ảnh hợp lệ.");
        return;
      }

      if (file.size > 2 * 1024 * 1024) {
        // Giới hạn 2MB
        showNotification(
          "danger",
          "Lỗi",
          "Kích thước ảnh không được vượt quá 2MB."
        );
        return;
      }

      uploadingAvatar.value = true;
      try {
        const response = await userService.uploadAvatar(
          currentUser.value.id,
          file
        );

        // Cập nhật avatarUrl trong user và currentUser
        user.value.avatarUrl = response.data.avatarUrl;
        Object.assign(currentUser.value, response.data);
        localStorage.setItem("currentUser", JSON.stringify(currentUser.value));

        console.log("Updated user.avatarUrl:", user.value.avatarUrl);
        console.log(
          "Updated currentUser.avatarUrl:",
          currentUser.value.avatarUrl
        );

        showNotification(
          "success",
          "Thành công",
          "Ảnh đại diện đã được cập nhật."
        );
      } catch (error) {
        console.error("Upload avatar error:", error);
        showNotification(
          "danger",
          "Lỗi",
          error.message || "Không thể tải ảnh đại diện."
        );
      } finally {
        uploadingAvatar.value = false;
        // Reset input file để có thể chọn lại cùng một file nếu muốn
        event.target.value = "";
      }
    };

    return {
      user,
      userStats,
      passwordForm,
      uploadingAvatar,
      updateProfile,
      changePassword,
      handleAvatarUpload,
    };
  },
};
</script>
