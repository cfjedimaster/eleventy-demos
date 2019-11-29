---
layout: post
title: "Building your first Model-Glue application (part 9)"
date: "2006-04-03T22:04:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2006/04/03/Building-your-first-ModelGlue-application-part-9
guid: 1185
---

<img src="http://ray.camdenfamily.com/images/mg.jpg" align="left" border="1" hspace="5"> Welcome to the ninth installment of the "Build your first Model-Glue application" series. We are approaching the end (really, I swear) of the application with only two more articles after today's entry. (That's the plan anyway.) The reason I built this application was to share photos, and gosh darnit, it's about time I actually allow for it.
<!--more-->
So lets talk about photos. There are many properties I think I could use with photos, but in an effort to keep things nice and simple, I've narrowed them down to the following properties:

<table border="1">
<tr>
<td>id</td>
<td>This is the primary key. It auto increments.</td>
</tr>
<tr>
<td>originalfilename</td>
<td>This is the file name of the image as it was when you uploaded. I will be saving all images in one folder, so it's possible ColdFusion will need to rename them. I want to store the original file name so that the uploader recognizes it.</td>
</tr>
<tr>
<td>filename</td>
<td>Obviously the application also needs to know the <i>real</i> filename of the image.</td>
</tr>
<tr>
<td>caption</td>
<td>This is an optional caption that can be added to an image for descriptive purposes.</td>
</tr>
<tr>
<td>galleryidfk</td>
<td>A pointer back to the gallery this image belongs in.</td>
</tr>
</table>

Again - there is a lot more I can, and probably should add to this list, but I want to keep things nice and simple. After defining my model, I then create the bean, DAO, and gateway CFCs. Since they are basically copies of the gallery versions, there isn't any real need to show the complete files.

I'm going to set up image adding/editing much like it was done with galleries. When you view a gallery, a form will be present at the bottom to either add or edit an image. So let's start with simple gallery viewing. I already made a link to do this on the view galleries page. The event name is viewgallery. Here is what I added to the ModelGlue.xml file:

<code>
    &lt;event-handler name="ViewGallery"&gt;
      &lt;broadcasts&gt;
      	&lt;message name="getAuthenticated" /&gt;
      	&lt;message name="getGallery" /&gt;
	&lt;message name="getImagesForGallery" /&gt;
      &lt;/broadcasts&gt;
      &lt;views&gt;
      	&lt;include name="body" template="dspGallery.cfm" /&gt;
	&lt;include name="main" template="dspTemplate.cfm" /&gt;
      &lt;/views&gt;
      &lt;results&gt;
      	&lt;result name="notAuthenticated" do="Logon" redirect="yes" /&gt;
      	&lt;result name="badGallery" do="Home" redirect="yes" /&gt;
      &lt;/results&gt;
    &lt;/event-handler&gt;
</code>

As you can see, there isn't anything special here. As with other methods, I check security to ensure the user is logged on. There is also a 'badGallery' result. I'll use this in case the user messes with the ID or bookmarks an ID that doesn't exist anymore. This event broadcasts getGallery and getImagesForGallery, so next I need to add them to my controller block:

<code>
&lt;message-listener message="getGallery" function="getGallery" /&gt;
&lt;message-listener message="getImagesForGallery" function="getImagesForGallery" /&gt;
</code>

And now let's hop into the controller to add this functionality. First, getGallery:

<code>
&lt;cffunction name="getGallery" access="public" returntype="void" output="false" hint="I get a gallery."&gt;
	&lt;cfargument name="event" type="ModelGlue.Core.Event" required="true"&gt;
	&lt;cfset var galleryID = arguments.event.getValue("id")&gt;
	&lt;cfset var gallery = variables.galleryDAO.read(galleryID)&gt;

	&lt;cfif gallery.getID() neq galleryID&gt;
		&lt;cfset arguments.event.addResult("badGallery")&gt;
	&lt;/cfif&gt;	
	&lt;cfset arguments.event.setValue("gallery", gallery)&gt;
&lt;/cffunction&gt;
</code>

Nothing special here. Note that I have no security here. As you know, we support multiple types of security settings when it comes to viewing galleries. For now, I'm just keeping things nice and open. The only check I bother with is to ensure the ID was a valid one. It doesn't ensure that it's numeric (that's something I'll come back to in the later "clean up" entry). But if the user changes the ID to a value that doesn't exist in the database, this will catch it.  Now let's get the images:

