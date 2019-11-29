---
layout: post
title: "VS Code Extensions: mssql and vscode-database"
date: "2017-02-17T16:18:00-07:00"
categories: [development]
tags: [visual studio code]
banner_image: /images/banners/vsc_ext.jpg
permalink: /2017/02/17/vs-code-extensions-mssql-and-vscode-database
---

For today's review of [Visual Studio Code](https://code.visualstudio.com/) extensions, I looked at two related extensions that provide basic database support. In the past, when I was a heavy ColdFusion user, I was a huge fan of the database support in [ColdFusion Builder](http://www.adobe.com/products/coldfusion-builder.html). Now - CFBuilder was Eclipse-based so it was quite heavy, but I loved it's database viewer. I don't have it installed currently, but the basic feature set included being able to view all tables and structure as well as write ad hoq queries against it and see results. It supported anything ColdFusion itself supported, which had pretty good support for the RDMS world. I thought it might be useful to take a look at how well this type of feature is supported with Code.

In my search of the [marketplace](https://marketplace.visualstudio.com/vscode), I only ran into two plugs that I thought matched what I was looking for. Surprisingly I couldn't find *anything* that supported a NoSQL solution. The first one I tried was [vscode-database](https://marketplace.visualstudio.com/items?itemName=bajdzis.vscode-database), which supports MySQL and Postgres.

One of the things that I noticed immediately, and this is not the fault of the extension, but I find that running everything in the command palette does not always work well. Of course, Eclipse gets around this by having a gazallion panels and dedicated work "areas" for stuff like this. I certainly don't want to see Code turn into that, but my gut feels there needs to be a UI/UX solution that is better suited for more complex tooling like this. That's a bit vague, I know, but I think in the video it will be a bit clearer. 

The extension provides support for:

* Connecting to a server
* Saving that connection (note, the password is stored in plain text)
* Selecting a database
* Running an ad hoq query 
* Writing/Running an "Advancer" query - which I have no idea what that means. It seems to simply make a temp file for you to write a query in, which is helpful, but again shows where a 'panel' ala-Eclipse would come in handy.

I'm going to ding this extension a few points (err, not that I'm assigning ratings or anything) for not having proper documentation on it's [marketplace page](https://marketplace.visualstudio.com/items?itemName=bajdzis.vscode-database). It has an animated gif, which is cute, but totally not acceptable by itself. 

I didn't even notice it at first, but when connected, the lower left hand corner will tell you the server and database being used:

![Screen shot](https://static.raymondcamden.com/images/2017/2/vse_17_1.png)

Unless you use the "Advancer" features, you'll write your queries in the command pallete - which works well enough but you won't get autocomplete:

![Screen shot](https://static.raymondcamden.com/images/2017/2/vse_17_2.png)

The output is sent to the bottom panel along with the query you selected. As you write more queries, the output is just appended, which I like since it means I can do a few quick queries and check the output later.

![Screen shot](https://static.raymondcamden.com/images/2017/2/vse_17_3.png)

As I said, you do get autocomplete in the "Advancer" query, and it does work well - showing tables and columns. I found it a bit tricky at the column level (ie, the SELECT area), but it worked fine in FROM.

![Screen shot](https://static.raymondcamden.com/images/2017/2/vse_17_4.png)

And that's pretty much it. As I said, I do think they need to work on the docs, but the extension is usable for sure. 

Now let's look at [mssql](https://marketplace.visualstudio.com/items?itemName=ms-mssql.mssql). The first thing I'll tell you is - it is probably a bad idea to try to use both this extension and the previous one in the same directory at the same time. I did that. Don't do that. The feature set pretty much mimics the previous extension. 

* You can define connections to a database.
* You can connect to one.
* You can execute queries in a file, but not in the command palette
* You get autocomplete in SQL

But where things shine here is the view. Here is an example query. You have to use a .sql file (or a file set to the SQL type), and when you execute the query (via the command palette), you get a much nicer result set:

![Screen shot](https://static.raymondcamden.com/images/2017/2/vse_17_5.png)

It isn't noticeable in a screen shot (the video will make it clear), but you can copy rows, columns, and individual cells. You can also export the result to a .csv or .json file. You also get a basic report on the execution. In the screen shot above it was clipped out, but the total execution time is also returned.

Connections are stored to a preference which is nice if you don't want to define a configuration in the command palette. (I keep harping on that, but it is a bit of a pain for me.) The vscode-database extension uses a specific file for it's stuff whereas the mssql one integrates into user settings, which I think is a better approach. All in all, this is a much more polished extension, with better [docs](https://marketplace.visualstudio.com/items?itemName=ms-mssql.mssql) too, but obviously either will suffice for your needs. 

For both, I wish I could more easily output table structure. Ie, show me the tables and columns in a dump. I know I can do that via a query itself, but I'd love something built in.

Anyway, I hope this is helpful, and as before, I'm recording a quick video so you can see this in action. Please let me know what you think!

<iframe width="640" height="360" src="https://www.youtube.com/embed/AJBnww90aHs?rel=0" frameborder="0" allowfullscreen></iframe>