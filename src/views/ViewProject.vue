<template>
    <div class="max-w-screen-md mx-auto px-4 py-10">
        <!-- App Msg -->
        <div v-if="statusMsg || errorMsg" class="mb-10 p-4 bg-secondary-light rounded-md shadow-lg">
            <p v-if="statusMsg" class="text-primary-light">{{statusMsg}}</p>
            <p v-if="errorMsg" class="text-red-500">{{errorMsg}}</p>
        </div>

        <!-- Project data -->
        <div v-if="dataLoaded">
            <!-- Project info -->
            <div  class="flex flex-col p-4 bg-secondary-light rounded-md shadow-lg items-center relative">
                <div v-if="user && project.user == user.id" class="flex absolute left-2 top-2 gap-x-2">
                    <div
class="h-7 w-7 p-3 rounded-full flex justify-center items-center cursor-pointer
                        border-2 border-transparent
                    bg-primary-light shadow-lg text-white hover:text-primary-light hover:bg-white hover:border-primary-light" @click="editMode" >
                        <FaIcon icon="edit" />
                    </div>
                    <div
class="h-7 w-7 p-3 rounded-full flex justify-center items-center cursor-pointer
                        border-2 border-transparent
                    bg-primary-light shadow-lg text-white hover:text-primary-light hover:bg-white hover:border-primary-light" @click="updateProject" >
                        <FaIcon icon="save" />
                    </div>
                    <div
class="h-7 w-7 p-3 rounded-full flex justify-center items-center cursor-pointer
                        border-2 border-transparent
                    bg-primary-light shadow-lg text-white hover:text-primary-light hover:bg-white hover:border-primary-light" @click="deleteProject" >
                        <FaIcon icon="trash" />
                    </div>

                </div>
                <input v-if="edit" v-model="project.name" type="text" class="mt-7 p-2 w-full text-gray-500 focus:outline-none">
                <h1 v-else class="mt-6 text-primary-light text-2xl">{{project.name}}</h1>
                <input v-if="edit" v-model="project.description" type="text" class="mt-2 p-2 w-full text-gray-500 focus:outline-none">
                <p v-else class="mt-2 text-primary-light text-sm">{{project.description}}</p>

            </div>
            <!-- Task info -->
            <div class="mt-10 p-8 rounded-md shadow-md flex flex-col items-start bg-secondary-light">
                <h1 class="text-primary-light text-2xl">Tasks</h1>
                <hr class="w-full border-1 border-primary"/>
                <div v-for="(task,idx) in tasks" :key="idx" class="flex flex-col gap-x-6 relative sm:flex-row w-full">
                    <div class="flex flex-2 flex-col md:w-1/3">
                        <label for="task-name" class="mb-1 text-sm text-primary-light">Name</label>
                        <input v-if="edit" id="task-name" v-model="task.name" type="text" class="text-gray-500 w-full focus:outline-none" />
                        <router-link v-if="!edit && task.id" :to="{name: 'ViewTask', params: { id: task.id }}">{{task.name}}</router-link>
                        <p v-else >{{task.name}}</p>
                    </div>
                    <div class="flex flex-1 flex-col">
                        <label for="done" class="mb-1 text-sm text-primary-light">Done</label>
                        <input v-if="edit" id="done" v-model="task.done" type="checkbox" class="text-gray-500 w-full focus:outline-none" />
                        <p v-else :class="{ 'text-red-500' : !task.done, 'text-green-500' : task.done}" >{{task.done ? 'Yes' : 'No'}}</p>
                    </div>
                    <div class="flex flex-2 flex-col md:w-1/3">
                        <label for="deadline" class="mb-1 text-sm text-primary-light">Deadline</label>
                        <input v-if="edit" id="deadline" v-model="task.deadline" type="datetime-local" class="text-gray-500 w-full focus:outline-none" />
                        <p v-else >{{task.deadline}}</p>
                    </div>

                    <FaIcon v-if="edit" icon="trash" class="text-primary-light absolute h-4 w-auto -left-5 hover:text-black cursor-pointer" @click="deleteTask(idx)"/>
                    <hr class="sm:w-full sm:hidden md:hidden border-1 border-primary"/>
                </div>
                <button v-if="edit" type="button" class="mt-6 px-2 py-3 bg-primary-light text-white border-2 border-transparent rounded-md shadow-lg hover:text-primary-light hover:bg-white hover:border-primary-light" @click="addTask">Add new task</button>
            </div>
        </div> 
    </div>
