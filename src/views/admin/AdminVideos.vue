<template>
  <div class="admin-videos">
    <div class="container py-4">
      <div class="d-flex justify-content-between align-items-center mb-4">
        <h2>
          <i class="fas fa-video me-2"></i>
          Quản Lý Video
        </h2>
        <div class="btn-group" role="group">
          <button class="btn btn-outline-secondary" @click="resetForm">
            <i class="fas fa-refresh me-1"></i>Reset
          </button>
        </div>
      </div>

      <div class="row">
        <!-- Form Section -->
        <div class="col-lg-4">
          <div class="card shadow-sm">
            <div class="card-header">
              <h5 class="mb-0">
                {{ isEditing ? "Cập Nhật Video" : "Thêm Video Mới" }}
              </h5>
            </div>
            <div class="card-body">
              <form @submit.prevent="saveVideo">
                <div class="mb-3">
                  <label for="videoId" class="form-label">Video ID</label>
                  <input
                    type="text"
                    class="form-control"
                    id="videoId"
                    v-model="currentVideo.id"
                    :disabled="isEditing"
                    required
                  />
                </div>

                <div class="mb-3">
                  <label for="title" class="form-label">Tiêu đề</label>
                  <input
                    type="text"
                    class="form-control"
                    id="title"
                    v-model="currentVideo.title"
                    required
                  />
                </div>

                <div class="mb-3">
                  <label for="poster" class="form-label">Poster URL</label>
                  <input
                    type="url"
                    class="form-control"
                    id="poster"
                    v-model="currentVideo.poster"
                  />
                </div>

                <div class="mb-3">
                  <label for="href" class="form-label">YouTube URL</label>
                  <input
                    type="url"
                    class="form-control"
                    id="href"
                    v-model="currentVideo.href"
                    placeholder="https://www.youtube.com/watch?v=..."
                  />
                </div>

                <div class="mb-3">
                  <label for="description" class="form-label">Mô tả</label>
                  <textarea
                    class="form-control"
                    id="description"
                    rows="3"
                    v-model="currentVideo.description"
                  ></textarea>
                </div>

                <div class="mb-3">
                  <label for="views" class="form-label">Lượt xem</label>
                  <input
                    type="number"
                    class="form-control"
                    id="views"
                    v-model="currentVideo.views"
                    min="0"
                  />
                </div>

                <div class="mb-3 form-check">
                  <input
                    type="checkbox"
                    class="form-check-input"
                    id="active"
                    v-model="currentVideo.active"
                  />
                  <label class="form-check-label" for="active">
                    Kích hoạt
                  </label>
                </div>

                <div class="d-grid gap-2">
                  <button
                    v-if="!isEditing"
                    type="submit"
                    class="btn btn-success"
                    :disabled="loading"
                  >
                    <i class="fas fa-plus me-1"></i>Tạo Mới
                  </button>

                  <button
                    v-if="isEditing"
                    type="submit"
                    class="btn btn-primary"
                    :disabled="loading"
                  >
                    <i class="fas fa-save me-1"></i>Cập Nhật
                  </button>

                  <button
                    v-if="isEditing"
                    type="button"
                    class="btn btn-danger"
                    @click="deleteVideo"
                    :disabled="loading"
                  >
                    <i class="fas fa-trash me-1"></i>Xóa
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>

        <!-- Videos List Section -->
        <div class="col-lg-8">
          <div class="card shadow-sm">
            <div class="card-header">
              <h5 class="mb-0">Danh Sách Video</h5>
            </div>
            <div class="card-body">
              <!-- Loading -->
              <div v-if="loading" class="text-center py-4">
                <div class="spinner-border text-primary" role="status">
                  <span class="visually-hidden">Đang tải...</span>
                </div>
              </div>

              <!-- Videos Table -->
              <div v-else class="table-responsive">
                <table class="table table-hover">
                  <thead>
                    <tr>
                      <th>Poster</th>
                      <th>Tiêu đề</th>
                      <th>Lượt xem</th>
                      <th>Trạng thái</th>
                      <th>Thao tác</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="video in paginatedVideos" :key="video.id">
                      <td>
                        <img
                          :src="
                            video.poster ||
                            '/placeholder.svg?height=60&width=80'
                          "
                          class="img-thumbnail"
                          style="width: 80px; height: 60px; object-fit: cover"
                          :alt="video.title"
                        />
                      </td>
                      <td>
                        <strong>{{ video.title }}</strong>
                        <br />
                        <small class="text-muted">ID: {{ video.id }}</small>
                      </td>
                      <td>
                        <span class="badge bg-info">{{
                          formatViews(video.views)
                        }}</span>
                      </td>
                      <td>
                        <span
                          class="badge"
                          :class="video.active ? 'bg-success' : 'bg-secondary'"
                        >
                          {{ video.active ? "Hoạt động" : "Tạm dừng" }}
                        </span>
                      </td>
                      <td>
                        <button
                          class="btn btn-sm btn-outline-primary"
                          @click="editVideo(video)"
                        >
                          <i class="fas fa-edit"></i>
                        </button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <!-- Pagination -->
              <nav v-if="totalPages > 1" class="mt-4">
                <div class="d-flex justify-content-center">
                  <div class="btn-group" role="group">
                    <button
                      class="btn btn-outline-primary btn-sm"
                      @click="goToPage(1)"
                      :disabled="currentPage === 1"
                      title="Trang đầu"
                    >
                      <i class="fas fa-angle-double-left"></i>
                    </button>
                    <button
                      class="btn btn-outline-primary btn-sm"
                      @click="goToPage(currentPage - 1)"
                      :disabled="currentPage === 1"
                      title="Trang trước"
                    >
                      <i class="fas fa-angle-left"></i>
                    </button>
                    <span class="btn btn-primary btn-sm disabled">
                      {{ currentPage }} / {{ totalPages }}
                    </span>
                    <button
                      class="btn btn-outline-primary btn-sm"
                      @click="goToPage(currentPage + 1)"
                      :disabled="currentPage === totalPages"
                      title="Trang sau"
                    >
                      <i class="fas fa-angle-right"></i>
                    </button>
                    <button
                      class="btn btn-outline-primary btn-sm"
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
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted, inject } from "vue";
import { videoService } from "../../services/api";

