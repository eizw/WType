from django.contrib.auth.models import User, Group
from wtype.models import Word
from rest_framework import viewsets
from rest_framework import permissions
from rest_framework.response import Response
from rest_framework.decorators import api_view, renderer_classes
from rest_framework.renderers import JSONRenderer, TemplateHTMLRenderer
from wtype.serializers import UserSerializer, GroupSerializer, WordSerializer
from os import path

basepath = path.dirname(__file__)
filepath = path.abspath(path.join(basepath, "..", "words.txt"))
# Create your views here.

class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all().order_by('-date_joined')
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticated]

    
class GroupViewSet(viewsets.ModelViewSet):
    queryset = Group.objects.all()
    serializer_class = GroupSerializer
    permission_classes = [permissions.IsAuthenticated]

# GET WORDS
@api_view(['GET'])
def getWord(request):
    # app = Word.objects.all()
    # serializer = WordSerializer(app, many=True)
    # return Response(serializer.data)
    words = []
    with open(filepath, 'r') as wordfile:
        words = wordfile.read().split('\n')
        return Response(words)
    #data = {'words': words}
