---
layout: post
title: "Building your first Model-Glue application (part 5)"
date: "2006-03-20T15:03:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2006/03/20/Building-your-first-ModelGlue-application-part-5
guid: 1158
---

In the <a href="http://ray.camdenfamily.com/index.cfm/2006/3/16/Building-your-first-ModelGlue-application-part-4">last entry</a>, I finally showed you how to hook up model information (in this case the model handled our User data) to the Model-Glue controller. This let you logon to the system. Now I need to modify things a bit to let you actually register for the site. Most sites will have features like "Request a Password", but in keeping with things simple, I'm only building a logon form and a register form. If you forget your password, your out of luck. (Although I am planning some entries that take place place <i>after</i> the application is done, so this may be one of the improvements I add.)
<!--more-->
The first thing to do is to add a "Register" link to the logon form. This can be found in dspLogon.cfm. I'm not going to show the entire template, but just the actual Register link.

<code>
&lt;a href="#viewstate.getvalue("myself")#register"&gt;Register&lt;/a&gt;
</code>

I talked about this style of code earlier, and in fact, you can see it in use in the same template in the logon form. The "myself" value from the view state is simply a built-in value that points back to the application itself. All I need to do is append the event name at the end. Let's now add the register event to our ModelGlue.xml file:

<code>
    &lt;event-handler name="Register"&gt;
      &lt;broadcasts /&gt;
      &lt;views&gt;
      	&lt;include name="body" template="dspRegister.cfm" /&gt;
      &lt;/views&gt;
      &lt;results /&gt;
    &lt;/event-handler&gt;
</code>

Nothing too fancy here, in fact, I just cut and pasted the Logon event and renamed it along with the view. Just like the Logon event, and unlike the Home event, we don't need to check for your authentication status, obviously, as you won't be logged in at this point. Now let's build the register form:

<code>
&lt;!--- grab potential errors ---&gt;
&lt;cfset errors = viewState.getValue("errors")&gt;

&lt;cfparam name="form.name" default=""&gt;
&lt;cfparam name="form.username" default=""&gt;

&lt;html&gt;

&lt;head&gt;
&lt;title&gt;PhotoGallery Register&lt;/title&gt;
&lt;/head&gt;

&lt;body&gt;

&lt;cfoutput&gt;
&lt;p&gt;
&lt;h2&gt;Register&lt;/h2&gt;

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

&lt;form action="#viewstate.getValue("myself")#registerattempt" method="post"&gt;
&lt;table&gt;
	&lt;tr&gt;
		&lt;td&gt;name:&lt;/td&gt;
		&lt;td&gt;&lt;input type="text" name="name" value="#form.name#"&gt;&lt;/td&gt;
	&lt;/tr&gt;
	&lt;tr&gt;
		&lt;td&gt;username:&lt;/td&gt;
		&lt;td&gt;&lt;input type="text" name="username" value="#form.username#"&gt;&lt;/td&gt;
	&lt;/tr&gt;
	&lt;tr&gt;
		&lt;td&gt;password:&lt;/td&gt;
		&lt;td&gt;&lt;input type="password" name="password"&gt;&lt;/td&gt;
	&lt;/tr&gt;
	&lt;tr&gt;
		&lt;td&gt;confirm password:&lt;/td&gt;
		&lt;td&gt;&lt;input type="password" name="password2"&gt;&lt;/td&gt;
	&lt;/tr&gt;
	&lt;tr&gt;
		&lt;td&gt;&nbsp;&lt;/td&gt;
		&lt;td&gt;&lt;input type="submit" name="logon" value="Register"&gt;&lt;/td&gt;
	&lt;/tr&gt;
&lt;/table&gt;
&lt;/form&gt;
&lt;/p&gt;
&lt;/cfoutput&gt;
</code>

There is a lot going on here, but lets focus on the Model-Glue portions. The very first thing I do is examine the view state for errors. I haven't built this logic yet, but I know that when I do the form checking, I'm going to return the errors in a variable called errors. I do this for all my forms so it makes it easy to remember. The errors will be an array of messages, so you can see that I loop over them later on to display the issues. Outside of that, everything else here is just a simple form. The only thing special is the use of "myself" again for the link and the event name, registerattempt. 

So now I need to return back to my ModelGlue.xml file. Let's take a second here and think about it. I think you see a pattern here. As I build out this application, I'm going back and forth between my model, my controller, and my view. What I find powerful about this setup is the level of separation between each piece, and how it makes things simpler for me. There have been a lot of discussion lately about frameworks and whether or not they are good or not. Personally I think this is something every developer, or company, needs to decide for themselves. For me, I really like the fact that with Model-Glue, everything has a place and there is a place for everything. I don't want to spend time worrying about where to put files. I don't want to spend time worrying about how my application will operate. I want to spend time worrying the bits of code that are not trivial. The business logic. The things that really require my time - not simple stuff like where each file should go. Anyway, sorry for the mini sermon there. Let's add our registerattempt event.

