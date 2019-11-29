---
layout: post
title: "Building your first Model-Glue application (part 7)"
date: "2006-03-25T11:03:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2006/03/25/Building-your-first-ModelGlue-application-part-7
guid: 1168
---

<img src="http://ray.camdenfamily.com/images/mg.jpg" align="left" border="1" hspace="5">
Welcome to entry 7 on building your first Model-Glue application. We are nearing the end (I hope) and my plan is to wrap stuff up by entry 10. Stick with me and hopefully this will be a nice little application. This entry is quite large, so you may want to print it out to make it a bit easier to read. In the <a href="http://ray.camdenfamily.com/index.cfm/2006/3/22/Building-your-first-ModelGlue-application-part-6">last entry</a>, I talked about layout and how it could be applied to a Model-Glue application. In this entry I am going to focus on the galleries, which were the main reason for building this application.
<!--more-->
Let's start off by just discussing what a photo gallery is, including it's properties and methods.

<ul>
<li>A gallery should have a name. This is a simple string like "Pictures on a Star Destroyer."
<li>A gallery should have access permissions. As I had mentioned when <a href="http://ray.camdenfamily.com/index.cfm/2006/3/13/Building-your-first-ModelGlue-application-part-1">starting</a> this application, my inspiration for this application was <a href="http://www.flickr.com/">Flickr</a>, which lets you optionally share images. What I didn't like was how it required you to have your friends register if they wanted to see your non-public images. So to address this, I'm going to use the following rules:
<ol>
<li>A gallery will have three settings for access: public (anyone in the world can see it), password (anyone with a password can see it), and private (only you can see it). 
<li>The password will be unique per gallery, although most folks will probably just use one password for all. 
</ol>
<li>A gallery will have an owner. We will use the username of the owner to identify the person who created the gallery.
<li>That's it. One thing I typically do in most other applications (whether Model-Glue or not) is also store a bit of meta-information about data, like when it was created, whether it is active or not, etc. Again though, I'm keeping things simple for now. 
</ul>

To recap, here are the properties I'm using and their database types/settings:

<table border="1">
<tr>
<td><b>id</b></td>
<td>This is a primary key integer that auto increments.</td>
</tr>
<tr>
<td><b>name</b></td>
<td>This is a string. Null is not allowed.</td>
</tr>
<tr>
<td><b>ispublic, ispassword, isprivate</b></td>
<td>There are numerous different ways you can do security settings in a database. I used a simple set of flags.</td>
</tr>
<tr>
<td><b>password</b></td>
<td>Optional string for the password.</td>
</tr>
<tr>
<td><b>username</b></td>
<td>This is a pointer back to the user who created the gallery.</td>
</tr>
</table>

For more detail on the tables, see the SQL file I've included in the zip. This is found in the Download link at the bottom of the article. <b>Just to be clear...</b> the way I designed the database has zero to do with Model-Glue. It's just a personal decision. <b>It could be better.</b> Again - I'm trying to keep things simple. 

So that kind of covers what properties are galleries will have. As for the methods, we will have, pretty much, a mirror of what we have for users: Create, Read, Update, and Delete (CRUD). We will build a bean, a DAO (Data Access Object) and a Gateway, just like we did for users. I'm not going to show all the code here, but will talk a bit about what I did. I started off simply making copy of my three CFCs for users. I then renamed them appropriately, and started on my bean. (I always work on the bean, the DAO, and then the gateway in that order. It just seems to make sense.) I find that working on these CFCs can be a bit tiring at times. What I really need to do is get more into <a href="http://www.doughughes.net/index.cfm?filter=category&categoryId=30">Reactor</a>, which saves you from this kind of grunt work. I haven't done that yet, but plan to do so soon. At the least, I've created a nice little snippet in CFEclipse so I can at least make writing my getters and setters for the bean simpler. 

Because a lot of the code for the CFCs isn't that interesting, I'm not going to display them here. I will discuss one interesting portion of the CFC. In my gateway CFC, I have a method to get the galleries. This is a default "get everything in a query" type method. However, I know off the bat that I'm going to be needing a method to get the galleries for one user at a time. Let's take a quick look at how I handled that:

