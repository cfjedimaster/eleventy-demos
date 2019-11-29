---
layout: post
title: "ColdFusion 8 Ajax and History Management"
date: "2009-01-08T13:01:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2009/01/08/ColdFusion-8-Ajax-and-History-Management
guid: 3185
---

Earlier this week a reader, Kumar, wrote me with the following question:

<blockquote>
<p>
Is there a way using CF8 Ajax to automate Browser History Management?
</p>
<p>
Using both ColdFusion.navigate or AjaxLink for navigation doesn't register browser history events, so the back and forward buttons stop working.
</p>
</blockquote>

Unfortunately I didn't really have much of an answer. I have not played with any of the libraries out there that help with that, but I knew some existed and simply suggested he give them a try. He did, and was actually able to create a little demo. Not having a blog of his own, he was ok with me sharing his code.
<!--more-->
Kumar made use of the <a href="http://developer.yahoo.com/yui/history/">YUI Browser History Manager</a>. This library makes it easier to work with a browser's back/forward buttons when using AJAX based applications. First, take a look at this demo: <a href="http://www.raymondcamden.com/demos/Test_HistoryManagement/history2.cfm">Demo</a>

As you click on home/away, note the URL changes, and that back and forth should work. (Although both Kumar and Yahoo mention the library has issues with Opera.) The code behind this is as follows (I'm just showing the main template as both the home and away pages are simple one line pages):

<code>
&lt;html&gt;
&lt;head&gt;
	&lt;!--- The YUI libraries needed to execute the History Management ---&gt;
	&lt;script type="text/javascript" src="http://yui.yahooapis.com/2.6.0/build/yahoo-dom-event/yahoo-dom-event.js"&gt;&lt;/script&gt;  
	&lt;script type="text/javascript" src="http://yui.yahooapis.com/2.6.0/build/connection/connection-min.js"&gt;&lt;/script&gt;  
	&lt;script type="text/javascript" src="http://yui.yahooapis.com/2.6.0/build/history/history-min.js"&gt;&lt;/script&gt;
	&lt;!--- Hide the iframe ---&gt;
	&lt;style&gt;
		#yui-history-iframe {
			  position:absolute;
			  top:0; left:0;
			  width:1px; height:1px;
			  visibility:hidden;
			}
	&lt;/style&gt;
&lt;/head&gt;

&lt;body&gt;
	&lt;!--- Needed for IE ---&gt;
	&lt;iframe id="yui-history-iframe" src="blank.html"&gt;&lt;/iframe&gt;
    &lt;input id="yui-history-field" type="hidden"&gt;

&lt;div id="nav"&gt;
	&lt;ul&gt;
		&lt;li&gt;&lt;a href="javascript:doNav('home');"&gt;Home&lt;/a&gt;&lt;/li&gt;
		&lt;li&gt;&lt;a href="javascript:doNav('away');"&gt;Away&lt;/a&gt;&lt;/li&gt;
	&lt;/ul&gt;
&lt;/div&gt;


&lt;!--- This is where all the content will be loaded ---&gt;
&lt;cfdiv id="content" /&gt;


&lt;script&gt;
	function doNav(url) {
		//We only register the brower history entry. Storing this automatically calls the loadSection function defined below.
		YAHOO.util.History.navigate("section", url); 
			
	}
	
    //This function takes in the section variable and redirects the content cfdiv to the proper place.
    //You could shorten and combine the doNav and loadSection functions if needed.
    //We call this function through the 
    function loadSection(section) {
       
		switch(section) {
			case 'home':
			ColdFusion.navigate('test.cfm','content');
			break;
			case 'away':
			ColdFusion.navigate('test1.cfm','content');
			break;
		}
       
        
    };

	initSection = '';
	if(document.location.hash != '') {
		if(document.location.hash.indexOf('#section=') == 0) { 
			initSection = document.location.hash.substr(9, document.location.hash.length);
		}
	}

    //This is the default section that needs to be loaded, in other words your home page.
    if(initSection == '') initSection = "home";
    
    //We must register our navigation module, which I have called section with Yahoo's history manager
    // This has to be done before initializing the history manager
    YAHOO.util.History.register("section", initSection, loadSection);
    //loadSection function is called after calling YAHOO.util.History.navigate,
    // or after the user has trigerred the back/forward button.
    // We cannot distinguish between these two situations.

    // Use the Browser History Manager onReady method to initialize the application.
    YAHOO.util.History.onReady(function () {    	
        //We load the default state into the cfdiv
        loadSection(initSection);      
    });

    // Initialize the browser history management library.
    try {
        YAHOO.util.History.initialize("yui-history-field", "yui-history-iframe");
    } catch (e) {
        // The only exception that gets thrown here is when the browser is
        // not supported (Opera, or not A-grade) Degrade gracefully.
        // This is used for normal navigation in case our history manager initialization failed
        loadSection(initSection);
    }

    &lt;/script&gt;

  &lt;/body&gt;
&lt;/html&gt;
</code>

I'm pretty new to the code myself, but I'll try my best to explain it. Obviously we need to import the YUI libraries and that is done on top. Some CSS/iframe HTML is used for IE. Each navigation link runs a function called doNav. This runs the History.navigate function. If you skip down to the register function, you can see where we set the library up with a default string to use in the URL as well as a function to run after the library is used to change urls. Going back to doNav, when we say load 'away', it's going to to ask the Yahoo library to do it's history "magic" in the URL and then run loadSection with the value 'away'. The loadSection function just runs the normal ColdFusion.navigate.

I modified his code a bit. Specifically I added this portion to let bookmarking work:

<code>
initSection = '';
if(document.location.hash != '') {
	if(document.location.hash.indexOf('#section=') == 0) { 
		initSection = document.location.hash.substr(9, document.location.hash.length);
	}
}
</code>

This is similar to the code used over at <a href="http://www.coldfusionbloggers.org">ColdFusionBloggers</a>. Pretty slick code.

<b>Update:</b> I was wrong - at the time I exchanged emails with Kumar, he did not have a blog. Now he does: <a href="http://www.coldfusion-ria.com/Blog/">http://www.coldfusion-ria.com/Blog/</a>