---
layout: post
title: "Another Early Look - Netlify Graph"
date: "2022-02-17T18:00:00"
categories: ["serverless"]
tags: ["javascript"]
banner_image: /images/banners/flower_graph.jpg
permalink: /2022/02/17/another-early-look-netlify-graph.html
description: An early look at Netlify's new Graph feature
---

Earlier this month I took a look at a new (in beta) Netlify feature ([An Early Look at Netlify Scheduled Functions](https://www.raymondcamden.com/2022/02/04/an-early-look-at-netlify-scheduled-functions)). Netlify has been on a roll this month with new releases and announcements, and on Tuesday they announced another new feature, [Netlify Graph](https://www.netlify.com/blog/announcing-netlify-graph-a-faster-way-for-teams-to-develop-web-apps-with-apis). 

I encourage you to read the blog post I linked to above as it will give you a proper introduction to the feature, you can also watch a good (and very short!) introduction here:

<iframe width="560" height="315" src="https://www.youtube.com/embed/1JRVzX5yFyw" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen style="display:block;margin:auto;margin-bottom:25px"></iframe>

But of course, I think you come here for a) my take on things and b) my cat demos. I've played a bit with this new feature over the past few days and I've got to say... while I feel like they're some rough edges, it's *damn* nice. 

At a high level, this feature lets you "design" (more on that in a sec) an API call against a service, with or without authentication. Once you've designed the API (basically, I want X, Y and Z from the API), Netlify can then export a serverless function to your site that provides a wrapper to the call. 

So for example, I was able to build an authenticated call to the Spotify API to fetch the latest music I played. I then exposed it at <https://www.raymondcamden.com/api/latestTracks>. I then took that endpoint and whipped up a super simple Vue.jus front end: <https://www.raymondcamden.com/tracks>.

Code-wise, I really didn't do much of anything at all! And in fact, I first designed my API, realized I missed something, and was able to use the UI to update the API and add additional fields.

It's all kinda... magical honestly. As I said, I definitely hit a few rough spots and I'd probably wait before using this in production for a "real" site, but even right now it's pretty freaking cool. 

Alright, so how does it work?

## Adding a Spotify API

First off, note that the docs for Graph are still on GitHub: <https://github.com/netlify/labs/tree/main/features/graph/documentation> As this is a beta feature you won't find it on the main Netlify docs yet, so keep that in mind as you play. 

Begin by ensuring your Netlify CLI is up to date. They update pretty often so first run `npm install netlify-cli -g` to ensure you're running the latest. 

Next, in an existing and connected Netlify site, run: `ntl dev --graph`. (As an FYI, the `netlify` CLI has an alias of `ntl`.) This will do... um... stuff... but also fire up your local server. Notice though that you'll get a new URL as well:

<p>
<img data-src="https://static.raymondcamden.com/images/2022/02/ng1.png" alt="Netlify Graph URL" class="lazyload imgborder imgcenter">
</p>

This opens up the Graph UI where you can handle connecting APIs as well as working with queries. For connecting APIs, you'll need to go to the various services, create an application, and ensure you setup redirect URLs right. This is detailed here: <https://github.com/netlify/labs/blob/main/features/graph/documentation/authentication.md#custom-clients>

I did this for Spotify so that I could make authenticated calls using my credentials. You can then use their GraphQL editor to design a query. Now, don't panic. I'm "aware" of GraphQL, as I assume most developers are, but I really haven't used it a lot. To be honest though, the editor makes it super easy to use. I literally just dug down into the `recentlyPlayed` part of Spotify's API and picked the things I thought made sense. It then created the query for me. 

<p>
<img data-src="https://static.raymondcamden.com/images/2022/02/ng2a.jpg" alt="GraphQL editor" class="lazyload imgborder imgcenter">
</p>

I clicked the "Play" button and was able to peruse the result (I trimmed it a bit):

