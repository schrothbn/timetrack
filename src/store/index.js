import { reactive } from 'vue';

const state = reactive({
    user: null,
    projects: [],
    tracking: false,
});

const methods = {
    setUser(payload) {
        state.user = payload ? payload.user : null 
    },
    setProjects(projects) {
        state.projects = projects 
    },
    addProject(project) {
        state.projects.push(project)
    },
    removeProject(project) {
        const idx = state.projects.findIndex(p => p === project);
        state.projects.slice(idx, 1);
    },
    startTracking() {
        state.tracking = true;
    },
    stopTrakcing() {
        state.tracking = false;
    }
}

export default {
    state,
    methods
};