---
layout: post
title: "Is your Ionic View title not updating?"
date: "2015-12-18T15:21:11+06:00"
categories: [development,javascript,mobile]
tags: [ionic]
banner_image: 
permalink: /2015/12/18/is-your-ionic-view-title-not-updating
guid: 7277
---

Ok, so I run into this once a month or so. I'm writing this just so I can - hopefully - remember it this time. This isn't a bug or anything in Ionic - but I'm wondering if it should be documented a bit more clearly for people like me. (AKA old dense people.)

Alright - so given an Ionic app where templates are a dynamic title, this is not going to work:

<pre><code class="language-markup">
&lt;ion-view title=&quot;{% raw %}{{film.title]}{% endraw %}&quot;&gt;
    &lt;ion-content overflow-scroll=&quot;true&quot; padding=&quot;true&quot; class=&quot;has-header&quot;&gt;
        &lt;div&gt;
            &lt;p&gt;The opening crawl would go here.&lt;/p&gt;
        &lt;/div&gt;
    &lt;/ion-content&gt;
&lt;/ion-view&gt;
</code></pre>

Oddly - it will work sometimes - like if you happen to reload on that page itself - but not consistently. I'm sure there are Good(tm) reasons for this that make perfect sense, and I bet it revolves around Scope. I love Angular. Scope makes me want to push needles into my eyes though.

So how do you fix it? Switch to using <code>&lt;ion-nav-title&gt;</code>.

<pre><code class="language-markup">
&lt;ion-view&gt;
    &lt;ion-nav-title&gt;{% raw %}{{film.title}}{% endraw %}&lt;/ion-nav-title&gt;
    &lt;ion-content overflow-scroll=&quot;true&quot; padding=&quot;true&quot; class=&quot;has-header&quot;&gt;
        &lt;div&gt;
            &lt;p&gt;The opening crawl would go here.&lt;/p&gt;
        &lt;/div&gt;
    &lt;/ion-content&gt;
&lt;/ion-view&gt;
</code></pre>

As I said - this is documented. Kinda. The <a href="http://ionicframework.com/docs/api/directive/ionView/">docs for ion-view</a> say:

"A text-only title to display on the parent ionNavBar. For an HTML title, such as an image, see ionNavTitle instead."

But in my mind, {% raw %}{{film.title}}{% endraw %} resolves to "Foo" which is text only, so it should work. I looked at the <a href="http://ionicframework.com/docs/api/directive/ionNavTitle/">docs for ionNavTitle</a> too and nothing there really seems to make it obvious. Maybe the ionView docs should have a callout/note/etc about this situation? Like I said - I swear I hit this once a month - but admittedly my memory is crap and I tend to repeat mistakes all the time.

Thoughts?