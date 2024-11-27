from django.urls import path
from .views import UserView, CustomerView ,PartMasterView,InwardTransactionView,permissionscheckView,authenticateView ,AndroidAPIView, usercreationView,OrderTransactionViews
from rest_framework_simplejwt.views import (
    TokenRefreshView,
)

urlpatterns = [

    #login pagess
    path('login/', UserView.login, name='login'),
    path('forgot_password/', UserView.forgot_password, name='forgot_password'),
    path('user_data/', UserView.user_data, name='user_Data'),

    path('get_user_permissions/', permissionscheckView.get_permissions, name='check_permission'),
    path('token/',authenticateView.CustomTokenObtainPairView.as_view(), name='token_obtain_pair'),
    # path('refresh/',authenticateView.CustomTokenRefreshView.as_view(), name='token_refresh'),
    path('refresh/', TokenRefreshView.as_view(), name='token_refresh'),


    
    
    
    
    #customer-master
    path('save-customer', CustomerView.create_customer),
    path('customermaster_fetch', CustomerView.get_customer_data),
    path('customermaster_update/<int:id>',CustomerView.update_customer),
    path('customerMasterEditFetch/<int:id>',CustomerView.get_customer_editdata),


    #part master start
    path('part_master_Create', PartMasterView.create_part_master),
    path('editGet_part_master/<int:id>', PartMasterView.editGet_part_master),
    path('get_part_master', PartMasterView.get_part_master),
    path('update_part_master/<int:id>', PartMasterView.update_part_master),


    #Inward transaction start
    path('create_inwardTransaction',InwardTransactionView.create_inwardTransaction),
    path('fetch_inward_transaction',InwardTransactionView.fetch_inward_transaction),
    path('edit_inward_transaction/<int:id>',InwardTransactionView.edit_inward_transaction),
    path('update_inwardtransaction/<int:id>',InwardTransactionView.update_inwardtransaction),


    #admin create
    path('user_create',usercreationView.admincreates),
    path('rolesfetch',usercreationView.rolesget),
    path('user-master-get',usercreationView.usermaster_get),
    path('edit_usermaster/<int:id>',usercreationView.edit_usermaster_fetch),
    path('edit_usermaster_update/<int:id>',usercreationView.create_update_user),





    #android 
    path('android/generate-inv/get-part-list', AndroidAPIView.get_part_master),
    path('android/generate-inv/get-part-details', AndroidAPIView.get_partmaster_usermaster, name='get_partmaster_usermaster'),
    path('create-ordertransaction',OrderTransactionViews.create_ordertransaction),
    path('getOrderTransactions/<str:order_no>', OrderTransactionViews.getOrderTransactionsForOrderNumber),
    path('create-order--transaction', OrderTransactionViews.create_orderplace_transaction),
    path('upload-attachments',OrderTransactionViews.upload_attachment)






]
