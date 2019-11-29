---
layout: post
title: "Framework One"
date: "2009-11-28T19:11:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2009/11/28/Framework-One
guid: 3625
---

Back in July <a href="http://www.corfield.org/blog">Sean Corfield</a> released a new framework: <a href="http://fw1.riaforge.org">Framework One</a>, or FW/1. Sean has a nice <a href="http://fw1.riaforge.org/blog/index.cfm/2009/7/19/Introducing-Framework-One">blog entry</a> talking about why he created it. The basic gist is that Sean was looking to create something simpler and more direct than the frameworks in use in our community today. I've been a fan of Model-Glue for a long time. I've played with other frameworks, ColdBox most recently, but I've never been as satisfied or as happy as I am when I use Model-Glue. This holiday week I thought I'd check out FW/1, and while I don't think it will replace Model-Glue as my framework of choice, I was <b>very</b> impressed by it and had a lot of fun building a sample application with it.

Compared to Model-Glue, which uses XML to define it's behavior and settings, FW/1 is entirely conventions based. That's just a fancy way of saying that you do little to no configuration at all. You can rely on the framework's conventions to do a heck of a lot of work for you. At a practical level that means FW/1 is <b>fast</b>, damn fast. I had issues with these conventions at first - mainly just wrapping my head around them - but once I got into the groove it was amazing how quickly I could move. Each request will automatically run controller methods, service methods, and views that match. This means that a controller method that just chains off to a service method doesn't need to be written. Basically - any code that tied a getX call to a getX controller method to a getX service method will be unnecessary.  

I've whipped up a quick demo. It makes use of ColdFusion 9 and ORM and must be tied to an existing BlogCFC database. It contains a grand total of 2 pages - a blog entry listing and an entry page. It also allows you to add comments. You can download it below, but please remember that I wrote this as an opportunity to play with FW/1 and it shouldn't be considered best practice. 

So remember what I said about not having to write unnecessary code? The code to handle viewing a blog entry consists only of a service method, entry:

<code>
public function entry(string id) {
	writeLog(file='fw1',text='yes I ran services.blog.entry()');
	return EntityLoadByPk("blogentry", arguments.id);
}
</code>

This method exists in a CFC called blog under my services folder. By convention, FW/1 will run blog.entry when I request blog.entry in the URL. I don't need to write a controller method at all. Nor do I need to define what the view is. FW/1 will automatically run views/blog/entry.cfm for me. 

Anyway - download FW/1, check out their examples and mine, and see what you think. At the end of the day, the <b>best framework is the one that works best for you</b>, and while I still think Model-Glue is the best for me, FW/1 is impressive and I'd urge folks to check it out. 

p.s. Note that FW/1 has ColdSpring integration, another framework I recommend folks check out.

p.s.s. So hey, what's the deal with this code in my controller:

<code>
&lt;cffunction name="default" output="false"&gt;
	&lt;cfargument name="rc"&gt;
	&lt;cfparam name="rc.start" default="1"&gt;
	&lt;cfset variables.fw.service("blog.list", "data")&gt;
&lt;/cffunction&gt;
</code>

I originally wanted to build the blog.default method in my service. I didn't like using "default" as a name since the real action was to list, but I was going to get over it. However - in a script based CFC, default is a reserved word. So, this gave me a good excuse to use a 'proper' name for the method in the service. I still wanted default as, well, my default action, so I used the controller method here to simply act as proxy. On reflection, I'd probably change the FW/1 setting for "defaultItem" to specify "list" instead.<p><a href='enclosures/C{% raw %}%3A%{% endraw %}5Chosts{% raw %}%5C2009%{% endraw %}2Ecoldfusionjedi{% raw %}%2Ecom%{% endraw %}5Cenclosures{% raw %}%2Ffwtest%{% endraw %}2Ezip'>Download attached file.</a></p>