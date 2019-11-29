---
layout: post
title: "ColdFusion Builder Extensions and Long Processes"
date: "2011-03-30T19:03:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2011/03/30/ColdFusion-Builder-Extensions-and-Long-Processes
guid: 4176
---

A week or so ago <a href="http://www.jeffcoughlin.com/">Jeff Coughlin</a> came to me with an interesting question. Was it possible for a ColdFusion Builder extension to handle a long running process? By that he meant fire off some type of process and handle the duration without locking up the editor. I got some time to think about this at lunch today and come up with a proof of concept. I then followup the POC with a real, if silly, extension that will scan your ColdFusion code and give you a report on which tags were used the most. Before going any further, note that there is already a good idea of this concept out there - Terry Ryan's <a href="http://builderstats.riaforge.org/">builderStats</a> extension. It makes use of Flash to generate a dialog that nicely waits while the back end code does a bunch of magic bean counting. I wanted a pure HTML solution using jQuery because... well... because. Here's what I came up with. Feel free to poke multiple holes into this solution.
<!--more-->
<p>

I began with a new extension, SlowView, that would be as simple as possible. (Both extensions will be attached to this blog entry at the bottom.) SlowView added a menu item to my editor. There was no logic to this - I just wanted a quick and dirty menu item:

<p>

<code>
&lt;application&gt;
	
	&lt;name&gt;SlowView&lt;/name&gt;
	&lt;author&gt;Raymond Camden&lt;/author&gt;
	&lt;version&gt;1&lt;/version&gt;
	&lt;email&gt;ray@camdenfamily.com&lt;/email&gt;
	&lt;license&gt;Buy something off the wishlist! http://www.amazon.com/o/registry/2TCL1D08EZEYE&lt;/license&gt;	
	&lt;description&gt;POC for handling a slow process in an extension&lt;/description&gt;	

    &lt;menucontributions&gt;
	
		&lt;contribution target="editor"&gt;    
			&lt;menu name="Run SlowView"&gt;    
				&lt;action name="Run" handlerid="handler1" showresponse="true"&gt;&lt;/action&gt;    
			&lt;/menu&gt;    
		&lt;/contribution&gt;	    

	&lt;/menucontributions&gt;

	&lt;handlers&gt;		
		&lt;handler id="handler1" type="CFM" filename="test.cfm" /&gt;
	&lt;/handlers&gt;
	    
&lt;/application&gt;
</code>

<p>

Nothing here should be new or special yet. Now let's look at test.cfm:

<p>

<code>
&lt;cfinclude template="udfs.cfm"&gt;

&lt;cfheader name="Content-Type" value="text/xml"&gt;
&lt;cfoutput&gt;
&lt;response showresponse="true"&gt; 
&lt;ide url="#getCurrentDir()#/display.cfm"&gt;
&lt;view id="slowview1" title="Slow View 1" /&gt;
&lt;/ide&gt;
&lt;/response&gt; 
&lt;/cfoutput&gt;
</code>

<p>

udfs.cfm simply include a few utility functions and are not relevant to this post. Note though that I'm creating a new view called "showview1". Views in CFBuilder must be unique. If not, your output will overwrite another view. Note though that I'm loading another URL for the actual stuff to put in the view - display.cfm. Now let's look at that.

<p>

<code>
&lt;cfinclude template="udfs.cfm"&gt;

&lt;html&gt;

&lt;head&gt;
&lt;script src="jquery-1.5.1.min.js"&gt;&lt;/script&gt;
&lt;script&gt;
var watcher;
var lastmsg = "";

function checkProcess() {
	$.get("checkprocess.cfm", {}, function(res,code) {
		if(res.MESSAGE != lastmsg) {
			$("#console").append(res.MESSAGE+"&lt;br&gt;");
			lastmsg = res.MESSAGE;
		}
		if(res.MESSAGE == "Done.") { 
			clearInterval(watcher);
			$("#result").html("The result is "+res.RESULT);
		}
	}, "json");
}