<code>
&lt;cffunction name="getImagesForGallery" access="public" returntype="void" output="false" hint="I return a query of images for a gallery."&gt;
	&lt;cfargument name="event" type="ModelGlue.Core.Event" required="true"&gt;
	&lt;cfset var galleryID = arguments.event.getValue("id")&gt;	
	&lt;cfset var images =  variables.imageGateway.getImagesForGallery(galleryID)&gt;

	&lt;cfset arguments.event.setValue("images", images)&gt;
	&lt;cfset arguments.event.setValue("imagedir", getModelGlue().getConfigSetting("imagedir"))&gt;
&lt;/cffunction&gt;
</code>

Once again - fairly simple. If you remember the gallery gateway, I had built both a getGalleries and getGalleriesforUser. I've done the same thing with the image gateway. There is a generic getImages method along with a getImagesForGallery method as I used above. Later on I'm going to talk about the folder where images will be stored. For right now just know that I'm passing this value to the viewState so I can render the images. Last but not least, we need to build the view, dspGallery.cfm, so I can actually display the gallery. Let's look at this template:

<code>
&lt;cfset gallery = viewState.getValue("gallery")&gt;
&lt;cfset images = viewState.getValue("images")&gt;

&lt;cfset viewState.setValue("title", "Gallery: #gallery.getName()#")&gt;

&lt;!--- Used for form. ---&gt;
&lt;cfset caption = viewState.getValue("caption", "")&gt;
&lt;cfset originalfilename = viewState.getValue("originalfilename", "")&gt;

&lt;!--- editing? ---&gt;
&lt;cfset editingImage = viewState.getValue("image")&gt;

&lt;!--- grab potential errors ---&gt;
&lt;cfset errors = viewState.getValue("errors")&gt;

&lt;cfif isQuery(images) and images.recordCount&gt;

	&lt;!--- Simple 5 picture per cell dump ---&gt;
	&lt;cfdump var="#images#"&gt;
	
&lt;cfelse&gt;
	
	&lt;p&gt;
	This gallery is empty. Upload some photos!
	&lt;/p&gt;
	
&lt;/cfif&gt;

&lt;cfif isSimpleValue(editingImage)&gt;

	&lt;cfoutput&gt;
	&lt;p&gt;
	Please use the form below to upload a new photo. 
	&lt;/p&gt;
	&lt;/cfoutput&gt;
	
&lt;cfelse&gt;

	&lt;cfoutput&gt;
	&lt;p&gt;
	Please use the form below to edit the photo: #editingImage.getOriginalFilename()# 
	&lt;/p&gt;
	&lt;/cfoutput&gt;

&lt;/cfif&gt;

&lt;cfif isArray(errors) and arrayLen(errors)&gt;
	&lt;cfoutput&gt;
	&lt;ul&gt;
	&lt;b&gt;
	Please correct the following errors:&lt;br&gt;
	&lt;cfloop index="x" from="1" to="#arrayLen(errors)#"&gt;
	&lt;li&gt;#errors[x]#&lt;/li&gt;
	&lt;/cfloop&gt;
	&lt;/b&gt;
	&lt;/ul&gt;
	&lt;/cfoutput&gt;
&lt;/cfif&gt;

&lt;cfoutput&gt;
&lt;p&gt;
&lt;cfif not isSimpleValue(editingImage)&gt;
	&lt;form action="#viewstate.getValue("myself")#updateimage" method="post" enctype="multipart/form-data"&gt;
	&lt;input type="hidden" name="id" value="#gallery.getID()#"&gt;
	&lt;input type="hidden" name="imageid" value="#editingImage.getID()#"&gt;
&lt;cfelse&gt;
	&lt;form action="#viewstate.getValue("myself")#addimage" method="post" enctype="multipart/form-data"&gt;
	&lt;input type="hidden" name="id" value="#gallery.getID()#"&gt;
&lt;/cfif&gt;
&lt;table&gt;
	&lt;tr&gt;
		&lt;td&gt;file:&lt;/td&gt;
		&lt;td&gt;&lt;input type="file" name="originalfilename" value="#originalfilename#"&gt;&lt;/td&gt;
	&lt;/tr&gt;
	&lt;tr&gt;
		&lt;td&gt;caption:&lt;/td&gt;
		&lt;td&gt;&lt;input type="text" name="caption" value="#caption#"&gt;&lt;/td&gt;
	&lt;/tr&gt;
	&lt;tr&gt;
		&lt;td&gt;&nbsp;&lt;/td&gt;
		&lt;td&gt;
		&lt;cfif isSimpleValue(editingImage)&gt;
			&lt;input type="submit" name="submit" value="Upload Image"&gt;
		&lt;cfelse&gt;
			&lt;input type="submit" name="submit" value="Update Image"&gt;
		&lt;/cfif&gt;
		&lt;/td&gt;
	&lt;/tr&gt;
&lt;/table&gt;
&lt;/form&gt;
&lt;/p&gt;
&lt;/cfoutput&gt;
</code>