<code>
&lt;cffunction name="getGalleries" access="public" returnType="query" output="false"&gt;
	&lt;cfargument name="username" type="string" required="false"&gt;
	&lt;cfset var q = ""&gt;
	
	&lt;cfquery name="q" datasource="#variables.dsn#"&gt;
	select		id, name, ispublic, ispassword, isprivate, password, useridfk
	from		galleries
	where		1=1
	&lt;cfif structKeyExists(arguments, "username")&gt;
	and			username = &lt;cfqueryparam cfsqltype="cf_sql_varchar" value="#arguments.username#" maxlength="50"&gt;
	&lt;/cfif&gt;
	order by 	name asc
	&lt;/cfquery&gt;
	
	&lt;cfreturn q&gt;
&lt;/cffunction&gt;

&lt;cffunction name="getGalleriesForUser" access="public" returnType="query" output="false"&gt;
	&lt;cfargument name="username" type="string" required="true"&gt;

	&lt;cfreturn getGalleries(arguments.username)&gt;
&lt;/cffunction&gt;
</code>

The getGalleries method, in general, is a simple select all type function. Notice however that I allow for an optional username argument. If passed in, the result set will be limited to galleries owned by that user. I could stop there. My Model-Glue controller could pass that argument to getGalleries and that would work just fine. However, I decided to make a "helper" method, getGalleriesForUser, that will act as a wrapper. This is nice for multiple reasons. One big one is that it plans for the future. Right now my getGalleries is pretty simple, so adding on an optional username argument was no big deal. What if that changes? I may need to rip this code out and make getGalleriesForUser more complex. Since my model is already using that method name, then nothing needs to change there. 

Let me be honest here. If you look at my projects you will see me sometimes using this, and sometimes not using it. It's one of those things where I go back and forth on in terms of what makes sense. 

Ok, now it's time to hook up this new part of my model to the controller. If you visited the <a href="http://pg1.camdenfamily.com">demo site</a>, you remember that we had a link already for Galleries. It linked to this url: #viewstate.getValue("myself")#galleries. To make this work, let's add a galleries event to our Model-Glue XML file:

<code>
    &lt;event-handler name="Galleries"&gt;
      &lt;broadcasts&gt;
      	&lt;message name="getAuthenticated" /&gt;
      	&lt;message name="getMyGalleries" /&gt;
      &lt;/broadcasts&gt;
      &lt;views&gt;
      	&lt;include name="body" template="dspGalleries.cfm" /&gt;
	&lt;include name="main" template="dspTemplate.cfm" /&gt;
      &lt;/views&gt;
      &lt;results&gt;
      	&lt;result name="notAuthenticated" do="Logon" /&gt;
      &lt;/results&gt;
    &lt;/event-handler&gt;
</code>

This event is a copy of the Home event with a slight modification. Like the Home event, I need to ensure you are logged on. So the first message broadcast is to get your authentication status. Next I broadcast a message to get your galleries. The next tweak is in the views where I specify the dspGalleries.cfm file. This will display our galleries. Now let's add the getMyGalleries call to the controller:

<code>
      &lt;message-listener message="getMyGalleries" function="getMyGalleries" /&gt;
</code>

(Hopefully this is getting a bit easier for you now.) Next I add this logic to the controller. First lets start with getMyGalleries:

<code>
&lt;cffunction name="getMyGalleries" access="public" returntype="void" output="false" hint="I get a user's galleries."&gt;
	&lt;cfargument name="event" type="ModelGlue.Core.Event" required="true"&gt;
	&lt;cfset var galleries = ""&gt;
	
	&lt;cfif isAuthenticated()&gt;
		&lt;cfset galleries = variables.galleryGateway.getGalleriesForUser(session.userBean.getUsername())&gt;
		&lt;cfset arguments.event.setValue("galleries", galleries)&gt;
	&lt;/cfif&gt;
&lt;/cffunction&gt;
</code>

Nothing too complex here. Note that I created a new isAuthenticated method. I'll discuss that in a section at the end. I then simply call the getGalleriesForUser method I showed above. I set the value in the event so it will be available in the view. Nice and simple, right? In case you are wondering, variables.galleryGateway simply comes from the init method of my controller. I've updated it to make an instance of both the gallery DAO and gallery gateway. Now let's display the galleries. This is done in dspGalleries.cfm. I wanted to use one simple page to handle both showing your galleries as well as displaying a form to quickly add a gallery. So for example, the view starts with:

<code>
&lt;cfset viewState.setValue("title", "Your Galleries")&gt;
&lt;cfset galleries = viewState.getValue("galleries")&gt;
</code>

This handles setting the title and grabbing the current galleries. Then I get the default values for the form. 

<code>
&lt;!--- Used for form. ---&gt;
&lt;cfset name = viewState.getValue("name", "")&gt;
&lt;cfset access = viewState.getValue("access", "")&gt;
&lt;cfset password = viewState.getValue("password", "")&gt;

&lt;!--- grab potential errors ---&gt;
&lt;cfset errors = viewState.getValue("errors")&gt;
</code>

This is a bit different than how I did the register form. Instead of doing cfparam for form variables, I'm checking the view state for the form variables instead. Remember that Model-Glue will automatically pick up on those variables and add them to the view state. I want to thank Dave Carabetta for <a href="http://ray.camdenfamily.com/index.cfm/2006/3/20/Building-your-first-ModelGlue-application-part-5#c2301FEB5-D50D-DF5B-51D58DD0D14C3C24">pointing this out</a> in an earlier entry. I agree with him - it is better practice. 

After this is a simple dump of the query and a form for adding the gallery. Since this is generic HTML I'll not bother pasting it all into this already too-long entry. I do want to show the actual form:

<code>
&lt;form action="#viewstate.getValue("myself")#addgallery" method="post"&gt;
&lt;table&gt;
	&lt;tr&gt;
		&lt;td&gt;gallery name:&lt;/td&gt;
		&lt;td&gt;&lt;input type="text" name="name" value="#name#"&gt;&lt;/td&gt;
	&lt;/tr&gt;
	&lt;tr&gt;
		&lt;td&gt;access:&lt;/td&gt;
		&lt;td&gt;
		&lt;select name="access"&gt;
		&lt;option value="public" &lt;cfif access is "public"&gt;selected&lt;/cfif&gt;&gt;Anyone can see it (public)&lt;/option&gt;
		&lt;option value="password" &lt;cfif access is "password"&gt;selected&lt;/cfif&gt;&gt;A password is required (enter it below)&lt;/option&gt;
		&lt;option value="private" &lt;cfif access is "private"&gt;selected&lt;/cfif&gt;&gt;For your eyes only! (private)&lt;/option&gt;
		&lt;/select&gt;
		&lt;/td&gt;
	&lt;/tr&gt;
	&lt;tr&gt;
		&lt;td&gt;password:&lt;/td&gt;
		&lt;td&gt;&lt;input type="text" name="password" value="#password#"&gt;&lt;/td&gt;
	&lt;/tr&gt;
	&lt;tr&gt;
		&lt;td&gt;&nbsp;&lt;/td&gt;
		&lt;td&gt;&lt;input type="submit" name="submit" value="Create Gallery"&gt;&lt;/td&gt;
	&lt;/tr&gt;
&lt;/table&gt;
&lt;/form&gt;
</code>

The only thing special here is the access. As you know, I am using 3 flags to handle how the access done. That's the back end. But obviously I want to make it simple for the user. So in my view I'm just using one "access" drop down. The controller will be intelligent enough to translate this into the right access settings. So once again, I return back to my config file and add the event:

<code>
    &lt;event-handler name="AddGallery"&gt;
      &lt;broadcasts&gt;
      	&lt;message name="getAuthenticated" /&gt;
      	&lt;message name="addgallery" /&gt;
      &lt;/broadcasts&gt;
      &lt;results&gt;
      	&lt;result name="notAuthenticated" do="Logon" /&gt;
      	&lt;result do="Galleries" /&gt;
      &lt;/results&gt;
    &lt;/event-handler&gt;
</code>

Nothing special here. But notice that I go right back to galleries. As I mentioned, the add form is on the same page where you view the galleries. The event calls addGallery, which I added to my controller and this is what I used in my controller:

