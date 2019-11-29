---
layout: post
title: "PhoneGap RSS Reader - Part 3"
date: "2012-01-24T18:01:00+06:00"
categories: [javascript,jquery,mobile]
tags: []
banner_image: 
permalink: /2012/01/24/phonegap-rss-reader-part-3
guid: 4507
---

Welcome to my third entry for my (what was at first) simple PhoneGap RSS reader. If you haven't yet, please be sure to read <a href="http://www.raymondcamden.com/index.cfm/2011/10/11/PhoneGap-RSS-Reader">part 1</a> and <a href="http://www.raymondcamden.com/index.cfm/2011/12/19/PhoneGap-RSS-Reader--Part-2">part 2</a> so you have some context about how this application works. In this part, I'm going to tackle two enhancements suggested to me by my readers:
<!--more-->
<p/>

<ol>
<li>First - support rendering the entries if the user is offline.
<li>Second - clean up the UX a bit so that when a user views an entry, leaves, and then comes back to another entry, they don't see the old text there for a split second.
</ol>

<p/>

Let's tackle the offline question first. I spent some time thinking about this and tried a few things that didn't quite work out the way I wanted. The first thing I tried was checking navigator.onLine. (See this <a href="http://stackoverflow.com/questions/2384167/check-if-internet-connection-exists-with-javascript">Stackoverflow entry</a> for details.) This did not work well for me. When I switched my device to airplane mode it still reported me as online. I then looked into PhoneGap's <a href="http://docs.phonegap.com/en/1.3.0/phonegap_connection_connection.md.html#Connection">Connection</a> API. This <i>kinda</i> worked. It didn't seem to grok my Airplane mode at all. It certainly didn't report it as online (it returned a null actually) and I could have handled it, but I then had the issue of how I was going to handle coordinating the deviceready event along with the jQuery Mobile pageinit method.

<p/>

Then I realized something. I already had an Ajax error handler. And it worked. That's obvious of course, but it occurred to me. Why not use this error handler? It would not only support offline mode, but any error on the remote server as well. At the end of the day, if I can't get the RSS feed, who cares if I'm offline or if the server is down. I <i>could</i> see caring, and if so, you would obviously want to use the PhoneGap Connection value, but I figured, why not go with the simple route.

<p/>

As for storage - that turned out to be trivial - LocalStorage. Have you guys figured out yet that I <b>really love HTML5 LocalStorage</b>? 

<p/>

So, I decided to get rid of AjaxSetup. I only have one Ajax call in the entire application, so why not tie it to that call. So I switched from a $.get to a $.ajax:

<p/>

<code>
$.ajax({
	url:RSS,
	success:function(res,code) {
		entries = [];
		var xml = $(res);
		var items = xml.find("item");
		$.each(items, function(i, v) {
			entry = { 
				title:$(v).find("title").text(), 
				link:$(v).find("link").text(), 
				description:$.trim($(v).find("description").text())
			};
			entries.push(entry);
		});
		//store entries
		localStorage["entries"] = JSON.stringify(entries);
		renderEntries(entries);
	},
	error:function(jqXHR,status,error) {
		//try to use cache
		if(localStorage["entries"]) {
			$("#status").html("Using cached version...");
			entries = JSON.parse(localStorage["entries"])
			renderEntries(entries);				
		} else {
			$("#status").html("Sorry, we are unable to get the RSS and there is no cache.");
		}
	}
})
</code>

<p/>

This is - for the most part, the same code as before, just using the core $.ajax method. You can see where the error function will look into LocalStorage for the cached copy, and where the success function always stores a copy. The renderEntries function is simply an abstracted out version of the display code:

<p/>

<code>
function renderEntries(entries) {
    var s = '';
    $.each(entries, function(i, v) {
        s += '&lt;li&gt;&lt;a href="#contentPage" class="contentLink" data-entryid="'+i+'"&gt;' + v.title + '&lt;/a&gt;&lt;/li&gt;';
    });
    $("#linksList").html(s);
    $("#linksList").listview("refresh");		
}
</code>

<p/>

Woot. That works. Now for the next request. We want to ensure that users don't see the old content when loading in the RSS entry detail page. This turned out to be a bit weird. jQuery Mobile has logic to say, "Do this when a page is hiding, or before it hides", but for the life of me (and <b>please</b> correct me if I'm wrong) there doesn't seem to be a good way to get the page that is leaving. You get passed the page you are going to, but not the <i>current</i> page. I really feel like I'm missing something here, so please note this may get corrected later. For me though I simply added an event listener to the main page. It now sees if a previous page exists, and if so, clears out the text:

<p/>

<code>
$("#mainPage").live("pagebeforeshow", function(event,data) {
	if(data.prevPage.length) {
		$("h1", data.prevPage).text("");
		$("#entryText", data.prevPage).html("");
	};
});
</code>

<p/>

And that's it. I've included the entire JavaScript file below (the HTML hasn't changed from the previous entry) and a zip of the entire project may be downloaded for the low cost of free.

<p/>

<code>



//EDIT THESE LINES
//Title of the blog
var TITLE = "ColdFusion Jedi";
//RSS url
var RSS = "http://feedproxy.google.com/RaymondCamdensColdfusionBlog";
//Stores entries
var entries = [];
var selectedEntry = "";

//listen for detail links
$(".contentLink").live("click", function() {
	selectedEntry = $(this).data("entryid");
});

function renderEntries(entries) {
    var s = '';
    $.each(entries, function(i, v) {
        s += '&lt;li&gt;&lt;a href="#contentPage" class="contentLink" data-entryid="'+i+'"&gt;' + v.title + '&lt;/a&gt;&lt;/li&gt;';
    });
    $("#linksList").html(s);
    $("#linksList").listview("refresh");		
}

//Listen for main page
$("#mainPage").live("pageinit", function() {
	//Set the title
	$("h1", this).text(TITLE);
	
	$.ajax({
		url:RSS,
		success:function(res,code) {
			entries = [];
			var xml = $(res);
			var items = xml.find("item");
			$.each(items, function(i, v) {
				entry = { 
					title:$(v).find("title").text(), 
					link:$(v).find("link").text(), 
					description:$.trim($(v).find("description").text())
				};
				entries.push(entry);
			});
			//store entries
			localStorage["entries"] = JSON.stringify(entries);
			renderEntries(entries);
		},
		error:function(jqXHR,status,error) {
			//try to use cache
			if(localStorage["entries"]) {
				$("#status").html("Using cached version...");
				entries = JSON.parse(localStorage["entries"])
				renderEntries(entries);				
			} else {
				$("#status").html("Sorry, we are unable to get the RSS and there is no cache.");
			}
		}
	});
	
});

$("#mainPage").live("pagebeforeshow", function(event,data) {
	if(data.prevPage.length) {
		$("h1", data.prevPage).text("");
		$("#entryText", data.prevPage).html("");
	};
});

//Listen for the content page to load
$("#contentPage").live("pageshow", function(prepage) {
	//Set the title
	$("h1", this).text(entries[selectedEntry].title);
	var contentHTML = "";
	contentHTML += entries[selectedEntry].description;
	contentHTML += '&lt;p/&gt;&lt;a href="'+entries[selectedEntry].link + '"&gt;Read Entry on Site&lt;/a&gt;';
	$("#entryText",this).html(contentHTML);
});
</code><p><a href='/enclosures/RSSDemo1.zip'>Download attached file.</a></p>