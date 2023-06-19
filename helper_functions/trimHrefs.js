export function trimHrefs(array) {
	const newArray = [];

	for (let i = 0; i < array.length; i++) {
		const element = array[i];
		if ((element.match(new RegExp("/", "g")) || []).length === 1)
			newArray.push(element);
		// else break; // can be only continue if we wanna include links from, lets say: footer
		else continue;
	}

	return newArray;
}
