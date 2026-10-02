# Nostalgic Portfolio Page
By: Gabriel G. Olafsson


##### To run locally on dev
``` bash
npm install
yarn install
yarn run dev
```


## Creation of new Post
### 1. Format markdown files:
``` markdown
---
layout: {route to layout, the same on every file}


title: {title}
dateWritten: {date}
timeSpan: {dates}
tech?: [{tech used}]


color: [{r}, {g}, {b}]
{images or model variables, explained below}
---
{content}
```
###### ex:
``` markdown
---
layout: ../../layouts/articles.astro


title: 'Robots Are Cool'
dateWritten: 'Jan 1985'
timeSpan: 'Jan 1985 - Aug 2020'
tech: [Robots, Computers]


color: [192, 168, 0]
{images or model variables, explained below}
---
# Robots
Cool! Am I right?
```


You can either have glb 3d files or >=1 image to be displayed on the channel


### Header depending if you have a 3d model or just images:
Additional 3d File variables:


> **animationSvgDir**: *string*
> <small>&nbsp; &nbsp; &nbsp; path to svg created for repeating background. svg pattern is specifically created to repeat by only having content touch the top left and bottom right
> &nbsp; &nbsp; &nbsp; **optional**: it will default to a star svg</small>
>
> **animationSvgDimentions**: *list of int, len 2*
> <small>&nbsp; &nbsp; &nbsp; [length, width] in pixels of the svg pattern, constant so better than finding it on every load
> &nbsp; &nbsp; &nbsp; **optional ONLY IF animationSvgDir skipped**: if will default to the size of the star, will look janky </small>
>
> **baseDir**: *string*
> <small>&nbsp; &nbsp; &nbsp; path to model: "/scans/{file name (slug)}.glb"</small>
>
> **baseRotation**: *list of number, len 3*
> <small>&nbsp; &nbsp; &nbsp; **optional**: [{y rotation offset}, {x rotation offset}, {y vertical offset}]  </small>
>
> **animationRotation**
> <small>&nbsp; &nbsp; &nbsp; **optional**: [{y rotation (spinning top)}, {x rotation (like an agreeable head nod, bound by cos)}, {bounds of bounce (buoy on the sea)}]  </small>
>
> **scale**
> <small>&nbsp; &nbsp; &nbsp; **optional**: [{y rotation (spinning top)}, {x rotation (like an agreeable head nod, bound by cos)}, {bounds of bounce (buoy on the sea)}]  </small>
>
> **direction**
> <small>&nbsp; &nbsp; &nbsp; either positive number or negative. From a bird's eye view, positive will spin clockwise, negative will spin counter clockwise  </small>
> <small>&nbsp; &nbsp; &nbsp; **optional**: will default to 1, spinning clockwise </small>


</br>


Additional Image variables:
> **imgPaths**: *list of string, min len of 1*
> <small>&nbsp; &nbsp; &nbsp; ["img/{}", ...] list of all paths to image files </small>


> [!TIP] Don't worry about the image file sizes
> The deployment pipeline converts all images to webp, compresses aggressively, and changes all references from the old image extension to webp


> [!WARNING] Crop images to have ~20% non-important padding on the sides
> Makes things look less cramped and makes the main content visible at most all viewports, the main content should always be in view


Example of header of a 3d file
``` markdown
---
...
animationSvgDir: /svg/mask-article.svg
animationSvgDimentions: [120, 44]
color: [0,180,0]
model: {
   baseDir: /scans/article,
   baseRotation: [0.1, 3.8, 0],
   direction: -1
}
---
```


Example of header with images:
``` markdown
---
...
color: [99,159,189]
imgPaths: [/img/channel/article_001.jpeg, /img/channel/article_002.png]
---
```
</br>


