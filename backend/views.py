from django.shortcuts import render
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from .models import Todo
from .serializers import TodoSerializer
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
)

# making username visible inside access token for frontend
class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        # Add custom claims
        token['name'] = user.username
        return token

class MyTokenObtainPairView(TokenObtainPairView):
    serializer_class = MyTokenObtainPairSerializer


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_todos(request):
    user = request.user
    print(f"Authenticated User: {user}")
    todos = Todo.objects.filter(user=user)
    print(f"Todos: {todos}")
    serializer = TodoSerializer(todos, many=True)
    return Response(serializer.data)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_todo(request):
    serializer = TodoSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save(user = request.user)
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    else:
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def update_todo(request, pk):
    try: 
        todo = Todo.objects.get(pk=pk)
    except Todo.DoesNotExist:
        return Response("Error can't find todo")
    # partial (to modify or upate individual fields) 
    serializer = TodoSerializer(todo, data=request.data, partial=True)

    if serializer.is_valid():
        serializer.save()
        return Response("Todo updated")
    
    return Response(serializer.errors)


@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def delete_todo(request, pk):
    try: 
        todo = Todo.objects.get(pk=pk)
    except Todo.DoesNotExist:
        return Response("Error can't find todo")
    
    todo.delete()
    return Response("Todo deleted successfully")

