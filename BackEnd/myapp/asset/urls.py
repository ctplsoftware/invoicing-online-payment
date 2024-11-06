from django.urls import path
from .views import UserView, CustomerView

urlpatterns = [
    path('signup/', UserView.signup, name='signup'),
    path('login/', UserView.login, name='login'),
    path('assign_permissions/', UserView.assign_permissions, name='assign_permissions'),
    path('roles-and-permissions/<int:user_id>/', UserView.get_user_roles_and_permissions, name='get_user_roles_and_permissions'),

    # SampleForm endpoints
    path('sample-forms/', UserView.sample_form_list, name='sample_form_list'),
    path('sample-forms/create/', UserView.sample_form_create, name='sample_form_create'),
    path('sample-forms/detail/<int:pk>/', UserView.sample_form_detail, name='sample_form_detail'),
    path('sample-forms/update/<int:pk>/', UserView.sample_form_update, name='sample_form_update'),
    
    
    #customer-master
    path('save-customer', CustomerView.create_customer),
    #fetch-Customer Master
    path('customermaster_fetch', CustomerView.get_customer_data),

    #update the customer master 
    path('customermaster_update/<int:id>',CustomerView.update_customer),

    path('customerMasterEditFetch/<int:id>',CustomerView.get_customer_editdata)


]
