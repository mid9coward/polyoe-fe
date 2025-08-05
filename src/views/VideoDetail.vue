<template>
  <div class="video-detail">
    <div class="container py-4">
      <div class="row">
        <!-- Main Video Content -->
        <div class="col-lg-8">
          <div class="card shadow-sm mb-4">
            <div class="card-body">
              <!-- Video Player -->
              <div class="video-container mb-4">
                <div v-if="video.href" class="ratio ratio-16x9">
                  <iframe
                    :src="getYouTubeEmbedUrl(video.href)"
                    title="YouTube video player"
                    frameborder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowfullscreen
                  ></iframe>
                </div>
                <div
                  v-else
                  class="ratio ratio-16x9 bg-light d-flex align-items-center justify-content-center"
                >
                  <div class="text-center text-muted">
                    <i class="fas fa-video fa-3x mb-3"></i>
                    <p>Video không khả dụng</p>
                  </div>
                </div>
              </div>

              <!-- Video Info -->
              <div class="video-info">
                <h1 class="h3 fw-bold mb-3">{{ video.title }}</h1>

                <div
                  class="d-flex justify-content-between align-items-center mb-3"
                >
                  <div class="video-stats text-muted">
                    <i class="fas fa-eye me-1"></i
                    >{{ formatViews(video.views) }} lượt xem
                  </div>

                  <div class="video-actions">
                    <div class="btn-group" role="group">
                      <button
                        class="btn btn-outline-danger"
                        :class="{ 'btn-danger text-white': isLiked }"
                        @click="toggleLike"
                      >
                        <i class="fas fa-heart me-1"></i>
                        {{ isLiked ? "Đã thích" : "Thích" }}
                      </button>
                      <button class="btn btn-outline-info" @click="shareVideo">
                        <i class="fas fa-share me-1"></i>Chia sẻ
                      </button>
                    </div>
                  </div>
                </div>

                <!-- Video Description -->
                <div class="video-description">
                  <h5>Mô tả</h5>
                  <p class="text-muted">
                    {{ video.description || "Chưa có mô tả cho video này." }}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <!-- Comments Section -->
          <div class="card shadow-sm mb-4">
            <div class="card-header">
              <h5 class="mb-0">
                <i class="fas fa-comments me-2"></i>Bình luận ({{
                  comments.length
                }})
              </h5>
            </div>
            <div class="card-body">
              <!-- Add Comment Form -->
              <div v-if="currentUser" class="mb-4">
                <form @submit.prevent="addComment">
                  <div class="mb-3">
                    <textarea
                      class="form-control"
                      rows="3"
                      v-model="newCommentContent"
                      placeholder="Viết bình luận của bạn..."
                      required
                    ></textarea>
                  </div>
                  <button
                    type="submit"
                    class="btn btn-primary"
                    :disabled="addingComment"
                  >
                    <span
                      v-if="addingComment"
                      class="spinner-border spinner-border-sm me-2"
                    ></span>
                    <i v-else class="fas fa-paper-plane me-2"></i>
                    Gửi bình luận
                  </button>
                </form>
              </div>
              <div v-else class="alert alert-info text-center" role="alert">
                Vui lòng <router-link to="/login">đăng nhập</router-link> để
                bình luận.
              </div>

              <!-- Comments List -->
              <div v-if="loadingComments" class="text-center py-4">
                <div class="spinner-border text-primary" role="status">
                  <span class="visually-hidden">Đang tải bình luận...</span>
                </div>
              </div>
              <div v-else-if="comments.length > 0" class="comments-list">
                <div
                  v-for="comment in comments"
                  :key="comment.id"
                  class="comment-item mb-3 p-3 border rounded"
                >
                  <div class="d-flex align-items-start">
                    <img
                      :src="
                        comment.user?.avatarUrl
                          ? `http://localhost:1212${comment.user.avatarUrl}`
                          : '/default-avatar.png'
                      "
                      alt="Avatar"
                      class="rounded-circle me-3"
                      style="width: 40px; height: 40px; object-fit: cover"
                    />
                    <div class="flex-grow-1">
                      <div
                        class="d-flex justify-content-between align-items-start"
                      >
                        <div>
                          <strong class="text-primary">{{
                            comment.user?.fullname || comment.userId
                          }}</strong>
                          <small class="text-muted ms-2">{{
                            formatDate(comment.commentDate)
                          }}</small>
                        </div>
                        <button
                          v-if="
                            currentUser &&
                            (currentUser.id === comment.userId ||
                              currentUser.admin)
                          "
                          class="btn btn-sm btn-outline-danger"
                          @click="deleteComment(comment.id)"
                          title="Xóa bình luận"
                        >
                          <i class="fas fa-trash"></i>
                        </button>
                      </div>
                      <p class="mt-2 mb-0">{{ comment.content }}</p>
                    </div>
                  </div>
                </div>
              </div>
              <div v-else class="text-center text-muted py-4">
                <i class="fas fa-comment-alt fa-3x mb-3"></i>
                <p>Chưa có bình luận nào cho video này.</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Sidebar - Recently Viewed Videos -->
        <div class="col-lg-4">
          <div class="card shadow-sm">
            <div class="card-header">
              <h5 class="mb-0">
                <i class="fas fa-history me-2"></i>Video đã xem
              </h5>
            </div>
            <div class="card-body">
              <div v-if="viewedVideos.length > 0" class="viewed-videos">
                <div
                  v-for="viewedVideo in viewedVideos"
                  :key="viewedVideo.id"
                  class="viewed-video-item d-flex mb-3 cursor-pointer"
                  @click="goToVideo(viewedVideo)"
                >
                  <img
                    :src="
                      viewedVideo.poster ||
                      '/placeholder.svg?height=80&width=120'
                    "
                    class="viewed-video-thumb me-3"
                    :alt="viewedVideo.title"
                  />
                  <div class="viewed-video-info flex-grow-1">
                    <h6 class="mb-1 text-truncate">{{ viewedVideo.title }}</h6>
                    <small class="text-muted">
                      <i class="fas fa-eye me-1"></i
                      >{{ formatViews(viewedVideo.views) }}
                    </small>
                  </div>
                </div>
              </div>
              <div v-else class="text-center text-muted py-4">
                <i class="fas fa-history fa-3x mb-3"></i>
                <p>Chưa có video nào được xem</p>
              </div>
            </div>
          </div>
        </div>
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
            <div class="mb-3">
              <h6>{{ video.title }}</h6>
              <p class="text-muted small">{{ video.description }}</p>
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
import { ref, computed, onMounted, inject, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import {
  videoService,
  favoriteService,
  shareService,
  commentService,
} from "../services/api";

export default {
  name: "VideoDetail",
  setup() {
    const route = useRoute();
    const router = useRouter();
    const { showNotification } = inject("notification");
    const currentUser = inject("currentUser");

    // State
    const video = ref({});
    const viewedVideos = ref([]);
    const favorites = ref([]);
    const comments = ref([]);
    const loading = ref(false);
    const loadingComments = ref(false);
    const addingComment = ref(false);

    // Forms
    const shareForm = ref({
      emails: "",
    });
    const newCommentContent = ref("");

    // Computed
    const isLiked = computed(() => {
      if (!currentUser.value) return false;
      return favorites.value.some(
        (fav) =>
          fav.videoId === video.value.id && fav.userId === currentUser.value.id
      );
    });

    // Watch for route changes to reload video and comments
    watch(
      () => route.params.id,
      async (newId, oldId) => {
        if (newId && newId !== oldId) {
          await loadVideo();
          loadViewedVideos();
          loadFavorites();
          await loadComments();
        }
      }
    );

    // Methods
    const loadVideo = async () => {
      loading.value = true;
      try {
        const videoId = route.params.id;
        const response = await videoService.getById(videoId);
        video.value = response.data;
      } catch (error) {
        showNotification("danger", "Lỗi", "Không thể tải thông tin video");
        router.push("/");
      } finally {
        loading.value = false;
      }
    };

    const loadViewedVideos = () => {
      const viewed = JSON.parse(localStorage.getItem("viewedVideos") || "[]");
      viewedVideos.value = viewed.filter((v) => v.id !== video.value.id);
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

    const loadComments = async () => {
      loadingComments.value = true;
      try {
        const videoId = route.params.id;
        const response = await commentService.getCommentsByVideoId(videoId);
        comments.value = response.data || [];
      } catch (error) {
        showNotification("danger", "Lỗi", "Không thể tải bình luận");
        comments.value = [];
      } finally {
        loadingComments.value = false;
      }
    };

    const addComment = async () => {
      if (!currentUser.value) {
        showNotification(
          "warning",
          "Yêu cầu đăng nhập",
          "Vui lòng đăng nhập để bình luận"
        );
        return;
      }
      if (!newCommentContent.value.trim()) {
        showNotification(
          "warning",
          "Thiếu nội dung",
          "Nội dung bình luận không được để trống"
        );
        return;
      }

      addingComment.value = true;
      try {
        const newComment = {
          videoId: video.value.id,
          userId: currentUser.value.id,
          content: newCommentContent.value.trim(),
          commentDate: new Date().toISOString().split("T")[0],
        };
        const response = await commentService.addComment(newComment);
        // Enrich the new comment with user information
        const enrichedComment = {
          ...response.data,
          user: {
            userId: currentUser.value.id,
            fullname: currentUser.value.fullname,
            avatarUrl: currentUser.value.avatarUrl,
          },
        };
        comments.value.unshift(enrichedComment);
        newCommentContent.value = "";
        showNotification(
          "success",
          "Thành công",
          "Bình luận của bạn đã được thêm"
        );
      } catch (error) {
        showNotification(
          "danger",
          "Lỗi",
          error.message || "Không thể thêm bình luận"
        );
      } finally {
        addingComment.value = false;
      }
    };

    const deleteComment = async (commentId) => {
      if (!currentUser.value) {
        showNotification(
          "warning",
          "Yêu cầu đăng nhập",
          "Bạn không có quyền xóa bình luận"
        );
        return;
      }
      if (!confirm("Bạn có chắc muốn xóa bình luận này?")) {
        return;
      }

      try {
        await commentService.deleteComment(commentId, currentUser.value.id);
        comments.value = comments.value.filter((c) => c.id !== commentId);
        showNotification("success", "Thành công", "Bình luận đã được xóa");
      } catch (error) {
        showNotification(
          "danger",
          "Lỗi",
          error.message || "Không thể xóa bình luận"
        );
      }
    };

    const formatViews = (views) => {
      if (!views) return "0";
      if (views >= 1000000) return Math.floor(views / 1000000) + "M";
      if (views >= 1000) return Math.floor(views / 1000) + "K";
      return views.toString();
    };

    const formatDate = (dateString) => {
      if (!dateString) return "N/A";
      return new Date(dateString).toLocaleDateString("vi-VN", {
        year: "numeric",
        month: "numeric",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    };

    const getYouTubeEmbedUrl = (url) => {
      if (!url) return "";
      let videoId = "";
      if (url.includes("youtube.com/watch?v=")) {
        videoId = url.split("v=")[1].split("&")[0];
      } else if (url.includes("youtu.be/")) {
        videoId = url.split("youtu.be/")[1].split("?")[0];
      } else if (url.includes("youtube.com/embed/")) {
        videoId = url.split("embed/")[1].split("?")[0];
      }
      return videoId ? `https://www.youtube.com/embed/${videoId}` : url;
    };

    const toggleLike = async () => {
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
          (fav) => fav.videoId === video.value.id
        );

        if (existingFavorite) {
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
          const newFavorite = {
            userId: currentUser.value.id,
            videoId: video.value.id,
            likeDate: new Date().toISOString().split("T")[0],
          };
          const response = await favoriteService.create(newFavorite);
          favorites.value.push(response.data);
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

    const shareVideo = () => {
      if (!currentUser.value) {
        showNotification(
          "warning",
          "Yêu cầu đăng nhập",
          "Vui lòng đăng nhập để chia sẻ video"
        );
        return;
      }

      shareForm.value = { emails: "" };
      showShareModal();
    };

    const submitShare = async () => {
      if (!shareForm.value.emails.trim()) {
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
            videoId: video.value.id,
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

    const goToVideo = (selectedVideo) => {
      if (selectedVideo.id !== video.value.id) {
        router.push(`/video/${selectedVideo.id}`);
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

    onMounted(async () => {
      await loadVideo();
      loadViewedVideos();
      loadFavorites();
      await loadComments();
    });

    return {
      video,
      viewedVideos,
      loading,
      shareForm,
      isLiked,
      comments,
      newCommentContent,
      loadingComments,
      addingComment,
      formatViews,
      formatDate,
      getYouTubeEmbedUrl,
      toggleLike,
      shareVideo,
      submitShare,
      goToVideo,
      showShareModal,
      hideShareModal,
      addComment,
      deleteComment,
      currentUser,
    };
  },
};
</script>

<style scoped>
.video-container {
  background: #000;
  border-radius: 0.5rem;
  overflow: hidden;
}

.video-actions .btn-group .btn {
  border-radius: 0.375rem;
  margin-left: 0.25rem;
}

.video-actions .btn-group .btn:first-child {
  margin-left: 0;
}

.viewed-video-item {
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 0.375rem;
  transition: background-color 0.2s ease;
}

.viewed-video-item:hover {
  background-color: #f8f9fa;
}

.viewed-video-thumb {
  width: 80px;
  height: 60px;
  object-fit: cover;
  border-radius: 0.25rem;
}

.viewed-video-info h6 {
  font-size: 0.875rem;
  line-height: 1.2;
}

.cursor-pointer {
  cursor: pointer;
}

.comment-item {
  background-color: #f8f9fa;
  border-color: #e9ecef;
}

/* Dark theme adjustments for comments */
.dark-theme .comment-item {
  background-color: #3a3a3a;
  border-color: #555555;
  color: #ffffff;
}

.dark-theme .comment-item strong {
  color: #90caf9; /* Lighter blue for names in dark mode */
}

.dark-theme .comment-item small {
  color: #b0b0b0 !important;
}

@media (max-width: 768px) {
  .video-actions {
    margin-top: 1rem;
  }

  .d-flex.justify-content-between {
    flex-direction: column;
    align-items: flex-start !important;
  }
}
</style>
