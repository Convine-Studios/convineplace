import { writable }from 'svelte/store';

export const user = writable(null);
export const canvas = writable({});

export const loading = writable(true);

export const selectedColor = writable('#ff4500');