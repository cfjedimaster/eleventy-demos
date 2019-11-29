---
layout: post
title: "CF901: Guide to Amazon S3 support in ColdFusion 9.0.1"
date: "2010-07-15T13:07:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2010/07/15/CF901-Guide-to-Amazon-S3-support-in-ColdFusion-901
guid: 3878
---

One of the most exciting parts of ColdFusion 9.0.1 is Amazon S3 support. If you've never heard of S3, here is the marketing copy. I'll follow this up with my take on it.

<p>

<blockquote>
Amazon S3 is storage for the Internet. It is designed to make web-scale computing easier for developers.
<br/><br/>
Amazon S3 provides a simple web services interface that can be used to store and retrieve any amount of data, at any time, from anywhere on the web. It gives any developer access to the same highly scalable, reliable, secure, fast, inexpensive infrastructure that Amazon uses to run its own global network of web sites. The service aims to maximize benefits of scale and to pass those benefits on to developers.
</blockquote>

<p>
Ok, so in English, what in the heck does this mean?
<p>
<!--more-->
You can think of S3 as a remote hard drive of infinite size. If you've ever built a web application that lets users upload files (images, attachments, etc), then you know that disk size is a concern. Sure it may take months or years before you have to be worried, and sure, hard drives are pretty cheap, but the point is you <i>still have to think about it!</i>. Amazon S3 gives us a way to <i>not</i> worry about it. (Not that it's totally without worry, see my closing notes below.)

<p>

To begin playing with S3, you need to first sign up for an account. You can do that here: <a href="http://aws.amazon.com/s3/">http://aws.amazon.com/s3/</a>. You <b>will</b> need to provide a credit card. This worried me. Pricing is based on how much stuff you put on S3 and how much it's accessed. Details can be found <a href="http://aws.amazon.com/s3/#pricing">here</a>. But to be honest, this kind of read like the <a href="http://www.amazon.com/Original-Handbook-Recently-Manual-Field-Operators/dp/0895560682">The Original Handbook for the Recently Deceased</a>. However, in all my testing, I've yet to incur a bill over 5 cents. Obviously your bill will be different, but for testing, I'd say this is a non-concern.

<p>

Once you've set up your account, you need to get two special pieces of information: Your access key and your secret access key. Once you have logged into S3, this may be found under Account/Security Credentials. Copy these down in a safe place. You will need them later.

<p>

Ok, so let's talk about S3 usage in ColdFusion. The code comes down to 4 distinct areas:

<ul>
<li>Credentials: You have two ways to "tell" ColdFusion your access credentials. I'll cover that below.
<li>File operations: This is the nut and bolts of using S3, creating your storage and copying and updating files.
<li>Permissions: This is where you set up who can access resources.
<ii>Metadata: This is where you can add additional information about your resources. S3 allows you to set <i>anything</i> you want.
</ul>

<p>
Let's begin with credentials. For all the code below, assume K1 and K2 are my real values. I trust you guys, but not <i>all</i> of you guys. ;)

<p>
<code>
component {

     this.name="s3test2";
     //s3 info
     this.s3.accessKeyid = "K1";
     this.s3.awsSecretKey = "K2";
        
}
</code>

<p>

As you can see, I've provided Application-level credentials. This means any S3 calls in my code will use these values. However, you can also provide the credentials in the path itself. If your application needs multiple different connections then that is the option you would use.

<p>

Now let's talk about file operations. The most important thing you must learn is the concept of buckets. A bucket is like a root folder. Your account can have any number of buckets and you must have at least one if you want to store files. Buckets are unique through the entire world. So that means you won't be using a bucket name like "images". From the S3 documentation, we have the following rules for buckets:

<p>

<blockquote>
Only contain lowercase letters, numbers, periods (.),
and dashes (-)<br/>
Start with a number or letter<br/>
Be between 3 and 63 characters long<br/>
Not be in an IP address style (e.g., "192.168.5.4")<br/>
Not end with a dash<br/>
Not contain dashes next to periods
(e.g., "my-.bucket.com" and "my.-bucket" are invalid)
</blockquote>
<p>

