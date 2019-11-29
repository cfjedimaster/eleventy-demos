---
layout: post
title: "Another option for trimming text in ColdFusion"
date: "2008-05-29T17:05:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2008/05/29/Another-option-for-trimming-text-in-ColdFusion
guid: 2847
---

Yesterday I wrote a <a href="http://www.raymondcamden.com/index.cfm/2008/5/28/Ask-a-Jedi-Best-way-to-trim-text">blog entry</a> discussing how you can trim text in ColdFusion without cutting words off in the middle. I mainly focused on the handy udf <a href="http://www.cflib.org/udf.cfm/fullleft">FullLeft()</a>, which made the task easier.
<!--more-->
Today I was in a church service (my son's school was closing today - don't worry - I haven't turned pious all of a sudden) and noticed something odd. On the bulletin for the program, they listed some text with a split like so:

<blockquote>
<p>
Insert some bible text here. I guess I'm a sucky Catholic as I can't remember any bible verses.
...
The end of the text is here. Blah blah lorem ipsum deloras.
</p>
</blockquote>

Notice that instead of doing "Left text...", they trimmed the <i>middle</i> of the text. Seeing this I immediately though - I can do this in ColdFusion! It turned out to be rather easy. First let's start with a new quote:

<code>
&lt;cfsavecontent variable="quote"&gt;
So here I was, home again after all those years. Standing in the main square (which I had crossed countless times as a child, as a boy, 
as a young man), I felt no emotion whatsoever; all I could think was that the flat space, with the spire of the town hall (like a soldier
in an ancient helmet) rising above the rooftops, looked like a huge parade ground and that the military past of the Moravian town, once a
bastion against Magvar and Turk invaders, had engraded an irrevocable ugliness on it's face.
&lt;/cfsavecontent&gt;
</code>

(Taken from the first page of "The Joke".) What I figured I'd do is grab a fullLeft from, well, the left, and do a FullRight for the end of the text. There is no FullRight, so what I tried instead was:

<code>
&lt;cfset test = reverse(fullLeft(reverse(quote), 200))&gt;
</code>

Which worked like a charm! I basically reversed the text, did a fullLeft, and reversed the result. The complete code example (minus the cfsavecontent) is below:

<code>
&lt;cfoutput&gt;
#fullleft(quote, 200)#&lt;br /&gt; 
... &lt;br /&gt;
&lt;/cfoutput&gt;
&lt;cfset test = reverse(fullLeft(reverse(quote), 200))&gt;
&lt;cfoutput&gt;#test#&lt;/cfoutput&gt;
</code>

The final result:

<blockquote>
<p>
So here I was, home again after all those years. Standing in the main square (which I had crossed countless times as a child, as a boy, as a young man), I felt no emotion whatsoever; all I could<br>
...<br>
the rooftops, looked like a huge parade ground and that the military past of the Moravian town, once a bastion against Magvar and Turk invaders, had engraded an irrevocable ugliness on it's face. 
</p>
</blockquote>