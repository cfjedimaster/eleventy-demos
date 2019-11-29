---
layout: post
title: "Getting form data from cflayout based tabs"
date: "2008-11-28T22:11:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2008/11/28/Getting-form-data-from-cflayout-based-tabs
guid: 3125
---

This was a question sent in almost a week ago that I didn't chance to look at till tonight. The reader, Joe, had set up a cflayoutarea based tab display of forms. However, he noticed that when the forms were inline, there was a quick 'flash' on display where the items in the second and latter tabs were shown briefly on screen. When he switched to source= for the tabs, things worked fine, but he wasn't sure how to set the form up. 

Remember that when source= is used in the tabs, the actual content isn't loaded into you select the tab. This means it's possible for some of the fields to actually not even exist. 

I wasn't really sure how it would work, but I tried the following code. First, the code to render the tabs:

<code>
&lt;cflayout type="tab"&gt;
	&lt;cflayoutarea title="Tab 1" source="form1.cfm"&gt;
	&lt;/cflayoutarea&gt;
	&lt;cflayoutarea title="Tab 2" source="form2.cfm"&gt;
	&lt;/cflayoutarea&gt;
&lt;/cflayout&gt;
</code>

form1.cfm contains:

<code>
&lt;form&gt;
1a &lt;input type="text" id="field1a" name="field1a" /&gt;&lt;br/&gt;
1b &lt;input type="text" id="field1b" name="field1b" /&gt;&lt;br/&gt;

&lt;input type="button" value="Send Data" onClick="handleForm()"&gt;
&lt;/form&gt;
</code>

As you can see, just a simple form with 2 text fields. I made sure to use IDs for each. form2.cfm was much the same:

<code>
&lt;form&gt;
2a &lt;input type="text" id="field2a" name="field2a" /&gt;&lt;br/&gt;
2b &lt;input type="text" id="field2b" name="field2b" /&gt;&lt;br/&gt;
&lt;/form&gt;
</code>

Going back to form1, note that my button ran handleForm. This is the JavaScript I used:

<code>
&lt;script&gt;
function handleForm() {
	console.log('ran');
	var v1 = '';
	var v2 = '';
	var v3 = '';
	var v4 = '';
	
	if(document.getElementById('field1a') != null) v1 = document.getElementById('field1a').value;
	if(document.getElementById('field1b') != null) v2 = document.getElementById('field1b').value;
	if(document.getElementById('field2a') != null) v3 = document.getElementById('field2a').value;
	if(document.getElementById('field2b') != null) v4 = document.getElementById('field2b').value;
	console.log('v1='+v1);
	console.log('v2='+v2);
	console.log('v3='+v3);
	console.log('v4='+v4);

}
&lt;/script&gt;
</code>

So all I did was use document.getElementById(). Code I'd use normally (although with shorter syntax in jQuery) to get DOM values. I guess it is kind of a no-brainer that this works, but I think I thought it would be a bit different with content loaded in via Ajax (the 2 forms). All those IF statements simply look for null fields. The items in the second tab will be null if you don't load the tab. In theory, tab 1 will never be null, but I figured it wouldn't hurt to double check for all the fields. 

At this point you can just submit the data with ColdFusion.Ajax.submitForm, or whatever else you want to do with the data.

Again - this is probably obvious, but I had not done it before.