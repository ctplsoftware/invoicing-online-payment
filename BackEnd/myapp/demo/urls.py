from django.urls import path
from . import views

urlpatterns = [
    path('signup/', views.signup, name='signup'),
    path('login/', views.login, name='login'),
    path('assign_permissions/', views.assign_permissions, name='assign_permissions'),
    path('roles-and-permissions/<int:user_id>/', views.get_user_roles_and_permissions, name='get_user_roles_and_permissions'),

    # SampleForm endpoints
    path('sample-forms/', views.sample_form_list, name='sample_form_list'),
    path('sample-forms/create/', views.sample_form_create, name='sample_form_create'),
    path('sample-forms/detail/<int:pk>/', views.sample_form_detail, name='sample_form_detail'),
    path('sample-forms/update/<int:pk>/', views.sample_form_update, name='sample_form_update'),
]
