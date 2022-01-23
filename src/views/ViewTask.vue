<template>
    <div class="max-w-screen-md px-4 py-10 mx-auto">
        <div v-if="statusMsg || errorMsg" class="mb-10 p-4 bg-secondary-light rounded-md shadow-lg">
            <p v-if="statusMsg" class="text-primary-light">{{statusMsg}}</p>
            <p v-if="errorMsg" class="text-red-500">{{errorMsg}}</p>
        </div>

        <div v-if="loaded" class="p-4 bg-secondary-light flex flex-col mt-5 items-center">
            <router-link :to="{name: 'ViewProject', params: { id: task.project}}"><div
            class="h-7 w-7 p-3 rounded-full flex justify-center items-center cursor-pointer
                border-2 border-transparent
            bg-primary-light shadow-lg text-white hover:text-primary-light hover:bg-white hover:border-primary-light" >
                <FaIcon icon="arrow-left" />
            </div>
            </router-link>

            <h1 class="text-2xl text-primary" >{{task.name}}</h1>
            <p>Done: <span :class="{ 'text-red-500' : !task.done, 'text-green-500': task.done}">{{task.done ? 'Yes' : 'No' }}</span></p>
            <b v-if="!task.done">Deadline: {{formatDate(new Date(task.deadline))}}</b>
            <hr class="sm:w-full border-1 border-primary"/>
            <div v-for="(tracking) in task.trackings" :key="tracking.id" class="flex flex-col gap-x-6 relative sm:flex-row w-full text-xl">
                    <div class="flex flex-2 flex-col md:w-1/3">
                        <label for="startTime" class="mb-1 text-sm text-primary-light">Start Time:</label>
                        <p>{{formatDate(new Date(tracking.startTime))}}</p>
                    </div>
                    <div class="flex flex-2 flex-col md:w-1/3">
                        <label for="deadline" class="mb-1 text-sm text-primary-light">End Time: </label>
                        <p>{{formatDate(new Date(tracking.endTime))}}</p>
                    </div>
                    <div class="flex flex-2 flex-col md:w-1/3">
                        <label for="deadline" class="mb-1 text-sm text-primary-light">Spent time:</label>
                        <p v-if="tracking.endTime">{{calculateTime(tracking.startTime, tracking.endTime)}}</p>
                    </div>

                    <hr class="sm:w-full sm:hidden md:hidden border-1 border-primary"/>
            </div>
            <hr/>

            <hr class="sm:w-full border-1 border-primary"/>
            <p v-if="task.trackings.length > 0" class="font-bold text-right">Total time spent: {{calculateTimeSpent(task.trackings)}}</p>
            <p v-else>You never spent time on this task...</p>
        </div>

    </div>
</template>

<script>
import { ref } from 'vue';
import { useRoute } from 'vue-router';
import { supabase } from '@/supabase/init';

export default {
    name: 'ViewTask',
    setup() {
        // Crete data 
        const loaded = ref(false);
        const task = ref(null);
        const errorMsg = ref(false);
        const route = useRoute();
        const id = route.params.id;
        
        const loadData = async () => {
            try {
                const {data, error} = await supabase.from('tasks').select('*, trackings (*)').eq('id', id);
                if (error) throw error;
                task.value = data[0];
                loaded.value = true;
            }catch(error) {
                errorMsg.value = `Error: ${error.message}`;
                setTimeout(() => errorMsg.value = false, 5000);
            }

        };
        loadData();

        const toTime = (ms) => {
            const seconds = Math.floor((ms / 1000) % 60);
            const minutes = Math.floor((ms / (1000*60)) % 60);
            const hours = Math.floor(((ms / (1000*60*60))) %24);
            return {hours, minutes, seconds};
        }

        const calculateDifference = (endTime, startTime) => {
            return new Date(endTime) - new Date(startTime);
        }

        const calculateTime = (startTime, endTime) => {
            const ms = new Date(endTime).getTime() - new Date(startTime).getTime()
            const { hours, minutes, seconds} = toTime(ms);
            return `${String(hours).padStart(2,'0')}:${String(minutes).padStart(2,'0')}:${String(seconds).padStart(2,'0')}`;
        };

        const formatDate = (date) => {
            return `${String(date.getDate()).padStart(2,'0')}.${String(date.getMonth()+1).padStart(2,'0')}.${date.getFullYear()} ${date.getHours()}:${date.getMinutes()}`;
        }

        const calculateTimeSpent = (trackings) => {
            const finishedTrackings = trackings.filter(it => it.endTime);

            if (finishedTrackings.length > 0) {
                const sum = finishedTrackings.map(it => calculateDifference(it.endTime, it.startTime))
                .reduce((pv,cv) => pv+cv);
                const { hours, minutes, seconds} = toTime(sum);
                return `${String(hours).padStart(2,'0')}:${String(minutes).padStart(2,'0')}:${String(seconds).padStart(2,'0')}`;
            }
            return 'None';
        }

        return {
            loaded,
            errorMsg,
            calculateTime,
            formatDate,
            calculateTimeSpent,
            task
        };

    }

}

</script>