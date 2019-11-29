---
layout: post
title: "PhoneGap RSS Reader"
date: "2011-10-11T16:10:00+06:00"
categories: [html5,javascript,jquery,mobile]
tags: []
banner_image: 
permalink: /2011/10/11/PhoneGap-RSS-Reader
guid: 4388
---

Earlier today I noticed an entry on the PhoneGap <a href="https://groups.google.com/forum/#!topic/phonegap">forums</a> from a user asking about an RSS reader. I thought I'd whip one up using PhoneGap and jQuery Mobile and see what it took. Here's what I came up, and as always, feel free to rip apart the code and write it better. I'll warn folks that I only wrote the code to support RSS2, not ATOM, but in theory, it should be possible without too much additional work. (You would simply look at the metadata, note it, and change how you get data.)
<!--more-->
<p>

I began by creating a new PhoneGap project. I <b>strongly</b> recommend <a href="http://www.raymondcamden.com/index.cfm/2011/10/11/Playing-with-PhoneGap-Make-your-projects-even-easier">reading</a> my entry from earlier today about the nice Eclipse PhoneGap plugin to make it quicker to setup your projects. I began by adding code to handle getting the RSS code. First, I setup two simple variables people could tweak:

<p/>

<code>
//EDIT THESE LINES
//Title of the blog
var TITLE = "ColdFusion Jedi";
//RSS url
var RSS = "http://feedproxy.google.com/RaymondCamdensColdfusionBlog";
</code>

<p>

My code listens for my initial page to load. When this happens, I want to get the XML from the feed and work with it. Here's that snippet.

<p/>

<code>
        $.get(RSS, {}, function(res, code) {
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
</code>

<p/>

As a reminder, AJAX code in PhoneGap applications are <b>not</b> restricted by normal remote domain rules. I can easily open up the remote XML and parse it. Where did entries come from? Well this is where things get slightly complex. I'm going to store the parsed RSS in a global array called entries (hence the push to add things to the end). This will allow me to dynamically display the pages. But first, let's render out the list. My home page already has a blank list just for this purpose:

<p/>

<code>
&lt;div data-role="content"&gt;	
	&lt;ul id="linksList" data-role="listview" data-inset="true"&gt;&lt;/ul&gt;
&lt;/div&gt;
</code>

<p/>

So my handler can simply append to it....

<p/>

<code>
//now draw the list
var s = '';
$.each(entries, function(i, v) {
    s += '&lt;li&gt;&lt;a href="#contentPage" class="contentLink" data-entryid="'+i+'"&gt;' + v.title + '&lt;/a&gt;&lt;/li&gt;';
});
$("#linksList").append(s);
$("#linksList").listview("refresh");
</code>

<p/>

Note two things here. First, every single link will be going to a new jQuery Mobile page, contentPage. But I store the ID of the item in a data attribute. Also note the use listview("refresh"). This tells jQuery Mobile to add unicorn magic prettiness to HTML I've added in the list. Serious - Unicorn Magic Prettiness is the official term.

<p/>

Ok, so what's going on with the content page? I created it as a blank page, like so:

<p/>

<code>
&lt;div data-role="page" id="contentPage"&gt;

	&lt;div data-role="header"&gt;
		&lt;a href="#mainPage" data-rel="back"&gt;Home&lt;/a&gt;
		&lt;h1&gt;&lt;/h1&gt;
	&lt;/div&gt;

	&lt;div data-role="content" id="entryText"&gt;
	&lt;/div&gt;
		
&lt;/div&gt;
</code>

<p/>

And I've got a JavaScript click handler that notices the clicks and populates the data. First, the event listener for the link:

<p/>

<code>
//listen for detail links
$(".contentLink").live("click", function() {
    selectedEntry = $(this).data("entryid");
});
</code>

<p/>

And then the page displayer...

<p/>

<code>
//Listen for the content page to load
$("#contentPage").live("pageshow", function(prepage) {
     //Set the title
     $("h1", this).text(entries[selectedEntry].title);
     var contentHTML = "";
     contentHTML += entries[selectedEntry].description;
     contentHTML += '&lt;p/&gt;&lt;a href="'+entries[selectedEntry].link + '"&gt;Read Entry on Site&lt;/a&gt;';
     $("#entryText",this).html(contentHTML);
});
</code>

<p/>

Pretty simple, right? (I should point out jQuery Mobile does support completely virtualized pages too. ) Here's a quick screen shot...

<p/>

<img src="https://static.raymondcamden.com/images/cfjedi/s12.png" />

<p/>

And another one...

<p/>

<img src="https://static.raymondcamden.com/images/cfjedi/s23.png" />

<p/>

And finally, the complete code. If anyone wants the actual APK for this, just ask. The home page first:

<p/>

<code>
&lt;!DOCTYPE html&gt; 
&lt;html&gt; 
	&lt;head&gt; 
	&lt;meta name="viewport" content="width=device-width, initial-scale=1"&gt;	
	&lt;title&gt;&lt;/title&gt; 
	&lt;link rel="stylesheet" href="http://code.jquery.com/mobile/latest/jquery.mobile.min.css" /&gt;
	&lt;script src="http://code.jquery.com/jquery-1.6.2.min.js"&gt;&lt;/script&gt;
	&lt;script src="main.js"&gt;&lt;/script&gt;
	&lt;script src="http://code.jquery.com/mobile/latest/jquery.mobile.min.js"&gt;&lt;/script&gt;
&lt;/head&gt; 
&lt;body&gt; 

&lt;div data-role="page" id="mainPage"&gt;

	&lt;div data-role="header"&gt;
		&lt;h1&gt;&lt;/h1&gt;
	&lt;/div&gt;

	&lt;div data-role="content"&gt;	
		&lt;ul id="linksList" data-role="listview" data-inset="true"&gt;&lt;/ul&gt;
	&lt;/div&gt;

	&lt;div data-role="footer"&gt;
		&lt;h4&gt;SimpleBlog by Raymond Camden&lt;/h4&gt;
	&lt;/div&gt;

	
&lt;/div&gt;

&lt;div data-role="page" id="contentPage"&gt;

	&lt;div data-role="header"&gt;
		&lt;a href="#mainPage" data-rel="back"&gt;Home&lt;/a&gt;
		&lt;h1&gt;&lt;/h1&gt;
	&lt;/div&gt;

	&lt;div data-role="content" id="entryText"&gt;
	&lt;/div&gt;
		
&lt;/div&gt;

&lt;/body&gt;
&lt;/html&gt;
</code>

<p>

And the main.js file:

<p/>

<code>

$(document).ready(function() {
   
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
    
    //Listen for main page
    $("#mainPage").live("pageinit", function() {

        //Set the title
        $("h1", this).text(TITLE);
        
        $.get(RSS, {}, function(res, code) {
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

            //now draw the list
            var s = '';
            $.each(entries, function(i, v) {
                s += '&lt;li&gt;&lt;a href="#contentPage" class="contentLink" data-entryid="'+i+'"&gt;' + v.title + '&lt;/a&gt;&lt;/li&gt;';
            });
            $("#linksList").append(s);
            $("#linksList").listview("refresh");
        });
        
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
   
});
</code>