---
layout: post
title: "Mobile version of ColdFusion Bloggers updated"
date: "2011-03-18T10:03:00+06:00"
categories: [coldfusion,jquery,mobile]
tags: []
banner_image: 
permalink: /2011/03/18/Mobile-version-of-ColdFusion-Bloggers-updated
guid: 4162
---

Last night I updated the mobile version of <a href="http://www.coldfusionbloggers.org">ColdFusionBloggers</a>. If you aren't on a mobile device, you can view it in your desktop by going to <a href="http://www.coldfusionbloggers.org/mobile">http://www.coldfusionbloggers.org/mobile</a>. I'm using the 3rd Alpha of <a href="http://www.jquerymobile.com">jQuery Mobile</a> and what you see represents approximately 30 minutes of work. That certainly isn't a testament to my awesomeness, but more a testament to the power of jQuery Mobile, jQuery, and of course, ColdFusion. It isn't quite perfect yet. On the home screen you may notice this icon to the right...

<p/>
<!--more-->
<img src="https://static.raymondcamden.com/images/cfjedi/ScreenClip48.png" />
<p/>

The idea I had was - clicking on the title shows the summary (which could be short or long depending on the RSS feed). Clicking the icon takes you right to the "right" entry, bypassing the need to load the summary and click the show full article button...
<p/>


<img src="https://static.raymondcamden.com/images/cfjedi/ScreenClip49.png" />
<p/>

For the most part, things just worked. I'll paste the entire code base below. The only real issue I ran into was formatted. Some RSS feeds included HTML that broke jQuery Mobile a bit. I do some string manipulation to a) replace HTML breaks with real line breaks and b) remove HTML and c) return the line breaks back into HTML. I got some help from <a href="http://www.boyzoid.com">Scott Stroz</a> on this as well. But to be honest, that was the biggest technical issue. Check out how short the code is below. First, the home page.

<p/>

<code>
&lt;cfif structKeyExists(url, "page") and isNumeric(url.page)&gt;
	&lt;cfset url.start = (url.page-1) * request.perpage + 1&gt;
&lt;/cfif&gt;

&lt;cfparam name="url.start" default="1"&gt;

&lt;cfif not isNumeric(url.start) or url.start lte 0 or url.start neq round(url.start)&gt;
	&lt;cfset url.start = 1&gt;
&lt;/cfif&gt;
&lt;cfset data = application.entries.getEntries(url.start,request.perpage)&gt;
&lt;cfset entries = data.entries&gt;
&lt;!DOCTYPE html&gt;
&lt;html&gt;

&lt;head&gt;
&lt;title&gt;CFBloggers Mobile&lt;/title&gt;
&lt;link rel="stylesheet" href="http://code.jquery.com/mobile/1.0a3/jquery.mobile-1.0a3.min.css" /&gt;
&lt;script src="http://code.jquery.com/jquery-1.5.min.js"&gt;&lt;/script&gt;
&lt;script src="http://code.jquery.com/mobile/1.0a3/jquery.mobile-1.0a3.min.js"&gt;&lt;/script&gt;
&lt;/head&gt;

&lt;body&gt;

&lt;div data-role="page" id="intro"&gt;

	&lt;div data-role="header"&gt;
	&lt;h1&gt;CFBloggers Mobile&lt;/h1&gt;
	&lt;/div&gt;

	&lt;div data-role="content"&gt;
		&lt;ul data-role="listview" data-split-icon="gear"&gt;
		&lt;cfoutput query="entries"&gt;
			&lt;cfset myurl = listFirst(entries.url)&gt;
			&lt;li&gt;
			&lt;a href="display.cfm?entry=#id#"&gt;#title#&lt;/a&gt;
			&lt;a href="/click.cfm?entry=#id#&entryurl=#urlEncodedFormat(myurl)#" data-rel="dialog" rel="external"&gt;View Full Entry&lt;/a&gt;
			&lt;/li&gt;
		&lt;/cfoutput&gt;
		&lt;/ul&gt;
	&lt;/div&gt;

	&lt;div data-role="footer"&gt;
		&lt;h4&gt;Created by Raymond Camden, coldfusionjedi.com&lt;/h4&gt;
	&lt;/div&gt;

&lt;/div&gt;

