import { trimHrefs } from "@/helper_functions/trimHrefs";

export function makeURLsFromHrefs(rootURL, hrefArray) {
	let newArray = [];

	// make array contain only unique items
	newArray = [...new Set(trimHrefs(hrefArray))];
	newArray = newArray.map(item => rootURL + item.substr(1));

	return newArray;
}
