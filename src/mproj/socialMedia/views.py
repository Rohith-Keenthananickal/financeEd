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
def react_to_post(request, post_id):
    if request.method == 'POST':
        post = Post.objects.get(id=post_id)
        reaction = request.POST.get('reaction')
        # user_reaction, created = PostReaction.objects.get_or_create(user=request.user, post=post, defaults={'reaction_type': reaction})
        # if not created:
        #     # Update existing reaction
        #     user_reaction.reaction_type = reaction
        #     user_reaction.save()
        try:
            reaction_instance = PostReaction.objects.get(user=request.user, post=post)
            print(reaction_instance)
            reaction_instance.reaction_type = reaction
            reaction_instance.save()
            print('reaction updated')
        except PostReaction.DoesNotExist:
            print ('Could not find reaction')
            saveReaction = PostReaction(user=request.user, post=post, reaction_type=reaction)
            saveReaction.save()


        if reaction == 'like':
            post.likes_count += 1
        elif reaction == 'dislike':
            post.dislikes_count += 1
        elif reaction == 'report':
            post.reports_count += 1

        post.save()
        return JsonResponse({'message': 'Reaction recorded.'})

    return JsonResponse({'error': 'Invalid request.'}, status=400)

# @login_required
def post_list(request):
    userId = request.session['userId']
    print(request.session['userId'])
    posts = Post.objects.all()
    users = User.objects.all()
    user_reactions = PostReaction.objects.filter(user=request.user)
    
    reactions = {reaction.post_id: reaction.reaction_type for reaction in user_reactions}
    print(reactions)
    print(user_reactions)
    return render(request, 'socialmedia.html', {'posts': posts, 'reactions': reactions, 'users': users, 'userId' : userId})


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