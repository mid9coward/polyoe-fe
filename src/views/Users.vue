<template>
  <div class="users">
    <div class="d-flex justify-content-between align-items-center mb-4">
      <h2>Users Management</h2>
      <button class="btn btn-primary" @click="showCreateModal">
        <i class="fas fa-plus me-2"></i>Add User
      </button>
    </div>

    <!-- Loading -->
    <div v-if="loading" class="text-center">
      <div class="spinner-border" role="status">
        <span class="visually-hidden">Loading...</span>
      </div>
    </div>

    <!-- Users Table -->
    <div v-else class="card">
      <div class="card-body">
        <div class="table-responsive">
          <table class="table table-striped">
            <thead>
              <tr>
                <th>ID</th>
                <th>Full Name</th>
                <th>Email</th>
                <th>Admin</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="user in users" :key="user.id">
                <td>{{ user.id }}</td>
                <td>{{ user.fullname }}</td>
                <td>{{ user.email }}</td>
                <td>
                  <span class="badge" :class="user.admin ? 'bg-success' : 'bg-secondary'">
                    {{ user.admin ? 'Admin' : 'User' }}
                  </span>
                </td>
                <td>
                  <button class="btn btn-sm btn-outline-primary me-2" @click="editUser(user)">
                    <i class="fas fa-edit"></i>
                  </button>
                  <button class="btn btn-sm btn-outline-danger" @click="deleteUser(user.id)">
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
    <div class="modal fade" id="userModal" tabindex="-1">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">{{ isEditing ? 'Edit User' : 'Create User' }}</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
          </div>
          <div class="modal-body">
            <form @submit.prevent="saveUser">
              <div class="mb-3">
                <label for="userId" class="form-label">User ID</label>
                <input 
                  type="text" 
                  class="form-control" 
                  id="userId" 
                  v-model="currentUser.id"
                  :disabled="isEditing"
                  required
                >
              </div>
              <div class="mb-3">
                <label for="fullname" class="form-label">Full Name</label>
                <input 
                  type="text" 
                  class="form-control" 
                  id="fullname" 
                  v-model="currentUser.fullname"
                  required
                >
              </div>
              <div class="mb-3">
                <label for="email" class="form-label">Email</label>
                <input 
                  type="email" 
                  class="form-control" 
                  id="email" 
                  v-model="currentUser.email"
                  required
                >
              </div>
              <div class="mb-3">
                <label for="password" class="form-label">Password</label>
                <input 
                  type="password" 
                  class="form-control" 
                  id="password" 
                  v-model="currentUser.password"
                  :required="!isEditing"
                >
              </div>
              <div class="mb-3 form-check">
                <input 
                  type="checkbox" 
                  class="form-check-input" 
                  id="admin" 
                  v-model="currentUser.admin"
                >
                <label class="form-check-label" for="admin">
                  Admin User
                </label>
              </div>
            </form>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
            <button type="button" class="btn btn-primary" @click="saveUser">
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
import { userService } from '../services/api'
import bootstrap from 'bootstrap'

export default {
  name: 'Users',
  setup() {
    const { showNotification } = inject('notification')
    const users = ref([])
    const loading = ref(false)
    const isEditing = ref(false)
    const currentUser = ref({
      id: '',
      fullname: '',
      email: '',
      password: '',
      admin: false
    })

    const loadUsers = async () => {
      loading.value = true
      try {
        const response = await userService.getAll()
        users.value = response.data || []
      } catch (error) {
        showNotification('danger', 'Error', 'Failed to load users')
      } finally {
        loading.value = false
      }
    }

    const showCreateModal = () => {
      isEditing.value = false
      currentUser.value = {
        id: '',
        fullname: '',
        email: '',
        password: '',
        admin: false
      }
      const modal = new bootstrap.Modal(document.getElementById('userModal'))
      modal.show()
    }

    const editUser = (user) => {
      isEditing.value = true
      currentUser.value = { ...user, password: '' }
      const modal = new bootstrap.Modal(document.getElementById('userModal'))
      modal.show()
    }

    const saveUser = async () => {
      try {
        if (isEditing.value) {
          await userService.update(currentUser.value.id, currentUser.value)
          showNotification('success', 'Success', 'User updated successfully')
        } else {
          await userService.create(currentUser.value)
          showNotification('success', 'Success', 'User created successfully')
        }
        
        const modal = bootstrap.Modal.getInstance(document.getElementById('userModal'))
        modal.hide()
        loadUsers()
      } catch (error) {
        showNotification('danger', 'Error', 'Failed to save user')
      }
    }

    const deleteUser = async (id) => {
      if (confirm('Are you sure you want to delete this user?')) {
        try {
          await userService.delete(id)
          showNotification('success', 'Success', 'User deleted successfully')
          loadUsers()
        } catch (error) {
          showNotification('danger', 'Error', 'Failed to delete user')
        }
      }
    }

    onMounted(() => {
      loadUsers()
    })

    return {
      users,
      loading,
      isEditing,
      currentUser,
      showCreateModal,
      editUser,
      saveUser,
      deleteUser
    }
  }
}
</script>
