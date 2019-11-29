---
layout: post
title: "Interesting addition to ColdFusion 11 (and an example of it in ColdFusion 10)"
date: "2014-04-07T17:04:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2014/04/07/Interesting-addition-to-ColdFusion-11-and-an-example-of-it-in-ColdFusion-10
guid: 5193
---

<p>
While preparing for a presentation I'm doing on ColdFusion 11 on Wednesday night, I discovered an interesting update to the <a href="https://wikidocs.adobe.com/wiki/display/coldfusionen/DirectoryList">directoryList</a> function. In ColdFusion 11 you can now pass a function for filtering as opposed to just a list of extensions. (And yes, a list is valid - I'll explain more in a bit.) The example function was a bit messy so I updated it to make it a bit nicer. Here is the example.
</p>
<!--more-->
<pre><code class="language-javascript">boolean function filterBySize(path, type, extension) {
	var sizeLimit = 1024 * 100; //more than 10 KB
	var extensionList = "jpg,jpeg,gif,png";

	if(type is "dir") return false;
            
    if(listFindNoCase(extensionList,extension)) {
		var fileInfo = getFileInfo(path);
		var size = fileInfo.size;
		if(size &gt;= sizeLimit) return true;
	}

    return false;

}

filteredResults = directorylist(expandPath("."), true, "path", filterBySize);
writeDump(filteredResults);
</code></pre>

<p>
Pretty nifty, right? Of course, it isn't too difficult to do in ColdFusion 10 either. Here's a version backported:
</p>


<pre><code class="language-javascript">filteredFiles = arrayFilter(directoryList("/Users/ray/Dropbox/pictures", true, "path","*.jpg{% raw %}|*.jpeg|{% endraw %}*.gif|*.png"), function(path) {
	var sizeLimit = 1024 * 1000;

	var fileInfo = getFileInfo(path);
	var size = fileInfo.size;
	if(size &gt;= sizeLimit) return true;
    return false;
});</code></pre>

<p>
This is pretty much the same except I put the directoryList inside a call to arrayFilter. Oh, and by the way, even though the docs have said for a while now that the extension filter argument only supported one extension, that isn't true. For a while now you've been able to pass multiple extensions by using the pipe as a delimiter. I fixed that in the docs (while I was fixing the example code too). 
</p>