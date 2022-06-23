---
layout: post
title: "Turning a Microsoft ToDo List Into a Public JSON Feed with Pipedream"
date: "2022-02-09T18:00:00"
categories: ["serverless"]
tags: ["pipedream"]
banner_image: /images/banners/queue.jpg
permalink: /2022/02/09/turning-a-microsoft-todo-list-into-a-public-json-feed-with-pipedream.html
description: Making a public JSON feed of a ToDo List using Pipedream workflows.
---

A few months ago I wrote up a [blog article](https://www.raymondcamden.com/2021/11/13/congratulating-yourself-with-pipedream-and-microsoft-to-do) on how to use Microsoft's Graph API to check your [tasks](https://todo.microsoft.com/tasks/) and congratulate for completing items over the previous week. I'm a *huge* fan of Microsoft To Do and while I use it for tasks lists, my biggest use case now is a "blog idea" list.

<p>
<img data-src="https://static.raymondcamden.com/images/2022/02/todo1.jpg" alt="Screenshot of MS ToDo app with my blog ideas" class="lazyload imgborder imgcenter">
</p>

I've got a horrible memory so whenever a random idea pops in my head, I try to immediately write it down. (Literally during my writing of this blog entry I had an idea for another blog entry and it turns out I [already wrote it](https://www.raymondcamden.com/2021/09/24/creating-a-manual-related-posts-feature-in-eleventy).) I also try to add a few notes so that I can remember exactly what I was thinking. More than once I wrote down the gist of an idea and later on forgot what the heck I was thinking.

<p>
<img data-src="https://static.raymondcamden.com/images/2022/02/todo2.jpg" alt="Seriously, Mortal Kombat Ponies??!?" class="lazyload imgborder imgcenter">
</p>

I randomly thought this morning that it would be kind of cool to take my list and actually put it up on my blog. Based on how easy it was to work with the Graph API and Pipedream I whipped up the following workflow.

First, I have a step to get all my To Dos that are not marked completed:

```js
async (event, steps, auths) => {

	import fetch from 'node-fetch';

	const blogList = 'AQMkADAwATMzAGZmAS04MDU4LWQ4ZjctMDACLTAwCgAuAAAD2b-xt4VpMU28CRdh70oBigEAzwpFFkTJnUqSIr7l4olnFgACofznJAAAAA==';
	const rootUrl = `https://graph.microsoft.com/v1.0/me/todo/lists/${blogList}/tasks?$filter=status ne 'completed'`;

	async function getCompletedToDos(todos = [], url = rootUrl) {
		let result = await fetch(url, {
			headers: {
			'Authorization':`Bearer ${auths.microsoft_graph_api.oauth_access_token}`
			}
		});

		let data = await result.json();

		data.value.forEach(d => {
			todos.push({
				title:d.title,
				created:d.createdDateTime,
				lastModified:d.lastModifiedDateTime, 
				id:d.id,
				content:d.body.content
			})
		});

		if(data['@odata.nextLink']) {
			return await getCompletedToDos(todos, data['@odata.nextLink']);
		} else return todos;
	}

	return await getCompletedToDos();

}
```

The `blogList` value is the ID of the particular To Do list I care about, my blog ideas. The `rootUrl` is making use of Microsoft's Graph API end point to get all the items on the list, filtered to those where the status isn't `completed`. 

I've got a function, `getCompletedToDos`, that will recursively fetch content until done. Note the `Authorization` header. Pipedream handles all of that for me. All I had to do was authenticate with Microsoft one time. I know I've said *so* many times I love working with Pipedream, but it's stuff like this that would normally have taken me the most time. Pipedream just makes it easy. 

I do a bit of normalization on the task to simplify it a bit. If you're curious, here is the [documentation](https://docs.microsoft.com/en-us/graph/api/resources/todotask?view=graph-rest-1.0) for the complete `toDo` object. I'm only using a small bit of it. 

The last step of my workflow then just returns the data:

```js
async (event, steps) => {

	$respond({
		status:200,
		headers: {
			'Content-Type':'application/json'
		},
		body:steps.getToDos.$return_value
	})

}
```

And that's all it takes. You can view the result here: <https://enyqsjc7dfkrc5s.m.pipedream.net/>. I've also shared the workflow here: <https://pipedream.com/@raymondcamden/blog-todos-p_yKC3koo>. Remember, Pipedream makes it easy to share workflows. You can see all of my code, but you won't have my authentication object. 

The final bit was to add it to my blog! I whipped up a simple new page:

```html
<p>
The following is a list of ideas I have for future blog content. It's driven by <a href="https://todo.microsoft.com/tasks/">Microsoft To-Do</a> and a 
<a href="https://pipedream.com">Pipedream</a> workflow that turns the list into a public JSON endpoint. 
</p>

<div id="status"></div>

<ul id="blogList">
</ul>
```

And wrote a quick bit of code to handle the fetch:

```js
const endpoint = 'https://enyqsjc7dfkrc5s.m.pipedream.net/';

document.addEventListener('DOMContentLoaded', init, false);

async function init() {
	let status = document.querySelector('#status');
	status.innerHTML = '<i>Loading the blog queue...</i>';
	let blogList = document.querySelector('#blogList');

	let blogIdeas = await (await fetch(endpoint)).json();

	let s = blogIdeas.reduce((prev, cur) => {
		let created = new Date(cur.created);
		let date = `${created.getFullYear()}-${created.getMonth()+1}-${created.getDate()}`;
		return prev + `<li>${cur.title} (added ${date})</li>`;
	},'');

	status.innerHTML = '';
	blogList.innerHTML = s;
}
```

You can see the result here: <https://www.raymondcamden.com/queue>

If you've got any questions about this, let me know!

Photo by <a href="https://unsplash.com/@levidjones?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Levi Jones</a> on <a href="https://unsplash.com/s/photos/queue?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Unsplash</a>
  