&lt;cfif not application.dev&gt;
&lt;script type="text/javascript"&gt;
var gaJsHost = (("https:" == document.location.protocol) ? "https://ssl." : "http://www.");
document.write(unescape("{% raw %}%3Cscript src='" + gaJsHost + "google-analytics.com/ga.js' type='text/javascript'%{% endraw %}3E{% raw %}%3C/script%{% endraw %}3E"));
&lt;/script&gt;
&lt;script type="text/javascript"&gt;
var pageTracker = _gat._getTracker("UA-70863-11");
pageTracker._initData();
pageTracker._trackPageview();
&lt;/script&gt;
&lt;/cfif&gt;
&lt;/body&gt;
&lt;/html&gt;
</code>

<p>

And this is the display page.

<p>

<code>
&lt;cfif isDefined("url.entry") and isNumeric(url.entry) and url.entry gte 1 and round(url.entry) is url.entry&gt;
	&lt;cfset entry = application.entries.getEntry(url.entry)&gt;	
&lt;/cfif&gt;

&lt;cfscript&gt;
/**
* An &amp;quot;enhanced&amp;quot; version of ParagraphFormat.
* Added replacement of tab with nonbreaking space char, idea by Mark R Andrachek.
* Rewrite and multiOS support by Nathan Dintenfas.
* 
* @param string      The string to format. (Required)
* @return Returns a string. 
* @author Ben Forta (ben@forta.com) 
* @version 3, June 26, 2002 
*/
function ParagraphFormat2(str) {
    //first make Windows style into Unix style
    str = replace(str,chr(13)&chr(10),chr(10),"ALL");
    //now make Macintosh style into Unix style
    str = replace(str,chr(13),chr(10),"ALL");
    //now fix tabs
    //str = replace(str,chr(9),"&amp;nbsp;&amp;nbsp;&amp;nbsp;","ALL");
     str = replace(str,chr(9),"&nbsp;&nbsp;&nbsp;","ALL");
    //now return the text formatted in HTML
    return replace(str,chr(10),"&lt;br /&gt;","ALL");
}
&lt;/cfscript&gt;

&lt;cfif structKeyExists(variables, "entry") and entry.recordCount is 1&gt;

	&lt;div data-role="page"&gt;
		&lt;cfset portion = reReplace(entry.content, "&lt;p[[:space:]]*/*&gt;", "#chr(10)#", "all")&gt;
		&lt;cfset portion = reReplace(portion, "&lt;br[[:space:]]*/*&gt;", "#chr(10)#", "all")&gt;
		&lt;cfset portion = reReplace(portion, "&lt;.*?&gt;", "", "all")&gt;
		&lt;cfset portion = trim(portion)&gt;
		
		&lt;cfoutput&gt;	
		&lt;div data-role="header"&gt;
			&lt;h1&gt;#entry.title#&lt;/h1&gt;
		&lt;/div&gt;

		&lt;div data-role="content"&gt;
		#paragraphFormat2(portion)#
		
		&lt;p&gt;
		&lt;a href="#entry.url#" data-role="button"&gt;Go to Blog Entry&lt;/a&gt;
		&lt;/p&gt;
		&lt;/div&gt;

		&lt;div data-role="footer"&gt;
			&lt;h4&gt;Created by Raymond Camden, coldfusionjedi.com&lt;/h4&gt;
		&lt;/div&gt;
		&lt;/cfoutput&gt;

	&lt;/div&gt;

&lt;cfelse&gt;
	
		&lt;div data-role="page"&gt;

		&lt;cfoutput&gt;	
		&lt;div data-role="header"&gt;
			&lt;h1&gt;CFBloggers Mobile&lt;/h1&gt;
		&lt;/div&gt;

		&lt;div data-role="content"&gt;
		Invalid entry!
		&lt;/div&gt;

		&lt;div data-role="footer"&gt;
			&lt;h4&gt;Created by Raymond Camden, coldfusionjedi.com&lt;/h4&gt;
		&lt;/div&gt;
		&lt;/cfoutput&gt;

	&lt;/div&gt;
	
&lt;/cfif&gt;
</code>

<p>

There is more I'd like to do - specifically pagination, maybe search as well. Any suggestions would be welcome!