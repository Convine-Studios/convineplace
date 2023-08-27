import { writable }from 'svelte/store';

export const userStore = writable(null);
export const canvas = writable({});

export const loading = writable(true);
export const creatingProfile = writable(false);

export const selectedColor = writable('#ff4500');
export const canvasElement = writable(null);

export const loginModal = writable(false);
export const signupModal = writable(false);
export const profileModal = writable(false);
export const adminModal = writable(false);

export const hoveredPixelX = writable(0);
export const hoveredPixelY = writable(0);

export const timeLastScreenshot = writable(0);
export const timeLastPixel = writable(0);

export const loggedIn = writable(false);
export const isAdmin = writable(false);

export const toastSettings = {
    duration: 3000,
    position: 'top-right',
};

export const settings = writable([]);

export const colors = writable([
    '#ff4500',
    '#ffa800',
    '#ffd635',
    '#00a368',
    '#7eed56',
    '#2450a4',
    '#3690ea',
    '#51e9f4',
    '#811e9f',
    '#b44ac0',
    '#ff99aa',
    '#9c6926',
    '#000000',
    '#898d90',
    '#d4d7d9',
    '#ffffff'
]);