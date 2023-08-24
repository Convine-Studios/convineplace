import { writable }from 'svelte/store';

export const user = writable(null);
export const canvas = writable({});

export const loading = writable(true);

export const selectedColor = writable('#ff4500');

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