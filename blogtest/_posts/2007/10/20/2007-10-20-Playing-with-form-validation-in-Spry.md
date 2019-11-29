---
layout: post
title: "Playing with form validation in Spry"
date: "2007-10-20T11:10:00+06:00"
categories: [misc]
tags: []
banner_image: 
permalink: /2007/10/20/Playing-with-form-validation-in-Spry
guid: 2425
---

As much as I love working with <a href="http://labs.adobe.com/technologies/spry/">Spry</a>, I haven't spent a lot of time playing with the widgets or effects. Outside of the tabs - I just wasn't that interested. During my Spry presentation to the OC CFUG this week, I decided it was time to take a look at the form validation widgets that ship with Spry. This morning I looked specifically at the <a href="http://labs.adobe.com/technologies/spry/articles/checkbox_overview/index.html">checkbox widget</a>.
<!--more-->
Widgets in Spry all follow a basic setup - whether you are using UI-ish widgets like tabs, or validation widgets like the checkbox. You begin with your content, and then "enable" the widget with a line of JavaScript. This works due to the loading of a JavaScript library and a CSS file as well. 

Let's take a look at a simple example. The following is a very basic HTML form:

<code>
&lt;form&gt;

&lt;b&gt;Please select your favorite monsters&lt;/b&gt;:&lt;br /&gt;
&lt;input type="checkbox" name="monsters" value="blast-ended skrewt"&gt;Blast-Ended Skrewt&lt;br /&gt;	
&lt;input type="checkbox" name="monsters" value="augurey"&gt;Augurey&lt;br /&gt;	
&lt;input type="checkbox" name="monsters" value="ashwinder"&gt;Ashwinder&lt;br /&gt;	
&lt;input type="checkbox" name="monsters" value="acromantula"&gt;Acromantula&lt;br /&gt;	
&lt;input type="checkbox" name="monsters" value="doxy"&gt;Doxy&lt;br /&gt;	
&lt;input type="checkbox" name="monsters" value="nogtail"&gt;Nogtail&lt;br /&gt;	
&lt;input type="submit"&gt;
&lt;/form&gt;
</code>

The form has one set of six checkboxes. Now let's enable basic validation using Spry. The first thing I need to do is load the resources Spry needs:

<code>
&lt;script src="/spryjs/SpryValidationCheckbox.js" type="text/javascript"&gt;&lt;/script&gt;
&lt;link href="/sprycss/SpryValidationCheckbox.css" rel="stylesheet" type="text/css" /&gt; 
</code>

Now I need to help Spry know what checkboxes are going to be validated. To do that - I'm going to wrap the checkboxes in a span:

<code>
&lt;span id="mycheckboxes"&gt;
&lt;input type="checkbox" name="monsters" value="blast-ended skrewt"&gt;Blast-Ended Skrewt&lt;br /&gt;	
&lt;input type="checkbox" name="monsters" value="augurey"&gt;Augurey&lt;br /&gt;	
&lt;input type="checkbox" name="monsters" value="ashwinder"&gt;Ashwinder&lt;br /&gt;	
&lt;input type="checkbox" name="monsters" value="acromantula"&gt;Acromantula&lt;br /&gt;	
&lt;input type="checkbox" name="monsters" value="doxy"&gt;Doxy&lt;br /&gt;	
&lt;input type="checkbox" name="monsters" value="nogtail"&gt;Nogtail&lt;br /&gt;	
&lt;/span&gt;
</code>

Then I simply enable the validation with a line of JavaScript:

<code>
&lt;script type="text/javascript"&gt;
	var sprycb = new Spry.Widget.ValidationCheckbox("mycheckboxes");
&lt;/script&gt; 
</code>

So we aren't quite done yet. How do we handle errors? Typically you use a message of some sort. What I need to do is create a message inside a specifically named CSS class. Here is an example:

<code>
&lt;span class="checkboxRequiredMsg"&gt;Please make a selection.&lt;br /&gt;&lt;/span&gt;
</code>

The class I used above is recognized by Spry. So when loaded - the message is automatically hidden. And that's it. When I try to submit the form now, Spry will check my checkboxes, and if one isn't selected, it will take that previously hidden message and reveal it. Here is the complete source of the new version:

<code>
&lt;html&gt;

&lt;head&gt;	
&lt;script src="/spryjs/SpryValidationCheckbox.js" type="text/javascript"&gt;&lt;/script&gt;
&lt;link href="/sprycss/SpryValidationCheckbox.css" rel="stylesheet" type="text/css" /&gt; 
&lt;/head&gt;

&lt;body&gt;
	
&lt;form&gt;

