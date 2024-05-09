from rest_framework.response import Response
from rest_framework.decorators import api_view, authentication_classes, permission_classes
from django.contrib.auth import authenticate, login
from os import path
import json
from random import sample

basepath = path.dirname(__file__)
filepath = path.abspath(path.join(basepath, "..", "words.json"))
# Create your views here.

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
@authentication_classes([])
@permission_classes([])
def getWord(request):
    words = []
    n = 200
    with open(filepath, 'r') as f:
        words = json.load(f)
    return Response(sample(words, n))


@api_view(['GET'])
@authentication_classes([])
@permission_classes([])
def evalRun(request):
    raw = request.GET['raw']
    words = request.GET['words'].split(' ')
    time = int(request.GET['time'])

    fcount = 0
    raw_words = raw.split(' ')
    comp = [0] * len(raw_words)# 0 = false, 1 = true
    for i, word in enumerate(raw_words):
        if (word == words[i]):
            fcount += 1
            comp[i] = 1
    
    
    raw_wpm = len(raw_words) / time
    filtered_wpm = fcount / time

    res = {
        'raw': raw_wpm,
        'filtered': filtered_wpm,
        'comp': comp,
    }

    return Response(res)