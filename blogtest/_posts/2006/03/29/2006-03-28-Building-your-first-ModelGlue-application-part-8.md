---
layout: post
title: "Building your first Model-Glue application (part 8)"
date: "2006-03-29T08:03:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2006/03/29/Building-your-first-ModelGlue-application-part-8
guid: 1174
---

<img src="http://ray.camdenfamily.com/images/mg.jpg" align="left" border="1" hspace="5"> Welcome to the eight installation to my tutorial on building a Model-Glue application. In the <a href="http://ray.camdenfamily.com/index.cfm/2006/3/25/Building-your-first-ModelGlue-application-part-7">last entry</a>, I talked about the Gallery object. Because the entry ran a bit long, I didn't get to cover everything we needed, so before moving on to photo uploading (which is the whole point of the application), I want to wrap up some final Gallery actions, specifically deleting and updating the gallery data.
<!--more-->
Let's handle deleting since it's actually the easiest of the actions. If you remember, the Galleries link showed you both a list of your galleries as well as a form to add a new gallery. Let's modify the display to allow for deleting and editing. I've taken the code in dspGalleries.cfm, and added a few new links. Here is the relevant section:

<code>
	&lt;p&gt;
	&lt;table&gt;
	&lt;cfoutput query="galleries"&gt;
	&lt;tr &lt;cfif currentRow mod 2&gt;bgcolor="ghostwhite"&lt;/cfif&gt;&gt;
		&lt;td width="100%"&gt;&lt;a href="#viewState.getValue("myself")#viewgallery&id=#id#"&gt;#name#&lt;/a&gt;&lt;/td&gt;
		&lt;td&gt;
		&lt;nobr&gt;
		&lt;cfif isPublic&gt;Public&lt;cfelseif isPassword&gt;Password Req.&lt;cfelse&gt;Private&lt;/cfif&gt;
		&lt;/nobr&gt;
		&lt;/td&gt;
		&lt;td&gt;&lt;a href="#viewState.getValue("myself")#editgallery&id=#id#"&gt;[Edit]&lt;/a&gt;&lt;/td&gt;
		&lt;td&gt;&lt;a href="#viewState.getValue("myself")#deletegallery&id=#id#"&gt;[Delete]&lt;/a&gt;&lt;/td&gt;
	&lt;/tr&gt;
	&lt;/cfoutput&gt;
	&lt;/table&gt;
	&lt;/p&gt;
</code>

As you can see, I've converted the simple list to a table. I've added links for the edit and delete events. I also added a simple message that shows the security settings for each gallery. As I said, I wanted to cover deleting first, so let's look at the deletegallery event I'm adding to the XML file. 

<code>
    &lt;event-handler name="DeleteGallery"&gt;
      &lt;broadcasts&gt;
      	&lt;message name="getAuthenticated" /&gt;
      	&lt;message name="deleteGallery" /&gt;
      &lt;/broadcasts&gt;
      &lt;results&gt;
      	&lt;result name="notAuthenticated" do="Logon" redirect="yes" /&gt;
      	&lt;result do="Galleries" /&gt;
      &lt;/results&gt;
    &lt;/event-handler&gt;
</code>

Nothing terrible special here. It is basically a clone of the AddGallery method. Do note I'm using redirect now. I talked a bit about why in an <a href="http://ray.camdenfamily.com/index.cfm/2006/3/25/ModelGlue-note-on-events-and-redirects">entry</a> earlier this week. By now you know the next step is to add the call in the controller block:

<code>
      &lt;message-listener message="deleteGallery" function="deleteGallery" /&gt;
</code>

And then add the relevant code in my controller:

<code>
&lt;cffunction name="deleteGallery" access="public" returntype="void" output="false" hint="I delete a gallery."&gt;
	&lt;cfargument name="event" type="ModelGlue.Core.Event" required="true"&gt;
	&lt;cfset var galleryToKill = arguments.event.getValue("id")&gt;
	&lt;cfset var myUsername = session.userbean.getUsername()&gt;
	&lt;cfset var gallery = variables.galleryDAO.read(galleryToKill)&gt;
	
	&lt;cfif gallery.getUsername() eq myUsername&gt;
		&lt;cfset variables.galleryDAO.delete(galleryToKill)&gt;
	&lt;/cfif&gt;
&lt;/cffunction&gt;
</code>

So there is something a bit interesting going on here. I'm passing the ID of the gallery to delete, but I don't want to just delete the gallery without checking first to make sure it's one of <i>your</i> galleries. This is done by simply comparing your username to the username associated with gallery object. If they match, I go ahead with the delete. 

Now for editing. As you saw in the last entry, the gallery display page has a form to add a new gallery. I want to tweak this so it also works for editing an existing entry. The first thing I think I should do is see if I can pass the gallery to the view. So let's start as we always do - with the XML file:

<code>
    &lt;event-handler name="EditGallery"&gt;
      &lt;broadcasts&gt;
      	&lt;message name="getAuthenticated" /&gt;
      	&lt;message name="editGallery" /&gt;
      &lt;/broadcasts&gt;
      &lt;results&gt;
      	&lt;result name="notAuthenticated" do="Logon" redirect="yes" /&gt;
      	&lt;result do="Galleries" /&gt;
      &lt;/results&gt;
    &lt;/event-handler&gt;
</code>

Once again, this is nothing more than a copy of the add and delete gallery events. I used this listener in the controller:

<code>
      &lt;message-listener message="editGallery" function="editGallery" /&gt;
</code>

Now let's write the controller code to get the gallery and put it in the view state:

<code>
&lt;cffunction name="editGallery" access="public" returntype="void" output="false" hint="I edit a gallery."&gt;
	&lt;cfargument name="event" type="ModelGlue.Core.Event" required="true"&gt;
	&lt;cfset var galleryToEdit = arguments.event.getValue("id")&gt;
	&lt;cfset var myUsername = session.userbean.getUsername()&gt;
	&lt;cfset var gallery = variables.galleryDAO.read(galleryToEdit)&gt;
	
	&lt;cfif gallery.getUsername() eq myUsername&gt;
		&lt;cfset arguments.event.setValue("gallery", gallery)&gt;
		&lt;cfif not arguments.event.valueExists("name")&gt;
			&lt;cfset arguments.event.setValue("name", gallery.getName())&gt;
		&lt;/cfif&gt;
		&lt;cfif not arguments.event.valueExists("access")&gt;
			&lt;cfif gallery.getIsPublic()&gt;
				&lt;cfset arguments.event.setValue("access", "public")&gt;
			&lt;cfelseif gallery.getisPassword()&gt;
				&lt;cfset arguments.event.setValue("access", "password")&gt;
				&lt;cfset arguments.event.setValue("password", gallery.getPassword())&gt;
			&lt;cfelse&gt;
				&lt;cfset arguments.event.setValue("access", "private")&gt;
			&lt;/cfif&gt;
		&lt;/cfif&gt;
	&lt;/cfif&gt;
&lt;/cffunction&gt;
</code>

This is like the delete event, only this time we set values from the gallery into the view state. I did something a bit different with my view state. Instead of just setting the values, I'm checking to see if the value exists already using valueExists(). I did this since I didn't want to overwrite any possible changes that may occur during editing. Also note that I have to translate the security settings into a generic access setting for the form. I also pass the entire gallery bean into the view state. Now I need to modify the gallery view to handle this possible change. I've modified dspGalleries.cfm with these changes. (Again, I'm not going to show the entire file, but rather what has been updated.) First I see if a gallery exists in the view state:

<code>
&lt;!--- editing? ---&gt;
&lt;cfset editingGallery = viewState.getValue("gallery")&gt;
</code>

Remember that viewState.getValue() will return a simple empty string is nothing is there. I then modified the text above the form to check for this:

<code>
&lt;cfif isSimpleValue(editingGallery)&gt;

	&lt;cfoutput&gt;
	&lt;p&gt;
	Please use the form below to create a new gallery. 
	&lt;/p&gt;
	&lt;/cfoutput&gt;
	
&lt;cfelse&gt;

	&lt;cfoutput&gt;
	&lt;p&gt;
	Please use the form below to edit the gallery: #editingGallery.getName()# 
	&lt;/p&gt;
	&lt;/cfoutput&gt;

&lt;/cfif&gt;
</code>

So far so good. I then want the form action to change based on whether or not this is a new gallery:

<code>
&lt;cfif not isSimpleValue(editingGallery)&gt;
	&lt;form action="#viewstate.getValue("myself")#updategallery" method="post"&gt;
	&lt;input type="hidden" name="id" value="#editingGallery.getID()#"&gt;
&lt;cfelse&gt;
	&lt;form action="#viewstate.getValue("myself")#addgallery" method="post"&gt;
&lt;/cfif&gt;
</code>

As you can see, in the case where I'm editing, I pass along the ID of the gallery. (For those who have access to the last version of the code, there was a bug in galleryDAO.cfc where the ID was not returned. That is fixed now.) Finally, I want to tweak the submit button a bit depending on the state we are in:

<code>
&lt;cfif isSimpleValue(editingGallery)&gt;
	&lt;input type="submit" name="submit" value="Create Gallery"&gt;
&lt;cfelse&gt;
	&lt;input type="submit" name="submit" value="Update Gallery"&gt;
&lt;/cfif&gt;
</code>

