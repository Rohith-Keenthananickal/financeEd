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
            url: "http://127.0.0.1:8000/api/socialmedia/user/followers/list",
            data: {
                'currentUserId': currentUserId,
            },
            success: function(response) {
                console.log(response);
                let folloing_users =""
                response.forEach((items) => {
                    let userImage = items.user_image ? `background-image: url(${items.user_image}); display: block;` : 'display: none;';
                    let userInitials = items.user_image ? 'display: none;' : 'display: block;';
                    folloing_users += `<a href="#chat-1" class="nav-link text-start mw-100 p-3 selected-user" id="${items.id}" data-bs-toggle="pill" role="tab" aria-selected="true"
                    data-user-id="${items.id}">
                            <div class="row align-items-center flex-fill">
                            <div class="col-auto">
                                ${items.user_image ? `
                                    <span class="avatar" style="background-image: url(http://127.0.0.1:8000/${items.user_image}); display: block;"></span>
                                ` : `
                                    <span class="avatar">${items.short_name}</span>
                                `}
                            </div>
                            <div class="col text-body">
                                <div>${items.username}</div>
                                <div class="text-secondary text-truncate w-100">Sure Paweł, let me pull the latest updates.</div>
                            </div>
                            </div>
                        </a>`
                })
                $("#chat-users").html(folloing_users)
                $(".selected-user").first().addClass("active");

                const userId = JSON.parse(localStorage.getItem('currentUser')).id;
                const recipientId = $(".selected-user.active").data('user-id');
                console.log(recipientId);

                

                function getMessages() {

                    $.ajax({
                        url: `/api/get_messages/${userId}/${recipientId}/`,
                        type: 'GET',
                        success: function(data) {
                            $('#chat-log').empty();
                            data.forEach(function(message) {
                                const chatBubbleClass = message.sender === "{{ request.user.username }}" ? "chat-bubble-me" : "chat-bubble";
                                const alignClass = message.sender === "{{ request.user.username }}" ? "justify-content-end" : "";
                                const author = message.sender === "{{ request.user.username }}" ? "{{ request.user.username }}" : message.sender.username;
                                const avatar = message.sender === "{{ request.user.username }}" ? "./static/avatars/000m.jpg" : "./static/avatars/002m.jpg";  // Replace with actual avatar logic
                                
                                const messageHtml = `
                                    <div class="chat-item">
                                        <div class="row align-items-end" style="${currentUserName == message.sender.username ? 'justify-content: end' : ''}">
                                            <div class="col-auto">
                                                <div class="col-auto">
                                                ${message.sender.user_image ? `
                                                    <span class="avatar" style="background-image: url(http://127.0.0.1:8000/${message.sender.user_image}); display: block;"></span>
                                                ` : `
                                                    <span class="avatar">${message.sender.short_name}</span>
                                                `}
                                            </div>
                                            </div>
                                            <div class="col col-lg-6">
                                                <div class="chat-bubble ${chatBubbleClass}">
                                                    <div class="chat-bubble-title">
                                                        <div class="row">
                                                            <div class="col chat-bubble-author">${author}</div>
                                                            <div class="col-auto chat-bubble-date">${formatDate(message.timestamp)}</div>
                                                        </div>
                                                    </div>
                                                    <div class="chat-bubble-body">
                                                        <p>${message.message}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                `;
                                $('#chat-log').append(messageHtml);
                            });
                        }
                    });
                }
                getMessages();
                // Poll for new messages every 5 seconds
                // setInterval(getMessages, 5000);

        

            },
            error: function(xhr, status, error) {
                console.error('Error:', error);
            }
        });

    }

    function getMessages() {
        let recipientId = $(".selected-user.active").data('user-id');
        $.ajax({
            url: `/api/get_messages/${currentUserId}/${recipientId}/`,
            type: 'GET',
            success: function(data) {
                $('#chat-log').empty();
                data.forEach(function(message) {
                    const chatBubbleClass = message.sender === "{{ request.user.username }}" ? "chat-bubble-me" : "chat-bubble";
                    const alignClass = message.sender === "{{ request.user.username }}" ? "justify-content-end" : "";
                    const author = message.sender === "{{ request.user.username }}" ? "{{ request.user.username }}" : message.sender.username;
                    const avatar = message.sender === "{{ request.user.username }}" ? "./static/avatars/000m.jpg" : "./static/avatars/002m.jpg";  // Replace with actual avatar logic
                    console.log(currentUserName)
                    const messageHtml = `
                                    <div class="chat-item">
                                        <div class="row align-items-end" style="${currentUserName == message.sender.username ? 'justify-content: end' : ''}">
                                            <div class="col-auto">
                                                <div class="col-auto">
                                                ${message.sender.user_image ? `
                                                    <span class="avatar" style="background-image: url(http://127.0.0.1:8000/${message.sender.user_image}); display: block;"></span>
                                                ` : `
                                                    <span class="avatar">${message.sender.short_name}</span>
                                                `}
                                            </div>
                                            </div>
                                            <div class="col col-lg-6">
                                                <div class="chat-bubble ${chatBubbleClass}">
                                                    <div class="chat-bubble-title">
                                                        <div class="row">
                                                            <div class="col chat-bubble-author">${author}</div>
                                                            <div class="col-auto chat-bubble-date">${formatDate(message.timestamp)}</div>
                                                        </div>
                                                    </div>
                                                    <div class="chat-bubble-body">
                                                        <p>${message.message}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                `;
                    $('#chat-log').append(messageHtml);
                });
            }
        });
    }

    listFollowingUsers();



    

        $('#chat-message-submit').click(function() {
            const message = $('#chat-message-input').val();
            let recipientId = $(".selected-user.active").data('user-id');
            $.ajax({
                url: '/api/send_message/',
                type: 'POST',
                data: {
                    sender_id: currentUserId,
                    recipient_id: recipientId,
                    message: message
                },
                success: function(data) {
                    $('#chat-message-input').val('');
                    getMessages();
                }
            });
        });

        $('#chat-message-input').keypress(function (e) {
            var key = e.which;
            if(key == 13)  // the enter key code
             {
                const message = $('#chat-message-input').val();
                let recipientId = $(".selected-user.active").data('user-id');
                $.ajax({
                    url: '/api/send_message/',
                    type: 'POST',
                    data: {
                        sender_id: currentUserId,
                        recipient_id: recipientId,
                        message: message
                    },
                    success: function(data) {
                        $('#chat-message-input').val('');
                        getMessages();
                    }
                }); 
             }
           }); 


        $(document).on('click', '.selected-user', function() {
            $(".selected-user").removeClass("active");
            $(this).addClass("active");
        
            const recipientId = $(this).data('user-id');
            console.log(recipientId);
        
            
            getMessages();
        });
        
})