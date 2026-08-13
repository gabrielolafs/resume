# Nostalgic Portfolio Page
By: Gabriel G. Olafsson

##### To run locally
``` bash
npm run dev
```

## Below are the steps to add a new post. You should be in a dev branch just in case
### 1. Format markdown files:
``` markdown
---
layout: {route to layout, the same on every file}

title: {title}
dateWritten: {date}
timeSpan: {dates}
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
---
# Robots
Cool! Am I right?
```
#### Note: make sure all references are [github flavored](https://github.github.com/gfm/) not obsidian flavored, really only two main differences:
``` markdown
--- 
Obsidain version
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
Basically, Obsidian uses wiki styled linking which is not supported and needs to be changed. Astro also does some formating to the replace all spaces with "-" and remove chars like ":". For more detailed information reference [markdown in Astro](https://docs.astro.build/en/guides/markdown-content/)
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
First the reason I have this json file. Everything could be in the article header, but that would require much back and forth. The main reason this exists is for ordering. The index is based off of its position in the json file which makes it much cleaner to move any article (the other option was index in the header, O(n) operation preformed much like popping a index other than -1 out of an array). 
Order matters! Where the new article will be placed on the main page is based on the index position. It is done this way so that the order can easly be changed by just copy pasting sections around (I didnt like using numbers to indicate placement as if I wanted to add a new article at the start I would have to change every single value)  
Dont forget to do this! There is a block on the main page that will not accept or render the article if it is not in this json file. If you cant figure out why it is not displaying anything, this is almost definatly the cause
Do keep in mind that this requires all of the files to be uploaded before working fully,

Stucture and reasoning:
``` json
[
    { // with a scan
        "slug": "ex", // file name of article minus extention - this would lead to ex.md and subsiquently /articles/ex.md
        "color": [250, 250, 250], // color of channel background
        "animationSvgDir": "/svg/ex.svg", // path to the svg made for animation. Optional, it will default to stars
        "animationSvgDimentions": [120, 44], // dimentions of the veiwbox that creates the svg. used for fluid diagonal channel animation. placed here as it is immutable at runtime, so js code to read the size on load everytime is a little silly (if animationSvgDir was skipped, skip this too, animation will get messed up else wise)
        "model": {
            "baseDir": "/scans/ex", // base dir of the scan
            "baseRotation": [0.8,4.4,0], // starting / default [x, y, z] values. Wanted more customizablitly than doing it hard coded in blender. 
            "animatedRotation": [0, 0, 0], // [rotaion about y (like an owl head), rotation about x, bound by a cos() (like a head nodding yes), "bouce" max height (like a buoy on the sea)]
            "scale": 1, // only really needs to be scaled if scan is massive, even then you can accomidate in Blender
            "direction": -1 // optional, defaults to clockwise (from birds eye), -int will change the direction to counter clockwise 
        }
    },
    { // using images and fading instead of obj file
        "slug": "ex", 
        "color": [250, 250, 250],
        "imgPaths": ["/img/ex_01.webp", "/img/ex_03.webp", "/img/ex_02.webp"] // list of images in the order you want them to be displayed. webp, png, doesnt matter. it will scale to fill, so keep that in mind when selecting images. make sure your images buffer space of about 20% x and y and that the content of the image is in the direct center
        // no model + no animation svg because I chose they should not be rendered on img switching
    }
]
```

Example of adding an article before ex:
``` json 

[
    {
        "slug": "dx",
        ...
    },
    {
        "slug": "ex",
        ...
    }
]

// this would abstractly result in the following main page:
/* 
[ dx ] [ ex ] [ -- ] [ -- ]
[ -- ] [ -- ] [ -- ] [ -- ]
[ -- ] [ -- ] [ -- ] [ -- ] 
 */
```

Or maybe you want to have something that goes right in the middle of serveral other articles:
Example of adding an article before :
``` json 

[
    {
        "slug": "dx",
        "model": {...}
    },
    {
        "slug": "ex",
        "model": {...}
    },
    {
        "slug": "lx", // lx was really important and needed to be shown here
        "model": {...}
    },
    {
        "slug": "fx",
        "model": {...}
    },
    {
        "slug": "gx",
        "model": {...}
    },
    {
        "slug": "ix",
        "model": {...}
    },
    {
        "slug": "jx",
        "model": {...}
    },
    {
        "slug": "kx",
        "model": {...}
    }
]

