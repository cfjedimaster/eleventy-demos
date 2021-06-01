---
layout: post
title: "Building Generic Workflows in Pipedream"
date: "2021-01-03"
categories: ["javascript"]
tags: ["pipedream"]
banner_image: /images/banners/share.jpg
permalink: /2021/01/03/building-generic-workflows-in-pipedream
description: How to build generic workflows in Pipedream that are better for sharing.
---

I've been a huge fan of [Pipedream](https://pipedream.com) since I first started using it. It's ease of use, flexibility, and just overall approach to rapidly creating workflows has really resonated with me as a developer. One of the more interesting
aspects of Pipedream is that when someone shares a workflow with you, you can copy that workflow to your own account and then modify it for your own use. I was thinking of this over the holiday break and wanted to take a look at how I could build a workflow *specifically* for sharing with others, i.e. something that doesn't really do anything by itself but would be a good starting point for others. I had some fun with this project and thought I'd share what I discovered.

Let me begin by describing what I created. I began with a simple idea - fire off a process when the temperature gets too cold. So for example, "if the temperature is below 32 degrees, message me so I know to cover my plants." I was originally going to just build that as a proof of concept, but I began thinking about how to make this more generic. What if the workflow was defined more abstractly:

"When the temperature or weather (i.e., storms, rain, etc) meet some condition, then do something."

So basically we have two things we can check, the raw numeric temperature or the type of weather. Conditions would be simple. Either we are below, at, or above a target temperature (temperature below 45, or temperature above 90), or there is a match to the weather (the current conditions are rain).

