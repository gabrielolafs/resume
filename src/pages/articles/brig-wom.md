---
layout: ../../layouts/articles.astro
title: Brig & Womens Web
dateWritten: June 2026
timeSpan: April 2024 - May 2024
---
Assistant Lead Software Engineer (Back-End Lead) on an 11-person Agile Scrum team building a mock hospital website for Brigham and Women's Hospital. I managed a 3-person sub-team through 3 weekly stand-ups and 2 weekly all-team syncs. I partnered directly with the team lead on weekly AWS deployments, troubleshooting and resolving back-end issues in real time, and frequently served as the primary technical support during deployment windows.  

As of writing, the AWS deployment has been down for more than two years as we were instructed to not have any version of this website up past the conclution of the course. All of the examples of the website are taken from screen shots in a pdf documentation created during the course. 

I want to start with the game that we made at the very end of the course first, as I sometimes like to have my pudding before eating my meat.

![score board](/img/score_board.webp)  

This was the first page that I made fully by myself, frontend and back, the design being inspired by retro arcade machines. The user is able to give up to 3 chars represending their initials, the frontend style also mimicing this retro esthetic, accepting input through arrow input or mouse clicking through an array of the 26 english chars (I quickly added a keyboard input option as it got old pretty fast). It then uses this len 3 str to list allong with character they and the score they acheived.  

The keen eye, even though this is generously a 720p picture, will spot that the highest score seems to have a really long string, and the eagle eyed _might_ be able to even read it. This happened right after the deployment that allowed other people to play the game for themselves. Someone was being bad. And I knew who, but I didn't immediately know how. So I pen tested our own website.  

I found it pretty quickly as I had done a few weekend hackathons by this point and had been in
Cyber Security Club for almost 2 years. Essentially what the bad actor did was resend a packet containing a phony score to the database. This was an issue because we were running the game client side and we had no preventative measures against it. When I interigated the bad actor, he said that we should "try to hide the values in the put request" and to "not have the score in plain text". He just wanted us to fix it with an incomplete solution so he could do it again.

As this is an impossible problem to solve fully with a client side only game, I had to at least make it harder for bad actors to manipulate the score, but there really was no way to fully stop a room of 100 WPI CS students, so I just made it really really annoying.  

At the start of a game, the user sends a create/update (one user should only be playing one game) to the database on the active_games table with a client id and timestamp. When the user dies, it attempts to submit the score. As the score was the number of seconds survived, the score is only accepted if the time difference + 5 > score, if anyone out there has 5000ms of ping, I just flat out feel bad them. Accepted or not, the client id is removed from the active_games table, meaning a bad actor would have to wait in real time to get a false score submitted, while not submitting or playing another game. Needless to say, after that was implemented, we got no more false scores.

In the first meetings with my team, we created our schema and database outline. This was a CRUD database using SQL so we created our ERDs for what we needed in the database. We needed to accommodate users, some with admin status, and out line "nodes and edges". These were used by the algorithms team to create paths from one location, potentially up or down 4 flights of stairs through the hospital. This is the only ERD that I was able to recover, this is one of many. They had to be built by parsing through a csv file. We were given a new csv file every week so we had to also accommodate uploading new csv files, and downloading in case we needed to record the current state of the database to store or upload again after testing.  

![node edges ERD](/img/node_edges.webp)

![gamer gabriel](/img/bouncing-gabriel.gif)