Ok, so a lot going on here. Let me handle this line by line:

<code>
&lt;cfset gallery = viewState.getValue("gallery")&gt;
&lt;cfset images = viewState.getValue("images")&gt;
</code>

This grabs the data that was stored in our viewstate earlier. I have both the gallery and the images. The next line simply sets the title of the page based on the gallery. 

<code>
&lt;cfset viewState.setValue("title", "Gallery: #gallery.getName()#")&gt;
</code>

As with the galleries, I used the page to handle both showing images and adding or editing images. So I grab the caption and originalfilename values to use later in the form. 

<code>
&lt;cfset caption = viewState.getValue("caption", "")&gt;
&lt;cfset originalfilename = viewState.getValue("originalfilename", "")&gt;
</code>

Since the form may be used for editing, I check the view state to see if the data exists:

<code>
&lt;cfset editingImage = viewState.getValue("image")&gt;
</code>

After this I check for errors, much like every other page in the application using forms. Next notice how I display the gallery:

<code>
&lt;cfif isQuery(images) and images.recordCount&gt;

	&lt;!--- Simple 5 picture per cell dump ---&gt;
	&lt;cfdump var="#images#"&gt;
</code>

If you look at the code in the zip, you won't see this. But this is what I started off with. It lets me focus on the form and start adding data. The dump confirms when things work (or don't work). I'll circle back later and make it pretty.

Let's scroll past the rest and go to the form. In general, it mimics the form I built for working with galleries. Probably the only difference you will want to note is the hidden fields we pass. In either the editing or creating case I pass in the gallery ID. This is so we can return to the gallery. In the case where I'm editing an image I simply add the image ID as well. 

Now that I've got that working, it's time to build support for adding images. My form posts to either addimage or updateimage for the event. Obviously I need to start with addimage. Here is the event I used:

<code>
    &lt;event-handler name="AddImage"&gt;
      &lt;broadcasts&gt;
      	&lt;message name="getAuthenticated" /&gt;
      	&lt;message name="getGallery" /&gt;
      	&lt;message name="addImage" /&gt;
      &lt;/broadcasts&gt;
      &lt;results&gt;
      	&lt;result name="notAuthenticated" do="Logon" redirect="yes" /&gt;
      	&lt;result name="badGallery" do="Home" redirect="yes" /&gt;
      	&lt;result do="ViewGallery" /&gt;
      &lt;/results&gt;
    &lt;/event-handler&gt;
</code>

You will notice I still call getGallery. This is important since it will check and see if a bad gallery ID was passed. It will also let us return to the ViewGallery event when done. The new message broadcast here is addImage, so it needs to be added to the controller block. Here is the actual code for adding an image, and as a warning, I'm going to show something a bit bad. I'll explain why I did it that way and how it could be rewritten the "right" way:

<code>
&lt;cffunction name="addImage" access="public" returntype="void" output="false" hint="I add a image."&gt;
	&lt;cfargument name="event" type="ModelGlue.Core.Event" required="true"&gt;

	&lt;cfset var bean = arguments.event.makeEventBean("model.imageBean") /&gt;
	&lt;cfset var errors = arrayNew(1)&gt;
	&lt;cfset var extension = ""&gt;
	&lt;cfset var theFile = ""&gt;
	
	&lt;!--- gallery id comes from ID ---&gt;		
	&lt;cfset bean.setGalleryIDFK(arguments.event.getValue("id"))&gt;

	&lt;!--- upload file ---&gt;
	&lt;cffile action="upload" destination="#expandPath(getModelGlue().getConfigSetting("imagedir"))#" filefield="originalfilename" nameconflict="makeunique" result="theFile"&gt;

	&lt;!--- get extension ---&gt;
	&lt;cfif listLen(theFile.serverFile, ".") gte 2&gt;
		&lt;cfset extension = listLast(thefile.serverFile, ".")&gt;
	&lt;/cfif&gt;

	&lt;cfif not listFindNoCase("gif,jpg,png", extension)&gt;
		&lt;cfset arrayAppend(errors, "File is the wrong type. It must be a gif, jpg, or png.")&gt;
		&lt;cffile action="delete" file="#expandPath(getModelGlue().getConfigSetting("imagedir"))#/#theFile.serverFile#"&gt;
	&lt;/cfif&gt;

	&lt;cfif not arrayLen(errors)&gt;	
		&lt;!--- set new filename ---&gt;
		&lt;cfset bean.setOriginalFilename(thefile.clientFile)&gt;
		&lt;cfset bean.setFilename(theFile.serverFile)&gt;
		&lt;cfset errors = bean.validate()&gt;	
	&lt;/cfif&gt;
				
	&lt;cfif not arrayLen(errors)&gt;
		&lt;cfset imageDAO.create(bean)&gt;	
		&lt;!--- clear values ---&gt;
		&lt;cfset arguments.event.setValue("originalfilename", "")&gt;
		&lt;cfset arguments.event.setValue("caption", "")&gt;
	&lt;cfelse&gt;
		&lt;cfset arguments.event.setValue("errors", errors) /&gt;
	&lt;/cfif&gt;
