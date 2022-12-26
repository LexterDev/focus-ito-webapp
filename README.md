# Focus ITO WebApp with Node JS

This is an example app to manage users.

**App requirements:**

- Node JS
- Express
- Nodemon (for develepment only)
- MySQL
- mysql2
- Axios

Install those packages by running *npm install* after cloning the repo.

### Usage

By default, the app uses a testing environment for MySQL [https://db4free.net/](https://db4free.net/), but you can also find the .sql file to create the database locally. If you do so, you just need to edit the *config/db_config.js* file, for example:

```
const db_config = {
    db: {
      host: "localhost", //Add you host name here 
      user: "username", // Your DB User
      password: "password", // Your DB Password
      database: "DbName", // Your DB Name
    }
  };
```

After setting up the app, you can start the app by executing: *npm run dev*

### Comments
Since the app requests random users from [https://randomuser.me/api?results=10](https://randomuser.me/api?results=10) and we cannot manipulate that resource to delete/add users, so the app only allows to delete users that have been in the app, not the ones comming from the random API. 