```json
{
  "data": {
    "me": {
      "spotify": {
        "recentlyPlayed": {
          "nodes": [
            {
              "track": {
                "name": "Just Can't Get Enough - Schizo Mix; 2006 Remaster",
                "previewUrl": "https://p.scdn.co/mp3-preview/8f820d005a2e3d6096d92a15282c2cfa5652dec7?cid=0cc0d8a9a63f4acc9ff6a8fa8fcba55c",
                "externalUrls": {
                  "spotify": "https://open.spotify.com/track/18Vi0usOpnL3gnZPRxAKh1"
                },
                "artists": [
                  {
                    "name": "Depeche Mode",
                    "externalUrls": {
                      "spotify": "https://open.spotify.com/artist/762310PdDnwsDxAQxzQkfX"
                    }
                  }
                ]
              },
              "playedAt": "2022-02-17T20:45:34.048Z",
              "context": null
            },
            {
              "track": {
                "name": "Any Second Now (Voices) - 2006 Remaster",
                "previewUrl": "https://p.scdn.co/mp3-preview/96ac0eef76b41a08fa90327ee6dc1e249618a36a?cid=0cc0d8a9a63f4acc9ff6a8fa8fcba55c",
                "externalUrls": {
                  "spotify": "https://open.spotify.com/track/0ZnIgHdjKoSdz6rxO3QzWQ"
                },
                "artists": [
                  {
                    "name": "Depeche Mode",
                    "externalUrls": {
                      "spotify": "https://open.spotify.com/artist/762310PdDnwsDxAQxzQkfX"
                    }
                  }
                ]
              },
              "playedAt": "2022-02-17T20:38:49.953Z",
              "context": null
            }
          ]
        }
      }
    }
  },
  "extensions": {
    "metrics": {
      "api": {
        "avoidedRequestCount": 0,
        "requestCount": 2,
        "totalRequestMs": 167,
        "byHost": [
          {
            "host": "api.spotify.com",
            "requestCount": 2,
            "totalRequestMs": 167,
            "rateLimit": null
          }
        ]
      }
    }
  }
}
```

## Making Code 

Ok, now comes the freaking magic part. Once you have the query to your liking, you then click "Generate Handler" under the "Actions" menu:

<p>
<img data-src="https://static.raymondcamden.com/images/2022/02/ng3.jpg" alt="The Generate Handler button" class="lazyload imgborder imgcenter">
</p>

This will do two things. First, it creates `.functions/netlifyGraph`. From what I can tell, this is the core service for the feature and contains your GraphQL queries. You do *not* touch this. It then generates `.functions/ExampleQuery.js`. The name comes from the default name of your query. I've renamed mine to `latestTracks`. Out of the box, this provides an endpoint to hit your GraphQL query. You just hit it and get JSON back... unless you're using authentication. You will see this on top:

```js
  let accessToken;

  //// If you want to use the client's accessToken when making API calls on the user's behalf:
  // accessToken = event.headers["authorization"]?.split(" ")[1]

  //// If you want to use the API with your own access token:
  // accessToken = event.authlifyToken
```

As I am using authentication, I uncommented that last line above. And that was it! Well, I then added a redirect: 

	/api/latestTracks /.netlify/functions/latestTracks 200

I was then able to hit `/api/latestTracks` and get results! Well, sometimes. Right now there appears to be a bug in `ntl dev` where my authenticated functions work, randomly. It's either a perfect response, or: 

```json
{
  "success": true,
  "latestTracksErrors": [
    {
      "message": "Missing auth for Spotify. Please reauthenticate.",
      "path": [
        "me",
        "spotify"
      ],
      "extensions": {
        "service": "spotify",
        "type": "auth/missing-auth",
        "traceId": "8e5c260e-adcc-47df-a697-3aeba0eec642"
      }
    }
  ],
  "latestTracksData": {
    "me": {
      "spotify": null
    }
  }
}
```

I can't find any reason for why this happens, and as I said, it's random, but in production seems to work perfectly. If you're curious and want to learn more, I filed an [issue](https://github.com/netlify/labs/issues/28) for it. 

The process of modifying the query was also pretty straightforward. Like I said, I realized today I was missing a few keys I wanted in the result. I fired up the CLI, opened up the editor, saved it, and then saw that my local `.functions/netlifyGraph` folder updated with the new query. So I commited to my repo and pushed, Netlify rebuilt the site, and the production API was updated.

There's more to this then I'm showing here, but as I said, I *really* dug how this worked. Outside of the issue I ran into locally, probably the biggest issue now is the lack of supported APIs. As of this week, they support:

* Box
* Contentful
* GitHub
* npm
* Salesforce
* Spotify
* Stripe

The list really needs to be beefed up a bit before final release, but if that happens, I definitely see this as a *really* compelling reason to use Netlify, especially with the earlier beta release of scheduled functions.

Photo by <a href="https://unsplash.com/@edwardhowellphotography?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Edward Howell</a> on <a href="https://unsplash.com/s/photos/graph?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Unsplash</a>
  