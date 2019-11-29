---
layout: post
title: "My First Azure Function App - Twitter Image Displayer"
date: "2018-09-09"
categories: ["serverless"]
tags: ["azure"]
banner_image: /images/banners/rough_start_a.jpg
permalink: /2018/09/09/my-first-azure-function-app-twitter-image-displayer
---

So it's only taken me [two months](https://www.raymondcamden.com/2018/07/02/summer-plans-looking-at-azure-functions) or so but I've *finally* built a real(ish) application using Azure Functions as a back end. I did warn it was going to take a little while and well - yeah - I was right. I've played around a bit more with things and I finally got to the point where I felt like I could build something. Before I could build my application, there were a few more things I had to figure out.

### Adding NPM Modules

Adding NPM modules at the Azure Portal is pretty simple if you simply open the console. This is at the bottom of the screen:

![Screen Shot](https://static.raymondcamden.com/images/2018/09/az1.png)

It's a console like any other terminal and I simply typed in `npm i X` to install whatever package I needed. NPM complained about a missing package.json and I suppose I could have created that first, but it worked fine enough so I left it alone. 

My assumption is that if you use the 'zip deploy' feature of the command line (as I described in this [earlier post](https://www.raymondcamden.com/2018/08/03/testing-local-development-with-azure-functions)) then you would need to include `node_modules` in your zip or run the deployment in the command after deployed. 

I'm still figuring this out - but for now I know how to get NPM modules in and that's all that matters.

### Working with Secrets

Most serverless platforms (well, at least the ones I've worked with) have an idea of "secrets", or a way to define at the function level a value you want to keep out of your code. API keys are a great example of this. Instead of directly pasting in some particular key into your code, a secret lets you reference a variable instead. 

From what I can see, the best way to use this feature in Azure Functions is via Application Settings. Now I've mentioned this before, but one of the things Azure Functions does out of the box is group your functions into an application. The more I use this, the more I like it. It feels like a good, logical way of grouping together serverless functions. One of the aspects of that with Azure is the ability to specify different application level variables. You can get there in the UI by clicking on the root note of your application and then simply scrolling down to the list of variables. You can add or edit as you see fit. 

![Application Settings](https://static.raymondcamden.com/images/2018/09/az2a.png)

In the screen shot above, hopefully, you can make out a few variables that begin with `twitter_`, these are the custom values I made for my app. Once added, you can then reference them via `process.env.X` where "X" is the name of the setting. 

### Setting Up CORS

The final bit I had to nail down was setting up CORS. I had already create an anonymous endpoint (see details on that in my blog post [here](https://www.raymondcamden.com/2018/08/20/http-stuff-with-azure-functions-and-more)) but CORS was done via "Platform Settings":

![Platform Settings](https://static.raymondcamden.com/images/2018/09/az3.jpg)

This opens a panel where you can configure which hosts are allowed to make remote HTTP calls (via a browser anyway). In my case, I set it as `*` to make it as easy as possible.

![CORS Panel](https://static.raymondcamden.com/images/2018/09/az4.jpg)

Ok - finally - what the heck did I build?

### The Application

So a bit over two years ago, I wrote up a blog post (["Getting Images from a Twitter Account"](https://www.raymondcamden.com/2016/03/25/getting-images-from-a-twitter-account)) where I described a Node.js application that let you view the images from a Twitter account. I follow (and have [built](https://twitter.com/randomcomicbook)) Twitter accounts that post random pictures from time to time. My current favorite is [One Perfect Shot](https://twitter.com/oneperfectshot) which shares stills from movies. 

I decided to take that vanilla Node.js function and convert the logic into an Azure Function. The code was relatively simple:

```js
const Twit = require('twit');
let T = null; 

module.exports = function (context, req) {
    context.log('Twitter test processed a request.');

    T = new Twit({
		consumer_key:         process.env.twitter_consumer_key,
		consumer_secret:      process.env.twitter_consumer_secret,
		access_token:         process.env.twitter_access_token,
		access_token_secret:  process.env.twitter_access_token_secret,
		timeout_ms:           60*1000,  // optional HTTP request timeout to apply to all requests. 
	});
    
    if (req.query.account) {

        T.get('search/tweets', { q: 'from:'+req.query.account+'+filter:media', count: 100 }, function(err, data, response) {
            context.log('results '+data.statuses.length);

            let results = [];
            data.statuses.forEach((tweet) => {

				if(tweet.entities && tweet.entities.media && tweet.entities.media.length > 0) {
					tweet.entities.media.forEach(function(m) {
						results.push(m.media_url);	
					});
				}

			});

            context.res = {
                status: 200, 
                headers: { 'Content-Type':'application/json' },
                body: results
            };
            context.done();

        });

    }
    else {
        context.res = {
            status: 400,
            body: "Please pass a name on the query string or in the request body"
        };
        context.done();
    }

};
```

I use the `twit` NPM library to do my searching. I look for an `account` value in the query string to determine which Twitter account to "scrape" for images. Also note the use of `filter:media` to ask for Tweets with images in them.

Once I get my results, I loop through them and add just the image URLs. That gets stuffed into an array that I then return. 

And that's it. The entire back end. Short and sweet.

For the front end, I whipped up a quick Vue.js project using [Vuetify](https://vuetifyjs.com/) (which frankly felt like overkill). You can see the front end up on GitHub (<https://github.com/cfjedimaster/webdemos/tree/master/tweetimages>) but I'll share the app logic here:

```js
const SERVICE = 'https://rcamden-azurefunctions.azurewebsites.net/api/tweets?account=';

const app = new Vue({
	el:'#app',
	data() {
		return {
			account:'',
			images:[],
			errorState:false,
			loading:false,
			noresults:false
		}
	},
	created() {
		console.log('ok, set stuff up');
		this.account = new URLSearchParams(document.location.search).get('account');
		if(!this.account) {
			this.errorState = true;
			return;
		}
		this.loading = true;
		console.log('account is '+this.account);
		fetch(SERVICE + encodeURIComponent(this.account))
		.then(res => res.json())
		.then(res => {
			this.loading = false;
			console.log('results', res);
			if(res.length === 0) {
				this.noresults = true;
			} 
			this.images = res;
		});
	}
});
```

Basically I just run my serverless API based on a query string value and add the results to an array used by the display code. I quickly sent this online via Surge and you can see it here: <http://black-and-white-frog.surge.sh/?account=oneperfectshot>. Just change the variable at the end if you want to try another account. On the likely chance I overrun my API limits, here's a screenshot:

![Demo results](https://static.raymondcamden.com/images/2018/09/az5.jpg)

### Wrap Up

And I'm done. Well, no, not even close, there's still a heck of a lot more to Azure Functions, but I finally got to a point where I could build a simple demo and I'm pretty happy with the result. I do want to investigate the [Visual Studio Code extension](https://marketplace.visualstudio.com/items?itemName=ms-azuretools.vscode-azurefunctions) more soon as I'm hearing that may be the "preferred" way of working with Azure Functions and I'd also like to try integrating in with other Azure services as well. I do hope this was helpful and if you have any questions, just drop me a comment below!

