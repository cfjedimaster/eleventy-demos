---
layout: post
title: "Time for Angular 2?"
date: "2016-01-18T12:32:12+06:00"
categories: [development,javascript]
tags: []
banner_image: 
permalink: /2016/01/18/time-for-angular-2
guid: 7398
---

<img src="https://static.raymondcamden.com/images/wp-content/uploads/2016/01/angular.png" alt="angular" width="200" height="200" class="alignleft size-full wp-image-7400" /> I've been avoiding even <i>thinking</i> about the latest rev of Angular as every time I <strong>did</strong> look at it, I came away with a headache. It was weird and the docs were even weirder. I saw plenty of blog posts on the topic, but in general they dealt with one small slice of Angular 2 and were too confusing for me to grok. 

Over the holidays, I checked out the web site again (Angular 2 can be found at <a href="https://angular.io/">https://angular.io/</a> whereas Angular 1 is still at the old site: <a href="https://angularjs.org/">https://angularjs.org/</a>). I tried the <a href="https://angular.io/docs/ts/latest/quickstart.html">five minute quick start</a> and while it took me a bit more than five minutes, it made a bit of sense. It certainly wasn't crystal clear to me, but it wasn't crazy either. 

<!--more-->

I then went through the <a href="https://angular.io/docs/ts/latest/tutorial/">tutorials</a> and things began to make even more sense. I'm far from being even close to being able to build a demo with it, but the basics are beginning to click for me.

There were three things in particular I ran into that caused me grief.

1) Working with Angular 2 means working with TypeScript. I like TypeScript. But I'm kinda disappointed that working with Angular now means working with a build system to get it into the browser. To be absolutely clear, I'm not saying this is bad. I'm just saying I feel a bit disappointed that this is required now. I'll get over it.

2) The @Component stuff was terribly confusing to me until it finally sank in that those blocks are providing metadata to the classes. It seems so obvious now, but I just couldn't understand what in the heck stuff like this was doing:

<pre><code class="language-javascript">
import {% raw %}{Component}{% endraw %} from 'angular2/core';

@Component({
    selector: 'my-app',
    template: '<h1>My First Angular 2 App</h1>'
})
export class AppComponent {% raw %}{ }{% endraw %}
</code></pre>

3) One thing I really didn't like in Angular 2 was all the different types of "syntax sugar" being used in templates. Here are just a few examples: <code>[(ngModel)]="foo.name"</code> and <code>*ngFor</code> and <code>(click)="something"</code>. I figured there was no way in heck I'd be able to get that right. Luckily - there's a great <a href="https://angular.io/cheatsheet">cheat sheet</a> that nicely documents all this and is easy to use.

So what's next? I plan on making my way - slowly - through the rest of the docs. I'm also going to reread the tutorials a few times. I then need to make the time to look at <a href="http://ionicframework.com/docs/v2/getting-started/installation/">Ionic 2</a>. 

For a while now I've been telling people that - at least in my opinion - it was too early to start playing with Angular 2. Now I definitely feel like it would be a great time to start playing with it and - possibly - even building real apps with it. I'd love to know what my readers think so leave a comment below. Are you using Angular 2 yet or have you been holding off?