$(document).ready(function() {

	$("#submitBtn").click(function() {
		var input = $("#number").val();
		if(input == "" || isNaN(input)) return;
		//fire off the request
		$("#result").html("Beginning your process - please stand by.");
		$.get("process.cfm",{% raw %}{input:input}{% endraw %});
		//now begin polling
		watcher = setInterval(checkProcess,1000);
	});	
});
&lt;/script&gt;
&lt;/head&gt;

&lt;body&gt;

&lt;form&gt;
Input number: &lt;input type="text" name="number" id="number"&gt;
&lt;input type="button" id="submitBtn" value="Slowly Double it"&gt;
&lt;div id="result"&gt;&lt;/div&gt;
&lt;/form&gt;

&lt;div id="console"&gt;&lt;/div&gt;
&lt;/body&gt;
&lt;/html&gt;
</code>

<p>

Ok, now we've got some stuff going on! Let's look at the bottom first. I've got a basic form with a button. Below that is a result div and below that is a console div. As you can guess, the console div is mainly going to be used for debugging. Now let's go up a bit.

<p>

My document.ready block adds a listener to the button click event. I grab the value out of the text field and check if it is numeric. If it is, I make a GET request to process.cfm. <b>Notice that I do not have a result handler.</b> I will not be hanging around for the end of this call. Instead, I set up an interval to run every second. 

<p>

If we go higher then into checkProcess, you can see I'm performing a request to checkprocess.cfm. This is going to return a result structure to me that I can use to check the status of my process. As you can see, I look for a new message, and if one exists, I print it out. If the message is "Done.", I remove my interval and tell the user. Now let's look at our two server side files. First, process.cfm:

<p>

<code>
&lt;cfparam name="url.input" default="0"&gt;
&lt;cfset url.input = val(url.input)&gt;

&lt;!--- begin my super slow response ---&gt;
&lt;cfset application.status = {}&gt;
&lt;cfset application.status.message = "Begun"&gt;

&lt;cfset sleep(3000)&gt;
&lt;cfset application.status.message = "Part of the way done."&gt;

&lt;cfset sleep(3000)&gt;
&lt;cfset application.status.message = "Mostly done."&gt;

&lt;cfset sleep(3000)&gt;
&lt;cfset application.status.message = "Done."&gt;
&lt;cfset application.status.result = url.input * 2&gt;
</code>

<p>

This code takes the input and does quick validation on it. I then create an Application-scoped structure to hold the status. Remember - a CFB extension is much like a single user application. So using the Application scope is (pretty much) ok for this. I then use a few sleep methods to delay the completion of the file. Once it's all the way done I store my result. Here then is checkprocess.cfm:

<p>

<code>
&lt;cfset json = serializeJSON(application.status)&gt;
&lt;cfcontent type="application/json" reset="true"&gt;&lt;cfoutput&gt;#json#&lt;/cfoutput&gt;
</code>

<p>

As you can see, all it does it spit out the Application variable. So how does it work? Here is a quick Jing video:

<p>


<object classid="clsid:d27cdb6e-ae6d-11cf-96b8-444553540000" codebase="http://download.macromedia.com/pub/shockwave/cabs/flash/swflash.cab#version=6,0,40,0" width="498" height="554" id="mymoviename"> 
<param name="movie" value="http://www.raymondcamden.com/images/videos/2011-03-30_1717.swf" />  
<param name="quality" value="high" /> 
<param name="bgcolor" value="#ffffff" /> 
<embed src="http://www.coldfusionjedi.com/images/videos/2011-03-30_1717.swf" quality="high" bgcolor="#ffffff" width="498" height="554" name="mymoviename" align="" type="application/x-shockwave-flash" pluginspage="http://www.macromedia.com/go/getflashplayer"> 
</embed> 
</object>  

<p>

Notice that I'm able to use the editor while this is going on. Polling isn't the most effective way to talk with the server, but in this case, it works just fine I'd say. Nice and simple. Now let's look at a more advanced example, TagCounter. First, it's ide_config.xml file:

<p>

