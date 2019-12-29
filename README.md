# LibSys
LibSys is a single page web application that was made for the purpose of borrowing and returning books, and keep track of the history.

The app allows users to search for a specific book, issue a borrow and a return request, track their borrow history, and track their request ticket's history.

It has an administrator functionality that allows admins to accept or decline borrow and return requests, edit and delete a book, and search for a specific user. LibSys records the borrow and edit history of each book, the ticket history of every user, and the history of the tickets as well. 

LibSys is written using the `MERN stack` (`MongoDB`, `ExpressJS`, `ReactJS`, and `NodeJs`) and `Semantic UI` for the front end.

<br>

## Live Demo
[Live demo](joshking-libsys.herokuapp.com) of the app. Use `admin@gmail.com` as username and password to access the admin account. Feel free to create a new user, add a new book, borrow books, etc. Play around with the app.

<br>

## Installation and Setup Instructions


<br>

__Config File__
The configuration file can be created by user. `env-cmd` module loads `dev.env` file which should be found in `./config/dev.env`.
```
MONGO_URI=""
JWT_SECRET=""
```

<br>

## Roadmap
The following is the list of future features:
* Uploading a photo for book cover and for user's profile photo (`Multer`)
* Ticket expiration; Ticket expires after 12 hours of unanswered request (`Cron`/`Kubernetes' Cronjob`)
* Notification feature; Notify users when admins accepts/declines their request (`AWS SNS`, `Rabbit MQ, Mailer`)
* SuperUser; SU is able to send out emails to add more administrators
* Mobile responsive design

<br>

## Authors and acknowledgment

<br>

## Project Status
This project has reached the minimum viable product. Further development has slowed down. 
