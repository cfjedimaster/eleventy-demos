---
layout: post
title: "TIL - Form fields and invalid values"
date: "2016-10-04T10:23:00-07:00"
categories: [development]
tags: [html5]
banner_image: 
permalink: /2016/10/04/til-form-fields-and-invalid-values
---

For years now I've said the single biggest improvement to the web has been the various updates done to form fields. I'm probably biased, but as I started my web development career building form handlers in Perl, any changes to forms seem like a real, *real* good use of development time on the part of browser vendors. I wish it would have happened a good ten years ago or so, but beggars can't be choosers, right?

Earlier this week I ran into something that makes total and complete sense, but still surprised me. Consider the following HTML:

<pre><code class="language-markup">&lt;input type="number" name="age" value="noyb"&gt;
</code></pre>

What will this render? 

If you guessed a form field with *nothing* in it, you would be correct. I mean - think about it - you've said the input field is for numbers and you specified a non-number field, so obviously the field is incorrect. But would you expect it to still show the string since you've said that's the value? Maybe you want an invalid value to force the user to change it. Either way, this still surprised me. 

I ran into this because I'm working on a site using server-side technology with values loaded from a database. Initially the fields were a bit loose. As the project went on, we tightened things up a bit and worked on the front end, and one of the things I did was add better input types where appropriate. What I wasn't considering was that older data wouldn't show up. 

So given this, I decided to try a few different field types to see how browsers handled the invalid fields. Here's what I used:

<pre><code class="language-markup">&lt;form&gt;
	color: &lt;input type=&quot;color&quot; name=&quot;color&quot; value=&quot;poop green&quot;&gt;&lt;br/&gt;
	date: &lt;input type=&quot;date&quot; name=&quot;bbirthday&quot; value=&quot;4/1/1973&quot;&gt;&lt;br/&gt;
	email: &lt;input type=&quot;email&quot; name=&quot;email&quot; value=&quot;totally not an email&quot;&gt;&lt;br/&gt;
	number: &lt;input type=&quot;number&quot; name=&quot;number&quot; value=&quot;zero&quot;&gt;&lt;br/&gt;
	range (too low): &lt;input type=&quot;range&quot; name=&quot;range&quot; min=&quot;0&quot; max=&quot;100&quot; value=&quot;-2&quot;&gt;&lt;br/&gt;
	range (too high): &lt;input type=&quot;range&quot; name=&quot;range&quot; min=&quot;0&quot; max=&quot;100&quot; value=&quot;200&quot;&gt;&lt;br/&gt;
	tel: &lt;input type=&quot;tel&quot; name=&quot;tel&quot; value=&quot;noyb&quot;&gt;&lt;br/&gt;
	url: &lt;input type=&quot;url&quot; name=&quot;url&quot; value=&quot;the google&quot;&gt;&lt;br/&gt;
	&lt;input type=&quot;submit&quot;&gt;
&lt;/form&gt;
</code></pre>

As you can see, I'm testing color, date, email, number, range (twice), tel, and URL. All have invalid values - so what happened? (Try to guess before you read on...)

I tested with the latest Edge, Firefox, Chrome, and Safari browsers. Here's the results - field by field.

Color
---

For Edge, Firefox and Chrome, they rendered a color picker with black selected. Safari doesn't support color because Apple hates developers. (Ok, I kid!)

Date
---

For Edge and Chrome, a date field with no date selected was rendered. Safari and Firefox do not support the date control.

Email
---

Every browser rendered the email field as is. Firefox rendered an error state when I clicked into the field and added a space. Every browser *but* Safari prevented me from submitting with the invalid value.

Number
---

Every browser rendered the field blank. 

Range
---

Every browser rendered the range such that when I went too low, it selected the lowest value, and when I went too high, it selected the highest value.

Telephone
---

Every browser rendered the field as is. No validation was done on the value.

URL
---

Every browser rendered it as is. As before, only Firefox flagged the field as invalid on modification.

If you're curious, here is a screen shot of Edge, Chrome, and Firefox rendering the fields on my Win10 machine. Edge really has a unique look to the range fields. I don't know if I like that or not. 

<img src="https://static.raymondcamden.com/images/2016/10/fields.png">