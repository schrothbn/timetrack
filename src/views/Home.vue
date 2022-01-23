<template>
    <div v-if="dataLoaded" class="container mt-10 px-4">
        <!-- No data -->
        <div v-if="projects.length === 0" class="w-full flex flex-col items-center">
            <h1 class="text-2xl text-primary">No projects created...</h1>
            <router-link 
            class="mt-6 py-2 px-6 bg-primary-light rounded-sm text-sm text-white duration-200 border-solid
            border-2 border-transparent hover:border-primary-light hover:bg-white hover:text-primary-light"
            :to="{name: 'CreateProject'}">Create Project</router-link>

        </div>
        <!-- Data -->
        <div v-else class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6">
            <router-link
v-for="(project, idx) in projects"
                :key="idx"
                class="flex flex-col items-center bg-secondary-light p-8 shadow-md cursor-pointer"
                :to="{name: 'ViewProject', params: {id: project.id }}"
            >
            <!-- Project image -->

            
            <h1 class="mt-8 mb-2 text-center text-xl text-white rounded-md shadow-lg bg-primary-light py-1 px-3">{{project.name}}</h1>

            <p class="mt-6 py-1 px-3 text-xs text-primary">
            {{ project.description}}
            </p>

            </router-link>
        </div>
    </div>
</template>
<script setup>
    import { ref }  from 'vue';
    import store from '@/store/index'
    import { supabase } from '@/supabase/init'
    // Create data / vars
    const projects = ref([]);
    const dataLoaded = ref(false);
    const user = store.state.user;
    // Get data 

    const loadProjects = async () => {
        try {
            const {data, error} = await supabase.from('projects').select('*').eq('user', user.id);
            if (error) throw error;
            projects.value = data;
            dataLoaded.value = true;
        } catch(error) {
            console.warn(error);
        }
    }

    // Run data functions
    loadProjects();

</script>