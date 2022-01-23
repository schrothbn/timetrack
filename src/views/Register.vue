<template>
    <div class="max-w-screen-sm mx-auto px-4 py-10">
        <!-- Error Handling -->
        <div v-if="errorMsg" class="mb-10 p-4 rounded-md bg-secondary-light shadow-lg">
            <p class="text-red-500">{{errorMsg}}</p>
        </div>
        <!-- Registration Form -->
        <form class="p-8 flex flex-col bg-secondary-light rounded-md shadow-lg" @submit.prevent="doRegister">
            <h1 class="text-3xl text-primary-light mb-4">Register</h1>

            <div class="flex flex-col mb-2">
                <label for="email" class="mb-1 text-sm text-primary-light">E-Mail:</label>
                <input id="email" v-model="email" type="text" class="p-2 text-gray-500 focus:outline-none" required />
            </div>
            <div class="flex flex-col mb-2">
                <label for="password" class="mb-1 text-sm text-primary-light">Password:</label>
                <input id="password" v-model="password" type="password" class="p-2 text-gray-500 focus:outline-none" required />
            </div>
            <div class="flex flex-col mb-2">
                <label for="confirmPassword" class="mb-1 text-sm text-primary-light">Confirm Password:</label>
                <input id="confirmPassword" v-model="confirmPassword" type="password" class="p-2 text-gray-500 focus:outline-none" required />
            </div>

            <button
type="submit" class="mt-6 py-2 px-6 rounded-sm self-start text-sm text-white bg-primary-light duration-200 border-solid border-2 
            border-transparent
            hover:border-primary-light hover:bg-white hover:text-primary-light">Register</button>

            <router-link :to="{name: 'Login'}" class="text-center text-sm mt-6">
            Already have an account? <span class="text-primary-light">Login</span></router-link>
        </form>
    </div>
</template>

<script>
import { ref } from 'vue'
import { supabase } from '@/supabase/init'
import { useRouter } from 'vue-router'
export default {
    name: 'RegisterPage',
    setup() {
        // Create data / vars
        const router = useRouter();
        const email = ref(null);
        const password = ref(null);
        const confirmPassword = ref(null);
        const errorMsg = ref(null);
        // Register function

        const doRegister= async () => {
            if (confirmPassword.value === password.value) {
                try {
                    let {error} = await supabase.auth.signUp({
                        email: email.value,
                        password: password.value
                    });
                    if (error) throw error;
                    router.push({name: 'Login'});
                    return;
                } catch (error) {
                    errorMsg.value = error.message;

                }
            } else {
                errorMsg.value = 'Error: Passwords do not match!';
            }

            setTimeout(() => errorMsg.value = null, 5000);
        };

        return {
            email,
            password,
            confirmPassword,
            errorMsg,
            doRegister
        };
    }
}
</script>