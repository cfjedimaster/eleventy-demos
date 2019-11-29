---
layout: post
title: "Best of CF9: cf_ext_navbar"
date: "2009-12-13T21:12:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2009/12/13/Best-of-CF9-cfextnavbar
guid: 3646
---

<img src="https://static.raymondcamden.com/images/cfjedi/bestcfcontest1.jpg" title="Best of ColdFusion 9" align="left" style="margin-right:5px;margin-bottom:5px"/> Today's entry is cf_ext_navbar. It was submitted by Andrew Duval and reviewed by Todd Sharp. Todd's review is below in it's entirety with no editing from me. Thanks Andrew and Todd!

This contest entry is called CF_EXT_NAVBAR'and was created by Andrew Duvall and is an example of how to utilize the Ext3 JavaScript library included with ColdFusion 9.  Many developers were thrilled when they learned that the Ext libraries that power the ColdFusion Ajax and UI widgets was being upgraded to the most recent version of the popular framework because there were a number of significant upgrades since the launch of ColdFusion 8 which bundled Ext 1.0.  Andrew's entry demonstrates the required libraries and scripts to create a "navbar" widget.

When I first ran the entry I had the same reaction that I usually have when I see Ext widgets - "wow, that's pretty cool looking." Here's what the entry looks like:

<img src="https://static.raymondcamden.com/images/cfjedi/1.png" />

My next step was to load up the code in ColdFusion Builder and once I got that done I loaded the entry up in the internal browser so I could have a peek at the code and the entry at the same time.  Unfortunately what I saw in the internal browser wasn't so pretty:

<img src="https://static.raymondcamden.com/images/cfjedi/2.png" />

Turns out my default browser in CF Builder was set to IE and since IE can't render HTML properly like every other browser on earth there was a bit of a problem.  To be fair to Andrew, I'm sure this isn't his fault.  What surprises me is that the Ext folks never caught this issue with the navbar in IE.

At this point I had the same second thought that I always do when I see Ext widgets - "I wonder how many scripts had to be imported just to create a simple navbar?"   I opened up Firebug and took a look:

<img src="https://static.raymondcamden.com/images/cfjedi/3.png" />

I was pretty shocked to see 590 KB of scripts and images for a simple navbar widget especially since my local environment uses gzip compression on scripts.  The majority (519KB out of 590KB) of that bloat does come from a single  file – 'ext-all-debug.js' which I'm pretty sure is the core Ext library (and is actually 2.5MB before being gzip'd).    I swapped out the 'ext-all-debug.js' for the minified 'ext-all.js' and the total script size dropped down to 238 KB – much easier to swallow (but still pretty large for a simple navbar in my opinion).  The fact that about 99% of the scripts and images are served from cache on subsequent page requests makes all of this a bit irrelevant if you were creating a full blown application but it's something to keep in mind if you're thinking of just dropping in a simple widget on a page somewhere.

So let's take a look at some of the code.  I really would have liked if Andrew would have wrapped this up in a custom tag but since this is just a simple example I'll give him a pass on that.  The first thing that caught my eye was the following – and this isn't necessarily related to ColdFusion 9, but it is a pet peeve of mine so I thought it was worth mentioning:

<code>
&lt;cfif ListContainsNoCase('small,medium,large', scaleSize) EQ 0&gt;
    	&lt;!--- alright, this is not a hacker challenge here; i expect only small, medium, or large to be passed in the URL for this demo  ---&gt;
	&lt;cfset scaleSize = "large"&gt;
&lt;/cfif&gt;   
&lt;cfset scaleSize = lcase(scaleSize) /&gt;&lt;!--- it is case sensitive inside the js ---&gt;

&lt;cfscript&gt;
//NOTE: by changing [scaleSize] it retrieves the proper icons from the properly scaled icon folder
//scaleSize = "large"; // values: small, medium, or large
if (scaleSize EQ "small") {
iconSize = "16"; // 16*16
}
else if (scaleSize EQ "medium") {
iconSize = "24"; // 24*24
}
else {
iconSize = "32"; // 32*32
} 
&lt;/cfscript&gt;
</code>

So he starts out with a simple logic check that sets the 'scaleSize' variable as appropriate and then he does some simple clean up to make sure the variable is lower case.  So far, so good, but then he immediately jumps into a <cfscript> block to do some more conditional variable setting.  He stays in cfscript for a little while but jumps back to using tags when he's generating some JavaScript later on.  Personally I'm not a fan of cfscript, but I won't take anything away from those who are.  My biggest issue is that jumping back and forth between tags and script creates inconsistent code that is difficult to read and follow.  Now that CF9 has full cfscript support there is really no excuse to not pick one style and stick with it.  

The next part I found a bit perplexing was the fact that Andrew created a 2d array of values in ColdFusion and then manually looped over the values to create the required JavaScript to create the navbar.  Here's a snippet from his code that creates the 2d array:

<code>
&lt;cfscript&gt;
stNavBar1.title[1] = "HOME";
stNavbar1.url[1] = "index.cfm";
stNavbar1.iconCls[1] = "icon-menu#iconSize#-1";

stNavBar1.title[2] = "SECOND BUTTON";
stNavbar1.url[2] = "index.cfm";
stNavbar1.iconCls[2] = "icon-menu#iconSize#-2";

stNavBar1.title[3] = "SCALE THE TOOLBAR";
stNavbar1.url[3] = "index.cfm";
stNavbar1.iconCls[3] = "icon-menu#iconSize#-3";

