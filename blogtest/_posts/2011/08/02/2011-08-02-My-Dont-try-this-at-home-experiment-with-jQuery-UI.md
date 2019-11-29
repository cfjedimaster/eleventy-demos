---
layout: post
title: "My \"Don't try this at home\" experiment with jQuery UI"
date: "2011-08-02T12:08:00+06:00"
categories: [coldfusion,javascript,jquery]
tags: []
banner_image: 
permalink: /2011/08/02/My-Dont-try-this-at-home-experiment-with-jQuery-UI
guid: 4316
---

It's been a little while since I've played with <a href="http://jqueryui.com/">jQuery UI</a>. I kinda got infatuated with <a href="http://jquerymobile.com">jQuery Mobile</a> and forgot everything else. But it's my love of jQuery Mobile that drove me to try a little experiment. If you've read any of the docs on jQuery Mobile or seen my presentation, you know that it is entirely HTML driven. (That isn't entirely accurate - you do need to write JavaScript for most production apps, but for prototypes, quick tests, etc, you can do a <i>heck</i> of a lot with just HTML.) So for example, this will generate a mobile friendly list:
<!--more-->
<p>

<code>
&lt;div data-role="page" id="page"&gt;
	&lt;div data-role="header"&gt;
		&lt;h1&gt;Page One&lt;/h1&gt;
	&lt;/div&gt;
	&lt;div data-role="content"&gt;	
		&lt;ul data-role="listview"&gt;
			&lt;li&gt;&lt;a href="#page2"&gt;Page Two&lt;/a&gt;&lt;/li&gt;
            &lt;li&gt;&lt;a href="#page3"&gt;Page Three&lt;/a&gt;&lt;/li&gt;
			&lt;li&gt;&lt;a href="#page4"&gt;Page Four&lt;/a&gt;&lt;/li&gt;
		&lt;/ul&gt;		
	&lt;/div&gt;
	&lt;div data-role="footer"&gt;
		&lt;h4&gt;Page Footer&lt;/h4&gt;
	&lt;/div&gt;
&lt;/div&gt;
</code>

<p/>

When jQuery Mobile loads, it looks at the data-* attributes and does magic voodoo to turn them into mobile friendly components. I love this and it's the main reason I think jQuery Mobile is going to be the primary way folks do HTML-based mobile applications. That being said - I wondered if the same approach would work with jQuery UI. jQuery UI does require a bit of JavaScript, but certainly not much. Consider the following simple tab example.

<p/>

<code>

&lt;script&gt;
$(function() {
	$( "#tabs" ).tabs();
});
&lt;/script&gt;

&lt;div id="tabs"&gt;
	&lt;ul&gt;
		&lt;li&gt;&lt;a href="#tabs-1"&gt;Nunc tincidunt&lt;/a&gt;&lt;/li&gt;
		&lt;li&gt;&lt;a href="#tabs-2"&gt;Proin dolor&lt;/a&gt;&lt;/li&gt;
		&lt;li&gt;&lt;a href="#tabs-3"&gt;Aenean lacinia&lt;/a&gt;&lt;/li&gt;
	&lt;/ul&gt;
	&lt;div id="tabs-1"&gt;
		&lt;p&gt;Proin elit arcu, rutrum commodo, vehicula tempus, commodo a, risus. Curabitur nec arcu. Donec sollicitudin mi sit Aliquam nulla. Duis aliquam molestie erat. Ut et mauris vel pede varius sollicitudin. Sed ut dolor nec orci tincidunt interdum. Phasellus ipsum. Nunc tristique tempus lectus.&lt;/p&gt;
	&lt;/div&gt;
	&lt;div id="tabs-2"&gt;
		&lt;p&gt;Morbi tincidunt, dui sit amet facilisis feugiat, odio metus gravida ante, ut pharetra massa metus id nunc. Duis scelerisque molestie turpis. Sed fringilla, massa eget luctus malesuada, metus eros molestie lectus, ut tempus eros massa ut ornare leo nisi vel felis. Mauris consectetur tortor et purus.&lt;/p&gt;
	&lt;/div&gt;
	&lt;div id="tabs-3"&gt;
		&lt;p&gt;Mauris eleifend est et turpis. Duis id erat. Suspendisse potenti. Aliquam vulputate, pede vel vehicula accumsan, mi neque rutrum erat, eu congue orci lorem eget lorem. Vestibulum non ante. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Fusce sodales. Quisque eu urna vel enim commodo pellentesque. Praesent eu risus hendrerit ligula tempus pretium. Curabitur lorem enim, pretium nec, feugiat nec, luctus a, lacus.&lt;/p&gt;
	&lt;/div&gt;
&lt;/div&gt;
</code>

<p>

So for jQuery UI, the typical component is created via existing HTML that gets "turned on" by a JavaScript statement. Not difficult at all - but what if you could do it entirely via HTML?

<p/>

<code>
&lt;div data-role="tabs"&gt;
	&lt;ul&gt;
		&lt;li&gt;&lt;a href="#tabs-1"&gt;Nunc tincidunt&lt;/a&gt;&lt;/li&gt;
		&lt;li&gt;&lt;a href="#tabs-2"&gt;Proin dolor&lt;/a&gt;&lt;/li&gt;
		&lt;li&gt;&lt;a href="#tabs-3"&gt;Aenean lacinia&lt;/a&gt;&lt;/li&gt;
	&lt;/ul&gt;
	&lt;div id="tabs-1"&gt;
		&lt;p&gt;Proin elit arcu, rutrum commodo, vehicula tempus, commodo a, risus. Curabitur nec arcu. Donec sollicitudin mi sit Phasellus ipsum. Nunc tristique tempus lectus.&lt;/p&gt;
	&lt;/div&gt;
	&lt;div id="tabs-2"&gt;
		&lt;p&gt;Morbi tincidunt, dui sit amet facilisis feugiat, odio metus gravida ante, ut pharetra massa metus id nunc. Duis scelerisque molestie turpis. Sed fringilla, massa eget luctus malesuada, metus eros molestie lectus, ut tempus eros massa ut ornare leo nisi vel felis. Mauris consectetur tortor et purus.&lt;/p&gt;
	&lt;/div&gt;
	&lt;div id="tabs-3"&gt;
		&lt;p&gt;Mauris eleifend est et turpis. Duis id erat. Suspendisse potenti. Aliquam vulputate, pede vel vehicula accumsan, mi conubia nostra, per inceptos himenaeos. Fusce sodales. Quisque eu urna vel enim commodo pellentesque. Praesent eu risus hendrerit ligula tempus pretium. Curabitur lorem enim, pretium nec, feugiat nec, luctus a, lacus.&lt;/p&gt;
	&lt;/div&gt;
&lt;/div&gt;
</code>

<p>

Notice the new data attribute up there? I wrote a new JavaScript file called jqua.js (jQuery UI Automatic) that simply looks for this on document load. Here is a snippet from the file to give you an idea of what I mean:

<p>

<code>
tabs = $("body").find("[data-role=\"tabs\"]");
for(var i=0;i&lt;tabs.length;i++) {
	$(tabs[i]).tabs();
	//scan for selected
	sel = $(tabs[i]).find("[data-selected='true']");
	if(sel.length) $(tabs[i]).tabs("select",$(sel).attr("id"));
}
</code>

<p>

Notice I also look for a selected tab. Normally you have to do via JavaScript in jQuery UI, but my modification allows for this:

<p>

<code>

&lt;div data-role="tabs"&gt;
	&lt;ul&gt;
		&lt;li&gt;&lt;a href="#tabs-1"&gt;Nunc tincidunt&lt;/a&gt;&lt;/li&gt;
		&lt;li&gt;&lt;a href="#tabs-2"&gt;Proin dolor&lt;/a&gt;&lt;/li&gt;
		&lt;li&gt;&lt;a href="#tabs-3"&gt;Aenean lacinia&lt;/a&gt;&lt;/li&gt;
	&lt;/ul&gt;
	&lt;div id="tabs-1"&gt;
		&lt;p&gt;Proin elit arcu, rutrum commodo, vehicula tempus, commodo a, risus. Curabitur nec arcu. Donec sollicitudin mi sit Phasellus ipsum. Nunc tristique tempus lectus.&lt;/p&gt;
	&lt;/div&gt;
	&lt;div id="tabs-2" &gt;
		&lt;p&gt;Morbi tincidunt, dui sit amet facilisis feugiat, odio metus gravida ante, ut pharetra massa metus id nunc. Duis scelerisque molestie turpis. Sed fringilla, massa eget luctus malesuada, metus eros molestie lectus, ut tempus eros massa ut ornare leo nisi vel felis. Mauris consectetur tortor et purus.&lt;/p&gt;
	&lt;/div&gt;
	&lt;div id="tabs-3" data-selected="true"&gt;
		&lt;p&gt;Mauris eleifend est et turpis. Duis id erat. Suspendisse potenti. Aliquam vulputate, pede vel vehicula accumsan, mi conubia nostra, per inceptos himenaeos. Fusce sodales. Quisque eu urna vel enim commodo pellentesque. Praesent eu risus hendrerit ligula tempus pretium. Curabitur lorem enim, pretium nec, feugiat nec, luctus a, lacus.&lt;/p&gt;
	&lt;/div&gt;
&lt;/div&gt;
</code>

<p>

Notice the third tab there is selected. So to be fair, this isn't really saving you a lot. I thought autocomplete may be a cooler example. Here is the first demo from the site - note it doesn't include any of the script/css includes:

<p>

<code>
&lt;script&gt;
	$(function() {
		var availableTags = [
			"ActionScript",
			"AppleScript",
			"Asp",
			"BASIC",
			"C",
			"C++",
			"Clojure",
			"COBOL",
			"ColdFusion",
			"Erlang",
			"Fortran",
			"Groovy",
			"Haskell",
			"Java",
			"JavaScript",
			"Lisp",
			"Perl",
			"PHP",
			"Python",
			"Ruby",
			"Scala",
			"Scheme"
		];
		$( "#tags" ).autocomplete({
			source: availableTags
		});
	});
	&lt;/script&gt;

&lt;div class="ui-widget"&gt;
	&lt;label for="tags"&gt;Tags: &lt;/label&gt;
	&lt;input id="tags"&gt;
&lt;/div&gt;
</code>

<p>

Now here is my version:

<p>

<code>
&lt;input name="foo" data-role="autocomplete" data-source="ActionScript,AppleScript,Asp,BASIC,C,C++,Clojure,COBOL,ColdFusion,etc" /&gt;
</code>

<p>

My code assumes a simple list and doesn't support complete objects, but you get the idea. I supported a remote URL like so:

<p>

<code>
&lt;input name="foo" data-role="autocomplete" data-sourceurl="data.cfm" /&gt;
</code>

<p>

And yep, that just plain works. I did a quick mock up for the Accordion control as well, but ran into issues getting the default working. For folks who want to play with this, I've included a zip of my tests. To be clear - this is just an experiment and is not meant to be taken seriously.<p><a href='enclosures/C{% raw %}%3A%{% endraw %}5Chosts{% raw %}%5C2009%{% endraw %}2Ecoldfusionjedi{% raw %}%2Ecom%{% endraw %}5Cenclosures{% raw %}%2Fjqudemo%{% endraw %}2Ezip'>Download attached file.</a></p>