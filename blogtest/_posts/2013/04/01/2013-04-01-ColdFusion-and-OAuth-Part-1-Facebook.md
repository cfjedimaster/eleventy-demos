---
layout: post
title: "ColdFusion and OAuth Part 1 - Facebook"
date: "2013-04-01T13:04:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2013/04/01/ColdFusion-and-OAuth-Part-1-Facebook
guid: 4896
---

Last week, for some reason, I had multiple requests for an example of ColdFusion and OAuth integration. I ended up creating quick demos for Facebook, LinkedIn, and Google. This week I'll be blogging each in turn in the hopes that these entries can help others. Today, I'm going to share the Facebook code.
<!--more-->
Before I begin, I want to warn folks. I wrote this code very quickly. It is <b>not</b> optimized. Also, the person I was helping was on ColdFusion 8. So the code isn't exactly what I'd call up to date. Of course, it will run just fine with ColdFusion 10. I typically assume that folks take my code samples here as just that - code samples - but I wanted to be more clear that this code would probably not be exactly best practices.

To begin, ensure you have access to Facebook's Developer portal (developer.facebook.com) and create a new application.

<img src="https://static.raymondcamden.com/images/Screen Shot 2013-04-01 at 11.34.18 AM.png" />

You can call it whatever you want, but the name should reflect your site in some way. Users will see this when your app launches so make it familiar. You can ignore the other two options.

On the next page, make note of your App ID and App Secret:

<img src="https://static.raymondcamden.com/images/Screen Shot 2013-04-01 at 11.37.11 AM.png" />

Click on "Website with Facebook Login" and enter a value for your site. <b>You can, and probably should, use a local domain.</b> In other words, you can enter something under localhost. Obviously this will change to a production URL once you're done, but for testing, localhost is fine. For my testing I used: http://localhost/testingzone/cf8fb and clicked Save Changes.

That's it for the Facebook side. Now let's talk about the OAuth process in general. I'm not going to go very deep into this as OAuth has been discussed elsewhere and my focus here is to demonstrate a ColdFusion example, but at a high level, the process looks like this:

<ul>
<li>Your site tells the user that you're going to send them to Facebook to authenticate/connect. 
<li>You create a "special" link that includes some required crap in the URL. Along with the required crap, you will have some optional crap. So for example, many OAuth providers ask you to spell out exactly what you want to use from the user. I.e., how much private data you require. Your link will include that, and Facebook will then warn the user. I.e., "This site wants to take your lunch money, read your email, and have relations with your significant other."
<li>The user clicks and ends up at Facebook.com with a app-specific screen there. See the previous bullet point on how that screen may change.
<li>The user clicks Yes or No (or approve or whatever).
<li>Facebook sends you back to your site. In the URL will be a flag that you can check that will tell you if the user allowed your app. If they did, you will also have a special code.
<li>You take <i>that</i> code, make a request (using CFHTTP) to Facebook, to get a secret access token.
<li>This access token then allows you to get stuff. What stuff depends on what you asked for (see bullet point two). 
</ul>

That's it - roughly - and what's cool is that you will see this exact same (for the most part) process over my next blog entries as well.

With that in mind, let's look at the code. Again, I want to warn you this is a bit rough. First, the Application.cfc:

<script src="https://gist.github.com/cfjedimaster/5286100.js"></script>

Obviously the app ID and app secret are removed above. The redirect URL will be used in a bit. Note that I've enabled session management as well. Now let's look at index.cfm. 

<script src="https://gist.github.com/cfjedimaster/5286116.js"></script>

There's two parts to this template. The first portion is run when you first get to the site and haven't connected to Facebook yet. I'm using a simple Session variable to track that. I provide a quick prompt and when clicked, I send the user to Facebook. Upon reflection, how I did this was kind of stupid. I could have just had the link in the original HTML link. 

Speaking of the link, note the parts to it. client_id comes from our application settings. redirect_uri simply tells Facebook where to send the user when they OK/deny the connection. As I said, it is perfectly ok for this to be localhost during testing. The state variable is a security setting. I use a Session variable to store a UUID and ensure that the remote site (in this case, Facebook) sends back the same state. I could also use it for other things, like, well, state. Imagine I had 2 areas of my site where you could connect to Facebook. I could use this as a way to say, "I was in products", or "I was in music." Finally, the scope references what I'm asking for in terms of user privacy. Check Facebook's docs for more on what you can set in that regards.

Ok, so what happens when you click? Here is a screen shot.
 
<img src="https://static.raymondcamden.com/images/Screen Shot 2013-04-01 at 11.57.38 AM.png" />

Now let's look at redir.cfm, the main handler for the result from Facebook.

<script src="https://gist.github.com/cfjedimaster/5687906.js"></script>

We begin by assuming that Facebook has return a code variable to us in the query string. We also validate the state variable I mentioned earlier. At this point, we need to get the Access Token from Facebook. This is done with a simple CFHTTP call. Note we pass back in the redirect URI. We aren't going back to redir.cfm again, this is just part of the security system. 

If everything worked out ok, the result will be a string that looks like this:

access_token=AAAX&expires=5183804

That's where the string parsing code above comes into play. The access_token is what will give us access to the user's data.

If you return to the code sample above for index.cfm, you will notice that I've got a Facebook component tied to the user session. I can pass in the access token there and make use of it for future calls. I wrote this component <i>very</i> quickly. It doesn't have nice error handling or even pagination, but you can see an example of getting my profile as well as my friends.

<script src="https://gist.github.com/cfjedimaster/5286205.js"></script>

I didn't spend much time on their API, but it seemed pretty darn easy to use. 

You may be wondering - during testing - how do I get that permission screen to show up? You want to go to your Facebook Privacy settings, and then Manage Apps. This can be confusing because there is another link for this that brings you to your apps <b>as a developer</b>. You want to ensure you come here via your privacy settings, which will then help you manage your <i>user</i> app settings. Here's mine:
 
<img src="https://static.raymondcamden.com/images/Screen Shot 2013-04-01 at 12.05.45 PM.png" />

See my test app there on top? If you click the delete icon (x), you get this prompt:

<img src="https://static.raymondcamden.com/images/Screen Shot 2013-04-01 at 12.06.51 PM.png" />

This sounds like it may delete the app completely, but to be clear, this is <i>user specific</i> only. It is safe to confirm and test your application again.

Anyway, I hope this helps. I want to be clear that there's more involved here than what I've shown, but I wanted to share my sample app in the hopes others could use it.