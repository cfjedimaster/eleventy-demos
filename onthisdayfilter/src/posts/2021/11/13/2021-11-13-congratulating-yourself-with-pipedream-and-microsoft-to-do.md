---
layout: post
title: "Congratulating Yourself with Pipedream and Microsoft To Do"
date: "2021-11-13T18:00:00"
categories: ["serverless"]
tags: ["pipedream"]
banner_image: /images/banners/congrats.jpg
permalink: /2021/11/13/congratulating-yourself-with-pipedream-and-microsoft-to-do.html
description: Using Microsoft's API for To Do and Pipedream to congratulate yourself for accomplishing tasks.
---

I'm very, very excited about this blog post. Not that it's anything super important, but it's something I added to my blog writing queue a long time ago. When I talk about my blog queue, I'm talking about a task list under [Microsost To Do](https://todo.microsoft.com/tasks/). This is a great little application I've been using for a few years now. I tracked things like my tasks for my wedding and shopping lists as well as things I'm doing for work. My primary use case though is a queue of ideas for blog posts. 

Here's how the todo for this blog post looks in the Windows application:

<p>
<img data-src="https://static.raymondcamden.com/images/2021/11/todo1.jpg" alt="To Do Application showing one todo" class="lazyload imgborder imgcenter">
</p>

In general, I really just dig the application and it's worked well for me. A few years ago (August 2019), Mary Branscombe shared this tweet:

<blockquote class="twitter-tweet" data-theme="dark"><p lang="en" dir="ltr">This would be a lovely &quot;achievement view&quot; for <a href="https://twitter.com/MicrosoftToDo?ref_src=twsrc%5Etfw">@MicrosoftToDo</a> <a href="https://twitter.com/marcusash?ref_src=twsrc%5Etfw">@marcusash</a>   <a href="https://t.co/zqkJ00iTFm">https://t.co/zqkJ00iTFm</a></p>&mdash; Mary Branscombe (@marypcbuk) <a href="https://twitter.com/marypcbuk/status/1163249680836415493?ref_src=twsrc%5Etfw">August 19, 2019</a></blockquote> <script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>

She was retweeting Julia Duimovich who herself was talking about how [@alicegoldfuss](https://twitter.com/alicegoldfuss) had created a process that looked for tasks she completed and emailed her a list of the things she did. You can, and should, read her post here: [Automating My Todo with GitHub and Twilio](https://blog.alicegoldfuss.com/automating-my-todo/).

When I saw that Tweet, I thought it would be cool to do something similar in Microsoft To Do. At the time, there wasn't an API that let you read your To Do later. Fast forward to about a year ago, they added it:

<blockquote class="twitter-tweet" data-theme="dark"><p lang="und" dir="ltr">FYI - <a href="https://t.co/RC0p9uh1ui">https://t.co/RC0p9uh1ui</a></p>&mdash; Raymond Camden (@raymondcamden) <a href="https://twitter.com/raymondcamden/status/1323715954908516353?ref_src=twsrc%5Etfw">November 3, 2020</a></blockquote> <script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>

Cool! We had an API and I was ready to go. Microsoft has [great documentation](https://docs.microsoft.com/en-us/graph/api/resources/todo-overview?view=graph-rest-1.0) as well as a cool online [Graph Explorer](https://developer.microsoft.com/en-us/graph/graph-explorer). Unfortunately, when I started working with the API, I ran into errors. It was beta initially, but I couldn't get anything to work.

I reached out on their forums, and got responses, but after three plus months of back and forth, I never got a resolution. While I appreciated Microsoft folks trying to help, in the end though I was stuck with an API that didn't work for me. (And that's an important detail, it seemed to be tied to an issue with my account, but we never got to the end of it. If you want you can peruse the details at the [thread](https://docs.microsoft.com/en-us/answers/questions/150401/503-errors-trying-to-get-todo-lists.html?childToView=169860#comment-169860).) 

On a whim, and wanting to do something productive and fun on a Saturday morning, I randomly hopped over to the Graph Explorer and tried it again... and it worked!

<p>
<img data-src="https://static.raymondcamden.com/images/2021/11/todo2.jpg" alt="Happy Cat" class="lazyload imgborder imgcenter">
</p>

Ok - with access to my To Dos, I began to dig in. First, to get a list of all your task lists (to dos are grouped within lists), you make an authenticated call to `https://graph.microsoft.com/v1.0/me/todo/lists`. This returns a result like so (I cut some out):

```json
{
    "@odata.context": "https://graph.microsoft.com/v1.0/$metadata#users('ray%40camdenfamily.com')/todo/lists",
    "value": [
        {
            "@odata.etag": "W/\"zwpFFkTJnUqSIr7l4olnFgAFN2flMw==\"",
            "displayName": "Tasks",
            "isOwner": true,
            "isShared": false,
            "wellknownListName": "defaultList",
            "id": "AQMkADAwATMzAGZmAS04MDU4LWQ4ZjctMDACLTAwCgAuAAAD2b-xt4VpMU28CRdh70oBigEAzwpFFkTJnUqSIr7l4olnFgAAAgESAAAA"
        },
        {
            "@odata.etag": "W/\"zwpFFkTJnUqSIr7l4olnFgAFN2flOQ==\"",
            "displayName": "Blog Ideas",
            "isOwner": true,
            "isShared": false,
            "wellknownListName": "none",
            "id": "AQMkADAwATMzAGZmAS04MDU4LWQ4ZjctMDACLTAwCgAuAAAD2b-xt4VpMU28CRdh70oBigEAzwpFFkTJnUqSIr7l4olnFgACofznJAAAAA=="
        },
        {
            "@odata.etag": "W/\"zwpFFkTJnUqSIr7l4olnFgAFN2flSA==\"",
            "displayName": "Wedding",
            "isOwner": true,
            "isShared": false,
            "wellknownListName": "none",
            "id": "AQMkADAwATMzAGZmAS04MDU4LWQ4ZjctMDACLTAwCgAuAAAD2b-xt4VpMU28CRdh70oBigEAzwpFFkTJnUqSIr7l4olnFgADnBfxgwAAAA=="
        },
        {
            "@odata.etag": "W/\"zwpFFkTJnUqSIr7l4olnFgAFN2flSw==\"",
            "displayName": "Work Tasks",
            "isOwner": true,
            "isShared": false,
            "wellknownListName": "none",
            "id": "AQMkADAwATMzAGZmAS04MDU4LWQ4ZjctMDACLTAwCgAuAAAD2b-xt4VpMU28CRdh70oBigEAzwpFFkTJnUqSIr7l4olnFgADOSa7GgAAAA=="
        }
    ]
}
```

To get the to dos for one list, you take the ID and go to `https://graph.microsoft.com/v1.0/me/todo/lists/${TASK ID}/tasks`. This returns data like so (and again I slimmed it down a bit):

```json
{
    "@odata.context": "https://graph.microsoft.com/v1.0/$metadata#users('ray%40camdenfamily.com')/todo/lists('AQMkADAwATMzAGZmAS04MDU4LWQ4ZjctMDACLTAwCgAuAAAD2b-xt4VpMU28CRdh70oBigEAzwpFFkTJnUqSIr7l4olnFgACofznJAAAAA%3D%3D')/tasks",
    "@odata.nextLink": "https://graph.microsoft.com/v1.0/me/todo/lists/AQMkADAwATMzAGZmAS04MDU4LWQ4ZjctMDACLTAwCgAuAAAD2b-xt4VpMU28CRdh70oBigEAzwpFFkTJnUqSIr7l4olnFgACofznJAAAAA==/tasks?$skip=10",
    "value": [
        {
            "@odata.etag": "W/\"zwpFFkTJnUqSIr7l4olnFgAFO3wHNw==\"",
            "importance": "normal",
            "isReminderOn": false,
            "status": "completed",
            "title": "Eleventy plugin that adds global data",
            "createdDateTime": "2021-11-03T19:42:53.1618082Z",
            "lastModifiedDateTime": "2021-11-13T15:03:38.4920095Z",
            "id": "AQMkADAwATMzAGZmAS04MDU4LWQ4ZjctMDACLTAwCgBGAAAD2b-xt4VpMU28CRdh70oBigcAzwpFFkTJnUqSIr7l4olnFgACofznJAAAAM8KRRZEyZ1KkiK_5eKJZxYABTMvxVEAAAA=",
            "body": {
                "content": "What global data is the issue.",
                "contentType": "text"
            },
            "completedDateTime": {
                "dateTime": "2021-11-13T00:00:00.0000000",
                "timeZone": "UTC"
            }
        },
        {
            "@odata.etag": "W/\"zwpFFkTJnUqSIr7l4olnFgAFM+DqAA==\"",
            "importance": "normal",
            "isReminderOn": false,
            "status": "notStarted",
            "title": "PDF Embed, remember scroll/page, reset to it",
            "createdDateTime": "2021-11-03T13:43:07.9106746Z",
            "lastModifiedDateTime": "2021-11-03T14:03:26.5738448Z",
            "id": "AQMkADAwATMzAGZmAS04MDU4LWQ4ZjctMDACLTAwCgBGAAAD2b-xt4VpMU28CRdh70oBigcAzwpFFkTJnUqSIr7l4olnFgACofznJAAAAM8KRRZEyZ1KkiK_5eKJZxYABTMvxVAAAAA=",
            "body": {
                "content": "",
                "contentType": "text"
            }
        },
	    {
            "@odata.etag": "W/\"zwpFFkTJnUqSIr7l4olnFgAFM+CPfg==\"",
            "importance": "normal",
            "isReminderOn": false,
            "status": "notStarted",
            "title": "Using JS to reshape data",
            "createdDateTime": "2021-11-02T19:47:28.6565444Z",
            "lastModifiedDateTime": "2021-11-02T20:49:52.5536125Z",
            "id": "AQMkADAwATMzAGZmAS04MDU4LWQ4ZjctMDACLTAwCgBGAAAD2b-xt4VpMU28CRdh70oBigcAzwpFFkTJnUqSIr7l4olnFgACofznJAAAAM8KRRZEyZ1KkiK_5eKJZxYABTMvxU4AAAA=",
            "body": {
                "content": "Reduce items to N.Filter out.Reshape with map.Reshape with map and C->F.some() example",
                "contentType": "text"
            }
        }
    ]
}
```

Cool. So now I needed to think about my logic a bit. The idea I was trying to emulate was a scheduled task that would congratulate me for completing tasks. (And forgive me if I go back and forth between saying 'task' and 'todo'. As you can see in the APIs, Microsoft also uses tasks.) The response includes a `@odata.nextLink` property which means I could build code to get every 'page' of data and then filter to completed items. If you look at the completed example above (the first item in the list), you'll also see that the completed time is marked. So I could filter by completed as well as items completed in the past seven days. I was worried about performance though so I did some digigng.

Looking at ["Use query parameters to customize responses"](https://docs.microsoft.com/en-us/graph/query-parameters?view=graph-rest-1.0) I discovered I could use `$filter`. I played around a bit and came up with this:

	https://graph.microsoft.com/v1.0/me/todo/lists/AQMkADAwATMzAGZmAS04MDU4LWQ4ZjctMDACLTAwCgAuAAAD2b-xt4VpMU28CRdh70oBigEAzwpFFkTJnUqSIr7l4olnFgACofznJAAAAA==/tasks?$filter=status eq 'completed' and completedDateTime/dateTime ge '2021-11-01T08:00'

That's a rather long URL but the important bit is the filter: `$filter=status eq 'completed' and completedDateTime/dateTime ge '2021-11-01T08:00'` Status should make sense as is, but the date filter is dynamic (you'll see this code in a bit). 

This worked great. I then tried to use the [`$select` filter](https://docs.microsoft.com/en-us/graph/query-parameters?view=graph-rest-1.0#select-parameter), but it didn't work for me. I kept getting errors even when using the autocomplete in their web-based tool. I fiddled around trying different things and eventually I got an error saying select wasn't supported, so I imagine in general it's not something you can do with this particular resource. I could *definitely* be wrong so keep that in mind.

Alright, so at this point, I've got an endpoint that returns completed To Dos filtered to a date range. Now I just need to get some code up! I decided to make use of [Pipedream](https://pipedream.com/). I knew I could both easily handle the schedule (once a week) as well as the authentication. Here's how I built my workflow.

I began with a scheduled based trigger. Pipedream lets you pick from some defaults or enter a cron expression. What's really freaking cool is that as you enter your expression, it updates text that reflects the expression itself. Cron has always been hard for me to grok but this feature made me completely confident in my final value.

<p>
<img data-src="https://static.raymondcamden.com/images/2021/11/todo3.jpg" alt="Schedule trigger set for Sunday" class="lazyload imgborder imgcenter">
</p>

Sunday was an arbitrary decision. I could see picking end of business day on Friday or Saturday morning as well. Next, I checked to see if Pipedream had support for using Microsoft Graph API calls and of course - they did:

<p>
<img data-src="https://static.raymondcamden.com/images/2021/11/todo4.jpg" alt="List of Microsoft actions" class="lazyload imgborder imgcenter">
</p>

I selected "Microsoft Graph API" which then led to this choice:

<p>
<img data-src="https://static.raymondcamden.com/images/2021/11/todo5.jpg" alt="Run Node.js code with MS Graph API" class="lazyload imgborder imgcenter">
</p>

Running code with the Graph API is exactly what I needed. After selecting this, you get a code step with the ability to provide your authentication:

<p>
<img data-src="https://static.raymondcamden.com/images/2021/11/todo6.jpg" alt="Default Graph API code step" class="lazyload imgborder imgcenter">
</p>

What's cool here is you click the button on top and login (one time, after you've done that you can create other workflows and Pipeream remembers your login). You can then test with the default code they use which just requests the logged in user's profile. 

<p>
<img data-src="https://static.raymondcamden.com/images/2021/11/todo7.jpg" alt="Result from running call." class="lazyload imgborder imgcenter">
</p>

Ok, just to recap how awesome Pipedream is - at this point I've got a workflow that will run on a custom schedule and the ability to use the Microsoft Graph API with minimal code since Pipedream handles authentication for you. You can see how in the code above: `${auths.microsoft_graph_api.oauth_access_token}` 

Given that I've got access to that access token, all I have to do is rewrite the code to use the endpoint I figured out above. The API supports paging and while I probably won't have more than a page of results, I wrote a recursive function to dynamically fetch as many pages as required. Here's the code step I built:

```js
async (event, steps, auths) => {

	import fetch from 'node-fetch';

	// set date filter to now - 7
	let lastWeek = new Date();
	lastWeek.setDate(lastWeek.getDate() - 7);

	const rootUrl = `https://graph.microsoft.com/v1.0/me/todo/lists/AQMkADAwATMzAGZmAS04MDU4LWQ4ZjctMDACLTAwCgAuAAAD2b-xt4VpMU28CRdh70oBigEAzwpFFkTJnUqSIr7l4olnFgACofznJAAAAA==/tasks?$filter=status eq 'completed' and completedDateTime/dateTime ge '${lastWeek}'`;

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
				completed:d.completedDateTime.dateTime
			})
		});
		if(data['@odata.nextLink']) {
			return await getCompletedToDos(todos, data['@odata.nextLink']);
		} else return todos;
	}

	return await getCompletedToDos();
}
```

Note that because I couldn't use `$select`, I do my own reshaping of the data, filtering results down to a title and completed date. Again, that was based on what I figured I'd need in my final result. 

At this point, I've got my data. In theory I could just email them, but I wanted to be sure I actually had data so I added another code step with a very short bit of logic:

```js
async (event, steps) => {
	if(steps.getCompletedToDos.$return_value.length === 0) $end('No completed tasks');
}
```

Basically, if my list of completed todos for the previous week is empty, end the workflow. I absolutely could have added this logic in the previous code step and Pipedream is fine with that, but I like having nice concrete steps in my workflow. Speaking of that, I then added *another* step to format my text for my email:

```js
async (event, steps) => {
	let html = `
	<h2>Look What You Did!</h2>
	<p>
	Life is hard, but somehow this week you managed to scratch off a few items from your task list! You should
	feel great about finishing the following:
	</p>
	<ul>
	`;

	steps.getCompletedToDos.$return_value.forEach(todo => {
		html += `
		<li>${todo.title}</li>  
		`
	});

	html += '</ul>';
	return html;
}
```

Finally, I added the "email me" Pipedream step which makes it simple to send an email to the workflow owner, i.e. me. 

<p>
<img data-src="https://static.raymondcamden.com/images/2021/11/todo8.jpg" alt="" class="lazyload imgborder imgcenter">
</p>

A quick note about the settings I used above. The "Mail Me" step requires plain text and HTML is optional. Normally when sending email you always send plain text and if you send HTML and if the end user supports it, they get the nicer looking email. For me, I know HTML works so I just used the same value for both. Again, don't do this in production or when sending emails to other folks. Here's how it looks:

<p>
<img data-src="https://static.raymondcamden.com/images/2021/11/todo9.jpg" alt="Sample email" class="lazyload imgborder imgcenter">
</p>

You can check out the cmplete workflow here: <https://pipedream.com/@raymondcamden/completed-todos-p_vQCzLlm>

Let me know what you think - and now I get to cross *this* post off my list as well!

Photo by <a href="https://unsplash.com/@brettgarwood?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Brett Garwood</a> on <a href="https://unsplash.com/s/photos/congratulations?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Unsplash</a>
  