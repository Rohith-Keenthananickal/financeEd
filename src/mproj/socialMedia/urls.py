# urls.py
from django.urls import path
from . import views

urlpatterns = [
    path('post', views.post_list, name='post_list'),
    path('post/react/<int:post_id>/', views.react_to_post, name='react_to_post'),
]