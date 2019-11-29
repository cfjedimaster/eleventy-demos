---
layout: post
title: "Model-Glue, Internet Explorer, and File Downloads"
date: "2006-03-03T12:03:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2006/03/03/ModelGlue-Internet-Explorer-and-File-Downloads
guid: 1136
---

So first off, let me apologize. A Model-Glue site I worked on went "live" recently, but I haven't published it since it is a closed site. The site, <a href="http://www.universitynotes.net">UniversityNotes.net</a>, is a site for kids at ULL (my old school) to share notes, old tests, and generally rap about the school. I did this site as a favor to a family friend, and to be honest, I freaking love <a href="http://www.model-glue.com">Model-Glue</a>. Unfortunately, you have to be a student at ULL to register for the site. (Well, to confirm your registration you have to be.) So I can't really show anything from the site.
<!--more-->
However - I can talk about an interesting problem I ran into - and hopefully it will help others. So as I mentioned above, the site lets user submit, and share, notes and tests. Once these files are approved by the admins, they can then be downloaded by the users. I used a nice Flash Form grid to allow for downloading. How did I do it? First I used a Flash Form since the grid was perfect for the display of the data. Under the grid I had the following button:

<code>
&lt;cfinput type="button" name="downloadtest" value="Download" 
tooltip="Click here to download the selected test."
onClick="getURL('javascript:showTest(\''+ data_tests.dataProvider[data_tests.selectedIndex]['id']+'\')')"
&gt;
</code>

Basically I'm calling out to a JavaScript function and passing the current selected ID value of the data. The JavaScript function is rather simple:

<code>
function showTest(u) {
	var rootURL = 'http://#cgi.server_name#/index.cfm?event=loadTest&id=';
	if(u!='undefined') document.location.href = rootURL + u;
}
</code>

By the way, I shouldn't have used index.cfm?event=. Model-Glue provides a simpler way to get that: 

<code>
#viewstate.getValue("myself")#
</code>

You then simply append the event and any additional URL variables. So I could rewrite my original URL with:

<code>
#viewstate.getValue("myself")#loadTest&id=
</code>

Anyway, on the back end this is how I handle the event:

<code>
&lt;!-- loads note file  --&gt;
&lt;event-handler name="LoadNote"&gt;
&lt;broadcasts&gt;
&lt;message name="GetLoggedIn" /&gt;
&lt;message name="LoadNote" /&gt;
&lt;/broadcasts&gt;
&lt;views&gt;
&lt;include name="body" template="main.viewnote.cfm" /&gt;
&lt;/views&gt;
&lt;results&gt;
&lt;result name="DoLogin" do="DoLoginRegister" redirect="yes"/&gt;
&lt;result name="BadNote" do="Home" redirect="yes"/&gt;
&lt;result do="Layout" /&gt;
&lt;/results&gt;
&lt;/event-handler&gt;
</code>

What does main.viewnotes.cfm? It simply uses cfheader/cfcontent to serve up the file. To the user,it looks like they never leave the page with the flash grid. 

All was well in the world till someone decided to use the Internet Explorer browser. As you know, or should know, IE recently added some security fixes. One of those fixes prevents "automatic downloading". The user gets a little info bar on top they have to approve before the download begins.

That by itself is ok. I mean shoot, if you are using IE, you must be a glutton for punishment anyway. However, something odd happened. When the user would approve the download, the page would reload with the old url, the "View Class" url. Not the "fixing to download" URL. This meant the user had to hit the button again.

I'm not sure why. It almost seems as if IE never got to the new URL, the one with the loadTest (or loadNote) value. Therefore when the user approves the download, the reload is still on the previous page.

I fixed this (locally, not on the site) by simply getting rid of the "auto download." Now you go to a page that says "Your download is about to begin...." and I use a cfhead tag to add a refresh:

<code>
&lt;cfheader name="refresh" value="1; url=#viewstate.getValue("myself")#load#data.type#&id=#data.id#&doit=true"&gt;
</code>

This essentially reruns the event. The view has an cfelse condition that then uses the cfheader/cfcontent pair to fire off the file.

Everyone say thank you, IE! This plus the recent Flash plugin change just makes me happy I'm a dedicated Firefox user.