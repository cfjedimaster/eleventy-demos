---
layout: post
title: "Designing an OpenWhisk Action for Web Action Support"
date: "2017-03-02T09:37:00-07:00"
categories: [serverless]
tags: [openwhisk]
banner_image: 
permalink: /2017/03/02/designing-an-openwhisk-action-for-web-action-support
---

<strong>Please note that there is an update to this blog post. Read it here: <a href="https://www.raymondcamden.com/2017/07/03/designing-an-openwhisk-action-for-web-action-support-take-two/">https://www.raymondcamden.com/2017/07/03/designing-an-openwhisk-action-for-web-action-support-take-two/</a>.</strong>


Before I begin - a few words of caution. The feature I'm discussing today is - for the most part - bleeding edge for OpenWhisk. It is *really* new and most likely will change between now and when it is "formally" part of the platform. Secondly, what I built may not actually be the best idea either. Regular readers know that I'll often share code that is fun, but not exactly practical, so this isn't anything new per se, but I want to point out that what I demonstrate here may not be a good idea. I'm still *extremely* new to Serverless in general, so read with caution!

Alright, so first off, a quick reminder. "Web Actions" are a new feature of [OpenWhisk](https://developer.ibm.com/openwhisk/) that allow you to return non-JSON responses from OpenWhisk actions. There are [docs](https://github.com/openwhisk/openwhisk/blob/master/docs/webactions.md) you can, and should, read to understand the basics as well as examples (here is [my post](https://www.raymondcamden.com/2017/02/15/building-a-form-handler-service-in-openwhisk-part-two/) which links to even more examples) of it in use. 

One thing kinda bothered me though. It wasn't very clear how I could take a simple action and make it support web action results as well as "normal" serverless requests. Most of the demos assume you are only using it as a web action, but I wanted to see if I could support both. Here is what I came up with.

I began by writing my action. In this case, the action generates a random cat. It creates random names, gender, ages, and more. 

<pre><code class="language-javascript">
function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
 
function randomName() {
    var initialParts = [&quot;Fluffy&quot;,&quot;Scruffy&quot;,&quot;King&quot;,&quot;Queen&quot;,&quot;Emperor&quot;,&quot;Lord&quot;,&quot;Hairy&quot;,&quot;Smelly&quot;,&quot;Most Exalted Knight&quot;,&quot;Crazy&quot;,&quot;Silly&quot;,&quot;Dumb&quot;,&quot;Brave&quot;,&quot;Sir&quot;,&quot;Fatty&quot;];
    var lastParts = [&quot;Sam&quot;,&quot;Smoe&quot;,&quot;Elvira&quot;,&quot;Jacob&quot;,&quot;Lynn&quot;,&quot;Fufflepants the III&quot;,&quot;Squarehead&quot;,&quot;Redshirt&quot;,&quot;Titan&quot;,&quot;Kitten Zombie&quot;,&quot;Dumpster Fire&quot;,&quot;Butterfly Wings&quot;,&quot;Unicorn Rider&quot;];
    return initialParts[getRandomInt(0, initialParts.length-1)] + ' ' + lastParts[getRandomInt(0, lastParts.length-1)]
};
 
function randomColor() {
    var colors = [&quot;Red&quot;,&quot;Blue&quot;,&quot;Green&quot;,&quot;Yellow&quot;,&quot;Rainbow&quot;,&quot;White&quot;,&quot;Black&quot;,&quot;Invisible&quot;];
    return colors[getRandomInt(0, colors.length-1)];
}
 
function randomGender() {
    var genders = [&quot;Male&quot;,&quot;Female&quot;];
    return genders[getRandomInt(0, genders.length-1)];
}
 
function randomAge() {
    return getRandomInt(1, 15);
}
 
function randomBreed() {
    var breeds = [&quot;American Shorthair&quot;,&quot;Abyssinian&quot;,&quot;American Curl&quot;,&quot;American Wirehair&quot;,&quot;Bengal&quot;,&quot;Chartreux&quot;,&quot;Devon Rex&quot;,&quot;Maine Coon&quot;,&quot;Manx&quot;,&quot;Persian&quot;,&quot;Siamese&quot;];
    return breeds[getRandomInt(0, breeds.length-1)];
}

function randomPic() {
    var w = getRandomInt(100,400);
    var h = getRandomInt(100,400);
    return `http://placekitten.com/${% raw %}{w}{% endraw %}/${% raw %}{h}{% endraw %}`;
}

function main(args) {
   return {
        cat:{
            name:randomName(),
            color:randomColor(),
            gender:randomGender(),
            age:randomAge(),
            breed:randomBreed(),
            picture:randomPic()
        }
    };
}
</code></pre>

I assume this is all pretty trivial, but as always, let me know in the comments if it doesn't make sense. So I took this, pushed it up to OpenWhisk, and confirmed it work as a 'regular' simple action.

![Demo](https://static.raymondcamden.com/images/2017/3/caas1.png)

With that done, I then began thinking about how I'd support web actions. First I enabled it by updating the action: `wsk action update caas cat.js --annotation web-export true`. 

I thought I'd first start with - how do I tell a "regular" call versus a "Web Action" call. According to the docs, a "Web Action" call will send along additional arguments representing the HTTP request. These exist in args with the prefix __ow. So with that, I wrote this function as a shorthand to detect the request:

<pre><code class="language-javascript">
function isWebInvocation(request) {
	if(request.__ow_meta_verb) return true;
	return false;
}
</code></pre>

This feels a bit risky, but if a better way comes around, I can fix it up later. 

The next bit was figuring out exactly how I'd support web actions. I decided on 3 different ways.

* If an HTML request is made, I'd return an HTML string representing the cat.
* If a JPG request is made, I'd return just the image.
* If a JSON response is requested, I'd return the JSON string.

You can determine all of this by looking at the headers sent with the request. Web Actions pass this as `__ow_meta_headers` and the `accept` header would tell me what kind of response was desired. I wrote this as a shorthand way of parsing it:

<pre><code class="language-javascript">
function getRequestType(request) {
	//basically sniff the Accept header
	let header = request.__ow_meta_headers.accept;
	console.log('header', header);
	//try to normalize a bit, just caring about a few
	if(header.indexOf('text/html') &gt;= 0) return 'html';
	if(header.indexOf('image/jpeg') &gt;= 0) return 'image';
	if(header.indexOf('application/json') &gt;= 0) return 'json';
}
</code></pre>

Notice I have no result for an unknown request - I should fix that. So the final part was to just support all this. Here is my modified main function.

<pre><code class="language-javascript">
function main(args) {
	console.log('cats args: '+JSON.stringify(args));

	let cat = {
		name:randomName(),
		color:randomColor(),
		gender:randomGender(),
		age:randomAge(),
		breed:randomBreed(),
		picture:randomPic()
	};

	if(!isWebInvocation(args)) {
		return {% raw %}{ cat: cat}{% endraw %};
	}

	console.log('not a regular invoke');
	let type = getRequestType(args);
	console.log('type is '+type);

	switch(type) {

		case 'html': 
			return {html:`
				&lt;h1&gt;${% raw %}{cat.name}{% endraw %}&lt;/h1&gt;
				My cat, ${% raw %}{cat.name}{% endraw %}, is ${% raw %}{cat.gender}{% endraw %} and ${% raw %}{cat.age}{% endraw %} years old.&lt;br/&gt;
				It is a ${% raw %}{cat.breed}{% endraw %} and has a ${% raw %}{cat.color}{% endraw %} color.&lt;br/&gt;
				&lt;img src=&quot;${% raw %}{cat.picture}{% endraw %}&quot;&gt;
				`
			};
			break;


		case 'image':
			return {
				headers:{% raw %}{location:cat.picture}{% endraw %},
				code:302
			};
			break;

		case 'json':
			return cat;
			break;
	
	}

}
</code></pre>

So how do I test? First I figured out my URL (I added a space to make it wrap nicer):

`https://openwhisk.ng.bluemix.net/api/v1/experimental/web/ rcamden@us.ibm.com_My%20Space/default/caas`

And then I tested the HTML version:

`https://openwhisk.ng.bluemix.net/api/v1/experimental/web/ rcamden@us.ibm.com_My%20Space/default/caas.html`

which worked fine:

<img src="https://static.raymondcamden.com/images/2017/3/caas2.png" class="imgborder">

To test the JSON and JPG versions, I used [Postman](https://www.getpostman.com/), which is a *damn* handy tool for testing various API calls. Yes, I could have done everything in Curl, but honestly, my memory for CLI args is somewhat flakey, and I love the UI and ease of use of Postman in general. To support an image response, I use this URL:

`https://openwhisk.ng.bluemix.net/api/v1/experimental/web/ rcamden@us.ibm.com_My%20Space/default/caas.http`

and here it is running in Postman:

<img src="https://static.raymondcamden.com/images/2017/3/caas3.png" class="imgborder">

And the JSON works well too - it uses the same URL, just a different Accept header. 

So - as I said at the beginning - I'm not entirely sure this is a good idea, but I dig how my one action can have multiple views of the same data. Any thoughts on this approach?