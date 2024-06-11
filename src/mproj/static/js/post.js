$(document).ready(function() {
    $('.reaction-btn').click(function() {
        var $this = $(this);
        var postId = $this.data('post-id');
        var reaction = $this.data('reaction');

        $.ajax({
            type: 'POST',
            url: '/socialmedia/toggle_reaction/',
            data: {
                'post_id': postId,
                'reaction_type': reaction,
                // 'csrfmiddlewaretoken': $('input[name="csrfmiddlewaretoken"]').val(),
            },
            success: function(response) {
                if (response.reacted) {
                    $this.removeClass('text-white reaction-btn').addClass('text-red liked ti ti-heart-filled reaction-btn');
                } else {
                    $this.removeClass('text-red liked ti ti-heart-filled').addClass('ti ti-heart text-white reaction-btn');
                }
                $this.siblings('.likes-count').text(response.likes_count);
            },
            error: function(xhr, status, error) {
                console.error('Error:', error);
            }
        });
    });

    

    
});

$(document).ready(function() {
    let currentUserId = JSON.parse(localStorage.getItem('currentUser')).id;
    let reactionData = [];

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

    function getPostsAndReaction(){
        $.ajax({
            type: "GET",
            url: "http://127.0.0.1:8000/api/socialmedia/post/reactions",
            success: function(response) {
                reactionData = response;
            },
            error: function(error) {
                console.log("Error");
            }
        });
    
        $.ajax({
            type: "GET",
            url: "http://127.0.0.1:8000/api/socialmedia/post/list",
            success: function(response) {
                let html_items = "";
                response.forEach((items) => {
                    let userReacted = reactionData.some(reaction => reaction.user.id === currentUserId && reaction.post.id === items.id && reaction.reaction == 'like') ;
                    html_items += `
                        <div class="card card-sm mb-4" id="post-${items.id}" data-post-id="${items.id}">
                            <div class="d-flex align-items-center mb-2">
                                <span class="avatar me-3 rounded-circle" style="background-image: url(http://127.0.0.1:8000/${items.image})"></span>
                                <div>
                                    <div class="text-white fs-4">${items.user.username}</div>
                                    <div class="text-secondary fs-5">${timeAgo(items.created_at)}</div>
                                </div>
                            </div>
                            <a href="#" class="d-block"><img src="http://127.0.0.1:8000/${items.image}" class="card-img-top"></a>
                            <div class="mt-2 d-flex align-items-center gap-3">
                                <div class="d-flex align-items-center">
                                    <i class="ti ti-heart-filled text-red fs-2 cursor-pointer like-icon liked-icon reaction-btn"
                                        data-post-id="${items.id}" data-reaction="like" ${userReacted ? '' : 'style="display:none;"'}></i>
                                    <i class="ti ti-heart fs-2 cursor-pointer text-white unlike-icon reaction-btn"
                                        data-post-id="${items.id}" data-reaction="like" ${userReacted ? 'style="display:none;"' : ''}></i>
                                    <span class="likes-count text-white fs-5">${items.likes_count}</span>
                                </div>
                                <div class="d-flex align-items-center">
                                    <i class="ti ti-thumb-down fs-2 cursor-pointer text-white"></i>
                                    <span class="dislikes-count text-white fs-5">${items.dislikes_count}</span>
                                </div>
                            </div>
                            <div class="d-flex gap-2 align-items-center mt-2 flex-wrap">
                                <div class="text-white fw-bold fs-5">${items.user.username}</div>
                                <div class="text-white fs-5 fw-light">${items.description}</div>
                            </div>
                        </div>`;
                });
                $("#posts-container").html(html_items);
                // $(".liked-icon").on("click", function() {
                //     console.log($(this));
                //     $(this).removeClass("ti-heart-filled")
                //     $(this).addClass("ti-heart")
                //     let postId = $(this).data("post-id");
                //     react(postId);
                // });
                // $(".unlike-icon").on("click", function() {
                //     console.log($(this));
                //     $(this).removeClass("ti-heart")
                //     $(this).addClass("ti-heart-filled")
                //     let postId = $(this).data("post-id");
                //     react(postId);
                // });
            },
            error: function(error) {
                console.log("Error");
            }
        });

        
    
        function timeAgo(dateString) {
            const date = new Date(dateString);
            return dateFns.formatDistanceToNow(date, { addSuffix: true });
        }
    }

    getPostsAndReaction();


    function react(postId){
        $.ajax({
            type: 'POST',
            url: "http://127.0.0.1:8000/api/socialmedia/post/reaction",
            data: {
                'postId': postId,
                'reaction': 'like',
                'userId': currentUserId,
            },
            success: function(response) {
                getPostsAndReaction();
            },
            error: function(xhr, status, error) {
                console.error('Error:', error);
            }
        });
    }

    $('#posts-container').on('click', '.liked-icon', function() {
        console.log($(this));
        $(this).removeClass("ti-heart-filled").addClass("ti-heart");
        let postId = $(this).data("post-id");
        react(postId);
    });

    $('#posts-container').on('click', '.unlike-icon', function() {
        console.log($(this));
        $(this).removeClass("ti-heart").addClass("ti-heart-filled");
        let postId = $(this).data("post-id");
        react(postId);
    });
});

