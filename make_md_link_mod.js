// setup regular expressions for URL and title tag
const urlRe = /((([A-Za-z]{3,9}:(?:\/\/)?)(?:[\-;:&=\+\$,\w]+@)?[A-Za-z0-9\.\-]+|(?:www\.|[\-;:&=\+\$,\w]+@)[A-Za-z0-9\.\-]+)((?:\/[\+~%\/\.\w\-_]*)?\??(?:[\-\+=&;%@\.\w_]*)#?(?:[\.\!\/\\\w]*))?)/;
const titleRe = /<title>(.*)<\/title>/i;
const twRe = /(?:http:\/\/)?(?:www\.)?twitter\.com\/(?:(?:\w)*#!\/)?(?:pages\/)?(?:[\w\-]*\/)*([\w\-]*)/ //regex to match twitter links

// fetch data from editor
const [st, len] = editor.getSelectedLineRange();
const line = editor.getTextInRange(st, len);
const match = line.match(urlRe);
const twMatch = line.match(twRe);

if (match) {
	// we found a URL, make HTTP get request to fetch page
	let url = match[0];
	let http = new HTTP();
	let response = http.request({
		url: url,
		method: "GET",
		headers: {
			"Accept": "text/html"
		}
	});
	if (response.success) {		
		// loaded page, look for html <title> tag
		let titleMatch = response.responseText.match(titleRe);
		if (titleMatch) {
			// we found a title, build the link and insert it
			let title = titleMatch[1];
			let newLine = line.replace(url, `[${title}](${url})`);
			editor.setTextInRange(st, len, newLine);
		}
		//fail to get a title, check if this is a twitter link
		else if (twMatch) {
			//this is a twitter link, leave it.
			//context.cancel();
		}
		else {
			//the real fail case
			context.fail();
		}
	}
	else {
		context.fail();
	}
}
else {
	//alert("No URL found on current line");
	//context.cancel();
}