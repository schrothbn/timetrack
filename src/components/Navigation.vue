<template>
    <header class="bg-primary-light text-white">
        <nav class="containter py-5 px-4 flex flex-column gap-4 items-center sm:flex-row">
            <div class="flex items-center gap-x-4">
                <h1 class="w-14 text-lg cursor-pointer hover:text-primary">TimeTrack</h1>
            </div>
            <ul class="flex flex-1 justify-end gap-x-10">
                <Tracker v-if="user" layout="small"/>
                <router-link class="cursor-pointer hover:text-primary" :to="{name: 'Home'}">Projects</router-link>
                <router-link class="cursor-pointer hover:text-primary" v-if="user" :to="{name: 'Tracker'}">Track</router-link>
                <router-link class="cursor-pointer hover:text-primary" v-if="!user" :to="{name: 'Login'}">Login</router-link>
                <router-link class="cursor-pointer hover:text-primary" v-if="!user" :to="{name: 'Register'}">Register</router-link>
                <li class="cursor-pointer hover:text-primary" v-if="user" @click="doLogout">Logout</li>
            </ul>
        </nav>
    
    </header>
</template>

<script>
import { computed } from 'vue'
import { useRouter } from 'vue-router';
import { supabase } from '@/supabase/init';
import store from '@/store/'
import Tracker from '@/components/Tracker.vue';

export default {
    components: {
        Tracker
    },
    setup() {
        // Get user from store

        const user = computed(() => store.state.user);

        // Setup ref to router
        const router = useRouter();
        
        // Logout function
        const doLogout = async () => {
            const {error} = await supabase.auth.signOut();
            router.push({name: 'Login'});
        };

        return {
            user,
            doLogout
        }
    }
}
</script>