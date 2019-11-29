---
layout: post
title: "Video example: collection-repeat performance in Ionic"
date: "2014-07-10T08:07:00+06:00"
categories: [html5,javascript,mobile]
tags: []
banner_image: 
permalink: /2014/07/10/Video-example-collectionrepeat-performance-in-Ionic
guid: 5262
---

<p>
If you follow me on Twitter, you know I've been raving about <a href="http://ionicframework.com/">Ionic</a> the past few weeks. I've played around with it a bit but haven't yet built a proper "sample" app. I still plan on doing so sometime soon. Today though I wanted to share a little experiment I built last night.
</p>
<!--more-->
<p>
One of the directives that ships with Ionic is the ability to build nicely formatted lists. If you create a sample Ionic application based on the Tabs starter application, you can see a nice example of this.
</p>

<p>
<img src="https://static.raymondcamden.com/images/Screen Shot 2014-07-10 at 6.15.58 AM1.png" />
</p>

<p>
I won't share all the code behind this as you can see it for yourself if you create a new application based on the Tabs app (<code>ionic start somename tabs</code>), but here is the view used to render that screen shot. Note that the data comes from a service (with static values) and everything is set up by an Angular controller.
</p>

<pre><code class="language-markup">&lt;ion-view title=&quot;Friends&quot;&gt;
  &lt;ion-content class=&quot;has-header&quot;&gt;
    &lt;ion-list&gt;
      &lt;ion-item ng-repeat=&quot;friend in friends&quot; type=&quot;item-text-wrap&quot; href=&quot;#&#x2F;tab&#x2F;friend&#x2F;{% raw %}{{friend.id}}{% endraw %}&quot;&gt;
        {% raw %}{{friend.name}}{% endraw %}
      &lt;&#x2F;ion-item&gt;
    &lt;&#x2F;ion-list&gt;
  &lt;&#x2F;ion-content&gt;
&lt;&#x2F;ion-view&gt;</code></pre>

<p>
Nice and simple, right? This is why I'm really digging Angular lately. While this works, one of the issues you run into is performance if your list is large. Of course, "large" is relative. But if you were to go from a list of a few friends to a few thousand, you will see performance degrade due to the size of the DOM being rendered. 
</p>

<p>
Turns out - the devs at Ionic have a solution for it. By making use of <a href="http://ionicframework.com/docs/api/directive/collectionRepeat/">collectionRepeat</a>, you get an updated list directive that smartly handles large lists. It can dynamically add to and remove from the DOM based on what is actually visible and has <i>much</i> better performance for larger lists.
</p>

<p>
It isn't just a simple code change. If you read the <a href="http://ionicframework.com/docs/api/directive/collectionRepeat/">docs</a> for it you will note some things you have to take care of versus the simpler list control, but it isn't that difficult. I modified one of the tabs to make use of it like so:
</p>

<pre><code class="language-markup">&lt;ion-view title=&quot;Account&quot;&gt;
  &lt;ion-content class=&quot;has-header&quot;&gt;
    &lt;ion-list&gt;
      &lt;ion-item collection-repeat=&quot;friend in friends&quot;
      			collection-item-width=&quot;&#x27;100%&#x27;&quot;
      			collection-item-height=&quot;80&quot;&gt;
      			{% raw %}{{friend.name}}{% endraw %}
      &lt;&#x2F;ion-item&gt;
    &lt;&#x2F;ion-list&gt;
  &lt;&#x2F;ion-content&gt;&lt;&#x2F;ion-view&gt;</code></pre>

<p>
I should point out - this is <strong>not</strong> an exact replacement. As you'll see in a second, the UI is different. I could have fixed that but I was just interested in seeing the actual performance difference. I went into the service file for the app and modified it to add a bit more data:
</p>

<pre><code class="language-javascript">angular.module(&#x27;starter.services&#x27;, [])

&#x2F;**
 * A simple example service that returns some data.
 *&#x2F;
.factory(&#x27;Friends&#x27;, function() {
  &#x2F;&#x2F; Might use a resource here that returns a JSON array

  &#x2F;&#x2F; Some fake testing data
  var friends = [
    {% raw %}{ id: 0, name: &#x27;Scruff McGruff&#x27; }{% endraw %},
    {% raw %}{ id: 1, name: &#x27;G.I. Joe&#x27; }{% endraw %},
    {% raw %}{ id: 2, name: &#x27;Miss Frizzle&#x27; }{% endraw %},
    {% raw %}{ id: 3, name: &#x27;Ash Ketchum&#x27; }{% endraw %}
  ];

  &#x2F;&#x2F;let&#x27;s blow the shit out of this...
  for(var i=0;i&lt;20000;i++) {
    friends.push({% raw %}{id:i+4, name:&quot;Person &quot;+i}{% endraw %});
  }
  
  return {
    all: function() {
      return friends;
    },
    get: function(friendId) {
      &#x2F;&#x2F; Simple index lookup
      return friends[friendId];
    }
  }
});
</code></pre>

<p>
Not very realistic, but you get the idea. We've gone from 4 items to 2004. So what was the difference? Instance access to the list instead of about 5 seconds of waiting. See the video below for an example.
</p>

<iframe width="420" height="315" src="//www.youtube.com/embed/_csla21rNpA?rel=0" frameborder="0" allowfullscreen></iframe>

<p>
That's pretty significant if you ask me. For the heck of it, I tried 200K rows as well and it performed just as well. Speaking to one of the devs last night, the only real issue you have with this control is the amount of memory the actual data is holding, not the rendering. 
</p>

<p>
In case you were wondering if Ionic is "just another UI" library, this is a great example of why it is <i>so</i> much more than that. Definitely check it out!
</p>