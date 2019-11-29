---
layout: post
title: "POC - Determining the \"Health\" of your GitHub Repos"
date: "2015-02-23T13:57:34+06:00"
categories: [development]
tags: []
banner_image: 
permalink: /2015/02/23/poc-determining-the-health-of-your-github-repos
guid: 5724
---

I hinted about this in my <a href="http://www.raymondcamden.com/2015/02/22/static-site-hosting-on-google-cloud">blog post</a> last night, but I've been working on a proof of concept application meant to judge the relative "health" of your GitHub repositories. 

<!--more-->

My idea was that there are various things we could check within a repository to judge how well it is being maintained. Things like the age of the last update, number of open bugs, etc. Obviously there is no way to fully automate this type of scan, but I wanted to give it a shot and see if I could learn anything interesting.

I was initially going to build it in Node.js so I could OAuth against the GitHub API, but I decided I'd give <a href="http://adodson.com/hello.js/">hello.js</a> a try. hello.js provided a client-side method of doing OAuth against a variety of services. In some cases it uses an app proxy on its own server and you have to do a bit of registration beforehand, but for the most part, it worked pretty well. As an example, this hits the GitHub API to read the current user's repositories.

<pre><code class="language-javascript">hello('github').api("/users/repos",{% raw %}{"type":"owner"}{% endraw %}).then( function(r) {
    console.log("repos", r);
});</code></pre>

In my application, I built a simple function that looped over your repos and added each one to a global array.

<pre><code class="language-javascript">function startFetchingRepositories(path) {
    if(!path) path = '/user/repos';
    console.log('fetching repos with '+path);
    hello('github').api(path,{% raw %}{"type":"owner"}{% endraw %}).then( function(r){
        Array.prototype.push.apply(repos, r.data);
        console.dir(r.data[0]);
        if(r.paging && r.paging.next) {
            startFetchingRepositories(r.paging.next);   
        } else {
            displayRepos();   
        }
    });

}</code></pre>

This is called <i>after</i> the authorization is complete which is also fairly easy in the hello.js library:

<pre><code class="language-javascript">hello('github').login();</code></pre>

Yeah, that's it. You tie this with an event handler as well:

<pre><code class="language-javascript">hello.on('auth.login', function() {% raw %}{ ...}{% endraw %});</code></pre>

So... ok. That part didn't take too much time. The next part was actually figuring out how to determine the health of a repo. I decided to start simple - I'd check the age of the last update and the number of open issues - which luckily is part of the repository object information.

<pre><code class="language-javascript">&#x2F;*
I take in a data object (right now it&#x27;s the crap I&#x27;m sending to the template, not the full github

I&#x27;m a bootstrap class representing how &#x27;bad&#x27; the repo is
range from bad to good is: danger (red), warning (yellow), default(gray), info (blue), success (green)
I didn&#x27;t do primary, too bright
*&#x2F;
function determineLevel(data) {
    &#x2F;&#x2F;points are bad. you don&#x27;t want points
    var points = 0;
    
    &#x2F;&#x2F;First rule, check age
    if(data.lastago &gt; 360) {
        points += 7;
    } else if(data.lastago &gt; 160) {
        points += 5;
    } else if(data.lastago &gt; 120) {
        points += 3;
    } else if(data.lastago &gt; 60) {
        points += 1;
    }

    &#x2F;&#x2F;check open issues
    if(data.open_issues_count &gt; 50) {
        points += 4;
    } else if(data.open_issues_count &gt; 25) {
        points += 2;
    } else if(data.open_issues_count &gt; 10) {
        points += 1;   
    }
    
    switch(points) {
        case 0: return &quot;success&quot;;
        case 1:
        case 2: return &quot;info&quot;;
        case 3:
        case 4: return &quot;default&quot;;
        case 5:
        case 6: return &quot;warning&quot;;
        default: return &quot;danger&quot;;    
    }
    
}</code></pre>

As you can see - I simply apply some arbitrary points based on how bad I think certain values are. I spent some time trying to figure out how many points certain things should get, but, then I said screw it. Let me ship this first version and let smarter folks then I figure it out.

To display everything, I just used Bootstrap. Why? Because. 

<a href="http://www.raymondcamden.com/wp-content/uploads/2015/02/shot.png"><img src="https://static.raymondcamden.com/images/wp-content/uploads/2015/02/shot.png" alt="shot" width="850" height="694" class="alignnone size-full wp-image-5725" /></a>

Want to see the full source code - and help make it better? It's up (of course) on GitHub: <a href="https://github.com/cfjedimaster/githubhealth">https://github.com/cfjedimaster/githubhealth</a>. 

Want to run it yourself? You can see it in action here: <a href="https://static.raymondcamden.com/githubhealth">https://static.raymondcamden.com/githubhealth</a>.

As always, I'm curious to know what you think. Is this helpful? Should I keep hacking away at it?