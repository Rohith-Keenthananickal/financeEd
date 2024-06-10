function sendReaction(postId, reaction) {
    $.ajax({
        url: `/socialmedia/post/react/${postId}/`,
        type: 'POST',
        data: {
            'reaction': reaction,
            'csrfmiddlewaretoken': $('input[name="csrfmiddlewaretoken"]').val(),
        },
        success: function(response) {
            const postElement = document.querySelector(`#post-${postId}`);
            if (postElement) {
                const likesCountElement = postElement.querySelector('.likes-count');
                const dislikesCountElement = postElement.querySelector('.dislikes-count');
                const reportsCountElement = postElement.querySelector('.reports-count');
                
                if (reaction === 'like') {
                    likesCountElement.textContent = parseInt(likesCountElement.textContent) + 1;
                    $(postElement).find('.reaction-btn').removeClass('liked disliked reported');
                    $(postElement).find(`[data-reaction="like"]`).addClass('liked');
                } else if (reaction === 'dislike') {
                    dislikesCountElement.textContent = parseInt(dislikesCountElement.textContent) + 1;
                    $(postElement).find('.reaction-btn').removeClass('liked disliked reported');
                    $(postElement).find(`[data-reaction="dislike"]`).addClass('disliked');
                } else if (reaction === 'report') {
                    reportsCountElement.textContent = parseInt(reportsCountElement.textContent) + 1;
                    $(postElement).find('.reaction-btn').removeClass('liked disliked reported');
                    $(postElement).find(`[data-reaction="report"]`).addClass('reported');
                }
            } else {
                console.error('Post element not found.');
            }
        },
        error: function(xhr, status, error) {
            alert('Error: ' + error);
        }
    });
}

// $(document).on("click", ".reaction-btn", function (e) {
//     e.preventDefault();
//     const postId = $(this).data('post-id');
//     const reaction = $(this).data('reaction');
//     sendReaction(postId, reaction);
// });



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