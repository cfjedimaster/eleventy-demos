---
layout: post
title: "Update to ColdFusionBloggers.org: Ajax-based Contact Form"
date: "2007-07-27T14:07:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2007/07/27/Update-to-ColdFusionBloggersorg-Ajaxbased-Contact-Form
guid: 2225
---

Today's update to <a href="http://www.coldfusionbloggers.org">ColdFusionBloggers.org</a>  adds a new Contact form to the site. Unlike the traditional contact form, this one is entirely Ajax based. Hop over to the site and click on "Contact" to see what I mean. The idea for this came from <a href="http://cfsilence.com/blog/client/">Todd Sharp</a>. 

The idea is simple. Instead of linking to a contact page, I used the JavaScript API in ColdFusion 8 to create a new window:

<code>
function showContact() {
	ColdFusion.Window.create("contact","Contact Us","contact.cfm",{% raw %}{center:true,modal:true,draggable:true,width:550,height:375}{% endraw %})
}
</code>

The first attribute names the window, the second gives it a title, the third assigns the URL, and the last argument is an set of options for the window.

Contact.cfm is mostly simple example for a few things. First off - when you build code that is loaded into an Ajax control (like a window, or div), you need to write your JavaScript functions like so:

<code>
foo = function()
</code>

instead of:

<code>
function foo()
</code>

Next notice how I submitted the form:

<code>
ColdFusion.Ajax.submitForm("contactForm","sendcontact.cfm",formDone);
</code>

The submitForm function is one more part of the JavaScript API. I'm using it here to specify a form, a URL to post, and a function to run when done. I could have also specified an error function to run. For this site though I just kept it simple and assumed the back end worked correctly. 

All in all I think this is a cool feature. Now I'll remind folks that this is all new (CF8, Ajax, you get the idea), so I'll probably do things differently later on. If you play with the contact form, please say DELETE ME in the comments so I know to ignore it.

Another new feature was suggested by <a href="http://www.boyzoid.com">Scott Stroz</a>. He asked if the RSS feed could show more items. He threatened to never drink beer with me again unless I added this feature, so I really had no choice. You can supply a max= argument to the feed to get more than 10 items. (Up to 100.) I'm seeing some odd display issues in Firefox when I do a large RSS feed but the XML looks ok. 

If it isn't obvious, my "proof of concept" site is becoming a lot more than just 2 CFCs and some display logic. I'm enjoying working on it and am planning on adding more features. Next up will be click tracking. Anyone here actually <i>using</i> the site? I'd like to know - whether you are using it for a real aggregator or as a ColdFusion 8 example.

<b>Quick Edit:</b> I ran into a bug where the contact form wasn't working correctly on pages below index.cfm. Turns out I needed my cfajaximport. Because I don't have a cfwindow tag on the pages itself, ColdFusion didn't know to load the relevant JavaScript files. Therefore you have to warn ColdFusion to do so. I'm going to break this tip out into a separate blog entry later today.