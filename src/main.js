import { createApp } from "vue"
import { createRouter, createWebHistory } from "vue-router"
import App from "./App.vue"

// Bootstrap CSS
import "bootstrap/dist/css/bootstrap.min.css"
import "bootstrap/dist/js/bootstrap.bundle.min.js"

// Components
import Home from "./views/Home.vue"
import Users from "./views/Users.vue"
import Videos from "./views/Videos.vue"
import Favorites from "./views/Favorites.vue"
import Shares from "./views/Shares.vue"
import ViewHistories from "./views/ViewHistories.vue"

const routes = [
  { path: "/", component: Home },
  { path: "/users", component: Users },
  { path: "/videos", component: Videos },
  { path: "/favorites", component: Favorites },
  { path: "/shares", component: Shares },
  { path: "/viewhistories", component: ViewHistories },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

const app = createApp(App)
app.use(router)
app.mount("#app")
