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

    let messageArray = [];
    let messageObject = {}
    $(".chat").hide();

    $("#search-btn").on("click", function () {
        let centerPart = $(".center-part").hide();
        let chatContainer = $("#search-container").removeClass("justify-content-between");
        chatContainer.addClass("justify-content-end");
        $(".chat").show();

        const query = $('#chat-message-input').val();
        let messageObject = {'type': 'me', 'message': query};
        let messageArray = [];
        messageArray.push(messageObject);
        messageObject = {};
        
        $.ajax({
            type: 'POST',
            url: "http://127.0.0.1:8000/api/query/",
            data: JSON.stringify({'query': query}),
            contentType: 'application/json',
            success: function (response) {
                console.log(response);
                let chat = "";
                messageArray.forEach((items) => {
                    chat += `
                    <div class="chat-item">
                        <div class="row align-items-end justify-content-end">
                            <div class="col col-lg-6">
                                <div class="chat-bubble chat-bubble-me" style="justify-content-end;">
                                    <div class="chat-bubble-title">
                                        <div class="row">
                                            <div class="col chat-bubble-author fw-bold">You</div>
                                        </div>
                                    </div>
                                    <div class="chat-bubble-body">
                                        <p class="typing-effect">${items.message}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    `;
                });
                $("#chat-container").html(chat);
    
                // Adding the bot response to the chat
                chat += `
                <div class="chat-item">
                    <div class="row align-items-end justify-content-start">
                        <div class="col col-lg-6">
                            <div class="chat-bubble chat-bubble-bot">
                                <div class="chat-bubble-title">
                                    <div class="row">
                                        <div class="col chat-bubble-author fw-bold">Bot</div>
                                    </div>
                                </div>
                                <div class="chat-bubble-body">
                                    <p class="typing-effect">${response.message}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                `;
                $("#chat-container").html(chat);
            },
            error: function (xhr, status, error) {
                console.error('Error:', error);
                let chat = "";
                messageArray.forEach((items) => {
                    chat += `
                    <div class="chat-item">
                        <div class="row align-items-end justify-content-end">
                            <div class="col col-lg-6">
                                <div class="chat-bubble chat-bubble-me" style="justify-content-end;">
                                    <div class="chat-bubble-title">
                                        <div class="row">
                                            <div class="col chat-bubble-author">Paweł Kuna</div>
                                        </div>
                                    </div>
                                    <div class="chat-bubble-body">
                                        <p>${items.message}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    `;
                });
                $("#chat-container").html(chat);
    
                // Adding the bot response to the chat
                chat += `
                <div class="chat-item">
                    <div class="row align-items-end justify-content-start">
                        <div class="col col-lg-6">
                            <div class="chat-bubble chat-bubble-bot">
                                <div class="chat-bubble-title">
                                    <div class="row">
                                        <div class="col chat-bubble-author">Bot</div>
                                    </div>
                                </div>
                                <div class="chat-bubble-body">
                                    <p>${error}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                `;
                $("#chat-container").html(chat);
            }
        });
    });
    
})