$(document).ready(function() {
    $('#signup-form').on('submit', function(e) {
        e.preventDefault();
        const username = $('#username').val();
        const password = $('#password').val();
        
        // Get the signup URL from the data attribute
        const signupUrl = $('#signup-form').data('signup-url');

        $.ajax({
            url: signupUrl,
            type: 'POST',
            data: {
                'username': username,
                'password': password,
                'csrfmiddlewaretoken': $('input[name="csrfmiddlewaretoken"]').val(),
            },
            success: function(response) {
                if (response.status === 'success') {
                    console.log(response)
                    const userDetails = response.user_details;
                    let currentUser ={'id' : userDetails.id, 'email' : userDetails.email,'role' : userDetails.role, 'username' : userDetails.username};
                    localStorage.setItem('currentUser', JSON.stringify(currentUser));
                    // Redirect based on the user's role
                    if (userDetails.role === 'ADMIN') {
                        window.location.href = '/dashboard';
                    } else if (userDetails.role === 'STUDENT') {
                        window.location.href = '/udash';
                    }
                } else {
                    alert(response.message);
                }
            },
            error: function(xhr, status, error) {
                alert('Error: ' + error);
            }
        });
    });
});
