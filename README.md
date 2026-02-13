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
Basically, Obsidian used wiki styled linking which is not supported so that need to change. Astro also does some formating to the replacing all spaces with "-" and removing chars like ":". for more detailed information reference [markdown in Astro](https://docs.astro.build/en/guides/markdown-content/)
``` markdown
---
example of picture in markdown
---
look at this supper cool picture I took
![](../../../public/img/picture.png)
```
#### Note: make new lines in markdown correctly! Put two spaces at the end of a line

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
-[ ] Astro
  -[x] Serving markdown files
  -[ ] Styled well - really tough - for me
    -[ ] Centered + space for arrows - zooming could cause issues?
    -[x] Use a color pallet close - lot of time for research  
    -[x] Use the font they use - easy? it has to be somebodies special interest
  -[ ] Link to other articals (I know that the arrows will throw a wrench in this)
  -[x] Be able to move from file to file (routing)

-[ ] Bottom nav - for each page - banner?
  -[ ] Overlays with a grey color
  -[ ] Buttons with blue outline [Home, Fullscreen] (in page navigation is going to be a little weird... i dont know a nice way to acomidate all the linking without the user just pressing the back button)

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