---
layout: post
title: "Creating Both HTML and API with Pipedream"
date: "2020-04-14"
categories: ["serverless"]
tags: ["javascript","pipedream"]
banner_image: /images/banners/pipes.jpg
permalink: /2020/04/14/creating-both-html-and-api-with-pipedream
description: Serving both HTML and data with a Pipedream workflow
---

First off, I apologize up front about the title. You don't "Create API", you create "an API". No one cares probably but it's bugging me and I can't think of a better alternative. Hopefully I will before I finish the post. (Spoiler, he didn't.) Yesterday I was hanging out in the <a href="https://pipedream.com/community">Pipedream Slack</a> when I asked the team how a person would support running both an API  on Pipedream as well as the HTML in front of it. 

So imagine you've built an incredibly complex API to do, well, who cares. To do something. Doesn't matter but here's my workflow as an API: <https://enk542004vp3drh.m.pipedream.net/?name=ray> Change the `name` value and your response changes.

Now imagine you want to host an HTML application that makes use of this API. You've got a few options. What follows is a mix of suggestions from Dylan Sather of Pipedream and my own demo code and such. 

1) Use a "real" hosting provider. Pipedream can absolutely host HTML (see the next suggestion), but if you are building a "site", you really want to use a service optimized for that, like Netlify and Zeit. Your endpoints have CORS enabled automatically so you can easily hit it from there. I wrote up a quick Vue.js application to demo this:

```html
<html>
<head></head>

<body>

<div id="app">
<p>
<input v-model="name"> <button @click="sendToAPI">Process</button>
</p>

<p>
Result: {{ result }}
</p>
</div>

<script src="https://cdn.jsdelivr.net/npm/vue/dist/vue.js"></script>
<script>
const app = new Vue({
	el:'#app',
	data: {
		name:'',
		result:''
	},
	methods: {
		async sendToAPI() {
			let resp = await fetch(`https://enk542004vp3drh.m.pipedream.net/?name=${this.name}`);
			let data = await resp.json();
			this.result = data.response;
		}
	}

});

</script>
</body>
</html>
```

All this does is call the Pipedream hosted API with input and render it. I then deployed it to Zeit: <https://temp-pearl.now.sh/temp.html>. 

That works just fine. 

2) Host the HTML with Pipedream. Pipedream workflows can return HTML, even dynamic HTML. Consider this [workflow](https://pipedream.com/@dylburger/respond-with-html-p_V9C2Kp/edit):

```js
async (event, steps) => {
	// Print "Hi there" in the absence of a name
	const { name } = event.query || "there"

	// See https://docs.pipedream.com/workflows/steps/triggers/#http-responses
	$respond({
		status: 200,
		headers: {
			"Content-Type": "text/html; charset=UTF-8"
		},
		body: `<html><h1>Hi, ${name}</html>`,
	}) 
}
```

As you can see, it inspects the query string to look for a value. It then returns HTML in a template string to return dynamic HTML. (If you're old enough to remember DHTML, it's time for AARP. ;) So we could build a workflow to spit out the HTML I used above:

```js
async (event, steps) => {
	let html = `
	<html>
	<head></head>
	EVERYTHING FROM ABOVE WAS HERE
	</body>
	</html>
	`;
	$respond({
	status: 200,
	headers: {
		"Content-Type": "text/html; charset=UTF-8"
	},
	body: html,
	}) 

}
```

To keep the code listing a bit short I didn't copy the entire string, but you get the idea. Do remember though that if your JavaScript template string itself contains template strings, you need to escape it. I totally knew that. Honest. I deployed this and you can see it here: <https://enxfb1rcr2bvdsk.m.pipedream.net/> 

This works, but honestly feels a bit wasteful. 

3) Support both HTML and data in one workflow. A final option to consider is having one workflow support both the HTML as well as the data itself. Your workflow code has access to the entire HTTP request. You've already seen me use the query string, but you can also check the path (/foo) as well as any request headers and form data. So in theory you could do something like, "if the request content type is for html, return it, if it's for json, return data". 

This [workflow](https://pipedream.com/@dylburger/generate-an-rss-feed-from-http-post-requests-retrieve-via-get-request-p_n1CrQG/edit) shows an example where if a request is POST, data is added, and if it's GET, HTML is returned. We can build our own version that has these steps:

* Start with an HTML trigger to give us a URL
* If method is GET, return the HTML string.
* If method is POST, assume it's an API call.
  
I built a [workflow](https://pipedream.com/@raymondcamden/html-api-demo-p_RRCdjB/edit) that does this. It has 3 steps, with the first one just being the HTTP trigger. The second step handles GET:

```js
async (event, steps) => {
	if(event.method === 'GET') {
		let html = `
		DELETED STUFF....

				async sendToAPI() {
					let resp = await fetch("${event.url}", {
						method:"post",
						body: JSON.stringify({name:this.name})
					});
					let data = await resp.json();
					this.result = data.response;
				}
			}

		});

		`;
		$respond({
			status: 200,
			headers: {
			"Content-Type": "text/html; charset=UTF-8"
			},
			body: html,
		});
		$end();   
	}
}
```

I'm not a big fan of "surround the entire body with an IF thing" but it gets the job done. Also note that in my HTML (which I trimmed a bit), I switch my URL to `${event.url}` so I can dynamically pick up the current workflow URL.

The next step handles the POST:

```js
async (event, steps) => {
	if(event.method === 'POST') {
		let name = 'Nameless';
		if(event.body.name) name = event.body.name;
		$respond({
			headers: {
				"Content-Type":"application/json"
			},
			body: {"response":`Hello ${name}`}
		});
	}
}
```

It's virtually equal to my initial logic (which I don't ever shared) except it now looks for POST data instead of a query string value. I encourage you to check out the [workflow](https://pipedream.com/@raymondcamden/html-api-demo-p_RRCdjB/edit) for the complete code. You can run the demo here: <https://enek3dg6pwsn2od.m.pipedream.net/>

### My Recommendation

Ok, so this was mostly me just playing around with Pipedream and seeing what I *could* do. Honestly while you can serve HTML with Pipedream, I'd more often than not use a "proper" HTML serving platform like Zeit or Netlify. It's cool that Pipedream is flexible enough to handle this though!