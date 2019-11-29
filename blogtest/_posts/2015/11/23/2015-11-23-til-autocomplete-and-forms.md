---
layout: post
title: "TIL - Autocomplete and forms"
date: "2015-11-23T15:34:15+06:00"
categories: [html5]
tags: []
banner_image: 
permalink: /2015/11/23/til-autocomplete-and-forms
guid: 7122
---

As it is Thanksgiving week here in America and my brain has already kinda checked out, I decided to take a quick look at a particular aspect of the input tag - autocomplete. 

<!--more-->

As you may, or may not know, most modern web browsers will make an attempt to remember form fields of a "similar nature" such that entering your name on one site means that when you go to type in your name on another form it will offer to automatically complete the field for you.

If you don't like this, or perhaps you're using your own autocomplete, you can add autocomplete="off" to either the form tag or to an individual input field. The default behavior (most of the time) is to default to on. 

Simple enough. But if you read the <a href="https://html.spec.whatwg.org/multipage/forms.html#autofill">spec</a>, you discovered that the autocomplete attribute can also provide a "hint" about what field it is. So for example, maybe you've named your form field f_name, or firName, or usersGiveName, each of which is meant to represent what we commonly consider a <strong>first name</strong>, you can actually tell the browser to consider each of those variations to be the first name. 

The spec includes support for a large number of "hints", including:

