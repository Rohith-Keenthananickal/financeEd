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

    function getPostsAndReaction(){
        $.ajax({
            type: "GET",
            url: "http://127.0.0.1:8000/api/socialmedia/post/reactions",
            success: function(response) {
                console.log(response,"reaction Data");
                reactionData = response;

                $.ajax({
                    type: "GET",
                    url: "http://127.0.0.1:8000/api/socialmedia/post/list",
                    success: function(response) {
                        let html_items = "";
                        response.forEach((items) => {
                            let userReacted = reactionData.some(reaction => reaction.user.id === currentUserId && reaction.post.id === items.id && reaction.reaction == 'like') ;
                            let userdisliked = reactionData.some(reaction => reaction.user.id === currentUserId && reaction.post.id === items.id && reaction.reaction == 'dislike') ;
                            console.log(items.id,"items");
                            console.log("user disliked", userdisliked);
                            console.log(reactionData,"reaction");
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
                                        <div>
                                            <div class="d-flex align-items-center" id="like-icon-container-${items.id}">
                                                <i class="ti ti-heart-filled text-red fs-2 cursor-pointer like-icon liked-icon reaction-btn"
                                                    data-post-id="${items.id}" data-reaction="like" ${userReacted ? '' : 'style="display:none;"'}></i>
                                                <i class="ti ti-heart fs-2 cursor-pointer text-white unlike-icon reaction-btn"
                                                    data-post-id="${items.id}" data-reaction="like" ${userReacted ? 'style="display:none;"' : ''}></i>
                                                <span class="likes-count text-white fs-5">${items.likes_count}</span>
                                            </div>
                                            
                                        </div>
                                        
                                        <div class="d-flex align-items-center" id="dislike-icon-container-${items.id}">
                                            <i class="ti ti-thumb-down fs-2 cursor-pointer text-white dislike-btn" data-post-id2="${items.id}" data-reaction="like"
                                            ${userdisliked ? 'style="display:none;"' : ''}></i>
                                            <i class="ti ti-thumb-down-filled fs-2 cursor-pointer text-white disliked-btn" data-post-id2="${items.id}" data-reaction="like"
                                            ${userdisliked ? '' : 'style="display:none;"'}></i>
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
                    },
                    error: function(error) {
                        console.log("Error");
                    }
                });
        
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
        let postId = $(this).data("post-id");
        react(postId);
        console.log($(this));
        let unlikeIcon = `<i class="ti ti-heart fs-2 cursor-pointer text-white unlike-icon reaction-btn"
            data-post-id="${postId}" data-reaction="like"></i>`
       $("#like-icon-container").html(unlikeIcon)
        
    });

    $('#posts-container').on('click', '.unlike-icon', function() {
        let postId = $(this).data("post-id");
        $.ajax({
            type: 'POST',
            url: "http://127.0.0.1:8000/api/socialmedia/post/reaction",
            data: {
                'postId': postId,
                'reaction': 'like',
                'userId': currentUserId,
            },
            success: function(response) {
                let likedIcon = `<i class="ti ti-heart-filled text-red fs-2 cursor-pointer like-icon liked-icon reaction-btn"
                                data-post-id="${response.post.id}" data-reaction="like" }></i>
                                
                                <span class="likes-count text-white fs-5">${response.post.likes_count}</span>`
                $("#like-icon-container-" + postId + "").html(likedIcon)
            },
            error: function(xhr, status, error) {
                console.error('Error:', error);
            }
        });


    });

    $('#posts-container').on('click', '.dislike-btn', function() {
        let postId = $(this).data("post-id2");
        $.ajax({
            type: 'POST',
            url: "http://127.0.0.1:8000/api/socialmedia/post/reaction",
            data: {
                'postId': postId,
                'reaction': 'dislike',
                'userId': currentUserId,
            },
            success: function(response) {
                let dislikedIcon = `<i class="ti ti-thumb-down-filled fs-2 cursor-pointer text-white disliked-btn" data-post-id2="${response.post.id}" data-reaction="like"></i>   
                                <span class="dislikes-count text-white fs-5">${response.post.dislikes_count}</span>`
                $("#dislike-icon-container-" + postId + "").html(dislikedIcon)
            },
            error: function(xhr, status, error) {
                console.error('Error:', error);
            }
        });


    });

    $('#posts-container').on('click', '.disliked-btn', function() {
        let postId = $(this).data("post-id2");
        $.ajax({
            type: 'POST',
            url: "http://127.0.0.1:8000/api/socialmedia/post/reaction",
            data: {
                'postId': postId,
                'reaction': 'dislike',
                'userId': currentUserId,
            },
            success: function(response) {
                let dislikeIcon = `<i class="ti ti-thumb-down fs-2 cursor-pointer text-white dislike-btn" data-post-id2="${response.post.id}" data-reaction="like"></i>   
                                <span class="dislikes-count text-white fs-5">${response.post.dislikes_count}</span>`
                $("#dislike-icon-container-" + postId + "").html(dislikeIcon)
            },
            error: function(xhr, status, error) {
                console.error('Error:', error);
            }
        });


    });


    

    // const previewPhoto = () => {
    //     const file = input.files;
    //     if (file) {
    //         const fileReader = new FileReader();
    //         const preview = document.getElementById('file-preview');
    //         fileReader.onload = event => {
    //             preview.setAttribute('src', event.target.result);
    //         }
    //         fileReader.readAsDataURL(file[0]);
    //     }
    // }
    // const input = $("#file-upload");
    // input.addEventListener('change', previewPhoto);


    document.getElementById('postForm').addEventListener('submit', function(event) {
        event.preventDefault();
        
        let image = $("#file-upload")
        console.log(document.getElementById('file-upload'));
        console.log(document.getElementById('file-upload').files[0]);
        // Get form data
        let formData = new FormData();
        formData.append('userId', currentUserId);
        formData.append('image', document.getElementById('file-upload').files[0]);
        formData.append('description', document.getElementById('description').value);
        console.log(formData);
        // Make AJAX request
        fetch('http://127.0.0.1:8000/api/socialmedia/post', {
            method: 'POST',
            headers: {
                'Authorization': 'Token your_token', // Replace with your actual token
                'X-CSRFToken': csrftoken
            },
            body: formData
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok ' + response.statusText);
            }
            return response.json();
        })
        .then(data => {
            console.log('Success:', data);
            getPostsAndReaction();
            // Handle success (e.g., display a success message or redirect)
        })
        .catch(error => {
            console.error('Error:', error);
            // Handle error (e.g., display an error message)
        });
    });


    document.getElementById('file-upload').addEventListener('change', function(event) {
        const fileInput = event.target;
        const file = fileInput.files[0];
    
        if (file) {
            const reader = new FileReader();
            image = $("#image-preview").removeClass('d-hidden');
            reader.onload = function(e) {
                const imagePreview = document.getElementById('image-preview');
                
                imagePreview.src = e.target.result;
            }
    
            reader.readAsDataURL(file);
        } else {
            // If no file is selected, clear the image preview
            document.getElementById('image-preview').src = '#';
        }
    });

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
                    
                folloing_users += `<div>
                <div class="row">
                    <div class="col-auto">
                        <span class="avatar rounded-circle">JL</span>
                    </div>
                    <div class="col">
                        <div class="text-truncate">
                            <strong class="fs-5">${items.username}</strong>
                        </div>
                        <div class="text-blue cursor-pointer fs-5">Message</div>
                    </div>

                </div>
                 </div>`
                })
                $("#following-users").html(folloing_users)
            },
            error: function(xhr, status, error) {
                console.error('Error:', error);
            }
        });

    }

    listFollowingUsers();
    

    function listUnFollowingUsers(){
        $.ajax({
            type: 'POST',
            url: "http://127.0.0.1:8000/api/socialmedia/user/unfollowers/list",
            data: {
                'currentUserId': currentUserId,
            },
            success: function(response) {
                console.log(response);
                let nonFolloing_users =""
                response.forEach((items) => {
                    
                    nonFolloing_users += `<div>
                                          <div class="row">
                                              <div class="col-auto">
                                                  <span class="avatar rounded-circle">JL</span>
                                              </div>
                                              <div class="col-auto">
                                                  <div class="text-truncate">
                                                      <strong class="fs-5">${items.username}</strong>
                                                  </div>
                                                  <div class="text-muted fs-5">Suggested for you</div>
                                              </div>
                                              <div class="col d-flex align-items-center justify-content-end">
                                                  <div class="text-blue cursor-pointer fs-5">
                                                      Follow
                                                  </div>
                                              </div>
                                             

                                          </div>
                                      </div>`
                })
                $("#suggested-users").html(nonFolloing_users)
            },
            error: function(xhr, status, error) {
                console.error('Error:', error);
            }
        });

    }

    listUnFollowingUsers();
});

