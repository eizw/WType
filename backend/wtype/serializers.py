from wtype.models import UserAccount

from djoser.serializers import UserCreatePasswordRetypeSerializer, SendEmailResetSerializer, UserCreatePasswordRetypeSerializer

class CustomUserCreateSerializer(UserCreatePasswordRetypeSerializer):    
    class Meta(UserCreatePasswordRetypeSerializer.Meta):
        model = UserAccount
        fields = ['id', 'username', 'password', 'email']