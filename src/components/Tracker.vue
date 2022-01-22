<template>
    <div v-if="layout == 'big'" class="max-w-md bg-secondary-light py-4 px-2 text-center mx-auto shadow-lg rounded-md">

        <h1 class="text-2xl text-primary-light">Tracker</h1>
        <form @submit.prevent="" class="flex flex-col gap-y-4 w-full" v-if="!tracking">
            <select name="project" class="bg-white text-primary" v-model="selectedProject">
                <option v-for="project in projects" :value="project.id">{{project.name}}</option>"
            </select>
            <select name="task" v-if="selectedProject">
                <option></option>

            </select>
        </form>
        <div v-if="tracking" class="flex flex-row gap-4 items-center">
            <h1>Time</h1>
            <fa icon="pause-circle" v-if="tracking" @click="pauseTracking" class="cursor-pointer text-primary text-4xl hover:text-white"/>
            <fa icon="stop-circle" v-if="tracking" @click="stopTracking" class="cursor-pointer text-primary text-4xl hover:text-white"/>
        </div>
    </div>
    <div v-else class="flex flex-row gap-4 items-center">
        <fa icon="play-circle" v-if="!tracking" @click="startTracking" class="cursor-pointer text-primary font-bold text-xl hover:text-white"/>
        <fa icon="pause-circle" v-if="tracking" @click="pauseTracking" class="cursor-pointer text-primary text-xl hover:text-white"/>
        <fa icon="stop-circle" v-if="tracking" @click="stopTracking" class="cursor-pointer text-primary text-xl hover:text-white"/>
    </div>
</template>

<script>
import { ref } from 'vue'
import store from '@/store/index'
export default {
    name: 'tracker',
    props: {
        layout: {
            default: 'big',
            type: String,
            required: true
        },
    },
    setup(props) {
        const layout = props.layout;
        const tracking = ref(store.state.tracking);
        const selectedProject = ref(null);


        const startTracking = () => {
            console.log('Started tracking')
            store.methods.startTracking();
            tracking.value = store.state.tracking;
        }

        return {
            layout,
            tracking,
            selectedProject,
            startTracking
        }

    }

}
</script>