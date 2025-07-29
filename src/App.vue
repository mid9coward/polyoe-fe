<template>
  <div id="app">
    <nav class="navbar navbar-expand-lg navbar-dark bg-primary">
      <div class="container">
        <router-link class="navbar-brand" to="/">
          <i class="fas fa-video me-2"></i>
          Video Management System
        </router-link>
        
        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
          <span class="navbar-toggler-icon"></span>
        </button>
        
        <div class="collapse navbar-collapse" id="navbarNav">
          <ul class="navbar-nav ms-auto">
            <li class="nav-item">
              <router-link class="nav-link" to="/">Home</router-link>
            </li>
            <li class="nav-item">
              <router-link class="nav-link" to="/users">Users</router-link>
            </li>
            <li class="nav-item">
              <router-link class="nav-link" to="/videos">Videos</router-link>
            </li>
            <li class="nav-item">
              <router-link class="nav-link" to="/favorites">Favorites</router-link>
            </li>
            <li class="nav-item">
              <router-link class="nav-link" to="/shares">Shares</router-link>
            </li>
            <li class="nav-item">
              <router-link class="nav-link" to="/viewhistories">View Histories</router-link>
            </li>
          </ul>
        </div>
      </div>
    </nav>

    <main class="container mt-4">
      <router-view />
    </main>

    <!-- Toast Container for notifications -->
    <div class="toast-container position-fixed bottom-0 end-0 p-3">
      <div v-if="notification.show" class="toast show" :class="notification.type">
        <div class="toast-header">
          <strong class="me-auto">{{ notification.title }}</strong>
          <button type="button" class="btn-close" @click="hideNotification"></button>
        </div>
        <div class="toast-body">
          {{ notification.message }}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, provide } from 'vue'

export default {
  name: 'App',
  setup() {
    const notification = ref({
      show: false,
      type: '',
      title: '',
      message: ''
    })

    const showNotification = (type, title, message) => {
      notification.value = {
        show: true,
        type: `bg-${type}`,
        title,
        message
      }
      setTimeout(() => {
        hideNotification()
      }, 5000)
    }

    const hideNotification = () => {
      notification.value.show = false
    }

    // Provide notification methods to child components
    provide('notification', { showNotification })

    return {
      notification,
      hideNotification
    }
  }
}
</script>

<style>
.router-link-active {
  font-weight: bold;
}

.toast {
  min-width: 300px;
}
</style>
