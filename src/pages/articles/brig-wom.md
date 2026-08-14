---
layout: ../../layouts/articles.astro
title: Brig & Womens Web
dateWritten: June 2026
timeSpan: April 2024 - May 2024
---
Assistant Lead Software Engineer (Back-End Lead) on an 11-person Agile Scrum team building a mock hospital website for Brigham and Women's Hospital. I managed a 3-person sub-team through 3 weekly stand-ups and 2 weekly all-team syncs. Partnered directly with the team lead on weekly AWS deployments, troubleshooting and resolving back-end issues in real time, and frequently served as the primary technical support during deployment windows.

As of writing, the AWS deployment has been down for more than two years, and we were told not to have any versions of this website alive past the end of the class, so all of the examples of the website are taken from screen shots in a pdf from the extensive documentation created during the course. 

I want to start with the game that we made at the very end of the course first as I sometimes like to have my pudding before eating my meat.

![score board](/img/score_board.webp)  

This was the first page that I made fully by myself, frontend and back. The design being inspired by retro arcade machines. The user is able to give an up to 3 char name with a similar style (I added keyboard input, it got old pretty fast), and then lists what character they used to achieve that score. 
The keen eye, even though this is generously a 720p picture, will spot that the highest score seems to have a really long string, and the eagle eyed **might** be able to even read it. This happened right after we allowed other people to start playing the game for themselves. Someone was being bad. And I knew who, but I didn't immediately know how. So I pen tested our own website. 
I found it pretty quickly as I had done a few weekend hackathons by this point and had been in
Cyber Security Club for almost 2 years. Essentially what the bad actor did was resend a packet containing a phony score to the database. This was an issue because we were running the game client side and we had no preventative measures against it. He said that we should "try to hide the values in the request and not have them in plain text". That guy just wanted us to fix it with an incomplete solution so he could do it again. 
As this is impossible to fully solve this issue with a client side only game, I had to make it harder for bad actors to manipulate the score, but there really was no way to fully stop a room of 100 WPI CS students, I just made it really really annoying.
At the start of a game, the user sends a create/update (one user can only be playing one game) to the database on the active_games table with a client id and timestamp. When the user tries to submit their score, triggered by dying, it attempts to submit the score. As the score was the number of seconds survived, the score was only accepted if the time difference + 5 > score, if anyone out there has 5000ms of ping, I just flat feel bad. Accepted or not, the client id was removed from the active_games table, meaning a bad actor would have to wait in real time to get a false score submitted, while not submitting or playing another game. Needless to say, after that was implemented, we got no more false scores.

In the first meetings with my team, we created our schema and database outline. This was a CRUD database using SQL so we created our ERDs for what we needed in the database. We needed to accommodate users, some with admin status, and out line "nodes and edges". These were used by the algorithms team to create paths from one location, potentially up or down 4 flights of stairs through the hospital. This is the only ERD that I was able to recover, this is one of many. They had to be built by parsing through a csv file. We were given a new csv file every week so we had to also accommodate uploading new csv files, and downloading in case we needed to record the current state of the database to store or upload again after testing.  

![node edges ERD](/img/node_edges.jpg)

![gif time](/img/bouncing-gabriel.gif)