$(document).ready(function() {
    let currentUserId = JSON.parse(localStorage.getItem('currentUser')).id;
    
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
    function getCurrentUserInfo(){
        $.ajax({
            type: 'POST',
            url: "http://127.0.0.1:8000/api/socialmedia/user/info",
            data: {
                'userId': currentUserId,
            },
            success: function(response) {
                console.log(response);
                let posts =""
                response.posts.forEach((items) => {
                    
                    posts += `
                    <div class="col-6">
                      <img src="http://127.0.0.1:8000/${items.image}" alt="image 1"
                        class="w-100 rounded-3" style="height: 296px; object-fit: cover;">
                    </div>`
                })
                $("#post-container").html(posts)
                $(".userName").html(response.user.username)
                $("#followers").html(response.followers_count)
                $("#following").html(response.following_count)
                $("#post-length").html(response.posts.length)
                
                $(".user-role").html(response.user.role)
                // $("#following").html(response.following_count)
                // $("#suggested-users").html(nonFolloing_users)
            },
            error: function(xhr, status, error) {
                console.error('Error:', error);
            }
        });
    }

    getCurrentUserInfo()
})