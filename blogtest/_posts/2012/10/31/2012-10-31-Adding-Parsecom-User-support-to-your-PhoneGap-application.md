---
layout: post
title: "Adding Parse.com User support to your PhoneGap application"
date: "2012-10-31T12:10:00+06:00"
categories: [html5,javascript,mobile]
tags: []
banner_image: 
permalink: /2012/10/31/Adding-Parsecom-User-support-to-your-PhoneGap-application
guid: 4771
---

A few days ago I wrapped up my <a href="http://www.raymondcamden.com/index.cfm/2012/10/24/Building-a-Parsecom-Enabled-PhoneGap-App--Part-5">series</a> on integrating <a href="http://www.parse.com">Parse.com</a> support with <a href="http://www.phonegap.com">PhoneGap</a>. Now that I've got a good handle on the basics, I thought I'd begin exploring some of the other features. Today I'm going to share an example of adding User support.
<!--more-->
Before we get into the code, let's talk a bit high level about what Parse does for User management. Even if Parse did absolutely nothing, you could still easily create "User" types and do your own authentication. But Parse actually provides support for pretty much every User-related need you can think of.

<ul>
<li>First off, Parse supports "User" as a special type of object data. Using this object type will give you a few built-in properties and other features as well.
<li>Parse has special methods for registering and logging in.
<li>Parse supports automatically encrypting passwords for you. 
<li>Parse handles email information as well, and will block users who attempt to register with an email address already used. To be clear, email addresses are <i>not</i> required for working with users, but if you do choose to use them, Parse ensures they are unique.
<li>Speaking of emails, you can also enable email verification for your users. Parse handles sending the email. Parse handles responding to the verification on the web site. Finally, Parse's API supports recognizing when a user needs verification and doesn't have it yet. 
<li>If you do use emails with your users, Parse supports a password reset workflow. They don't document what this looks like, but I took screen shots and will share them below.
<li>Lastly, Parse can also automatically cache user credentials on the client. This is done in LocalStorage and is encrypted in case someone gets access to the machine.
</ul>

That's the high level overview, so let's get into the code. For my demo, I decided to build an application that supported registering new users, logging in existing users, and storing simple "Note" objects. These Note objects should be tied to a user so that I can't read someone else's notes. I began by creating a simple home screen.

<img src="https://static.raymondcamden.com/images/ScreenClip151.png" />

Clicking on the Register button takes you to a simple form.

<img src="https://static.raymondcamden.com/images/ScreenClip152.png" />

As I mentioned above, Parse has a special User type. At minimum, it requires a username and password. Email is supported too, and has special consequences. You can also add anything else you want as well, including birthday, gender, and so on. For my demo I just went with the basics. Let's look at the code that handles the submission of this form.

<script src="https://gist.github.com/3987793.js?file=gistfile1.js"></script>

The beginning of this function is pretty boilerplate. Get the values, do some basic validation, etc. Note though the creation of the Parse.User() object. This differs from regular Parse object creation. The API to set values though is the same. 

