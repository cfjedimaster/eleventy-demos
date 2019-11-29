---
layout: post
title: "Testing Local Development with Azure Functions"
date: "2018-08-03"
categories: ["serverless"]
tags: ["azure"]
banner_image: /images/banners/rough_start_a.jpg
permalink: /2018/08/03/testing-local-development-with-azure-functions
---

Hey folks! So obviously I'm taking this [Azure Functions](https://azure.microsoft.com/en-us/services/functions/) thing a bit slowly. Not that folks care (probably ;) but I'm 10 days away from having my older kids in school and my youngest in day care which means 9 glorious hours of quiet time in my home office to really churn stuff out. In this post, I want to talk about how you can write Azure Function code locally and deploy to Azure for testing.

To be clear, this is *not* the same as doing the complete development locally. Azure supports this via another toolset called the [Azure Functions Core Tools](https://docs.microsoft.com/en-us/azure/azure-functions/functions-run-local). I plan on trying that in the next few posts, but I wanted to try the approach of local *code writing* and Azure deployment first. 

I think an argument can be made that this may not be the best development process for Azure Functions. It's how I did stuff in OpenWhisk and Webtask so it's familiar to me, but I'm trying to keep an open mind about things here and recognize that maybe I need to adapt how I do serverless with Azure. I did get it running, but with a few issues that were (mainly) my fault.

Let's get started...

### The CLI

First off, there is a Quickstart specifically for working with the CLI: [Create your first function using the Azure CLI](https://docs.microsoft.com/en-us/azure/azure-functions/functions-create-first-azure-function-azure-cli). However, this is bit misleading in my mind. They walk you through installing the CLI (more on that in a second), but the actual deployment comes from a Git repo. That's absolutely a valid way to deploy code, but while learning, I'd hate to have to push to Git and then deploy from Git every time I tweak something. I basically ignored this concept and filed it away as something that would be good in a CI (Continuous Integration) process later on.

So about that CLI... while following the directions ([Install Azure CLI 2.0](https://docs.microsoft.com/en-us/cli/azure/install-azure-cli?view=azure-cli-latest), I ran into issues that were entirely my fault. While I love WSL (Windows Subsystem for Linux), I'm really a shell newbie. I had changed my shell a while back to Fish and the directions given by in the CLI installation did not work for me. Again - that is my fault. Here is a specific example. The docs say to do this:

	AZ_REPO=$(lsb_release -cs)

And for me, I had to run `lsb_release -cs` by itself, note the output ("xenial"), and then run `set AZ_REPO xenial`. 

Once I got past that though I was mostly ok. The basic `az login` command didn't work well for me and I had to use `az login --use-device-code` instead.

### Deploying Locally

Ok - so *can* deploy local code? Yes! You want to use what is called [Zip push deployment](https://docs.microsoft.com/en-us/azure/azure-functions/deployment-zip-push) instead. This is covered later in the Azure Functions docs (Under the "How-to guides") section and is probably a hint for me to maybe actually read *all* the docs before I write another line of code. But... yeah... I like to write code while I learn. ;)

In order to deploy this way, you have to create a zip file first. To be honest, it seems silly that the CLI can't do that zip for you, but it isn't too much of a hassle and as I'd make a shell script for this anyway, I can deal.

You also need to have a proper file configuration for your code. What do I mean by that? For OpenWhisk and Webtask, I write my function in some file, foo.js, and just deploy it. I only worry about other files when pushing npm modules and the such. 

Azure Functions actually have a more complex file structure. Not too complex, there's just a bit more going on. The docs do a great job of explaining the parts and showing an example:

	wwwroot
	| - host.json
	| - mynodefunction
	| | - function.json
	| | - index.js
	| | - node_modules
	| | | - ... packages ...
	| | - package.json
	| - mycsharpfunction
	| | - function.json
	| | - run.csx

There's a few things I want to point out here. First - Azure Functions are grouped into apps. This took me a while to realize but it makes perfect sense. Instead of deploying one particular function at a time, you work with apps instead. OpenWhisk didn't really have a concept of grouped functions. You did have packages, but in my mind, there were more appropriate for things you share, not really an "app" concept. I like this structure quite a bit. 

Also note that each serverless function has a json file that represents the metadata of the function. While on one hand this means that each function has a minimum of two files versus one... I like this. Metadata in OpenWhisk is something you have to fetch via the CLI. Having it in a physical file makes it a bit easier to work with I think. I guess both approaches are good, but I like being able to quickly see (and check into source control) the metadata for my function. 

If your curious what this looks like for a simple HTTP enabled example, here is one of them:

```js
{
  "disabled": false,
  "bindings": [
    {
      "authLevel": "function",
      "type": "httpTrigger",
      "direction": "in",
      "name": "req"
    },
    {
      "type": "http",
      "direction": "out",
      "name": "res"
    }
  ]
}
```

I'm still learning Azure Functions (obviously) but I bet there is a heck of a lot more I can do in there.

Finally - in order to make it easy to get this structure locally, don't forget you can export your function (like the one you made in the previous quick start) to a local zip.

![Azure Function top header showing link to download](https://static.raymondcamden.com/images/2018/08/cli_af1.jpg)

I downloaded my zip, copied one of the function folders as a quick way to make a new function, and decided to test the upload with that.

The basic form for deployment in this manner is: `az functionapp deployment source config-zip  -g myResourceGroup -n <app_name> --src <zip_file_path>` 

I ran this and got...

![JSON output](https://static.raymondcamden.com/images/2018/08/cli_af2.jpg)

Notice the JSON output? That's something I've noticed a few times with the CLI. It's cool that it supports JSON output, but it kinda surprises me that it is the default. I mean, I'm a developer, I can read JSON, but it still surprises me. You can change this by adding: `-o table` for a table based output. (Although when I tried it the result was way too big for my terminal and not really readable.)

So done, right?

Nope! My new function never showed up in the portal. I thought perhaps it meant I had to do something special when adding a new function, but even if I tweaked the code of an *existing* function and deployed my zip, it didn't update.

Turns out I made a mistake I've made in other apps that support zip files. I zipped the directory from *outside* the directory. In other words:

	zip -rq code.zip rcamden-azurefunctions

Why was that bad? The zip file didn't have my code in the root of the archive, but instead had it in a folder called `rcamden-azurefunctions`. Dumb mistake, right? I just CD'ed into the older and changed to:

	zip -rq code.zip ./

This "worked", but what bugged me is that the output from the CLI was the *exact same* for my successful deployment versus the "bad" one. It seems like it just ignored the fact that the zip didn't have a `host.zip` file in root which should have been a clue, right? Definitely my fault, but I wish the CLI had reported it a bit better.

### Recap

Ok, so just to go over what I learned:

* You can use the `az` CLI to deploy locally.
* You have to zip the code first (be sure to zip correctly and don't forget you can, and probably should, just script all this to make it easier)

As an FYI, my rather small-ish app of 3 functions took about 20 seconds. That's "ok" speed. I'm going to compare this against 'proper' [local development](https://docs.microsoft.com/en-us/azure/azure-functions/functions-run-local) soon and see how it compares.


