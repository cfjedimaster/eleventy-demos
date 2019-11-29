---
layout: post
title: "ColdFusion and OAuth Part 3 - Google"
date: "2013-04-17T15:04:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2013/04/17/ColdFusion-and-OAuth-Part-3-Google
guid: 4912
---

Welcome to my third and final blog post on ColdFusion and OAuth. (You may find the earlier entries below.) I apologize for the delay but I traveled last week so I'm a bit behind. If you have not yet read the earlier entries (<a href="http://www.raymondcamden.com/2013/04/01/ColdFusion-and-OAuth-Part-1-Facebook/">part 1</a> and <a href="http://www.raymondcamden.com/2013/04/03/ColdFusion-and-OAuth-Part-2-Facebook/">part 2</a>), please do so as I will not be repeating the information I wrote about before.
<!--more-->
So - hopefully you've gotten an idea of how easy OAuth can be. After I got things working right the first time, the second demo was quite easy. For this demo I decided to get a bit fancier. Google has an OAuth API that lets you authenticate against their servers. What if you wanted to use Google for your user system? In other words, skip the whole custom registration process and offload user management to Google. That's not only possible but actually one of the recommended use cases in their <a href="https://developers.google.com/accounts/docs/OAuth2">documentation</a>.

Before we begin, please note that you will need to register your application with Google. This is <i>exactly</i> like what you did with Facebook and LinkedIn, except it is done at Google's <a href="https://code.google.com/apis/console#access">API Console</a> instead. By now this process should be easy enough where I don't need to explain it to you, just be sure to make note of the <strong>client id</strong> and <strong>client secret</strong>. 

Since our application is going to use Google for login, I've created a simple Application.cfc that looks for a session variable, and if it doesn't exist, automatically pushes the user to a login page.

<script src="https://gist.github.com/cfjedimaster/5406559.js"></script>

The onApplicationStart is virtually a carbon copy of the earlier examples, but the onRequestStart is new. It checks to see if we are logged in, and barring that, checks to see if we are requesting either the login page or the callback page. When the user first hits the application, they are sent to the login page:
 
<img src="https://static.raymondcamden.com/images/Screen Shot 2013-04-17 at 1.17.26 PM.png" />

Notice that there isn't a form here. Remember, we're sending the user to Google instead. I could have automatically pushed them, but I felt this was more friendly. Here's the code for that template.

<script src="https://gist.github.com/cfjedimaster/5406581.js"></script>

I've put the Google OAuth code into a CFC to abstract a bit, but for now, don't worry about it. The link generation is very similar to the previous two examples. Once the user clicks login, they are sent to Google. In this case, Google recognized my account and preset the login, but I have the option to switch users as well.

<img src="https://static.raymondcamden.com/images/Screen Shot 2013-04-17 at 1.18.20 PM.png" />

As before, the user is sent to a callback page. Here is that template. Again note that I've put much more into the CFC now so this is somewhat simpler.

<script src="https://gist.github.com/cfjedimaster/5406601.js"></script>

Finally, the user is directed to the homepage. As part of the Google API, I can get info about the user. I did so and dumped it out:

<img src="https://static.raymondcamden.com/images/Screen Shot 2013-04-17 at 1.17.48 PM.png" />

Here is that template:

<script src="https://gist.github.com/cfjedimaster/5406612.js"></script>

Now let's look at the CFC:

<script src="https://gist.github.com/cfjedimaster/5406618.js"></script>

For the most part I assume this is self-explanatory, but if anyone has any questions, let me know.

Finally, an interesting twist. What about businesses that make use of Google Apps? Turns out there is an undocumented solution for that. Look at the generateAuthURL function above. If you add the "hd" argument, you can specify a Google Apps domain:

<script src="https://gist.github.com/cfjedimaster/5406632.js"></script>

This works great, but as I said, it isn't documented. A friend of mine is a paying customer of Google Apps and has reached out to tech support, but unfortunately, no one will give him a firm answer. His last email with them resulted in this:

<blockquote>
Basically what the rep said is that their technical team said using hd=cbtec.com is a feature, so they didn't specify that in their documentation. He also said that the variable hd is also used to authenticate users in an organization with business units separated by domains. 
</blockquote>

Frankly that first sentence isn't sensible. "It is a feature and that's why we didn't document it." I'm hoping it was just a typo.