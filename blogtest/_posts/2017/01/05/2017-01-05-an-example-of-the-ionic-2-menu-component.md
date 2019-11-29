---
layout: post
title: "An example of the Ionic 2 Menu Component"
date: "2017-01-05T10:52:00-07:00"
categories: [mobile]
tags: [ionic]
banner_image: /images/banners/i2menu.jpg
permalink: /2017/01/05/an-example-of-the-ionic-2-menu-component
---

In general, I find components in Ionic 2 to be simpler and easier to understand than their V1 versions, but for some reason, I 
was *incredibly* confused by the docs for working with the [Menus](http://ionicframework.com/docs/v2/components/#menus) component. Documentation
exists of course, but it just didn't make sense to me. (I documented my problems in [this issue](https://github.com/driftyco/ionic-site/issues/951) for
folks curious.) What follows is my own understanding of how to work with menus in Ionic 2 and some basic things to keep in mind. As always, 
remember I'm still learning this myself, so keep in mind I may get a detail or two wrong.

Before we continue, a few links:

* First, the [main component doc](http://ionicframework.com/docs/v2/components/#menus).
* Then the related [API doc](http://ionicframework.com/docs/v2/api/components/menu/Menu).
* Finally, the [Sidemenu](https://github.com/driftyco/ionic2-starter-sidemenu) starter app. I did not use this when learning, and it does
a few things differently. I'll talk about that at the end.

Alright, so to begin, I created a new Ionic 2 app with the blank template:

	ionic start sidemenudemo blank --v2

This gave me a blank slate to begin by demo. In my demo, I want a site with three pages:

* A home page
* A cats page
* A dogs page

Out of the box you get a home page, so I used the CLI to generate the two other pages:

	ionic g page cats
	ionic g page dogs

If you weren't aware, the CLI has a [generate](http://ionicframework.com/docs/v2/cli/generate/) feature which can write boilerplate
code for you. I *highly* recommend using it.

Alright, so the first thing you have to do when working with a side menu is create a *new* page. (See my note at the bottom!) So given my app 
has three pages, I needed a fourth page to host the menu. I created a new one called main.

If you want my demo, you can find it here: https://github.com/cfjedimaster/Cordova-Examples/tree/master/sidemenudemo

	ionic g page main

Since my app starts with the side menu, I decided to make main my root page for the app. So my first modification was to app.component.ts:

<pre><code class="language-javascript">
import {% raw %}{ Component }{% endraw %} from &#x27;@angular&#x2F;core&#x27;;
import {% raw %}{ Platform }{% endraw %} from &#x27;ionic-angular&#x27;;
import {% raw %}{ StatusBar, Splashscreen }{% endraw %} from &#x27;ionic-native&#x27;;

import {% raw %}{ MainPage }{% endraw %} from &#x27;..&#x2F;pages&#x2F;main&#x2F;main&#x27;;

@Component({
  templateUrl: &#x27;app.html&#x27;
})
export class MyApp {
  rootPage = MainPage;

  constructor(platform: Platform) {
    platform.ready().then(() =&gt; {
      &#x2F;&#x2F; Okay, so the platform is ready and our plugins are available.
      &#x2F;&#x2F; Here you can do any higher level native things you might need.
      StatusBar.styleDefault();
      Splashscreen.hide();
    });
  }
}
</code></pre>

Essentially I just changed "Home" to "Main" in the import and the line where rootPage is set. So far so good. Now let's set up
the main page to have my menu. Here is main.html:

<pre><code class="language-markup">
&lt;ion-menu [content]=&quot;mycontent&quot;&gt;

	&lt;ion-content&gt;
		&lt;ion-list&gt;
			 &lt;button ion-item menuClose (click)=&quot;openPage(homePage)&quot;&gt;
				Home
			&lt;&#x2F;button&gt;
			&lt;button ion-item menuClose (click)=&quot;openPage(catsPage)&quot;&gt;
				Cats
			&lt;&#x2F;button&gt;
			&lt;button ion-item menuClose (click)=&quot;openPage(dogsPage)&quot;&gt;
				Dogs
			&lt;&#x2F;button&gt;
		&lt;&#x2F;ion-list&gt;
	&lt;&#x2F;ion-content&gt;

&lt;&#x2F;ion-menu&gt;

&lt;ion-nav #mycontent [root]=&quot;rootPage&quot;&gt;&lt;&#x2F;ion-nav&gt;
</code></pre>

There are a couple of very important things here to note. First let's start on line one:

<pre><code class="language-markup">
&lt;ion-menu [content]=&quot;mycontent&quot;&gt;
</code></pre>

The <code>[content]="mycontent"</code> aspect confused the heck out of me. All it really means though is this: "When I load crap, I want you to load it in this container." 
You'll notice at the bottom I've got an <code>ion-nav</code> component that uses the <code>#mycontent</code> identifier there. 

Now look at the menu code. Most of it is self-explanatory but I want to call out two things.

First, <code>menuClose</code> tells the menu to automatically close when a menu item is clicked. This is *not* the default, 
so most likely you will always want to add this.

Second, what's <code>openPage(x)</code> about? This is shown in the docs but not explained. Basically, you have to write the code
to load new pages. This is easy of course, but the docs don't spell this out for you. Going from Ionic 1, I didn't have to do this
because I simply used URLs I had already set routes up for. 

Here is my main.ts:

<pre><code class="language-javascript">
import {% raw %}{ Component }{% endraw %} from &#x27;@angular&#x2F;core&#x27;;
import {% raw %}{ NavController, NavParams }{% endraw %} from &#x27;ionic-angular&#x27;;
import {% raw %}{ HomePage }{% endraw %} from &#x27;..&#x2F;home&#x2F;home&#x27;;
import {% raw %}{ CatsPage }{% endraw %} from &#x27;..&#x2F;cats&#x2F;cats&#x27;;
import {% raw %}{ DogsPage }{% endraw %} from &#x27;..&#x2F;dogs&#x2F;dogs&#x27;;


@Component({
  selector: &#x27;page-main&#x27;,
  templateUrl: &#x27;main.html&#x27;
})
export class MainPage {

  private rootPage;
  private homePage;
  private catsPage;
  private dogsPage;

  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.rootPage = HomePage;

    this.homePage = HomePage;
    this.catsPage = CatsPage;
    this.dogsPage = DogsPage;

  }

  ionViewDidLoad() {
    console.log(&#x27;ionViewDidLoad MainPage&#x27;);
  }

  openPage(p) {
    this.rootPage = p;
  }

}
</code></pre>

As you can see, <code>openPage</code> is pretty simple. 

So that's it - but let me address one thing in particular when you compare my code to the [SideMenu](https://github.com/driftyco/ionic2-starter-sidemenu) 
starter. For the application I was working on (an existing Ionic 1 app migrating to Ionic 2), the menu loads *after* an initial
login screen. Therefore, using 4 pages (one for each page plus one for the menu) made sense. If you look at the SideMenu
template though, they modify the main app.html file that is the root of the Ionic app itself. It is the first page, and the core I guess you could
call it, so that made sense. If that's how your app starts up, I'd do that instead of creating another page as I've done here.