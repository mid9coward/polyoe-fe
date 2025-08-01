<template>
  <div class="view-histories">
    <div class="d-flex justify-content-between align-items-center mb-4">
      <h2>View Histories Management</h2>
      <button class="btn btn-warning" @click="showCreateModal">
        <i class="fas fa-plus me-2"></i>Add View History
      </button>
    </div>

    <!-- Loading -->
    <div v-if="loading" class="text-center">
      <div class="spinner-border" role="status">
        <span class="visually-hidden">Loading...</span>
      </div>
    </div>

    <!-- View Histories Table -->
    <div v-else class="card">
      <div class="card-body">
        <div class="table-responsive">
          <table class="table table-striped">
            <thead>
              <tr>
                <th>ID</th>
                <th>User ID</th>
                <th>Video ID</th>
                <th>View Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="viewHistory in viewHistories" :key="viewHistory.id">
                <td>{{ viewHistory.id }}</td>
                <td>{{ viewHistory.userId }}</td>
                <td>{{ viewHistory.videoId }}</td>
                <td>{{ formatDate(viewHistory.viewDate) }}</td>
                <td>
                  <button
                    class="btn btn-sm btn-outline-primary me-2"
                    @click="editViewHistory(viewHistory)"
                  >
                    <i class="fas fa-edit"></i>
                  </button>
                  <button
                    class="btn btn-sm btn-outline-danger"
                    @click="deleteViewHistory(viewHistory.id)"
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
    <div class="modal fade" id="viewHistoryModal" tabindex="-1">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">
              {{ isEditing ? "Edit View History" : "Create View History" }}
            </h5>
            <button type="button" class="btn-close" @click="hideModal"></button>
          </div>
          <div class="modal-body">
            <form @submit.prevent="saveViewHistory">
              <div class="mb-3">
                <label for="viewHistoryId" class="form-label"
                  >View History ID</label
                >
                <input
                  type="number"
                  class="form-control"
                  id="viewHistoryId"
                  v-model="currentViewHistory.id"
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
                  v-model="currentViewHistory.userId"
                  required
                />
              </div>
              <div class="mb-3">
                <label for="videoId" class="form-label">Video ID</label>
                <input
                  type="text"
                  class="form-control"
                  id="videoId"
                  v-model="currentViewHistory.videoId"
                  required
                />
              </div>
              <div class="mb-3">
                <label for="viewDate" class="form-label">View Date</label>
                <input
                  type="date"
                  class="form-control"
                  id="viewDate"
                  v-model="currentViewHistory.viewDate"
                  required
                />
              </div>
            </form>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" @click="hideModal">
              Cancel
            </button>
            <button
              type="button"
              class="btn btn-warning"
              @click="saveViewHistory"
            >
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
import { viewHistoryService } from "../services/api";

export default {
  name: "ViewHistories",
  setup() {
    const { showNotification } = inject("notification");
    const viewHistories = ref([]);
    const loading = ref(false);
    const isEditing = ref(false);
    const currentViewHistory = ref({
      id: null,
      userId: "",
      videoId: "",
      viewDate: "",
    });

    const formatDate = (dateString) => {
      if (!dateString) return "";
      return new Date(dateString).toLocaleDateString();
    };

    const loadViewHistories = async () => {
      loading.value = true;
      try {
        const response = await viewHistoryService.getAll();
        viewHistories.value = response.data || [];
      } catch (error) {
        showNotification("danger", "Error", "Failed to load view histories");
      } finally {
        loading.value = false;
      }
    };

    const showCreateModal = () => {
      isEditing.value = false;
      currentViewHistory.value = {
        id: null,
        userId: "",
        videoId: "",
        viewDate: new Date().toISOString().split("T")[0],
      };
      const modalElement = document.getElementById("viewHistoryModal");
      modalElement.classList.add("show");
      modalElement.style.display = "block";
      document.body.classList.add("modal-open");

      const backdrop = document.createElement("div");
      backdrop.className = "modal-backdrop fade show";
      backdrop.id = "modal-backdrop";
      document.body.appendChild(backdrop);
    };

    const editViewHistory = (viewHistory) => {
      isEditing.value = true;
      currentViewHistory.value = {
        ...viewHistory,
        viewDate: viewHistory.viewDate
          ? new Date(viewHistory.viewDate).toISOString().split("T")[0]
          : "",
      };
      const modalElement = document.getElementById("viewHistoryModal");
      modalElement.classList.add("show");
      modalElement.style.display = "block";
      document.body.classList.add("modal-open");

      const backdrop = document.createElement("div");
      backdrop.className = "modal-backdrop fade show";
      backdrop.id = "modal-backdrop";
      document.body.appendChild(backdrop);
    };

    const saveViewHistory = async () => {
      try {
        if (isEditing.value) {
          await viewHistoryService.update(
            currentViewHistory.value.id,
            currentViewHistory.value
          );
          showNotification(
            "success",
            "Success",
            "View history updated successfully"
          );
        } else {
          await viewHistoryService.create(currentViewHistory.value);
          showNotification(
            "success",
            "Success",
            "View history created successfully"
          );
        }

        hideModal();
        loadViewHistories();
      } catch (error) {
        showNotification("danger", "Error", "Failed to save view history");
      }
    };

    const deleteViewHistory = async (id) => {
      if (confirm("Are you sure you want to delete this view history?")) {
        try {
          await viewHistoryService.delete(id);
          showNotification(
            "success",
            "Success",
            "View history deleted successfully"
          );
          loadViewHistories();
        } catch (error) {
          showNotification("danger", "Error", "Failed to delete view history");
        }
      }
    };

    const hideModal = () => {
      const modalElement = document.getElementById("viewHistoryModal");
      modalElement.classList.remove("show");
      modalElement.style.display = "none";
      document.body.classList.remove("modal-open");

      const backdrop = document.getElementById("modal-backdrop");
      if (backdrop) {
        backdrop.remove();
      }
    };

    onMounted(() => {
      loadViewHistories();
    });

    return {
      viewHistories,
      loading,
      isEditing,
      currentViewHistory,
      formatDate,
      showCreateModal,
      editViewHistory,
      saveViewHistory,
      deleteViewHistory,
      hideModal,
    };
  },
};
</script>
