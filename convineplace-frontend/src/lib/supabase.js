import { createClient } from '@supabase/supabase-js';
import toast from "svelte-french-toast";

import {
    loggedIn,
    loginModal,
    toastSettings,
    isAdmin,
    settings,
    userStore,
    timeLastScreenshot,
    userSearchResult,
    loadingAdmin,
    canvas as canvasStore,
    loading,

} from '$lib/states';
import {
    get
} from 'svelte/store';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
const webhook = import.meta.env.VITE_DISCORD_WEBHOOK_URL;

export const supabaseFunction = () => {

    let user = undefined;

    const supabaseObj = createClient(supabaseUrl, supabaseAnonKey);;
    const supabase = supabaseObj;

    const onLogin = async () => {
        loggedIn.set(true);
        //console.log("onLogin");
        const {
            data
        } = await supabase.auth.getUser();
        //console.log("data", data);
        user = data.user;

        //console.log("user", user);

        try {
            const {
                data,
                error
            } = await supabase
                .from('profiles')
                .select('*')
                .eq('user_id', user.id)
                .single()
                .throwOnError();

            //console.log("profile", data);

            user.profile = data;
            userStore.set(user);
        } catch (error) {
            //console.log(error);
        }

        //console.log(user);
        if (user.profile.status_banned) {
            toast.error("Your account has been banned.", {
                duration: 3000,
                position: 'top-right',
            });
            sendDiscordMessage("User " + user.profile.username + " tried to log in, but is banned.");
            logout();
            return;
        }

        loginModal.set(false);
        if (user.profile.status_admin) {
            if (get(isAdmin)) {
                return;
            }
            isAdmin.set(true);
            toast.success("Logged in as admin", toastSettings);
            sendDiscordMessage("User " + user.profile.username + " logged in as admin.");
            return;
        }

        toast.success("Logged in", toastSettings);
        return;
    };


    const fetchSettings = async () => {
        toast.error("Not yet implemented", toastSettings);

        try {
            const {
                data,
                error
            } = await supabase.from('settings').select('*').throwOnError();
            //console.log("settings", data);
            settings.set(data);
        } catch (error) {
            //console.log(error);
        }


    };

    const login = async (email, password) => {
        const {
            data,
            error
        } = await supabase.auth.signInWithPassword({
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

    const toggleBan = async (profile_id) => {
        try {
            const {
                data,
                error
            } = await supabase.from('profiles').update({
                status_banned: !get(userSearchResult).status_banned
            }).eq('profile_id', profile_id).single().throwOnError();
            //console.log("toggleBan", data);
            if (get(userSearchResult).status_banned) {
                const userSD = get(userSearchResult);
                userSD.status_banned = false;
                userSearchResult.set(userSD);
                toast.success("User unbanned", toastSettings);
            } else {
                const userSD = get(userSearchResult);
                userSD.status_banned = true;
                userSearchResult.set(userSD);
                toast.success("User banned", toastSettings);
            }
            sendDiscordMessage("User " + getUser().profile.username + " banned user " + get(userSearchResult.username) + ".");
        } catch (error) {
            console.log(error);
            toast.error(error.message, toastSettings);
        }
    };

    const toggleAdmin = async (profile_id) => {
        try {
            const {
                data,
                error
            } = await supabase.from('profiles').update({
                status_banned: !get(userSearchResult).status_admin
            }).eq('profile_id', profile_id).single().throwOnError();
            //console.log("toggleBan", data);
            if (get(userSearchResult).status_admin) {
                const userSD = get(userSearchResult);
                userSD.status_admin = false;
                userSearchResult.set(userSD);
                toast.success("Revoke admin perms", toastSettings);
            } else {
                const userSD = get(userSearchResult);
                userSD.status_admin = true;
                userSearchResult.set(userSD);
                toast.success("User made admin", toastSettings);
            }
            sendDiscordMessage("User " + getUser().profile.username + " made user " + get(userSearchResult.username) + " an admin.");
        } catch (error) {
            console.log(error);
            toast.error(error.message, toastSettings);
        }
    };

    const searchUser = async (username) => {
        loadingAdmin.set(true);
        try {
            const {
                data,
                error
            } = await supabase.from('profiles').select('*').eq('username', username).single().throwOnError();
            console.log("searchUser Result", data);
            userSearchResult.set(data);
            loadingAdmin.set(false);
            return data;
        } catch (error) {
            if (error.code === "PGRST116") {
                toast.error("User not found", toastSettings);
                console.log(error);
            }
            else {
                toast.error(error.message, toastSettings);
            }
            console.log(error);
            return;
        }
            
    };

    const searchUUID = async (uuid) => {
        loadingAdmin.set(true);
        try {
            const {
                data,
                error
            } = await supabase.from('users').select('*').eq('user_id', uuid).single().throwOnError();
            console.log("searchUUID Result", data);
            uuidSearchResult.set(data);
            loadingAdmin.set(false);
            return data;
        } catch (error) {
            if (error.code === "PGRST116") {
                toast.error("User not found", toastSettings);
                console.log(error);
            }
            else {
                toast.error(error.message, toastSettings);
            }
            console.log(error);
            return;
        }
    };

    const sendDiscordMessage = async (message) => {
        const params = {
            content: message,
            username: 'logs',
            avatar_url: 'https://cdn.discordapp.com/attachments/436874647787667456/1144856415186460783/pixil-frame-0.png',
        };

        //console.log(params);
        try {
            const request = new XMLHttpRequest();
            request.open(
                'POST',
                webhook,
            );
            request.setRequestHeader('Content-type', 'application/json');
            //console.log(JSON.stringify(params));
            request.send(JSON.stringify(params));
        } catch (error) {
            //console.log(error);
        }
    };

    const sendCanvas = async (canvasElement) => {
        let imageURL = '';
        const localCanvas = canvasElement;
        try {
            const dataURL = localCanvas.toDataURL('image/png');


            const blob = await (await fetch(dataURL)).blob();
            const {
                data,
                error,
                url,
                urlError
            } = await uploadImage(blob);

            if (error || urlError) {
                //console.log('error trying to upload image', error);
                //console.log('error tying to get url', urlError);
                toast.error(error.message, toastSettings);
                return;
            }

            if (data && url) {
                imageURL = url.publicUrl;
                //console.log('updating image path', imageURL);
            } else {
                //console.log('Data is undefined or does not have a path property.');
            }
        } catch (error) {
            //console.log('An error occurred:', error);
            toast.error(error.message, toastSettings);
        }
        //console.log(get(userStore));
        user = get(userStore);
        const params = {
            content: 'New screenshot at ' + Date.now() + ', by ' + user.profile.username,
            username: 'logs',
            avatar_url: 'https://cdn.discordapp.com/attachments/436874647787667456/1144856415186460783/pixil-frame-0.png',
            embeds: [{
                id: 34702293,
                fields: [],
                image: {
                    url: imageURL
                }
            }]
        };

        //console.log(params);
        try {
            const request = new XMLHttpRequest();
            request.open(
                'POST',
                webhook,
            );
            request.setRequestHeader('Content-type', 'application/json');
            //console.log(JSON.stringify(params));
            request.send(JSON.stringify(params));
        } catch (error) {
            //console.log(error);
        }
    };

    const uploadImage = async (file) => {
        try {
            const filename = "public/" + Date.now() + '-' + "canvas.png";
            const {
                data,
                error
            } = await supabase.storage
                .from('images')
                .upload(filename, file, {
                    contentType: 'image/png'
                });

            if (error) {
                console.error("Error uploading image:", error);
                throw error;
            }

            //console.log("Uploaded image", data);
            toast.success("Image uploaded", toastSettings);

            const {
                data: url,
                error: urlError
            } = supabase.storage
                .from('images')
                .getPublicUrl(filename);
            //console.log("url", url);

            return {
                data,
                error,
                url,
                urlError
            };
        } catch (error) {
            console.error("An error occurred during the upload:", error);
            return {
                data: null,
                error,
                url: null
            };
        }
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
            const {
                data,
                error
            } = await supabase.auth.signUp({
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
        sendDiscordMessage("User " + username + " created an account.");
    };

    const createProfile = async (id, username) => {
        //console.log("createProfile", id, username);
        try {
            const {
                data,
                error
            } = await supabase.from('profiles').insert([{
                user_id: id,
                username: username,
                status_admin: false,
                status_banned: false,
            }]).select().single();
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
        return get(userStore);
    };

    
    return {
        supabase,
        login,
        logout,
        signup,
        user,
        getUser,
        onLogin,
        fetchSettings,
        uploadImage,
        sendCanvas,
        searchUser,
        toggleBan,
        toggleAdmin,
        searchUUID
    };
};