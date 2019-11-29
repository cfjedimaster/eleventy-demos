---
layout: post
title: "HTTP Stuff with Azure Functions (and more)"
date: "2018-08-20"
categories: ["serverless"]
tags: ["azure"]
banner_image: /images/banners/rough_start_a.jpg
permalink: /2018/08/20/http-stuff-with-azure-functions-and-more
---

It's been a few days since I wrote up some more about [Azure Functions](https://azure.microsoft.com/en-us/services/functions/). My time to play with it has been somewhat limited with the kids starting school and me wanting nothing to do with my laptop at night - but despite that I've done some more digging and found some more cool stuff. As I stated <a href="https://www.raymondcamden.com/2018/07/06/my-rough-start-with-azure-functions">last month</a>, it was a rough start, but now that things are clicking I'm finding more and more coolness with the platform that I think is worth mentioning. As always, my goal here isn't to replicate the docs, but just point out what I think is neat!

In this entry I want to focus on the various ways you can execute your Azure Function over HTTP. In my first blog post I shared that you get an HTTP end point out of the box if you create a function from their <a href="https://docs.microsoft.com/en-us/azure/azure-functions/functions-create-first-azure-function">quick start</a>. This sets up a setting under the "Integrate" part of your function. You can see it here with the default settings.

![Default HTTP Trigger settings](https://static.raymondcamden.com/images/2018/08/http_af1.jpg)

When you ask for your URL, you end up with something like so:

https://rcamden-azurefunctions.azurewebsites.net/api/HttpTriggerJS1?code=Jf2lYDGQCXwOoplK52aNyEbsLrL4wku69PVP1RCwNsq1qiT60aOZ4Q==

The `code` value in this case is a key that has 'function' level access. In theory it would be fine (as far as I know) to share in a client-side application, but it probably isn't ideal. Luckily you can tweak this quickly enough. 

![Modified HTTP Trigger settings](https://static.raymondcamden.com/images/2018/08/http_af2.jpg)

In the screen shot above I've changed `Allowed HTTP methods` to "Selected methods" and then restricted the allowed methods to GET only. I've set the `Authorization level` to "Anonymous" so I no longer need to share a key. And finally, I added a `ROute template` value of "cats". Now I can use this URL:

https://rcamden-azurefunctions.azurewebsites.net/api/cats

Which, by the way, works, although I'm playing with the code so it may not work in the future. Go ahead and hit <a href="https://rcamden-azurefunctions.azurewebsites.net/api/cats?name=ray">https://rcamden-azurefunctions.azurewebsites.net/api/cats?name=ray</a>, you know you want to!

So... that's rather simple and direct. If you want a deeper look, you can read about it at: <a href="https://docs.microsoft.com/en-us/azure/azure-functions/functions-create-serverless-api">Create a serverless API</a>. I suggest doing so because they bring up two related features that are pretty bad ass. 

## Proxies

So when I think "proxy" and "serverless", I think about how I can use serverless to create a proxy to a remote API. This is great for when you need to transform an API's result. Or heck, when you just want to hide that you are using service X in case you need to change to Y in the future. 

While you can certainly do that with Azure Functions, in this case they are talking about a proxy from one Azure Function app to another. You can see the UI for this in my first screen shot:

![Proxies in the menu](https://static.raymondcamden.com/images/2018/08/http_af3.jpg)

The <a href="https://docs.microsoft.com/en-us/azure/azure-functions/functions-create-serverless-api">docs</a> walk you through creating a proxy from one app to another and it's fairly boilerplate, but it's a cool feature to have. I like the idea of creating one proxy and having the freedom to swap out the back end Function app later. 

## Mock APIs

This was is a bit interesting too. If I had to build an API and didn't have access to the data, I may simply do something along these lines:

```js
return [
	{name: 'Felix', age: 1},
	{name: 'Ginger', age: 2},
	{name: 'Luna', age: 5}
]
```

and then simply replace that hard code logic at a later time. That let's me get back to my front end app (or whatever) and continue to work. Azure Functions actually let you make use of proxies to achieve something similar. Without touching your real code at all, you can set up what they call "overrides" to return static data. Here's an example I stole from that same doc:

```js
{
    "$schema": "http://json.schemastore.org/proxies",
    "proxies": {
        "HelloProxy": {
            "matchCondition": {
                "route": "/api/hello"
            },
            "backendUri": "https://%HELLO_HOST%/api/hello"
        },
        "GetUserByName" : {
            "matchCondition": {
                "methods": [ "GET" ],
                "route": "/api/users/{username}"
            },
            "responseOverrides": {
                "response.statusCode": "200",
                "response.headers.Content-Type" : "application/json",
                "response.body": {
                    "name": "{username}",
                    "description": "Awesome developer and master of serverless APIs",
                    "skills": [
                        "Serverless",
                        "APIs",
                        "Azure",
                        "Cloud"
                    ]
                }
            }
        }
    }
}
```

Nifty! I still think I'd probably build a 'shell' function with hard coded logic but this is a great option as well.

### What's Next?

Ok - while there are still a lot of features I need to get into, the main thing I want to figure out next is how to use npm modules. After that, it's all details honestly. Once I get that figured out, I'll then build a "real" if simple application and talk about the process, pain points, etc. As always, let me know what you think!
