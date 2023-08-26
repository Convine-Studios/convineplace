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
        //console.log("onLogin");
        const { data } = await supabase.auth.getUser();
        user = data.user;
        //console.log("user", user);

        try {
            const {data, error} = await supabase
                .from('profiles')
                .select('*')
                .eq('user_id', user.id)
                .single()
                .throwOnError();

            //console.log("profile", data);

            user.profile = data;
        } catch (error) {
            //console.log(error);
        }

        //console.log(user);
        if (user.profile.status_banned) {
            toast.error("Your account has been banned.", {
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
        //console.log("Logged in", data);
        user = data.user;
        return;
    };

    const logout = async () => {
        await supabase.auth.signOut();
        user = undefined;
        loggedIn.set(false);
        isAdmin.set(false);
        //console.log("logged out");
    }

    const signup = async (email, password, username) => {

        try {
            const { data, error } = await supabase.auth.signUp({
            email: email,
            password: password
        });
        //console.log("data", data);
        user = data.user;
        //console.log("user", user);
        if (error) {
            //console.log("error", error);
            toast.error(error.message);
            throw error;
        }
        
        //console.log("Create user", user);
        } catch (error) {
            //console.log(error);
            return;
        }
        
        toast.success("Account created", toastSettings);
        createProfile(user.id, username);
        login(email, password);
    };

    const createProfile = async (id, username) => {
        //console.log("createProfile", id, username);
        try {
            const { data, error } = await supabase.from('profiles').insert([
            { 
                user_id: id,
                username: username,
                status_admin: false,
                status_banned: false,
            }
        ]).select().single();
        //console.log("added profile", data);
        user.profile = data;
        if (error) {
            throw error;
        }
        } catch (error) {
            //console.log(error);
        }
       
        //console.log("Create profile", data);
        
        loggedIn.set(true);
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
