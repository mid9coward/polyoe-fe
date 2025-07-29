<template>
  <div class="home">
    <div class="jumbotron bg-light p-5 rounded-3 mb-4">
      <div class="container-fluid py-5">
        <h1 class="display-5 fw-bold">Video Management System</h1>
        <p class="col-md-8 fs-4">
          Manage your video content, users, favorites, shares, and view histories all in one place.
        </p>
      </div>
    </div>

    <div class="row">
      <div class="col-md-4 mb-4">
        <div class="card h-100">
          <div class="card-body text-center">
            <i class="fas fa-users fa-3x text-primary mb-3"></i>
            <h5 class="card-title">Users</h5>
            <p class="card-text">Manage user accounts and permissions</p>
            <router-link to="/users" class="btn btn-primary">Manage Users</router-link>
          </div>
        </div>
      </div>

      <div class="col-md-4 mb-4">
        <div class="card h-100">
          <div class="card-body text-center">
            <i class="fas fa-video fa-3x text-success mb-3"></i>
            <h5 class="card-title">Videos</h5>
            <p class="card-text">Upload and manage video content</p>
            <router-link to="/videos" class="btn btn-success">Manage Videos</router-link>
          </div>
        </div>
      </div>

      <div class="col-md-4 mb-4">
        <div class="card h-100">
          <div class="card-body text-center">
            <i class="fas fa-heart fa-3x text-danger mb-3"></i>
            <h5 class="card-title">Favorites</h5>
            <p class="card-text">Track user favorite videos</p>
            <router-link to="/favorites" class="btn btn-danger">View Favorites</router-link>
          </div>
        </div>
      </div>

      <div class="col-md-6 mb-4">
        <div class="card h-100">
          <div class="card-body text-center">
            <i class="fas fa-share fa-3x text-info mb-3"></i>
            <h5 class="card-title">Shares</h5>
            <p class="card-text">Monitor video sharing activity</p>
            <router-link to="/shares" class="btn btn-info">View Shares</router-link>
          </div>
        </div>
      </div>

      <div class="col-md-6 mb-4">
        <div class="card h-100">
          <div class="card-body text-center">
            <i class="fas fa-history fa-3x text-warning mb-3"></i>
            <h5 class="card-title">View Histories</h5>
            <p class="card-text">Track video viewing patterns</p>
            <router-link to="/viewhistories" class="btn btn-warning">View Histories</router-link>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Home'
}
</script>
