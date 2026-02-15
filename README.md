# Nostalgic Portfolio Page
By: Gabriel G. Olafsson

##### To run locally
``` bash
npm run dev
```

## Below are the steps to add a new post
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
title: example of linking to another article
---

# linking to the article
[article](/article/article)
Note that Astro uses the file name as the route. Using the title will not work.

# linking another articles header 
i need to make a link to acticle's [title](/article/article#title-to-go-to)
```
#### Note: make new lines in markdown correctly! Put two spaces at the end of a line to have a break

### 2. Change the src/data/article-order.json (order will matter once paging is implemented):
``` json
{
  "articles": [
      "article"
  ]
}
```
To add an article after the first:
``` json
{
  "articles": [
      "article",
      "artwocle"
  ]
}
```

### 3. Uploading files
Keep in mind the file stucture! This is how I have set up my obsidian folder
``` markdown
/portfolio_content
  /public
    /img
      picture.png
      ...
  /src
    /pages
      /articles
        article.md
        ...
```
Grab your markdown files and put them into /src/pages/articles/article.md
Grab your photos and put them into /public/img

As long as it looks good, thats it! Just make a pr and merge it in, and cloudlflare will deploy!



# Current TODOs somewhat ordered by importance:
``` markdown
-[ ] Make a logo for myself
-[ ] Change the icon in the tab to be this logo

-[x] Astro (specifically the markdown implementation)
  -[x] Serving markdown files
  -[x] Styled well - really tough - for me
    -[x] Centered + space for arrows - zooming could cause issues?
    -[x] Use a color pallet close - lot of time for research  
    -[x] Use the font they use - easy? it has to be somebodies special interest
  -[x] Link to other articals (I know that the arrows will throw a wrench in this - it was pretty easy to account for in markdwon, might not be as big an issue as I though it would be)
  -[x] Be able to move from file to file (routing)

-[ ] Main bottom banner
  -[x] Circle buttons
    -[x] Styled
    -[x] Able to take svgs as an arg
  -[x] Outline in blue
  -[x] grey background
    -[ ] Fix small spacing glitch? I think all it is a rounding issue combining px and percent - maybe just round to the nearest pixel?
  -[x] Drop shadows on buttons
  -[ ] Shadows from the outline. This one I have been struggling with a lot. I think I will have to make a new svg path for each with a height that is taller than it used to be for everything. that would solve the issue of the center line being cut off. But the curves are the real stickler. I have to do some research on how to cast a shaodow downwards from an svg. I thought I had something that would work (linear gradient) but it has not yet and it would be messed up on the scaling so I have not gotten anything that looks good yet. radial and linear??? make them all into one svg and use other variables in order to scale on the x????? Ive spent like 2 hours on this alone, I have to figure it out
  -[x] svg mail icon for right side
  -[ ] modal for the right side (email). this is were I will have all of the links to get in touch with me.
    -[ ] link all [github, linkedin, email] (would be really cool if i found or recrated the ond linkedin logo and stuff like that to make it more acurate to the time period)
  -[x] svg for the left side (do i mess with the outline?? i just cant tell)
    -[ ] link to my resume (will be my resume link - not sure if I want a dedicated page at this time or just have it be a download link. Well have to think on it more.)

-[ ] Article bottom nav
  -[ ] grey color background
  -[ ] svg with the ever so slightest curve to it 
    -[ ] grey fill
    -[ ] black line
    -[ ] no shadow?
  -[x] Buttons with blue outline [Home, Fullscreen] (~~in page navigation is going to be a little weird... i dont know a nice way to acomidate all the linking without the user just pressing the back button~~ Al told me how to open in a new tab which I had given up on but it is like super easy - implementing it in Astro might get a little weird tho. _blank)
    -[x] General styling
    -[ ] Truely Styled (have the same size and really hone in that svg path)
    -[ ] animation??

-[ ] Main Page
  -[ ] Create a 1d array from the json file 
  -[ ] teasiers for each of the projects that I have worked on
    -[ ] want to acomidate the mobile users - this will 
  -[ ] if > 8 pages (this is something I dont think is wize to do at this time and this is something that is more of a very end game task)
    -[ ] page flipping 
    -[ ] tease the next few


-[ ] three js
  -[ ] crt filter
  -[ ] animate full screen fuction
  -[ ] implement 3d files into markdown files (technical challenge, plus tedious to make the files)

-[ ] mobile support
  -[ ] change clickable count (2 x 4 icons?) on main page
  -[ ] move arrow buttons to a more comfortable place
  -[ ] 

-[ ] change cursor (super small thing but i think it very important)

-[ ] Make a proper Readme
```