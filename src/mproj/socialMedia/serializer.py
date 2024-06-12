from rest_framework import serializers
from socialMedia.models import Post, Reaction
from adminapp.models import User


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email']

class PostSerializer(serializers.ModelSerializer):
    user = UserSerializer()
    class Meta:
        model = Post
        fields = '__all__'
        depth = 1


class PostSerializerWithoutUser(serializers.ModelSerializer):
    class Meta:
        model = Post
        exclude = ['user']

class PostReactionSerializer(serializers.ModelSerializer):
    user = UserSerializer()
    post = PostSerializerWithoutUser()   
    class Meta:
        model = Reaction
        fields = '__all__'
        depth = 1


class CreatePostSerializer(serializers.ModelSerializer):
    class Meta:
        model = Post
        fields = ['id', 'image', 'description', 'created_at', 'likes_count', 'dislikes_count', 'reports_count']
        read_only_fields = ['id', 'created_at', 'likes_count', 'dislikes_count', 'reports_count']