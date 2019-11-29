---
layout: post
title: "jQTouch Notes"
date: "2010-07-25T12:07:00+06:00"
categories: [misc]
tags: []
banner_image: 
permalink: /2010/07/25/jqTouch-Notes
guid: 3888
---

Last week I finally got to play with <a href="http://www.jqtouch.com/">jQTouch</a>, a jQuery based framework for building mobile-ready web sites. It was... rough to say the least. I'm very happy with the final result, but it took a bit of work to figure out how jQTouch <i>wanted</i> to work and what I should be doing with it. What follows are some basic notes, discoveries, and tips. I warn you though - most likely some of what follows could be a misunderstanding on my part.
<!--more-->
<p>

1) First and foremost, jQTouch is really meant for web applications that are menu driven. When designing your application, you want to think in terms of menus and sections. Your primary UI will be menus and forms. 

<p>

2) jQTouch works by convention. By using a button with a certain class, you build a back button. By using a link, you implicitly create an Ajax request. None of this was very clear to me at all. 

<p>

3) The demos, for the most part, work around the idea of one file. The file contains all the menus and "pages" for the application. I don't think this is very realistic. A simple application can do this, but anything dynamic and of intermediate complexity will want separate files. 

<p>

4) Given the above, here is a very basic, but complete template.

<p>

<code>
&lt;html&gt;
&lt;head&gt;
&lt;script src="js/jquery.js"&gt;&lt;/script&gt;
&lt;script src="js/jqtouch.min.js" type="application/x-javascript" charset="utf-8"&gt;&lt;/script&gt;
&lt;style type="text/css" media="screen"&gt;@import "css/jqtouch.min.css";&lt;/style&gt;
&lt;style type="text/css" media="screen"&gt;@import "themes/jqt/theme.min.css";&lt;/style&gt;

&lt;script&gt;
$.jQTouch({
    icon: 'jqtouch.png',
    statusBar: 'black-translucent'
});
	&lt;/script&gt;
&lt;/head&gt;

&lt;body&gt;

	&lt;div id="home"&gt;
		&lt;div class="toolbar"&gt;&lt;h1&gt;Your App&lt;/h1&gt;&lt;/div&gt;

		&lt;ul class="rounded"&gt;
			&lt;li class="arrow"&gt;&lt;a href="#about"&gt;About&lt;/a&gt;&lt;/li&gt;
			&lt;li class="arrow"&gt;&lt;a href="#unicorn"&gt;Unicorn&lt;/a&gt;&lt;/li&gt;
		&lt;/ul&gt;
	&lt;/div&gt;

	&lt;div id="about"&gt;

	    &lt;div class="toolbar"&gt;
	        &lt;h1&gt;About&lt;/h1&gt;
	        &lt;a class="button cancel" href="#"&gt;Return&lt;/a&gt;
	    &lt;/div&gt;

		&lt;p&gt;
		Hello World
		&lt;/p&gt;
		
	&lt;/div&gt;

	&lt;div id="unicorn"&gt;

	    &lt;div class="toolbar"&gt;
	        &lt;h1&gt;Unicorn&lt;/h1&gt;
	        &lt;a class="button cancel" href="#"&gt;Return&lt;/a&gt;
	    &lt;/div&gt;

		&lt;p&gt;
		Hello, Unicorns
		&lt;/p&gt;
		
	&lt;/div&gt;

&lt;/body&gt;
&lt;/html&gt;
</code>

<p>

From top to bottom, here is what you need:

<ul>
<li>Need to load jQuery and the jQTouch JS library.
<li>Need to load the JQTouch CSS, and one theme file. jQTouch ships with two themes.
<li>You need to startup jQTouch. There are many initialization options (detailed <a href="http://code.google.com/p/jqtouch/wiki/InitOptions">here</a>).
<li>Now for the important part. Your "home" DIV is your home page. It consists of a toolbar and a set of links. Those classes are recognized by jQTouch and help generate the UI. Notice the links! They are both anchor links. This means they are expected to be within the file itself.
<li>Scrolling down, you see two blocks that match up with the anchor links above. Once again each one has a toolbar. 
</ul>

<p>

That's basically it for a simple app. Here is a screen shot of the home page:

<p>

<img src="https://static.raymondcamden.com/images/Screen shot 2010-07-25 at 10.23.12 AM.png" />

<p>

And here is a shot of one of the "pages":

<p>

<img src="https://static.raymondcamden.com/images/cfjedi/Screen shot 2010-07-25 at 10.23.53 AM.png" />

<p>

Because of the CSS conventions we used, that's all you have to do. Clicking the menu link loads the page. Clicking Return brings you back home. It just plain works.

<p>

5) So hey, notice how that page doesn't render terribly nicely? The toolbar is fine, but the actual page content ain't so hot. This is something that really bugged me. All of the demos focused on menus and forms, but never showed "simple" content in a nice display. I asked about this on the Google Group (by the way, another big tip is to use the <a hef="http://groups.google.com/group/jqtouch">jQTouch Google Group</a>) and the suggestion was to add CSS. I'm kinda surprised this doesn't exist already. Here is the CSS I added for my application.