&lt;/cffunction&gt;
</code>

There is a lot here, so let's just go down line by line. I start off using my old friend the makeEventBean() method. Our image bean is so small this is probably overkill, but it is a "standard" for me so I use it anyway. After the var scoping, I manually set the gallery foreign key relationship. Why? The gallery was stored in the ID portion of the event, remember that we are viewing a gallery here when adding an image. So I need to use the right value for the gallery. In case you are wondering, the setID() method will be called as well by makeEventBean. I'm not so sure I can since I know we are adding an image and the ID will be overwritten anyway, but it is something to consider returning to later on.

Now for the part that I know will make people groan. I started off this series saying I was still a Model-Glue newbie. One thing that troubled me when I was building an application last month was how to handle form file uploads. You may have noticed that I <i>never</i> directly refer to any scope (except for session for security matters) when it comes to event arguments. I let Model-Glue handle all of that form me. However, the only way to handle a form upload (normally) is with the cffile tag. This bugs me as it adds too much cohesion between the controller and the form scope. However - I got over it. I recognize that it isn't the best solution but it does work. The good news is that there <i>is</i> a way around this, if you want to go down that route. Jared Rypka-Hauer blogged about such a method <a href="http://www.web-relevant.com/blogs/cfobjective/index.cfm?mode=entry&entry=BD613BAF-BDB9-5320-E7F02F683C0421A1">here</a>. Consider it extra credit for this tutorial. The folder for the upload comes from a new Model-Glue setting, imagedir. I added this to the config settings in ModelGlue.xml. I chose the wonderfully imaginative folder name, "pimages."

Next we check the extension. This is <b>not</b> bullet-proof. A better test would be to use some Java methods to actually look into the file as well to ensure the binary data is correct, but again, I'm trying to keep it simple. 

If everything is ok - I then set the original file name. Remember that ColdFusion may rename the file when you upload it. I use the setOriginalFilename was that value, and setFilename for the file that ColdFusion created. After all of that I call the bean's validate method. The rest of the methods follows the same flow that my other methods did. 

Ok - so now I'm going to come back around and work on the display of the gallery. Wanting to keep things simple, all the images were placed under web root, and I'm not even going to secure the actual display of the image. I'm simply going to link to them, and if a user wants to share a URL that points directly to an image, so be it. In fact, I think I kind of like that. I started this entire, gigantic blog series with the preposition that Flickr was a bit flawed in how you share images. So hey - it's a feature and no more insecure than Windows. For the display I decided on a table with five images per row. Ugly - but functional. I also made another design choice and did thumbnails by simply shrinking the image in HTML. There are ways to create "real" thumbnails. I've recommend <a href="http://www.alagad.com/index.cfm/name-aic">Alagad's Image.cfc</a> before and I'll do so here. In the last big Model-Glue application I built, I used Image.cfc to do thumbnails for user profiles. The code is rather simple so I'm going to leave it out of the entry for now. 

So - I hope folks don't mind - but I'm going to make a decision here about the application. I've gotten a lot of good feedback so far (thank you!) but as a writer (or writer wanna-be) I kinda feel like things are dragging a bit. So I'm going to end this entry without "completing" the image portion, specifically editing and deleting images from the gallery. I feel like I'm repeating myself so much that I don't think folks would really learn from it. I want to move on to the next entry where I'll focus on the gallery security, and then finally, a wrap up where I point out the things I'd add to "clean up" the application. If folks <i>really</i> want me to add image deleting/updating, let me know and I'll do it post wrap up. 

<b>Summary:</b>
<ul>
<li>I added the table to store images. I also added corresponding bean, DAO, and gateway CFCs for the data.
<li>I added a new event to handle viewing galleries. This view handled both displaying the images as well as providng a simple form to upload new images.
</ul>

As always, you can view the application <a href="http://pg1.camdenfamily.com">here</a> and you can download it via the download link at the bottom.<p><a href='enclosures/D{% raw %}%3A%{% endraw %}5Cwebsites{% raw %}%5Ccamdenfamily%{% endraw %}5Csource{% raw %}%5Cmorpheus%{% endraw %}5Cblog{% raw %}%5Cenclosures%{% endraw %}2Fwwwroot8%2Ezip'>Download attached file.</a></p>