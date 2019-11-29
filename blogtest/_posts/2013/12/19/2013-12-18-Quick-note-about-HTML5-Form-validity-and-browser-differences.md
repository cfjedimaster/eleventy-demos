---
layout: post
title: "Quick note about HTML5 Form validity and browser differences"
date: "2013-12-19T08:12:00+06:00"
categories: [html5,javascript]
tags: []
banner_image: 
permalink: /2013/12/19/Quick-note-about-HTML5-Form-validity-and-browser-differences
guid: 5106
---

<p>
I was working with a reader on my blog post on <a href="http://www.raymondcamden.com/index.cfm/2012/3/19/HTML5-Form-Validation--The-Constraint-Validation-API">HTML5 form validation</a> when we ran into an interesting problem with different browsers.
</p>
<!--more-->
<p>
The reader was using a query selector to get a list of all invalid form fields. As an example:
</p>

<pre><code class="language-javascript">var invalid = $(":invalid");</code></pre>

<p>
This little snippet will return all fields that are currently invalid based on whatever validation rules may be in play. In Chrome, he noticed that he got 2 fields in his test form, which he expected. In Firefox though he got 3.
</p>

<p>
I created a very simple app up on JSBin to replicate this: (I don't normally embed JSBin stuff so hopefully this works!)
</p>

<iframe width="100%" height="300" src="http://jsfiddle.net/RxLzM/embedded/" allowfullscreen="allowfullscreen" frameborder="0"></iframe>

<p>
Note the use of the "input" event. To test my code, type a character into the field and then delete it. Chrome returns 1 when you empty the field and Firefox returns 2. Why?
</p>

<p>
I added a loop and console.dir to actually view the items matching the selector. Turns out that in Firefox, the form tag is marked invalid as well. To be honest, that feels more right to me. I haven't checked the spec yet to see who is right, but I can certainly see the logic of it.
</p>

<p>
So how would you fix it so you can get a real count of the fields? Simple - just make that selector a bit more specific: $("input:invalid"). Of course, this won't work with textareas or selects in play. You can also just loop through the results and ignore a match on the form tag.
</p>