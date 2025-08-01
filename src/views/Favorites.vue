<template>
  <div class="favorites">
    <div class="d-flex justify-content-between align-items-center mb-4">
      <h2>Favorites Management</h2>
      <button class="btn btn-danger" @click="showCreateModal">
        <i class="fas fa-plus me-2"></i>Add Favorite
      </button>
    </div>

    <!-- Loading -->
    <div v-if="loading" class="text-center">
      <div class="spinner-border" role="status">
        <span class="visually-hidden">Loading...</span>
      </div>
    </div>

    <!-- Favorites Table -->
    <div v-else class="card">
      <div class="card-body">
        <div class="table-responsive">
          <table class="table table-striped">
            <thead>
              <tr>
                <th>ID</th>
                <th>User ID</th>
                <th>Video ID</th>
                <th>Like Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="favorite in favorites" :key="favorite.id">
                <td>{{ favorite.id }}</td>
                <td>{{ favorite.userId }}</td>
                <td>{{ favorite.videoId }}</td>
                <td>{{ formatDate(favorite.likeDate) }}</td>
                <td>
                  <button
                    class="btn btn-sm btn-outline-primary me-2"
                    @click="editFavorite(favorite)"
                  >
                    <i class="fas fa-edit"></i>
                  </button>
                  <button
                    class="btn btn-sm btn-outline-danger"
                    @click="deleteFavorite(favorite.id)"
                  >
                    <i class="fas fa-trash"></i>
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- Create/Edit Modal -->
    <div class="modal fade" id="favoriteModal" tabindex="-1">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">
              {{ isEditing ? "Edit Favorite" : "Create Favorite" }}
            </h5>
            <button type="button" class="btn-close" @click="hideModal"></button>
          </div>
          <div class="modal-body">
            <form @submit.prevent="saveFavorite">
              <div class="mb-3">
                <label for="favoriteId" class="form-label">Favorite ID</label>
                <input
                  type="number"
                  class="form-control"
                  id="favoriteId"
                  v-model="currentFavorite.id"
                  :disabled="isEditing"
                  required
                />
              </div>
              <div class="mb-3">
                <label for="userId" class="form-label">User ID</label>
                <input
                  type="text"
                  class="form-control"
                  id="userId"
                  v-model="currentFavorite.userId"
                  required
                />
              </div>
              <div class="mb-3">
                <label for="videoId" class="form-label">Video ID</label>
                <input
                  type="text"
                  class="form-control"
                  id="videoId"
                  v-model="currentFavorite.videoId"
                  required
                />
              </div>
              <div class="mb-3">
                <label for="likeDate" class="form-label">Like Date</label>
                <input
                  type="date"
                  class="form-control"
                  id="likeDate"
                  v-model="currentFavorite.likeDate"
                  required
                />
              </div>
            </form>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" @click="hideModal">
              Cancel
            </button>
            <button type="button" class="btn btn-danger" @click="saveFavorite">
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
import { favoriteService } from "../services/api";

export default {
  name: "Favorites",
  setup() {
    const { showNotification } = inject("notification");
    const favorites = ref([]);
    const loading = ref(false);
    const isEditing = ref(false);
    const currentFavorite = ref({
      id: null,
      userId: "",
      videoId: "",
      likeDate: "",
    });

    const formatDate = (dateString) => {
      if (!dateString) return "";
      return new Date(dateString).toLocaleDateString();
    };

    const loadFavorites = async () => {
      loading.value = true;
      try {
        const response = await favoriteService.getAll();
        favorites.value = response.data || [];
      } catch (error) {
        showNotification("danger", "Error", "Failed to load favorites");
      } finally {
        loading.value = false;
      }
    };

    const showCreateModal = () => {
      isEditing.value = false;
      currentFavorite.value = {
        id: null,
        userId: "",
        videoId: "",
        likeDate: new Date().toISOString().split("T")[0],
      };
      const modalElement = document.getElementById("favoriteModal");
      modalElement.classList.add("show");
      modalElement.style.display = "block";
      document.body.classList.add("modal-open");

      const backdrop = document.createElement("div");
      backdrop.className = "modal-backdrop fade show";
      backdrop.id = "modal-backdrop";
      document.body.appendChild(backdrop);
    };

    const editFavorite = (favorite) => {
      isEditing.value = true;
      currentFavorite.value = {
        ...favorite,
        likeDate: favorite.likeDate
          ? new Date(favorite.likeDate).toISOString().split("T")[0]
          : "",
      };
      const modalElement = document.getElementById("favoriteModal");
      modalElement.classList.add("show");
      modalElement.style.display = "block";
      document.body.classList.add("modal-open");

      const backdrop = document.createElement("div");
      backdrop.className = "modal-backdrop fade show";
      backdrop.id = "modal-backdrop";
      document.body.appendChild(backdrop);
    };

    const saveFavorite = async () => {
      try {
        if (isEditing.value) {
          await favoriteService.update(
            currentFavorite.value.id,
            currentFavorite.value
          );
          showNotification(
            "success",
            "Success",
            "Favorite updated successfully"
          );
        } else {
          await favoriteService.create(currentFavorite.value);
          showNotification(
            "success",
            "Success",
            "Favorite created successfully"
          );
        }

        hideModal();
        loadFavorites();
      } catch (error) {
        showNotification("danger", "Error", "Failed to save favorite");
      }
    };

    const deleteFavorite = async (id) => {
      if (confirm("Are you sure you want to delete this favorite?")) {
        try {
          await favoriteService.delete(id);
          showNotification(
            "success",
            "Success",
            "Favorite deleted successfully"
          );
          loadFavorites();
        } catch (error) {
          showNotification("danger", "Error", "Failed to delete favorite");
        }
      }
    };

    const hideModal = () => {
      const modalElement = document.getElementById("favoriteModal");
      modalElement.classList.remove("show");
      modalElement.style.display = "none";
      document.body.classList.remove("modal-open");

      const backdrop = document.getElementById("modal-backdrop");
      if (backdrop) {
        backdrop.remove();
      }
    };

    onMounted(() => {
      loadFavorites();
    });

    return {
      favorites,
      loading,
      isEditing,
      currentFavorite,
      formatDate,
      showCreateModal,
      editFavorite,
      saveFavorite,
      deleteFavorite,
      hideModal,
    };
  },
};
</script>
