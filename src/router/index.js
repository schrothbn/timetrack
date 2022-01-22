import {createRouter, createWebHistory} from 'vue-router'
import Home from '@/views/Home.vue'
import Login from '@/views/Login.vue'
import Register from '@/views/Register.vue'
import CreateTask from '@/views/CreateTask.vue'
import CreateProject from '@/views/CreateProject.vue'
import TrackerPage from '@/views/TrackerPage.vue'
import ViewProject from '@/views/ViewProject.vue'


const routes = [
    { 
        path: '/',
        name: 'Home',
        component: Home
    },
    { 
        path: '/login',
        name: 'Login',
        component: Login
    },
    { 
        path: '/register',
        name: 'Register',
        component: Register
    },
    {
        path: '/tasks/new',
        name: 'Create',
        component: CreateTask
    },
    {
        path: '/projects/new',
        name: 'CreateProject',
        component: CreateProject
    },
    {
        path: '/track',
        name: 'Tracker',
        component: TrackerPage
    },
    {
        path: '/project/:id',
        name: 'ViewProject',
        component: ViewProject
    }
];

const router = createRouter({ 
    history: createWebHistory(),
    routes,
});

export default router;