---
layout: ../../layouts/articles.astro
title: Brig & Womens Web
dateWritten: June 2026
timeSpan: April 2024 - May 2024
---
Assistant Lead Software Engineer (Back-End Lead) on an 11-person Agile Scrum team building a mock hospital website for Brigham and Women's Hospital. I managed a 3-person sub-team through 3 weekly stand-ups and 2 weekly all-team syncs. I partnered directly with the team lead on weekly AWS deployments, troubleshooting and resolving back-end issues in real time, and frequently served as the primary technical support during deployment windows.  

As of writing, the AWS deployment has been down for more than two years as we were instructed to not have any version of this website up past the conclusion of the course. All of the examples of the website are taken from screen shots in a pdf documentation created during the course. 

I want to start with the game that we made at the very end of the course first, as I sometimes like to have my pudding before eating my meat.

![score board](/img/article/score_board.webp)  

This was the first page that I made fully by myself, frontend and back, the design being inspired by retro arcade machines. The user is able to give up to 3 chars representing their initials. As input it accepts arrow press or mouse clicks to cycle through the 26 english chars (I quickly added a keyboard input option as it got old pretty fast). This page takes those initials, the name of the character used followed by the score, being able to see today's top scores and all time top scores.  

The keen eye (even though this is generously a 720p picture) will spot that the highest score seems to have a really long string, and the eagle eyed _might_ even be able to read it. These scores popped up right after the deployment that allowed people to play the game for themselves. Someone was being bad. And I knew who, but I didn’t immediately know how. So I pen tested our own website.  

I found it pretty quickly as I had done a few weekend hackathons by this point and had been in Cyber Security Club for almost 2 years. Essentially the bad actor re-sent a packet containing a phony score to the database. This was an issue because we were running the game client side and we had no preventative measures against it, even though doing so is futile on a client only webpage. When I interrogated the bad actor, he said that we should “try to hide the values in the put request” and to “not have the score in plain text”. He just wanted us to fix it with an incomplete solution so he could do it all over.  

As this is an impossible problem to solve fully with a client side only game, I had to at least make it harder for bad actors to manipulate the score. But there really was no way to fully stop a room of 100 WPI CS students, so I just made it really really annoying.  

At the start of a game, the user sends a create/update (one user should only be playing one game) to the database on the active_games table with a unique client id and a timestamp created at the starting of the game. When the user dies, it attempts to submit the score. As the score was simply the number of seconds survived, the score is only accepted if the time difference + 5 > score AND score > time difference - 1. Accepted or not, the client id is removed from the active_games table, meaning a bad actor would have to wait in real time to get a false score submitted. All the while, not submitting, playing another game, and sending the false packet within the 6 second grace period. Needless to say, after that was implemented, we got no more false scores.  

In the first meetings with my team, we created our schema and database outline. This was a CRUD database using SQL so we created our ERDs for what we needed in the database. We needed to accommodate users, some with admin status, and out line “nodes and edges”. These were used by the algorithms team to create paths from one location, potentially up or down 4 flights of stairs through the hospital. This is the only ERD that I was able to recover, this is one of many. They had to be built by parsing through a csv file. We were given a new csv file every week so we had to also accommodate uploading new csv files, and downloading in case we needed to record the current state of the database to store or upload again after testing.

![node edges ERD](/img/article/node_edges.webp)

![gamer gabriel](/img/article/bouncing-gabriel.gif)