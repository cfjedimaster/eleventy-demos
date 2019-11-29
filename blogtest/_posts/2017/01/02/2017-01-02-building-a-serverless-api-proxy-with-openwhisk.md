---
layout: post
title: "Building a Serverless API Proxy with OpenWhisk"
date: "2017-01-02T08:11:00-07:00"
categories: [serverless]
tags: [openwhisk]
banner_image: /images/banners/apiproxy.jpg
permalink: /2017/01/02/building-a-serverless-api-proxy-with-openwhisk
---

One of the more common tasks we do with a server-side application is to build a simple API proxy. By that I mean we expose an API on our server that simply proxies to *another* remote server. Why might you do that when you can easily call APIs client-side with JavaScript?

* The remote API may require a key. Including your key in your JavaScript code means it is exposed to the public and can be used by others, potentially locking you out of the API or running up your charges.
* The remote API may return data in a undeseriable format, like XML. 
* The remote API may return data you don't need, resulting in a slower response that includes data you won't ever use.
* The remote API may work with data that doesn't need updating often. Your server can then add it's own caching layer.
* The remote API may go down. By having your own entry point, you could handle this in multiple ways, with either static data or some other result that won't completely break the clients.
* Finally, the remote API may get bought by some large company (perhaps one that rhymes with MaceLook) and be shut down. You could replace the remote API completely and your clients will never know.

