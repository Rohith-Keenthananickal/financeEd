# urls.py
from django.urls import path
from . import views

urlpatterns = [
    path('post', views.post_list, name='post_list'),
    path('profile', views.profile, name='profile'),
    # path('post/react/<int:post_id>/', views.react_to_post, name='react_to_post'),
    path('follow/<int:user_id>/', views.follow_user, name='follow_user'),
    path('unfollow/<int:user_id>/', views.unfollow_user, name='unfollow_user'),
    path('toggle_reaction/', views.toggle_reaction, name='toggle_reaction'),
]