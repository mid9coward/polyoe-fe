<template>
  <div class="my-favorites">
    <div class="container py-4">
      <div class="d-flex justify-content-between align-items-center mb-4">
        <h2>
          <i class="fas fa-heart text-danger me-2"></i>
          Video Yêu Thích Của Tôi
        </h2>
        <span class="badge bg-primary fs-6">{{ favorites.length }} video</span>
      </div>

      <!-- Loading -->
      <div v-if="loading" class="text-center py-5">
        <div class="spinner-border text-primary" role="status">
          <span class="visually-hidden">Đang tải...</span>
        </div>
      </div>

      <!-- Favorites Grid -->
      <div v-else-if="favorites.length > 0" class="row">
        <div
          v-for="favorite in favorites"
          :key="favorite.id"
          class="col-lg-4 col-md-6 mb-4"
        >
          <div class="card h-100 shadow-sm video-card">
            <div class="position-relative">
              <img
                :src="
                  favorite.video?.poster ||
                  '/placeholder.svg?height=200&width=300'
                "
                class="card-img-top video-poster"
                style="height: 200px; object-fit: cover; cursor: pointer"
                :alt="favorite.video?.title"
                @click="viewVideo(favorite.video)"
              />
              <div class="position-absolute top-0 end-0 m-2">
                <span class="badge bg-dark bg-opacity-75">
                  <i class="fas fa-eye me-1"></i
                  >{{ formatViews(favorite.video?.views) }}
                </span>
              </div>
            </div>

            <div class="card-body d-flex flex-column">
              <h5 class="card-title fw-bold mb-2">
                {{ favorite.video?.title }}
              </h5>
              <p class="card-text flex-grow-1 text-muted">
                {{ truncateDescription(favorite.video?.description) }}
              </p>

              <div
                class="d-flex justify-content-between align-items-center mt-auto"
              >
                <small class="text-muted">
                  <i class="fas fa-heart me-1"></i>
                  Đã thích {{ formatDate(favorite.likeDate) }}
                </small>
                <div class="btn-group" role="group">
                  <button
                    class="btn btn-outline-danger btn-sm"
                    @click="removeFavorite(favorite)"
                    title="Bỏ thích"
                  >
                    <i class="fas fa-heart-broken me-1"></i>Unlike
                  </button>
                  <button
                    class="btn btn-outline-info btn-sm"
                    @click="shareVideo(favorite.video)"
                    title="Chia sẻ"
                  >
                    <i class="fas fa-share me-1"></i>Share
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Empty State -->
      <div v-else class="text-center py-5">
        <i class="fas fa-heart-broken fa-5x text-muted mb-3"></i>
        <h3 class="text-muted">Chưa có video yêu thích</h3>
        <p class="text-muted">
          Hãy khám phá và thích những video bạn yêu thích!
        </p>
        <router-link to="/" class="btn btn-primary">
          <i class="fas fa-home me-1"></i>Về Trang Chủ
        </router-link>
      </div>
    </div>

    <!-- Share Modal -->
    <div class="modal fade" id="shareModal" tabindex="-1">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Chia sẻ tiểu phẩm</h5>
            <button
              type="button"
              class="btn-close"
              @click="hideShareModal"
            ></button>
          </div>
          <div class="modal-body">
            <div v-if="selectedVideo" class="mb-3">
              <h6>{{ selectedVideo.title }}</h6>
              <p class="text-muted small">{{ selectedVideo.description }}</p>
            </div>
            <form @submit.prevent="submitShare">
              <div class="mb-3">
                <label for="shareEmails" class="form-label"
                  >Email người nhận</label
                >
                <textarea
                  class="form-control"
                  id="shareEmails"
                  rows="3"
                  v-model="shareForm.emails"
                  placeholder="Nhập các email, cách nhau bằng dấu phẩy hoặc chấm phẩy&#10;Ví dụ: friend1@email.com, friend2@email.com"
                  required
                ></textarea>
                <div class="form-text">
                  Các email cách nhau bằng dấu phẩy (,) hoặc chấm phẩy (;)
                </div>
              </div>
            </form>
          </div>
          <div class="modal-footer">
            <button
              type="button"
              class="btn btn-secondary"
              @click="hideShareModal"
            >
              Hủy
            </button>
            <button type="button" class="btn btn-info" @click="submitShare">
              <i class="fas fa-paper-plane me-1"></i>Gửi
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, inject } from "vue";
import { useRouter } from "vue-router";
import { favoriteService, videoService, shareService } from "../services/api";

