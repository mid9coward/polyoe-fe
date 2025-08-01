<template>
  <div class="admin-reports">
    <div class="container py-4">
      <h2 class="mb-4">
        <i class="fas fa-chart-bar me-2"></i>
        Báo Cáo - Thống Kê
      </h2>

      <!-- Favorite Stats -->
      <div class="card shadow-sm mb-4">
        <div class="card-header">
          <h5 class="mb-0">
            <i class="fas fa-heart me-2 text-danger"></i>
            Thống Kê Số Người Yêu Thích Từng Video
          </h5>
        </div>
        <div class="card-body">
          <div v-if="loadingFavoriteStats" class="text-center py-4">
            <div class="spinner-border text-primary" role="status">
              <span class="visually-hidden">Đang tải...</span>
            </div>
          </div>

          <div v-else class="table-responsive">
            <table class="table table-striped">
              <thead>
                <tr>
                  <th>Video</th>
                  <th>Tiêu đề</th>
                  <th>Số lượt thích</th>
                  <th>Tỷ lệ</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="stat in favoriteStats" :key="stat.videoId">
                  <td>
                    <img
                      :src="
                        stat.poster || '/placeholder.svg?height=50&width=70'
                      "
                      class="img-thumbnail"
                      style="width: 70px; height: 50px; object-fit: cover"
                      :alt="stat.title"
                    />
                  </td>
                  <td>
                    <strong>{{ stat.title }}</strong>
                    <br />
                    <small class="text-muted">ID: {{ stat.videoId }}</small>
                  </td>
                  <td>
                    <span class="badge bg-danger fs-6">{{
                      stat.likeCount
                    }}</span>
                  </td>
                  <td>
                    <div class="progress" style="height: 20px">
                      <div
                        class="progress-bar bg-danger"
                        role="progressbar"
                        :style="{ width: stat.percentage + '%' }"
                      >
                        {{ stat.percentage }}%
                      </div>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <!-- Favorites by Video -->
      <div class="card shadow-sm mb-4">
        <div class="card-header">
          <h5 class="mb-0">
            <i class="fas fa-filter me-2 text-info"></i>
            Lọc Người Yêu Thích Theo Video
          </h5>
        </div>
        <div class="card-body">
          <div class="row mb-3">
            <div class="col-md-6">
              <label for="videoSelect" class="form-label">Chọn video:</label>
              <select
                class="form-select"
                id="videoSelect"
                v-model="selectedVideoForFavorites"
                @change="loadFavoritesByVideo"
              >
                <option value="">-- Chọn video --</option>
                <option
                  v-for="video in videosWithFavorites"
                  :key="video.id"
                  :value="video.id"
                >
                  {{ video.title }}
                </option>
              </select>
            </div>
          </div>

          <div v-if="loadingFavoritesByVideo" class="text-center py-4">
            <div class="spinner-border text-primary" role="status">
              <span class="visually-hidden">Đang tải...</span>
            </div>
          </div>

          <div v-else-if="favoritesByVideo.length > 0" class="table-responsive">
            <table class="table table-striped">
              <thead>
                <tr>
                  <th>User ID</th>
                  <th>Họ và tên</th>
                  <th>Email</th>
                  <th>Ngày thích</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="favorite in favoritesByVideo" :key="favorite.id">
                  <td>
                    <strong>{{ favorite.userId }}</strong>
                  </td>
                  <td>{{ favorite.user?.fullname || "N/A" }}</td>
                  <td>{{ favorite.user?.email || "N/A" }}</td>
                  <td>{{ formatDate(favorite.likeDate) }}</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div
            v-else-if="selectedVideoForFavorites"
            class="text-center py-4 text-muted"
          >
            <i class="fas fa-heart-broken fa-3x mb-3"></i>
            <p>Video này chưa có lượt thích nào</p>
          </div>
        </div>
      </div>

      <!-- Shares by Video -->
      <div class="card shadow-sm mb-4">
        <div class="card-header">
          <h5 class="mb-0">
            <i class="fas fa-share me-2 text-success"></i>
            Lọc Người Gửi & Người Nhận Theo Video Được Chia Sẻ
          </h5>
        </div>
        <div class="card-body">
          <div class="row mb-3">
            <div class="col-md-6">
              <label for="videoShareSelect" class="form-label"
                >Chọn video:</label
              >
              <select
                class="form-select"
                id="videoShareSelect"
                v-model="selectedVideoForShares"
                @change="loadSharesByVideo"
              >
                <option value="">-- Chọn video --</option>
                <option
                  v-for="video in videosWithShares"
                  :key="video.id"
                  :value="video.id"
                >
                  {{ video.title }}
                </option>
              </select>
            </div>
          </div>

          <div v-if="loadingSharesByVideo" class="text-center py-4">
            <div class="spinner-border text-primary" role="status">
              <span class="visually-hidden">Đang tải...</span>
            </div>
          </div>

          <div v-else-if="sharesByVideo.length > 0" class="table-responsive">
            <table class="table table-striped">
              <thead>
                <tr>
                  <th>Người gửi</th>
                  <th>Họ và tên</th>
                  <th>Email người nhận</th>
                  <th>Ngày chia sẻ</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="share in sharesByVideo" :key="share.id">
                  <td>
                    <strong>{{ share.userId }}</strong>
                  </td>
                  <td>{{ share.user?.fullname || "N/A" }}</td>
                  <td>
                    <span class="badge bg-info">{{ share.emails }}</span>
                  </td>
                  <td>{{ formatDate(share.shareDate) }}</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div
            v-else-if="selectedVideoForShares"
            class="text-center py-4 text-muted"
          >
            <i class="fas fa-share-alt fa-3x mb-3"></i>
            <p>Video này chưa được chia sẻ</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, inject } from "vue";
