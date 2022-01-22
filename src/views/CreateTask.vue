<template>
    <div class="max-w-screen-md mx-auto px-4 py-10">
        <!-- Status Message  -->
        <div v-if="statusMsg || errorMsg" class="mb-10 p-4 bg-secondary-light rounded-md shadow-lg">
            <p class="text-primary-light">{{statusMsg}}</p>
            <p class="text-red-500">{{errorMsg}}</p>
        </div>

        <!-- Input Form  -->
        <div class="p-8 flex items-start bg-secondary-light rounded-md shadow-lg">
            <form @submit.prevent="" class="flex flex-col gap-y-5 w-full">
                <h1 class="text-2xl text-primary-light">Create task type</h1>

                <div class="flex flex-col">
                    <label for="task-name" class="mb-1 text-sm text-primary-light">Task Name</label>
                    <input type="text" class="p-2 text-gray-500 focus:outline-none" v-model="taskName" required id="task-name" />
                </div>

                <div class="flex flex-col">
                    <label for="project" class="mb-1 text-sm text-primary-light">Task Type</label>
                    <select name="project" id="project" class="bg-white text-gray-500 focus:outline-none p-2" v-model="projectId">
                        <option value="None">None</option>
                        <option v-for="project in projects" :value="project.id">{{project.name}}</option>
                    </select>
                </div>

                <button type="submit" class="bg-primary-light text-white 
                border-2 border-transparent
                hover:border-primary-light hover:bg-white hover:text-primary-light">Submit</button>

            </form>
        </div>
        
    </div>
</template>

<script>
import { ref } from 'vue'
import store from '@/store/index'
import { supabase } from '@/supabase/init'

export default {
    name: 'Create',
    setup() {
        // Create data
        const user = store.state.user;
        const taskName = ref('');
        const projectId = ref(null);
        const projects = ref([]);
        const loaded = ref(false);
        const statusMsg = ref(null);
        const errorMsg = ref(null);

        
        const getProjects = async () => {
            try {
                const { data, error} = await supabase.from("projects").select('*');
                if (error) throw error;
                console.log('Data got')
                console.log(data);
                projects.value = data;
                loaded.value = true;
            } catch (error) {
                console.warn(error)
            }
        }

        getProjects();
        // Add task
        const addTask = async () => {
            try {
                const {error} = await supabase.from('tasks').insert({
                    taskName: taskName.value,
                    project: project.value,
                    user: user.id
                })
                if(error) throw error

                statusMsg.value = 'Success: Task created';
                taskName.value = null;
                taskType.value = 'Work';
            } catch (error) {
                errorMsg.value = `Error ${error.message}`;
                setTimeout(() => errorMsg.value = null, 5000);
            }

        };

        return {
            taskName,
            projectId,
            projects,
            statusMsg,
            errorMsg,
            addTask
        };
    }
};
</script>