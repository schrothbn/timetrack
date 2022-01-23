import { createRouter, createWebHistory } from "vue-router";
import Home from "@/views/Home.vue";
import { supabase } from "@/supabase/init";
import Login from "@/views/Login.vue";
import Register from "@/views/Register.vue";
import CreateProject from "@/views/CreateProject.vue";
import TrackerPage from "@/views/TrackerPage.vue";
import ViewProject from "@/views/ViewProject.vue";
import ViewTask from "@/views/ViewTask.vue";

const routes = [
  {
    path: "/",
    name: "Home",
    component: Home,
    meta: {
      title: "Projects",
      auth: true,
    },
  },
  {
    path: "/login",
    name: "Login",
    component: Login,
    meta: {
      title: "Login",
      auth: false,
    },
  },
  {
    path: "/register",
    name: "Register",
    component: Register,
    meta: {
      title: "Register",
      auth: false,
    },
  },
  {
    path: "/projects/new",
    name: "CreateProject",
    component: CreateProject,
    meta: {
      title: "Create Project",
      auth: true,
    },
  },
  {
    path: "/track",
    name: "Tracker",
    component: TrackerPage,
    meta: {
      title: "Tracker",
      auth: true,
    },
  },
  {
    path: "/project/:id",
    name: "ViewProject",
    component: ViewProject,
    meta: {
      title: "View Project",
      auth: true,
    },
  },
  {
    path: "/task/:id",
    name: "ViewTask",
    component: ViewTask,
    meta: {
      title: "View Task",
      auth: true,
    },
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

// Document titles
router.beforeEach((to, from, next) => {
  document.title = `${to.meta.title} | TimeTrack`;
  next();
});
// Route guard for auth routes
router.beforeEach((to, from, next) => {
  if (to.matched.some((res) => res.meta.auth)) {
    const user = supabase.auth.user();
    if (user) {
      next();
      return;
    }
    next({ name: "Login" });
  }
  next();
});

export default router;
