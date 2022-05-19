// setup regular expressions for URL and title tag
const urlRe = /((([A-Za-z]{3,9}:(?:\/\/)?)(?:[\-;:&=\+\$,\w]+@)?[A-Za-z0-9\.\-]+|(?:www\.|[\-;:&=\+\$,\w]+@)[A-Za-z0-9\.\-]+)((?:\/[\+~%\/\.\w\-_]*)?\??(?:[\-\+=&;%@\.\w_]*)#?(?:[\.\!\/\\\w]*))?)/;
const titleRe = /<title>(.*)<\/title>/i;

// fetch data from editor
const [st, len] = editor.getSelectedLineRange();
const line = editor.getTextInRange(st, len);
const match = line.match(urlRe);

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
		else {
			context.fail();
		}
	}
	else {
		context.fail();
	}
}
else {
	alert("No URL found on current line");
	context.cancel();
}