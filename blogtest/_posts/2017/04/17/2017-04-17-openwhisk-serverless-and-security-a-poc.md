---
layout: post
title: "OpenWhisk, Serverless, and Security - a POC"
date: "2017-04-17T08:38:00-07:00"
categories: [serverless]
tags: [openwhisk]
banner_image: /images/banners/sowpost.jpg
permalink: /2017/04/17/openwhisk-serverless-and-security-a-poc
---

<strong>Before I begin, I want to be clear that what follows is a proof of concept. It should absolutely not be considered a recommendation, but rather a starting point for conversation.</strong> I've been thinking a lot lately about how one could use OpenWhisk along with a security model of some sort. Specifically, "Expose action so and so but only for authorized users." Obviously "security" can imply a lot more, but in this initial post I'm going to keep my requirements a bit simpler.

* Authenticate the user somehow. 
* Make OpenWhisk action Foo require a logged in user.

For authentication, I chewed on a couple of different things. In theory, I could setup a Cloudant database and build actions for the typical user register/login routine, but I really, really didn't want to do that. Instead, I decided to finally take a look at [Auth0](https://auth0.com/). I'd heard of this service before but never heard a chance to actually play with it. Turns out, it was pretty easy. (I've got some more comments about Auth0, but I'll save them for the end of the post.) I set up a new Auth0 application using their "Lock" client-side setup to handle authentication. I built an incredibly bad client-side demo with no real UI and - yeah - did I say it was bad? The front end consists of two buttons:

<pre><code class="language-markup">&lt;!DOCTYPE html&gt;
&lt;html&gt;
    &lt;head&gt;
        &lt;meta charset=&quot;utf-8&quot;&gt;
        &lt;title&gt;&lt;&#x2F;title&gt;
        &lt;meta name=&quot;description&quot; content=&quot;&quot;&gt;
        &lt;meta name=&quot;viewport&quot; content=&quot;width=device-width&quot;&gt;
    &lt;&#x2F;head&gt;
    &lt;body&gt;

        &lt;p&gt;
        &lt;button id=&quot;loginBtn&quot;&gt;Login&lt;&#x2F;button&gt;
        &lt;&#x2F;p&gt;

        &lt;p&gt;
        &lt;button id=&quot;testFooBtn&quot;&gt;Test Foo&lt;&#x2F;button&gt;
        &lt;&#x2F;p&gt;
        
        &lt;script src=&quot;https:&#x2F;&#x2F;code.jquery.com&#x2F;jquery-3.1.1.min.js&quot;   integrity=&quot;sha256-hVVnYaiADRTO2PzUGmuLJr8BLUSjGIZsDYGmIJLv2b8=&quot;   crossorigin=&quot;anonymous&quot;&gt;&lt;&#x2F;script&gt;
        &lt;script src=&quot;https:&#x2F;&#x2F;cdn.auth0.com&#x2F;js&#x2F;lock&#x2F;10.14&#x2F;lock.min.js&quot;&gt;&lt;&#x2F;script&gt;
        &lt;script src=&quot;app.js&quot;&gt;&lt;&#x2F;script&gt;
    &lt;&#x2F;body&gt;
&lt;&#x2F;html&gt;
</code></pre>

I'm including Auth0 code at the bottom there along with jQuery. My two buttons handle logging in as well as calling the action I'll be demonstrating in a minute. The JavaScript code is mostly from the Auth0 code. Again, I want to be clear this is just some rough code to let me try stuff out.

<pre><code class="language-javascript">let lock;
let idToken;

