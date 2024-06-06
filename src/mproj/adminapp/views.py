from django.shortcuts import render,redirect
from django.contrib.auth import authenticate,login,logout
from django.contrib.auth.models import User
from adminapp.models import Course, Student, Video
# from django.contrib.auth.models import UserCreationForm

# Create your views here.
from django.shortcuts import render, redirect
from django.contrib.auth import authenticate, login
from .models import Student  # Assuming you have a Student model
from django.shortcuts import render, get_object_or_404
# from .models import Post, Comment
# from .forms import PostForm, CommentForm


def signup(request):
    if request.method == 'POST':
        username = request.POST.get('username')
        password = request.POST.get('password')
        data=authenticate(username=username,password=password)
        if data is not None:
            login(request,data)
            if data.is_authenticated and data.role == 'ADMIN':
                print("data")
                return redirect('dashboard')
            if data.is_authenticated and data.role == "STUDENT":
                return redirect('udash')
        else:
            print("login failed")
    return render(request,'signup.html')


def signin(request):
    if request.method == 'POST':
        first_name = request.POST.get('name')
        email = request.POST.get('email')
        password = request.POST.get('password')
        username = email
        userData=Student.objects.create_user(first_name=first_name,email=email,username=username,password=password,role="student")
        if userData is not None:
            userData.save()
            print("User Created Successfully")
        else :
            print("User Created Faild")
    return render(request,'signin.html')


def dashboard(request):
    return render(request,'dashboard.html')


def addcourse(request):
    if request.method == 'POST':
        course_name = request.POST.get('course_name')
        durations = request.POST.get('durations')
        discription = request.POST.get('discription')
        data = Course.objects.create(course_name=course_name,duration=durations,discription=discription)
        if data is not None:
            print("data is saved")

    else :
        print("data is not saved")                         
    course_details=Course.objects.all()
    return render(request,'addcourse.html',{'course_details':course_details})


def addvideo(request):
    if request.method == 'POST':
        title = request.POST.get('title')
        video_file = request.FILES['videofile']
        video = Video(title=title,video_file=video_file)
        video.save()
    return render(request,'addvideo.html')


def index(request):
    return render(request,'index.html')


def sign_out(request):
    logout(request)
    return redirect('signup')


def student_home(request):
    return render(request,'student_home.html')


def quiz(request):
    return render(request,'quiz.html')


def quizdata(request):
    return render(request,'quizdata.html')


def listening(request):
    return render(request,'listening.html')


def story(request):
    return render(request,'story_index.html') 

    
def listen(request):
    return render(request,'listen.html') 

    
def udash(request):
    return render(request,'user_dash.html')

    
def storyplat(request):
    return render(request,'storyplat.html')

    
def storyindx(request):
    return render(request,'story_index.html')

    

# import anthropic

# system_prompt = """
# You are a friendly and knowledgeable financial advisor chatbot. Your role is to provide helpful advice and guidance on personal finance topics such as budgeting, saving, investing, retirement planning, and more. Respond in a conversational and easy-to-understand manner, tailoring your language and level of detail to the needs of the user.
# """

# client = anthropic.Anthropic(
#     # defaults to os.environ.get("ANTHROPIC_API_KEY")
#     api_key="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",
# )
# message = client.messages.create(
#     model="claude-3-opus-20240229",
#     max_tokens=1000,
#     temperature=0,
#     system=system_prompt,
#     messages=[
#         {
#             "role": "user",
#             "content": [
#                 {
#                     "type": "text",
#                     "text": "who is the finance minister of india"
#                 }
#             ]
#         }
#     ]
# )
# print(message.content)
# views.py


from django.shortcuts import render
from .forms import QueryForm
import anthropic

def home(request):
    if request.method == 'POST':
        form = QueryForm(request.POST)
        if form.is_valid():
            query = form.cleaned_data['query']

            system_prompt = """
            You are a friendly and knowledgeable financial advisor chatbot. Your role is to provide helpful advice and guidance on personal finance topics such as budgeting, saving, investing, retirement planning, and more. Respond in a conversational and easy-to-understand manner, tailoring your language and level of detail to the needs of the user.
            """

            client = anthropic.Anthropic(
                # defaults to os.environ.get("ANTHROPIC_API_KEY")
                api_key="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",
            )
            message = client.messages.create(
                model="claude-3-opus-20240229",
                max_tokens=1000,
                temperature=0,
                system=system_prompt,
                messages=[
                    {
                        "role": "user",
                        "content": [
                            {
                                "type": "text",
                                "text": query
                            }
                        ]
                    }
                ]
            )
            return render(request, 'home.html', {'message': message.content})
    else:
        form = QueryForm()

    return render(request, 'home.html', {'form': form})


def post_list(request):
    posts = Post.objects.all()
    return render(request, 'post.html', {'posts': posts})

def post_detail(request, pk):
    post = get_object_or_404(Post, pk=pk)
    return render(request, 'post.html', {'post': post})

def new_post(request):
    if request.method == "POST":
        form = PostForm(request.POST)
        if form.is_valid():
            post = form.save(commit=False)
            post.user = request.user
            post.save()
            return redirect('post_detail', pk=post.pk)
    else:
        form = PostForm()
    return render(request, 'post.html', {'form': form})

def add_comment_to_post(request, pk):
    post = get_object_or_404(Post, pk=pk)
    if request.method == "POST":
        form = CommentForm(request.POST)
        if form.is_valid():
            comment = form.save(commit=False)
            comment.post = post
            comment.user = request.user
            comment.save()
            return redirect('post_detail', pk=post.pk)
    else:
        form = CommentForm()
    return render(request, 'post.html', {'form': form})


