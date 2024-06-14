# urls.py
from django.urls import path
from socialMedia import views

urlpatterns = [
    path('socialmedia/post/list', views.listPosts, name='listPosts'),
    path('socialmedia/post', views.savePost, name='savePost'),
    path('socialmedia/post/reactions', views.listReactions, name='listReactions'),
    path('socialmedia/post/reaction', views.reactToPost, name='reactToPost'),
    path('socialmedia/users/list', views.listUsers, name='listUsers'),
    path('socialmedia/user/follow', views.followUser, name='followUser'),
    path('socialmedia/user/followers/list', views.listFollowingUsers, name='listFollowingUsers'),
    path('socialmedia/user/unfollowers/list', views.listUnfollowedUsers, name='listUnfollowedUsers'),

]