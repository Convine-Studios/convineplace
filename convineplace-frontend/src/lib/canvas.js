import { supabase } from '$lib/supabase.js';
import { canvas as canvasStore } from '$lib/states.js';

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
	};

    const subscribeToCanvasChanges = () => {
    channel
		.on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'pixels' }, (payload) => {
			const { id, color } = payload.new;
			canvasStore.update((currentCanvas) => {
				currentCanvas[id] = color;
				return { ...currentCanvas };
			});
		})
		.subscribe();
    };

	
    return {
        loadCanvas,
        subscribeToCanvasChanges
    };
};