The generally accepted practice is to use a bucket name that matches your domain. So imaging you want to use S3 to store images for foo.com. Your bucket name could then be: images.foo.com. You can also create a bucket for your development work: dev.images.foo.com. And obviously staging too: staging.images.foo.com.
<p>

Once you've decided on your bucket then creating it as simple as creating any directory. The only difference is that you will use the s3:// prefix. Much like the VFS system, this tells ColdFusion that the operation is for S3, and not your local file system. Here is a quick example:
<p>

<code>
&lt;cfif not directoryExists("s3://demos10.coldfusionjedi.com")&gt;
     &lt;cfset directoryCreate("s3://demos10.coldfusionjedi.com")&gt;
&lt;/cfif&gt;

Done
</code>
<p>

The example above makes use of both directoryExists and directoryCreate. If not for the s3 prefix, this code would look just like code we've used for years. (Well ok, the directoryCreate function is kind of new!) Writing files is just as easy. Consider this next example:

<p>
<code>
&lt;cfset fileWrite("s3://demos10.coldfusionjedi.com/#createUUID()#.txt", "Foo")&gt;
&lt;cfset files = directoryList("s3://demos10.coldfusionjedi.com")&gt;
&lt;cfdump var="#files#"&gt;
</code>
<p>

On every reload, a new file is created (with the text 'Foo'). I use the directoryList command to get all the files from the folder. Here is an example result:
<p>

<img src="https://static.raymondcamden.com/images/Screen shot 2010-07-15 at 8.15.11 AM.png" />

<p>

I could read these files as well, and copy them to my local server. Deletes too. For the most part, you can almost forget that S3 is being used at all. However, you probably want to actually share these files with others. Images being the best example. Just because you copy the image to S3 doesn't mean folks can actually <i>see</i> the image. Enter the ACL, or Access Control List. This is how S3 does permissions.

<p>

ACLs consist of a entity (the thing you are granting permissions to) and the actual permission. The entity is either a group (like all), an email address, or an ID value (the docs call this a canonical value). Think of that like a user id. Permissions are:

<p>
<ul>
<li>read
<li>write
<li>read_acp (basically the ability to get permissions)
<li>write_acp (basically the ability to set permissions)
<li>full_control
</ul>
</p>

<p>
You have four main ways to work with ACLs. You can get an ACL, using storeGetACL(url). This returns an array of ACLs for the object. That can either be the main bucket (again, think root directory), or an individual file. You can set ACLs using storeSetACL(url, array). This will set <b>all</b> the permissions of the object. This is important. It's going to bite us in the rear in the next example. Next, you can add an ACL using storeAddACL(url, struct). Finally, you can set ACLs when creating a bucket using the cfdirectory tag. Let's look at an example of this, and as I said, this code is going to have a problem. You will see why in a minute.

<p>

<code>
&lt;cfif not directoryExists("s3://demos11.coldfusionjedi.com")&gt;
	&lt;cfset perms = [
		{% raw %}{group="all", permission="read"}{% endraw %}
	]&gt;
	&lt;cfdirectory action="create" directory="s3://demos11.coldfusionjedi.com" storeacl="#perms#"&gt;
&lt;/cfif&gt;

&lt;cfset fileWrite("s3://demos11.coldfusionjedi.com/#createUUID()#.txt", "Foo")&gt;
&lt;cfset files = directoryList("s3://demos11.coldfusionjedi.com")&gt;

&lt;cfdump var="#files#"&gt;
</code>

<p>

So going from the top, we first see if our bucket exists. If not, we are going to create it. But we begin by creating an array of ACLs. ACLs are just structures really, and in this case I have one. I'm giving everyone read access to it. I then pass this array to the cfdirectory tag when I create the bucket. Easy peasy. I follow this up with a simple write command, like our last command. However, now this returns an error:

<p>

<blockquote>
<b>S3 Error Message. Access DeniedCould not close the output stream for file "s3://demos11.coldfusionjedi.com/62ECAED9-EB00-C07E-3C0F435E525D1B06.txt"..</b><br/><br/>

