---
layout: post
title: "Image Upload Preview in Alpine.js"
date: "2022-06-03T18:00:00"
categories: ["JavaScript"]
tags: ["alpinejs"]
banner_image: /images/banners/tip.jpg
permalink: /2022/06/03/image-upload-preview-in-alpinejs.html
description: A quick tip demonstrating how to add image previews in a form using Alpine.js
---

So as I've said a few times now, I'm on kind of a trend here on rebuilding previous demos in either vanilla (i.e. no framework) JavaScript or my new favorite framework, [Alpine.js](https://alpinejs.dev/). In that vein, I've got an update to a post I first wrote nearly a decade ago, ["Adding a file display list to a multi-file upload HTML control"](https://www.raymondcamden.com/2013/09/10/Adding-a-file-display-list-to-a-multifile-upload-HTML-control). I followed that up with a Vue version here: ["Vue Quick Shot - Image Upload Previews"](https://www.raymondcamden.com/2020/03/05/vue-quick-shot-image-upload-previews). The idea was to enhance a form that asks for image uploads by adding a simple preview of the image. This helps as it lets the user be sure they've selected the right file. 

Alpine.js is *very* similar to Vue so a lot of what follows is very close to the previous post. Here's the HTML I used - keep in mind a real form would probably ask for more fields:

```html
<form x-data="imgPreview" x-cloak>
    <label for="imgSelect">Select an Image:</label>
    <input type="file" id="imgSelect" accept="image/*" x-ref="myFile" @change="previewFile">
    <template x-if="imgsrc">
        <p>
        <img :src="imgsrc" class="imgPreview">
        </p>
    </template>
</form>
```

On top, the `x-data` directive maps the form to the JavaScript I'll show in a bit. I've then got a label and my input field. Note the use of `accept` to restrict the user to image files. (And as always, don't forget you can't trust stuff like this. Your code handling the upload will need to verify that an image was really uploaded.) The input field uses `@change` to specify a method to run when the value changes, `previewFile`. Also, note the `x-ref`. Later on, my code will need to directly access the DOM item and this is the Alpine way of doing it. 

The second block handles the preview. I wrap it in an `x-if` so that the preview is only there when a value is present. That value, `imgsrc`, is bound to the image tag. Now let's look at the JavaScript:

```js
document.addEventListener('alpine:init', () => {
  Alpine.data('imgPreview', () => ({
    imgsrc:null,
    previewFile() {
        let file = this.$refs.myFile.files[0];
        if(!file || file.type.indexOf('image/') === -1) return;
        this.imgsrc = null;
        let reader = new FileReader();

        reader.onload = e => {
            this.imgsrc = e.target.result;
        }

        reader.readAsDataURL(file);
    
    }
  }))
});
```

I begin with the Alpine-specific listener, `alpine:init`, and inside that, I create the data for my application, named `imgPreview`. In the application, I've got a grand total of one variable, `imgsrc`, and one method, `previewFile`. In `previewFile`, we first see if a file was selected and if it was an image. If we pass that, we reset `imgsrc` to null (in case they select multiple times) and then create a `FileReader` object. We read it in as a data URL and then set it to the `imgsrc` variable once it's loaded. 

The final part is a bit of CSS to ensure the image stays relatively small:

```css
img.imgPreview {
    max-width: 250px;
    max-height: 250px;
}
```

Want to give it a try? Check out the CodePen below:

<p class="codepen" data-height="500" data-default-tab="html,result" data-slug-hash="LYQBGEz" data-user="cfjedimaster" style="height: 500px; box-sizing: border-box; display: flex; align-items: center; justify-content: center; border: 2px solid; margin: 1em 0; padding: 1em;">
  <span>See the Pen <a href="https://codepen.io/cfjedimaster/pen/LYQBGEz">
  Untitled</a> by Raymond Camden (<a href="https://codepen.io/cfjedimaster">@cfjedimaster</a>)
  on <a href="https://codepen.io">CodePen</a>.</span>
</p>
<script async src="https://cpwebassets.codepen.io/assets/embed/ei.js"></script>
