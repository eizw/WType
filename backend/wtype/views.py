from django.contrib.auth.models import User, Group
from django.contrib.auth import authenticate, login, logout
from wtype.models import Word
from rest_framework import viewsets
from rest_framework import permissions
from rest_framework.response import Response
from rest_framework.decorators import api_view, renderer_classes
from wtype.serializers import UserSerializer, GroupSerializer
from os import path
import json
from random import sample
import math

basepath = path.dirname(__file__)
filepath = path.abspath(path.join(basepath, "..", "words.json"))
# Create your views here.

class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all().order_by('-date_joined')
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticated]

    
class GroupViewSet(viewsets.ModelViewSet):
    queryset = Group.objects.all()
    serializer_class = GroupSerializer
    permission_classes = [permissions.IsAuthenticated]

@api_view(['POST'])
def loginUser(request):
    username = request.get(username)
    password = request.get(password)
    user = authenticate(request, username=username, password=password)
    if user is not None:
        login(request, user)
        return Response('Login successful')
    else:
        return Response('Invalid login')

# GET WORDS
@api_view(['GET'])
def getWord(request):
    words = []
    n = 200
    with open(filepath, 'r') as f:
        words = json.load(f)
    return Response(sample(words, n))

@api_view(['GET'])
def evalRun(request):
    raw = request.GET['raw']
    fcount = request.GET['fcount']
    time = request.GET['time']

    raw_wpm = len(raw.split(' ')) // time
    filtered_wpm = fcount // time

    res = {
        'raw': raw_wpm,
        'filtered': filtered_wpm
    }

    return Response(res)