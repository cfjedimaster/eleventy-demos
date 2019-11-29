---
layout: post
title: "Today's Weird JavaScript Issue"
date: "2008-10-22T10:10:00+06:00"
categories: [coldfusion,javascript]
tags: []
banner_image: 
permalink: /2008/10/22/Todays-Weird-JavaScript-Issue
guid: 3065
---

I ran into an interesting JavaScript issue yesterday. A user reported a bug with <a href="http://www.coldfusionbloggers.org">ColdFusionBloggers</a> and searching. If he searched for one word, like 'object', then he could navigate through multiple pages of results just fine. If he search for two words, 'object oriented', then as soon as he clicked next the page would break.

This immediately made me think that I had forgotten a urlEncodedFormat() call somewhere. I'm <i>very</i> good about remembering that but it was certainly possible I could have made a mistake. (Although I'd probably blame Microsoft somehow.) When I opened the file though I could plainly see that I was indeed urlEncodeFormating the string before passing it to my JavaScript code to handle navigation.

I wanted to blame jQuery for this. When you use jQuery to do an Ajax-based content load into a div, they support loading a URL and optionally filtering to a div. What I mean is, you can say: I want you to load the contents of foo.cfm into my div called content, however, I don't want you to load all of foo.cfm, I want you to load the goo div's content only. 

Here is an example that does a plain load of foo.cfm, and then another one that loads the goo div from foo.cfm:

<code>
$("content").load('foo.cfm')

versus...

$("content").load('foo.cfm goo')
</code>

Notice that the syntax uses a space to signify that the goo div is what we want from foo.cfm. My code was passing a URL that looked something like this:

content.cfm?start=11&search=foo%20goo (a search for foo goo)

Notice the escaped space. I thought perhaps jQuery was un-encoding the string somehow and getting confused. However, as I dug more, it seemed more as if that the string was being undecoded as it arrived to the function. I was able to recreate this bug without any jQuery at all:

<code>
&lt;cfset s = "frank and beans"&gt;
&lt;cfset u = "test3.cfm?x=1&foo=#urlEncodedFormat(s)#"&gt;

&lt;script&gt;
function testit(s) {% raw %}{ console.log(s); }{% endraw %}
&lt;/script&gt;
&lt;cfoutput&gt;
&lt;a href="javaScript:testit('#u#')"&gt;Test1&lt;/a&gt;&lt;br /&gt;
&lt;a href="" onClick="testit('#u#');return false"&gt;Test2&lt;/a&gt;&lt;br /&gt;
&lt;/cfoutput&gt;
</code>

So get this. Notice how the first link uses a javaScript: style link while the second uses an onClick. When you run this test, <strike>the first one will log test3.cfm?x=1&foo=frank. No beans!</strike> <b>Edit:</b> I had a brain fart there. The console shows frank and beans, but w/o the %20, the escape. <b>End Edit</b> The second test will correctly show the entire string with the proper escape values. I also tested with an input type=button and it worked fine as well.

So for some reason, when the string was passed using the href property of the anchor, the encoded part of the string is lost somehow. Now I'm still getting used to JavaScript after my long, dark, cold war with it, and I <i>believe</i> that I've read the using the event handler way is 'more proper', but this is the first time I've been bitten by something like this.

Does anyone know of any place where this behavior is documented?