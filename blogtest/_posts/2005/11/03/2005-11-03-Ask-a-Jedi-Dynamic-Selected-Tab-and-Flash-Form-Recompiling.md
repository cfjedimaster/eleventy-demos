---
layout: post
title: "Ask a Jedi: Dynamic Selected Tab and Flash Form Recompiling"
date: "2005-11-03T16:11:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2005/11/03/Ask-a-Jedi-Dynamic-Selected-Tab-and-Flash-Form-Recompiling
guid: 897
---

Gerald asks, 

<blockquote>
Ray, I am trying to get back to a tabbed page from my process.cfm by checking for the existance of the btn that submitted the form (each tab has it's own unique button for submitting to process.cfm). Then I set a URL var and cfrelocation back to the flash form where the selectedItem="#url.currtab#". Works great except the darn flash form reinitializes every time because that attribute gets changed. How can I do this without causing a recompile of the form?
</blockquote>

Yes, it is possible - and this solution comes right from <a href="http://www.mikenimer.com">Mike Nimer</a> (aka 'The Flash Form Guy'). Instead of using selectedIndex="#url.currTab#", you can bind the value to a hidden form field. Consider:

<code>
&lt;cfparam name="url.tab" default="0"&gt;

&lt;cfform format="flash" width="400" height="200" name="foo"&gt;

	&lt;cfinput type="hidden" name="thetab" value="#url.tab#"&gt;
	&lt;cfformgroup type="tabnavigator" selectedIndex="{% raw %}{foo.thetab.text}{% endraw %}"&gt;
	
		&lt;cfformgroup type="page" label="Tab One" /&gt;
		&lt;cfformgroup type="page" label="Tab Two" /&gt;
		&lt;cfformgroup type="page" label="Tab Three" /&gt;
		&lt;cfformgroup type="page" label="Tab Four" /&gt;
		
	&lt;/cfformgroup&gt;
&lt;/cfform&gt;

&lt;cfoutput&gt;
&lt;a href="#cgi.script_name#?tab=0"&gt;Tab 1&lt;/a&gt;&lt;br&gt;
&lt;a href="#cgi.script_name#?tab=1"&gt;Tab 2&lt;/a&gt;&lt;br&gt;
&lt;a href="#cgi.script_name#?tab=2"&gt;Tab 3&lt;/a&gt;&lt;br&gt;
&lt;a href="#cgi.script_name#?tab=3"&gt;Tab 4&lt;/a&gt;&lt;br&gt;
&lt;/cfoutput&gt;
</code>

Notice how the value for selectedIndex isn't hard coded, but bound to the hidden form field. Also note how you have to use <i>formname.fieldname</i> when binding to a hidden field. For a non-hidden field, you can just use <i>fieldname</i>. Also note that the selectedIndex for a navigator item is 0 based - in other words, tab 1 is index 0, tab 2 is index 1, etc.

Enjoy - and again - thank Nimer for this tip. (Unless it is broken - then um - it is a Microsoft bug. Yeah, that's it!)