The signUp method is what handles user creation. The first argument you can ignore (as I did in the code). Look at the result handlers though. For a successful creation, I store a copy in the global scope (that currentUser object was defined earlier) and then simply load the main application page. (You can ignore the "cylon" call there - I'll explain that in a note at the end.)

The error function will get called for all possible cases you can imagine. User already exists? You get an error. Email address already exists? You get an error. You get both an error code and a message. Oddly the message is all lowercase. In production applications I'd probably use the code and handle the messages yourself, but to keep things simple I used it as is. Here is an example.

<img src="https://static.raymondcamden.com/images/ScreenClip153.png" />

Let's switch now to the login form. Here's a screen cap. 

<img src="https://static.raymondcamden.com/images/ScreenClip154.png" />

As you can see, I've got both a login form here as well as a reset password form. Note that while Parse requires a username, the email address is optional. You can also skip asking a user for a username and just ask for their email address. You still <b>store</b> it as a username, but if you want to make the email address the username, that is very much supported as well. Let's tackle login first.

<script src="https://gist.github.com/3987855.js?file=gistfile1.js"></script>

As before, we've got a bit of simple form field grabbing and checking in the first half of the function. The logIn function is where the fun is. You pass in the authentication values and then handle the success or failure. For the most part we handle this the exact same way as registration. If we're good, store a copy of the user and then load the notes page. Otherwise, report the error. In case you're curious, the messages here are lowercase as well.

<img src="https://static.raymondcamden.com/images/ScreenClip155.png" />

So what about password reset? The code for that is equally as simple.

<script src="https://gist.github.com/3987875.js?file=gistfile1.js"></script>

As before, almost half of the code is simple DOM manipulation. The Parse API has a simple method to call and our work is done. In case you're curious, this is the email you get:


<img src="https://static.raymondcamden.com/images/ScreenClip156.png" />

"notebook" is the name I gave the application. Normally you would have something much more descriptive.

Once clicked, you end up on a pretty simple page on Parse.com.

<img src="https://static.raymondcamden.com/images/ScreenClip157.png" />

And finally, you get this when done:

<img src="https://static.raymondcamden.com/images/ScreenClip158.png" />

So just to be clear, at no point did you need to actually email your user. You didn't need to set up an email account. Nor did you need to set up a web server. I do think Parse.com should perhaps offer a bit of customization here, perhaps for paying customers. I'd imagine it would be nice to be able to include an application logo of some sort, and perhaps add a bit of verbiage to the screens.

<b>Oops!</b> I just checked, and yes, Parse.com gives you access to modify the email templates as well as the web page templates. Kick. Ass. This is paid-level access only (specifically Pro/Enterprise), but the options definitely exist. They even have a way to host the files on your own server (well, host an iframe) so users never see a Parse.com URL.

That's login, registration, and password reset. I hope you agree - it's damn simple. I mentioned earlier that Parse can cache authentication information on the client. You can write code to check for this easily enough:

<script src="https://gist.github.com/3987894.js?file=gistfile1.js"></script>

This is an optional feature though and you do not have to make use of it. As I said, it makes use of LocalStorage. I had a key named this:

Parse/av8jY0rm4qrXl3dBGLf9odznxbhuqHhiiH6s8Gxn/currentUser

with a value of:

{% raw %}{"username":"ray1","email":"raymondcamden@gmail.com","_id":"fwjEd2UStM","_sessionToken":"kkfwkr3va2hvd16t58vjl4ypq"}{% endraw %}

Ok - we've covered registration and authentication. What about data? You've got a few options here.

First off - Parse has a rich access control feature. You can provide various access levels (ACLs) on every piece of data in the system. Parse also supports Groups as well, but I'm not covering that in this entry. At a basic level, if you want to create an object that only the current user can read, it takes one line of code:

someObject.setACL(new Parse.ACL(currentUser));

While this works, you also have another option, which is to simply add a "owner" type property. So for example:

someObject.set("creator", currentUser);

Personally, I think it makes sense to use both. You're explicitly saying "Ray made this" as well as "Only Ray can read this". Together it makes getting your data to a specific user that much safer. 

To test this, I added a simple form that allowed you to write some text, the note this application was built to support.

<img src="https://static.raymondcamden.com/images/ScreenClip159.png" />

And here is the code that handles creating the object. As I said, I made use of both methods of linking the data to the user.

<script src="https://gist.github.com/3987955.js?file=gistfile1.js"></script>

Conversely, getting  my notes requires simply adding the current user as a filter. Because of the ACL, if a hacker (or script kiddie, like me), modifies the user values somehow or just does a query without the filter, the ACLs will kick in and ensure I can't read someone else's content.

<script src="https://gist.github.com/3987961.js?file=gistfile1.js"></script>

And... that's it. Before I leave you though, let me share a few tips. First, you want to read the official <a href="https://parse.com/docs/js_guide#users">docs</a> yourself. I didn't cover everything so take a look yourself. 

Secondly, Users are called out in your dashboard. You can even manually change passwords there, which was helpful during testing.

<img src="https://static.raymondcamden.com/images/ScreenClip160.png" />

Thirdly, don't forget what I said in my last series. You have options to block anonymous users from doing <i>anything</i> with your application at all. 

Lastly - Parse.com also supports Facebook and Twitter integration. That's what I'll be covering in my next entry.

Full code of my ugly, but usable, demo application is below.

<blockquote>
Ok, a quick side note. You can stop reading now if you want and won't miss a thing. When I built this application, I wanted a simple way to handle having a 'single page' frame for my application. By that I mean, when you clicked the Login button for example I wanted to do an Ajax-call for the content and load it in. In other words, once you hit index.html, you never actually leave that. <a href="http://www.jquerymobile.com">jQuery Mobile</a> is perfect for that. But... I kinda wanted to try something different. I wanted JQM-like navigation with <b>zero</b> UI changes. I whipped up something I called Cylon. Dumb name, I know. But it was kinda fun to build. I doubt if I'll open source it (well, technically, you can grab the source in the zip and use it if you want) but I wouldn't mind any feedback on the code if you want to give it a shot.
</blockquote><p><a href='enclosures/C{% raw %}%3A%{% endraw %}5Chosts{% raw %}%5C2012%{% endraw %}2Eraymondcamden{% raw %}%2Ecom%{% endraw %}5Cenclosures{% raw %}%2Fwww%{% endraw %}20{% raw %}%2D%{% endraw %}20Copy%2Ezip'>Download attached file.</a></p>