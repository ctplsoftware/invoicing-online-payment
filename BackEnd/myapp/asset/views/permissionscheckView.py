from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from django.contrib.auth.models import Group

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_permissions(request):
    user = request.user
    roles = [group.name for group in user.groups.all()]
    permissions = list(user.get_all_permissions())
    return Response({
        "roles": roles,
        "permissions": permissions
    })