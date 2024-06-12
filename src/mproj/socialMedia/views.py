# views.py
from django.shortcuts import render, get_object_or_404
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth.decorators import login_required
from django.conf import settings

from socialMedia.serializer import CreatePostSerializer, PostReactionSerializer, PostSerializer
from .models import Follow, Post, Reaction, PostReaction
from adminapp.models import User
from django.db.models import F
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status

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


@api_view(['GET'])
def listPosts(request):
    posts = Post.objects.all()
    serializer = PostSerializer(posts, many=True)
    return Response(serializer.data)


@api_view(['GET'])
def listReactions(request):
    reactions = Reaction.objects.all()
    serializer = PostReactionSerializer(reactions, many=True)
    return Response(serializer.data)

@csrf_exempt
@api_view(['POST'])
def reactToPost(request):
    if request.method == 'POST':
        data = request.data
        reaction_type = data['reaction']
        user_id = data['userId']
        post_id = data['postId']
        print(post_id,"post Id")
        print(user_id,"user Id")

        try:
            post = Post.objects.get(id=post_id)
        except Post.DoesNotExist:
            return Response({"error": "Post not found."}, status=status.HTTP_404_NOT_FOUND)
        
        try:
            reaction = Reaction.objects.get(user_id=user_id, post_id=post_id)
            current_reaction = reaction.reaction
            reaction.delete()
            if reaction_type == 'like' and current_reaction == 'like':
                post.likes_count = max(0, post.likes_count - 1)

            if reaction_type == 'dislike' and current_reaction == 'dislike':
                post.dislikes_count = max(0, post.dislikes_count - 1)
            post.save()
            reaction_serializer = PostReactionSerializer(reaction, data=data, partial=True)
            if reaction_serializer.is_valid():
                return Response(reaction_serializer.data, status=status.HTTP_200_OK)
        except Reaction.DoesNotExist:
            # Creating a new reaction
            reaction = Reaction(user_id=user_id, post=post, reaction=reaction_type)
            if reaction_type == 'like':
                post.likes_count += 1
            elif reaction_type == 'dislike':
                post.dislikes_count += 1
            elif reaction_type == 'report':
                post.reports_count += 1
            post.save()

        reaction_serializer = PostReactionSerializer(reaction, data=data, partial=True)
        if reaction_serializer.is_valid():
            reaction_serializer.save()
            return Response(reaction_serializer.data, status=status.HTTP_200_OK)
        else:
            return Response(reaction_serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        

@api_view(['POST'])
def savePost(request):
    if request.method == 'POST':
        data = request.data
        user_id = data.get('userId')
        print(user_id)
        try:
            user = User.objects.get(id=user_id)
        except User.DoesNotExist:
            return Response({'error': 'User not found'}, status=status.HTTP_404_NOT_FOUND)

        serializer = CreatePostSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(user=user)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)