</template>

<script>
import { ref, computed } from 'vue'
import { supabase } from '@/supabase/init';
import { useRoute, useRouter } from 'vue-router';
import store from '@/store/index'

export default {
    name : 'ViewProject',
    setup() {
        // Create data / vars
        const project = ref(null);
        const tasks = ref(null);
        const dataLoaded = ref(null);
        const errorMsg = ref(null);
        const statusMsg = ref(null);
        const route = useRoute();
        const router = useRouter();
        const user = computed(() => store.state.user);

        // Get current Id from route
        const id = route.params.id;

        // Get project data
        const loadData = async () => {
            try {
                dataLoaded.value = false;
                const {data, error} = await supabase.from('projects').select('*').eq('id', id);
                if (error) throw error;
                const {data:taskData, taskError} = await supabase.from('tasks').select('*').eq('project', id);
                if (taskError) throw taskError;
                project.value = data[0];
                tasks.value = taskData;
                dataLoaded.value = true;
                console.log(data);
            } catch (error) {
                errorMsg.value = error.message;
                setTimeout(() => errorMsg.value = false, 5000);
            }
        }

        loadData()
        // Delete project
        const deleteProject = async () => {
            try {
                const {error } = await supabase
                    .from('projects')
                    .delete()
                    .eq('id', id)
                if (error) throw error;
                router.push({name: 'Home'});
            } catch(error) {
                errorMsg.value = `Error: ${error.message}`;
                setTimeout(() => {
                    errorMsg.value = false;
                }, 5000);
            }

        }

        // Edit mode
        const edit = ref(null);
        
        const editMode = () => {
            edit.value = !edit.value;
        };

        // Add task
        const addTask = () => {
            tasks.value.push({
                name: '',
                done: false,
                deadline: null, 
                project: id,
            });
        };
        // Delete task
        const deleteTask =  async (idx) => {
            try {
                const id = tasks.value[idx].id;
                if (id) {
                    const { error } = await supabase.from('tasks').delete().eq('id', id);
                    if (error) throw error;
                }

                tasks.value.splice(idx, 1);
            } catch (error) { 
                errorMsg.value = `Can't delete task: ${error.message}`;
                setTimeout(() => {
                    errorMsg.value = false;
                }, 5000);
            }
        };

        // Update project
        const updateProject = async () => {
            try {
                // Tasks with an id are already saved to database
                const updatableTasks = tasks.value.filter(it => it.id);
                // Tasks without an id are not in db yet
                const insertableTasks = tasks.value.filter(it => !it.id);
                // Upsert existing tasks
                const {error: updateError} = await supabase.from('tasks').upsert(updatableTasks);
                if (updateError) throw updateError;
                // Insert non-existing tasks
                const {error: insertError} = await supabase.from('tasks').insert(insertableTasks);
                if (insertError) throw insertError;
                // Update the root object (project)
                const {error: projError} = await supabase.from('projects').update(project.value).eq('id', project.value.id);
                if (projError) throw projError;
                statusMsg.value = 'Project updated';
                setTimeout(() => {
                    statusMsg.value = false;
                }, 5000);
                // Reload data
                edit.value = false;
                loadData();
            } catch(error) {
                errorMsg.value = `Error: ${error.message}`;
                setTimeout(() => {
                    errorMsg.value = false;
                }, 5000)
            }
            

        }


        return {
            dataLoaded,
            project,
            tasks,
            errorMsg,
            statusMsg,
            user,
            edit,
            editMode,
            addTask,
            deleteTask,
            deleteProject,
            updateProject,
        }

    }

}
</script>