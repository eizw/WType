from rest_framework.response import Response
from rest_framework.decorators import api_view, authentication_classes, permission_classes
from django.contrib.auth import authenticate, login, logout
from os import path
import json
import math
from Levenshtein import distance
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
    words = request.GET['words'].split()
    time = int(request.GET['time'])
    
    print(raw)
    print(words)

    fcount = 0
    raw_words = raw.split()
    n = len(raw_words)
    comp = [0 for i in range(n)] # 0 = false, 1 = true
    for i, word in enumerate(raw_words):
        print(word, words[i])
        curr = distance(word, words[i])
        if (curr > 0):
            fcount += 1
            comp[i] = curr
    
    
    raw_wpm = math.ceil(n / time)
    filtered_wpm = math.ceil((n - fcount) / time)

    res = {
        'raw': raw_wpm,
        'filtered': filtered_wpm,
        'comp': comp,
    }

    return Response(res)