// this would abstractly result in the following main page:
/* 
[ dx ] [ ex ] [ lx ] [ fx ]
[ gx ] [ hx ] [ ix ] [ jx ]
[ jx ] [ kx ] [ -- ] [ -- ]
 */
```

The abilty to move things around at will was very important and makes it very easy to copy paste sections to test out new layouts.

### 3 Pick Your Own Adventure

Now you can chose to either make scans or upload images.

if you are just uploading images you can jump right to [uploading files](#5-uploading-files), just make sure that you upload the images into /public/img/ and that your json entry look something like this:


### 4 Scans for main page
#### 1. Make the scan on Luma Ai
About a 10-15 min process for your first time. It gets better with time. 
Make sure you are in a well lit area and you dont have any dark spots. Personally I go ouside in the afternoon when the sun is hiding behind trees, the indoor scans have come out pretty wonky ( wpi home nextwork for example )

Export as a low poly obj

#### 2. Blender
Transfer the file from your phone to computer

Open Blender, delete the default square,
File, import, wavefont (.obj)

If you are now feaking out about the textures, dont worry. In the top right of the scene you should see 4 texturing circles. Click the one on the far right to see the textures

Set the origin of obj to the center of the world
  - Right click obj, Snap, Cursor to World Origin
  - Right click obj, Set Origin, Origin to Geometry
  - Right click obj, Snap, Selection to Cursor

Correct any oriantation issues with the rotation tool on the left

If your model has some hanging polygons or some polygons you dont want to include - go into modeling tab on the top (should be to the right of file by a little bit) and go thru and delete some ploys. Quick tip: hold shift and left click and drap an area that you want to get rid of, then middle mouse to move around and high light more. This is much better than deleting 15 times, time way you only really delete 3-4 times.

After removing the hanging polys, you might want to do another snap to origin, you can also just move the model ( thats what I do )

export as obj in the public/scans/{ folder name }
be sure to include the matterial on the right side, and to set the Path Mode to Copy 
reminder to name the files as mesh_lowpoly, so name the file you are exporting as mesh_lowpoly.obj

#### 3. Rescaling textures

We dont need too much detail for the scans. couple things we want to change

Down scale each image by a factor of 2
Export as a webp file
Change all references in the .mtl from mesh_lowpoly_material{}_map_Kd.png to mesh_lowpoly_material{}_map_Kd.webp

### 5. Uploading files
Keep in mind the file stucture! This is how I have set up my obsidian folder (minus the scans, incuded as with it is a good example of general file struct the project when uploading):
``` markdown
/portfolio_content
  /public
    /img
      picture.png
      ...
    /scans
      /a-scan
        mesh_lowpoly_material0000_map_Kd.png
        ...
        mesh_lowpoly.obj
        mesh_lowpoly.mtl
      ...
  /src
    /pages
      /articles
        article.md
        ...
```

Grab your markdown files and put them into /src/pages/articles/article.md
Grab your photos and put them into /public/img
Grab your scan folder and throw it into /public/scans

Update your json file based on with model or with images, if you need the reminder: [json formating w/ reasoning](#2-alter-srcdatachannels-with-orderjson)

As long as it looks good, thats it! Push it to dev, and if cloudflare says its good, you can make a pr, merge it into prod, and cloudlflare will deploy!

# Current TODOs For what I want In V4:

- [ ] make a scan uploader and scaler (better network latency). Given a folder it will convert all of the scans png files and scale them down to a webp file. This would also need to change the .mtl file .png refereneces to .webp files. This can use the .json file as readonly (only changing content in files referenced by this .json file) on build and hook into the deployment pipeline. Potential idea that I dont think would be worth the time: take in md file, asks where the user where it should go in the channel and alter the json file acordingly. Would be great for user experience but not worth the time.
- [ ] animate that mii I made: rig it in blender, create an waving animation
- [ ] animation using three js to do page changes to zoom in and out to the channel. This will be a rough one, I have tried a few times already with no real success. Give it like 15 (bajillion) story points