---
layout: post
title: "Building your first Model-Glue application (part 6)"
date: "2006-03-22T07:03:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2006/03/22/Building-your-first-ModelGlue-application-part-6
guid: 1161
---

Welcome to (yet another) entry on my series on building a Model-Glue application. I thought I'd take a step back and add some spice to the site. What do I mean by spice? Oh how about a decent layout. Not that I have any design skills mind you, in fact, the design you will see was ripped right from <a href="http://www.oswd.org">Open Source Web Design</a>. This entry will discuss how to apply layout to a Model-Glue site and we will also add one more bit of actual functionality (for those of you who care about such things).
<!--more-->
One of the questions you may have asked is how a layout template can be applied in Model-Glue. It may help a bit to discuss how layouts are done (or are probably done) in most ColdFusion applications. 

If you have built more than one web application, one of the things you figure out pretty early on is that designers are a picky lot and like to tweak things like font sizes, layout, and color schemes. Personally I've never trusted designers, but hey, we have to work with them, right? So after having had to modify a site layout more than once over every file in a web application, you quickly realize that it makes a <i>lot</i> of sense to abstract a site's layout. This can be done both at the file level and at the HTML level with CSS. I'm focusing on the file level for this entry. 

Many people probably simply took their site layout, broke it in "half", and created a header and footer template. Then all their code looked a bit like the code below:

<code>
&lt;cfinclude template="header.cfm"&gt;
Code for the page.
&lt;cfinclude template="footer.cfm"&gt;
</code>

This works ok, until you realize that while the layout is mostly static, sometimes things change a bit, like the page title for example. You may then do weird things like this:

<code>
&lt;cfset title = "Star Wars is Art"&gt;
&lt;cfinclude template="header.cfm"&gt;
Code for the page.
&lt;cfinclude template="footer.cfm"&gt;
</code>

In the example above, you create a variable that header.cfm will look for, and then use, in the HTML title tags. This works, but is problematic. Not only could header.cfm change without you knowing it (if you work with others), but the variables created inside of it could conflict with variables created in your template.) 

You may then move to custom tags. This is how I do my layout on all non Model-Glue sites. My pages typically look like this:

<code>
&lt;cfmodule template="/site/customtags/layout.cfm" title="Star Wars is Art"&gt;
Code for the page.
&lt;/cfmodule&gt;
</code>

This creates a nice clear separation from my page and the layout templates. Variables will not conflict with each other. I also like the fact that the layout is all in one file. This makes it a bit easier to diagnose layout issues. 

So that's all well and good, but how in the heck do we handle layout in Model-Glue? We have a couple of ways, and let's start with a simple one for today. As you know, any event defined in Model-Glue has a view section. This defines the view to run after any message broadcast. The typical flow of control is:

<ul>
<li>User requests an event.
<li>Model-Glue runs any broadcasts for the event.
<li>These broadcasts may store information in the event.
<li>If a result doesn't send you away, then the view is run.
<li>The view then can use data from the view state while rendering. This is the data the controller placed in the event.
</ul>

This works fine and well with one view, but you can actually put multiple views. Consider our Home event:

<code>
    &lt;event-handler name="Home"&gt;
      &lt;broadcasts&gt;
      	&lt;message name="getAuthenticated" /&gt;
      &lt;/broadcasts&gt;
      &lt;views&gt;
      	&lt;include name="body" template="dspBody.cfm" /&gt;
	&lt;include name="main" template="dspTemplate.cfm" /&gt;
      &lt;/views&gt;
      &lt;results&gt;
      	&lt;result name="notAuthenticated" do="Logon" /&gt;
      &lt;/results&gt;
    &lt;/event-handler&gt;
</code>

In this example, the first view will run a template called dspBody.cfm. Model-Glue will store the result of this view in a variable called body. This variable exists in what is called a viewCollection. You can think of this as just a container for all the views. Then the next view is run. In this case, it's a file called dspTemplate.cfm. Since this is the last view, only it will be displayed. However, each view has access to the viewCollection, and can then fetch the earlier information if it wants. How can we use this for layout? If you open dspTemplate.cfm, you will see the following, and note, I'm stripping out all the HTML and junk and just focusing on the Model-Glue portion:

<code>
&lt;cfif viewCollection.exists("body")&gt;
  &lt;cfoutput&gt;#viewCollection.getView("body")#&lt;/cfoutput&gt;
&lt;/cfif&gt;
</code>

Basically this code says, check for a "body" field in the viewCollection, and if it exists, display it. Guess what? That's it. Pretty simple, right? And to be honest, I even prefer this to my custom tag approach. Even though my layout custom tag keeps everything in one file, it is still separated by a CFIF branch for each execution mode. In my Model-Glue template, it simply has the code above in the middle. I find this even easier to read.

Your next question is - how do I set a title, or other dynamic aspects, into the template? I've talked before about the viewState. This is like a shopping cart where you can place data to be used during the request. <i>Normally</i>, we have used the controller to set this information. However, a view can do so as well. Consider the logon template. It now has this on top:

<code>
&lt;cfset viewState.setValue("title", "PhotoGallery Logon")&gt;
</code>

