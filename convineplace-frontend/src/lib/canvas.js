import { supabaseFunction } from '$lib/supabase.js';
import { canvas as canvasStore } from '$lib/states.js';
import { loading } from '$lib/states.js';
import toast from 'svelte-french-toast';

const { supabase, getUser } = supabaseFunction();

export const canvasFunction = () => {

    const channel = supabase.channel('table_db_changes');


    const loadCanvas = async () => {
		const { data, error } = await supabase.from('pixels').select('*');
		if (error) {
			console.error('Error getting canvas', error);
			return;
		}
		const newCanvas = {};
		data.forEach((pixel) => {
			newCanvas[pixel.id] = pixel.color;
		});
		canvasStore.set(newCanvas);
        loading.set(false);
	};

    const subscribeToCanvasChanges = () => {
		//console.log('subscribing to canvas changes');
    channel
		.on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'pixels' }, (payload) => {
			//console.log('canvas change', payload);
			const { id, color } = payload.new;
			canvasStore.update(arr => {
				arr[id] = color;
				return arr;
			})
		})
		.subscribe();
    };

	const updatePixel = async (id, color) => {
		if (!getUser()) {
			toast.error('Something went teribly wrong! Im sorry </3', toastSettings);
			return;
		}


		try {
			const { data, error } = await supabase
			.from('pixels')
			.update({ color: color,
				last_updated_by: getUser().id,
			 })
			.eq('id', id)
			.throwOnError();
		} catch (error) {
			////console.log(error);
		}
		
	};

    return {
        loadCanvas,
        subscribeToCanvasChanges,
		updatePixel
    };
};