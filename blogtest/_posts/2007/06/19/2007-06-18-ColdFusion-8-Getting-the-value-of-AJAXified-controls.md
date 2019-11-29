---
layout: post
title: "ColdFusion 8: Getting the value of AJAX-ified controls"
date: "2007-06-19T09:06:00+06:00"
categories: [development]
tags: []
banner_image: 
permalink: /2007/06/19/ColdFusion-8-Getting-the-value-of-AJAXified-controls
guid: 2130
---

I ran into a problem last night trying to use JavaScript to read the value of a rich text field. I had assumed I could use the normal syntax I'd use for a form field:

<code>
document.forms[0].body.value
</code>

or

<code>
document.getElementById('body')
</code>

But neither of these worked correctly. Turns out the JavaScript API provided in ColdFusion 8 has an API for this: ColdFusion.getElementValue(elementId, formID, attributeName). The formID and attributeName values are optional. Here is a simple example:

<code>

&lt;script&gt;
function test() {
	var body = ColdFusion.getElementValue('body');
	alert(body);
	return false;
}
&lt;/script&gt;

&lt;cfform onSubmit="return test()"&gt;
&lt;cftextarea richtext="true" name="body" /&gt;
&lt;input type="submit"&gt;
&lt;/cfform&gt;
</code>

In case you are curious - the value includes all the HTML from the rich text value as you would probably expect. 

The API can also be used on grids and trees. For grids, you have to provide the column name, and for trees you ask for either the node or the path value.