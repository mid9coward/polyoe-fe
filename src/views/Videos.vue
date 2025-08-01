<template>
  <div class="videos">
    <div class="d-flex justify-content-between align-items-center mb-4">
      <h2>Videos Management</h2>
      <button class="btn btn-success" @click="showCreateModal">
        <i class="fas fa-plus me-2"></i>Add Video
      </button>
    </div>

    <!-- Loading -->
    <div v-if="loading" class="text-center">
      <div class="spinner-border" role="status">
        <span class="visually-hidden">Loading...</span>
      </div>
    </div>

    <!-- Videos Grid -->
    <div v-else class="row">
      <div v-for="video in videos" :key="video.id" class="col-md-4 mb-4">
        <div class="card h-100">
          <img
            :src="video.poster || '/placeholder.svg?height=200&width=300'"
            class="card-img-top"
            style="height: 200px; object-fit: cover"
            :alt="video.title"
          />
          <div class="card-body d-flex flex-column">
            <h5 class="card-title">{{ video.title }}</h5>
            <p class="card-text flex-grow-1">{{ video.description }}</p>
            <div class="mb-2">
              <small class="text-muted">
                <i class="fas fa-eye me-1"></i>{{ video.views || 0 }} views
              </small>
              <span
                class="badge ms-2"
                :class="video.active ? 'bg-success' : 'bg-secondary'"
              >
                {{ video.active ? "Active" : "Inactive" }}
              </span>
            </div>
            <div class="btn-group" role="group">
              <button
                class="btn btn-sm btn-outline-primary"
                @click="editVideo(video)"
              >
                <i class="fas fa-edit"></i>
              </button>
              <button
                class="btn btn-sm btn-outline-danger"
                @click="deleteVideo(video.id)"
              >
                <i class="fas fa-trash"></i>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Create/Edit Modal -->
    <div class="modal fade" id="videoModal" tabindex="-1">
      <div class="modal-dialog modal-lg">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">
              {{ isEditing ? "Edit Video" : "Create Video" }}
            </h5>
            <button type="button" class="btn-close" @click="hideModal"></button>
          </div>
          <div class="modal-body">
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
                <label for="title" class="form-label">Title</label>
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
                <label for="description" class="form-label">Description</label>
                <textarea
                  class="form-control"
                  id="description"
                  rows="3"
                  v-model="currentVideo.description"
                ></textarea>
              </div>
              <div class="mb-3">
                <label for="views" class="form-label">Views</label>
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
                <label class="form-check-label" for="active"> Active </label>
              </div>
            </form>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" @click="hideModal">
              Cancel
            </button>
            <button type="button" class="btn btn-success" @click="saveVideo">
              {{ isEditing ? "Update" : "Create" }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, inject } from "vue";
import { videoService } from "../services/api";

export default {
  name: "Videos",
  setup() {
    const { showNotification } = inject("notification");
    const videos = ref([]);
    const loading = ref(false);
    const isEditing = ref(false);
    const currentVideo = ref({
      id: "",
      title: "",
      poster: "",
      views: 0,
      description: "",
      active: true,
    });

    const loadVideos = async () => {
      loading.value = true;
      try {
        const response = await videoService.getAll();
        videos.value = response.data || [];
      } catch (error) {
        showNotification("danger", "Error", "Failed to load videos");
      } finally {
        loading.value = false;
      }
    };

    const showCreateModal = () => {
      isEditing.value = false;
      currentVideo.value = {
        id: "",
        title: "",
        poster: "",
        views: 0,
        description: "",
        active: true,
      };
      const modalElement = document.getElementById("videoModal");
      modalElement.classList.add("show");
      modalElement.style.display = "block";
      document.body.classList.add("modal-open");

      const backdrop = document.createElement("div");
      backdrop.className = "modal-backdrop fade show";
      backdrop.id = "modal-backdrop";
      document.body.appendChild(backdrop);
    };

    const editVideo = (video) => {
      isEditing.value = true;
      currentVideo.value = { ...video };
      const modalElement = document.getElementById("videoModal");
      modalElement.classList.add("show");
      modalElement.style.display = "block";
      document.body.classList.add("modal-open");

      const backdrop = document.createElement("div");
      backdrop.className = "modal-backdrop fade show";
      backdrop.id = "modal-backdrop";
      document.body.appendChild(backdrop);
    };

    const saveVideo = async () => {
      try {
        if (isEditing.value) {
          await videoService.update(currentVideo.value.id, currentVideo.value);
          showNotification("success", "Success", "Video updated successfully");
        } else {
          await videoService.create(currentVideo.value);
          showNotification("success", "Success", "Video created successfully");
        }

        hideModal();
        loadVideos();
      } catch (error) {
        showNotification("danger", "Error", "Failed to save video");
      }
    };

    const hideModal = () => {
      const modalElement = document.getElementById("videoModal");
      modalElement.classList.remove("show");
      modalElement.style.display = "none";
      document.body.classList.remove("modal-open");

      const backdrop = document.getElementById("modal-backdrop");
      if (backdrop) {
        backdrop.remove();
      }
    };

    const deleteVideo = async (id) => {
      if (confirm("Are you sure you want to delete this video?")) {
        try {
          await videoService.delete(id);
          showNotification("success", "Success", "Video deleted successfully");
          loadVideos();
        } catch (error) {
          showNotification("danger", "Error", "Failed to delete video");
        }
      }
    };

    onMounted(() => {
      loadVideos();
    });

    return {
      videos,
      loading,
      isEditing,
      currentVideo,
      showCreateModal,
      editVideo,
      saveVideo,
      deleteVideo,
      hideModal,
    };
  },
};
</script>
