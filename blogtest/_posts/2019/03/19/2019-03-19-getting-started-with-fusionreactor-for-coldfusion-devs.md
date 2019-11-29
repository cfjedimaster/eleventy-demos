---
layout: post
title: "Getting Started with FusionReactor (for ColdFusion Devs)"
date: "2019-03-19"
categories: ["coldfusion"]
tags: []
banner_image: /images/banners/fusionreactor2.png
permalink: /2019/03/19/getting-started-with-fusionreactor-for-coldfusion-devs
description: A look into FusionReactor and Detecting Errors with ColdFusion pages.
---

As a ColdFusion developer, you may know that it's running as a J2EE server but also may have zero to no idea what that means in a practical sense. ColdFusion has always been easy to use, especially for developers from a non-traditional background, and this sometimes means there's aspects of the platform that aren't quite as easy to understand as others. A great example of this are the things that are more Java-centric. FusionReactor integrates with your ColdFusion server from a Java-perspective, which means it may be use terms that may be unfamiliar to the developer who only knows CFML. 

And yes, you can, and should, consider learning more about Java, but at the same time, we don't always have the opportunity to pick up a new language! You may need to get things working *now* and what I'd like to do in this article is help you, the CFML developer, better understand how Fusion Reactor reports issues and get you to a point where you can quickly identify (and fix!) your problems. 