<code>
    &lt;event-handler name="RegisterAttempt"&gt;
      &lt;broadcasts&gt;
      	&lt;message name="register" /&gt;
      &lt;/broadcasts&gt;
      &lt;results&gt;
      	&lt;result name="goodregister" do="Home" /&gt;
      	&lt;result name="badregister" do="Register" /&gt;
      &lt;/results&gt;
    &lt;/event-handler&gt;
</code>

This acts much like our LogonAttempt event. The only difference here is the broadcast and result handlers. Also, some sites will probably want to send you to a page when you register. Again, to keep things simple, we will simply send the user to the home page. Now we need to add the register message to the controller section:

<code>
&lt;message-listener message="register" function="register" /&gt;
</code>

Then we follow this up by actually adding the register logic to our controller component:

<code>
&lt;cffunction name="register" access="public" returntype="void" output="false" hint="I register a user."&gt;
	&lt;cfargument name="event" type="ModelGlue.Core.Event" required="true"&gt;

	&lt;cfset var bean = arguments.event.makeEventBean("model.UserBean") /&gt;
	&lt;cfset var errors = ""&gt;
		
	&lt;cfset errors = bean.validate()&gt;	

	&lt;cfif arguments.event.getValue("password") neq arguments.event.getValue("password2")&gt;
		&lt;cfset arrayAppend(errors, "Your confirmation password did not match.")&gt;
	&lt;/cfif&gt;
		
	&lt;cfif not arrayLen(errors)&gt;
		&lt;cftry&gt;
			&lt;cfset userDAO.create(bean)&gt;
			&lt;!--- send email ---&gt;
			&lt;cfmail to="#getModelGlue().getConfigSetting("adminemail")#" from="#getModelGlue().getConfigSetting("adminemail")#"
					subject="PhotoGallery Registration"&gt;
New User @ PhotoGallery:

Username:	#bean.getusername()#
Password:	#bean.getpassword()#
Name:		#bean.getname()#
			&lt;/cfmail&gt;
			
			&lt;!--- log them in ---&gt;
			&lt;cfset session.loggedIn = true&gt;
			&lt;cfset session.userBean = bean&gt;
			
			&lt;cfset arguments.event.addResult("goodregister")&gt;
			&lt;cfcatch&gt;
				&lt;cfset errors[1] = "This username already exists."&gt;
				&lt;cfset arguments.event.setValue("errors", errors) /&gt;
				&lt;cfset arguments.event.addResult("badregister")&gt;
			&lt;/cfcatch&gt;
		&lt;/cftry&gt;	
	&lt;cfelse&gt;
		&lt;cfset arguments.event.setValue("errors", errors) /&gt;
		&lt;cfset arguments.event.addResult("badregister")&gt;
	&lt;/cfif&gt;
&lt;/cffunction&gt;
</code>

Ok, a lot going on here, so let's cover this line by line. First off, we create an instance of the User bean. One cool thing about Model-Glue is that it has some code to handle automatically wiring event data to a bean. What does that mean in English? My register form had form fields with the same name as the "set" methods in my user bean. So for example, there was a name field and there is a setName method. By using the makeEventBean function, Model-Glue just passes in all event data to methods in the bean that maps up. That's a lot of work saved in one little function. 

Next I call my validate method. This simply checks to see if name, username, and password exist. This logic was written in my bean and can be updated later if my User model changes. One thing the bean doesn't do is check to see if my password and password confirmation match, so I do that by hand. Last but not least, I attempt to create the new user account. The userDAO CFC will throw an error if a user with the same name exists, hence the use of try/catch. 

Notice the email. As an ego-booster, I want to know whenever someone registers for the application. So I've added a new setting, adminemail, to my ModelGlue.xml file, and I send an email to that account when someone registers. Next I log the user on in the same way my authenticate method does. 

Lastly, look at how I handle the various event results. I either return a goodregister or badregister result. The ModelGlue.xml file will use that result to figure out how to route the user.

That's it for this session! As always, you can play with the live application here: <a href="http://pg1.camdenfamily.com"> http://pg1.camdenfamily.com</a>. You can also download the application by clicking the "Download" link at the end of this article.

<b>Summary:</b>
<ul>
<li>In this entry we focused on the registration logic. We modified the logon form to provide a link to a new register event.
<li>This register event was a simple form, but it handled errors nicely.
<li>Where did the errors come from? Our controller was updated to handle the registration event, and use the event model to save error information so that our view, the register page, could also pick up on it.
<li>We also added a simple configuration setting, adminemail, to the ModelGlue.xml file. This wasn't displayed, but can be seen in the zip attached to this entry.
</ul><p><a href='enclosures/D{% raw %}%3A%{% endraw %}5Cwebsites{% raw %}%5Ccamdenfamily%{% endraw %}5Csource{% raw %}%5Cmorpheus%{% endraw %}5Cblog{% raw %}%5Cenclosures%{% endraw %}2Fwwwroot4%2Ezip'>Download attached file.</a></p>