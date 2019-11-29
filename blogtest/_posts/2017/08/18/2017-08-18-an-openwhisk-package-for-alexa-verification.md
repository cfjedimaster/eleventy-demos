---
layout: post
title: "An OpenWhisk Package for Alexa Verification"
date: "2017-08-18T06:39:00-07:00"
categories: [serverless]
tags: [openwhisk,alexa]
banner_image: 
permalink: /2017/08/18/an-openwhisk-package-for-alexa-verification
---

<strong>Edit on August 19 - I had an error in my code that broke Alexa sessions. I've updated the code below and in GitHub.</strong>

Yesterday I was working on a new Alexa skill (I really want the schwag Amazon is giving away this month for releasing a skill) and I had gotten to the point where I needed to lock down the service. I first talked about this back in March (<a href="https://www.raymondcamden.com/2017/03/17/creating-alexa-skills-with-openwhisk-part-two">Creating Alexa Skills with OpenWhisk - Part Two</a>). Basically - Amazon requires you to secure your Alexa service and run a variety of checks to ensure the request is really coming from Alexa. 

Luckily there's a simple npm package for it (<a href="https://github.com/mreinstein/alexa-verifier">alexa-verifier</a>) and using it with OpenWhisk is pretty trivial. Once you add the code I demonstrated in the blog post, you then simply ensure you've enabled "raw" support for the API. So instead of <code>--web true</code> you would use <code>--web raw</code>.

But as I was preparing to do this to the skill I wanted to release, I thought - why not see if I could simply put this logic in it's own action? Then a developer would simply need to use it as part of a sequence. So with that in mind, I quickly wrote the following.

<pre><code class="language-javascript">let alexaVerifier = require(&#x27;alexa-verifier&#x27;);

function main(args) {

     return new Promise(function(resolve, reject) {

        let signaturechainurl = args.__ow_headers.signaturecertchainurl;
        let signature =  args.__ow_headers.signature;
        let body = new Buffer(args.__ow_body,&#x27;base64&#x27;).toString(&#x27;ascii&#x27;);
        let request = JSON.parse(body).request;

        alexaVerifier(signaturechainurl, signature, body, function(err) {
            if(err) reject(err);
            resolve(JSON.parse(body));
        });

    });
    
}

exports.main = main;
</code></pre>

This action takes in the request, digs out the relevant HTTP request information, and then runs the verification call. 

When done, it simply resolves the original request. That means your original code, the skill you were working on, testing, etc, can stay <strong>exactly</strong> the same, and that's freaking cool in my book.

So how do you use it? 

First, you have to make a new action, a sequence, that will combine my action with yours. Imagine your skill's action is nameCats. You could create a new, verified action like so:

<code>wsk action create --sequence alexa_namecats /rcamden@us.ibm.com_My Space/alexa/verifier,nameCats --web raw</code>

The end result is an action called alexa_namecats, which isn't the best name, but meh, it works. Then you need the URL:

<code>wsk action get alexa_namecats --url</code>

Take that URL, add ".json" to the end, and update your Alexa skill URL:

![Screen shot, duh](https://static.raymondcamden.com/images/2017/8/alexa_ow1.jpg)

If you do not want to use my shared package, you can grab the code yourself here: https://github.com/cfjedimaster/Serverless-Examples/tree/master/alexa. As I think of more stuff that makes sense, I'll add to my Alexa package. (Or if you have ideas, gladly send me a pull request!)