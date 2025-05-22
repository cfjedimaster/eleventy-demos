---
layout: post
title: "Using Google Analytics 4 for Blog Stats"
date: "2021-12-17T18:00:00"
categories: ["javascript"]
tags: "post"
description: Some examples of using the latest Google Analytics API
---

Like a lot of people in tech, I'm a bit of a stats junkie, especially when it comes to my blog. Over the years I've used various tools for stats, primarily Google Analytics. Google Analytics is easy to add to a site, but the reports can sometimes be a bit dense to get into. Because of this, I've actually built my own tools. Here's a few examples:

* [Integrating Google Analytics with Eleventy](https://www.raymondcamden.com/2020/05/21/integrating-google-analytics-with-eleventy)
* [Google Analytics and RSS Report - Version 2](https://www.raymondcamden.com/2017/07/06/google-analytics-and-rss-report-version-2)
* [Google Analytics and RSS Report](https://www.raymondcamden.com/2015/06/08/google-analytics-and-rss-report)
* [Proof of Concept - Dashboard for Google Analytics](https://www.raymondcamden.com/2014/01/24/Proof-of-Concept-Dashboard-for-Google-Analytics)
* [Creating a custom display for Google's Analytics Embed Library](https://www.raymondcamden.com/2015/09/17/creating-a-custom-display-for-googles-analytics-embed-library)
* [Using the Google Analytics Embed API to Build a Dashboard](https://www.raymondcamden.com/2015/07/07/using-the-google-analytics-embed-api-to-build-a-dashboard)
* [Quick example of the Google Analytics Embed API](https://www.raymondcamden.com/2015/06/10/quick-example-of-the-google-analytics-embed-api)

A few years back I was happy to discover Netlify's own tool, [Netlify Analytics](https://www.netlify.com/products/analytics/). This was perfect. No need for any JavaScript library in my code that a *huge* amount of people blocked and an incredibly simple report that was quick and easy to read. They didn't have an API, but there was a hidden one I was able to build on. Even though it was probably a bad idea, I built a few demoes with it:

* [Netlify Analytics and Eleventy](https://www.raymondcamden.com/2020/05/18/integrating-netlify-analytics-and-eleventy)
* [Building a Netlify Stats Viewer in Vue.js](https://www.raymondcamden.com/2019/10/05/building-a-netlify-stats-viewer-in-vuejs)
* [Another Netlify Analytics Hack - Stats Per URL](https://www.raymondcamden.com/2020/10/08/another-netlify-analytics-hack-stats-per-url)

One of the primary reasons I built hacks with their (unofficial) API is that as cool as Netlify's Anayltics report is, it caps out the results at thirty days max. By using the API I was able to get older stats just fine.

Until it wasn't. :) One day the API simply stopped returning older content. Now - keep in mind that Netlify Analytics was first released in July of 2019. One of the first things people asked about was historical data. It took two years for that to finally happen ([Announcing Netlify Log Drains for Datadog](https://www.netlify.com/blog/2021/09/08/announcing-netlify-log-drains-for-datadog/)). While I'm disappointed it took so long to have a way to access historical data, this is a decent solution. The only issue (for me anyway) is that it involves paying for another service, [Datadog](https://www.netlify.com/technology-partners/datadog). I've got nothing against paying for a good service, but right now this blog doesn't generate much income (I removed ads a few months ago) so I'm trying to keep to a free tier. 

Alright, so back in January, I used my unofficial Netlify API hack to try to get a report on my blog over the previous year. This is when I first discovered the API was no longer returning historical data. I was ticked off, but I only had myself to blame. I decided to simply put Google Analytics back in, and keep Netlify Analytics as my "day to day how is the blog doing" report and GA as a way to track historical data. There's a tremendous difference in stats between the two with people blocking tracking apps, but I figured Google Analytics would still be useful as a way to watch trends. 

As an example of the difference, according to Netlify Analytics (NA from now on, getting tired of typing it), my site had 364K page views in the past thirty days. According to Google Analytics (GA) I got 24K. But hey - that's not the issue. When I added GA back in January, I was prompted to update to the latest version, Google Analytics 4. 

I figured - why not - if I'm adding the product back in I should use the latest version. What I didn't realize is that while previous versions of GA were a "bit" difficult for me to use (hence me building my own tools), GA4 was far away and more opaque and difficult to use. Don't get me wrong - I'm sure people who are power users love it. But honestly - I hate using it. Like, just now when I was writing the previous paragraph, it took me about five minutes just to get that dang number. Nothing in GA4 is "obvious" to me. Not one dang thing. And again, I'll take the blame. Maybe I just need to dedicate a week (month) or two to learn it better, but I just don't like it. 

So with that mindset, I decided to try my own tools again. And then I discovered that since my web site was using the latest version, the previous code I wrote no longer worked. 

<p>
<img src="https://static.raymondcamden.com/images/2021/12/sadcat.jpg" alt="Sad Cat" class="lazyload imgborder imgcenter">
</p>

After a cry or two, I did some research. I began with the [GA 4](https://developers.google.com/analytics/devguides/reporting/data/v1) API docs. From what I could see, the code was pretty similar to previous versions. You create a somewhat complex query structure, pass it to the API, and then parse the somewhat complex results. I'm not going to attempt to explain it deeply as there's documentation for that, but here's one simple example:

```js
const propertyId = '258759757';

// Imports the Google Analytics Data API client library.
const {BetaAnalyticsDataClient} = require('@google-analytics/data');

// Using a default constructor instructs the client to use the credentials
// specified in GOOGLE_APPLICATION_CREDENTIALS environment variable.
const analyticsDataClient = new BetaAnalyticsDataClient();

// Runs a simple report.
async function runReport() {
	const [response] = await analyticsDataClient.runReport({
		property: `properties/${propertyId}`,
		dateRanges: [
		{
			startDate: '2021-11-02',
			endDate: 'today',
		},
		],
		dimensions: [
		{
			name: 'date',
		},
		],
		metrics: [
		{
			name: 'screenPageViews',
		},
		],
	});

	console.log('Report result:');
	response.rows.forEach(row => {
		console.log(row.dimensionValues[0], row.metricValues[0]);
	});
}

runReport();
```

This runs a report on my page views from November 2nd to today. The result contains an array of records where each record contains `dimensionValues` and `metricValues`. `dimensionValues` refer to the dimensions of my report, which is the date. The `metricValues` is the data I care about, the page views. These are both arrays with the 0th element being what I care about, hence me dumping that above. The (partial) output looks like so:

```
Report result:
{ value: '20211117', oneValue: 'value' } { value: '1291', oneValue: 'value' }
{ value: '20211116', oneValue: 'value' } { value: '1272', oneValue: 'value' }
{ value: '20211102', oneValue: 'value' } { value: '1250', oneValue: 'value' }
{ value: '20211103', oneValue: 'value' } { value: '1239', oneValue: 'value' }
{ value: '20211122', oneValue: 'value' } { value: '1204', oneValue: 'value' }
{ value: '20211108', oneValue: 'value' } { value: '1187', oneValue: 'value' }
{ value: '20211123', oneValue: 'value' } { value: '1186', oneValue: 'value' }
{ value: '20211209', oneValue: 'value' } { value: '1164', oneValue: 'value' }
{ value: '20211118', oneValue: 'value' } { value: '1160', oneValue: 'value' }
{ value: '20211115', oneValue: 'value' } { value: '1147', oneValue: 'value' }
```

I took this initial report and made it a bit nicer. 

```js
/*
https://developers.google.com/analytics/devguides/reporting/data/v1/rest/v1beta/DateRange

The format NdaysAgo, yesterday, or today is also accepted
*/

const propertyId = '258759757';

const {BetaAnalyticsDataClient} = require('@google-analytics/data');
const analyticsDataClient = new BetaAnalyticsDataClient();


(async () => {
	console.log('oct 1 to nov 1');
	let views = await getPageViews('2021-10-1', '2021-11-1');
	console.log(views);

	console.log('7 days');
	let views2 = await getPageViews('6daysAgo');
	console.log(views2);

	console.log('Previous week');
	let views3 = await getPageViews('7daysAgo','1daysAgo');
	console.log(views3);

})();

async function getPageViews(from,to='today') {

	const [response] = await analyticsDataClient.runReport({
		property: `properties/${propertyId}`,
		dateRanges: [
		{
			startDate: from,
			endDate: to,
		},
		],
		dimensions: [
		{
			name: 'date',
		},
		],
		metrics: [
		{
			name: 'screenPageViews',
		},
		],
	});

	let result = [];
	response.rows.forEach(row => {
		let dateString = row.dimensionValues[0].value;
		let y = dateString.substr(0,4);
		let m = dateString.substr(4,2);
		let d = dateString.substr(6,2);
		let date = new Date(y, m-1, d);

		result.push({
			date, views:row.metricValues[0].value
		});
	});

	result.sort((a, b) => {
		return a.date.getTime() - b.date.getTime();
	});

	return result;

}
```

In this example I've got a function, `getPageViews`, that lets me pass a date range. It helps make the results nicer to read as well. Here's how it looks (just for "7 days" and "Previous week"):

```
7 days
[
  { date: 2021-12-13T06:00:00.000Z, views: '1055' },
  { date: 2021-12-14T06:00:00.000Z, views: '1047' },
  { date: 2021-12-15T06:00:00.000Z, views: '1079' },
  { date: 2021-12-16T06:00:00.000Z, views: '1060' },
  { date: 2021-12-17T06:00:00.000Z, views: '862' },
  { date: 2021-12-18T06:00:00.000Z, views: '423' },
  { date: 2021-12-19T06:00:00.000Z, views: '68' }
]
Previous week
[
  { date: 2021-12-12T06:00:00.000Z, views: '508' },
  { date: 2021-12-13T06:00:00.000Z, views: '1055' },
  { date: 2021-12-14T06:00:00.000Z, views: '1047' },
  { date: 2021-12-15T06:00:00.000Z, views: '1079' },
  { date: 2021-12-16T06:00:00.000Z, views: '1060' },
  { date: 2021-12-17T06:00:00.000Z, views: '862' },
  { date: 2021-12-18T06:00:00.000Z, views: '423' }
]
```

By the way, the GA4 package is looking for your credentials from your Google account. I suck at setting environment variables in the my shell but this is how I did it:

```bash
GOOGLE_APPLICATION_CREDENTIALS="/mnt/c/Users/ray/OneDrive/temptoremove/ga4/creds.json" node test2.js
```

Basically I set the path and immediately run the code. I mention that because it began to annoy me and I figured out how to pass the values in directly in code. Here's a script that reports on page views per month:

```js
/*
This example - get monthly reports for 2021
*/
let credentials = {
  "type": "service_account",
  "project_id": "something",
  "private_key_id": "so secret",
  "private_key": "my key brings all the boys to the yard",
  "client_email": "damnrightitsbetterthanyours@gsomething.iam.gserviceaccount.com",
  "client_id": "another id",
  "auth_uri": "https://accounts.google.com/o/oauth2/auth",
  "token_uri": "https://oauth2.googleapis.com/token",
  "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
  "client_x509_cert_url": "yet another value"
};

const propertyId = '258759757';

const {BetaAnalyticsDataClient} = require('@google-analytics/data');
const analyticsDataClient = new BetaAnalyticsDataClient({ credentials });

let year = '2021';

(async () => {

	for(let i=1; i<=12;i++) {
		let m = i;
		if(m < 10) m = '0'+m;
		let range1 = `${year}-${m}-1`;
		let dim = daysInMonth(i, 2021);
		let range2 = `${year}-${m}-${dim}`;
		let views = await getPageViews(range1, range2);
		let pageViewsPerMonth = views.reduce((total, day) => {
			return total + parseInt(day.views,10);
		}, 0);
		console.log(range1,range2,pageViewsPerMonth);
	}

})();

function daysInMonth (month, year) {
    return new Date(year, month, 0).getDate();
}

async function getPageViews(from,to='today') {

	const [response] = await analyticsDataClient.runReport({
		property: `properties/${propertyId}`,
		dateRanges: [
		{
			startDate: from,
			endDate: to,
		},
		],
		dimensions: [
		{
			name: 'date',
		},
		],
		metrics: [
		{
			name: 'screenPageViews',
		},
		],
	});

	let result = [];
	response.rows.forEach(row => {
		let dateString = row.dimensionValues[0].value;
		let y = dateString.substr(0,4);
		let m = dateString.substr(4,2);
		let d = dateString.substr(6,2);
		let date = new Date(y, m-1, d);

		result.push({
			date, views:row.metricValues[0].value
		});
	});

	result.sort((a, b) => {
		return a.date.getTime() - b.date.getTime();
	});

	return result;

}
```

Here's my report:

```
2021-01-1 2021-01-31 25432
2021-02-1 2021-02-28 40931
2021-03-1 2021-03-31 51624
2021-04-1 2021-04-30 48349
2021-05-1 2021-05-31 44253
2021-06-1 2021-06-30 38396
2021-07-1 2021-07-31 31729
2021-08-1 2021-08-31 30653
2021-09-1 2021-09-30 29756
2021-10-1 2021-10-31 29726
2021-11-1 2021-11-30 27891
2021-12-1 2021-12-31 15832
```

Woot! So in theory, that's all I really needed and I could have left it at that - literally running that script once a year. But then I thought - why not do *one more thing*. One report I've built in the past is see how my current blog posts are doing. Almost always my top posts are older entries because no one likes my current content. (Just kidding... mostly. ;) With that in mind, I wanted to create a report based on the last ten posts of my blog.

In the past I've done this with a RSS parser and it's definitely possible to parse RSS with JS, but I also have a [JSON feed](https://www.raymondcamden.com/jsonfeed/index.json) here and JSON is *much* easier to parse. So given that I've got an easy way to get my latest content, I whipped up a quick Netlify serverless function that uses the GA4 API to get page views for one url. Here's the function:

```js
// Imports the Google Analytics Data API client library.
const {BetaAnalyticsDataClient} = require('@google-analytics/data');

// Using a default constructor instructs the client to use the credentials
// specified in GOOGLE_APPLICATION_CREDENTIALS environment variable.
const credentials = JSON.parse(process.env.GOOGLE_GA_CREDS);
const propertyId = process.env.GOOGLE_GA_PROPERTY;

const analyticsDataClient = new BetaAnalyticsDataClient({credentials});

const handler = async (event) => {
  try {

    let path = event.queryStringParameters.path;
    let views = await getPageViews(propertyId, path);

    return {
      statusCode: 200,
      body: JSON.stringify({ views }),
    }
  } catch (error) {
    return { statusCode: 500, body: error.toString() }
  }
}

async function getPageViews(propertyId,url) {

  // year there is a bit arbitrary, I set up my GA4 account a year ago
	const [response] = await analyticsDataClient.runReport({
		property: `properties/${propertyId}`,
		dateRanges: [
			{
				startDate: '2015-12-01',
				endDate: 'today',
			},
		],
		dimensions: [
			{
				name: 'date'
			},
			{
				name:'fullPageUrl'
			}
		],
		metrics: [
			{
				name: 'screenPageViews',
			},
		],
		dimensionFilter: 
			{
				"filter": {
					"fieldName":"fullPageUrl",
					"stringFilter": {
						"matchType":"EXACT",
						"value":url
					}
				}
			},
		orderBys:[
			{
				dimension:{
					dimensionName:"date"
				}
			}
		]
			
	});

	let total = response.rows.reduce( (prev, curr)  => {
		return prev + parseInt(curr.metricValues[0].value,0);
	}, 0);

	return total;

}

module.exports = { handler }
```

For the most part this should all make sense, but I'll point out I used a date range of 2015 and later as this easily covers my GA4 property log history (another fun fact - when you upgrade your account the old data doesn't copy over - you still have access to your old data, but have to go into another property to view it). This function looks for a URL path as a query parameter and uses it to find the stats. Here's an example:

https://www.raymondcamden.com/api/getPageFiews?path=www.raymondcamden.com/2021/12/10/running-netlify-dev-and-eleventy-two-or-more-times

Which as of right now returns... wait for it... 28. Sigh. Ok, so I've got an existing [stats](https://www.raymondcamden.com/stats) page and decided to simply add this new report to it. You can click that previous link to see it live, but here's a screen shot of the new report:

<p>
<img src="https://static.raymondcamden.com/images/2021/12/ga1.jpg" alt="" class="lazyload imgborder imgcenter">
</p>

The entirety of the stats page is a very simpe Vue app (you can peruse the source in devtool!) so I won't share the bits here, but basically I did a fetch to my JSON feed and then multiple calls to get page views for each unique post. 