---
layout: post
title: "My first jQuery Mobile experiment"
date: "2010-10-30T16:10:00+06:00"
categories: [coldfusion,jquery]
tags: []
banner_image: 
permalink: /2010/10/30/My-first-jQuery-Mobile-experiment
guid: 3990
---

I've been following the progress on <a href="http://jquerymobile.com/">jQuery Mobile</a> since it was first announced. While I've taken a look at the demos, I had not yet gotten a chance to actually look at the code. This weekend I read Pete Freitag's excellent introductory blog post (<a href="http://www.petefreitag.com/item/766.cfm">Getting Starting with jQuery Mobile</a>) where I discovered just hard darn easy it is. jQuery Mobile does almost all of it's working using simple HTML attributes. That means you can build a simple mobile ready web site <b>without one darn lick of JavaScript</b> - and that's incredible. I took a look at the docs, and basically, if you can write HTML, you can use the framework. As an example, here is what one basic page looks like.
<!--more-->
<p>

<code>
&lt;!DOCTYPE html&gt; 
&lt;html&gt; 
	&lt;head&gt; 
	&lt;title&gt;Page Title&lt;/title&gt; 
	&lt;link rel="stylesheet" href="http://code.jquery.com/mobile/1.0a1/jquery.mobile-1.0a1.min.css" /&gt;
	&lt;script src="http://code.jquery.com/jquery-1.4.3.min.js"&gt;&lt;/script&gt;
	&lt;script src="http://code.jquery.com/mobile/1.0a1/jquery.mobile-1.0a1.min.js"&gt;&lt;/script&gt;
&lt;/head&gt; 
&lt;body&gt; 

&lt;div data-role="page"&gt;

	&lt;div data-role="header"&gt;
		&lt;h1&gt;Page Title&lt;/h1&gt;
	&lt;/div&gt;&lt;!-- /header --&gt;

	&lt;div data-role="content"&gt;	
		&lt;p&gt;Page content goes here.&lt;/p&gt;		
	&lt;/div&gt;&lt;!-- /content --&gt;

	&lt;div data-role="footer"&gt;
		&lt;h4&gt;Page Footer&lt;/h4&gt;
	&lt;/div&gt;&lt;!-- /header --&gt;
&lt;/div&gt;&lt;!-- /page --&gt;

&lt;/body&gt;
&lt;/html&gt;
</code>

<p>

Each page consists of one div with an optional header, content, and footer. This by itself will render as:

<p>

<img src="https://static.raymondcamden.com/images/Capture20.PNG" />

<p>

To add another page, you can just link to it. By default, AJAX is used to load the page and a default transition effect is used. And dude (and dude-ettes) - that's it! Obviously more complex sites will need some JavaScript, but if you are looking at just getting some basic content up you can be done in minutes. 

<p>

With that in mind I decided to build a simple ColdFusion site that provides a view of the art gallery sample database. I began by abstracting out the jQuery Mobile page into a custom tag.

<p>

<code>

&lt;cfparam name="attributes.header" default=""&gt;
&lt;cfparam name="attributes.footer" default=""&gt;

&lt;cfif thisTag.executionMode is "start"&gt;

	
&lt;!DOCTYPE html&gt; 
&lt;html&gt; 
	&lt;head&gt; 
	&lt;title&gt;Art Browser&lt;/title&gt; 
	&lt;link rel="stylesheet" href="http://code.jquery.com/mobile/1.0a1/jquery.mobile-1.0a1.min.css" /&gt;
	&lt;script src="http://code.jquery.com/jquery-1.4.3.min.js"&gt;&lt;/script&gt;
	&lt;script src="http://code.jquery.com/mobile/1.0a1/jquery.mobile-1.0a1.min.js"&gt;&lt;/script&gt;
&lt;/head&gt; 
&lt;body&gt; 

	
&lt;div data-role="page"&gt;

	&lt;cfif len(attributes.header)&gt;
		&lt;cfoutput&gt;
		&lt;div data-role="header"&gt;
			&lt;h1&gt;#attributes.header#&lt;/h1&gt;
		&lt;/div&gt;
		&lt;/cfoutput&gt;
	&lt;/cfif&gt;

&lt;cfelse&gt;

	&lt;cfif len(attributes.footer)&gt;
		&lt;cfoutput&gt;
		&lt;div data-role="footer"&gt;
			&lt;h4&gt;#attributes.footer#&lt;/h4&gt;
		&lt;/div&gt;
		&lt;/cfoutput&gt;
	&lt;/cfif&gt;
	
&lt;/div&gt;

&lt;/body&gt;
&lt;/html&gt;

&lt;/cfif&gt;
</code>

<p>

All I've done above is simple break the page "in half" so I can use it as a wrapper. I then built this as a home page.

<p>

