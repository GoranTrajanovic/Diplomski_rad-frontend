export function trimHrefs(hrefArray) {
	const newArray = [];

	for (let i = 0; i < hrefArray.length; i++) {
		const hrefString = hrefArray[i];
		/* if ((hrefString.match(new RegExp('"/w+/?"', "g")) || []).length === 1)
			newArray.push(hrefString);
			// else break; // can be only continue if we wanna include links from, lets say: footer
			else continue; */
		if (
			(hrefString.indexOf("/") === hrefString.lastIndexOf("/") &&
				!hrefString.includes("http")) ||
			(hrefString.lastIndexOf("/") + 1 === hrefString.length &&
				!hrefString.includes("http"))
		)
			newArray.push(hrefString);
		else continue;
	}

	return newArray;
}