<code>
&lt;application&gt;
	
	&lt;name&gt;Tag Counter&lt;/name&gt;
	&lt;author&gt;Raymond Camden&lt;/author&gt;
	&lt;version&gt;1&lt;/version&gt;
	&lt;email&gt;ray@camdenfamily.com&lt;/email&gt;
	&lt;license&gt;Buy something off the wishlist! http://www.amazon.com/o/registry/2TCL1D08EZEYE&lt;/license&gt;	
	&lt;description&gt;I count your ColdFusion tags.&lt;/description&gt;	

    &lt;menucontributions&gt;
	
		&lt;contribution target="editor"&gt;    
			&lt;menu name="Count Tags"&gt;    
				&lt;action name="Do It" handlerid="startView" showresponse="true"&gt;&lt;/action&gt;    
			&lt;/menu&gt;    
		&lt;/contribution&gt;

		&lt;contribution target="projectview"&gt;
			&lt;menu name="Count Tags"&gt;
	    		&lt;action name="Do It" handlerid="startView" showResponse="true"&gt;&lt;/action&gt;
			&lt;/menu&gt;
		&lt;/contribution&gt;

	&lt;/menucontributions&gt;

	&lt;handlers&gt;		
		&lt;handler id="startView" type="CFM" filename="start.cfm" /&gt;
	&lt;/handlers&gt;
	    
&lt;/application&gt;
</code>

<p>

Of note is that this extension supports both the project view and the editor view. Now let's look at start.cfm, where I went ahead and used my <a href="http://builderhelper.riaforge.org/">builderHelper</a> utility.

<p>

<code>
&lt;cfset helper = createObject("component", "builderHelper").init(ideeventinfo)&gt;
&lt;cfset application.res = helper.getSelectedResource()&gt;

&lt;cfheader name="Content-Type" value="text/xml"&gt;
&lt;cfoutput&gt;
&lt;response showresponse="true"&gt; 
&lt;ide url="#helper.getRootURL()#/display.cfm"&gt;
&lt;view id="tagcounter" title="Tag Counter" /&gt;
&lt;/ide&gt;
&lt;/response&gt; 
&lt;/cfoutput&gt;
</code>

<p>

Outside of using the utility, the other change here is that I store the selected resource to an application variable. Was it a click from the project view or the editor? Who cares. builderHelper figures it out for me. Now let's look at display.cfm:

<p>

<code>
&lt;html&gt;

&lt;head&gt;
&lt;script src="jquery-1.5.1.min.js"&gt;&lt;/script&gt;
&lt;script&gt;
var watcher;
var lastmsg = "";

function fixTag(s) {
	s = s.replace("&lt;","&lt;");
	s = s.replace("&gt;","&gt;");
	return s;
}

function checkProcess() {
	$.get("checkprocess.cfm", {}, function(res,code) {
		if(res.MESSAGE != lastmsg) {
			$("#result").html(res.MESSAGE+"&lt;br&gt;");
			lastmsg = res.MESSAGE;
		}
		if(res.CODE == 1) { 
			clearInterval(watcher);
			var s = "&lt;h2&gt;Results&lt;/h2&gt;&lt;br/&gt;";
			s += "Scanned "+res.RESULT.TOTALFILES+" total file(s).&lt;br/&gt;";
			s += "&lt;table border=\"1\" width=\"300\"&gt;";
			for(var x = 0; x&lt;res.RESULT.SORTEDTAGS.length; x++) {
				s+= "&lt;tr&gt;&lt;td&gt;"+fixTag(res.RESULT.SORTEDTAGS[x])+"&lt;/td&gt;&lt;td&gt;"+res.RESULT.TAGS[res.RESULT.SORTEDTAGS[x]]+"&lt;/td&gt;&lt;/tr&gt;";
			}
			s += "&lt;/table&gt;";			
			$("#result").html(s);
		}
	}, "json");
}

$(document).ready(function() {

	$("#result").html("Beginning your process - please stand by.");
	$.get("process.cfm");
	//now begin polling
	watcher = setInterval(checkProcess,1000);

});
&lt;/script&gt;
&lt;/head&gt;

&lt;body&gt;

&lt;cfoutput&gt;
&lt;p id="main"&gt;
	&lt;cfif application.res.type is "file"&gt;
		Scanning file #application.res.path#.
	&lt;cfelse&gt;
		Scanning folder #application.res.path#.
	&lt;/cfif&gt;