My assumption is that you've already installed FusionReactor. If not, head over to the [downloads](https://www.fusion-reactor.com/download/) and grab a copy. You can get your trial key there and use it to test and evaluate the product. As I'm writing this for CFML developers who aren't familiar with Java, I strongly urge you to use the "Automated Installers". I'm testing on a Windows machine with [Lucee](https://lucee.org/) but obviously you can use Adobe's ColdFusion product as well.  I'm also assuming you've set up a FusionReactor instance pointing to your ColdFusion server so you can start monitoring and debugging. Once you have, you can open that instance.

![Instance Home page](https://static.raymondcamden.com/images/2019/03/instance_home.png)

### Let's Break Something!

There's a heck of lot to FusionReactor but in this article I'm going to focus on just one particular aspect - errors. Luckily, I'm a born error creator. One of the best. I should probably get endorsed on LinkedIn for writing buggy code. Thankfully that's made me something of an expert in debugging a file and figuring out what went wrong. That's rather easy while I'm writing and testing code. It isn't necessarily helpful when the code is in production and being used by the public.

Let's consider a simple template that seems to be bug free.

```markup
<h1>Debug Testing</h1>

<cfoutput>
url.name = #url.name#<br/>
len is #len(url.name)#
</cfoutput>
```

This script simply outputs the value of a variable passed in the query string, `name`, and then reports the length of the value. Given that the file is named `ray.cfm`, you can test this like so:

http://127.0.0.1:8888/ray.cfm?name=raymond

Which gives you:

![Test result](https://static.raymondcamden.com/images/2019/03/test1.png)

Ok, astute readers will recognize the issue with this code. What happens when you don't pass the `name` value in the query string?

![Error thrown in browser](https://static.raymondcamden.com/images/2019/03/raw_error.png)

In this case it's probably obvious what you did wrong. This is easy enough to fix by either setting a default or adding logic to redirect when the value isn't defined, but what if you miss this and deploy the code to production? 

Assuming you've done that and got a report from your users (or even better, your manager at 2AM on Saturday), let's quickly see how FusionReactor can help you find this issue.

### To the Requests, Batman!

Alright, so you've got a report about something going wrong. In a perfect world, that report includes the URL, query string, what the user was doing, the phase of the moon, and more. Also know that ColdFusion has excellent built-in error handling that can send you detailed reports... if you added that to your project.

But let's pretend you have nothing, or something as useless as this:

<blockquote>
"Hey, the web site is broke."
</blockquote>

Let's begin by looking at the history of requests in the FusionReactor instance. In the left hand menu, mouse over Requests and select History:

![Request history](https://static.raymondcamden.com/images/2019/03/history.png)

There's a lot to this table, but let's focus on a few things in a somewhat descending order of importance:

* Status Code: When a request is made over the web, a server returns a code that represents how it was handled. `200` represents a good response. `500` is a bad response. (And note how FusionReactor is flagging that already!) There's a great many different status codes out there and you should [take a look](https://en.wikipedia.org/wiki/List_of_HTTP_status_codes) at them sometime.
* URL: This tells you the URL of the request and *normally*, but not always, will give you an idea of the file that was requested. Many people will use URL Rewriting to "hide" the fact that ColdFusion is running. In this case it's pretty obvious: `http://127.0.0.1:8888/ray.cfm`. Given that the URL path is `/ray.cfm` I can figure out that it's the `ray.cfm` in my web root. But you can't always count on it being that easy. Also note that the error in this view is Java-related: `lucee.runtime.exp.ExpressionException`. Don't worry - we're going to dig into this. 

That was the general request view, but most likely you want to focus in on just the errors. In that same left-hand nav, you can do so by selecting: Requests, Error History:

![Error History](https://static.raymondcamden.com/images/2019/03/error_history.png)

This is showing the same information, just filtered to requests with errors.

### Let's Get the Error

Alright, so you've found a request with an error, how do we diagnose it? On the right hand side is a "book" icon which will load details. Let's do that and see what we get.

![Error Details](https://static.raymondcamden.com/images/2019/03/error_details.png)

Holy. Crap. 

Overwhelming, right? Everything there is useful, but there's a lot you don't need *right now* in order to get to the issue at hand. Begin by clicking "Error Details" under "Transaction Details":

![Error Details - Tab Focused](https://static.raymondcamden.com/images/2019/03/error_details2.png)

The first two blocks give you a good idea of what's going on. `key [NAME] doesn't exist` is a clue that your code tried to use a variable that didn't exist. If the `key` aspect doesn't make sense, it may be helpful to remember that ColdFusion variables are scopes, or structs, and when you access `url.something`, you're trying to use a particular key in that scope. 

Alright, so we're closer. Now our particular ColdFusion file is *very* short but imagine a much larger template, how would we find where the error was thrown? 

The bottom part of the template is the Java Stack Trace...

!["Here be dragons..."](https://static.raymondcamden.com/images/2019/03/here_be_dragons.jpg)
<br/><i>Credit: <https://www.flickr.com/photos/mdpettitt/19833960016></i>


The stack trace can be overwhelming. In this case, you can slowly read line by line looking for a line mentioning a CFM file:

	ray_cfm$cf.call(/ray.cfm:5)

In this case, `ray.cfm` is the file name (pretty obvious) and `5` is the line number:

	url.name = #url.name#<br/>

In theory, you're done, but FusionReactor can help you a bit more. In the left hand navigation, look for the Debug menu and select Sources.

![Debug Sources](https://static.raymondcamden.com/images/2019/03/sources.png)

Out of the box, FusionReactor doesn't have any defined sources, so simply click the "Add" button and specify your web root. (Note that you can have more than one, and most likely you'll have one root directory per application.)

![Debug Sources - Setting a Directory](https://static.raymondcamden.com/images/2019/03/sources2.png)

In the screenshot above I've simply specified my Lucee root.

When you've done that go back to the Requests view, find that broken request, and get to the stack trace again.

Now if you click on the method call, which is `ray_cfm$cf.call`, FusionReactor will actually be able to show you the file itself!

![Error Details in the File](https://static.raymondcamden.com/images/2019/03/error_details3.png)

Notice how FusionReactor even highlights the line in the file! 

### But Wait - There's More!

FusionReactor contains a *huge* set of tools, but in this article we focused in specifically on helping diagnose an error in production. In the next one we'll start expanding our use of FusionReactor and look for more performance related issues. 