---
layout: post
title: "Using jQuery and ColdFusion to create an auto-link for definition application (2)"
date: "2009-02-03T10:02:00+06:00"
categories: [coldfusion,jquery]
tags: []
banner_image: 
permalink: /2009/02/03/Using-jQuery-and-ColdFusion-to-create-an-autolink-for-definition-application-2
guid: 3219
---

A few days ago I <a href="http://www.raymondcamden.com/index.cfm/2009/1/31/Using-jQuery-and-ColdFusion-to-create-an-autolink-for-definition-application">blogged</a> an experiment where I used jQuery and ColdFusion to dynamically hot link certain words on a web page to a definition. At the end of the article I talked about how I had trouble using jQuery UI and decided to use cfwindow instead. Later in the week I dug deeper into jQuery UI (see related articles below) and got things working nicely. I thought it would be nice to return to the original application and update it to use the jQuery Dialog widget.
<!--more-->
Turns out the modifications were pretty minor. If you remember my <a href="http://www.coldfusionjedi.com/index.cfm/2009/2/2/Creating-a-Dialog-with-jQuery-UI-2">last entry</a> on jQuery Dialog, we can use the constructor function to prepare a div to be used as the widget. I took the existing $(document).ready function add modified it:

<code>
$(document).ready(function(){

	$("#example").dialog({% raw %}{autoOpen:false,modal:true}{% endraw %});	

	//get the text from the div
	var content = $("#content").text()
	//split into words
	var words = content.split(/\b/)
	//store unique words
	var uWords = new Object()
	for(var i=0; i&lt;words.length;i++) {
		var word = words[i]
		word = word.replace(/[\s\n]/g,'')
		if(word != '' && uWords[word] == null) uWords[word] = '' 		
	}
	//convert to array
	var aWords = new Array()
	for(var w in uWords) aWords.push(w)
	if(aWords.length) $.post('term.cfc?method=filteredTermList&returnFormat=json',{% raw %}{termList:aWords.toString()}{% endraw %},highlightWords,"json")
});
</code>

The only change here is the very first line. Note too that I'm now using modal for the dialog. The div was added to the bottom of my HTML page like so:

<code>
&lt;div style="display: none;" id="example" title="Definition"&gt;&lt;/div&gt;
</code>

The next change was simpler. First - here was the code I had used for cfwindow support:

<code>
&lt;cfajaximport tags="cfwindow" /&gt;
(deletia here...)
&lt;script&gt;
function showTerm(term){
	ColdFusion.Window.create('term','Definition of '+term,'term.cfc?method=definition&term='+escape(term)+'&returnformat=plain', {% raw %}{center:true,modal:true}{% endraw %})
	ColdFusion.Window.onHide('term',winClosed);
	return false
}
function winClosed() {
	ColdFusion.Window.destroy('term',true)
}
(more code here...)
</code>

I removed the cfajaximport of course, and dropped winClosed. showTerm is now somewhat simpler:

<code>
function showTerm(term){
	$("#example").load('term.cfc?method=definition&term='+escape(term)+'&returnformat=plain').dialog("open")
//http://groups.google.com/group/jquery-ui/browse_thread/thread/4bbffbeb4b506d1d/de1c4f8bb05c8b67?lnk=gst&q=dialog+title#de1c4f8bb05c8b67
	$("#example").data("title.dialog", "Definition of "+term) 
	return false
}
</code>

The first line uses the tip I showed before to load content into a div via Ajax and then create a dialog with it. The second line sets the title. This was based on a listserv thread documented in the comment.

Anyway, you can see it all here: <a href="http://www.coldfusionjedi.com/demos/term/test.cfm">http://www.coldfusionjedi.com/demos/term/test.cfm</a> As always, don't forget you can View Source to see the complete code behind the client side stuff.