<code>
&lt;cffunction name="addGallery" access="public" returntype="void" output="false" hint="I add a gallery."&gt;
	&lt;cfargument name="event" type="ModelGlue.Core.Event" required="true"&gt;

	&lt;cfset var bean = arguments.event.makeEventBean("model.galleryBean") /&gt;
	&lt;cfset var errors = ""&gt;
		
	&lt;!--- Translate Access setting ---&gt;
	&lt;cfset bean.setIsPublic(false)&gt;
	&lt;cfset bean.setIsPassword(false)&gt;
	&lt;cfset bean.setIsPrivate(false)&gt;
	&lt;cfset bean.setUsername(session.userbean.getUsername())&gt;
	
	&lt;cfswitch expression="#event.getValue("access")#"&gt;
		
		&lt;cfcase value="public"&gt;
			&lt;cfset bean.setIsPublic(true)&gt;
			&lt;cfset bean.setPassword("")&gt;
		&lt;/cfcase&gt;

		&lt;cfcase value="private"&gt;
			&lt;cfset bean.setIsPrivate(true)&gt;
			&lt;cfset bean.setPassword("")&gt;
		&lt;/cfcase&gt;
		
		&lt;cfcase value="password"&gt;
			&lt;cfset bean.setIsPassword(true)&gt;
		&lt;/cfcase&gt;

	&lt;/cfswitch&gt;
	
	&lt;cfset errors = bean.validate()&gt;	
			
	&lt;cfif not arrayLen(errors)&gt;
		&lt;cfset galleryDAO.create(bean)&gt;	
		&lt;!--- clear values ---&gt;
		&lt;cfset arguments.event.setValue("name", "")&gt;
		&lt;cfset arguments.event.setValue("access", "")&gt;
		&lt;cfset arguments.event.setValue("password", "")&gt;
	&lt;cfelse&gt;
		&lt;cfset arguments.event.setValue("errors", errors) /&gt;
	&lt;/cfif&gt;
&lt;/cffunction&gt;
</code>

Pretty big and there are some interesting things going on here, so let's take it slow. First off, we make use of the makeEventBean function. I mentioned this during the registration process. It's a nice short cut to copy event data to a bean. However, in this case, our gallery bean does <b>not</b> match up exactly with our form. Specifically the security settings. Notice that I set all the access flags to false. I then use a switch statement to specifically flip the flag depending on what the user had selected. Also note I clear the password in case the user entered one by accident. I then do my normal validation and if all is good, I run the create() method on my gallery DAO. Lastly, since I know I'm going right back to a view that has the form, I reset the event values for the form so they are cleared.

Whew! That was a heck of a lot of stuff there. Since this entry is huge, I'm going to leave deleting and updating galleries till part 8. Part 9 will see us <i>finally</i> uploading images and rendering the gallery. This will be an insecure view of the gallery. Part 10 will add the security layer depending on the access settings. Again, I apologize for the size of this entry. As I've mentioned before, when everything is done, there will be a zip with PDFs that will be a bit easier to read, along with the code and SQL fies. Don't forget you can play with the application here: <a href="http://pg1.camdenfamily.com">http://pg1.camdenfamily.com</a>.

<b>Summary</b>
<ul>
<li>This entry focused on the gallery model. I added a gallery bean, DAO, and gateway.
<li>We hooked up this model to our controller. A user can now view and add galleries.
</ul>

Lastly, I've made a few changes to the application that are not critical to the lessons here. So you can ignore the following if you want. 

<ul>
<li>Trond Ulseth found a bug in my user DAO and gateway. I was using a non-existent userID field for the primary key instead of the username. This is corrected. 
<li>My controller had a method, getAuthenticated, that was used to return if a user was logged in. But - it was tied to Model-Glue. By that I mean it expected an event argument and updated the event with a result. This meant that other methods in the controller couldn't use it. I added a isAuthenticated method that simply returns a boolean. The getAuthenticated uses this method now, as does getMyGalleries. 
<li>In general if I make a small tweak here and there, I may not mention it. For example, I added some text to the application's home page. My assumption is that folks won't be bothered by this, but let me know if you have questions.
</ul><p><a href='enclosures/D{% raw %}%3A%{% endraw %}5Cwebsites{% raw %}%5Ccamdenfamily%{% endraw %}5Csource{% raw %}%5Cmorpheus%{% endraw %}5Cblog{% raw %}%5Cenclosures%{% endraw %}2Fwwwroot6%2Ezip'>Download attached file.</a></p>