$(document).ready( () =&gt; {
    console.log(&#x27;lets do this&#x27;);

    lock = new Auth0Lock(&#x27;asKI36rzsbOyY40DaGv6mPWODbexIO-R&#x27;,&#x27;raymondcamden.auth0.com&#x27;);

    $(&#x27;#loginBtn&#x27;).on(&#x27;click&#x27;,doLogin);

    $(&#x27;#testFooBtn&#x27;).on(&#x27;click&#x27;,doTestFoo);

    idToken = localStorage.getItem(&#x27;id_token&#x27;);
    if(idToken) {
        getProfile();
    }

    lock.on(&quot;authenticated&quot;, function(authResult) {
        console.dir(authResult);
        localStorage.setItem(&#x27;id_token&#x27;, authResult.idToken);
        idToken = authResult.idToken;
        getProfile();
    });

});

function doLogin() {
    lock.show();
}

function getProfile() {
    lock.getProfile(idToken, function(error, profile) {
        if (error) {
            &#x2F;&#x2F; Handle error
            return;
        }
        &#x2F;&#x2F; Display user information
        &#x2F;&#x2F;show_profile_info(profile);
        console.dir(profile);
    });
}
</code></pre>

When the login button is clicked, I run the `Lock` API's `show` method. This is where Auth0 really kicks butt. It handles the auth process completely and in the end, leaves me with a JWT (JSON Web Token) I can use to authenticate my later calls. The `getProfile` call is from Auth0's sample code. I don't actually use it for anything practical. Let me show you how this all looks.

First, the page as it loads by default (and again, this isn't meant to be production-ready):

![Default](https://static.raymondcamden.com/images/2017/4/sow1.png)

And here is how Auth0's auth routine looks like:

![Auth](https://static.raymondcamden.com/images/2017/4/sow2.png)

By the way, Facebook and Google were arbitrary choices - you can tweak that (again, I'll talk more about Auth0 at the end). 

After logging in, I'm brought back to my web page and have access to my profile, but the important thing is the id_token value. That represents the JWT value. I can use this in my OpenWhisk action to authenticate the request. 

JWT verification is rather easy. Here is the action I built:

<pre><code class="language-javascript">&#x2F;*
hard coded secret
*&#x2F;
const secret = require(&#x27;.&#x2F;creds.json&#x27;);
const jwt = require(&#x27;jsonwebtoken&#x27;);

&#x2F;*
args.token, passed in
*&#x2F;
function main(args) {

    return new Promise( (resolve, reject) =&gt; {

        let decoded = jwt.verify(args.token, secret.key, (err,decoded) =&gt; {

            if(err) {
                console.log(&#x27;err&#x27;,err);
                reject({
                    name:err.name,
                    message:err.message,
                    stack:err.stack
                });
            } else {
                resolve({% raw %}{decoded:decoded}{% endraw %});
            }

        });

    });

}

exports.main = main;
</code></pre>

The action needs two values, a key that is specific for my application, and loaded via a JSON file, and the JWT itself which is passed in. I require in the [jsonwebtoken](https://www.npmjs.com/package/jsonwebtoken) package which has a `verify` method I can run to verify the token is both valid for my application (based on the secret value) and a certain length of time. And that's it. Seriously - nice and simple, Right? I called this action `jwtverify`. 

So to bring this together, I need to build an action that will secured. I create the following, super simple action called foo.

<pre><code class="language-javascript">function main(args) {

    if(!args.name) args.name = &#x27;Nameless&#x27;;
    return {
        result:&quot;Hello &quot;+args.name
    }

}
</code></pre>

I pushed this up to OpenWhisk. I now have a generic "jwt verify" action and a random action I want to secure. How do I do that? With a sequence. I created a new action called `secureFoo` that was based on the sequence: `jwtverify`+`foo`. (Technically I made these all under a package called `secblog` just to organize the demo a bit.) The end result is an action that acts like an Express app with middleware. 

To test, I exposed `secureFoo` via a REST API (not as a web action because CORS isn't a simple addition yet). I then built this function to support that second button in my demo app:

<pre><code class="language-javascript">function doTestFoo() {
    $.get(&#x27;https:&#x2F;&#x2F;3b1fd5b1-e8cc-4871-a7d8-cc599e3ef852-gws.api-gw.mybluemix.net&#x2F;auth1&#x2F;foo?token=&#x27;+idToken+&#x27;&amp;name=Ray&#x27;).then((res) =&gt; {
        console.log(res);
    });
}
</code></pre>

The URL you see there is the path I exposed for my REST API. The crucial bit is at the end where I pass the token. This gets passed to the first action in the sequence, which verifies it, and then it carries on to the second. The result is what you would expect:

![Console](https://static.raymondcamden.com/images/2017/4/sow3.png)

Whew! Ok, done... kinda. Did you notice that my `Foo` action accepted an argument? I passed `name=Ray` in the URL, but it wasn't reflected in the result. One important thing to remember about sequences is that the arguments sent as input only go to the first action. If you want any later action to work with input, they have to be passed along as the result of each previous action.

Since our first action is a generic "secure this process" type thing, one approach we could take is to simply pass along everything that was sent, except the initial token. I modified my verification code like so:

<pre><code class="language-javascript">delete args.token;
resolve(args);
</code></pre>

And just like that - it works. I won't bother with a new screen shot since it literally just changed from `Nameless` to `Ray`. One issue with this particular setup is that 'token' is - essentially - a reserved word now. As this is my app and I'm building the APIs, I can handle that. 

So... that's that. As I said, I'm definitely not sure how much sense this makes, but I'd love to hear folks opinions. Leave me a comment below! You can find the source code for everything I showed here: https://github.com/cfjedimaster/Serverless-Examples/tree/master/auth1

Stop Reading
===

Or not. ;) As I said above, Auth0 is really, really freaking good. Everything about them just impressed me. Sign up was easy. They had a crap ton of samples, I mean, shoot, almost overwhelming in terms of sample code. One thing in particular I really freaking liked is that you can test social login and they will use their own apps until you specify your own. What I mean is - normally for social login you go to the site, make a new app, make note of the various IDs, go back to your code, copy them in, etc. etc. That's not hard of course, but it's boring. With Auth0, while testing only of course, you can just use their apps. I really dig that! Anyway, I hope to play with Auth0 a lot more in the future, and so far, I can definitely recommend it!