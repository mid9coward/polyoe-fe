<template>
  <div class="home">
    <!-- Hero Section -->
    <div class="hero-section bg-primary text-white py-5 mb-5">
      <div class="container">
        <div class="row align-items-center">
          <div class="col-lg-8">
            <h1 class="display-4 fw-bold mb-3">Online Entertainment</h1>
            <p class="lead mb-4">
              Khám phá những tiểu phẩm hài hước và giải trí tuyệt vời nhất. Xem,
              thích và chia sẻ với bạn bè ngay hôm nay!
            </p>
          </div>
          <div class="col-lg-4 text-center">
            <i class="fas fa-video fa-8x opacity-75"></i>
          </div>
        </div>
      </div>
    </div>

    <!-- Videos Section -->
    <div class="container">
      <div class="d-flex justify-content-between align-items-center mb-4">
        <h2 class="fw-bold">
          <i class="fas fa-fire text-danger me-2"></i>
          Tiểu Phẩm Nổi Bật
        </h2>
        <div class="text-muted">Sắp xếp theo lượt xem giảm dần</div>
      </div>

      <!-- Loading -->
      <div v-if="loading" class="text-center py-5">
        <div class="spinner-border text-primary" role="status">
          <span class="visually-hidden">Đang tải...</span>
        </div>
      </div>

      <!-- Videos Grid (6 videos per page) -->
      <div v-else-if="videos.length > 0" class="row">
        <div
          v-for="video in videos"
          :key="video.id"
          class="col-lg-4 col-md-6 mb-4"
        >
          <div class="card h-100 shadow-sm video-card">
            <div class="position-relative">
              <img
                :src="
                  video.poster ||
                  '/placeholder.svg?height=250&width=400&text=Video+Poster'
                "
                class="card-img-top video-poster"
                :alt="video.title"
                @click="viewVideo(video)"
                style="cursor: pointer; height: 200px; object-fit: cover"
              />
              <div class="position-absolute top-0 end-0 m-2">
                <span class="badge bg-dark bg-opacity-75">
                  <i class="fas fa-eye me-1"></i>{{ formatViews(video.views) }}
                </span>
              </div>
            </div>

            <div class="card-body d-flex flex-column">
              <h5 class="card-title fw-bold mb-2">{{ video.title }}</h5>

              <div
                class="d-flex justify-content-between align-items-center mt-auto"
              >
                <div class="btn-group" role="group">
                  <button
                    class="btn btn-outline-danger btn-sm"
                    :class="{ 'btn-danger text-white': isVideoLiked(video.id) }"
                    @click="toggleLike(video)"
                  >
                    <i class="fas fa-heart me-1"></i>
                    {{ isVideoLiked(video.id) ? "Liked" : "Like" }}
                  </button>
                  <button
                    class="btn btn-outline-info btn-sm"
                    @click="shareVideo(video)"
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
        <i class="fas fa-video fa-5x text-muted mb-3"></i>
        <h3 class="text-muted">Chưa có video nào</h3>
        <p class="text-muted">Hãy quay lại sau để xem nội dung mới!</p>
      </div>

      <!-- Pagination Controls -->
      <nav v-if="totalPages > 1" class="mt-5">
        <div class="d-flex justify-content-center align-items-center">
          <div class="btn-group" role="group">
            <!-- First Page -->
            <button
              class="btn btn-outline-primary"
              @click="goToPage(1)"
              :disabled="currentPage === 1"
              title="Trang đầu"
            >
              <i class="fas fa-angle-double-left"></i>
            </button>

            <!-- Previous Page -->
            <button
              class="btn btn-outline-primary"
              @click="goToPage(currentPage - 1)"
              :disabled="currentPage === 1"
              title="Trang trước"
            >
              <i class="fas fa-angle-left"></i>
            </button>

            <!-- Current Page Info -->
            <span class="btn btn-primary disabled">
              {{ currentPage }} / {{ totalPages }}
            </span>

            <!-- Next Page -->
            <button
              class="btn btn-outline-primary"
              @click="goToPage(currentPage + 1)"
              :disabled="currentPage === totalPages"
              title="Trang sau"
            >
              <i class="fas fa-angle-right"></i>
            </button>

            <!-- Last Page -->
            <button
              class="btn btn-outline-primary"
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
import { ref, computed, onMounted, inject } from "vue";
import { useRouter } from "vue-router";
import { videoService, favoriteService, shareService } from "../services/api";