For all these reasons and more, it may make sense to build a simple server for your web apps and point your code to your API proxy instead of directly at the remote server. While this would be rather trivial with Node.js, I thought it might be a great use case for serverless as well, especially with me just discovering how awesome [OpenWhisk](https://developer.ibm.com/openwhisk/) is. (See my post from last year: ["Going Serverless with OpenWhisk"](https://www.raymondcamden.com/2016/12/23/going-serverless-with-openwhisk))

For my API, I decided to use the [Cat API](http://thecatapi.com/). The Cat API returns random pictures of cats. It lets you filter by categories, vote on cats, and more. While it doesn't *require* an API key, but if you don't pass one, you are limited to a set of only 1000 cats, which as we all know is far too few. Also, it returns XML. Which is gross, but I'll forgive them anyway since we're still talking about cats here.

I'm going to assume you read my earlier post, but just in case you didn't, here is a quick overview of how OpenWhisk works. You download a command line program (technically this is optional), write your action (a program that does one thing), and then deploy it to OpenWhisk. The final step is to expose the action via a REST API. Nice and simple, right?

For my testing, I decided to build two actions:

* The first action will return a list of 10 random cats. It will return image URLs in a small format approrpiate for a list.
* The second action will return details for one image and ask for a larger image URL.

Let's start with the first action. I began by simply figuring out the URL:

http://thecatapi.com/api/images/get?format=xml&results_per_page=10&size=small&api_key=SECRET

Now I began working on my action. One of the first issues I ran into was how I'd handle the XML. While I could try to parse it by hand, I really wanted to use a npm package, but I also knew that OpenWhisk only supports a particular list of npm packages. I checked [that list](https://console.ng.bluemix.net/docs/openwhisk/openwhisk_reference.html#openwhisk_ref_javascript_environments) and was happy to see that xml2js was included! Here's the action I wrote:

<pre><code class="language-javascript">
var request = require(&#x27;request&#x27;);
var parseString = require(&#x27;xml2js&#x27;).parseString;

function main() {

    var getCatsURL = &#x27;http:&#x2F;&#x2F;thecatapi.com&#x2F;api&#x2F;images&#x2F;get?format=xml&amp;results_per_page=10&amp;size=small&amp;api_key=visitmywishlist&#x27;;

    return new Promise((resolve, reject) =&gt; {

        request.get(getCatsURL, function(error, response, body) {

            if(error) {
                reject(error);
            } else {

                &#x2F;&#x2F;lets fix the response
                parseString(body, function(err, result) {
                    if(err) {
                        reject(err);
                    } else {
                        let myResult = result.response.data[0].images[0].image;
                        &#x2F;*
                        At this point, we have a nice array of results, but each result
                        needs a small change. They look like this:

                         {&quot;id&quot;: [&quot;d8p&quot; ],
                         &quot;source_url&quot;:[&quot;http:&#x2F;&#x2F;thecatapi.com&#x2F;?id=d8p&quot;],
                         &quot;url&quot;:[&quot;http:&#x2F;&#x2F;25.media.tumblr.com&#x2F;tumblr_m4g7z0X8fq1qhwmnpo1_250.jpg&quot;]},                                                                       Notice how the key values are 1-length arrays   
                        
                        *&#x2F;
                        let newResult = myResult.map((cat) =&gt; {
                            return {
                                id:cat.id[0],
                                source_url:cat.source_url[0],
                                url:cat.url[0]
                            };
                        });
                        resolve({% raw %}{response:newResult}{% endraw %});
                    }
                });
            }

        });


    });

}
</code></pre>

Let's tackle this bit by bit. I begin by simply requesting the URL that returns my list of cats. Then I pass it to the parseString method of the xml2js package. This will convert the XML into a simple object, but it does so in a pretty verbose manner. To figure out what I needed, I initially just returned the `result` of the parse itself. I looked at the result in the CLI and slowly trimmed it down to the bare essentials of what I needed. As a reminder, you can invoke actions from the CLI very easily:

	wsk action invoke catlist --blocking

I also have the massage the results a bit since it was returning key/value pairs as 1-length arrays. Here's an example of the output I now get:

![Output](https://static.raymondcamden.com/images/2017/1/ow1.png)	

To be clear, you're seeing the *complete* result of the action (well, as much as I could fit in the screenshot), which includes metadata about the action call and the result itself. What will be used by our clients though is within the response.result section.

The next action handles getting details for a particular ID. Here's that action:

<pre><code class="language-javascript">
var request = require(&#x27;request&#x27;);
var parseString = require(&#x27;xml2js&#x27;).parseString;

function main(params) {

    var getCatsURL = &#x27;http:&#x2F;&#x2F;thecatapi.com&#x2F;api&#x2F;images&#x2F;get?format=xml&amp;image_id=&#x27;+params.id+&#x27;&amp;size=large&amp;api_key=mymilkshake&#x27;;

    return new Promise((resolve, reject) =&gt; {

        request.get(getCatsURL, function(error, response, body) {

            if(error) {
                reject(error);
            } else {

                &#x2F;&#x2F;lets fix the response
                parseString(body, function(err, result) {
                    if(err) {
                        reject(err);
                    } else {
                        let myResult = result.response.data[0].images[0].image[0];
                        let detail = {% raw %}{url:myResult.url[0], source_url:myResult.source_url[0], id:myResult.id[0]}{% endraw %};
                        resolve({% raw %}{response:detail}{% endraw %});
                    }
                });
            }

        });


    });

}
</code></pre>

This one is even simpler as we just need to massage the result of one item. Note how I access an expected parameter for the ID: `params.id`. And honestly, that's it. One issue you may see is that I've got one API key in two separate files. I could correct this by switching my code into a package (see the [docs](https://console.ng.bluemix.net/docs/openwhisk/openwhisk_packages.html)), but that felt like overkill for this particular demo. It would definitely be the right path to take though if I started added more actions related to this one particular API.

The last step was to expose this via a REST API. As a reminder, this is still a work in progress, so you probably don't want to do this yet for *real* code, but it works great already. The general process with the CLI has you define a root API path, a particular path for *this* call, the HTTP method, and finally the action to call. 

I've got two actions and therefore two API calls. I used a root path of `/cats` and defined `/list` and `/detail` for each part of my API. I showed the CLI for this in my last post, but here it is again:

	wsk api-experimental create /cats /list get catwrapper

If you forget what APIs you defined, you can see them via the CLI as well:

	wsk api-experimental list

Once I had my APIs defined, I was technically done. For the heck of it, I built an Ionic application. It's just a master/detail type thing, but here it is in action. First, the list:

![List](https://static.raymondcamden.com/images/2017/1/ow2.png)	

And the detail - that button loads the detail page on the Cat API site.

![Detail](https://static.raymondcamden.com/images/2017/1/ow3.png)	

The complete code for this application may be found here (https://github.com/cfjedimaster/Cordova-Examples/tree/master/ionic_openwhisk), but let's look at the provider:

<pre><code class="language-javascript">
import {% raw %}{ Injectable }{% endraw %} from &#x27;@angular&#x2F;core&#x27;;
import {% raw %}{ Http }{% endraw %} from &#x27;@angular&#x2F;http&#x27;;
import &#x27;rxjs&#x2F;add&#x2F;operator&#x2F;map&#x27;;

&#x2F;*
  Generated class for the CatProvider provider.

  See https:&#x2F;&#x2F;angular.io&#x2F;docs&#x2F;ts&#x2F;latest&#x2F;guide&#x2F;dependency-injection.html
  for more info on providers and Angular 2 DI.
*&#x2F;
@Injectable()
export class CatProvider {

  private LIST_URL = &#x27;https:&#x2F;&#x2F;3b1fd5b1-e8cc-4871-a7d8-cc599e3ef852-gws.api-gw.mybluemix.net&#x2F;cats&#x2F;list&#x27;;

  private DETAIL_URL = &#x27;https:&#x2F;&#x2F;3b1fd5b1-e8cc-4871-a7d8-cc599e3ef852-gws.api-gw.mybluemix.net&#x2F;cats&#x2F;detail&#x27;;

  constructor(public http: Http) {
    console.log(&#x27;Hello CatProvider Provider&#x27;);
  }

  list() {

    return this.http.get(this.LIST_URL)
    .map(res =&gt; res.json())
    .map(data =&gt; data.response);

  }

  get(id) {
    return this.http.get(this.DETAIL_URL + &#x27;?id=&#x27;+id)
    .map(res =&gt; res.json())
    .map(data =&gt; data.response);
  }

}
</code></pre>

So yeah, nothing special here, nothing unusual, which is *exactly what we want!* Our Ionic app speaks to our OpenWhisk implementation and the actual API is completely hidden from the user. (Err, ok technically not - since the detail page opens up on the site, but you get the point.) There's no API key. No XML parsing. That's all hidden behind the scenes. And even better, I didn't have to write or setup my own NodeJS server. All I did was write two small actions and deploy them and I was done.

If you can't tell yet - I freaking love this!