> [!NOTE] make sure all references are [github flavored](https://github.github.com/gfm/) not obsidian flavored, really only two main differences:
``` markdown
---
Obsidian version
---
# title to go to:
go to [[#title to go to:|title]]
```
``` markdown
---
Altered version for astro
---
# title to go to:
go to [title](#title-to-go-to)
```
Basically, Obsidian uses wiki styled linking which is not supported and needs to be changed. Astro also does some formatting to replace all spaces with "-" and remove chars like ":". For more detailed information reference [markdown in Astro](https://docs.astro.build/en/guides/markdown-content/)
``` markdown
---
example of picture in markdown
---
look at this supper cool picture I took
![](../../../public/img/picture.png)
```
``` markdown
---
example of linking to another article
---


# linking to the article
[article](/article/article)
Note that Astro uses the file name as the route. Using the title will not work.


# linking another articles header
i need to make a link to acticle's [title](/article/article#title-to-go-to)
```
#### Note: make new lines in markdown correctly! Put two spaces at the end of a line to have a break. This is capped at two <br/> (double space and break line enter), if you need more you must include <br/> directly in the markdown file


### 2. Alter /src/data/channels-with-order.json
> [!WARNING] Order Matters!!!
> It's really the only thing that matters in this file frankly, oh and you need it in this json file if you want it to be displayed at all. This file was created so that adding articles and changing order would take 2 seconds instead of manual editing of it all


Here is a hypothetical channels-with-order.json file containing slugs (the file name of the markdown file in your articles folder) to two articles, dd and ee:
``` json
[
   "dd",
   "ee"
]
```
resulting (abstractly) in the following main page:
```
[ dd ] [ ee ] [ -- ] [ -- ]
[ -- ] [ -- ] [ -- ] [ -- ]
[ -- ] [ -- ] [ -- ] [ -- ]
```


Or maybe you want to have something that goes right in the middle of several other articles:
Example of adding an article before :
``` json


[
   "dd",
   "ee",
   "kk",
   "ff",
   "gg",
   "ii",
   "jj",
   "ll"
]
```
resulting (abstractly) in the following main page:
```
[ dd ] [ ee ] [ kk ] [ ff ]
[ gg ] [ hh ] [ ii ] [ jj ]
[ jj ] [ ll ] [ -- ] [ -- ]
```


### 3 Option: To use scans or images?


Now you can choose to either make scans or upload images.


If you are just uploading images you just saved yourself about 40 minutes and you can jump right to [uploading files](#5-uploading-files). Otherwise, continue as normal and be happy that these 40 minutes will result in a really cool visual, way cooler than images.


### 4 Scans for main page
#### 1. Make the scan on Luma Ai
Best to do this on an overcast day outside to limit the shadows. If that is not an option, try to use as many lights as possible and to diffuse as much as you can. It's a retro web app, so if it looks bad, just call it a part of the aesthetic.


Export as a low poly obj


#### 2. Blender
Transfer the file from your phone to computer


Open Blender, delete the default square,
File, import, wavefont (.obj)


If you are now freaking out about the textures, don't worry. In the top right of the scene you should see 4 texturing circles. Click the one on the far right to see the textures


Set the origin of obj to the center of the world
 - Right click obj, Snap, Cursor to World Origin
 - Right click obj, Set Origin, Origin to Geometry
 - Right click obj, Snap, Selection to Cursor


Correct any orientation issues with the rotation tool on the left


If your model has some hanging polygons or some polygons you don't want to include - go into the modeling tab on the top (should be to the right of the file by a little bit) and go through and delete some ploys. Quick tip: hold shift and left click and drag an area that you want to get rid of, then middle mouse to move around and highlight more. This is much better than deleting 15 times, time way you only really delete 3-4 times.


After removing the hanging polys, you might want to do another snap to origin, you can also just move the model ( thats what I do )


export as an mlb in the public/scans/{ folder name }
The file size will be compressed on deployment via [draco](https://github.com/google/draco), and decoded by the browser


### 5. Uploading files
Keep in mind the file structure! within /public/img there are two folders because: /article will be compressed to have a file size of at most 250Kb, and /channel will be compressed quite aggressively to at most 25Kb :
``` markdown
/portfolio_content
 /public
   /svg
     mask-article.svg
     ...
   /img
     /article
       picture_of_a_horse.jpg
       ...
     /channel
       picture_001.png
       picture_of_a_horse.jpg
       ...
   /scans
     article.glb
     ...
 /src
   /pages
     /articles
       article-scan.md
       article-pictures.md
       ...
```
The two hypothetical md files:
``` markdown
---
layout: ../../layouts/articles.astro


title: Article With Scans
dateWritten: Jan 1 1970
timeSpan: Jan 1 1970 - Jan 19 2038


color: [180,180,0]
animationSvgDir: /svg/mask-article.svg
animationSvgDimentions: [120, 3]
model: {
   baseDir: /scans/article
}
---


I forgot to bring my camera to the epochalypse. Kicking myself cause I could have been the first person to take a digital photo in the year 1970.


```




``` markdown
---
layout: ../../layouts/articles.astro


title: Article With A Cool Picture of a Horse
dateWritten: Jan 1 1970
timeSpan: Jan 1 1970 - Jan 19 2038


color: [180,180,0]
imgPaths: [/img/channel/picture_001.png, /img/channel/picture_of_horse.jpg]
---


![horse](/img/article/picture_of_horse.jpg)
^ my favorite picture of a horse. so cool.


```


Update your json file based on with model or with images, if you need the reminder: [ordering json file](#2-alter-srcdatachannels-with-orderjson)


Make sure it looks alright on local, push it to dev. If cloudflare approves of it, merge that baby to prod! You just published your new article!

