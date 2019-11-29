---
layout: post
title: "Building your first Model-Glue application (part 10)"
date: "2006-04-06T08:04:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2006/04/06/Building-your-first-ModelGlue-application-part-10
guid: 1192
---

<img src="http://ray.camdenfamily.com/images/mg.jpg" align="left" border="1" hspace="5"> Welcome to the tenth installment of "Building your first Model-Glue application." This is the final entry dealing with actually building the site, and will be followed by an entry that talks about what I did  right, what I did wrong, what I didn't do, etc. Today's entry will deal with the gallery security problem. If you remember, our photo galleries had three different types of access:
<!--more-->
<ul>
<li>Public - Anyone can view it.
<li>Private - Only the owner can view it.
<li>Password - Anyone can view it if they provide the password.
</ul>

Let's start adding this logic to our application. The first thing I did was to logon to the application (remember you can demo it <a href="http://pg1.camdenfamily.com">here</a>) and view a public gallery. I then switched to the <a href="http://www.microsoft.com/windows/ie/default.mspx">Devil's Browser</a> and pasted in the same URL. I noticed that it asked to me logon, a totally wrong response for a public gallery. I remembered that my ViewGallery event was running a security check, so I simply removed it from there:

<code>
    &lt;event-handler name="ViewGallery"&gt;
      &lt;broadcasts&gt;
      	&lt;message name="getGallery" /&gt;
      	&lt;message name="getImagesForGallery" /&gt;
      &lt;/broadcasts&gt;
      &lt;views&gt;
      	&lt;include name="body" template="dspGallery.cfm" /&gt;
		&lt;include name="main" template="dspTemplate.cfm" /&gt;
      &lt;/views&gt;
      &lt;results&gt;
      	&lt;result name="badGallery" do="Home" redirect="yes" /&gt;
      &lt;/results&gt;
    &lt;/event-handler&gt;
</code>

This change was enough to let IE view the gallery, and since the rest of the site was protected, if that user clicked elsewhere, they would still be prompted to logon. The next problem was hiding the "Add Image" form. While I'm sure folks don't mind sharing their galleries, I doubt they want just anyone adding to the gallery. There are a few ways to solve this. One way that occurred to me would be to simply if the current user is logged in, and if so, compare their username to the galleries owner. I already passed the gallery to the view, so why not pass the current user. This seems like something that would be appealing to <i>all</i> my events probably. Model-Glue controllers come with a onRequestStart and onRequestEnd method that are automatically called on each request. This is a great place to put such logic. I've modified onRequestStart to pass in the current user, if one exists.

<code>
&lt;cffunction name="OnRequestStart" access="Public" returntype="void" output="false" hint="I am an event handler."&gt;
  &lt;cfargument name="event" type="ModelGlue.Core.Event" required="true"&gt;
  
  &lt;cfif isAuthenticated()&gt;
  	&lt;cfset arguments.event.setValue("userBean", session.userBean)&gt;
  &lt;/cfif&gt;
&lt;/cffunction&gt;
</code>

Just in case it isn't clear, the above code will set the userBean into the viewState for every event, if it exists. Let's now modify the ViewGallery view to check for this.

<code>
&lt;cfset userBean = viewState.getValue("userBean")&gt;

&lt;!--- show form? ---&gt;
&lt;cfif isSimpleValue(userBean) or userBean.getUsername() neq gallery.getUsername()&gt;
	&lt;cfset showForm = false&gt;
&lt;cfelse&gt;
	&lt;cfset showForm = true&gt;
&lt;/cfif&gt;
</code>

This code first grabs the userBean from the viewState. Remember that viewState.getValue will return an empty string if the value doesn't exist. You can also pass a second value as a default if you want. So my logic simply needs to see if userBean is a simple value, or if the username's don't match up. If so, we hide the form. (I just added a cfif to the form on the bottom of the view.) Last but not least, now let's work in the controller to ensure that the gallery is actually pubic if the user isn't logged in. I begin with this modification to getGallery() in the controller:

<code>
	&lt;!--- security check ---&gt;
	&lt;cfif not isAuthenticated() and not gallery.getIsPublic() and not gallery.getIsPassword()&gt;
		&lt;cfset arguments.event.addResult("badGallery")&gt;
	&lt;/cfif&gt;
</code>

Nice and short. Basically, if I'm not logged in and the gallery isn't public or password protected, add the badGallery event. To test, I simply returned to Firefox, edited the gallery, and reloaded IE, and I was immediately sent away.

Now let's tackle the next simple security check - the private gallery. I modified the if block above like so:

<code>
	&lt;!--- security check ---&gt;
	&lt;cfif not isAuthenticated() and not gallery.getIsPublic() and not gallery.getIsPassword()&gt;
		&lt;cfset arguments.event.addResult("badGallery")&gt;
	&lt;cfelseif gallery.getIsPrivate() and (not isAuthenticated() or gallery.getUsername() neq session.userBean.getUsername())&gt;
		&lt;cfset arguments.event.addResult("badGallery")&gt;	
	&lt;/cfif&gt;