<p>

<code>

&lt;style&gt;
.body {
	-webkit-border-radius: 8px;
	-webkit-box-shadow: rgba(0,0,0,.3) 1px 1px 3px;
	padding: 10px 10px 10px 10px;
	margin:10px;
    background: -webkit-gradient(linear, 0{% raw %}% 0%{% endraw %}, 0{% raw %}% 100%{% endraw %}, from(#4c4d4e), to(#404142));
	word-wrap:break-word;
}

.body a {
	color: white;
}

.body p {
	margin-bottom: 10px;	
}
&lt;/style&gt;
</code>

<p>

I then wrapped the paragraphs in my 2 "pages" with the div class="body" tags. The result is a better looking page (imho):

<p>

<img src="https://static.raymondcamden.com/images/cfjedi/Screen shot 2010-07-25 at 10.50.10 AM.png" />
<p>

6) So, I mentioned earlier that by default, jQTouch expects your pages to be in the same page. I don't think that makes much sense for a dynamic application. Luckily it's easy enough to work around. Any link that is <i>not</i> an anchor link is automatically converted to an AJAX get request. Let's add a link to our menu:

<p>

<code>
&lt;ul class="rounded"&gt;
	&lt;li class="arrow"&gt;&lt;a href="#about"&gt;About&lt;/a&gt;&lt;/li&gt;
	&lt;li class="arrow"&gt;&lt;a href="#unicorn"&gt;Unicorn&lt;/a&gt;&lt;/li&gt;
	&lt;li class="arrow"&gt;&lt;a href="cylon.html"&gt;Cylon&lt;/a&gt;&lt;/li&gt;
&lt;/ul&gt;
</code>

<p>

Next we add a cylon.html file. Remember this is loaded via Ajax. Therefore, we just need our toolbar and body divs.

<p>

<code>
&lt;div id="about"&gt;

    &lt;div class="toolbar"&gt;
        &lt;h1&gt;Cylons&lt;/h1&gt;
        &lt;a class="button cancel" href="#"&gt;Return&lt;/a&gt;
    &lt;/div&gt;

	&lt;div class="body"&gt;
	&lt;p&gt;
	Remember the basic rule. If the person is ugly, they can't be a Cylon in disguise. 
	&lt;/p&gt;
	&lt;/div&gt;
	
&lt;/div&gt;
</code>

<p>

7) Ok, so what if you don't want to use AJAX for the request? For example, I had a logout link and I needed it to reload the entire page. This <a href="http://www.golen.net/blog/2010/04/28/jqtouch-link-behaviors/">blog entry</a> by Tim Golen describes all the way links work. If you don't feel like clicking the link, just add rel="external" to your links.

<p>

8) So the fact that AJAX is used to load stuff brought up two interesting problems for me. The first problem was authentication. My application has a login screen and I present the jQTouch UI <i>after</i> you logged in. I did this with a simple location() call in onRequestStart. This breaks when the AJAX request calls a page and you've logged off. I don't have my solution yet - but what I'm going to do is detect the AJAX request (which is <a href="http://insideria.com/2009/04/jqueryserver-side-tip-on-detec.html">super easy</a>) and output something jQTouch can pick up on. Speaking of that...

9) The second issue I had was trying to do crap when the page loaded. I built my pages with the assumption that I could just use $(document).ready. This <i>kinda</i> worked. Well, no, not really. Most likely it was something I did wrong. jQTouch provides a set of <a href="http://code.google.com/p/jqtouch/wiki/CallbackEvents">events</a> that you can listen to for your application. The event you want to use is pageAnimationEnd. The example in their docs though assume a one page app and makes use of bind. I had to make use of live instead. Here is an example:

<p>

<code>
$('#somepage').live('pageAnimationEnd', function(event, info){
		if (info.direction == 'in') {
</code>

<p>

In this example, somepage is the ID of the main div around the page. info.direction will either be in or out. I used "in" as a way of handling the page load and "out" as a way of handling the page ending. This was pretty useful for me as the page in question needed a JavaScript interval. So I started it up when the page loaded and killed it when the page ended. 

<p>

That's all I have for now. I linked to the Google Group above (but here it is <a href="http://groups.google.com/group/jqtouch">again</a>) - I'll also point out the Wiki: <a href="http://code.google.com/p/jqtouch/w/list">http://code.google.com/p/jqtouch/w/list</a>. It is a bit more fleshed out then I remember it from last time. I've pasted a zip of my simple demo above. It should work fine anywhere. For my testing I use Safari shrunk as small as possible. I've also tested my application on both my Nexus One and an iPod Touch, and in both it looks fantastic. So despide the "roughness" of the framework for me, I definitely think it's pretty darn cool! I hope these tips help, and if anyone wants to add some additional tips, be my guest.<p><a href='enclosures/C{% raw %}%3A%{% endraw %}5Chosts{% raw %}%5C2009%{% endraw %}2Ecoldfusionjedi{% raw %}%2Ecom%{% endraw %}5Cenclosures{% raw %}%2Fjqtouchdemo1%{% endraw %}2Ezip'>Download attached file.</a></p>