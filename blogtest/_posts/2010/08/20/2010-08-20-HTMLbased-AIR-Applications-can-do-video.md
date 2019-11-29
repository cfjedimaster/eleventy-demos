---
layout: post
title: "HTML-based AIR Applications can do video"
date: "2010-08-20T14:08:00+06:00"
categories: [misc]
tags: []
banner_image: 
permalink: /2010/08/20/HTMLbased-AIR-Applications-can-do-video
guid: 3918
---

Thanks, and good night. I'm done.
<p>
Sorry - just kidding. So I've been playing a <b>lot</b> lately with HTML-based Adobe AIR apps (see my PS at the bottom) and one thing I noticed was a dramatic lack of docs concerning video. Everything else seems covered (file reading and writing, database, audio even), but video was conspicuously absent. I discussed this with other guys in our community (my go to guys for HTML/Adobe AIR stuff, Jason Dean and Andy Matthews, although Simeon Bateman recently told me also has done a lot in the HTML side too) and collectively we figured it just didn't work. My rough idea was that it was an HTML issue. By that I mean, there is no tag that says, embed a video and point it so some binary data in a JavaScript variable - and constantly update it as new data streams in.
<p>
<!--more-->
I then spoke with <a href="http://blog.kevinhoyt.org/">Kevin Hoyt</a>, one of the platform evangelists for Adobe. He reminded me (and please forgive me if I get the exact details wrong here) that even when using an HTML-based AIR application, the view is still within a Flash context. In other words, you still get SWF on the back running everything. Because of this, you can work with video, but to display it you need to use native window support. Remember that an HTML/AIR application has the ability to create <i>any</i> type of view (and I plan on having a demo for that up soon) and this goes far beyond your typical window.open example. The upshot is - yes, you can display the video - but it won't be within the DOM of the HTML. You can float it above the right place, but your faking it, not injecting it into the HTML.
 
<p>
To make things even nicer, Kevin also wrote up a quick demo. I'll go through some of the code and you can download the complete application at the bottom. Note that he wrote this <i>very</i> quickly, so it's not perfect, but it definitely works.
<p>

<img src="https://static.raymondcamden.com/images/Capture13.PNG" title="No, I will not Chat Roulette with you." />

<p>

Let's begin with the HTML:

<p>

<code>
&lt;html&gt;
&lt;head&gt;

&lt;title&gt;Web Camera on HTML&lt;/title&gt;

&lt;link rel="stylesheet" type="text/css" href="webcamera.css"&gt;

&lt;script src="lib/air/AIRAliases.js"&gt;&lt;/script&gt;
&lt;script src="lib/jquery/jquery-1.4.2.js"&gt;&lt;/script&gt;
&lt;script src="webcamera.js"&gt;&lt;/script&gt;

&lt;/head&gt;
&lt;body&gt;

&lt;div id="frame"&gt;&lt;/div&gt;
&lt;div id="control" class="button"&gt;Start Web Camera&lt;/div&gt;

&lt;/body&gt;
&lt;/html&gt;
</code>

<p>

As you can see - we've got just a button and a div to frame our video. Remember this all being faked - the div is just a target. Now the code.

<p>

<code>
$( document ).ready( function() {
	
	var video = null;
	var webcam = null;
	
	$( '#frame' ).css( 'left', ( Math.round( ( $( 'body' ).width() - 270 - 70 ) / 2 ) ) + 'px' );	
	$( '#frame' ).css( 'top', ( Math.round( ( $( 'body' ).height() - 195 - 70 ) / 2 ) ) + 'px' );
	air.trace('ran');
	$( '#control' )
		.css( 'left', ( Math.round( ( $( 'body' ).width() - 150 - 12 ) / 2 ) ) + 'px' )
		.click( function( evt ) {
			
			if( video == null )
			{
				webcam = air.Camera.getCamera();
			
				webcam = air.Camera.getCamera();
				webcam.setMode( 320, 240, 15 );
				webcam.setQuality( 0, 100 );
			
				video = new air.Video( 320, 240 );
				video.attachCamera( webcam );
				video.x = Math.round( ( $( 'body' ).width() - 320 ) / 2 );
				video.y = Math.round( ( $( 'body' ).height() - 240 ) / 2 );	
				
				window.htmlLoader.stage.addChild( video );
				
				$( '#control' ).html( 'Stop Web Camera' );					
			} else {
				window.htmlLoader.stage.removeChild( video );
		
				video.attachCamera( null );		
				video = null;
				
				webcam = null;	
							
				$( '#control' ).html( 'Start Web Camera' );							
			}
				
		} 
	);
	
} );
</code>

<p>

So you can see here where he grabs the position of the video frame (the HTML frame), and with that he is then able to position the real video over it. Notice the use of the AIR alias. That right there kind of implies that ya - this really is something supported in the HTML/AIR world. 

<p>

Anyway - hopefully this is interesting to folks and I hopefully didn't butcher up Kevin's nice explanations too much. You can download both the source <i>and</i> the runnable AIR application below.<p><a href='enclosures/C{% raw %}%3A%{% endraw %}5Chosts{% raw %}%5C2009%{% endraw %}2Ecoldfusionjedi{% raw %}%2Ecom%{% endraw %}5Cenclosures{% raw %}%2FWebCam%{% endraw %}2Ezip'>Download attached file.</a></p>