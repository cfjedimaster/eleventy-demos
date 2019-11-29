---
layout: post
title: "My (Rough) Start with Azure Functions"
date: "2018-07-06"
categories: ["serverless"]
tags: ["azure"]
banner_image: /images/banners/rough_start_a.jpg
permalink: /2018/07/06/my-rough-start-with-azure-functions
---

As I mentioned a few [days ago](https://www.raymondcamden.com/2018/07/02/summer-plans-looking-at-azure-functions), I'm going to spend time this summer looking at [Azure Functions](https://azure.microsoft.com/en-us/services/functions/). For my first look, I wanted to focus on what the sign up process was like. I already had an Azure account, but I wanted to start fresh just to see if things had changed or improved. One of the things I was concerned about specifically was the login process. While I've never sat down to document it precisely, I know I've had issues with logins on Microsoft sites before. Unfortunately, I ran into that again. It was frustrating, but I did get past it.

Ok - so to outline what I want to cover today - this post covers:

* Starting with Azure Functions
* Signing in with Azure
* Making my first Function

Everything here is documented so this will mainly be me sharing the URLs and screen shots of what I actually encountered. 

You start off with Azure Functions at <https://azure.microsoft.com/en-us/services/functions/>. 

![Azure Functions home page](https://static.raymondcamden.com/images/2018/06/af1.jpg)

While I generally don't pay a lot of attention to the "marketing home page" for products, this one is rather nice and includes links to pretty much everything you may want to check out *before* committing to actually learning the tech. Two things in particular caught my eye here. First, they have a link to a [cookbook](https://azure.microsoft.com/en-us/resources/azure-serverless-computing-cookbook/) that is free although it uses C#. I know squat about C# but as a cookbook, I think it would still be useful for just giving you an idea of the kinds of things you can build with the platform. At a bit over 300 pages, this is a great resource you should grab while your there.

The second thing you want to make note of is the link to [pricing information](https://azure.microsoft.com/en-us/pricing/details/functions/). As expected, you get a really generous free tier. Currently that's one million executions and 400,000 GB-s of execution time. This all sounds good, but then you run into your first "gotcha" (although a minor one at that):

<blockquote>
<strong>Note</strong>—A storage account is created by default with each Functions app. The storage account is not included in the free grant. Standard storage rates and networking rates charged separately as applicable.
</blockquote>

The storage account is - as far as I can tell - the space you need to actually store the files and resources for your functions. I didn't have to worry about this for OpenWhisk and for Webtask we simply limit you to 100K per function with no "global" limit. When I looked at the details for the storage plan I saw that they gave you a year of free use. I then used their calculator with the smallest possible numbers to estimate what I'd be charged as a developer just "playing and learning", and from what I can see it would be about 10 cents a month.

Now - that's way below trivial. I spend more on fancy beer. But it would be nice if Microsoft could simply eat this cost or have a free tier for like 100 megs of space. Basically - don't make me even think about it. 

But yeah - that's a minor nit really. So now for the fun part - signing up for Azure. 

### The Quest for Azure

To ensure I was starting fresh with no cookies or other bits hanging around, I fired up [Brave](https://brave.com/) and headed to the home page at <https://azure.microsoft.com/en-us/free/>. 

![Azure home page](https://static.raymondcamden.com/images/2018/06/af2.jpg)

Again - a good page. I have a low tolerance for marketing but overall everything here was good. I will call out one thing I thought was a bit off. If you read over this page, you see this:

![Free stuff](https://static.raymondcamden.com/images/2018/06/af3.jpg)

Cool. That's one thing IBM did well with their PaaS - nearly every single aspect of it had a free tier. It looks like Microsoft provides *some* free stuff which is ok (although I think IBM has the ideal standard here though). What bugged me though was this:

![Not free stuff](https://static.raymondcamden.com/images/2018/06/af4.jpg)

Maybe I'm being picky - but "free" to me isn't "free for a year". If you say something is free, the implication (to me anyway) is always free. Microsoft isn't hiding this at all, but it felt misleading. You scroll down past this block and then hit the *really* free stuff. 

Ideally what I want in a PaaS is the ability to play and use everything for free, within limits. If I go over those limits, shut my stuff off. Basically give me a sandbox. I don't think any PaaS actually does this but it would be nice.  

Ok, so I start the registration process, and for the most part it's what you expect:

![Sign up](https://static.raymondcamden.com/images/2018/06/af5.jpg)

Yep, standard form. Then you begin handing over basic information.

![More Sign up](https://static.raymondcamden.com/images/2018/06/af6.jpg)

I'll ding Microsoft here for asking for my phone number earlier and not defaulting when asking for a verification. I'll ding me for looking at this form and having no idea what "verification by card" meant. I thought maybe it was a 'smart card' or something. Nope, a credit card. So yes,  you must give them a credit card to start using Azure. Again, I'll give credit to IBM here. They let you wait 30 days before doing that. I'm pretty sure Microsoft isn't going to steal from me so I didn't mind giving it here. 

Except I couldn't. :\ By default, Brave has some pretty tough ad blocking settings and it looks like no one at Microsoft tested their signup with Brave. (To be fair, as cool as Brave is I don't think the usage is very high.) I couldn't get to the credit card portion to show up until I disabled Brave's protection settings for the page.

So I entered everything and then got...

![Even More Sign up](https://static.raymondcamden.com/images/2018/06/af7.jpg)

Followed by...

![Even More Sign up!](https://static.raymondcamden.com/images/2018/06/af8.jpg)

I hit "Try again" and it worked. At this point I wasn't expecting much, but it did. I was registered and signed in. Woot! I go back to the Azure Functions page and click to go into the tutorials and...

![Even More Sign up!](https://static.raymondcamden.com/images/2018/06/af9.jpg)

Yeah - I don't know. The site was definitely confused about what state I was in:

![Eh?](https://static.raymondcamden.com/images/2018/06/af10.jpg)

But ok - so I stopped clicking that link and got myself over to the tutorial: <https://docs.microsoft.com/en-us/azure/azure-functions/functions-create-first-azure-function>. I then opened a new tab and loaded up the portal to find:

![Portal of Doom](https://static.raymondcamden.com/images/2018/06/af11a.jpg)

And... I gave up. With Brave I mean. I switched to Edge with my new login and oh god really?

![Seriously?](https://static.raymondcamden.com/images/2018/06/af12.jpg)

Well, I finally got into the portal and followed the walkthrough. I love that they don't force you into one particular language, but rather let you pick from a couple right off the bat: CSharp, JavaScript, and FSharp. (And Azure Functions supports more languages too - this is just the quick start.) 

The initial function you've given is based on a HTTP trigger. I've only done a *tiny* bit with Lambda, but I can remember being surprised by how difficult it seemed to create a simple HTTP-based serverless function. OpenWhisk and Webtask make this super easy and it looks like Azure Functions does as well. When asked to copy the URL for your function you have a few options for the key. (The following image was taken from the quick start.)

![Key options](https://static.raymondcamden.com/images/2018/06/af13.jpg)

From what I can tell, and after speaking with [Burke Holland](https://twitter.com/burkeholland), this key only provides access to the function and nothing more. Therefore, it should be safe in a client-side application. ("Should be" - I am absolutely not 100% certain but I plan to find out.) Burke also suggested adding CORS protection and I've added that to my list of things to investigate. Oh, and how does the code look?

```js
module.exports = function (context, req) {
    context.log('JavaScript HTTP trigger function processed a request.');

    if (req.query.name || (req.body && req.body.name)) {
        context.res = {
            // status: 200, /* Defaults to 200 */
            body: "Hello " + (req.query.name || req.body.name)
        };
    }
    else {
        context.res = {
            status: 400,
            body: "Please pass a name on the query string or in the request body"
        };
    }
    context.done();
};
```

At least to me, this felt simple out of the box. Both OpenWhisk and Webtask have a basic concept of "here is an object of request data" so I could immediately understand what `req` was doing. It looks like you "return" data by setting stuff in `context` and then calling `context.done()`. 

The online editor is - ok. 

![The editor](https://static.raymondcamden.com/images/2018/06/af14.jpg)

But there is no online syntax checking here which is pretty surprising. Again, I'm biased, but I think [our editor for Webtask](https://webtask.io/make) is incredible. Of course, you don't have to write code online and as I said in the first post, I plan on switching over to Visual Studio Code and the CLI next. Cool thing is - it's like literally the next link in the docs:

![Links in nav](https://static.raymondcamden.com/images/2018/06/af15.jpg)

You can hit my function here: [https://rcamden-azurefunctions.azurewebsites.net/api/HttpTriggerJS1?code=Jf2lYDGQCXwOoplK52aNyEbsLrL4wku69PVP1RCwNsq1qiT60aOZ4Q==&name=ray](https://rcamden-azurefunctions.azurewebsites.net/api/HttpTriggerJS1?code=Jf2lYDGQCXwOoplK52aNyEbsLrL4wku69PVP1RCwNsq1qiT60aOZ4Q==&name=ray)

Ok - so yeah - a *very* rough experience with Azure login - but outside of that it's not too bad and the quick start was very nice and clear. My next post will talk about the experience of using my own editor and the CLI, then I'll start looking at some real stuff to build. Just to set expectations though I'm about to head out for vacation so it may be a little while before I post again!

<i>Header photo by <a href="https://unsplash.com/photos/6E6CMgFAUjc?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Shirly Niv Marton</a> on Unsplash</i>