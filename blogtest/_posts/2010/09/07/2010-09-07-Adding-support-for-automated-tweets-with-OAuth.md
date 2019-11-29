---
layout: post
title: "Adding support for automated tweets with OAuth"
date: "2010-09-07T15:09:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2010/09/07/Adding-support-for-automated-tweets-with-OAuth
guid: 3934
---

So, a few weeks ago Twitter replaced Basic Auth for OAuth in their APIs. I was aware of this of course, but it never occurred to me to worry about it as I don't actually work on a Twitter client myself. However, I forgot that one of my sites, <a href="http://www.coldfusionbloggers.org">CFBloggers.org</a>, makes use of the Twitter API to tweet new blog entries it aggregates. When I tweeted about this today I got a lot of recommendations, but for the most part, the advice, and the docs, focused on applications for <i>humans</i>. By that I mean, the assumption was that your Twitter automation was a tool that random users were using. The docs would explain how you could easily direct them to Twitter to authorize your application and how they would be sent back. That's great, but what about the case for Twitter bots? Nothing out there seemed to address that need. Luckily though I got some great help. In this blog post I'll explain exactly how I updated CFBloggers to post to Twitter. While this is a ColdFusion specific post it really could apply to anyone doing Twitter bots. Credit for this goes to Todd Rafferty, Vic Carter, and Rob O'Brien (and specifically his blog post here: <a href="http://blog.robobrien.com/integrating-twitter-and-oauth-with-coldfusion/">Integrating Twitter and OAuth with ColdFusion</a>)

<p>
<!--more-->
Ok, so before I get into the exact steps, let me summarize what we are going to do here. We are going to switch to a Java based Twitter library that makes use of OAuth-wrapped calls to Twitter. That handles the sending of tweets. To handle "allow my web site to do this" we are going to use a temporary script. The temporary script is a <b>one time process</b> that we will use to get our tokens that are then fed to the Twitter client. Once we have that we should be gold.

<p>

<b>Edited September 16: Reader Angela Haralson pointed out (see comments below) a great time saver. The creation of the temporary script to get AccessToken and Secret is not necessary. You can get those values from the Twitter web site. This makes things even easier! Please keep that in mind when reading below. Basically you can focus more on the Java library and your setup at Twitter.com.</b>

<p>

1) The first step is to get the Java library. At this time there are no ColdFusion Twitter clients that make use of OAuth, but if anyone knows of one, or creates one after this entry is released, please post it below. The Java library is called Twitter4J and may be found here: <a href="http://twitter4j.org/en/index.html">http://twitter4j.org/en/index.html</a>

<p>

2) You can put the Twitter4J jar in your ColdFusion class path, or do it the sexy way and make use of <a href="http://javaloader.riaforge.org">JavaLoader</a>. I made use of JavaLoader. This is what I added to my Application.cfc:

<p>

<code>

&lt;cfset var paths = [expandPath("./components/twitter4j-core-2.1.4-SNAPSHOT.jar")]&gt;
&lt;cfset application.javaloader = createObject("component", "components.javaloader.JavaLoader").init(paths)&gt;

&lt;cfset application.Twitter = application.javaloader.create("twitter4j.Twitter")&gt;
</code>

<p>

3) <b>This is the beginning of the one time process!</b> We need to create an application on the Twitter web site. This is the application that represents our web site robot. Go to http://dev.twitter.com and login. You can login as your primary Twitter account or the robot's account. In the top nav click "Your Apps" and select Register a New app.

<p>

4) The application name, description, and web site are not important. However, the application name is what folks will see when you robot tweets. I picked "CFBloggersRobot" for mine. For the application web site I just used CFBloggers.org. For the organization I said Me. It's a great organization but the benefits suck. Now for two critical parts. Application Type <b>must be Browser</b>. The call back URL is going to be a temporary script we will make in the next step. Notice that the call back URL <b>can be a local url</b>, by that I mean I used dev.coldfusionbloggers.org, which is only recognized by my local machine. I used this url: http://dev.coldfusionbloggers.org/ray.cfm?mode=1. The mode=1 is also critical and will make sense one you see the script. Finally, ensure you set access type to Read and Write. Otherwise you will not be able to send tweets.

<p>

5) After you save the application you will go to a settings page. Notice that there are two values here you will need, the <b>consumer key</b> and the <b>consumer secret</b>. This will be used in step 6.

<p>

6) Ok, now we are going to create the temporary script:

<p>

<code>
&lt;cfset Twitter = application.javaloader.create("twitter4j.Twitter")&gt;
&lt;cfset Twitter.setOAuthConsumer('cosumer key','consumer secret')&gt;


&lt;cfif structKeyExists(url,'mode') IS FALSE&gt;
    
    &lt;!--- // 2. Authorize ---&gt;
    &lt;cfset RequestToken = Twitter.getOAuthRequestToken()&gt;
    &lt;cfset Session.oAuthRequestToken = RequestToken.getToken()&gt;
    &lt;cfset Session.oAuthRequestTokenSecret = RequestToken.getTokenSecret()&gt;
    &lt;cflocation url="#RequestToken.getAuthorizationURL()#" addtoken="No"&gt;

&lt;cfelse&gt;

    &lt;!--- // 3. Authenticate // ---&gt;
    &lt;cfset AccessToken = Twitter.getOAuthAccessToken(Session.oAuthRequestToken,Session.oAuthRequestTokenSecret)&gt;
    &lt;cfset session.StoredAccessToken = AccessToken.getToken()&gt;
    &lt;cfset session.StoredAccessSecret = AccessToken.getTokenSecret()&gt;
    &lt;cfdump var="#session#"&gt;&lt;cfabort&gt;

&lt;/cfif&gt;
</code>

<p>

So the script begins by getting an instance of the Twitter Java library. I have this in Application scope already but as this is a one time script I wanted to keep it simple. Notice the two strings. Replace those with the real value. Now open this baby up in your browser - and to be clear, you can do this all locally just fine.

<p>

When you run this you will get sent to the Twitter authorization page. Obviously you want to allow your application. Twitter will then send you right back to the script with mode=1 in the URL. This will trigger the dump you see. Within that dump you want to grab the values for <b>storedaccesstoken</b> and <b>storedaccesssecret</b>. 

<p>

7) Return back to your application.cfc. You need to provide all 4 values to your Twitter object:

<p>

<code>
&lt;cfset var paths = [expandPath("./components/twitter4j-core-2.1.4-SNAPSHOT.jar")]&gt;
&lt;cfset application.javaloader = createObject("component", "components.javaloader.JavaLoader").init(paths)&gt;

&lt;cfset application.Twitter = application.javaloader.create("twitter4j.Twitter")&gt;
&lt;cfset application.Twitter.setOAuthConsumer('consumerkey',consumersecret')&gt;
&lt;cfset application.Twitter.setOAuthAccessToken("storedaccesstoken" ,"storedaccesssecret")&gt;
</code>

<p>

8) The final step is to update your code from the old way of sending Tweets to the new way. Luckily this is very trivial. I changed:

<p>

<code>
&lt;cfset twit_result = application.twitter.statuses_update(message)&gt;
</code>

<p>

to

<code>
&lt;cfset application.twitter.updateStatus(message)&gt;
</code>

<p>

And that's it. Once things were explained to me the actual coding took approximately 5 minutes.