This says, in the view state, create a variable called "title" with a value of "PhotoGallery Logon". Now if we go back to our template file, we can do this:

<code>
&lt;cfset title = viewState.getValue("title", "PhotoGallery")&gt;
</code>

This says, look into the view state for a value called title, and if you don't see one, use a default of PhotoGallery. In other words, let's see if an earlier view set a title, and if not, default it to PhotoGallery. 

At this point, it may be a good idea to take a look at the <a href="http://pg1.camdenfamily.com">sample application</a> and see the layout in action. For those who registered already, your username and password should still work, or you can just use admin/admin. Before ending this entry, I want to talk a bit more about views to give you something to chew on until the next entry.

First off - in my example, I used views with different names. If you want, you can use two, or more, views with the same name. If you do that, normally, the last view will overwrite any previous view with the same name. You can get around this by using append. This example is stolen from the <a href="http://www.model-glue.com/quickstart/index.html#viewstacking">quick start</a>:

<code>
&lt;include name="content" template="dsp.helloworld.cfm" /&gt;
&lt;include name="content" template="dsp.helloworld.cfm" append="true" /&gt;
&lt;include name="main" template="layout.main.cfm" /&gt; 
</code>

In this example, Model-Glue will first run dsp.helloworld.cfm and store it in a viewCollection variable named content. It will then run the template <i>again</i>, but this time the result will be appended to the content variable. Lastly it will run layout.main.cfm, and if it uses "content" from the viewCollection, you will see the HTML from that template twice. To be honest, I've never used this feature and can't imagine doing so. I can see one possible use. You may have multiple pods, for example, and you may want to append them all into a "pod" viewCollection variable. Your layout file would then simply use that variable, and not need to know how many different pods there were. 

Lastly, the way I've done the layout is not the only way you can do it. I've talked about using results before. For example, the Home event will fire the Logon event if you are not authenticated. Did you know you can also run an event if no specific value was set in the result? Consider this:

<code>
&lt;result name="DoLogin" do="DoLoginRegister" redirect="yes"/&gt;
&lt;result do="Layout" /&gt;
</code>

This logic says, if a "DoLogin" flag was added to the event result, run "DoLoginRegister." The last result, however, will <i>always</i> fire if the previous one does not. In this case, I've actually made a Layout event. Why do this? More complex sites may do a lot of logic in the layout. For example, <a href="http://www.cflib.org">CFLib</a> shows information in the pods to the right. By using a Layout event, I can handle this a bit easier since I would only need to update one event in case of a change like this. I can say typically I almost always use this approach, but for simplicity's sake, I'm using the approach we have above. As I've mentioned (multiple times now), I plan a "What would I change" type article at the end to discuss possible updates we could do to the application.

So, I mentioned above that I'd actually add a bit of functionality to the site. You may notice that the menu of the site has three options: Home, Photo Galleries, and Logout. The Photo Galleries event doesn't exist yet, but the Logout event was trivial so I added it. Here is the event from the ModelGlue.xml file:

<code>
    &lt;event-handler name="Logout"&gt;
      &lt;broadcasts&gt;
      	&lt;message name="logout" /&gt;
      &lt;/broadcasts&gt;
      &lt;views /&gt;
      &lt;results&gt;
      	&lt;result do="Logon" /&gt;
      &lt;/results&gt;
    &lt;/event-handler&gt;
</code>

I then added a logout listener to my controller block:

<code>
      &lt;message-listener message="logout" function="logout" /&gt;
</code>

And finally added a logout method to my controller:

<code>
&lt;cffunction name="logout" access="public" returntype="void" output="false" hint="I log the user out."&gt;
	&lt;cfargument name="event" type="ModelGlue.Core.Event" required="true"&gt;

	&lt;cfset structDelete(session, "loggedIn")&gt;
&lt;/cffunction&gt;
</code>

As you can see, this was fairly trivial. In the next session will start working with photo galleries.

That's it for this session! As always, you can play with the live application here: <a href="http://pg1.camdenfamily.com"> http://pg1.camdenfamily.com</a>. You can also download the application by clicking the "Download" link at the end of this article.

<b>Summary:</b>
<ul>
<li>This entry was all about looks. I call this the Paris Hilton entry. It's shallow and stupid, but somehow consider important by the majority of people. 
<li>I talked about views, and how views can be stacked, and use each other in order to create a layout template.
<li>I then talked about other ways of using views, and about using a layout event instead of simply using another view.
<li>Lastly I added a simple logout event. By now you should be getting the hang of how features are added. The normal process is: 
<ol>
<li>Add event to Model-Glue.xml file.
<li>Update Controller to "speak to" the Model if need be.
<li>Return data to the event to be used by the View if need be.
</ol>
<li>As a quick last note, I disabled debugging in the Model-Glue XML file. I'll discuss this change later on though. I just did it to make the layout a bit cleaner while I was testing.
</ul><p><a href='enclosures/D{% raw %}%3A%{% endraw %}5Cwebsites{% raw %}%5Ccamdenfamily%{% endraw %}5Csource{% raw %}%5Cmorpheus%{% endraw %}5Cblog{% raw %}%5Cenclosures%{% endraw %}2Fwwwroot5%2Ezip'>Download attached file.</a></p>