export default {
  name: "MyFavorites",
  setup() {
    const router = useRouter();
    const { showNotification } = inject("notification");
    const currentUser = inject("currentUser");

    const favorites = ref([]);
    const loading = ref(false);
    const selectedVideo = ref(null);

    const shareForm = ref({
      emails: "",
    });

    const loadFavorites = async () => {
      if (!currentUser.value) {
        router.push("/login");
        return;
      }

      loading.value = true;
      try {
        const response = await favoriteService.getAll();
        const userFavorites = (response.data || []).filter(
          (fav) => fav.userId === currentUser.value.id
        );

        // Load video details for each favorite
        for (let favorite of userFavorites) {
          try {
            const videoResponse = await videoService.getById(favorite.videoId);
            favorite.video = videoResponse.data;
          } catch (error) {
            console.error("Failed to load video details:", error);
          }
        }

        favorites.value = userFavorites;
      } catch (error) {
        showNotification("danger", "Lỗi", "Không thể tải danh sách yêu thích");
      } finally {
        loading.value = false;
      }
    };

    const removeFavorite = async (favorite) => {
      if (confirm("Bạn có chắc muốn bỏ thích video này?")) {
        try {
          await favoriteService.delete(favorite.id);
          favorites.value = favorites.value.filter((f) => f.id !== favorite.id);
          showNotification(
            "success",
            "Đã bỏ thích",
            "Video đã được bỏ khỏi danh sách yêu thích"
          );
        } catch (error) {
          showNotification("danger", "Lỗi", "Không thể bỏ thích video");
        }
      }
    };

    const viewVideo = (video) => {
      if (video && video.id) {
        // Ghi nhận lượt xem vào cookie
        const viewedVideos = JSON.parse(
          localStorage.getItem("viewedVideos") || "[]"
        );
        if (!viewedVideos.find((v) => v.id === video.id)) {
          viewedVideos.unshift(video);
          if (viewedVideos.length > 20) {
            viewedVideos.pop();
          }
          localStorage.setItem("viewedVideos", JSON.stringify(viewedVideos));
        }

        router.push(`/video/${video.id}`);
      }
    };

    const shareVideo = (video) => {
      selectedVideo.value = video;
      shareForm.value = { emails: "" };
      showShareModal();
    };

    const submitShare = async () => {
      if (!selectedVideo.value || !shareForm.value.emails.trim()) {
        showNotification(
          "warning",
          "Thiếu thông tin",
          "Vui lòng nhập email người nhận"
        );
        return;
      }

      try {
        const emails = shareForm.value.emails
          .split(/[,;]/)
          .map((email) => email.trim())
          .filter((email) => email.length > 0);

        for (const email of emails) {
          const newShare = {
            userId: currentUser.value.id,
            videoId: selectedVideo.value.id,
            emails: email,
            shareDate: new Date().toISOString().split("T")[0],
          };
          await shareService.create(newShare);
        }

        hideShareModal();
        showNotification(
          "success",
          "Đã chia sẻ",
          `Video đã được chia sẻ đến ${emails.length} email`
        );
      } catch (error) {
        showNotification("danger", "Lỗi", "Không thể chia sẻ video");
      }
    };

    const truncateDescription = (description) => {
      if (!description) return "Chưa có mô tả";
      return description.length > 100
        ? description.substring(0, 100) + "..."
        : description;
    };

    const formatDate = (dateString) => {
      if (!dateString) return "Không rõ";
      return new Date(dateString).toLocaleDateString("vi-VN");
    };

    const formatViews = (views) => {
      if (!views) return "0";
      if (views >= 1000000) return Math.floor(views / 1000000) + "M";
      if (views >= 1000) return Math.floor(views / 1000) + "K";
      return views.toString();
    };

    const showShareModal = () => {
      const modalElement = document.getElementById("shareModal");
      modalElement.classList.add("show");
      modalElement.style.display = "block";
      document.body.classList.add("modal-open");

      const backdrop = document.createElement("div");
      backdrop.className = "modal-backdrop fade show";
      backdrop.id = "share-modal-backdrop";
      document.body.appendChild(backdrop);
    };

    const hideShareModal = () => {
      const modalElement = document.getElementById("shareModal");
      modalElement.classList.remove("show");
      modalElement.style.display = "none";
      document.body.classList.remove("modal-open");

      const backdrop = document.getElementById("share-modal-backdrop");
      if (backdrop) backdrop.remove();
    };

    onMounted(() => {
      loadFavorites();
    });

    return {
      favorites,
      loading,
      selectedVideo,
      shareForm,
      removeFavorite,
      viewVideo,
      shareVideo,
      submitShare,
      truncateDescription,
      formatDate,
      formatViews,
      showShareModal,
      hideShareModal,
    };
  },
};
</script>

<style scoped>
.video-card {
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  border: none;
}

.video-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
}

.video-poster {
  transition: opacity 0.3s ease;
}

.video-poster:hover {
  opacity: 0.9;
}

.btn-group .btn {
  border-radius: 0.375rem;
  margin-right: 0.25rem;
}

.btn-group .btn:last-child {
  margin-right: 0;
}
</style>