export default {
  name: "Home",
  setup() {
    const { showNotification } = inject("notification");
    const currentUser = inject("currentUser");
    const router = useRouter();

    // State
    const videos = ref([]);
    const favorites = ref([]);
    const loading = ref(false);
    const currentPage = ref(1);
    const totalPages = ref(1);
    const videosPerPage = 6; // Theo yêu cầu: hiển thị 6 video
    const selectedVideo = ref(null);

    // Forms
    const shareForm = ref({
      emails: "",
    });

    // Computed
    const isVideoLiked = (videoId) => {
      if (!currentUser.value) return false;
      return favorites.value.some(
        (fav) => fav.videoId === videoId && fav.userId === currentUser.value.id
      );
    };

    // Methods
    const loadVideos = async () => {
      loading.value = true;
      try {
        // Thay đổi: Gọi API mới để chỉ lấy các video đang hoạt động và đã được phân trang
        const response = await videoService.getTopActiveVideos(
          currentPage.value - 1,
          videosPerPage
        );
        videos.value = response.data || [];

        // Cập nhật tổng số trang (nếu API trả về tổng số lượng hoặc tổng số trang)
        // Hiện tại, chúng ta sẽ tính toán dựa trên tổng số video đang hoạt động
        // Để chính xác hơn, backend nên trả về tổng số lượng video đang hoạt động
        const allActiveVideosResponse = await videoService.getTopActiveVideos(
          0,
          9999
        ); // Lấy tất cả để tính tổng số trang
        totalPages.value = Math.ceil(
          (allActiveVideosResponse.data || []).length / videosPerPage
        );
      } catch (error) {
        showNotification("danger", "Lỗi", "Không thể tải danh sách video");
      } finally {
        loading.value = false;
      }
    };

    const loadFavorites = async () => {
      if (!currentUser.value) return;
      try {
        const response = await favoriteService.getAll();
        favorites.value = (response.data || []).filter(
          (fav) => fav.userId === currentUser.value.id
        );
      } catch (error) {
        console.error("Failed to load favorites:", error);
      }
    };

    const formatViews = (views) => {
      if (!views) return "0";
      if (views >= 1000000) return Math.floor(views / 1000000) + "M";
      if (views >= 1000) return Math.floor(views / 1000) + "K";
      return views.toString();
    };

    const goToPage = (page) => {
      if (page >= 1 && page <= totalPages.value && page !== currentPage.value) {
        currentPage.value = page;
        loadVideos();
        // Scroll to top
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    };

    const viewVideo = (video) => {
      // Ghi nhận lượt xem vào cookie (theo yêu cầu)
      const viewedVideos = JSON.parse(
        localStorage.getItem("viewedVideos") || "[]"
      );
      if (!viewedVideos.find((v) => v.id === video.id)) {
        viewedVideos.unshift(video); // Thêm vào đầu danh sách
        // Giới hạn 20 video gần nhất
        if (viewedVideos.length > 20) {
          viewedVideos.pop();
        }
        localStorage.setItem("viewedVideos", JSON.stringify(viewedVideos));
      }

      // Tăng lượt xem
      incrementViews(video.id);

      // Chuyển đến trang chi tiết
      router.push(`/video/${video.id}`);
    };

    const incrementViews = async (videoId) => {
      try {
        // Gọi API để tăng lượt xem
        await videoService.incrementViews(videoId);
      } catch (error) {
        console.error("Failed to increment views:", error);
      }
    };

    const toggleLike = async (video) => {
      if (!currentUser.value) {
        showNotification(
          "warning",
          "Yêu cầu đăng nhập",
          "Vui lòng đăng nhập để thích video"
        );
        return;
      }

      try {
        const existingFavorite = favorites.value.find(
          (fav) => fav.videoId === video.id
        );

        if (existingFavorite) {
          // Unlike
          await favoriteService.delete(existingFavorite.id);
          favorites.value = favorites.value.filter(
            (fav) => fav.id !== existingFavorite.id
          );
          showNotification(
            "info",
            "Đã bỏ thích",
            "Video đã được bỏ khỏi danh sách yêu thích"
          );
        } else {
          // Like
          const newFavorite = {
            userId: currentUser.value.id,
            videoId: video.id,
            likeDate: new Date().toISOString().split("T")[0],
          };
          const response = await favoriteService.create(newFavorite);
          favorites.value.push(response.data); // response.data là ApiResponse, response.data.data là Favorite
          showNotification(
            "success",
            "Đã thích",
            "Video đã được thêm vào danh sách yêu thích"
          );
        }
      } catch (error) {
        showNotification(
          "danger",
          "Lỗi",
          "Không thể cập nhật trạng thái yêu thích"
        );
      }
    };

    const shareVideo = (video) => {
      if (!currentUser.value) {
        showNotification(
          "warning",
          "Yêu cầu đăng nhập",
          "Vui lòng đăng nhập để chia sẻ video"
        );
        return;
      }

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
        // Xử lý nhiều email (cách nhau bằng dấu phẩy hoặc chấm phẩy)
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
      loadVideos();
      loadFavorites();
    });

    return {
      videos,
      loading,
      currentPage,
      totalPages,
      selectedVideo,
      shareForm,
      formatViews,
      goToPage,
      viewVideo,
      isVideoLiked,
      toggleLike,
      shareVideo,
      submitShare,
      showShareModal,
      hideShareModal,
    };
  },
};
</script>

<style scoped>
.hero-section {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

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

@media (max-width: 768px) {
  .hero-section h1 {
    font-size: 2rem;
  }

  .fa-8x {
    font-size: 4rem;
  }
}
</style>
