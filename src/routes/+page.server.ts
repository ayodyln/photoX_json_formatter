/** @type {import('./$types').Actions} */
export const actions = {
	formatJSON: async ({ request }) => {
		const data = await request.formData();
		try {
			console.log(data);
			return { ok: true, json: JSON.stringify(data) };
		} catch (error) {
			return { ok: false, error };
		}
	}
};

/**
 * Structure FormData into a JSON object
 * @deprecated This function is not used in the current implementation
 * @param data FormData
 * @returns {object}
 */
function structureFD(data: FormData) {
	const tree: {
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		[key: string]: any;
	} = {};

	for (const [k, v] of data.entries()) {
		const [id, label, index] = k.split('-');

		// Check if the day exists in the array
		if (!tree[`Day-${id}`]) tree[`Day-${id}`] = {} as { [key: string]: unknown };

		// Add date to the day object & define events array
		if (label === 'date') {
			tree[`Day-${id}`].date = v;
			tree[`Day-${id}`].events = [];
		}

		// Add events to the day object
		if (label === 'label' && !tree[`Day-${id}`].events[index]) {
			tree[`Day-${id}`].events[index] = {
				label: v,
				time: [data.get(`${id}-event_startDate-${index}`), data.get(`${id}-event_endDate-${index}`)]
			};
		}
	}

	return tree;
}