&lt;/p&gt;
&lt;/cfoutput&gt;

&lt;p id="result"&gt;&lt;/p&gt;

&lt;/body&gt;
&lt;/html&gt;
</code>

<p>

Now this is a bit more complex than before. I begin (and as always, I'm starting at the bottom) by reporting on the type of scan being made. Unlike the form-based extension, this one begins the process immediately. Now I'm assuming a nice clean CODE result from the back end so I've got a simpler way to tell when done. Everything else is just vanilla layout of the data. Let's look at the back end.

<p>

<code>
&lt;cfset files = []&gt;

&lt;cfset application.status = {}&gt;
&lt;cfset application.status.code = 0&gt;
&lt;cfset application.status.result = {}&gt;
&lt;cfset application.status.result.tags = {}&gt;
&lt;cfset application.status.message = ""&gt;

&lt;cfif application.res.type is "file"&gt;
	&lt;cfset files[1] = application.res.path&gt;
&lt;cfelse&gt;
	&lt;cfset files = directoryList(application.res.path, true, "path","*.cfm|*.cfc")&gt;
&lt;/cfif&gt;

&lt;cfloop index="x" from="1" to="#arrayLen(files)#"&gt;
	&lt;cfset application.status.message = "Processing file #x# out of #arrayLen(files)#."&gt;
	&lt;cfset contents = fileRead(files[x])&gt;

	&lt;cfset tags = reMatchNoCase("&lt;cf.*?&gt;",contents)&gt;
	&lt;!--- remove attributes ---&gt;
	&lt;cfloop index="x" from="1" to="#arrayLen(tags)#"&gt;
		&lt;cfset tag = tags[x]&gt;
		&lt;cfset tag = reReplace(tag,"[[:space:]].*?&gt;","&gt;")&gt;
		&lt;cfset tags[x] = tag&gt;
	&lt;/cfloop&gt;

	&lt;cfloop index="tag" array="#tags#"&gt;
		&lt;cfif not structKeyExists(application.status.result.tags, tag)&gt;
			&lt;cfset application.status.result.tags[tag] = 0&gt;
		&lt;/cfif&gt;
		&lt;cfset application.status.result.tags[tag]++&gt;
	&lt;/cfloop&gt;
		
&lt;/cfloop&gt;

&lt;cfset application.status.result.totalFiles = arrayLen(files)&gt;
&lt;cfset application.status.result.sortedTags = structSort(application.status.result.tags, "numeric", "desc")&gt;
&lt;cfset application.status.code = 1&gt;
</code>

<p>

The idea here is simple - create an error of either one file or all the files in a folder. Note that the docs are wrong about directoryList. You <i>can</i> provide multiple filters. Once I have my array, I begin looping over it. For each file I read in the contents and use some simple regex to extract the tags. This isn't rock solid but works ok. Once done I can use structSort to get a list of tags in descending order of use. And that's it. Here's a video of it scanning BlogCFC.

<p>


<object classid="clsid:d27cdb6e-ae6d-11cf-96b8-444553540000" codebase="http://download.macromedia.com/pub/shockwave/cabs/flash/swflash.cab#version=6,0,40,0" width="643" height="547" id="mymoviename"> 
<param name="movie" value="http://www.coldfusionjedi.com/images/videos/2011-03-30_1729.swf" />  
<param name="quality" value="high" /> 
<param name="bgcolor" value="#ffffff" /> 
<embed src="http://www.coldfusionjedi.com/images/videos/2011-03-30_1729.swf" quality="high" bgcolor="#ffffff" width="643" height="547" name="mymoviename" align="" type="application/x-shockwave-flash" pluginspage="http://www.macromedia.com/go/getflashplayer"> 
</embed> 
</object>

<p>

Enjoy!<p><a href='enclosures/C{% raw %}%3A%{% endraw %}5Chosts{% raw %}%5C2009%{% endraw %}2Ecoldfusionjedi{% raw %}%2Ecom%{% endraw %}5Cenclosures{% raw %}%2Fforblog%{% endraw %}2Ezip'>Download attached file.</a></p>