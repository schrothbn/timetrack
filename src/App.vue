<template>
  <div v-if="appReady" class="min-h-full font-Domine box-border">
    <Navigation />
    <router-view/>
  </div>
</template>

<script>
// This starter template is using Vue 3 <script setup> SFCs
// Check out https://v3.vuejs.org/api/sfc-script-setup.html#sfc-script-setup
import Navigation from './components/Navigation.vue'
import { ref } from 'vue'
import { supabase } from '@/supabase/init'
import store from '@/store/'

export default {
  components: {
    Navigation
  },
  setup() {
    // Create data / vars
    const appReady = ref(null);

    // Check to see if user is already logged in
    const user = supabase.auth.user();

    // If user does not exist, need to make app ready
    if (!user) {
      appReady.value = true;
    }

    const initTracking = async () => {
      if (store.state.user) {
        const userId = store.state.user.id;
        try {
          const { data, error} = await supabase.from('projects')
          .select('tasks ( trackings!inner(*))')
          .eq('user', userId)
          .is('tasks.trackings.endTime', null);
          if (error) throw error
          if (data) {
            console.log(data);
            store.methods.startTracking(data[0].tasks[0].trackings[0].id);
          }

        } catch(error) {
          console.warn(error.message)
        }
      } else {
        store.methods.stopTracking();
      }

    }

    // Runs when there is an auth state change and
    // If user is logged in, this will fire
    supabase.auth.onAuthStateChange((_, session) => {
      store.methods.setUser(session);
      initTracking()
      appReady.value = true;
    });

    return {
      appReady
    };

  } 
}
</script>

<style lang="scss">
@import url("https://fonts.googleapis.com/css?family=Poppins:wght@100;200;300;400;500;600;700&display=swap");
@import url('https://fonts.googleapis.com/css2?family=Domine:wght@400;500;600;700&display=swap');
</style>
