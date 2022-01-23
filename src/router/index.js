import {createRouter, createWebHistory} from 'vue-router'
import Home from '@/views/Home.vue'
import Login from '@/views/Login.vue'
import Register from '@/views/Register.vue'
import CreateProject from '@/views/CreateProject.vue'
import TrackerPage from '@/views/TrackerPage.vue'
import ViewProject from '@/views/ViewProject.vue'


const routes = [
    { 
        path: '/',
        name: 'Home',
        component: Home,
        meta: {title: 'Projects'}
    },
    { 
        path: '/login',
        name: 'Login',
        component: Login,
        meta: {title: 'Login'}
    },
    { 
        path: '/register',
        name: 'Register',
        component: Register,
        meta: {title: 'Register'}

    },
    {
        path: '/projects/new',
        name: 'CreateProject',
        component: CreateProject,
        meta: {title: 'Create Project'}

    },
    {
        path: '/track',
        name: 'Tracker',
        component: TrackerPage,
        meta: {title: 'Tracker'}

    },
    {
        path: '/project/:id',
        name: 'ViewProject',
        component: ViewProject,
        meta: {title: 'View Project'}

    }
];

const router = createRouter({ 
    history: createWebHistory(),
    routes,
});

router.beforeEach((to, from, next) => {
    document.title = `${to.meta.title} | TimeTrack`
    next();
});

export default router;