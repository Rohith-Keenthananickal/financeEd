$(document).ready(function() {
    let currentUserId = JSON.parse(localStorage.getItem('currentUser')).id;
    let currentUserName = JSON.parse(localStorage.getItem('currentUser')).username;
    console.log(currentUserId)
    function getCookie(name) {
        let cookieValue = null;
        if (document.cookie && document.cookie !== '') {
            const cookies = document.cookie.split(';');
            for (let i = 0; i < cookies.length; i++) {
                const cookie = cookies[i].trim();
                // Does this cookie string begin with the name we want?
                if (cookie.substring(0, name.length + 1) === (name + '=')) {
                    cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                    break;
                }
            }
        }
        return cookieValue;
    }
    const csrftoken = getCookie('csrftoken');
    
    function getCsrfToken() {
        return getCookie('csrftoken') || document.querySelector('meta[name="csrf-token"]').getAttribute('content');
    }
    

    $.ajaxSetup({
        beforeSend: function(xhr, settings) {
            if (!(/^GET|HEAD|OPTIONS|TRACE$/i.test(settings.type))) {
                xhr.setRequestHeader("X-CSRFToken", getCsrfToken());
            }
        }
    });

    function formatDate(timestamp) {
        const date = new Date(timestamp);
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }

    function listFollowingUsers(){
        $.ajax({
            type: 'POST',
            url: "http://127.0.0.1:8000/api/students/list",
            data: {
                'currentUserId': currentUserId,
            },
            success: function(response) {
                console.log(response);
                let users =""
                response.forEach((items) => {
                    
                    users += `<div class="col-md-6 col-lg-3" >
                <div class="card">
                  <div class="card-body p-4 text-center">
                    <span class="avatar avatar-xl mb-3 rounded border">${items.short_name}</span>
                    <h3 class="m-0 mb-1"><a href="#">${items.username}</a></h3>
                    <div class="text-secondary">${items.email}</div>
                    <div class="mt-3">
                      <span class="badge bg-green-lt">${items.role}</span>
                    </div>
                  </div>
                  <div class="d-flex">
                    <a class="card-btn viewProfileButton cursor-pointer" data-user-id="${items.id}">
                     
                      View Profile</a>
                    
                  </div>
                </div>
              </div>`
                })
                $("#user-cards").html(users)
                

                const userId = JSON.parse(localStorage.getItem('currentUser')).id;
                const recipientId = $(".selected-user.active").data('user-id');
                console.log(recipientId);

                
                $(".viewProfileButton").click(function(){
                    // Get the user ID from the button's data attribute
                    var userId = $(this).data("user-id");
                    
                    // Construct the new URL with the userId as a query parameter
                    var newUrl = "http://127.0.0.1:8000/socialmedia/profile?userId=" + userId;
                    
                    // Redirect to the new URL
                    window.location.href = newUrl;
                });
             
            },
            error: function(xhr, status, error) {
                console.error('Error:', error);
            }
        });

    }
    listFollowingUsers();


    
    

        
})