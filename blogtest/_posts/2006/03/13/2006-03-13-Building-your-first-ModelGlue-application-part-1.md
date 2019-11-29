---
layout: post
title: "Building your first Model-Glue application (part 1)"
date: "2006-03-13T16:03:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2006/03/13/Building-your-first-ModelGlue-application-part-1
guid: 1148
---

Readers of my blog know that I am a huge fan of the <a href="http://www.model-glue.com">Model-Glue</a> framework. While I certainly don't consider myself an expert, I thought folks might appreciate a simple walk through building a real Model-Glue application. With that in mind, I'm starting a new series today. In this series I'll design a Model-Glue application and share the complete code as each step is built. I will also host the application online so my readers can see it in action (and see it as we build it up). One quick reminder before we start. I'm a Model-Glue newbie. I love it and I want the world to appreciate it, but do know that I'll probably make a few mistakes along the way. Those of you more advanced then I, feel free to chime in, or even just to point out alternatives. So with that out of the way, let's get started.
<!--more-->
My assumption is that if you are reading this, you already have an idea what Model-Glue is. In case you don't, let me commit a quick round of copyright theft and quote from the Model-Glue <a href="http://docs.model-glue.com/">Quick Start</a> (And by the way, the quickstart on the web site is actually a little bit older. You should consult the quick start from the Model-Glue download):

<blockquote>
There's been a lot of talk about using ColdFusion Components (CFCs) to seperate presentation layer from business logic. Model-Glue facilitates this by giving you an easier, more powerful way to connect your presentation layer (View) from your business logic (Model). It does this by letting you create what are called "Controllers", and then letting you define how they interact with the presentation layer (We're calling it View from now on!) through a simple XML schema. 
</blockquote>

That really doesn't do it justice, but hopefully it gives you an inkling about the power of Model-Glue. With that in mind, let's talk a bit about the application we are building. I've never been a huge fan of Flickr, but a friend kind of convinced me to take a second look. I have to admit I like how easy it is, especially the Windows client that let's you drag and drop pictures to upload. All was going great until I discovered a little problem. While I like that you can tag your photos to be private, the only way that your friends can view the pictures is if they register as well. What I was hoping for was either a simple password or a unique URL to share with family.

<ol>
<li>Our application will attempt to solve this. It will have the following features:A user can register for the site.</li>
<li>A user can logon with a username and password. (Once they have registered of course.)</li>
<li>A user can create, edit, and delete galleries. Galleries are nothing more than folders with nice names.
<li>A user can upload photos to galleries. A user can delete the photos as well. To keep things simple, we won't worry about captions or photo metadata or anything like that.
<li>A user can view a gallery as a slide show, a slide show being nothing more than an HTML display of each photo with links to the previous and next image.
<li>Last but not least, the user can create a guest password. A guest password lets someone view your photos. 
</ol>

So, I had hope this would be a bit simpler, but as I typed it out, like most things, it got more complex. However, we will take things slowly, and build out the application in steps. With that in mind, let's tackle the very beginning of this application by first downloading the Model-Glue framework. You can download the code <a href="http://www.model-glue.com/downloads.cfm">here</a>. Once downloaded, you should follow the Quick Start instructions in the zip to install the framework. I'd also recommend creating a new virtual server to run the code. If that sounded like Greek to you, I <i>highly</i> recommend reading the <a href="http://www.acidlabs.org/library/The_ACME_Guide_3rd_Edition.pdf">ACME Guide</a> by Stephen Collins. He takes you through the process of installing Apache and creating virtual servers. 

Assuming you have the server set up, and the Model-Glue zip downloaded, you will find a "modelglueapplicationtemplate" folder. This is a skeleton Model-Glue application that you can use as the basis of any new Model-Glue application. 

<b>The first thing you want to do is...</b> edit the Application name in the Application.cfm file. I only mention this as I forgot to do so, and <a href="http://ray.camdenfamily.com/index.cfm/2006/1/15/ModelGlue-mistake-my-friend-made">went crazy</a> trying to debug an issue with this. The Application.cfm file should look like so (I've added line breaks to make it readable here):

<code>
&lt;cfsilent&gt;
&lt;cfapplication name="ModelGlueApplicationTemplate" sessionmanagement="true"/&gt;
&lt;/cfsilent&gt;
</code>

Change the name to "PhotoGallery" and your code will look like so:

<code>
&lt;cfsilent&gt;
&lt;cfapplication name="PhotoGallery" sessionmanagement="true"/&gt;
&lt;/cfsilent&gt;
</code>

To be fair, this is mentioned in the Quick Start, but I must have been a bit lazy that day. Next we need to configure the ModelGlue.xml file found in the config folder. This is the main file that will control just about everything in the application. We need to edit three lines in it. The lines are below:

<code>
(from the &lt;config&gt; block)
&lt;setting name="beanMappings" value="/modelglueapplicationtemplate/config/beans/" /&gt;
&lt;setting name="viewMappings" value="/modelglueapplicationtemplate/views" /&gt;
(and from the &lt;controllers&gt; block)
&lt;controller name="myController" type="modelglueapplicationtemplate.controller.Controller"&gt;
</code>

The Quick Start guide recommends simply rewriting "modelglueapplicationtemplate" with the name of your application. But this only works if you have a ColdFusion mapping or are creating a folder under web root. In our case, our Model-Glue application is at web root. So we will modify the three lines above to look like so:

<code>
&lt;setting name="beanMappings" value="/config/beans/" /&gt;
&lt;setting name="viewMappings" value="/views" /&gt;
&lt;controller name="myController" type="controller.Controller"&gt;
</code>

Still with me? If you open up your application (mine runs at dev.photogallery.com), you should see the default Model-Glue home page. You can see this <a href="http://pg1.camdenfamily.com">here</a>.

That's it for today. The next entry will discuss how we can apply security to our application so a user is forced to logon or register.<p><a href='enclosures/D{% raw %}%3A%{% endraw %}5Cwebsites{% raw %}%5Ccamdenfamily%{% endraw %}5Csource{% raw %}%5Cmorpheus%{% endraw %}5Cblog{% raw %}%5Cenclosures%{% endraw %}2Fwwwroot%2Ezip'>Download attached file.</a></p>