# Admin Dashboard

## What is this?
This is an admin dashboard I've been working on for Claire to be able to modify the questions using a visual interface.  
It's also meant to automate some of the work. For example, changing the ID of a question automatically changes its ID in all the related questions (ones that have it as next or showCondition).

## What can it do now?
Not much, it can only automate the ID change of a question as I mentioned above.  
What's valuable about it is that you don't have to implement a dashboard from scratch, which will save you a couple of hours to a day.  
It already has the HTML structure, and a semi-functional JS skeleton code.  

## What does it need?
### 1) Frontend - complete the JS skeleton code to achieve all functionality.
   - I created empty function declaration for all functionality in admin-dashboard.js.
   - You can either do it your own style or just fill out these function declarations.
### 3) Backend - implement a server listener code (check out how to with NodeJS).
   - This should listen to any updates to the copied/modified version of questions (in admin-dashboard.js).
   - It should automatically replace questions.json with that modified version.
   - It should run at all times (check out mp2 to do it with terminal), even when server restarts (mp2 startup).
   - If you can't run it at all times, it should run periodically (check out cron jobs).

Good luck!
