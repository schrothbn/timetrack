<template>
    <div v-if="bigLayout" class="max-w-md bg-secondary-light py-4 px-2 text-center mx-auto shadow-lg rounded-md">

        <h1 class="text-2xl text-primary-light">Tracker</h1>
        <form v-if="!tracking" class="flex flex-col gap-y-4 w-full" @submit.prevent="">
            <select v-model="selectedProject" name="project" class="bg-white text-primary">
                <option v-for="project in projects" :key="project.id" :value="project.id" >{{project.name}}</option>"
            </select>
            <select v-if="selectedProject" name="task">
                <option></option>

            </select>
        </form>
        <div v-if="tracking" class="flex flex-row gap-4 items-center">
            <h1>Time</h1>
            <FaIcon v-if="tracking" icon="pause-circle" class="cursor-pointer text-primary text-4xl hover:text-white" @click="pauseTracking"/>
            <FaIcon v-if="tracking" icon="stop-circle" class="cursor-pointer text-primary text-4xl hover:text-white" @click="stopTracking"/>
        </div>
    </div>
    <div v-else class="flex flex-row gap-4 items-center">
        <FaIcon v-if="!tracking" icon="play-circle" class="cursor-pointer text-primary font-bold text-xl hover:text-white" @click="startTracking"/>
        <FaIcon v-if="tracking" icon="pause-circle" class="cursor-pointer text-primary text-xl hover:text-white" @click="pauseTracking"/>
        <FaIcon v-if="tracking" icon="stop-circle" class="cursor-pointer text-primary text-xl hover:text-white" @click="stopTracking"/>
    </div>
</template>

<script>
import { ref, computed } from 'vue'
import store from '@/store/index'
import { supabase } from '@/supabase/init'
export default {
    name: 'TrackerComponent',
    props: {
        layout: {
            default: 'big',
            type: String,
            required: true
        },
    },
    setup(props) {
        const tracking = ref(store.state.tracking);
        const user = computed(() => store.state.user);
        const bigLayout = computed(() => props.layout === 'big');
        const projects = ref([]);
        const loaded = ref(false);
        const selectedProject = ref(null);


        const startTracking = () => {
            console.log('Started tracking')
        }

        const loadData = async () => {
            try {
                const {data , error } = await supabase.from('projects').select().eq('user', user.value.id);
                if (error) throw error;
                projects.value = data;
                loaded.value = true;
            } catch (error) {
                console.warn(error);
            }
        };
        loadData();

        return {
            bigLayout,
            tracking,
            selectedProject,
            startTracking
        }

    }

}
</script>