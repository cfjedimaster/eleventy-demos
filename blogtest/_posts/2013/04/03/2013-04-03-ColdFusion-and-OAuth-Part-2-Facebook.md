---
layout: post
title: "ColdFusion and OAuth Part 2 - LinkedIn"
date: "2013-04-03T18:04:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2013/04/03/ColdFusion-and-OAuth-Part-2-Facebook
guid: 4901
---

Earlier this week I discussed how to <a href="http://www.raymondcamden.com/index.cfm/2013/4/1/ColdFusion-and-OAuth-Part-1--Facebook">integrate ColdFusion and Facebook</a> using OAuth2. I mentioned that this was part of a set of examples I had done involving Facebook, LinkedIn, and Google. In today's entry, I'm going to discuss the LinkedIn API.
<!--more-->
Luckily, or I should say, obviously, since this is also an OAuth2 protocol, the code is almost the exact same. I literally took the Facebook demo, copied it over, and used that as a starting point. Like Facebook, LinkedIn has a developer portal (<a href="http://developer.linkedin.com">developer.linkedin.com</a>) that includes documentation as well as a place to register applications. This may be a point of confusion for some. You may be thinking, "I'm not building an app, I just want to hook up with LinkedIn", but in general, both Facebook and LinkedIn treat these "applications" as a way to define your connection from your site to its own data. 

Finding the place to add application is a bit weird. Once at the developer portal and logged in, notice you can click a down arrow next to your name in the upper right corner:

<img src="https://static.raymondcamden.com/images/Screen Shot 2013-04-03 at 4.45.55 PM.png" />

Click it, and then select API Keys.

<img src="https://static.raymondcamden.com/images/Screen Shot 2013-04-03 at 4.46.21 PM.png" />

On the next page click "Add New Application". The form here is somewhat intimidating. LinkedIn really could do a better job here, especially with using some defaults since I shouldn't have to re-enter the same data every time. I'd just bother with the required fields. Once set up, you'll want to make note of your OAuth keys. All you care about is the API Key and Secret Key:

<img src="https://static.raymondcamden.com/images/Screen Shot 2013-04-03 at 4.48.46 PM.png" />

Now we can switch to the code. As before, the process is as follows: Present a link. User goes to LinkedIn. User is sent back with secret tokens of goodness. We get another token. Then we have the power to make API calls. (As a reminder, both this and the previous demo were written for ColdFusion 8. Hence the tag-based components.)

First, the Application.cfc - almost an exact mirror of the Facebook code.

<script src="https://gist.github.com/cfjedimaster/5305759.js"></script>

Next, the index.cfm code. Again, I'm presenting a link I assume my user will click. This is based on checking for a session variable that will be defined once the user finishes the OAuth process.

<script src="https://gist.github.com/cfjedimaster/5305773.js"></script>

As before, our links contains part of our access data, a list of permissions, as well as a URL stating where the user is sent back to. Probably the only interesting thing here is scope. That reflects the permissions and will change the prompt the user sees. You will want to modify this based on your needs.

Once the link is clicked, the user will see something like this:

<img src="https://static.raymondcamden.com/images/Screen Shot 2013-04-03 at 4.55.51 PM.png" />

Now let's look at redir.cfm. Again, this is virtually identical to the Facebook code, excepting that their result for the access token is nicely formatted in JSON as opposed to being a string you have to parse manually.

<script src="https://gist.github.com/cfjedimaster/5305810.js"></script>

If everything works out, the user is sent back to the index.cfm page. If you remember, I called a LinkedIn component that is initialized with my access token. I built three methods for this CFC: one to get user data, one to get friends, and one to send messages. To be clear, their API supports more, but this is all my buddy wanted so that's all I built. Here's the component.

<script src="https://gist.github.com/cfjedimaster/5305830.js"></script>

Enjoy. Let me know if you have any questions. Tomorrow I'll write up the third entry in the series. That entry will discuss how to authenticate users with Google.