</code>

This time the logic is - if the gallery is private and either I'm not logged in or the usernames don't match, throw the badGallery result. 

Last but not least - how to handle password protected galleries. The first problem I have is - how do I know what gallery you have access to? I mean sure I can prompt you for a password, ensure it matches, and that works great, for <i>one</i> gallery. How do I then re-prompt you for another, different password protected gallery? I think I'll simply use the session scope. I will store a nice list of gallery IDs that you have been authenticated with. This has one problem. It's possible the gallery owner could change the security settings on the gallery. If the gallery is changed to private, then our security system will catch it. If they change the password, then it will not. I don't think this is a huge big deal though so I won't worry about it. Let's add that check now.

<code>
	&lt;!--- security check ---&gt;
	&lt;cfif not isAuthenticated() and not gallery.getIsPublic() and not gallery.getIsPassword()&gt;
		&lt;cfset arguments.event.addResult("badGallery")&gt;
	&lt;cfelseif gallery.getIsPrivate() and (not isAuthenticated() or gallery.getUsername() neq session.userBean.getUsername())&gt;
		&lt;cfset arguments.event.addResult("badGallery")&gt;	
	&lt;cfelseif gallery.getIsPassword() and 
			  	(not isAuthenticated() or gallery.getUsername() neq session.userBean.getUsername())
				and
				(not isGalleryAuthenticated(gallery.getID()))&gt;
	&lt;/cfif&gt;
</code>

