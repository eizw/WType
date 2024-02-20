from django.contrib.auth.models import User, Group
from wtype.models import Word
from rest_framework import viewsets
from rest_framework import permissions
from rest_framework.response import Response
from wtype.serializers import UserSerializer, GroupSerializer, WordSerializer

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
def getWord(request):
    # app = Word.objects.all()
    # serializer = WordSerializer(app, many=True)
    # return Response(serializer.data)
    words = []
    with open('../words.txt', 'r') as wordfile:
        lines = wordfile.readlines()
        words = lines.splitlines()
    return Response(words)