Ok, that's it for the view. If you try this now, you can see the form populating with data from the gallery. As you may have noticed, there is no way to go from editing back to a blank form unless you click on Galleries in the left hand nav. One thing I could possible add later is a Cancel button. 

Alright - so now we need to build updateGallery event into our XML file:

<code>
    &lt;event-handler name="UpdateGallery"&gt;
      &lt;broadcasts&gt;
      	&lt;message name="getAuthenticated" /&gt;
      	&lt;message name="editGallery" /&gt;
      	&lt;message name="updateGallery" /&gt;
      &lt;/broadcasts&gt;
      &lt;results&gt;
      	&lt;result name="notAuthenticated" do="Logon" redirect="yes" /&gt;
      	&lt;result do="Galleries" /&gt;
      &lt;/results&gt;
    &lt;/event-handler&gt;
</code>

Like the editGallery event, this event broadcasts out a editGallery message. This will be useful in case the user makes an error. It then broadcasts an updateGallery message. I added this to my listeners:

<code>
      &lt;message-listener message="updateGallery" function="updateGallery" /&gt;
</code>

And next I need to add the code in the controller:

<code>
&lt;cffunction name="updateGallery" access="public" returntype="void" output="false" hint="I update a gallery."&gt;
	&lt;cfargument name="event" type="ModelGlue.Core.Event" required="true"&gt;
	&lt;cfset var bean = arguments.event.makeEventBean("model.galleryBean") /&gt;
	&lt;cfset var errors = ""&gt;
	
	&lt;!--- before doing anything, let's check the security ---&gt;
	&lt;cfset var myUsername = session.userbean.getUsername()&gt;
	&lt;cfset var gallery = variables.galleryDAO.read(bean.getID())&gt;

	&lt;cfif gallery.getUsername() neq myUsername&gt;
		&lt;cfset arguments.event.forward("Galleries","")&gt;
	&lt;/cfif&gt;
	
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
		&lt;cfset galleryDAO.update(bean)&gt;
		&lt;!--- clear values ---&gt;
		&lt;cfset arguments.event.setValue("name", "")&gt;
		&lt;cfset arguments.event.setValue("access", "")&gt;
		&lt;cfset arguments.event.setValue("password", "")&gt;
	&lt;cfelse&gt;
		&lt;cfset arguments.event.setValue("gallery", gallery)&gt;
		&lt;cfset arguments.event.setValue("errors", errors)&gt;
	&lt;/cfif&gt;
&lt;/cffunction&gt;
</code>

The first thing you will notice is that this is quite similar to the addGallery code. I'll talk about that a bit more later. Once again I use the very handy makeEventBean function. However, before doing anything with the data, I perform my security check again to ensure that the record I'm editing actually belongs to the current user. Notice how I handle this:

<code>
	&lt;cfif gallery.getUsername() neq myUsername&gt;
		&lt;cfset arguments.event.forward("Galleries","")&gt;
	&lt;/cfif&gt;
</code>

The forward method is a part of the Event object in Model-Glue. This instantly sends the user to a new event, passing along all state values. You can think of it as a better cflocation call. So the rest of the method is pretty much the same code I covered in the previous entry. You see how I handle translating the access setting to the proper security value. The only real difference is how I store the value:

<code>
		&lt;cfset galleryDAO.update(bean)&gt;
</code>

So I mentioned that the add and update events are pretty similar. That's bad. Bad as in a "disturbance in the Force" bad. I know that I should take these two methods and combine them. The portion that worries me the most if the "Access to Security flag" section. I can see that changing in the future, and if it does, I'm going to need to remember to update it multiple locations. This is where the beauty of MVC (Model, View, Controller) really shines (abstraction in general actually). When I do get around to updating my controller, there is zero work I'll have to do in either my Model or View. I know I'm probably repeating myself, but I can't drive home enough the benefits of code abstraction. 

<b>Summary</b>
<ul>
<li>This entry was mostly a followup to the last entry. We finished the work on our "Gallery" model by adding methods to both delete and update gallery objects.
<li>I also introduced you to the forward() method of the Event object. As you can see, it was a useful way to quickly abort the update method and send the user away. <b>This is NOT the only way to do it.</b> I could have simply used an event result. I could have simply checked and if the security test failed, don't do anything. As with everything ColdFusion related, there is more than one way to skin the cat.
</ul>

That's it for today. The next entry will <i>finally</i> get us uploading images. (I swear, really!)<p><a href='enclosures/D{% raw %}%3A%{% endraw %}5Cwebsites{% raw %}%5Ccamdenfamily%{% endraw %}5Csource{% raw %}%5Cmorpheus%{% endraw %}5Cblog{% raw %}%5Cenclosures%{% endraw %}2Fwwwroot7%2Ezip'>Download attached file.</a></p>