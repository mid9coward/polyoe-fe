<template>
  <div class="shares">
    <div class="d-flex justify-content-between align-items-center mb-4">
      <h2>Shares Management</h2>
      <button class="btn btn-info" @click="showCreateModal">
        <i class="fas fa-plus me-2"></i>Add Share
      </button>
    </div>

    <!-- Loading -->
    <div v-if="loading" class="text-center">
      <div class="spinner-border" role="status">
        <span class="visually-hidden">Loading...</span>
      </div>
    </div>

    <!-- Shares Table -->
    <div v-else class="card">
      <div class="card-body">
        <div class="table-responsive">
          <table class="table table-striped">
            <thead>
              <tr>
                <th>ID</th>
                <th>User ID</th>
                <th>Video ID</th>
                <th>Emails</th>
                <th>Share Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="share in shares" :key="share.id">
                <td>{{ share.id }}</td>
                <td>{{ share.userId }}</td>
                <td>{{ share.videoId }}</td>
                <td>
                  <span class="badge bg-secondary">{{ share.emails }}</span>
                </td>
                <td>{{ formatDate(share.shareDate) }}</td>
                <td>
                  <button class="btn btn-sm btn-outline-primary me-2" @click="editShare(share)">
                    <i class="fas fa-edit"></i>
                  </button>
                  <button class="btn btn-sm btn-outline-danger" @click="deleteShare(share.id)">
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
    <div class="modal fade" id="shareModal" tabindex="-1">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">{{ isEditing ? 'Edit Share' : 'Create Share' }}</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
          </div>
          <div class="modal-body">
            <form @submit.prevent="saveShare">
              <div class="mb-3">
                <label for="shareId" class="form-label">Share ID</label>
                <input 
                  type="number" 
                  class="form-control" 
                  id="shareId" 
                  v-model="currentShare.id"
                  :disabled="isEditing"
                  required
                >
              </div>
              <div class="mb-3">
                <label for="userId" class="form-label">User ID</label>
                <input 
                  type="text" 
                  class="form-control" 
                  id="userId" 
                  v-model="currentShare.userId"
                  required
                >
              </div>
              <div class="mb-3">
                <label for="videoId" class="form-label">Video ID</label>
                <input 
                  type="text" 
                  class="form-control" 
                  id="videoId" 
                  v-model="currentShare.videoId"
                  required
                >
              </div>
              <div class="mb-3">
                <label for="emails" class="form-label">Email</label>
                <input 
                  type="email" 
                  class="form-control" 
                  id="emails" 
                  v-model="currentShare.emails"
                  required
                >
              </div>
              <div class="mb-3">
                <label for="shareDate" class="form-label">Share Date</label>
                <input 
                  type="date" 
                  class="form-control" 
                  id="shareDate" 
                  v-model="currentShare.shareDate"
                  required
                >
              </div>
            </form>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
            <button type="button" class="btn btn-info" @click="saveShare">
              {{ isEditing ? 'Update' : 'Create' }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, inject } from 'vue'
import { shareService } from '../services/api'
import bootstrap from 'bootstrap'

export default {
  name: 'Shares',
  setup() {
    const { showNotification } = inject('notification')
    const shares = ref([])
    const loading = ref(false)
    const isEditing = ref(false)
    const currentShare = ref({
      id: null,
      userId: '',
      videoId: '',
      emails: '',
      shareDate: ''
    })

    const formatDate = (dateString) => {
      if (!dateString) return ''
      return new Date(dateString).toLocaleDateString()
    }

    const loadShares = async () => {
      loading.value = true
      try {
        const response = await shareService.getAll()
        shares.value = response.data || []
      } catch (error) {
        showNotification('danger', 'Error', 'Failed to load shares')
      } finally {
        loading.value = false
      }
    }

    const showCreateModal = () => {
      isEditing.value = false
      currentShare.value = {
        id: null,
        userId: '',
        videoId: '',
        emails: '',
        shareDate: new Date().toISOString().split('T')[0]
      }
      const modal = new bootstrap.Modal(document.getElementById('shareModal'))
      modal.show()
    }

    const editShare = (share) => {
      isEditing.value = true
      currentShare.value = { 
        ...share,
        shareDate: share.shareDate ? new Date(share.shareDate).toISOString().split('T')[0] : ''
      }
      const modal = new bootstrap.Modal(document.getElementById('shareModal'))
      modal.show()
    }

    const saveShare = async () => {
      try {
        if (isEditing.value) {
          await shareService.update(currentShare.value.id, currentShare.value)
          showNotification('success', 'Success', 'Share updated successfully')
        } else {
          await shareService.create(currentShare.value)
          showNotification('success', 'Success', 'Share created successfully')
        }
        
        const modal = bootstrap.Modal.getInstance(document.getElementById('shareModal'))
        modal.hide()
        loadShares()
      } catch (error) {
        showNotification('danger', 'Error', 'Failed to save share')
      }
    }

    const deleteShare = async (id) => {
      if (confirm('Are you sure you want to delete this share?')) {
        try {
          await shareService.delete(id)
          showNotification('success', 'Success', 'Share deleted successfully')
          loadShares()
        } catch (error) {
          showNotification('danger', 'Error', 'Failed to delete share')
        }
      }
    }

    onMounted(() => {
      loadShares()
    })

    return {
      shares,
      loading,
      isEditing,
      currentShare,
      formatDate,
      showCreateModal,
      editShare,
      saveShare,
      deleteShare
    }
  }
}
</script>