RootCause - org.apache.commons.vfs.FileSystemException: Could not close the output stream for file "s3://demos11.coldfusionjedi.com/62ECAED9-EB00-C07E-3C0F435E525D1B06.txt".
</blockquote>

<p>

What the heck? Turns out - when we created the directory, we <b>set</b> the permissions. In other words, we told S3 that those were the <b>only</b> permissions allowed for the bucket. In other words, I didn't give myself access! So this is easy enough to fix - if I get my user ID I can give myself full control. But what in the heck is my user id? It isn't my logon. Luckily if you go back to the <b>Account/Security Credentials</b> page, towards the bottom, there is a link: View canonical user ID. Clicking that gives you a long ID value. I'm going to modify my code now to ensure I've got permission as well.

<p>

<code>
&lt;cfif not directoryExists("s3://demos12.coldfusionjedi.com")&gt;
	&lt;cfset perms = [
		{% raw %}{group="all", permission="read"}{% endraw %},
		{% raw %}{id="this is not the real value", permission="full_control"}{% endraw %}
	]&gt;
	&lt;cfdirectory action="create" directory="s3://demos12.coldfusionjedi.com" storeacl="#perms#"&gt;
&lt;/cfif&gt;

&lt;cfset fileWrite("s3://demos12.coldfusionjedi.com/#createUUID()#.txt", "Foo")&gt;
&lt;cfset files = directoryList("s3://demos12.coldfusionjedi.com")&gt;

&lt;cfdump var="#files#"&gt;
</code>

<p>

For the most part this is the same code as before. Note that I'm using a new bucket though. (Remember, you can <b>add</b> ACLs too. So we could have fixed that last bucket.) Now my array of ACLs includes one for myself as well, and I've given myself full control. This is <b>not</b> necessary if you don't pass any ACLs at all, as I did the first time I created a bucket. So what do the ACLs look like if you get them? If I modify the previous template to add this:

<p>

<code>
&lt;cfset acls = storeGetACL("s3://demos12.coldfusionjedi.com")&gt;
&lt;cfdump var="#acls#"&gt;
</code>

<p>

You end up with this:

<p>

<img src="https://static.raymondcamden.com/images/cfjedi/acl.png" />

<p>

Forgive my horrible attempt to obscure my ID. As you can see, I pretty much just got the same set of structs back. I do get a display name though. Depending on your needs, that could be useful to display on your site's front end. 

<p>

So you may ask -  how would you use S3 to display images? Or how would you link to them in general? Well obviously you have to give everyone permission to read the file. Without that an anonymous request will be blocked. Once you've done that, you have a few options.

<p>

The first option is to simply use an Amazon URL. Here is the generic form: http://s3.amazonaws.com/#bucket#/#yourfile#. Here is an example: http://s3.amazonaws.com/demos3.coldfusionjedi.com/dalek_war_low.jpg. And here it is in viewed on the web page (notice I set the width a bit smaller so it wouldn't be so huge on the page):

<p>

<img src="http://s3.amazonaws.com/demos3.coldfusionjedi.com/dalek_war_low.jpg" width="200">

<p>

The second option is to make use of a CNAME. This is a domain alias where you basically point one of your domains. I've set up demos3.coldfusionjedi.com as an alias to s3.amazonaws.com. That means the image above can also be found at http://demos3.coldfusionjedi.com/dalek_war_low.jpg. That way no one knows you are even using S3. (Although I included 's3' in the name so that kinda gives it away.)

<p>

Finally you could - although I wouldn't recommend it, copy media down when requested. For attachments that may be ok. For images it would be overkill. But interestingly enough imageNew() works just fine using S3 for a source image.

<p>

So now let's look at another interesting aspect: Metadata. S3 automatically creates a set of default metadata for every file you put up there. This includes: (and I should credit Adobe for this - it comes from their new CF901 reference)

<ul>
<li>last_modified
<li>date
<li>owner
<li>etag
<li>content_length
<li>content_type
<li>content_encoding
<li>content_disposition
<li>content_language
<li>content_md5
<li>md5_hash
</ul>

