---
layout: post
title: "Two Quick OpenWhisk/IBM Cloud Functions Updates"
date: "2017-11-20T01:16:00-07:00"
categories: [serverless]
tags: [openwhisk]
banner_image: 
permalink: /2017/11/20/two-quick-openwhiskibm-cloud-functions-updates
---

It's going to be a slow holiday week for me but I thought I'd share two interesting updates to OpenWhisk/IBM Cloud Functions that will be useful to developers. As a reminder, the `wsk` CLI does *not* prompt you to update when it is out of date. Read my [guide](https://www.raymondcamden.com/2017/04/25/updating-your-openwhisk-cli/) for help on how to check and update your CLI. Ok, so what changed?

CRON Details for Triggers
===

The first change isn't huge, but is real useful for me. Previously when you fetched details for CRON-based triggers, you did *not* get details about the CRON schedule back. So if you forgot, or weren't sure of, the schedule for your trigger, you were kind of out of luck. Now these details are returned. Here is a simple example of what you will see when running `wsk trigger get X` (I removed the rest of the content):

<pre><code class="language-javascript">
"config": {
"cron": "0 */3 * * *",
"name": "randomcomicbook_trigger",
"namespace": "rcamden@us.ibm.com_My Space",
"payload": {% raw %}{"payload": ""}{% endraw %}
}
</code></pre>

You can paste this into [https://crontab.guru](https://crontab.guru) to "translate" this into English: "At minute 0 past every 3rd hour."

IBM Cloud Service Binding
===

The next update only applies to the `bx` CLI. I don't blog about the `bx` CLI much when discussing OpenWhisk as I don't want to assume all my readers are using OpenWhisk on IBM Cloud (which, by the way, is the new name for Bluemix). The `bx` CLI is used to interact with IBM Cloud and is pretty powerful. To work with OpenWhisk on IBM Cloud, you simply add the plugin and then you can do `bx wsk` as a - for the most part - mirror of the generic `wsk` CLI. However, there are some differences for things that are specific to IBM Cloud.

One such difference is pretty bad ass if you are using any services. So for example, [Tone Analyzer](https://www.ibm.com/watson/services/tone-analyzer/). Whenever you create an IBM Cloud service, you get a set of credentials. You can easily use them in OpenWhisk actions by setting them up as parameters. You can make this even easier by setting them as default parameters so you don't have to pass them.

But now you can use "service bindings" instead. Basically set it up such that the credentials are passed to the action. So for example, given a service named 'conversation' and an action named 'enterpriseCatDemo', you could do this to have the credentials passed: `bx wsk service bind conversation enterpriseCatDemo`. The values will be passed as arguments named `__bx_creds` which is an object. It will contain the key `conversation` which includes the credentials. So if you bound another service named `foo`, then it would be in that key instead.

I'd show a proper demo, but there's already a full blog post up on this demonstrating everything: [Simplify binding your IBM Cloud services to serverless Functions](https://www.ibm.com/blogs/bluemix/2017/11/simplify-binding-ibm-cloud-services-serverless-functions/).

I'm adding a quick note here after publication - thank you to [Carlos Santana](https://twitter.com/csantanapr) for reminding me. Much like how `wsk` needs to be updated, so does the `wsk` plugin for `bx`. You can do that via the command: `bx plugin update`.