function sendReaction(postId, reaction) {
    $.ajax({
        url: `/react/${postId}/`,
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

$(document).on("click", ".reaction-btn", function (e) {
    e.preventDefault();
    const postId = $(this).data('post-id');
    const reaction = $(this).data('reaction');
    sendReaction(postId, reaction);
});