Buckets also include metadata, but only date and owner. What's cool though is that you can add any additional metadata you want. So first, let's look at an example of getting metadata.

<p>
<code>
&lt;cfset files = directoryList("s3://demos12.coldfusionjedi.com")&gt;

&lt;cfloop index="theFile" array="#files#"&gt;
	&lt;cfset md = storeGetMetadata(theFile)&gt;
	&lt;cfdump var="#md#" label="#theFile#"&gt;
&lt;/cfloop&gt;
</code>

<p>

This template simply lists the contents of my last bucket and for each file grabs the metadata. Here is the result:

<p>

<img src="https://static.raymondcamden.com/images/cfjedi/getmd.png" title="Result of get metadata" />

<p>

Adding metadata is as simple as passing a structure of name, value keys.

<p>

<code>
&lt;cfset files = directoryList("s3://demos12.coldfusionjedi.com")&gt;

&lt;cfloop index="theFile" array="#files#"&gt;
	&lt;cfset md = storeGetMetadata(theFile)&gt;
	&lt;cfdump var="#md#" label="#theFile#"&gt;

	&lt;!--- Add coolness ---&gt;
	&lt;cfset storeSetMetadata(theFile, {% raw %}{ coolness=randRange(1,100) }{% endraw %})&gt;
	
&lt;/cfloop&gt;
</code>

<p>

This is kind of a silly example since I'm using a random number, but after running this a few times, you can see the impact in the metadata.

<p>

<img src="https://static.raymondcamden.com/images/cfjedi/setmd.png" title="Result of setting metadata" />

<p>


So - at a high level - you can see how to read and write to S3. You can see how to set permissions and metadata. What's next? Here are some things to consider. 

<ul>
<li>Amazon S3 is not perfect. It <b>has</b> failed. The flip side to this is that nothing is perfect. I'd rather let Amazon worry about hard drive safety and backups. I trust them more than I trust myself. If I were the CIA, I wouldn't use them. If I were Flickr... I'd use them with caution and ensure I had a strong plan to cover any issues with Amazon. If I were a forum, or a blog, or simply making use of them to store media that isn't mission critical (forum avatars certainly are not, message attachments certainly are not), then I'd <b>strongly</b> recommend them. If you are ok with Amazon perhaps being down once a year, but want to ensure you never lose anything (and to be clear, I've heard of S3 being down, but not ever <i>losing</i> date), then I'd consider a monthly backup to a local hard drive. The take away from this though is that <b>anytime you make use of a remote resource, please be sure to code for that resource not being available.</b> I'll demonstrate an example of that later this week. (Remind me if I forget.)
<li>Custom metadata is cool, but right now I'm not aware of a way for you to search it via ColdFusion's API. So if you wanted to create a link between resources in a bucket and a user on your system, consider having a database table that links the user (and any other metadata) and the S3 file ID. This way you can search locally and fetch the files as needed.
<li>One of the cooler features of S3 is the ability to create temporary links. This allows you to keep a file protected, but say that anyone with this URL can grab a resource for N minutes of time. CF901 does not provide support for that. However, you can grab Barney Boisvert's cool Amazon S3 <a href="http://www.barneyb.com/barneyblog/projects/amazon-s3-cfc/">here</a>. It has a method just for that purpose. And while I recommend everyone upgrade to ColdFusion 9.0.1., I'll point out that Barney's CFC provides full read/write support. (I don't see ACL support but maybe I'm missing it.)
<li>Amazon provides a web based interface to your S3 account. When you screw up, and you will, it can help you figure out what's going wrong. Once logged in, you can hit it here: <a href="https://console.aws.amazon.com/s3/home">https://console.aws.amazon.com/s3/home</a>
<li>Random link - this blog entry contained some cool ideas and tips for S3: <a href="http://carltonbale.com/9-hidden-features-of-amazon-s3">9 Hidden Features of Amazon S3</a>
</ul>

<p>

Any questions?