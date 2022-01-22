<template>
    <div class="max-w-screen-md mx-auto px-4 py-10">
        <!-- Status Message  -->
        <div v-if="statusMsg || errorMsg" class="mb-10 p-4 bg-secondary-light rounded-md shadow-lg">
            <p class="text-primary-light">{{statusMsg}}</p>
            <p class="text-red-500">{{errorMsg}}</p>
        </div>

        <!-- Input Form  -->
        <div class="p-8 flex items-start bg-secondary-light rounded-md shadow-lg">
            <form @submit.prevent="createProject" class="flex flex-col gap-y-5 w-full">
                <h1 class="text-2xl text-primary-light">Create Project</h1>

                <div class="flex flex-col">
                    <label for="project-name" class="mb-1 text-sm text-primary-light">Project Name</label>
                    <input type="text" class="p-2 text-gray-500 focus:outline-none" v-model="projectName" required id="project-name" />
                </div>
                <div class="flex flex-col">
                    <label for="project-description" class="mb-1 text-sm text-primary-light">Description</label>
                    <input type="text" class="p-2 text-gray-500 focus:outline-none" v-model="projectDescription" required id="project-description" />
                </div>


                <button type="submit" class="bg-primary-light text-white 
                border-2 border-transparent
                hover:border-primary-light hover:bg-white hover:text-primary-light">Submit</button>

            </form>
        </div>
        
    </div>

</template>

<script>
import {ref} from 'vue';
import store from '@/store/index'
import { supabase } from '@/supabase/init'

export default {
    name: 'CreateProject',
    setup() {
        const errorMsg = ref(null);
        const statusMsg = ref(null);
        const projectName = ref('');
        const projectDescription = ref('');
        const user = store.state.user;


        const createProject = async () => {
            try {
                const {error} = await supabase.from('projects').insert({
                    name: projectName.value,
                    description: projectDescription.value,
                    user: user.id
                });
                if (error) throw error;

                statusMsg.value = 'Success: project was created!';
                projectName.value = '';
                projectDescription.value ='';
                setTimeout(() => statusMsg.value = null, 5000);

            } catch (error) {
                errorMsg.value = `Error ${error.message}`;
                setTimeout(() => errorMsg.value = null, 5000);
            }
        }

        return {
            projectName,
            projectDescription,
            statusMsg,
            errorMsg,
            createProject
        };
    }
}
</script>