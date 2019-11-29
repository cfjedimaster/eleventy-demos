---
layout: post
title: "Playing with jQuery - ColdFusionBloggers.org Update"
date: "2008-05-13T15:05:00+06:00"
categories: [coldfusion,jquery]
tags: []
banner_image: 
permalink: /2008/05/13/Playing-with-jQuery-ColdFusionBloggersorg-Update
guid: 2824
---

A while ago I built and released <a href="http://www.coldfusionbloggers.org">ColdFusionBloggers.org</a> as a way to demonstrate and learn about new ColdFusion 8 Ajax technologies. Since then I've wanted to come back to the site and rebuild it using Spry or JQuery. Not because I wasn't happy with the CF8 Ajax stuff, but because a) it's fun to totally rebuild your own sites and b) I wanted to learn more about jQuery.

I also know that the site had a big footprint. YSlow was reporting around 600k of stuff which is a bit much. I was curious to see what a change to jQuery would be like.

I had looked at jQuery a few weeks back. I sat in a good presentation on jQuery (one that focused on the UI stuff) and it seemed like something that wouldn't be too hard to play with.

I began by working on the main guts of the site - the content div. This is the list of blog entries with pagination. Previously this was done with cfdiv. In general this was a super simple implementation outside of the support I had to do for restoring a page based on URL. 

This was mainly done using ColdFusion.navigate. In jQuery there is a similar function - load. So I replaced:

<code>
ColdFusion.navigate(someurl,somediv)
</code>

with

<code>
$("#content").load(baseurl);
</code>

Simple enough - but not really too much different from the ColdFusion 8 method. 

The next issue I ran into was the contact form. This created two problems for me. First off - it seems as if jQuery's built in UI stuff is still in development. While there are ten billion jQuery plugins, as a new user this is actually more of a bad thing then a good thing. I mean as a new user I had no idea what to use. <a href="http://www.boyzoid.com">Scott Stroz</a> pointed me to <a href="http://dev.iceburg.net/jquery/jqModal/">jqModal</a>, which worked easily enough, although my contact form now is a bit uglier compared to what it used to be.

The second problem was how to handle submitting the form. Once again - ColdFusion had a simple way of doing this - ColdFusion.Ajax.submitForm(formid,url,etc). In jQuery I converted this to $.post("url", {% raw %}{ data and callback here}{% endraw %}). I was a bit surprised that I had to specify the form values. I'm not sure I <i>really</i> need to. The <a href="http://docs.jquery.com/Ajax/jQuery.post">docs</a> say it's optional. But they don't say if it will send the entire form to the URL. I assumed it wouldn't and typed it all out:

<code>
$.post("sendcontact.cfm",{% raw %}{dname:$("#dname").val(),demail:$("#demail").val(),comments:$("#comments").val()}{% endraw %},formDone);
</code>

If I'm right and it is required that you specify the data, then ColdFusion definitely wins here.

Other changes I made were to remove the autosuggest and make the stats pod stop reloading. That was a bit silly in retrospect. 

I'm pretty impressed with jQuery. It's not quite as friendly as Spry, but it does seem pretty darn powerful. I hope the UI project continues to evolve as I think it makes sense for jQuery to provide a "best of breed" UI selection for it's users. 

Oh - and does size matter? Well, my unscientific testing seems to show the new site reacting just as quickly as it used to. YSlow says the size is now down to 200k or so, which is incredible, but I didn't get the "wow" I thought I would with the switch. 

A few quick final notes. The entire site has not been converted to jQuery. The feeds for example still use CF8 UI stuff. The code zip you can download is also out of date now obviously.

Any comments on my use of jQuery are appreciated, but be gentle as I have a grand total of 2-3 hours experience with it!

p.s. I'd especially appreciate a suggestion on how to handle the "loading" status that I lost when I left cfdiv. Right now it's not immediately apparent that you've begun an AJAX request to load new data.