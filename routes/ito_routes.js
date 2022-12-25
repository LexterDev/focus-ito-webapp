const express = require("express")
const router = express.Router() 

const axios = require("axios"); // Axios to send Async requests
const db = require('../config/db_connection'); // DB conenection to send queries to the database

//Function to get Random Users from RandomAPI
const getRandomUsersList =  async () => {
    try {
        const getRandomUsers = await axios.get(`https://randomuser.me/api?results=10`, {
            headers: { "Accept-Encoding": "gzip,deflate,compress" }
        });

        // Get results from API
        const usersData = await getRandomUsers.data.results

        // Filter only truthy id.value from users and return new user object structure
        const filteredUsers = usersData.filter(user => user.id.value).map(user => {
            return {
                id: user.id.value,
                firstName: `${user.name.title} ${user.name.first}`,
                lastName: user.name.last,
                email: user.email,
                phoneNumber: user.phone,
                picture: user.picture.large,
                randomUser: true
            }
        })

        return filteredUsers;
        
    } catch (error) {
        console.log(error.message);
        return { "error": message};        
    }
}

/*
*
*
EndPoints
*
*
*/

/* get All Users and convine the ones from Random API and the ones from MySQL Database */
router.get('/', async (request, response) => {
    // get users from Random API function above
    const RandomUsers = await getRandomUsersList();

    // DB query
    const rows = await db.query(`SELECT id, firstName, lastName, email, phoneNumber, picture FROM users`);
    //Query results
    const data = rows;

    // Merge results from random API and MySQL
    const mixedUsers = [...RandomUsers, ...data]

    response.json(mixedUsers)
});

/* Save new user and return new User data to frontend */
router.post('/', async (request, response) => {

    // DB query
    let query = `INSERT INTO users (firstName, lastName, email, phoneNumber, picture) VALUES
    ('${request.body.firstName}', '${request.body.lastName}', '${request.body.email}', '${request.body.phoneNumber}', '${request.body.picture}')`;

    //Query results
    const dbQuery = await db.query(query);

    //New User data sent as response to frontend
    const newUserData = {
        id: dbQuery.insertId,
        firstName: request.body.firstName,
        lastName: request.body.lastName,
        email: request.body.email,
        phoneNumber: request.body.phoneNumber,
        picture: request.body.picture
    }

    // If user is successfully saved or not
    if(dbQuery.affectedRows !== 1) {
        response.json({
            message: "Ups! Something went wrong. The user data was not saved. Please, try again!",
            result: false
        })
    } else {
        response.json({
            message: "Great! The user data was successfully saved",
            result: true,
            savedUserData: [newUserData]
        })
    }
});

module.exports = router