---
layout: post
title: "Quick review of the Facebook platform"
date: "2008-02-23T16:02:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2008/02/23/Quick-review-of-the-Facebook-platform
guid: 2669
---

I'm working on a project now for a client that involves <a href="http://www.facebook.com">Facebook</a>, and it's one of those dream projects where they pay you to learn while also working on a final product. I've spent about 10 hours so far reading, playing, and scratching my head more than once, and I thought I'd share my thoughts on what I've seen so far. Please keep in mind that I'm still learning this myself, so forgive me if I get any details wrong.
<!--more-->
First and foremost - what in the heck is the Facebook platform? You may think that it is simply another API, like the various Google or Yahoo services. Not exactly. When you build a Facebook application, what you are really doing is building an API yourself. 

Let me explain. A Facebook application runs on your server. You have to set up a web server for it. Because it is your server, you can use any language you want. But it has to be ColdFusion. Really. (Ok, maybe not.) But all interaction is done via Facebook.com. So imagine some random application, like The Wit and Wisdon of Paris Hilton. When a user runs this application, Facebook will talk to your server. So in other words:

<ul>
<li>User runs application by hitting a URL on Facebook.
<li>Facebook passes off the request to your server, and sends some extra flair along
<li>Your server responds with text, beautiful text
<li>Facebook renders the text back to the user
</ul>

So a Facebook application is almost like a proxy. If your application lets you do 3 things, then Facebook simply acts as a go-between for the user and your application. Now I say "simply a go-between" but that isn't really true. It does send along information that your application can use, but I'll cover that a bit more later. 

Things get interesting in what you do with your response. Your Facebook application can respond with simple text and HTML. But you can also add FBML to your response. FBML is Facebook Markup. Let me give you an example. Imagine my application responded with:

<code>
&lt;fb:dashboard&gt;
	&lt;fb:create-button href="#"&gt;Hello world!&lt;/fb:create-button&gt;
&lt;/fb:dashboard&gt;
</code>

While fb: means nothing to ColdFusion, when Facebook gets this back, it will render a button on the application page. The <a href="http://wiki.developers.facebook.com/index.php/FBML">FBML docs</a> discuss the entire set of tags. It's pretty impressive. You can also do some pretty fancy things like:

<code>
&lt;p&gt; Hello &lt;fb:name uid="#request.userID#" useyou="false"/&gt;!&lt;/p&gt;
</code>

Don't worry about the request variable for now. Just know that it represents the Facebook user. Facebook will replace fb:name with, you guess it, the name of the user. 

Ok, so far so good. You have an application. It outputs text. Facebook looks for fb: tags to replace. That part is rather simple. Here is where things get crazy.

I mentioned above that Facebook will hit your application and pass along some information. It doesn't pass along an entire user's profile. It does pass along a user id. Facebook provides a <a href="http://wiki.developers.facebook.com/index.php/API">REST based API</a> where you can request other bits of information. So the scenario works like this:

<ul>
<li>User requests your application on Facebook
<li>Facebook pings your server, sending along a user ID
<li>Your code grabs the user ID, and makes a REST request to Facebook for user profile information for the user ID sent.
<li>Facebook responds with the info.
<li>You parse the response and output text, perhaps saying "Hi" if the profile was for a man, and "Hi ;)" if the profile was for a woman
<li>Facebook returns the response to the user
</ul>

So that one simple request actually ended up with some fancy back and forth action there. Along with the REST api, Facebook also has a way cool thing called <a href="http://developers.facebook.com/documentation.php?doc=fql">FQL</a>, or Facebook Query Language. This is a SQL-like API that lets you do more complex operations in a quicker form. So for example, I can write a SQL statement to get all the friends of user id X and then filter by the women (or men, or whatever). Here is an example of that:

<code>
select name, pic
from user where uid IN (SELECT uid2 FROM friend WHERE uid1 = X) and sex = 'Female'
</code>

The X value is really a user ID I removed. 

