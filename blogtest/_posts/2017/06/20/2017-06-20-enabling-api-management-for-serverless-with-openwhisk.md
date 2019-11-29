---
layout: post
title: "Enabling API Management for Serverless with OpenWhisk"
date: "2017-06-20T11:54:00-07:00"
categories: [serverless]
tags: [openwhisk]
banner_image: 
permalink: /2017/06/20/enabling-api-management-for-serverless-with-openwhisk
---

I've shared more than a few examples of OpenWhisk APIs that I've shared with API management but I haven't actually detailed what that process is like. Today I'm going to review what exactly it is, how you enable it, and how you make use of it. As with most things I say here about OpenWhisk, remember that this is still fairly new and some of the details will probably change in the future. 

What is API Management?
===

Let's start with the definition first, and as always, I'm going with *my* definition, not necessarily the marketing verbiage. To me, API Management involves everything "on top of" just exposing your code via a HTTP interface. This involves things like:

* Robust statistics involving everything from how often your API is run to what arguments are passed to what status it returned. I'd also add memory usage, throughput, and pretty much every single aspect of every single invocation of the API. I want to be able to see how well my API is performing over time and judge where I need to spend time optimizing, or perhaps what new features I need to add. For example, if I see people using a cat API to search for female cats of a certain breed, I may want to add simpler ways to get that data. 

* Security and usage settings that let me lock down my APIs to require a key, or other login, and set usage limits. This ties back to the stats area as well as I'd like to be able to see who my biggest consumers are and how they make use of my API.

* While the first two points are the main things I care about, I'd also add support for, in some way, documentation. That could be automatic documentation and testing tools like what LoopBack provides. In the best of worlds, my API management generates docs or publishes docs I've already written, but always allow me to customize and add to what is provided out of the box.

