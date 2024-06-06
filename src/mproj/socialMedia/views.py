# views.py
from django.shortcuts import render, get_object_or_404
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth.decorators import login_required
from django.conf import settings
from .models import Post, Reaction, PostReaction
from django.db.models import F

@login_required
@csrf_exempt
def react_to_post(request, post_id):
    if request.method == 'POST':
        post = Post.objects.get(id=post_id)
        reaction = request.POST.get('reaction')
        user_reaction, created = PostReaction.objects.get_or_create(user=request.user, post=post, defaults={'reaction_type': reaction})

        if not created:
            # Update existing reaction
            user_reaction.reaction_type = reaction
            user_reaction.save()

        if reaction == 'like':
            post.likes_count += 1
        elif reaction == 'dislike':
            post.dislikes_count += 1
        elif reaction == 'report':
            post.reports_count += 1

        post.save()
        return JsonResponse({'message': 'Reaction recorded.'})

    return JsonResponse({'error': 'Invalid request.'}, status=400)

@login_required
def post_list(request):
    posts = Post.objects.all()
    user_reactions = PostReaction.objects.filter(user=request.user)
    reactions = {reaction.post_id: reaction.reaction_type for reaction in user_reactions}
    return render(request, 'socialmedia.html', {'posts': posts, 'reactions': reactions})