export default {
  name: "AdminVideos",
  setup() {
    const { showNotification } = inject("notification");

    const videos = ref([]);
    const loading = ref(false);
    const isEditing = ref(false);
    const currentPage = ref(1);
    const videosPerPage = 10;

    const currentVideo = ref({
      id: "",
      title: "",
      poster: "",
      href: "",
      description: "",
      views: 0,
      active: true,
    });

    // Computed
    const totalPages = computed(() =>
      Math.ceil(videos.value.length / videosPerPage)
    );

    const paginatedVideos = computed(() => {
      const start = (currentPage.value - 1) * videosPerPage;
      const end = start + videosPerPage;
      return videos.value.slice(start, end);
    });

    // Methods
    const loadVideos = async () => {
      loading.value = true;
      try {
        const response = await videoService.getAll();
        videos.value = response.data || [];
      } catch (error) {
        showNotification("danger", "Lỗi", "Không thể tải danh sách video");
      } finally {
        loading.value = false;
      }
    };

    const resetForm = () => {
      isEditing.value = false;
      currentVideo.value = {
        id: "",
        title: "",
        poster: "",
        href: "",
        description: "",
        views: 0,
        active: true,
      };
    };

    const editVideo = (video) => {
      isEditing.value = true;
      currentVideo.value = { ...video };
    };

    const saveVideo = async () => {
      loading.value = true;

      try {
        if (isEditing.value) {
          await videoService.update(currentVideo.value.id, currentVideo.value);
          showNotification("success", "Thành công", "Video đã được cập nhật");
        } else {
          await videoService.create(currentVideo.value);
          showNotification("success", "Thành công", "Video đã được tạo mới");
          resetForm();
        }

        loadVideos();
      } catch (error) {
        showNotification("danger", "Lỗi", "Không thể lưu video");
      } finally {
        loading.value = false;
      }
    };

    const deleteVideo = async () => {
      if (confirm("Bạn có chắc muốn xóa video này?")) {
        loading.value = true;

        try {
          await videoService.delete(currentVideo.value.id);
          showNotification("success", "Thành công", "Video đã được xóa");
          resetForm();
          loadVideos();
        } catch (error) {
          showNotification("danger", "Lỗi", "Không thể xóa video");
        } finally {
          loading.value = false;
        }
      }
    };

    const goToPage = (page) => {
      if (page >= 1 && page <= totalPages.value) {
        currentPage.value = page;
        resetForm();
      }
    };

    const formatViews = (views) => {
      if (!views) return "0";
      if (views >= 1000000) return Math.floor(views / 1000000) + "M";
      if (views >= 1000) return Math.floor(views / 1000) + "K";
      return views.toString();
    };

    onMounted(() => {
      loadVideos();
    });

    return {
      videos,
      loading,
      isEditing,
      currentPage,
      totalPages,
      currentVideo,
      paginatedVideos,
      loadVideos,
      resetForm,
      editVideo,
      saveVideo,
      deleteVideo,
      goToPage,
      formatViews,
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

.btn-group .btn {
  border-radius: 0.375rem;
  margin-right: 0.25rem;
}

.btn-group .btn:last-child {
  margin-right: 0;
}
</style>
