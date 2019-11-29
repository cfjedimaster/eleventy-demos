---
layout: post
title: "OpenWhisk Sequences as Input/Output Providers"
date: "2017-05-01T10:39:00-07:00"
categories: [serverless]
tags: [openwhisk]
banner_image: 
permalink: /2017/05/01/sequences-as-inputoutput-providers
---

I've been thinking a lot lately about sequences and OpenWhisk. A few weeks ago I [blogged](https://www.raymondcamden.com/2017/04/07/from-actions-to-sequences-to-services) about how well sequences work to let you "mix and match" different actions into new creations. Today I'm writing about another powerful feature of sequences, that as "Input/Output Providers". I'm not necessarily sold on that name, but hopefully my blog post will make it clear what I'm talking about.

Back when I first blogged on OpenWhisk (["Going Serverless with OpenWhisk"](https://www.raymondcamden.com/2016/12/23/going-serverless-with-openwhisk)), I mentioned how the platform has support for automatically recognizing some of the services you add to [Bluemix](https://www.ibm.com/cloud-computing/bluemix/). In that post, I mentioned how when I added a Cloudant service, OpenWhisk automatically provisioned an instance of the Cloudant package with my credentials pre-set. This meant I could do full CRUD with Cloudant on OpenWhisk and not have to specify any authentication.

Cool!

But - while these actions worked well, they weren't necessarily set up, by themselves, to be called as part of an application. In the blog post, I got around this by writing an action that used the OpenWhisk NPM module to call my Cloudant action. I massaged the results a bit and then returned them. While that worked, it's actually much easier to use a sequence. Here's an example.

Imagine I've got a Cloudant package connected to a service with a simple database of blog entries. (I do, actually, and I'll be blogging about that demo later this week.) My goal is to create an API that returns all the objects from the database. That can be done with the list-documents action. The [docs](https://console.ng.bluemix.net/docs/openwhisk/openwhisk_cloudant.html#openwhisk_catalog_cloudant) for the Cloudant package don't go over every action, but don't forget you can browse the package from the CLI like so:

`wsk package get "/rcamden@us.ibm.com_My Space/Bluemix_CloudantForDemos_Credentials-1" --summary`

The list-documents action takes 2 params, `dbname` and `params`. For `dbname`, I can use `blog`, and for `params`, I need to tell Cloudant to return the full record so I'll use `"include_docs":true`.

Ok, so given that, how do I make this easy with a sequence? First, I created a new action called getall_entry. In this case, "entry" refers to the entry point, or input, to the final sequence I'll create. Here's the code.

<pre><code class="language-javascript">function main() {

    return {
        "dbname":"blog",
        "params":{
            "include_docs":true
        }
    }
}
</code></pre>

Yep, no logic at all. This simply outputs the parameters that will drive `list-documents`. I then created another action, getall_exit, and obviously, "exit" refers to the exit point, or output, for my sequence.

<pre><code class="language-javascript">function main(args) {

    console.log(args.rows);
    let result = args.rows.map( (item) =&gt; {
        return {
            "title":item.doc.title,
            "body":item.doc.body,
            "slug":item.doc.slug,
            "published":item.doc.published
        }
    });

    return {% raw %}{ results:result }{% endraw %}

}
</code></pre>

When Cloudant returns data, it includes additional information and other things I don't need. I can use the `map` function on the result to massage the result into a simple array.

So the last thing I need to do is just create the sequence! I make a new sequence like so:

`wsk action create --sequence getall getall_entry,Bluemix_CloudantForDemos_Credentials-1/list-documents,getall_exit`

The end result is a new action called `getall` that handles calling Cloudant for me and returning a nice array of data. What's cool is that I could completely switch database engines by just updating the action in the middle. No one using my action would ever need to know.

In fact, I did something a bit like that. I didn't switch engines, but rather switched actions. I'm still pretty rough with Cloudant, but I found that I couldn't sort my results when using `list-documents`. So instead I built a view that indexed my data by date. The Cloudant package offers the `exec-query-view` action for running views. I had to tweak my entry point a bit so I could tell the view to sort:

<pre><code class="language-javascript">function main() {

    return {
        "dbname":"blog",
        "docid":"allSorted",
        "viewname":"allSorted",
        "params":{
            "include_docs":"true",
            "descending":"true"
        }
    }
}
</code></pre>

I then updated my sequence to use `exec-query-view` instead. Net result? Same data, but sorted by date descending, which is a bit more appropriate for the demo I'm building. I could update my entry point to allow for the sort to be a parameter to make this a bit more realistic perhaps. Here is the output:

![Data](https://static.raymondcamden.com/images/2017/5/seq1.png)

Any questions, or suggestions, about this approach? Leave me a comment below!