---
layout: post
title: "TIL about Datalist and Display Limits"
date: "2017-06-01T08:09:00-07:00"
categories: [html5]
tags: [html5]
banner_image: 
permalink: /2017/06/01/til-about-datalist-and-display-limits
---

I've blogged about the &lt;datalist&gt; element a few times before (I'll link to them at the end of this article), and while [support](http://caniuse.com/#feat=datalist) is ok (if you ignore Safari and iOS), it's one of my favorite HTML tags. It's pretty rarely used (as far as I can tell) but has a real good practical effect much like the &lt;details&gt; tag. As a [spec](https://html.spec.whatwg.org/multipage/forms.html#the-datalist-element), it is a bit in flux. When I brought it up last time on Twitter, [Šime Vidas](https://simevidas.com/) brought up how there are different implementations/specs in play. That's the focus of this article.

A few days ago, a reader reached out with the following problem:

<blockquote>
<p>
i found your helpful example on datalist usage many mounts ago, in :
</p>
<p>
https://www.raymondcamden.com/2012/06/14/example-of-a-dynamic-html5-datalist-control/
</p>
<p>
but now i have a question:
</p>
<p>
i get about 100 or more items from an ajax call and append (innerHTML) them into a datalist on my form. but when i searching my desire text, only 20 items show in dropdown. is there a way to increase number of datalist options more than 20?
</p>
</blockquote>

I quickly built a demo with 20+ datalist items to see if I could recreate this. I was pretty sure it wasn't an issue with the Ajax call, but just the number of items. Here is the demo I created:

<pre><code class="language-markup">&lt;!DOCTYPE html&gt;
&lt;html&gt;
&lt;head&gt;
  &lt;meta charset=&quot;utf-8&quot;&gt;
  &lt;meta name=&quot;viewport&quot; content=&quot;width=device-width&quot;&gt;
  &lt;title&gt;JS Bin&lt;/title&gt;
&lt;/head&gt;
&lt;body&gt;

  &lt;input type=&quot;text&quot; list=&quot;stuff&quot;&gt;
  &lt;datalist id=&quot;stuff&quot;&gt;
    &lt;option&gt;AA1&lt;/option&gt;
    &lt;option&gt;AA2&lt;/option&gt;
    &lt;option&gt;AA3&lt;/option&gt;
    &lt;option&gt;AA4&lt;/option&gt;
    &lt;option&gt;AA5&lt;/option&gt;
    &lt;option&gt;AA6&lt;/option&gt;
    &lt;option&gt;AA7&lt;/option&gt;
    &lt;option&gt;AA8&lt;/option&gt;
    &lt;option&gt;AA9&lt;/option&gt;
    &lt;option&gt;AA10&lt;/option&gt;
    &lt;option&gt;AA11&lt;/option&gt;
    &lt;option&gt;AA12&lt;/option&gt;
    &lt;option&gt;AA13&lt;/option&gt;
    &lt;option&gt;AA14&lt;/option&gt;
    &lt;option&gt;AA15&lt;/option&gt;
    &lt;option&gt;AA16&lt;/option&gt;
    &lt;option&gt;AA17&lt;/option&gt;
    &lt;option&gt;AA18&lt;/option&gt;
    &lt;option&gt;AA19&lt;/option&gt;
    &lt;option&gt;AA20&lt;/option&gt;
    &lt;option&gt;AA21&lt;/option&gt;
    &lt;option&gt;AA22&lt;/option&gt;
    &lt;option&gt;AA23&lt;/option&gt;
    &lt;option&gt;B1&lt;/option&gt;
  &lt;/datalist&gt;
&lt;/body&gt;
&lt;/html&gt;
</code></pre>

Very exciting, right? I set this up on jsbin.com and you can run the demo yourself here: https://jsbin.com/cikuzab

So what did I see? I tested first in Chrome and it worked as expected. Just double clicking or typing `A` showed more than 20 results. I did see something odd when devtools was open - the UI goes "over" the window bounds:

<img src="https://static.raymondcamden.com/images/2017/6/dl1.png" title="DL1" class="imgborder">

But this looks to be an issue with responsive view in dev tools in general. Consider this date input:

<img src="https://static.raymondcamden.com/images/2017/6/dl2.jpg" title="DL2" class="imgborder">

As the UI for these controls are using (I believe) underlying OS controls, I don't think there is much that can be done about it - and frankly I'm a bit off topic now, but again, it works - 20+ items are shown.

I then tested in Microsoft Edge, and it worked just as well.

Finally, I tested in Firefox and here is where things get interesting:

<img src="https://static.raymondcamden.com/images/2017/6/dl3.jpg" title="DL3" class="imgborder">

First notice that it contracts the list UI a bit. I like this as it feels like a nicer design. My form only has one element, but in a real form, I think this would work a lot better. However...

<img src="https://static.raymondcamden.com/images/2017/6/dl4.png" title="DL4" class="imgborder">

Notice that I'm only seeing AA20. It looks like Firefox limits the list items to 20. This seems a bit weird since they are already keeping the UI nice and small and providing a scrollbar, but, yep, that's exactly what the reader ran into. If I type AA2, I can finally see all the matching items:

<img src="https://static.raymondcamden.com/images/2017/6/dl5.png" title="DL5" class="imgborder">

So yeah... there ya go. And as Šime had warned me on Twitter, this is definitely a feature that is a bit up in the air right now. Would I avoid datalist? No - I still think it is useful and it degrades nicely in my opinion, but definitely keep this in mind. If you were using Ajax along with the control, you could wait till you have enough input that has 20 or fewer matches, or even add a warning dynamically next to the control.

Are any of my readers using datalist? Here are some other articles I've written on the topic:

* [Example of a dynamic HTML5 datalist control](https://www.raymondcamden.com/2012/06/14/example-of-a-dynamic-html5-datalist-control/)
* [Datalist version of a Country Dropdown](https://www.raymondcamden.com/2012/06/14/example-of-a-dynamic-html5-datalist-control)