from django.urls import path
from .views import UserView, CustomerView ,PartMasterView,InwardTransactionView,permissionscheckView,authenticateView ,AndroidAPIView, usercreationView,AndroidAPIView ,LocationMasterViews,OrderTransactionView, TransactionView

from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView


urlpatterns = [

    #login pagess
    path('login/', UserView.login, name='login'),
    path('forgot_password/', UserView.forgot_password, name='forgot_password'),
    path('user_data/', UserView.user_data, name='user_Data'),
    path('get_user_permissions/', permissionscheckView.get_permissions, name='check_permission'),
    path('token/',authenticateView.CustomTokenObtainPairView.as_view(), name='token_obtain_pair'),
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
    
    #location master
     path('location-create',LocationMasterViews.create_locationmaster),
     path('locationmaster_list',LocationMasterViews.get_locationmaster),
     path('locationmaster_edit/<int:id>',LocationMasterViews.editGet_locationmaster),
     path('edit_locationmaster_update/<int:id>',LocationMasterViews.update_locationmaster),
     
    #order_Tranction master
    path('order_transaction_get',OrderTransactionView.get_order_transaction),
    
    #order_header master
    path('order-details-all', TransactionView.get_order_details_all),
    path('order-details-get', TransactionView.get_order_details),
    path('disptach-completed-update', TransactionView.update_dispatched_completed),
    path('verified-completed-update', TransactionView.update_verified_completed),
    path('einvoice-create', TransactionView.create_e_invoice),
    path('einvoice-cancel', TransactionView.cancel_e_invoice),
 


    #android 
    path('android/login/',AndroidAPIView.android_login),
    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('api/token/logout/', AndroidAPIView.logout, name='token_logout'),
    path('android/get-generate-order', AndroidAPIView.get_generate_order),
    path('android/create-order', AndroidAPIView.create_order),
    path('android/get-order', AndroidAPIView.get_order),
    path('android/get-order-list', AndroidAPIView.get_order_list),
    path('android/create-order-attachment', AndroidAPIView.create_order_attachment),
    path('android/customer-details',AndroidAPIView.get_card_details),
    path('android/order-counts',AndroidAPIView.get_order_count),
    path('android/einvoice-pdf', AndroidAPIView.get_einvoice_details)

    
]