<code>
&lt;cfquery name="getArtists" datasource="cfartgallery"&gt;
select		artistid, firstname, lastname
from		artists
order by	lastname asc
&lt;/cfquery&gt;

&lt;cf_layout header="Artists" footer="jQuery Mobile Demo by Raymond Camden"&gt;

	&lt;div data-role="content"&gt;	
	
		&lt;ul data-role="listview" data-inset="true"&gt;
			&lt;cfoutput query="getArtists"&gt;
			&lt;li&gt;&lt;a href="artist.cfm?id=#artistid#"&gt;#lastname#, #firstname#&lt;/a&gt;&lt;/li&gt;
			&lt;/cfoutput&gt;
		&lt;/ul&gt;
		
	&lt;/div&gt;

&lt;/cf_layout&gt;
</code>

<p>

I felt a bit dirty putting my query in the view, but I got over it. Notice the use of data-role and data-insert. All your jQuery Mobile attributes will look like this. My next page displays the artist and his or her artwork.

<p>

<code>
 &lt;cfparam name="url.id" default=""&gt;

&lt;cfquery name="getArtist" datasource="cfartgallery"&gt;
select		artistid, firstname, lastname, address, city, state, postalcode
from		artists
where		artistid = &lt;cfqueryparam cfsqltype="cf_sql_integer" value="#url.id#"&gt;
&lt;/cfquery&gt;

&lt;cfquery name="getArt" datasource="cfartgallery"&gt;
select		artid, artname
from		art
where		artistid = &lt;cfqueryparam cfsqltype="cf_sql_integer" value="#url.id#"&gt;
and			mediaid is not null
&lt;/cfquery&gt;

&lt;cf_layout header="#getArtist.firstname# #getArtist.lastname#" footer="jQuery Mobile Demo by Raymond Camden"&gt;

	&lt;div data-role="content"&gt;

		&lt;cfoutput&gt;	
		&lt;h2&gt;#getArtist.firstname# #getArtist.lastName#&lt;/h2&gt;
		&lt;p&gt;
		#getArtist.address#&lt;br/&gt;
		#getArtist.city#, #getArtist.state# #getArtist.postalcode#
		&lt;/p&gt;
		&lt;/cfoutput&gt;

		&lt;ul data-role="listview" data-inset="true"&gt;
			&lt;cfoutput query="getArt"&gt;
			&lt;li&gt;&lt;a href="art.cfm?id=#artid#"&gt;#artname#&lt;/a&gt;&lt;/li&gt;
			&lt;/cfoutput&gt;
		&lt;/ul&gt;

	&lt;/div&gt;


&lt;/cf_layout&gt;
</code>

<p>

Again - no JavaScript, just HTML. Finally, here is the art page:

<p>

<code>

&lt;cfparam name="url.id" default=""&gt;

&lt;cfquery name="getArt" datasource="cfartgallery"&gt;
select		a.artid, a.artname, a.description, a.price, a.largeimage, a.issold, m.mediatype
from		art a, media m
where		a.artid = &lt;cfqueryparam cfsqltype="cf_sql_integer" value="#url.id#"&gt;
and			a.mediaid = m.mediaid
&lt;/cfquery&gt;

&lt;cf_layout header="#getArt.artname#" footer="jQuery Mobile Demo by Raymond Camden"&gt;

	&lt;div data-role="content"&gt;

		&lt;cfoutput&gt;	
		&lt;h2&gt;#getArt.artname#&lt;/h2&gt;
		&lt;p&gt;
		Price: #dollarFormat(getArt.price)# &lt;cfif isBoolean(getArt.issold) and getArt.issold&gt;&lt;b&gt;Sold!&lt;/b&gt;&lt;/cfif&gt;&lt;br/&gt;
		Type: #getArt.mediatype#&lt;br/&gt;
		Description: #getArt.description#
		&lt;/p&gt;

		&lt;p&gt;
		&lt;img src="images/#getArt.largeImage#"&gt;
		&lt;/p&gt;
		&lt;/cfoutput&gt;

	&lt;/div&gt;


&lt;/cf_layout&gt;
</code>

<p>

You can see this in action by clicking the big ole demo button below. I tested it in my Android phone and it worked great. I'd love to hear from people using the Fruit Company phone too. I've only scratched the surface here and the framework itself is still in Alpha, but I'm <i>very</i> impressed by the direction of the framework so far.

<p>

<a href="http://www.coldfusionjedi.com/demos/mobileart"><img src="https://static.raymondcamden.com/images/cfjedi/icon_128.png" title="Demo, Baby" border="0"></a>

<p>

Thanks to reader Bill King you can use the following QR code to quickly view the demo: <img src="http://chart.apis.google.com/chart?cht=qr&chs=300x300&chl=http://www.coldfusionjedi.com/demos/mobileart/&chld=H">