<ul>
<li>name (full name)</li>
<li>given-name (first name)</li>
<li>family-name (last name)</li>
<li>honorific-suffix (Mr, Dr, etc)</li>
<li>new-password (oh my god don't use this, why would you want to recommend re-using the same password???)</li>
<li>address-line1(-3), address-level(-4) (address-level2 is city, of course)</li>
<li>country</li>
<li>country-name (um)</li>
</ul>

And so on. If you read the spec closely, it is also supposed to support "grouping", such that I can say this is my street-address for shipping versus billing. So with that in mind, I decided to do a bit of digging. I was curious about a few things:

<ul>
<li>When would the browser prompt me to fill in one field versus an entire form?</li>
<li>Can I use crazy field names if I use the right autocomplete value as a hint?</li>
<li>What happens if I mix in a datalist in just to be crazy?</li>
</ul>

So first - a simple form.

<pre><code class="language-markup">
simple form:&lt;br/&gt;
&lt;form&gt;
	first name: &lt;input type=&quot;text&quot; name=&quot;firstname&quot;&gt;&lt;br/&gt;	
	last name: &lt;input type=&quot;text&quot; name=&quot;lastname&quot;&gt;&lt;br/&gt;	
	&lt;input type=&quot;submit&quot;&gt;
&lt;/form&gt;
</code></pre>

Nothing special about that. On Chrome, once I enter a value once, I will get prompted to autofill the field, but only one field at a time. It didn't remember that last time I did "Raymond" that "Camden" was an associated value.

<img src="https://static.raymondcamden.com/images/wp-content/uploads/2015/11/shot14.png" alt="shot1" width="247" height="86" class="aligncenter size-full wp-image-7123" />

Note the lovely pee-yellow CSS Chrome uses to signify an autocomplete field. I honestly don't know why it does this when it requires user action in order to fill. Maybe the thinking is that I'll forget where the name came from? (FYI, apparently you can tweak it: <a href="http://stackoverflow.com/questions/2781549/removing-input-background-colour-for-chrome-autocomplete">http://stackoverflow.com/questions/2781549/removing-input-background-colour-for-chrome-autocomplete</a>)

Firefox has the same behavior (without the CSS pee) as does MS Edge (but with pee).

Safari lets you use either other forms or your local contact info for form data. You can actually use both if you want:

<img src="https://static.raymondcamden.com/images/wp-content/uploads/2015/11/shot21.png" alt="shot2" width="750" height="276" class="aligncenter size-full wp-image-7124" />

However, Safari will not begin suggesting a value until you type one letter. To me, that's a mistake, because at the point I'm typing, I can finish typing my name in less time it takes for Safari to draw a list of names. The UI for filling from a contact card is different from 'regular' autofill:

<img src="https://static.raymondcamden.com/images/wp-content/uploads/2015/11/safari.png" alt="safari" width="331" height="145" class="aligncenter size-full wp-image-7125" />

Ok, how about some more tests. I was first curious about why/when a form would <i>completely</i> fill out. I tried this test:

<pre><code class="language-markup">
autocomplete on, with autocomplete hints&lt;br/&gt;
&lt;form&gt;
	first name: &lt;input type=&quot;text&quot; name=&quot;firstname&quot; autocomplete=&quot;given-name&quot;&gt;&lt;br/&gt;	
	last name: &lt;input type=&quot;text&quot; name=&quot;lastname&quot; autocomplete=&quot;family-name&quot;&gt;&lt;br/&gt;	
	&lt;input type=&quot;submit&quot;&gt;
&lt;/form&gt;
	
&lt;p&gt;

autocomplete hints&lt;br/&gt;
&lt;form&gt;
	first name: &lt;input type=&quot;text&quot; name=&quot;firstname&quot; autocomplete=&quot;given-name&quot;&gt;&lt;br/&gt;	
	last name: &lt;input type=&quot;text&quot; name=&quot;lastname&quot; autocomplete=&quot;family-name&quot;&gt;&lt;br/&gt;	
	street: &lt;input type=&quot;text&quot; name=&quot;street&quot; autocomplete=&quot;street-address&quot;&gt;&lt;br/&gt;
	&lt;input type=&quot;submit&quot;&gt;
&lt;/form&gt;
</code></pre>

In Chrome, while I could autocomplete fields in the first form, only the second form let me completely fill the entire form. I'm guessing it is the number of fields that matter here. Again, the UI is slightly different in each case. First, Chrome offering to fill just one field:

<img src="https://static.raymondcamden.com/images/wp-content/uploads/2015/11/shot31.png" alt="shot3" width="242" height="74" class="aligncenter size-full wp-image-7126" />

Versus the entire form:

<img src="https://static.raymondcamden.com/images/wp-content/uploads/2015/11/shot41.png" alt="shot4" width="314" height="105" class="aligncenter size-full wp-image-7127" />

To be honest, the second screen shot doesn't really imply that it will fill the entire form, but it is certainly different. Maybe the fact that the street address there is supposed to be the clue.

Firefox does not fill out the entire form, but both Safari and Edge filled out the entire form (the one with three fields). 

Ok, so what about the autocomplete=X feature? In theory, it should let me provide a clue such that my form field names won't matter. Here was my first test.

<pre><code class="language-markup">
autocomplete using hints but weird names
&lt;form autocomplete=&quot;on&quot;&gt;
	first name: &lt;input type=&quot;text&quot; name=&quot;firstname2a&quot; autocomplete=&quot;given-name&quot;&gt;&lt;br/&gt;	
	last name: &lt;input type=&quot;text&quot; name=&quot;lastname2a&quot; autocomplete=&quot;family-name&quot;&gt;&lt;br/&gt;	
	&lt;input type=&quot;submit&quot;&gt;
&lt;/form&gt;
</code></pre>

In theory, this should work, but it completely failed to note that I've given both names previously. However, all the browsers remembered previous entries when viewing the form again. Then I added another field:

<pre><code class="language-markup">
autocomplete using hints but weird names
&lt;form autocomplete=&quot;on&quot;&gt;
	first name: &lt;input type=&quot;text&quot; name=&quot;firstname2poo&quot; autocomplete=&quot;given-name&quot;&gt;&lt;br/&gt;	
	last name: &lt;input type=&quot;text&quot; name=&quot;lastname2poo&quot; autocomplete=&quot;family-name&quot;&gt;&lt;br/&gt;	
	street: &lt;input type=&quot;text&quot; name=&quot;NOTAstreetpoo&quot; autocomplete=&quot;street-address&quot;&gt;&lt;br/&gt;
	&lt;input type=&quot;submit&quot;&gt;
&lt;/form&gt;
</code></pre>

And oddly - Chrome finally got it working right: 

<img src="https://static.raymondcamden.com/images/wp-content/uploads/2015/11/Screen-Shot-2015-11-23-at-3.12.41-PM.png" alt="Screen Shot 2015-11-23 at 3.12.41 PM" width="307" height="123" class="aligncenter size-full wp-image-7128" />

No other browser changed though in terms of its behavior. 

Finally - I thought - why not see what happens when you add in a datalist:

<pre><code class="language-markup">
autocomplete using hints but weird names and datalist
&lt;form autocomplete=&quot;on&quot;&gt;
	first name: &lt;input type=&quot;text&quot; name=&quot;firstname2&quot; autocomplete=&quot;given-name&quot; list=&quot;names&quot;&gt;&lt;br/&gt;	
	&lt;datalist id=&quot;names&quot;&gt;
		&lt;option&gt;Ray&lt;/option&gt;
		&lt;option&gt;Bob&lt;/option&gt;
		&lt;option&gt;Elric&lt;/option&gt;
	&lt;/datalist&gt;
	last name: &lt;input type=&quot;text&quot; name=&quot;lastname2&quot; autocomplete=&quot;family-name&quot;&gt;&lt;br/&gt;	
	street: &lt;input type=&quot;text&quot; name=&quot;NOTAstreet&quot; autocomplete=&quot;street-address&quot;&gt;&lt;br/&gt;
	&lt;input type=&quot;submit&quot;&gt;
&lt;/form&gt;
</code></pre>

I love datalist - and <a href="http://caniuse.com/#search=datalist">support is good</a> if you ignore Safari (sigh). Firefox and Chrome will render both past entries <i>and</i> autocomplete values at once, which is kinda nice:

<img src="https://static.raymondcamden.com/images/wp-content/uploads/2015/11/ff.png" alt="ff" width="384" height="176" class="aligncenter size-full wp-image-7129" />

Unfortunately, while Edge supports datalist, it doesn't handle rendering autocomplete and the list at the same time - you can see them overlapping here:

<img src="https://static.raymondcamden.com/images/wp-content/uploads/2015/11/shot9.png" alt="shot9" width="750" height="500" class="aligncenter size-full wp-image-7130" />

It gets weird if you add more values and the field is towards the bottom of the screen:

<img src="https://static.raymondcamden.com/images/wp-content/uploads/2015/11/shot10.png" alt="shot10" width="680" height="408" class="aligncenter size-full wp-image-7131" />

But give it enough space at the bottom and it messes up again:

<img src="https://static.raymondcamden.com/images/wp-content/uploads/2015/11/shot111.png" alt="shot11" width="589" height="313" class="aligncenter size-full wp-image-7132" />

I need to remember to file a bug report on this, of course, since I can't expect it to be fixed if I don't bother to report it.