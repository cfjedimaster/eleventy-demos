---
layout: post
title: "An Ionic 1 and 2 app side by side"
date: "2016-06-30T05:59:00-07:00"
categories: [javascript,mobile]
tags: [ionic]
banner_image: 
permalink: /2016/06/30/an-ionic-1-and-2-app-side-by-side
---

Yesterday I gave a presentation to the [Ionic NYC Meetup](https://www.raymondcamden.com/tags/cordova/) (a damn nice group of people!) and needed to quickly build a pretty simple Ionic app to speak to a LoopBack server. Because I wanted something quick and dirty, I just whipped up an Ionic 1 application. I wrapped it earlier than expected, so decided to see if I could switch it to Ionic 2 before the presentation. I was able to finish it, and I thought it might be kind of cool to compare both versions. To be clear, I'm not offering up *either* app as a "Model" Ionic application, but since they do the *exact* same thing, I thought it would be cool to share as a comparison. Both code bases are up on GitHub (I'll share the link at the end) so you can download and run for yourself if you want.

So before we begin - let me describe the app. It has a grand total of two screens. The first screen is a list of cats fetched by the LoopBack-powered API. The second screen is a detail page for the cat. And yeah, that's it. As I said, this isn't a terribly complex app. 

Let's begin by comparing the initial page for version 1 and version 2. In version 1, this is index.html:

<pre><code class="language-javascript">
&lt;!DOCTYPE html&gt;
&lt;html&gt;
  &lt;head&gt;
    &lt;meta charset=&quot;utf-8&quot;&gt;
    &lt;meta name=&quot;viewport&quot; content=&quot;initial-scale=1, maximum-scale=1, user-scalable=no, width=device-width&quot;&gt;
    &lt;title&gt;&lt;/title&gt;

    &lt;link href=&quot;lib/ionic/css/ionic.css&quot; rel=&quot;stylesheet&quot;&gt;
    &lt;link href=&quot;css/style.css&quot; rel=&quot;stylesheet&quot;&gt;

    &lt;script src=&quot;lib/ionic/js/ionic.bundle.js&quot;&gt;&lt;/script&gt;

    &lt;script src=&quot;cordova.js&quot;&gt;&lt;/script&gt;

    &lt;script src=&quot;js/app.js&quot;&gt;&lt;/script&gt;
    &lt;script src=&quot;js/controllers.js&quot;&gt;&lt;/script&gt;
    &lt;script src=&quot;js/services.js&quot;&gt;&lt;/script&gt;

  &lt;/head&gt;
  &lt;body ng-app=&quot;starter&quot;&gt;

    &lt;ion-nav-bar class=&quot;bar-royal&quot;&gt;
		  &lt;ion-nav-back-button&gt;Back&lt;/ion-nav-back-button&gt;
    &lt;/ion-nav-bar&gt;

    &lt;ion-nav-view&gt;&lt;/ion-nav-view&gt;

  &lt;/body&gt;
&lt;/html&gt;
</code></pre>

Let me focus on what I modified. First, I've got three different JavaScript files. One covers the main application logic (app.js), one the controllers for my views (controllers.js), and one for my services (services.js). Also note I've a nav-bar and nav-view defined here. Ionic is going to replace these items on the fly with each particular view. 

Ok, on the Ionic V2 side, technically we have an index.html, but generally you don't (I believe) modify it. Rather I think the closest analog is app.ts:

<pre><code class="language-javascript">
import {% raw %}{Component}{% endraw %} from '@angular/core';
import {% raw %}{Platform, ionicBootstrap}{% endraw %} from 'ionic-angular';
import {% raw %}{StatusBar}{% endraw %} from 'ionic-native';
import {% raw %}{HomePage}{% endraw %} from './pages/home/home';


@Component({
  template: '&lt;ion-nav [root]="rootPage"&gt;&lt;/ion-nav&gt;'
})
export class MyApp {
  rootPage: any = HomePage;

  constructor(platform: Platform) {
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      StatusBar.styleDefault();
    });
  }
}

ionicBootstrap(MyApp);
</code></pre>

Pretty much the only modification I need to ever worry about here is telling it what my first page is and then setting it as the rootPage. Ok, I dig this so far. I don't know if it is necessarily fair to see v1's index.html is equivalent to v2's app.ts, but I'm going with it for now. 

Now let's compare the first view. In V1, this is driven by a few different files. I've got a view (partials/home.html) and the controller (js/controllers.js). My view is singularly focused on the home page, but my controllers file actually has code for all the controllers in the app. Ok, first the view:

<pre><code class="language-javascript">
&lt;ion-view title=&quot;Cat List&quot;&gt;

	&lt;ion-content class=&quot;padding&quot;&gt;

		&lt;ion-list class=&quot;list list-inset&quot;&gt;

			&lt;ion-item ng-repeat=&quot;cat in cats&quot; href=&quot;#/cat/{% raw %}{{cat.id}}{% endraw %}&quot;&gt;
				{% raw %}{{cat.name}}{% endraw %}
			&lt;/ion-item&gt;

		&lt;/ion-list&gt;

	&lt;/ion-content&gt;

&lt;/ion-view&gt;
</code></pre>

And the controller:

<pre><code class="language-javascript">
.controller('HomeCtrl', ['$scope', 'CatService', function($scope, catService) {

	catService.getCats().success(function(cats) {
		$scope.cats = cats;
	});

}])
</code></pre>

We're going to skip the service until later in the post. Now let's compare this to V2. Right away, one thing cooler is that my view (pages/home/home.html) and JS code (pages/home/home.ts) are contained within one folder. I could have built my V1 code like that, but I love that V2 kinda forces the organization. Here's the view:

<pre><code class="language-javascript">
&lt;ion-header&gt;
  &lt;ion-navbar&gt;
    &lt;ion-title&gt;
      Cats
    &lt;/ion-title&gt;
  &lt;/ion-navbar&gt;
&lt;/ion-header&gt;

&lt;ion-content class=&quot;home&quot; padding&gt;

  &lt;ion-list inset&gt;
    &lt;ion-item *ngFor=&quot;let cat of cats&quot; (click)=&quot;selectCat(cat)&quot;&gt;
      {% raw %}{{cat.name}}{% endraw %}
    &lt;/ion-item&gt;
  &lt;/ion-list&gt;
&lt;/ion-content&gt;
</code></pre>

And the code:

<pre><code class="language-javascript">
import {% raw %}{Component}{% endraw %} from '@angular/core';
import {% raw %}{NavController}{% endraw %} from 'ionic-angular';
import {% raw %}{CatProvider}{% endraw %} from '../../providers/cat-provider/cat-provider';
import {% raw %}{CatPage}{% endraw %} from '../cat/cat';

@Component({
  providers:[CatProvider],
  templateUrl: 'build/pages/home/home.html'
})
export class HomePage {

  public cats:Array&lt;Object&gt;;

  constructor(private navController: NavController, public catProvider:CatProvider) {

    this.catProvider.load().subscribe(result =&gt; {
        this.cats = result;
    });

  }

  selectCat(cat) {
    this.navController.push(CatPage, {% raw %}{id:cat.id}{% endraw %});
  }

}
</code></pre>

One thing I want to point out - notice how in V2 I handle my navigation. This was handled in V1 in app.js via the routing system. V2's simpler navigation API is a heck of a lot easier (imo, obviously) than the URL-based routing in Angular 1. 

Ok, let's move on the detail view. Here is the view in V1:

<pre><code class="language-javascript">
&lt;ion-view&gt;

	&lt;ion-nav-title&gt;Cat: {% raw %}{{cat.name}}{% endraw %}&lt;/ion-nav-title&gt;

	&lt;ion-content class=&quot;padding&quot;&gt;

		&lt;div class=&quot;card&quot;&gt;
			&lt;div class=&quot;item item-divider&quot;&gt;
			{% raw %}{{cat.name}}{% endraw %}
			&lt;/div&gt;
			&lt;div class=&quot;item item-text-wrap&quot;&gt;
				&lt;p&gt;
				{% raw %}{{cat.name}}{% endraw %} is {% raw %}{{cat.age}}{% endraw %} years old with a {% raw %}{{cat.color}}{% endraw %} color and is 
				&lt;span ng-if=&quot;!cat.friendly&quot;&gt;not&lt;/span&gt; friendly.
				&lt;/p&gt;

				&lt;img ng-src=&quot;{% raw %}{{cat.image}}{% endraw %}&quot;&gt;

			&lt;/div&gt;
		&lt;/div&gt;

	&lt;/ion-content&gt;

&lt;/ion-view&gt;
</code></pre>

All fairly simple. And here is the corresponding code from controllers.js:

<pre><code class="language-javascript">
.controller('CatCtrl', ['$scope', '$stateParams', 'CatService', function($scope, $stateParams, catService) {

	catService.getCat($stateParams.catid).success(function(cat) {
		$scope.cat = cat;
	});

}]);
</code></pre>

Alright, now let's look at V2. First the view:

<pre><code class="language-javascript">
&lt;ion-header&gt;

  &lt;ion-navbar&gt;
    &lt;ion-title&gt;Cat: {% raw %}{{cat.name}}{% endraw %}&lt;/ion-title&gt;
  &lt;/ion-navbar&gt;

&lt;/ion-header&gt;

