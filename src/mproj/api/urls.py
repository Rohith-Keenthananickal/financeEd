# urls.py
from django.urls import path
from socialMedia import views

urlpatterns = [
    path('socialmedia/post/list', views.listPosts, name='listPosts'),
    path('socialmedia/post/reactions', views.listReactions, name='listReactions'),
    path('socialmedia/post/reaction', views.reactToPost, name='reactToPost'),
]