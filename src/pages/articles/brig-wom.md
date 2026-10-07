---

layout: ../../layouts/articles.astro

title: Brigham & Women's Web

dateWritten: June 2026

timeSpan: April 2024 - May 2024

tech: [TypeScript, React, Express, Prisma, PostgreSQL, AWS, ERD, CRUD, Pen Testing, CSV Parsing]

  

color: [123, 161, 201]

imgPaths: ["/img/channel/hero.webp", "/img/channel/service_request.webp" ]

---

Assistant Lead Software Engineer (Back-End Lead) on an 11-person Agile Scrum team building a mock hospital website for Brigham and Women's Hospital. I managed a 3-person sub-team through 3 weekly stand-ups and 2 weekly all-team syncs. I partnered directly with the team lead on weekly AWS deployments, troubleshooting and resolving back-end issues in real time, and frequently served as the primary technical support during deployment windows.

  

<hr/>

  

As of writing, the AWS deployment has been down for more than two years as we were instructed to not have any version of this website up past the conclusion of the course. All of the examples of the website are taken from screen shots in a pdf documentation created during the course.

  

I want to start with the game that we made at the very end of the course first, as I sometimes like to have my pudding before eating my meat.

  

![score board](/img/article/score_board.webp)

This was the first page that I made fully by myself, frontend and back, the design being inspired by retro arcade machines (ignore the pink indicators). The user provided up to 3 "initial" characters, either through arrow/mouse input, cycling through valid characters, or by using the keyboard. Based off the SQL table I created, this page displayed those "initials" along with their score and the playable character used to achieve that score. This sorted by highest score, and can either display the top scores of that day or all time high scores.

  

The keen eye (even though this is generously 720p) will spot that the highest score seems to have a really long string, and the eagle eyed _might_ even be able to read it. These scores popped up right after the deployment that allowed people to play the game for themselves. Through some detective work, I was able to figure out who had done it (giggling and whispering to your friends every time you see me walk by is not the best way to keep a secret, fyi) but I had to find out how it was done. The next investigation technique I used was pen testing our own website.

  
I had been a member of the Cyber Security Club for almost 2 years and had participated in several hackathons, so I found it relatively quickly. The bad actor re-sent a packet containing a phony score to the database. The game ran exclusively on the client and we had no preventative measures against it, plus doing so wasn't possible without changing the game logic. When I confronted and interrogated the perp, they said that we should “try to hide the values in the put request” and to “not have the score in plain text”. They just wanted us to fix it with an incomplete solution so they could do it all over again. This perp was a serial hacker.

  

As this is an impossible problem to solve fully with a client side only game, I had to at least make it harder for bad actors to manipulate the score. There really was no way to fully stop a room of 100 WPI CS students, so I just made it really really annoying.

  

Starting a game caused a create/update (one user should only be playing one game) to the database on the active_games table with a unique client id and a timestamp created at the starting of the game. When the user dies, it attempts to submit the score. As the score was simply the number of seconds survived, the score is only accepted if the time difference + 5 > score AND score > time difference - 1. Any potential bad actor would have to wait in real time to get the false score submitted, all the while, not submitting, not starting another game, and successfully sending the cheated packet within the 6 second grace period. Needless to say, after that was implemented, we got no more false scores.

  

###### My playable character from this game:
<br/>
<br/>
<img src="/img/article/bouncing-gabriel.webp" style="box-shadow: none; height: min(75dvh, 60dvw);">