So how do you get started? Begin at their <a href="http://developers.facebook.com/">Developer site</a>. To start an application, you actually have to add an application to your profile - the Developer Application. (It's kind of cool that the tool you use to work with the platform actually uses the platform itself.)

Once you've added the Developer Application, you can then create an application. For some silly reason they don't include a "Add Application" link, but instead ask you to request a application key. You will be asked to define various settings. I'm not going to do a full walkthrough now as that would be a bit long, but in general, just take the defaults where you can. The critical setting is the callback url. This is the root url for your own code. So for my sample application, The Wit and Wisdom of Paris Hilton, I used:

http://www.raymondcamden.com/demos/paris/

(Be sure to use the trailing /.) I then gave a Canvas URL value of

http://apps.facebook.com/witandwisdomofparis

So here is the cool thing. Whenever someone requests the Canvas URL, Facebook will call off to your own URL. If I went to

http://apps.facebook.com/witandwisdomofparis/foo.cfm

Then Facebook will hit

http://www.coldfusionjedi.com/demos/paris/foo.cfm

You get the idea. In order for things to work, you obviously need code. I used <a href="http://fbmlstarter.riaforge.org/">Facebook FBML Starter Kit</a> from Dominic Wilson. It has a few kinks in it still (I've bugged him on it) but it worked great for me to start off with. Be sure to edit the code to supply your application values. If you've done everything right, you should be able to see a basic display here:

<a href="http://apps.facebook.com/witandwisdomofparis">http://apps.facebook.com/witandwisdomofparis</a>

Now here is where I had some issues. I added my application to my profile, but nothing showed up. The only way I could tell I had the application was by editing my list of applications. (Not the Developer one - those are <i>your</i> applications.)

Turns out there are certain "rules" about how stuff shows up on your profile. First off, if you want the application to show up in the left hand menu, you have to supply a side nave URL. The URL must be on Facebook. I used the same URL as my Canvas URL (think of the Canvas as your home page):

http://apps.facebook.com/witandwisdomofparis/

You can use a different URL if you have some other action in mind. Now - why didn't I see anything on my profile page proper? This is the part that really confused me.

From what I get - there is a setting for applications called Default FBML Basically it's the text to show up on the profile page. I edited my application and used "Hello World!".  When I did that, it showed up on my profile. As you can guess, you can put FBML in there. Here is a really cool example:

<code>
&lt;fb:wide&gt;
This will only appear in the wide column.
&lt;/fb:wide&gt;
&lt;fb:narrow&gt;
This is the smaller one.
&lt;/fb:narrow&gt;
</code>

This FBML lets me show different text based on what side of the profile I am. I didn't even know you could drag stuff back and forth. 

So that's the profile. When a user visits the Canvas page, this is where you choose what to show. As an example, here is what I did for the Paris page: 

<code>
&lt;cfset wisdom = "Every woman should have four pets in her life. A mink in her closet, a jaguar in her garage, a tiger in her bed, and a jackass who pays for everything.@I think it's important for girls to be confident. Believe in yourself and ... everybody's hot.@Wal-mart... do they like make walls there?"&gt;

&lt;cfset yourwisdom = listGetAt(wisdom, randRange(1, listLen(wisdom,"@")), "@")&gt;
	
&lt;cfoutput&gt;
	
&lt;div style="padding:10px"&gt;
	Random Paris Hilton Quote:
	&lt;blockquote&gt;
	#yourwisdom#
	&lt;/blockquote&gt;
&lt;/div&gt;
&lt;/cfoutput&gt;
</code>

I didn't use any FBML here at all - just quick and dirty output. But if you add the application to your account and click on the menu link, you will see a random quote every time you reload.

So... I had called this a 'quick' review, and it was anything but. I obviously only touched on a few topics, but let me leave you with some last thoughts/questions.

1) It is a royal pain in the rear to test with other accounts. Facebook does not allow you to have test accounts. They will delete them when they find them. But they do let you create an account and then flag it as a test account. These test accounts exist in their own universe though. They use different friends, etc. That's fine an all. The sucky thing is that you still have to use real email addresses. Until Facebook fixes that, be prepared to go to your mail server and set up a few additional accounts. 

2) My sample code - the random Paris quote - is a perfect example of one thing I'm still confused about. The Canvas page is always dynamic. Everytime you load it at Facebook, they hit your site. The profile page though is not. I've seen Flash embedded in the profile, and so I suppose you could use Flash to call your server and get a response that way. Outside of that though the only other way to set the text there is with the REST call. So either you initiate it with CFSCHEDULE, or use Flash. 

3) Lastly, don't forget the issue ColdFusion has with Facebook, discussed here: <a href="http://www.coldfusionjedi.com/index.cfm/2007/9/21/Fixing-the-Facebook-Problem-and-why-one-ColdFusion-feature-needs-to-die">Fixing the Facebook Problem, and why one ColdFusion feature needs to die...</a> The template I used took care of that issue for me.

4) Some random things I kind of forgot. :) You do get some nice stats about your application, like signups, removals, etc. You can even specify a URL on your site to hit when someone adds or removes the application. That can be very handy with tracking as well.