So obviously IBM has some experience with this - and you can see this in full effect with [IBM API Connect](http://www-03.ibm.com/software/products/en/api-connect). While you can definitely make use of API Connect with OpenWhisk, there's a new built-in option to for folks using OpenWhisk under Bluemix called "Bluemix Native API Management." To keep it simple, I'll refer to this as BNAME.

API Management and OpenWhisk
===

OpenWhisk can expose your code in one of three ways:

* Via a secured REST API - this is automatic and is what the CLI uses to work with your actions.
* Via [Web Actions](https://console.bluemix.net/docs/openwhisk/openwhisk_webactions.html#openwhisk_webactions). This allows for anonymous access only and doesn't provide any built in tracking. Although you can [write your own](https://www.raymondcamden.com/2017/04/17/openwhisk-serverless-and-security-a-poc/) security layer and get analytics by looking at your activation history and using the [monitor UI](https://www.raymondcamden.com/2017/06/16/monitoring-openwhisk-activity/).
* And finally, via the [API Gateway](https://console.bluemix.net/docs/openwhisk/openwhisk_apigateway.html#openwhisk_apigateway). 

The gateway feature is how we can manage our OpenWhisk APIs and do some of the stuff I described above. You can work with the gateway via the CLI or the UI and in the rest of the post I'm going to walk you through the process of doing that.

Our Action
===

Before we go any further, let's build a simple action we can then manage with the API gateway. This action simply does pig latin:

<pre><code class="language-javascript"> &#x2F;&#x2F; source: https:&#x2F;&#x2F;github.com&#x2F;montanaflynn&#x2F;piglatin
 function piglatin(text) {
  var words = text.split(&#x2F;\W+&#x2F;)
  var piggish = &quot;&quot;
  for (var i = 0; i &lt; words.length; i++) {
    var word = words[i]
    var firstLetter = word.charAt(0)
    if (word.length &gt; 2) {
      piggish = piggish + word.substring(1) + firstLetter + &quot;ay &quot;
    } else {
      piggish = piggish + word + &quot; &quot;
    }
  }
  return piggish.toLowerCase().trim();
}

function main(args) {
  
  if(!args.input) return {% raw %}{ error:&#x27;Input argument required.&#x27;}{% endraw %};

	let result = piglatin(args.input);
	return {% raw %}{ result:result}{% endraw %};

}
</code></pre>

Its got a tiny bit of error handling but mainly just wraps a `piglatin` function. I pushed this to OpenWhisk as the `pig` action and tested it from the CLI to ensure it worked:

![Screen shot](https://static.raymondcamden.com/images/2017/6/bname1.jpg)

Woot. Nice and simple and totally a real world example. Totally.

API Management via the CLI
===

Let's start by showing how to enable API management via the CLI. The CLI lets you create new managed APIs, but doesn't let you specify the security settings that you can via the UI. Before you create a managed API, you must first enable "Web Action" support. I wish the "Make an API" CLI call would do this for you automatically but for today, you have to do it first:

	wsk action update pig --web true

To create the managed API, the CLI uses this form:

	wsk api create BASE_PATH API_PATH VERB ACTION

Alright, let's break this down.

* BASE_PATH is like a group for your API. Imagine you have a few APIs related to cats: get, delete, create, search. I'd want all four of them to be grouped under a BASE_PATH of cats. That means my APIs will end up looking like this: (stuff)/cats/get, (stuff)/cats/delete, and so on. Also, this "group" is where you will apply security and rate limiting. All four will be rate limited/locked down or not - you can't set unique values for each end point. For all intents and purposes, our API is "cats" and those individual end points are simply parts of the great API.
* API_PATH is just the end point, as described above. So "get", "delete", etc.
* The VERB will be one of the "regular" verbs used with REST APIs: get, put, post, etc. You "should" follow convention here and use GET for read actions, post or put for create/update, but the REST Police will not be stopping by your cubicle to slap you on the hand if you don't follow the norm.
* Finally, the ACTION is just the action you want to expose.

The CLI supports more options of course, just run `wsk api -h` for details. Alright, so let's expose the pig latin API:

![Screen shot](https://static.raymondcamden.com/images/2017/6/bname2.jpg)

If that's a bit hard to read, here is the command I ran:

	wsk api create /translate /pig get pig	

And here is the result in text:

	ok: created API /translate/pig GET for action /_/pig
	https://service.us.apiconnect.ibmcloud.com/gws/apigateway/api/37871051d18d0b2115da90f292458913e22e5d182c8a965fadcfbf6b5fcc96c6/translate/pig

And yep - you can hit that URL right now: 

https://service.us.apiconnect.ibmcloud.com/gws/apigateway/api/37871051d18d0b2115da90f292458913e22e5d182c8a965fadcfbf6b5fcc96c6/translate/pig?input=Hello+World

And woot - that's it. The CLI does more - like getting details and deleting, but the other command you'll probably use is `wsk api list`:

![Screen shot](https://static.raymondcamden.com/images/2017/6/bname3.jpg)

API Management via the UI
===

Now let's turn our attention to the UI. After logging into Bluemix, going to your OpenWhisk portal, you can then select APIs to see what you have being managed by the system.

![Screen shot](https://static.raymondcamden.com/images/2017/6/bname4.jpg)

Notice how the API I created via the CLI doesn't have a nice name. You can actually fix that by using the `-n` flag when creating the API. You can also fix this in the UI by editing the API. Instead of doing that, though, I'm simply going to create a new one so you can see what that process is like. I'll begin by clicking that nice, obvious "Create Managed API" button.

![Screen shot](https://static.raymondcamden.com/images/2017/6/bname5.jpg)

There's more to the screen than what you see here, but that revolves around security and rate limiting. I'm going to come back to that after the initial setup. I named the API "Translate2" and set a base path of `/translate2`. (I wouldn't normally do that, but I want to separate this test from the earlier one.) Next, you define the various parts of the API. What you include here is up to your application. The earlier "Cats" demo I described had a few actions, but for now we're just wrapping the pig latin action. Select "Create Operation" to select it:

<img src="https://static.raymondcamden.com/images/2017/6/bname6.jpg" class="imgborder" title="Screen shot">

A note on that "Action" drop down. This will only show 30 of your actions sorted by the last time they were updated. I've filed a bug report for this already. If you do not see your action, just update it via the CLI and it will "bump up" to the top of the list. Another bug to watch out for - if you are editing an operation for an API created by the CLI, the selected action will *not* default to the one you chose!

Click save on that dialog and it will show up in the Operations list:

<img src="https://static.raymondcamden.com/images/2017/6/bname7.jpg" class="imgborder" title="Screen shot">

Note! You are not done yet. Scroll to the bottom of the page (again, I'm ignoring the security/rate limiting thing for now) and click "Save &amp; Expose" to finish.

![Screen shot](https://static.raymondcamden.com/images/2017/6/bname8.jpg)

I never forgot to click Save. Really. When you do, look to the upper right hand corner of the screen. You will see a modal like so:

![Screen shot](https://static.raymondcamden.com/images/2017/6/bname9.jpg)

<b>It is absolutely crucial you pay attention here - because the modal auto dismisses. If there is an error, it will show up - and then disappear.</b> I've filed a bug report on that as well. I tend to be scatterbrained and on more than one occasion I missed something because I didn't expect an important message to just disappear. 

Alright - after doing this, you're brought to the API summary:

![Screen shot](https://static.raymondcamden.com/images/2017/6/bname10.jpg)

A few things to note here. First, the Route URL is the "root" of your API. Clicking it will give you an error, but that's to be expected because it doesn't include the specific API end point. Ignore that next row and look at logging. Obviously I have no calls now. I manually ran some tests just to fill it with data:

![Screen shot](https://static.raymondcamden.com/images/2017/6/bname11.jpg)

Each response can be clicked on for a detail view:

<img src="https://static.raymondcamden.com/images/2017/6/bname12.jpg" class="imgborder" title="Screen shot">

Right now though it doesn't look like it actually adds any more detail. Turns out there's a reason for that. Additional data is logged if your API requests include a header, `X-Debug-Mode`, with the value true. I know this because my mouse went over the little information icon:

![Screen shot](https://static.raymondcamden.com/images/2017/6/bname13.jpg)

I filed a bug report to make this a bit more obvious. If you can't tell, I tend to miss the obvious most of the time. 

Finally, note that there are no date controls for any of the logging. This is the biggest missing piece in the manager for now. There's no way for me to get a deeper look of my history or to even see if my client's complaints about performance issues yesterday were actually valid. 

That being said, it is a good start and I'm hoping to see some improvements here soon.

Alright, let's lock this puppy down!

API Management and Security
===

To start locking down the API, go into "Definition" and scroll down to "Security and Rate Limiting":

![Screen shot](https://static.raymondcamden.com/images/2017/6/bname14.jpg)

The first thing you'll do is simply require authentication. That's one toggle - just turn it on. As soon as you do, you'll have a few options. 

For method, you can select between requiring just a key or a key and secret.

For location, you can only select header. (I guess the plan here is to allow it over the query string in the future.)

Finally, you can tweak the name of the header if you want. 

Rate limiting is also a simple toggle, and you can then specify how many calls are allowed either per second, minute, hour or day. *Be sure you read the documentation though.* Rate limiting is done via the "leaky bucket" method. I'll copy the text here to make it obvious:

<blockquote>
For example, if you set your limit as 10 calls per minute, users will be restricted to 1 call every 6 seconds (60/10 = 6).
</blockquote>

Next, you can integrate social OAuth login for the API, with either Google, Facebook, or GitHub, but I've yet to test this. I'm assuming you pass a bearer token with the API call.... but I'm not sure. I wasn't able to find docs for this and I plan on playing with it next week.

Finally, note you can enable/disable CORS. It's on by default. 

After you've set everything, be sure to click Save. Again - don't forget this. Here's how I configured my API:

![Screen shot](https://static.raymondcamden.com/images/2017/6/bname15.jpg)

Now if you try to run the API, you'll get a 401 error, which is what you want. To start sharing this, go into the "Sharing" menu.

![Screen shot](https://static.raymondcamden.com/images/2017/6/bname16.jpg)

The first option is specific for working with people on Bluemix, so focus on the second one. In order for someone to use your API, you must create a key for them. Unfortunately, this isn't automated yet so you can't create your own forms and such to allow for this. You have to log in and make a key for each client. However, the process is pretty simple. Click the Create option and then give your key a name:

<img src="https://static.raymondcamden.com/images/2017/6/bname17.jpg" class="imgborder" title="Screenshot">

Now here comes the truly coolest part. After the key is created, your client (or user, whatever) is given an individual, unique, portal link. Here is the one I just created (and note, this may not be "live" at the time you read this post):

https://service.us.apiconnect.ibmcloud.com/fusion/devportal/portal?artifactId=f340ad8f-a21b-4846-8384-25cd7b49e2c6&clientId=c8b256e6-df4d-44eb-902c-ebc103662f24

What you have here is a fully interactive API tester called the Explorer.:

![Screen shot](https://static.raymondcamden.com/images/2017/6/bname18.jpg)

My API only has one method, but in a proper API, this tool would be awesome as it would give me a one stop place to see everything supported. On the right hand side you can see a sample curl command I can use to test. You can even try the operation in the UI itself, but unfortunately, there is no UI to supply the required argument. OpenWhisk does support defining, at a meta level, what parameters your action needs (see the [docs](https://console.bluemix.net/docs/openwhisk/openwhisk_annotations.html#annotations-on-openwhisk-assets) for an example), but this doesn't seem to pass over to the API Explorer. 

Wrap Up
===

Whew, that was a lot, and I hope it was helpful. As I think you can see, this is pretty powerful, and while the UI has some room for improvement, I think it's pretty cool what you get out of the box. If anyone is using this yet in production, I'd love to hear what you think (and would gladly pass back any suggestions). Let me know in the comments below!