<template>
    <div v-if="loaded">
        <!-- Big Layout for Page -->
        <div v-if="bigLayout" class="mt-4 max-w-md bg-secondary-light py-4 px-2 text-center mx-auto shadow-lg rounded-md">
            <form v-if="!tracking" class="flex flex-col gap-y-4 w-full" @submit.prevent="">

                <label for="project" class="text-sm text-primary text-left">Project:</label>
                <select id="project" v-model="selectedProject" name="project" class="bg-white text-primary">
                    <option v-for="project in projects" :key="project.id" :value="project" >{{project.name}}</option>"
                </select>

                <label v-if="selectedProject" for="task" class="text-sm text-primary text-left">Task:</label>
                <select v-if="selectedProject" id="task" v-model="selectedTask" name="task" class="bg-white text-primary">
                    <option v-for="task in selectedProject.tasks" :key="task.id" :value="task">{{task.name }} </option>
                </select>
                <div v-if="selectedTask" class="flex flex-col gap-4 items-start mt-3">

                    <FaIcon icon="play-circle" class="cursor-pointer text-green-500 text-4xl hover:text-white" @click="startTracking"/>
                </div>

            </form>
            
            <div v-if="tracking" class="flex flex-col gap-4 items-center">
                <h1 class="text-4xl text-primary-light">Tracking {{currentTracking.tasks.name}}</h1>
                <h1 v-if="trackingTime" class="text-4xl text-primary-light ">{{trackingTime.hours}}:{{trackingTime.minutes}}:{{trackingTime.seconds}}</h1>
                <FaIcon icon="stop-circle" class="cursor-pointer text-red-500 text-4xl hover:text-white" @click="stopTracking"/>
            </div>
        </div>
        <!--  Small layout -->
        <div v-else class="flex flex-row gap-4 items-center">
            <FaIcon v-if="!tracking" icon="play-circle" class="cursor-pointer text-primary font-bold text-xl hover:text-white" @click="startTracking"/>
            <FaIcon v-if="tracking" icon="stop-circle" class="cursor-pointer text-primary text-xl hover:text-white" @click="stopTracking"/>
        </div>
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
        const tracking = computed(() => store.state.trackId !== null);
        const currentTracking = ref(null);
        const trackingTime = ref(null);
        const user = computed(() => store.state.user);
        const bigLayout = computed(() => props.layout === 'big');
        const projects = ref([]);
        const loaded = ref(false);
        const selectedProject = ref(null);
        const selectedTask = ref(null);


        const startTracking = async () => {
            if (selectedTask.value) {
                try {
                    const {data, error} = await supabase.from('trackings').insert({
                        task: selectedTask.value.id,
                    })
                    if (error) throw error;
                    currentTracking.value = data[0];
                    currentTracking.value.tasks = selectedTask.value;
                    store.methods.startTracking(currentTracking.value.id);
                    console.log(store.state.trackId);
                    computeTracking();
                } catch(error) {
                    console.warn(error);
                }
            }
        };

        const stopTracking = async () => {
            try {
                const {error} = await supabase.from('trackings').update({
                    endTime:  new Date(),
                }).eq('id', store.state.trackId);
                if (error) throw error;
                store.methods.stopTracking();
                currentTracking.value = null;
                trackingTime.value = null;
            } catch (error){
                console.warn(error);
            }
        }


        const loadData = async () => {
            try {
                const {data , error } = await supabase.from('projects')
                    .select('id, name, tasks ( id, name )')
                    .eq('user', user.value.id);
                if (error) throw error;
                projects.value = data;
                if (tracking.value) {
                    console.log('Loading tracking');
                    const {data: trackingData, error} =  await supabase.from('trackings')
                        .select("*, tasks(id, name)")
                        .eq('id', store.state.trackId);
                    if (error) throw error;
                    currentTracking.value = trackingData[0];
                }
                loaded.value = true;
            } catch (error) {
                console.warn(error);
            }
        };
        loadData();

        const toTime = (ms) => {
            const seconds = Math.floor((ms / 1000) % 60);
            const minutes = Math.floor((ms / (1000*60)) % 60);
            const hours = Math.floor(((ms / (1000*60*60))) %24);
            return {hours, minutes, seconds};
        }

        const computeTracking = () => {
            const time = currentTracking.value ? new Date().getTime() - new Date(currentTracking.value.startTime).getTime() : null;
            if (time) {
                const {hours, minutes, seconds} = toTime(time);
                trackingTime.value = { 
                    hours: String(hours).padStart(2, '0'),
                    minutes: String(minutes).padStart(2, '0'),
                    seconds: String(seconds).padStart(2, '0')
                }
            }

            setTimeout(computeTracking, 1000);
        }
        if(tracking.value) {
            computeTracking();
        }

        return {
            loaded,
            trackingTime,
            projects,
            bigLayout,
            tracking,
            selectedProject,
            selectedTask,
            currentTracking,
            startTracking,
            stopTracking
        }

    }

}
</script>