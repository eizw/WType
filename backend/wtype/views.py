from rest_framework.response import Response
from rest_framework.decorators import api_view
from os import path
import json
from random import sample

basepath = path.dirname(__file__)
filepath = path.abspath(path.join(basepath, "..", "words.json"))
# Create your views here.

# @api_view(['POST'])
# def loginUser(request):
#     username = request.get(username)
#     password = request.get(password)
#     user = authenticate(request, username=username, password=password)
#     if user is not None:
#         login(request, user)
#         return Response('Login successful')
#     else:
#         return Response('Invalid login')

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