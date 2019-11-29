---
layout: post
title: "Creating a Serverless Meetup API Wrapper"
date: "2017-07-17T10:58:00-07:00"
categories: [serverless]
tags: [openwhisk]
banner_image: 
permalink: /2017/07/17/creating-a-serverless-meetup-api-wrapper
---

Yesterday I was doing some research into serverless meetups when I encountered something that bugged me about the [Meetup.com](https://www.meetup.com) web site. Specifically, this:

![Login to search because...](https://static.raymondcamden.com/images/2017/7/meetup1.png)

I couldn't search for meetups until I logged in. Now, don't get me wrong, I've got a Meetup.com login, and I could have logged in in about 2 seconds, but this really bugged me. (As an aside, you can just go to https://www.meetup.com/find/events/ to skip being forced to log in.)

Even after logging in, I didn't like that I had to explicitly tell the form to not care about distance in order to find groups across the country:

![Search](https://static.raymondcamden.com/images/2017/7/meetup2.jpg)

In this case, their defaults I think make sense. As an evangelist, I'm looking for meetups I can speak at (hey, by the way, I'd love to speak at yours!), so my use case is *not* the norm. But I was also a bit bugged by the fact that I couldn't limit my searches to America.

Therefore - I decided to do what any good developer would do - spend 10x as much time writing my own solution versus just dealing with what was given to me!

I knew Meetup had an [API](https://www.meetup.com/meetup_api/) and I blogged on it a few years ago ([Using the Meetup API in Client-Side Applications](https://www.raymondcamden.com/2015/11/20/using-the-meetup-api-in-client-side-applications/)), so I figured this would be a great example of how I could use serverless, and OpenWhisk in particular, to build my own API wrapper around their data to build my own tool.

For my wrapper, I decided to build an interface to their [Find Groups](https://www.meetup.com/meetup_api/docs/find/groups/) end point. (By the way, since I complained a bit about their UI I want to point out one thing they do very nicely - not forcing me to login to read API docs!) 

Here is the action I created to wrap their API. 

<pre><code class="language-javascript">const rp = require(&#x27;request-promise&#x27;);

function main(args) {

    return new Promise((resolve, reject) =&gt; {
        
        let url = &#x27;https:&#x2F;&#x2F;api.meetup.com&#x2F;find&#x2F;groups?key=&#x27;+args.key;

        if(args.category) url += &#x27;&amp;category=&#x27;+args.category;
        if(args.country) url += &#x27;&amp;country=&#x27;+args.country;
        if(args.fallback_suggestions) url += &#x27;&amp;fallback_suggestions=&#x27;+args.fallback_suggestions;
        if(args.fields) url += &#x27;&amp;fields=&#x27;+args.fields;
        &#x2F;&#x2F;skipping filter
        if(args.lat) url += &#x27;&amp;lat=&#x27;+args.lat;
        if(args.lon) url += &#x27;&amp;lon=&#x27;+args.lon;
        if(args.location) url += &#x27;&amp;location=&#x27;+args.location;
        if(args.radius) url += &#x27;&amp;radius=&#x27;+args.radius;
        &#x2F;&#x2F;skipping self_groups
        if(args.text) url += &#x27;&amp;text=&#x27;+encodeURIComponent(args.text);
        if(args.topic_id) url += &#x27;&amp;topic_id=&#x27;+args.topic_id;
        if(args.upcoming_events) url += &#x27;&amp;upcoming_events=&#x27;+args.upcoming_events;
        if(args.zip) url += &#x27;&amp;zip=&#x27;+args.zip;

        if(args.only) url += &#x27;&amp;only=&#x27;+args.only;
        if(args.omit) url += &#x27;&amp;omit=&#x27;+args.omit;

        &#x2F;*
        Note to self: I modified the code to return the full
        response so I could potentially do paging. I decided 
        against that for now, but I&#x27;m keeping resolveWithFullResponse
        in for the time being.
        *&#x2F;
        let options = {
            url:url, 
            json:true,
            resolveWithFullResponse: true
        };

        rp(options).then((resp) =&gt; {
            &#x2F;&#x2F;console.log(resp.headers);
            &#x2F;*
            When using radius=global and a country, the country filter doesn&#x27;t
            quite work. SO let&#x27;s fix that.
            *&#x2F;
            let items = resp.body;
            console.log(&#x27;country=&#x27;+args.country+&#x27; radius=&#x27;+args.radius);
            if(args.country &amp;&amp; args.country !== &#x27;&#x27; &amp;&amp; args.radius === &#x27;global&#x27;) {
                console.log(&#x27;Doing post filter on country&#x27;);
                items = items.filter((item) =&gt; {
                    return (item.country === args.country);
                });
            }
            resolve({% raw %}{result:items}{% endraw %});
        }).catch((err) =&gt; {
            reject({% raw %}{error:err}{% endraw %});
        });

    });

}
</code></pre>

For the most part, this is simply building a URL based on arguments. I'm not doing any validation since the API will do that for me. I'm also not doing any pagination since in my testing, I got over 100 results. I couldn't find docs on how many max results they would return and I did do a bit of "prep work" for adding support in the future, but for now, it will return at least 170 or so results in my testing. 

Note that the action expects an argument for the key. I set that as a default action parameter so I don't have to include it in my own calls.

The only real interesting part is the manipulation I do for "country". While the Meetup API has a country argument, it seems to ignore it when you set the radius argument to global. So basically, I can't say "Don't care about distance from my home but keep it to America." Therefore I do my own filtering on the results after fetching them.

This is a great example (imo) of where serverless wrappers can be so useful. I took an existing API and built my own to address the shortcomings (or at least *my* perceived shortcomings) of it. 

And that was it - literally. I "web" enabled it and my API was done. I then built the front end. I'm not going to bore you with my HTML and CSS. You can run the demo yourself here: https://cfjedimaster.github.io/Serverless-Examples/meetup/client/

In case you don't want to, here's an example of the output:

<img src="https://static.raymondcamden.com/images/2017/7/meetup3.jpg" class="imgborder">

Yeah, not necessarily the prettiest demo in the world, but it did give me a chance to finally try Flexbox. I have an idea for a nicer version I'm going to try to get out the door this week, but we'll see. The JavaScript code behind this is relatively simple. It's 99% DOM manipulation to be honest.

<pre><code class="language-javascript">const api = &#x27;https:&#x2F;&#x2F;openwhisk.ng.bluemix.net&#x2F;api&#x2F;v1&#x2F;web&#x2F;ray@camdenfamily.com_dev&#x2F;meetup&#x2F;search.json?radius=global&amp;category=34&amp;omit=description,organizer,category,urlname,score&amp;country=US&#x27;;

let $keyword, $submitBtn, $resultItems;

$(document).ready(function() {

    $(&#x27;#searchForm&#x27;).on(&#x27;submit&#x27;, doSearch);
    $keyword = $(&#x27;#search&#x27;);
    $submitBtn = $(&#x27;#submitBtn&#x27;);
    $resultItems = $(&#x27;#resultItems&#x27;);

});

function doSearch(e) {
    e.preventDefault();
    $resultItems.html(&#x27;&#x27;);

    console.log(&#x27;Ok, search against Meetup&#x27;);
    let keyword = $keyword.val();
    console.log(keyword);

    &#x2F;&#x2F;todo: leave if no search

    $submitBtn.attr(&#x27;disabled&#x27;,&#x27;disabled&#x27;);
    let url = api + &#x27;&amp;text=&#x27;+encodeURIComponent(keyword);
    $resultItems.html(&#x27;&lt;i&gt;Searching...&lt;&#x2F;i&gt;&#x27;);

    $.get(url).then((resp) =&gt; {
        $submitBtn.removeAttr(&#x27;disabled&#x27;);
        console.log(resp);
        if(resp.result.length === 0) {
            $resultItems.html(&#x27;&lt;p&gt;Sorry, but there were no results.&lt;&#x2F;p&gt;&#x27;);
            return;
        }
        let s = `&lt;p&gt;I found ${% raw %}{resp.result.length}{% endraw %} match(es).&lt;&#x2F;p&gt;`;
        resp.result.forEach((item) =&gt; {
            let itemHtml = `
&lt;h2&gt;${% raw %}{item.name}{% endraw %}&lt;&#x2F;h2&gt;
&lt;p&gt;
&lt;a href=&quot;${% raw %}{item.link}{% endraw %}#&quot; target=&quot;_new&quot;&gt;${% raw %}{item.link}{% endraw %}&lt;&#x2F;a&gt;&lt;br&#x2F;&gt;
Members: ${% raw %}{item.members}{% endraw %}&lt;br&#x2F;&gt;
Address: ${% raw %}{item.city}{% endraw %}, ${% raw %}{item.state}{% endraw %}
&lt;&#x2F;p&gt;
            `;
            s += itemHtml;
            console.dir(item);
        });
        $resultItems.html(s);
    });
}
</code></pre>

You'll notice my URL constant on top sets up a bunch of defaults and when the actual search is performed, I'm just adding a keyword. 

So what do you think? If you want to see the code for yourself, you can find it here: https://github.com/cfjedimaster/Serverless-Examples/tree/master/meetup

The "action" folder contains my action code (one file) and "client" contains the client-side application that uses the API on OpenWhisk.