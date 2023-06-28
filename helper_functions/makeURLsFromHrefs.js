import { trimHrefs } from "@/helper_functions/trimHrefs";

export function makeURLsFromHrefs(rootURL, hrefArray) {
	let newArray = [];

	// add https://.../sub-page/ for links that only have e.g. href="/about/"
	/* hrefArray = hrefArray.map(href => {
		if(href.indexOf("http") === -1 ) return rootURL+
	}) */

	// make array contain only unique items
	newArray = [...new Set(trimHrefs(hrefArray))];
	newArray = newArray.map(item => rootURL + item.substr(1));
	newArray = [...new Set(newArray)];

	return newArray;
}
