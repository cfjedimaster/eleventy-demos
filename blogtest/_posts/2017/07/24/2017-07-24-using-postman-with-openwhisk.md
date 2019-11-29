---
layout: post
title: "Using Postman with OpenWhisk"
date: "2017-07-24T10:33:00-07:00"
categories: [serverless]
tags: [openwhisk]
banner_image: 
permalink: /2017/07/24/using-postman-with-openwhisk
---

For a while now I've been a huge fan of [Postman](https://www.getpostman.com/). If you've never heard of it, it's an incredibly powerful tool for working with APIs. I know a lot of folks like to use Curl at the command line for doing HTTP calls, but I much prefer a visual tool instead. Plus, Postman makes it much easier to save and organize API tests for use later. It's free, supported everywhere, and I strongly recommend it. I've been using Postman lately with [OpenWhisk](http://openwhisk.apache.org/) and I thought it would be useful to share a basic explanation on how you could use them together. <strong>To be clear, there is nothing "special" about OpenWhisk and it's APIs.</strong> If you already know Postman well, then you don't have to do anything special to use it, but for folks who may be new to Postman, I thought a quick overview would be useful. Alright, ready? Let's go!

First and foremost, you want to begin by installing the Postman client.

![Postman](https://static.raymondcamden.com/images/2017/7/postman1.jpg )

Grab the bits for your operating system, install, run, and you'll be ready to go. Remember that this is an actual application. I'm on Windows but always grab the Linux bits for command line stuff since I'm using WSL (Windows Subsystem for Linux). In this case, though, I'd want the Windows client.

My focus on this post will be related around using Postman for OpenWhisk, so if you want to learn *everything* about the tool, you should check out the [docs](https://www.getpostman.com/docs/). The first thing I'd suggest though is creating a "Collection" for your tests. A collection is like a folder, and generally you should use one per project, or set of tests. For this blog entry I made a new one, "OpenWhisk+Postman".

![Another screen shot](https://static.raymondcamden.com/images/2017/7/postman2.jpg)

Alright - so let's build a quick a OpenWhisk action. This one is trivially simple, but it serves our purposes for testing.

<pre><code class="language-javascript">function main(args) {

	if(!args.name) args.name = 'Nameless';
	let result = `Hello, ${% raw %}{args.name}{% endraw %}`;

	return {
		result:result
	}

}
</code></pre>

As you can see, this will simply echo back "Hello, X" where X is a name. By default it will be "Nameless", but you can pass a parameter called <code>name</code> to change this. I stored this on OpenWhisk as the action name, <code>postmantest</code>. 

![Creating and testing the action](https://static.raymondcamden.com/images/2017/7/postman3.jpg)

Remember that there are three main ways of calling your OpenWhisk actions via HTTP:

* Via the authenticated REST API - this is what the CLI uses.
* Via a Web Action
* Via a Managed API

Let's cover these one by one.

Authenticated REST API
---

Using the [REST API](https://console.bluemix.net/docs/openwhisk/openwhisk_rest_api.html) does not require any special modifications to your actions. In order to call the API via Postman, we'll need two things - the URL (of course) and the authorization information. Luckily this is pretty easy to figure out. The URL to invoke your action will - generally - look like so:

	https://openwhisk.ng.bluemix.net/api/v1/namespaces/_/actions/postmantest

The underscore there represents the "default" package. If I had put my action in the "foo" package, you would see <code>foo/actions</code> instead. But if you forget this URL 'pattern', there is a quick way to find it. When using the CLI to work with OpenWhisk, you can always add the <code>-v</code> flag to enable verbose mode. This will share a *lot* of additional information, including the URL and authorization headers passed. Here's an example:

![URL and Auth Info](https://static.raymondcamden.com/images/2017/7/postman4.jpg )

There's a few things to notice here. First off, notice that the URL has two additional arguments, <code>blocking=true</code> and <code>result=true</code>. These are critical to ensure you actually get a result from the call and not just an activation ID. The <code>result</code> one though you may want to edit, especially if you want to keep see the metadata of your call (for example, how long it took to run). 

The next thing to note is the authorization header. The authenticated REST API is - well - authenticated. That should be obvious. You can handle that authentication in one of two ways via Postman. You can either set a header called Authorization and pass the string exactly as you see in the command line output. Or you can tell Postman to use Basic authentication and supply the username and password. <strong>This is not the username and password for Bluemix.</strong> Rather, this is information that the OpenWhisk system sets up for you automatically and that you setup with the CLI. This is how the CLI is able to use your credentials to work on your actions. In theory you could use either with Postman, but it "feels" more proper to use the username and password values instead. So how do you get them? Just run <code>wsk property get</code>:

![Auth info](https://static.raymondcamden.com/images/2017/7/postman5.jpg)

In the screen shot above, you can see where the information is displayed. The username is the ugly set of random digits <strong>before</strong> the colon and the password is everything after it. Now we have the bits be we need to add this to Postman.

You should have an empty tab available where you can add in the information required to call the API. First, copy the URL and change the method from <code>GET</code> to <code>POST</code>. Then in the "Authorization" tab, change the type to <code>Basic Auth</code>. Copy and paste the values from the CLI call above for your username and password. 

![New API](https://static.raymondcamden.com/images/2017/7/postman6.jpg)

Finally, click "Save". To be clear, you do not have to save Postman items. Postman will remember them even if you close the app, but if you plan on using the API again, it makes sense to do so. You can also give it a nice name.

![Saving the API](https://static.raymondcamden.com/images/2017/7/postman7.jpg)

Finally, use the bright blue "Send" button to run your test.

<img src="https://static.raymondcamden.com/images/2017/7/postman8.png" class="imgborder" title="Test run">

Note that Postman does a great job rendering the results along with returning all the additional headers in the result too. Notice too that the JSON was pretty printed and you have the option of switching to the raw view if you want. Finally, you can also easily save the result too.

To test passing a parameter, click on the test name in the left hand menu and use "Duplicate" to create a copy. Notice that "Authorization" is set to none, but if you switch it to "Basic Auth", it will have the values you used before. I then ran this test in the CLI:

<code>wsk action invoke postmantest -b -r --param name Rey -v</code>

Notice how the call is made this time:

![With params](https://static.raymondcamden.com/images/2017/7/postman9.jpg)

As you can see, the param value was passed in the request body. Also, a content-type header was added. Let's see how to do that in Postman.

First, I selected the "Headers" tab and entered a new key of "Content-Type" with a value of "application/json". You'll notice that in both cases, Postman has autocomplete for these values, saving you some time. 

<img src="https://static.raymondcamden.com/images/2017/7/postman10.jpg" class="imgborder" title="Setting content-type">


Next select the Body tab, then the "raw" option, and enter your JSON packet:

<img src="https://static.raymondcamden.com/images/2017/7/postman11.jpg" class="imgborder" title="Body value">

Note that Postman will give you feedback if your JSON is malformed, which is pretty darn cool. Remember to save the API and then run it, and you should see the proper response:

<pre><code class="language-javascript">{
    "result": "Hello, Rey"
}
</code></pre>

Ok, onward and upward!

Web Actions
---

To use a [web action](https://console.bluemix.net/docs/openwhisk/openwhisk_webactions.html#openwhisk_webactions), first you have to enable it via an annotation:

<code>wsk action update postmantest --web true</code>

At this point, your action is now enabled for anonymous access. The URLs for web actions follow a standard format that involves your username and space and all that, however another way to get is to simply log on to the Bluemix OpenWhisk Mangement UI, find your action, and go into "Additional Details":

![Getting the URL](https://static.raymondcamden.com/images/2017/7/postman12.jpg)

You can simply copy that URL into a new Postman action. You'll want to use GET however. Here's the new Postman API with the web action URL:

<img src="https://static.raymondcamden.com/images/2017/7/postman13.jpg" class="imgborder" title="Web Action">

Passing parameters can be done via URL or Form parameters. Both are pretty easy in Postman, but let's consider a URL example. Duplicate the API test you just made and use the "Params" button next to the URL. You can then add the parameter, "name", with a value to test.

<img src="https://static.raymondcamden.com/images/2017/7/postman14.jpg" class="imgborder" title="Web Action (2)">

Now let's level up!

API Management
---

API management and the [API gateway](https://console.bluemix.net/docs/openwhisk/openwhisk_apigateway.html#openwhisk_apigateway) is a pretty big topic. Covering it completely is out of the scope of this post. You can expose your action as a managed API either via the CLI or the UI. The CLI will nicely print out the URL, so let's do that:

<code>wsk api create /postmanapi /test GET postmantest</code>

The output will give you the URL needed to run the API (spaces added to help it wrap):

<code><span>https</span>://service.us.apiconnect.ibmcloud.com/gws/apigateway/ api/37871051d18d0b2115da90f292458913e22e5d182c8a965fadcfbf6b5fcc96c6 /postmanapi/test</code>

Much like web actions, you can then simply use this URL to get the "Nameless" response, or add a query parameter (again, spaces added for wrapping):

<code><span>https</span>://service.us.apiconnect.ibmcloud.com/gws/apigateway/ api/37871051d18d0b2115da90f292458913e22e5d182c8a965fadcfbf6b5fcc96c6 /postmanapi/test?name=tron</code>

So in theory, you could duplicate your previous Postman actions with this new URL. But let's assume you want to test an <strong>authenticated</strong> managed API. In the UI, you can use the API tool to require authentication:

<img src="https://static.raymondcamden.com/images/2017/7/postman15.jpg" class="imgborder" title="APIM">

Don't forget to click "Save", then go into "Sharing" and click "Create API Key":

<img src="https://static.raymondcamden.com/images/2017/7/postman17.jpg" class="imgborder" title="Key">

Note that you get both a key and a secret. You can select wether or not to require just the key or the key and secret. For now, I used just the key. Now let's test. We should set up 2 tests. One to call the URL without the key to confirm it is required, and one to confirm it works when passing the key. (And obviously we could test parameters as well, but I think we're safe to assume that works.)

First, I made a new API test in Postman with the URL and no authentication information:

<img src="https://static.raymondcamden.com/images/2017/7/postman18.jpg" class="imgborder" title="No API for you!">

Perfect. Now we can duplicate this API and then add the proper header. The console tells us to use the header "X-IBM-Client-ID". I simply add that to the headers value and pass in the key:

<img src="https://static.raymondcamden.com/images/2017/7/postman19.jpg" class="imgborder" title="Working API">

And there ya go!

Wrap Up
---

So I hope this was helpful, definitely leave me a comment below if it was, or if you have any other suggestions. While I barely touched on the greatness that is Postman, I want to point out one feature in particular that may be useful. [Environments](https://www.getpostman.com/docs/postman/environments_and_globals/variables) allow for the creation of variables that can be shared across a collection. When I duplicated my earlier tests, I didn't need to copy the username and password. But if they were to change, I'd have to change them in every instance. Environments let you specify these types of values and then use them in your API calls via simple tokens. It's incredibly useful for storing things like API keys.