To create this, I started building an event source. HERE has a [weather API](https://developer.here.com/documentation/destination-weather/dev_guide/topics/overview.html) with a free tier and Pipedream supports it natively as source:

<p>
<img data-src="https://static.raymondcamden.com/images/2021/01/pd1.png" alt="Picture of HERE Event source" class="lazyload imgborder imgcenter">
</p>

After selecting this, you then get prompted to connect it to a HERE developer account. Doing so requires a key (free!) and giving it a name. 

<p>
<img data-src="https://static.raymondcamden.com/images/2021/01/pd2.png" alt="Entering credential information" class="lazyload imgborder imgcenter">
</p>

A note about this process. One cool thing about authentication values for stuff like this is that once you've "connected" once to a service, you can reuse that authentication again. This is where using a nice name will help you out. 

After you've connected, you then need to enter some values for the event. The weather will be retrieved via zip code and will run on a schedule. The default is somewhat overkill for weather so I changed it to once an hour. This impacts how often the event source will run and "emit" the current weather for that zip.

<p>
<img data-src="https://static.raymondcamden.com/images/2021/01/pd3.png" alt="The event source now has a zip and a schedule" class="lazyload imgborder imgcenter">
</p>

Once created, you can immediately start testing. This will ensure that you defined a proper key and it lets you look at the results. Here's how it looks in the event sources UI: 

<p>
<img data-src="https://static.raymondcamden.com/images/2021/01/pd4.png" alt="View of the configured event source" class="lazyload imgborder imgcenter">
</p>

Notice the existing event on the left hand side. Clicking this lets you look at the data.

<p>
<img data-src="https://static.raymondcamden.com/images/2021/01/pd5.png" alt="An example weather result" class="lazyload imgborder imgcenter">
</p>

Alright. So now that we have a configured event source, we can create a workflow from it. The event source UI provides a button for that (see the screen shot above, the one before the event result) and if you click it, you'll be dropped into the workflow editing UI. 

I began by adding a Node.js step and named it `checkweather`. This step needs to use parameters that define what kind of check it will be doing (temperature or conditions), the type of condition (less than, greater than, or equal), and the target value. 

This is where things get interesting. In order for my code to use parameters, I can simply write code that *expects* it. What I mean is, as soon as I type: `let check = params.type`, Pipedream recognizes that my code is expecting a parameter named `type` and it adds it to the UI:

<p>
<img data-src="https://static.raymondcamden.com/images/2021/01/pd6.png" alt="Parameter detection in code" class="lazyload imgborder imgcenter">
</p>

[Params](https://docs.pipedream.com/workflows/steps/params/) in Pipedream workflows can get pretty complex. I clicked on "edit params schema" and started to work on defining my three parameters. The first one, `type`, needed to be either `temperature` or `weather`, and what's cool is that Pipedream let me define that as enum:

<p>
<img data-src="https://static.raymondcamden.com/images/2021/01/pd7.png" alt="Defining the type parameter" class="lazyload imgborder imgcenter">
</p>

Once I did that, the step changed the type input into a drop down, making it even easier to use. My second parameter followed the same format:

<p>
<img data-src="https://static.raymondcamden.com/images/2021/01/pd8.png" alt="Defining my condition type" class="lazyload imgborder imgcenter">
</p>

My last parameter, value, was just a text field. After setting things up, I then realized I could also add descriptions to my parameters to make them even more clear:

<p>
<img data-src="https://static.raymondcamden.com/images/2021/01/pd9.png" alt="Nicely documented parameters" class="lazyload imgborder imgcenter">
</p>

Overall, that entire process was really well done, and I should point out that while I did all of this with the intent of making it nicer for *others*, I can see this being super useful for my own workflows as well, or workflows that a team of developers are working on. I guess this falls into the same category as documentation - it can **always** be useful!

Once I had my parameters done, it was then time to write the code:

```js
async (event, steps, params) => {
	let check = params.type;
	let condition = params.condition;
	let value = params.value;
	console.log('check', check, 'condition', condition, 'value', value);

	if(check === 'temperature') {
		let temp = steps.trigger.event.observations.location[0].observation[0].temperature;
		//convert temp to F
		let tempF = Math.floor((temp * 9/5) + 32);
		value = parseInt(value, 10);
		if(condition === 'less than or equal' && tempF > value) $end('Temperature not low enough');  
		if(condition === 'greater than or equal' && tempF < value) $end('Temperature not high enough');  
		if(condition === 'equal' && tempF !== value) $end('Temperature not equal'); 
		// export the temp
		this.temperature = tempF;
	} else {
		// assume condition is equal as nothing else makes sense
		let weather = steps.trigger.event.observations.location[0].observation[0].skyDescription.toLowerCase();
		// lowercase value too
		value == value.toLowerCase();
		if(value !== weather) $end(`Condition ${weather} not equal to ${value}`);
		// export the weather
		this.weather = weather;
	}
}
```

What's going on here? My step falls into one of two conditions - check the temperature or weather condition. For each, I look at the result from the HERE API and execute the relevant logic. For temperature this requires three possible checks and for condtions just one. Pay special attention to how the logic works. If a condtion fails, I use a built-in Pipedream API, `$end`, to stop the workflow from continuing. 

And that's literally it. As I said, this workflow was meant to be a base for others, so it only consists of the event source and the logic step that determines if the condition is met. All I had to do now was make it public and share (note how in the UI below, you get a clear warning that you need to make it public):

<p>
<img data-src="https://static.raymondcamden.com/images/2021/01/pd10.png" alt="Share UI for a workflow" class="lazyload imgborder imgcenter">
</p>

Now comes the fun part. Here's the workflow share URL: <https://pipedream.com/@raymondcamden/weather-workflow-p_jmCvN2x>

If you take this and copy to your account, it does all the right things. I mean, I know I praise Pipedream a lot, but they did this near perfect I think. First, you'll have the event source in your account, but *not* my key. I'll have to provide my own key and specify a zip code. That means it was totally fine for me to share. And then all I have to do is build on top of it. 

I tested this with a second account. After copying the workflow and adding my key and zip, I configured it for cold weather alerts. I specified it should check the temperature, look for "less than or equal to", and specified 50 for a value. All I did was enter the values, I didn't have to touch the code.

<p>
<img data-src="https://static.raymondcamden.com/images/2021/01/pd11.png" alt="Configured step" class="lazyload imgborder imgcenter">
</p>

I then added a new step using a Pipedream built in action, "Send Yourself an Email". Remember, this step will *only* fire when the temperature is less than or equal to 50. I didn't have to write any code for this, I just supplied the subject and text value which was able to use the result of the previous step:

<p>
<img data-src="https://static.raymondcamden.com/images/2021/01/pd12.png" alt="Email configration action" class="lazyload imgborder imgcenter">
</p>

To be clear, I could have written a much more descriptive email, but this gets the point across. I could have also done things like send me a SMS message. Here's an example:

<p>
<img data-src="https://static.raymondcamden.com/images/2021/01/pd13.png" alt="Example Cold Weather alert email" class="lazyload imgborder imgcenter">
</p>

I hope this made sense, and as always, if it doesn't you can leave me a comment below. To play with the workflow I create, just click this link: <https://pipedream.com/@raymondcamden/weather-workflow-p_jmCvN2x>

<span>Photo by <a href="https://unsplash.com/@ecasap?utm_source=unsplash&amp;utm_medium=referral&amp;utm_content=creditCopyText">Elaine Casap</a> on <a href="https://unsplash.com/s/photos/share?utm_source=unsplash&amp;utm_medium=referral&amp;utm_content=creditCopyText">Unsplash</a></span>