---
layout: post
title: "Testing Netlify's Proxy Support for API Hiding"
date: "2020-06-10"
categories: ["serverless","static sites"]
tags: []
banner_image: /images/banners/shadow.jpg
permalink: /2020/06/10/testing-netlifys-proxy-support-for-api-hiding
description: An example of using Netlify redirect rules to hide a URL
---

For my blog post today I want to play with another Netlify feature, [creating a proxy](https://docs.netlify.com/routing/redirects/rewrites-proxies/#proxy-to-another-service) to another service. This is one of those simple things that just plain works. The docs are clear and to the point. That being said, I really wanted to see this for myself in action. 

In a nutshell, Netlify lets you define a URL route for your site that will map to an external site. So for example, I can say a request for `/cat` will map to `htts://thecatapi.com`. That by itself isn't necessarily rocket science, but if you tell Netlify to use a 200 status code on the redirect, the network connection will be done entirely on Netlify's side and the end user never sees the redirect. 

This means a lot of things. If you were using serverless functions just to hide an API key, you don't need to anymore. If you were using serverless functions to create an abstraction (in case you move from remote service A to remote service B), you may not need to do that anymore. While certainly not applicable to every case, it does mean that for simple key hiding and the such you don't have to write a lick of code. 

As I said, this was documented well but I wanted to see it for myself. For my test, I decided to create a proxy to HERE's (my employer!) [Geocoding and Search API](https://developer.here.com/products/geocoding-and-search). Now before I go any further, note that the keys you create for our services *absolutely 100%* allow you to use them in client-side applications and you can (**should**) use the host name restriction feature to ensure they can only be used in one place. My demo was simple - on load, make a request for places near a hard coded location within a hard coded category (food places). I live in Louisiana so I knew this would return upwards of three to four million results or so. 

Here's how it looks in client-side code:

```js
const app = new Vue({
	el:'#app',
	data: {
		results:null
	},
	async created() {
		let result = await fetch('/geosearch?at=30.22,-92.02&cat=101-070');
		let data = await result.json();
		this.results = data.items;
	}
});
```

Note that the hard coded values for `at` and `cat` could absolutely be dynamic. I was testing Netlify here, not our API. When run in the browser, you see this in network tools:

<p>
<img data-src="https://static.raymondcamden.com/images/2020/06/nr1.png" alt="Network request" class="lazyload imgborder imgcenter">
</p>

If you dig into the headers and such nothing there will reveal what the destination is either. To make this work, I added a file, `_redirects`, which this:

```
/geosearch/* at=:at cat=:cat https://browse.search.hereapi.com/v1/browse?apiKey=H2HPEplnWZvYwdCxIeyaFJf_RhOLUMzQXip2ADBNupY&at=:at&categories=:cat 200
```

As I said, the docs were good, but it did take me a minute or two to wrap my head around how query string parameters work. You do *not* include them in the route itself, but they after in a space delimited format. Order does not matter. I then map everything to the destination URL. Finally, I add the status code. Technically you don't need it if you aren't concerned with folks seeing the destination path. Why would you bother then? Because this will **also** fix cases where CORS isn't setup. I've often used the [iTunes Search API](https://affiliate.itunes.apple.com/resources/documentation/itunes-store-web-service-search-api/) in demos but stopped because *some* of the machines in their cluster don't support CORS. This would correct it.

So why *wouldn't* you use this versus a serverless function? If I use a serverless function I have more control over the data that's returned. An API might return 10-20 values where my code only needs 2-3. I can return a smaller subset and reduce the network traffic. I can also transform values if the API is, well, weird. Maybe it returns XML because it thinks we're still in the 90s. You get the idea. In these cases, a serverless function lets me massage the data before my front end works with it. Best of all, if I switch providers, I can take their data and reformat it to match the last provider. Of course, you could use the simple redirect feature for now and switch to serverless later using the same path!

If you want to see my simple demo in action, go to <https://netlifydemos.netlify.app/test_proxy.html> and you can see the complete source over at <https://github.com/cfjedimaster/NetlifyTestingZone>.

Oh, a quick note. Obviously a public GitHub repo is going to contain your `_redirects` file. In that case you would need to use a private repository instead. You could also deploy from the CLI, but than you use the CI/CD setup that Netlify shines at. If you really want a public GitHub repo than you'll need to use a serverless function and environment variable instead. (Not much work at all!)

<i>Header photo by <a href="https://unsplash.com/@martino_pietropoli?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Martino Pietropoli</a> on Unsplash</i>