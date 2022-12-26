addEventListener('DOMContentLoaded', () => {
    //DOM Elements
    const cardsContainer = document.querySelector('#usersResults')
    const loader = document.querySelector('#loader')
    const frmNewUser = document.querySelector('#frmNewUser')
    const btnCloseFrm = document.querySelector('#frmBtnClose')
    const btnSpinner = document.querySelector('.save-spinner')

    //AJAX base function
    const ajaxRequest = async (url, method = 'GET', body = null) => {

        // Show loader when sending request
        loader.style.opacity = 1
        loader.style.display = 'block'
        btnSpinner.style.display = 'inline-block'
        

        // customized Fetch request
        try {
          const response = await fetch(url, {
            method: method,
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: (body) ? new URLSearchParams(body) : null,
          })
          loader.style.opacity = 0
          loader.style.display = 'none'
          btnSpinner.style.display = 'none'
          return response.json()
        } catch (error) {
            alert(`${'Ups! Something went wrong, we cannnot process your request. Reasons: '}${error.message}`)
          console.log(error)
        }
    }

    //Draw users in DOM based on data obaject
    const drawUsers = (dataObject, targetElement, newUser = false) => {
        if(!newUser) targetElement.innerHTML = ''
        const cssClasses = ['col', 'col-md-6', 'col-12', 'col-lg-4', 'mt-3']
        
        for (const user of dataObject) {
            let btnDisabled = "disabled",
                htmlContent = '';
            
            const card = document.createElement('div')
            card.classList.add(...cssClasses)
            if(typeof user.randomUser == 'undefined') btnDisabled = "enabled"

            htmlContent = `
                    <div class="card shadow-sm mt-3">
                        <img src="${user.picture}" class="card-img-top" alt="${user.firstName} ${user.lastName}">
                        <div class="card-body">
                            <h5 class="card-title">${user.firstName} ${user.lastName}</h5>
                            <p class="card-text">${user.email}</p>
                            <p class="card-text">${user.phoneNumber}</p>
                            <button type="button" class="btn btn-danger btn-delete-user" data-user-id='${user.id}' ${btnDisabled}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-trash" viewBox="0 0 16 16">
                                <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z"/>
                                <path fill-rule="evenodd" d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z"/>
                            </svg>
                            Delete
                            </button>
                        </div>
                    </div>`
            card.innerHTML = htmlContent
            targetElement.appendChild(card)
        }
    }

    //Submit form to create a new user 
    if(frmNewUser) {
        frmNewUser.addEventListener('submit', event => {
            event.preventDefault()

            //Get user gender to get a man or women profile pic
            let userGender = event.target.userGenderInput.options[event.target.userGenderInput.selectedIndex].value

            //Create random url based on User Random API and get a profile pic for the user
            let newUserPicture = `https://randomuser.me/api/portraits/${userGender}/${Math.floor(Math.random() * 100)}.jpg`

            //New user data to be sent to backend
            const newUserData =  {
                "firstName" :event.target.userFirstNameInput.value,
                "lastName" : event.target.userLastNameInput.value,
                "email" : event.target.userEmailInput.value,
                "phoneNumber" : event.target.userPhoneNumberInput.value,
                "picture": newUserPicture
            }

            //AJAX request to save user            
            ajaxRequest('/users', 'POST', newUserData)
            .then(response => {
                if(response.result) {
                    drawUsers(response.savedUserData, cardsContainer, true)
                    Swal.fire(
                        'User Saved!',
                        response.message,
                        'success',
                    )
                    btnCloseFrm.click()
                    frmNewUser.reset()
                } else {
                    Swal.fire({
                        icon: 'error',
                        title: 'Oops...',
                        text: response.message
                    })
                }
            })
        })
    }

    // Delete User from Database by using event delegation
    window.addEventListener('click', event => {

        //Check if the element that triggers the event is the deletion button
        if(event.target.classList.contains('btn-delete-user')) {
            Swal.fire({
                title: 'Do you really want to delete this user?',
                text: "You won't be able to revert this!",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Yes, get rid of it!'
              }).then((result) => {
                if (result.isConfirmed) {

                    //Get card parent element to remove it from DOM if the user is successully deleted from DB
                    const parent = event.target.parentNode.parentNode.parentNode

                    //User id to send to the endpoint
                    const userId = {
                        id: event.target.dataset.userId
                    }

                    //Send request to delete user
                    ajaxRequest('/users', 'DELETE', userId)
                    .then(response => {
                        if(response.result) {
                            parent.remove()
                            Swal.fire(
                                'Deleted!',
                                `${response.message}`,
                                'success'
                            )
                        } else {
                            Swal.fire({
                                icon: 'error',
                                title: 'Oops...',
                                text: response.message
                            })
                        }
                    })
                }
              })
        }
    })

    //Load and draw user when the page loads
    ajaxRequest('/users')
    .then(users => {
        //Order users randomly
        const usersList = users.sort(() => Math.random() - 0.5)

        //Pass users to Draw function
        drawUsers(usersList, cardsContainer)
    })
})