&lt;ion-content padding&gt;

  &lt;ion-card&gt;
    &lt;ion-card-header&gt;{% raw %}{{cat.name}}{% endraw %}&lt;/ion-card-header&gt;
    &lt;ion-card-content&gt;
				&lt;p&gt;
				{% raw %}{{cat.name}}{% endraw %} is {% raw %}{{cat.age}}{% endraw %} years old with a {% raw %}{{cat.color}}{% endraw %} color and is 
				&lt;span *ngIf=&quot;!cat.friendly&quot;&gt;not&lt;/span&gt; friendly.
				&lt;/p&gt;

        &lt;span *ngIf=&quot;cat.image&quot;&gt;
          &lt;img [src]=&quot;cat.image&quot; style=&quot;max-width:500px;&quot;&gt;
        &lt;/span&gt;

    &lt;/ion-card-content&gt;
  &lt;/ion-card&gt;

&lt;/ion-content&gt;
</code></pre>

And the corresponding JavaScript:

<pre><code class="language-javascript">
import {% raw %}{ Component }{% endraw %} from '@angular/core';
import {% raw %}{ NavController,NavParams }{% endraw %} from 'ionic-angular';
import {% raw %}{CatProvider}{% endraw %} from '../../providers/cat-provider/cat-provider';

@Component({
  providers:[CatProvider],
  templateUrl: 'build/pages/cat/cat.html',
})
export class CatPage {

  public cat:Object = {% raw %}{name:""}{% endraw %};

  constructor(private nav: NavController, private params:NavParams, public catProvider:CatProvider) {
    this.catProvider.get(params.data.id).subscribe(result =&gt; {
        this.cat = result;
    });
  
  }

}
</code></pre>

Alright - so the last bits to compare are the service. While they do virtually the same thing, they're written pretty darn differently. Here is the service in V1:

<pre><code class="language-javascript">
angular.module('appServices', [])
.factory('CatService', function($http,$q) {

	return {
		getCat:function(id) {
			return $http.get('http://localhost:3000/api/cats/'+id);
		},
		getCats:function() {
			return $http.get('http://localhost:3000/api/cats?filter[fields][color]=false&filter[fields][age]=false&filter[fields][friendly]=false');
		}
	};

});
</code></pre>

And this is version 2:

<pre><code class="language-javascript">
import {% raw %}{ Injectable }{% endraw %} from '@angular/core';
import {% raw %}{ Http }{% endraw %} from '@angular/http';
import 'rxjs/add/operator/map';

@Injectable()
export class CatProvider {

  constructor(private http: Http) {
  }

  get(id) {

    return this.http.get('http://localhost:3000/api/cats/'+id)
    .map(res => res.json())

  }

  load() {

    return this.http.get('http://localhost:3000/api/cats?filter[fields][color]=false&filter[fields][age]=false&filter[fields][friendly]=false')
    .map(res => res.json())

  }
}
</code></pre>

Alright so that's it. As I said - not the most complex apps, but I like having two such similar apps in both v1 and v2. Makes the differences really stand out. 

You can see the full code yourself here: [https://github.com/cfjedimaster/Cordova-Examples/tree/master/v1andv2](https://github.com/cfjedimaster/Cordova-Examples/tree/master/v1andv2)

Now that I've done a few v2 apps, and just had a chance to compare them, here are some random thoughts, in no particular order.

<ul>
<li>I love the organization of Ionic V2 apps. Currently my V1 apps typically have one big controller and one big service file. All my templates are in a views folder. In V2, everything is contained within it's own individual folder. To be clear, I absolutely could build my Angular 1 apps this way. But I like that Ionic forces (strongly leads) me into a cleaner (imo) organization.</li>
<li>Ionic's <a href="http://ionicframework.com/docs/v2/cli/generate/"><code>generate</code></a> CLI commands are a huge time saver. Be sure you make use of it when playing around - it saves a lot of boilerplate work.
<li>I'm still not digging the big new "Observables" feature, and yes yes, I know, they are the new hotness, rah rah rah. I get it. I just don't like em yet. They feel really weird and awkward. To be fair, I felt the *exact* same way about Promises, and shoot, I feel like I just got comfortable using them and now we have this new thing. I'm whining - I admit it - but so far this is the only thing about V2 (specifically, Angular 2) that I'm not terribly happy about. Yet.
<li>On the other hand, even though I'm finding a lot of Angular 2 a bit hard to get used to, like (click) and *ngFor, they are slowly making more and more sense and I'm digging those changes more and more as well. As I told someone at the Meetup last night - it's frustrating - but enjoyable at the same time!
<li>I'm also finding TypeScript a bit difficult at times, but I'm loving it too. 
</ul>