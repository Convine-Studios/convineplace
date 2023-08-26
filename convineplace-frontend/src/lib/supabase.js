import { createClient } from '@supabase/supabase-js';
import toast from "svelte-french-toast"; 

import { loggedIn, loginModal, toastSettings, isAdmin } from '$lib/states';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY; 

export const supabaseFunction = () => {

    const supabase = createClient(supabaseUrl, supabaseAnonKey);

    let user = undefined;

    const onLogin = async () => {
        loggedIn.set(true);
        console.log("onLogin");
        const { data } = await supabase.auth.getUser();
        user = data.user;
        console.log("user", user);

        try {
            const {data, error} = await supabase
                .from('profiles')
                .select('*')
                .eq('user_id', user.id)
                .single()
                .throwOnError();

            console.log("profile", data);

            user.profile = data;
        } catch (error) {
            console.log(error);
        }

        console.log(user);
        if (user.profile.status_banned) {
            toast.error("Your accound has been banned.", {
                duration: 3000,
                position: 'top-right',
            });
            logout();
            return;
        }
        
        loginModal.set(false);
        if (user.profile.status_admin) {
            toast.success("Logged in as admin", toastSettings);
            isAdmin.set(true);
            return;
        }
        
        toast.success("Logged in", toastSettings);
        return;
    };


    const login = async (email, password) => {
        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password
        });
        if (error) {
            toast.error(error.message);
            throw error;
        }
        console.log("Logged in", data);
        user = data.user;
        return;
    };

    const logout = async () => {
        await supabase.auth.signOut();
        user = undefined;
        loggedIn.set(false);
        console.log("logged out");
    }

    const signup = async (email, password, username) => {
        const { data, error } = await supabase.auth.signUp({
            email,
            password
        });
        if (error) {
            toast.error(error.message, toastSettings);
            throw error;
        }
        data.user = user;
        console.log("Create user", user);
        toast.success("Account created", toastSettings);
        createProfile(user.id, username);
        login(email, password);
    };

    const createProfile = async (id, username) => {
        const { data, error } = await supabase.from('profiles').insert([
            { user_id: id,
            username: username,
            status_admin: false,
            status_banned: false,
        }]);
        if (error) {
            throw error;
        }
        console.log("Create profile", data);
        user.profile = data;
    };

    const getUser = () => {
        return user;
    };

    return {
        supabase,
        login,
        logout,
        signup,
        user,
        getUser,
        onLogin
    };
};
