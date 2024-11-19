from rest_framework import status
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from ..models.PartMasterModel import PartMaster
from ..serializers.PartMasterSerializer import PartMasterSerializer
from django.utils import timezone
from ..models.CustomerMasterModel import CustomerMaster

from ..serializers.CustomerSerializer import CustomerSerializer

from ..models.InwardTransactionModel import InwardTransaction
from ..serializers.InwardTransactionSerializer import InwardTransactionSerializer
from django.db.models import Sum






@api_view(['GET'])
def get_part_master(request):
    # Filter the PartMaster data where status is 'active'
    active_parts = PartMaster.objects.filter(status="active")
    
    # Extract only the part_description
    part_descriptions = [part.part_description for part in active_parts]

    # Construct the response in the desired format
    return Response({
        'success': True,
        'message': "Valid",
        'data': part_descriptions
    })


@api_view(['GET'])
def get_partmaster_usermaster(request, userid, part_desc):
    try:
        # Filter CustomerMaster for active status and userid
        customers = CustomerMaster.objects.filter(status='active', id=userid)
        
        # Filter PartMaster for active status and part_desc
        parts = PartMaster.objects.filter(status='active', part_description__icontains=part_desc)
        
        if not customers.exists() or not parts.exists():
            return Response({
                'success': False,
                'message': "No active records found in CustomerMaster or PartMaster",
                'data': None
            })

        # Extract address data from CustomerMaster
        addresses = []
        credit_limit = None
        if customers.exists():
            customer = customers.first()  # Assuming one customer per user ID
            addresses = [
                addr for addr in [
                    customer.delivery_address,
                    customer.additional_address1,
                    customer.additional_address2
                ] if addr
            ]
            
            credit_limit = customer.credit_limit
            credit_limit_int = int(credit_limit.replace(",", ""))

        # Extract PartMaster and InwardTransaction data
        unit_price = None
        uom = None
        if parts.exists():
            part = parts.first()  # Assuming one part per description
            unit_price = part.unit_price
            uom = part.uom

        # Calculate stock (total_quantity) from InwardTransaction
        total_quantity = (
            InwardTransaction.objects.filter(part_description__icontains=part_desc)
            .aggregate(total_quantity=Sum('quantity'))
            .get('total_quantity', 0)
        )

        # Return response in the desired format
        return Response({
            'success': True,
            'message': "Valid",
            'data': {
                "address": addresses,
                "credit_prices": credit_limit_int,
                "unit_prices": unit_price,
                "stock": total_quantity,
                "uom": uom
            }
        })
    except Exception as e:
        return Response({
            'success': False,
            'message': f"An error occurred: {str(e)}",
            'data': None
        })