Notice that I now check to see if the gallery is password protected, and if so, I check a new function, isGalleryAuthenticated(). This is basic abstraction (hey, isn't that a bad Sharon Stone movie?) but also a reflection of me not being 100% sure about the best way to store the fact that you have been authenticated with a gallery. Call this "Planning for my own stupidity." When I figure out a smarter way to do things later on, I'll just modify the isGalleryAuthenticated() method. And speaking of that - here it is:

<code>
&lt;cffunction name="isGalleryAuthenticated" access="private" returnType="boolean" output="false" hint="Internal method to return if a user is ok for a gallery."&gt;
	&lt;cfargument name="galleryid" type="numeric" required="true"&gt;
	
	&lt;cfif not structKeyExists(session,"galleryauthenticationlist")&gt;
		&lt;cfreturn false&gt;
	&lt;/cfif&gt;
	
	&lt;cfreturn listFind(session.galleryauthenticationlist, arguments.galleryid) gte 1&gt;
&lt;/cffunction&gt;
</code>

This is rather trivial code. It simply checks for a list of IDs in the session scope. If it exists, and if the gallery ID we are checking for is in the list, then return true. If you scan back up the page, you saw that I returned a new result, passwordGallery, if the user needs to authenticate. Let's add that to the Model-Glue config event handler for ViewGallery:

<code>
    &lt;event-handler name="ViewGallery"&gt;
      &lt;broadcasts&gt;
      	&lt;message name="getGallery" /&gt;
      	&lt;message name="getImagesForGallery" /&gt;
      &lt;/broadcasts&gt;
      &lt;views&gt;
      	&lt;include name="body" template="dspGallery.cfm" /&gt;
		&lt;include name="main" template="dspTemplate.cfm" /&gt;
      &lt;/views&gt;
      &lt;results&gt;
      	&lt;result name="badGallery" do="Home" redirect="yes" /&gt;
      	&lt;result name="passwordGallery" do="PasswordGallery" redirect="yes" append="id"/&gt;
      &lt;/results&gt;
    &lt;/event-handler&gt;
</code>

Now I add the new event:

<code>
    &lt;event-handler name="PasswordGallery"&gt;
      &lt;broadcasts /&gt;
      &lt;views&gt;
      	&lt;include name="body" template="dspPasswordGallery.cfm" /&gt;
	&lt;include name="main" template="dspTemplate.cfm" /&gt;
      &lt;/views&gt;
      &lt;results /&gt;
    &lt;/event-handler&gt;
</code>

Nothing too special here. Basically I tell the event which view to use. Let's look at the view:

<code>
&lt;cfset viewState.setValue("title", "PhotoGallery Authentication")&gt;

&lt;cfset badLogon = viewState.getValue("badLogon", false)&gt;
&lt;cfset id = viewState.getValue("id", 0)&gt;

&lt;cfoutput&gt;
&lt;p&gt;
The gallery you want to view is password protected, please enter the password below.
&lt;/p&gt;

&lt;cfif badLogon&gt;
&lt;p&gt;
&lt;b&gt;
The password you entered was not correct.&lt;br /&gt;
Please try again.
&lt;/b&gt;
&lt;/p&gt;
&lt;/cfif&gt;

&lt;p&gt;
&lt;form action="#viewstate.getValue("myself")#passwordgalleryattempt" method="post"&gt;
&lt;input type="hidden" name="id" value="#id#"&gt;
&lt;table&gt;
	&lt;tr&gt;
		&lt;td&gt;password:&lt;/td&gt;
		&lt;td&gt;&lt;input type="password" name="password"&gt;&lt;/td&gt;
	&lt;/tr&gt;
	&lt;tr&gt;
		&lt;td&gt;&nbsp;&lt;/td&gt;
		&lt;td&gt;&lt;input type="submit" name="auth" value="Authenticate"&gt;&lt;/td&gt;
	&lt;/tr&gt;
&lt;/table&gt;
&lt;/form&gt;
&lt;/p&gt;
&lt;/cfoutput&gt;</code>

Nothing too special here. I basically copied the dspLogon.cfm view and modified it to only prompt for a password. I won't have an array of errors this time, but simply a flag saying my logon was bad. Notice how I use the default value argument to getValue. I'm also grabbing the ID from the viewState. This was the ID of the gallery that I'm trying to view. Now let's add the passwordgalleryattempt event to the config:

<code>
    &lt;event-handler name="PasswordGalleryAttempt"&gt;
      &lt;broadcasts&gt;
      	&lt;message name="authenticateGallery" /&gt;
      &lt;/broadcasts&gt;
      &lt;results&gt;
      	&lt;result name="galleryAuthenticated" do="ViewGallery" redirect="yes" append="id"/&gt;      	&lt;result name="notGalleryAuthenticated" do="PasswordGallery" redirect="yes"/&gt;
      &lt;/results&gt;
    &lt;/event-handler&gt;
</code>

This acts much like the Logon event. Broadcast a message - and either get a good or bad response. If it is good, then go ahead and view the gallery. Otherwise, prompt for the password again. The event broadcasts authenticateGallery which I need to add to my controller block:

<code>
      &lt;message-listener message="authenticateGallery" function="authenticateGallery" /&gt;
</code>

And of course then add to the controller:

<code>
&lt;cffunction name="authenticateGallery" access="public" returnType="void" output="false"&gt;
	&lt;cfargument name="event" type="ModelGlue.Core.Event" required="true"&gt;
	&lt;cfset var password = arguments.event.getValue("password")&gt;
	&lt;cfset var id = arguments.event.getValue("id")&gt;

	&lt;cfset gallery = variables.galleryDAO.read(id)&gt;

	&lt;cfif gallery.getIsPassword() and gallery.getPassword() is password&gt;
		&lt;cfif not structKeyExists(session, "galleryauthenticationlist")&gt;
			&lt;cfset session.galleryauthenticationlist = ""&gt;
		&lt;/cfif&gt;
		&lt;cfif not listFind(session.galleryauthenticationlist, id)&gt;
			&lt;cfset session.galleryauthenticationlist = listAppend(session.galleryauthenticationlist, id)&gt;
		&lt;/cfif&gt;
		&lt;cfset arguments.event.addResult("galleryAuthenticated")&gt;
	&lt;cfelse&gt;
		&lt;cfset arguments.event.setValue("badLogon", true)&gt;
		&lt;cfset arguments.event.addResult("notGalleryAuthenticated")&gt;	
	&lt;/cfif&gt;
		
&lt;/cffunction&gt;
</code>

As with the user logon, I do the authentication (this time comparing the password against the gallery password), and if things work out, I update their session value that stores their gallery authentication list. If not, I set the flag for my view and add the proper result.

Guess what - we are done! The application is definitely far from perfect. In my next entry I'll talk a lot about what I didn't do and what I should have done different. Consider this an open call to folks to rip me a new one. I've done that plenty of times in the contests, so I figure it's time for the community to strike back (grin). I am as flawless as Microsoft and I think people can learn from my mistakes as well as my advice, so those of you who have been holding back - just get ready for the next entry. 

As a reminder, you can view the application here:
<a href="http://pg1.camdenfamily.com">pg1.camdenfamily.com</a> 

If folks want to share images, please post a comment along with the password (if password protected) or just the URL if public.

<b>Summary:</b>
<ul>
<li>In this entry I finally added the security to the ViewGallery event.
<li>The security needed to do different things depending on the access level of the gallery.
<li>I use another session variable to store what galleries you are logged in to. This is important as I need to differentiate between various galleries that you can view with passwords.
</ul><p><a href='enclosures/D{% raw %}%3A%{% endraw %}5Cwebsites{% raw %}%5Ccamdenfamily%{% endraw %}5Csource{% raw %}%5Cmorpheus%{% endraw %}5Cblog{% raw %}%5Cenclosures%{% endraw %}2Fwwwroot9%2Ezip'>Download attached file.</a></p>