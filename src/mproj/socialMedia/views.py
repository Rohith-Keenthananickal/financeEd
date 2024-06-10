# views.py
from django.shortcuts import render, get_object_or_404
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth.decorators import login_required
from django.conf import settings
from .models import Follow, Post, Reaction, PostReaction
from adminapp.models import User
from django.db.models import F

@csrf_exempt
def toggle_reaction(request):
    if request.method == 'POST':
        userId = request.session['userId']
        post_id = request.POST.get('post_id')
        reaction_type = request.POST.get('reaction_type')  # Assuming you have different types of reactions

        # Toggle reaction logic
        reaction, created = Reaction.objects.get_or_create(user_id=userId, post_id=post_id, reaction=reaction_type)
        if not created:
            reaction.delete()
            reacted = False
            update_post = Post.objects.get(id=post_id)
            update_post.likes_count = F('likes_count') - 1 
            update_post.save()
        else:
            reacted = True
            update_post = Post.objects.get(id=post_id)
            update_post.likes_count = F('likes_count') + 1 
            update_post.save()

        # Return the new number of likes for the post
        post = Post.objects.get(id=post_id)
        likes_count = Reaction.objects.filter(post=post).count()

        return JsonResponse({'reacted': reacted, 'likes_count': likes_count})

    return JsonResponse({'error': 'Invalid request'}, status=400)

# @csrf_exempt
# def react_to_post(request, post_id):
#     if request.method == 'POST':
#         userId = request.session['userId']
#         post = Post.objects.get(id=post_id)
#         reaction = request.POST.get('reaction')

#         if Reaction.objects.filter(user=userId, post=post, reaction=reaction).exists():
#             user = User.objects.filter(id=userId).first()
#             reaction = Reaction.objects.filter(user=user, post=post).values()
#         else:
#             user = User.objects.filter(id=userId).first()        
#             saveReaction = Reaction(user=user, post=post, reaction=reaction)
#             saveReaction.save()

#         if reaction == 'like':
#             post.likes_count += 1
#         elif reaction == 'dislike':
#             post.dislikes_count += 1
#         elif reaction == 'report':
#             post.reports_count += 1

#         post.save()
#         return JsonResponse({'message': 'Reaction recorded.'})

#     return JsonResponse({'error': 'Invalid request.'}, status=400)

# @login_required
def post_list(request):
    userId = request.session['userId']
    posts = Post.objects.all()
    users = User.objects.all()
    user_reactions = Reaction.objects.filter(user_id=userId)
    
    reacted_post_ids = set(user_reactions.values_list('post_id', flat=True))
    print(reacted_post_ids)

    return render(request, 'socialmedia.html', {
        'posts': posts,
        'reacted_post_ids': reacted_post_ids,
        'users': users,
        'userId': userId,
        'reactionCheck' : checkReactionType
    })

def checkReactionType(post, userId):
    # userId = request.session['userId']
    post_reactions = Reaction.objects.filter(post=post,user_id = userId)
    if post_reactions.exists():
        return post_reactions.first().reaction
    else:
        return None

@login_required
def follow_user(request, user_id):
    if request.method == 'POST':
        following = get_object_or_404(User, id=user_id)
        follow, created = Follow.objects.get_or_create(follower=request.user, following=following)
        if created:
            return JsonResponse({'message': 'Successfully followed user.'})
        else:
            return JsonResponse({'message': 'You are already following this user.'})
    return JsonResponse({'error': 'Invalid request method.'}, status=400)

@login_required
def unfollow_user(request, user_id):
    if request.method == 'POST':
        following = get_object_or_404(User, id=user_id)
        Follow.objects.filter(follower=request.user, following=following).delete()
        return JsonResponse({'message': 'Successfully unfollowed user.'})
    return JsonResponse({'error': 'Invalid request method.'}, status=400)