import { reportService, videoService } from "../../services/api";

export default {
  name: "AdminReports",
  setup() {
    const { showNotification } = inject("notification");

    // State
    const favoriteStats = ref([]);
    const favoritesByVideo = ref([]);
    const sharesByVideo = ref([]);
    const videosWithFavorites = ref([]);
    const videosWithShares = ref([]);

    const loadingFavoriteStats = ref(false);
    const loadingFavoritesByVideo = ref(false);
    const loadingSharesByVideo = ref(false);

    const selectedVideoForFavorites = ref("");
    const selectedVideoForShares = ref("");

    // Methods
    const loadFavoriteStats = async () => {
      loadingFavoriteStats.value = true;
      try {
        const response = await reportService.getFavoriteStats();
        favoriteStats.value = response.data || [];

        // Calculate percentages
        const maxLikes = Math.max(
          ...favoriteStats.value.map((stat) => stat.likeCount)
        );
        favoriteStats.value.forEach((stat) => {
          stat.percentage =
            maxLikes > 0 ? Math.round((stat.likeCount / maxLikes) * 100) : 0;
        });
      } catch (error) {
        showNotification("danger", "Lỗi", "Không thể tải thống kê yêu thích");
      } finally {
        loadingFavoriteStats.value = false;
      }
    };

    const loadVideosWithFavorites = async () => {
      try {
        const response = await videoService.getAll();
        const allVideos = response.data || [];

        // Filter videos that have favorites
        const videosWithFavs = [];
        for (const video of allVideos) {
          try {
            const favResponse = await reportService.getFavoritesByVideo(
              video.id
            );
            if (favResponse.data && favResponse.data.length > 0) {
              videosWithFavs.push(video);
            }
          } catch (error) {
            // Video has no favorites, skip
          }
        }

        videosWithFavorites.value = videosWithFavs;
      } catch (error) {
        console.error("Failed to load videos with favorites:", error);
      }
    };

    const loadVideosWithShares = async () => {
      try {
        const response = await videoService.getAll();
        const allVideos = response.data || [];

        // Filter videos that have shares
        const videosWithShrs = [];
        for (const video of allVideos) {
          try {
            const shareResponse = await reportService.getSharesByVideo(
              video.id
            );
            if (shareResponse.data && shareResponse.data.length > 0) {
              videosWithShrs.push(video);
            }
          } catch (error) {
            // Video has no shares, skip
          }
        }

        videosWithShares.value = videosWithShrs;
      } catch (error) {
        console.error("Failed to load videos with shares:", error);
      }
    };

    const loadFavoritesByVideo = async () => {
      if (!selectedVideoForFavorites.value) {
        favoritesByVideo.value = [];
        return;
      }

      loadingFavoritesByVideo.value = true;
      try {
        const response = await reportService.getFavoritesByVideo(
          selectedVideoForFavorites.value
        );
        favoritesByVideo.value = response.data || [];
      } catch (error) {
        showNotification(
          "danger",
          "Lỗi",
          "Không thể tải danh sách người yêu thích"
        );
        favoritesByVideo.value = [];
      } finally {
        loadingFavoritesByVideo.value = false;
      }
    };

    const loadSharesByVideo = async () => {
      if (!selectedVideoForShares.value) {
        sharesByVideo.value = [];
        return;
      }

      loadingSharesByVideo.value = true;
      try {
        const response = await reportService.getSharesByVideo(
          selectedVideoForShares.value
        );
        sharesByVideo.value = response.data || [];
      } catch (error) {
        showNotification("danger", "Lỗi", "Không thể tải danh sách chia sẻ");
        sharesByVideo.value = [];
      } finally {
        loadingSharesByVideo.value = false;
      }
    };

    const formatDate = (dateString) => {
      if (!dateString) return "N/A";
      return new Date(dateString).toLocaleDateString("vi-VN");
    };

    onMounted(async () => {
      await Promise.all([
        loadFavoriteStats(),
        loadVideosWithFavorites(),
        loadVideosWithShares(),
      ]);
    });

    return {
      favoriteStats,
      favoritesByVideo,
      sharesByVideo,
      videosWithFavorites,
      videosWithShares,
      loadingFavoriteStats,
      loadingFavoritesByVideo,
      loadingSharesByVideo,
      selectedVideoForFavorites,
      selectedVideoForShares,
      loadFavoritesByVideo,
      loadSharesByVideo,
      formatDate,
    };
  },
};
</script>

<style scoped>
.img-thumbnail {
  border: 1px solid #dee2e6;
}

.table th {
  background-color: #f8f9fa;
  font-weight: 600;
}

.progress {
  background-color: #e9ecef;
}

.card-header {
  background-color: #f8f9fa;
  border-bottom: 1px solid #dee2e6;
}
</style>
