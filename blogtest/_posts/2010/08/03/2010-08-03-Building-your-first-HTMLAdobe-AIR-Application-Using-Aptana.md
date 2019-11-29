---
layout: post
title: "Building your first HTML/Adobe AIR Application - Using Aptana"
date: "2010-08-03T14:08:00+06:00"
categories: [misc]
tags: []
banner_image: 
permalink: /2010/08/03/Building-your-first-HTMLAdobe-AIR-Application-Using-Aptana
guid: 3896
---

In my <a href="http://www.raymondcamden.com/index.cfm/2010/7/31/Building-your-first-HTMLAdobe-AIR-Application">last blog entry</a>, I covered some of the basics for getting started with HTML-based Adobe AIR applications. The intent was to give you a starting place for beginning to develop AIR applications. In today's entry I'm going to talk a bit more about Aptana and how you can use it to create HTML based AIR applications. After this I'll start getting into the demos I created for cfUnited and talking about the various features they demonstrate.
<!--more-->
To begin, head over to <a href="http://www.aptana.com/">Aptana.com</a> and download the IDE. It is 100% free. I'd recommend the Stand Alone version if you've never used the Eclipse platform before. Shoot, I'm pretty used to Eclipse and I still prefer the standalone. This will weigh in at around 95 megs so grab a cup of coffee.

After installing and running Aptana, the Welcome screen should appear. Notice the giant Plugins icon?

<img src="https://static.raymondcamden.com/images/cfjedi/Capture1.PNG" />

Click it and the very first one you will see (at least at the time of this blog entry) is the Adobe AIR 2.0 Beta. I <i>believe</i> the Beta tag is just for the plugin, not AIR 2 which is now final.

<img src="https://static.raymondcamden.com/images/cfjedi/Capture2.PNG" />

This will start the plugin installation process. For some odd reason, the UI will not actually <i>select</i> the plugin you asked it to install. In the screen shot below you can see that it isn't checked. Yeah, um, ok. So check that.

<img src="https://static.raymondcamden.com/images/cfjedi/Capture3.PNG" />

Now, for the most part, you can just hit Ok, Accept, etc, for the rest of the process, but don't screw up like  I did and not click the checkbox on the certificate page at the end. 

<img src="https://static.raymondcamden.com/images/cfjedi/Capture4.PNG" title="This is what happens when coders do UX." />

When it finishes, go ahead and let the application restart. You're now ready to create an AIR project. Go to the file menu, project, and create a new web project. The first option will be Adobe AIR.

<img src="https://static.raymondcamden.com/images/cfjedi/Capture5.PNG" />

There are a <i>lot</i> of options here, and they are all important later on, but for now, you can get by with just entering a name. Internet Law dictates that your first project must be called HelloWorld. As before, you can accept all the defaults and just let the project creation finish.

You will end up with a new project and a few default files. Your main file should be named HelloWorld.html. This is a simple HTML file. You can leave it as is or quickly add a H1 tag if you want. 

So how do you test the application? Two ways. The main way will be to run the application. Just hit the lovely, maybe not so obvious green arrow button:

<img src="https://static.raymondcamden.com/images/cfjedi/Capture6.PNG" />

You will then end up with a running AIR application! Of course, it probably doesn't display anything if you didn't edit the HTML. Even if you did, it won't do anything fancy. That's coming up later. 

Finally - let's talk packaging AIR applications. This is how you create the .air files users can download and run (if they have the runtime installed). For the most part, this too is a simple 'click and go' process. The only exception being that you need to create a certificate to go along with your AIR project. This is typically something you pay for, but AIR allows you to create self-signed certificates. They are definitely marked differently then commercial certs, but are fine for playing with AIR. 

Packing an AIR application begins by clicking the .air icon (two to the right of the green icon). The very first time you do this you will see that you have no certificates.

<img src="https://static.raymondcamden.com/images/cfjedi/Capture8.PNG" />

Click the "Configure Certificates" link to bring up:

<img src="https://static.raymondcamden.com/images/cfjedi/Capture9.PNG" />

Click Add and enter information for your self-signed cert. Here is an example:

<img src="https://static.raymondcamden.com/images/cfjedi/Capture10.PNG" />

Which finally brings you back to the package form. Select the certificate you just created and enter the password. After that - just take the defaults and you're good to go.

So... this was probably 100% obvious to most folks. But I wanted to go into more detail then what I was able to after CFUNITED. In the next entry I'll talk more about what the AIR platform <i>means</i> for HTML applications and start showing off the samples. I want to be clear - I didn't describe a <i>heck</i> of a lot. Aptana has other features for AIR development as well. But hopefully at this point you know enough to make your own project and start slinging code!

One final PS. In that nice little plugin icon at the Welcome Screen, you can also add Ajax support. I'd strongly recommend doing that to add jQuery support. You don't need to. You can copy jQuery into any project. However doing this within Aptana means you can create a new project that has jQuery installed already.