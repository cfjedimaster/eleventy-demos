---
layout: post
title: "Playing with StrongLoop - Building a Blog - Part Two"
date: "2016-01-07T15:03:48+06:00"
categories: [development,javascript]
tags: [nodejs,strongloop]
banner_image: 
permalink: /2016/01/07/playing-with-strongloop-building-a-blog-part-two
guid: 7376
---

Welcome to the next blog entry in my series describing building a real (kinda) application with <a href="http://www.strongloop.com">StrongLoop</a>. In the <a href="http://www.raymondcamden.com/2016/01/05/playing-with-strongloop-building-a-blog-part-one">last entry</a>, I talked about the application I was creating (a simple blog), built the model, and demonstrated how to work with the model on the server-side. I completely skipped over using the REST APIs to focus on a simple content-driven dynamic site.

<!--more-->

In this post, I'm going to cover how I can lock down those APIs. This is in preparation for working on an admin for the blog in a later post. This post will be a bit short as this a topic I covered in depth a few months ago (<a href="http://www.raymondcamden.com/2015/10/21/working-with-strongloop-part-four-locking-down-the-api">Working with StrongLoop (Part Four) – Locking down the API</a>), but I wanted to discuss the topic again to call out a few things I missed last time. I suggest reading that earlier post to give some additional context to what I'm describing below.

So first off - out of the box your models are completely CRUDable (create/read/update/delete) via the REST API. This is handy, but of course you want to lock down these APIs so folks don't pepper your site with SEO spam. 

As I discussed in my <a href="http://www.raymondcamden.com/2015/10/21/working-with-strongloop-part-four-locking-down-the-api">earlier post</a>, locking down your API is as simple as using <code>slc loopback:acl</code>. Here is an example:

<p><img src="https://static.raymondcamden.com/images/wp-content/uploads/2015/10/shot17.png" alt="shot1" width="750" height="164" class="aligncenter size-full wp-image-6973" /></p>

In the end, the CLI simply updates the model's JSON definition file. In general, the lock down process is:

<ul>
<li>Block everything!</li>
<li>Allow anon folks to read</li>
<li>Allow auth users to write</li>
</ul>

Here is how this looks in JSON:

<pre><code class="language-javascript">
"acls": [
   {
      "accessType": "*",
      "principalType": "ROLE",
      "principalId": "$everyone",
      "permission": "DENY"
    },
    {
      "accessType": "READ",
      "principalType": "ROLE",
      "principalId": "$everyone",
      "permission": "ALLOW"
    },
    {
      "accessType": "WRITE",
      "principalType": "ROLE",
      "principalId": "$authenticated",
      "permission": "ALLOW"
    }
</code></pre>

Of course, this assumes a security model where every logged in user is an admin. More complex apps will probably have different roles associated with users. So in a blog, you may have users who can write content, but only some who can <i>publish</i> content so that the entry is publicly readable. For now I'm sticking with the simple system of allowing logged in users full power.

I did this for both entry and category. Remember, these are the primary model types for my blog.

I then created a new model called appuser. Again, I discussed this in the previous entry, but while Loopback has a core User object, it is strongly suggested you extend this type into your own for your application. One thing I didn't demonstrate in the previous post was how this was done in the Composer app. It is a simple matter of making a new type and changing <code>Base model</code> to User.

<img src="https://static.raymondcamden.com/images/wp-content/uploads/2016/01/shot1-2.png" alt="shot1" width="750" height="332" class="aligncenter size-full wp-image-7377" />

Next I needed to test this. Again, I mentioned in the other post about how you can use the web-based Explorer to login, but it occurs to me that I didn't actually show how that is done. Login is just another REST method! If you select your user type, you can scroll down to a login method. You then need to enter a JSON object containing your credentials.

<img src="https://static.raymondcamden.com/images/wp-content/uploads/2016/01/sl-login.png" alt="sl login" width="750" height="421" class="aligncenter size-full wp-image-7378" />

After you login, make note of the response. The ID contains a token:

<img src="https://static.raymondcamden.com/images/wp-content/uploads/2016/01/Explorer-token.png" alt="Explorer-token" width="750" height="279" class="aligncenter size-full wp-image-7379" />

(<i>Image taken from StrongLoop docs: <a href="https://docs.strongloop.com/display/public/LB/Introduction+to+User+model+authentication">Introduction to User model authentication</a></i>)

You take that and then paste it into the token field on top of the explorer.

<img src="https://static.raymondcamden.com/images/wp-content/uploads/2016/01/shot2-1.png" alt="shot2" width="503" height="129" class="aligncenter size-full wp-image-7380" />

This ensures your later calls via the explorer are authenticated. To be sure, I tested posting a new entry before being logged in:

<img src="https://static.raymondcamden.com/images/wp-content/uploads/2016/01/shot3-1.png" alt="shot3" width="750" height="1107" class="aligncenter size-full wp-image-7381" />

Then I confirmed I could create after logging in:

<img src="https://static.raymondcamden.com/images/wp-content/uploads/2016/01/shot4-1.png" alt="shot4" width="750" height="632" class="aligncenter size-full wp-image-7382" />

I bet your curious about the server-side API. Is it impacted by ACLs? Nope. I guess that's expected, but I was curious. Basically your Node.js code executes like a root user.

The updated version of the code can be found here: <a href="https://github.com/cfjedimaster/StrongLoopDemos/tree/master/blog2">https://github.com/cfjedimaster/StrongLoopDemos/tree/master/blog2</a>.