from django.contrib import admin
from django.urls import path
from django.urls import include
from .views import *
from django.conf import settings
from django.conf.urls.static import static
urlpatterns = [
    path('signup',signup,name='signup'),
    path('signin',signin,name='signin'),
    path('dashboard',dashboard,name='dashboard'),
    path('addcourse',addcourse,name='addcourse'),
    path('addvideo',addvideo,name='addvideo'),
    path('',index,name='index'),
    path('sign_out',sign_out,name='sign_out'),
    path('student_home',student_home,name='student_home'),
    path('quiz',quiz,name='quiz'),
    path('quizdata',quizdata,name='quizdata'),
    path('listening',listening,name='listening'),
    path('story',story,name='story'),
    path('listen',listen,name='listen'),
    path('udash',udash,name='udash'),
    path('storyplat',storyplat,name='storyplat'),
    path('storyindx',storyindx,name='storyindx'),
    path('home',home, name='home'),
    # path('',new_post, name='post'),
]+ static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