&lt;b&gt;Please select your favorite monsters&lt;/b&gt;:&lt;br /&gt;
&lt;span id="mycheckboxes"&gt;
&lt;input type="checkbox" name="monsters" value="blast-ended skrewt"&gt;Blast-Ended Skrewt&lt;br /&gt;	
&lt;input type="checkbox" name="monsters" value="augurey"&gt;Augurey&lt;br /&gt;	
&lt;input type="checkbox" name="monsters" value="ashwinder"&gt;Ashwinder&lt;br /&gt;	
&lt;input type="checkbox" name="monsters" value="acromantula"&gt;Acromantula&lt;br /&gt;	
&lt;input type="checkbox" name="monsters" value="doxy"&gt;Doxy&lt;br /&gt;	
&lt;input type="checkbox" name="monsters" value="nogtail"&gt;Nogtail&lt;br /&gt;	
&lt;span class="checkboxRequiredMsg"&gt;Please make a selection.&lt;br /&gt;&lt;/span&gt;
&lt;/span&gt;
&lt;input type="submit"&gt;
&lt;/form&gt;

&lt;script type="text/javascript"&gt;
	var sprycb = new Spry.Widget.ValidationCheckbox("mycheckboxes");
&lt;/script&gt; 

&lt;/body&gt;
&lt;/html&gt;
</code>

And you can test this <a href="http://www.raymondcamden.com/demos/spryform/test2.html">here</a>. In case you are curious - yes - you can modify the look and feel of the error. You can also modify when the validation occurs. By default it is on submit, but you can also run it on blur or change. Check the <a href="http://labs.adobe.com/technologies/spry/articles/checkbox_overview/index.html">docs</a> for more information.

While this is nice and all - so far it isn't too terribly exciting. But the checkbox validation also has another cool feature. You can specify a minimum and maximum number of required checkboxes. All you need to do is specify the option when enabling the validation:

<code>
&lt;script type="text/javascript"&gt;
	var sprycb = new Spry.Widget.ValidationCheckbox("mycheckboxes",{% raw %}{minSelections:2}{% endraw %});
&lt;/script&gt; 
</code>

This example specifies that a minimum of two checkboxes must be selected. As I said above, I can also do a maximum as well. In order to handle this validation, you need to add a new error message. Once again there is a specially named CSS class you can use:

<code>
&lt;span class="checkboxMinSelectionsMsg"&gt;Please pick at least two selections.&lt;br /&gt;&lt;/span&gt;
</code>

Here is a complete example:

<code>
&lt;html&gt;

&lt;head&gt;	
&lt;script src="/spryjs/SpryValidationCheckbox.js" type="text/javascript"&gt;&lt;/script&gt;
&lt;link href="/sprycss/SpryValidationCheckbox.css" rel="stylesheet" type="text/css" /&gt; 
&lt;/head&gt;

&lt;body&gt;
	
&lt;form&gt;

&lt;b&gt;Please select your favorite monsters (pick 2 minimum)&lt;/b&gt;:&lt;br /&gt;
&lt;span id="mycheckboxes"&gt;
&lt;input type="checkbox" name="monsters" value="blast-ended skrewt"&gt;Blast-Ended Skrewt&lt;br /&gt;	
&lt;input type="checkbox" name="monsters" value="augurey"&gt;Augurey&lt;br /&gt;	
&lt;input type="checkbox" name="monsters" value="ashwinder"&gt;Ashwinder&lt;br /&gt;	
&lt;input type="checkbox" name="monsters" value="acromantula"&gt;Acromantula&lt;br /&gt;	
&lt;input type="checkbox" name="monsters" value="doxy"&gt;Doxy&lt;br /&gt;	
&lt;input type="checkbox" name="monsters" value="nogtail"&gt;Nogtail&lt;br /&gt;	
&lt;span class="checkboxRequiredMsg"&gt;Please make a selection.&lt;br /&gt;&lt;/span&gt;
&lt;span class="checkboxMinSelectionsMsg"&gt;Please pick at least two selections.&lt;br /&gt;&lt;/span&gt;
&lt;/span&gt;
&lt;input type="submit"&gt;
&lt;/form&gt;

&lt;script type="text/javascript"&gt;
	var sprycb = new Spry.Widget.ValidationCheckbox("mycheckboxes",{% raw %}{minSelections:2}{% endraw %});
&lt;/script&gt; 

&lt;/body&gt;
&lt;/html&gt;
</code>

And the online demo may be found <a href="http://www.coldfusionjedi.com/demos/spryform/test3.html">here</a>. 

So now that I've finally played with it a bit - I like it. Especially the min/max support.