stNavBar2.title[3][1]= "Let's see a LARGE Toolbar";			
stNavbar2.url[3][1] = "index.cfm?scaleSize=large";
stNavbar2.iconCls[3][1] = "icon-6-1";

stNavBar2.title[3][2]= "Let's see a MEDIUM Toolbar";			
stNavbar2.url[3][2] = "index.cfm?scaleSize=medium";
stNavbar2.iconCls[3][2] = "icon-6-1";

stNavBar2.title[3][3]= "Let's see a SMALL Toolbar";			
stNavbar2.url[3][3] = "index.cfm?scaleSize=small";
stNavbar2.iconCls[3][3] = "icon-6-1";
&lt;/cfscript&gt;
</code>

And here is how he looped over it to create the JavaScript:

<code>
var mymenu=new SamplePanel({

	tbar: [{
		xtype:'buttongroup',
		hideBorders:'true',
		items: [
		&lt;cfloop index="i" from="1" to="#ArrayLen(stNavBar1.title)#"&gt;
		&lt;cfif i NEQ 1&gt;,&lt;/cfif&gt;
		{
			&lt;cfif arrayLen(stNavBar2.title[i]) GT 0&gt;
				xtype:'splitbutton', 
				text: '&lt;cfoutput&gt;#stNavBar1.title[i]#&lt;/cfoutput&gt;',
				iconCls: '&lt;cfoutput&gt;#stNavBar1.iconCls[i]#&lt;/cfoutput&gt;',
				scale: '&lt;cfoutput&gt;#scaleSize#&lt;/cfoutput&gt;',
				handler: navigate,
				url: '&lt;cfoutput&gt;#stNavBar1.url[i]#&lt;/cfoutput&gt;',					
				menu: [
				&lt;cfloop index="j" from="1" to="#ArrayLen(stNavBar2.title[i])#"&gt;
				&lt;cfif j NEQ 1&gt;,&lt;/cfif&gt;
				{                                	
					text: "&lt;cfoutput&gt;#stNavBar2.title[i][j]#&lt;/cfoutput&gt;",						
					iconCls: "&lt;cfoutput&gt;#stNavBar2.iconCls[i][j]#&lt;/cfoutput&gt;",						
					tooltip:' &lt;cfoutput&gt;#stNavBar2.url[i][j]#&lt;/cfoutput&gt;',
					url: '&lt;cfoutput&gt;#stNavBar2.url[i][j]#&lt;/cfoutput&gt;',
					handler: navigate
				}
				&lt;/cfloop&gt;
				]
			&lt;cfelse&gt;
				text: '&lt;cfoutput&gt;#stNavBar1.title[i]#&lt;/cfoutput&gt;',
				iconCls: '&lt;cfoutput&gt;#stNavBar1.iconCls[i]#&lt;/cfoutput&gt;',
				scale: '&lt;cfoutput&gt;#scaleSize#&lt;/cfoutput&gt;',
				handler: navigate,
				url: '&lt;cfoutput&gt;#stNavBar1.url[i]#&lt;/cfoutput&gt;'
			&lt;/cfif&gt;
		}
		&lt;/cfloop&gt;
	]
}]
</code>

While that certainly works I tend to think he's overcomplicating things a bit.  Take a look at a sample of the generated source code:

<code>
[
	{
					
	text: 'HOME',
	iconCls: 'icon-menu24-1',
	scale: 'medium',
	handler: navigate,
	url: 'index.cfm'
	}
	//additional objects as needed – possibly nested
]
</code>

So Ext is basically looking for a simple array of objects.  To me it would have been much simpler (and easier to read) to just create an array of structs in CF and serialize it as JSON.  Here's one way that might have looked.  Remember that you'll need to use associative array, or 'bracket' notation to keep CF from changing the case of your struct keys when serializing.

<code>
&lt;cfset menuArr = arrayNew(1) /&gt;
&lt;cfset menuItem = structNew() /&gt;
&lt;cfset menuItem["text"] = "TODD" /&gt;
&lt;cfset menuItem["iconCls"] = "icon-menu24-1" /&gt;
&lt;cfset menuItem["scale"] = "medium" /&gt;
&lt;cfset menuItem["handler"] = "navigate" /&gt;
&lt;cfset menuItem["url"] = "index.cfm" /&gt;
&lt;cfset arrayAppend(menuArr, menuItem) /&gt;
&lt;cfset jArr = serializeJSON(menuArr) /&gt;
</code>

Which produces the following JSON object:

<code>
[
	{
	"scale":"medium",
	"iconCls":"icon-menu24-1",
	"text":"TODD",
	"handler":"navigate",
	"url":"index.cfm"
	}
] 
</code>

The only issue with this version is that CF treats all the values as strings and if you notice Andrew's JSON object the value for the 'handler' key is actually a variable reference to the navigate JavaScript function.  I worked around this by just replacing the quoted value "navigate" with an unquoted value in the JSON string that CF created:

<code>
&lt;cfset jArr = replace(jArr,'"navigate"', "navigate", "all") /&gt;
</code>

Sure, it's a bit of a hack but I'm willing to accept a simple hack in exchange for not having my eyes bleed from trying to work with a 2d array.

Overall I think it was a good entry that took advantage of the Ext 3.0 features that ship with CF 9.<p><a href='enclosures/C{% raw %}%3A%{% endraw %}5Chosts{% raw %}%5C2009%{% endraw %}2Ecoldfusionjedi{% raw %}%2Ecom%{% endraw %}5Cenclosures{% raw %}%2Fcf%{% endraw %}5Fext{% raw %}%5Fnavbar%{% endraw %}2Ezip'>Download attached file.</a></p>