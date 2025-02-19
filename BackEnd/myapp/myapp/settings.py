"""
Django settings for myapp project.

Generated by 'django-admin startproject' using Django 5.0.7.

For more information on this file, see
https://docs.djangoproject.com/en/5.0/topics/settings/

For the full list of settings and their values, see
https://docs.djangoproject.com/en/5.0/ref/settings/
"""

from pathlib import Path
from datetime import timedelta
from django.conf import settings
import os



# Build paths inside the project like this: BASE_DIR / 'subdir'.
BASE_DIR = Path(__file__).resolve().parent.parent

MEDIA_URL = '/media/'  # URL to access uploaded files
MEDIA_ROOT = os.path.join(BASE_DIR, 'media')  # Path to save uploaded files


# Quick-start development settings - unsuitable for production
# See https://docs.djangoproject.com/en/5.0/howto/deployment/checklist/

# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = 'django-insecure-hy^3)hdi!uk^azdu*pz6e^wxfv7=0t18=p#q^ak-(y@=1%xr)1'

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = True

ALLOWED_HOSTS = ['*']

CLIENT_ID = 'A0DC1ADAB83E4F3397943F246B36B880'
CLIENT_SECRET = '5531F90CG6414G44E8GA274GD48DFA3EDDCE'


AUTHENTICATION_URL = 'https://gsp.adaequare.com/gsp/authenticate?action=GSP&grant_type=token'
GENERATE_IRN_URL = 'https://gsp.adaequare.com/test/enriched/ei/api/invoice'
CANCEL_IRN_URL = 'https://gsp.adaequare.com/test/enriched/ei/api/invoice/cancel'
TAXPAYER_DETAILS_URL = 'https://gsp.adaequare.com/test/enriched/ei/api/master/gstin'

COMPANY_NAME = 'Chakravarthy Commercials'
COMPANY_ADDRESS = '161 A ETTAYAPURAM ROAD, Thoothukudi, Tamil Nadu, 628002'
LOCATION = 'Thoothukudi'
PIN_CODE = '628002'
STATE_NAME = 'Tamil Nadu'
STATE_CODE = '33'
EMAIL_ID = 'sample@gmail.com'
PHONE_NUMBER = '1234567890'
LEGAL_NAME = 'RAMAIAH THEVAR PERUMAL'
TRADE_NAME = 'CHAKRAVARTHY COMMERCIALS'

BANK_ACCOUNT_NUMBER = '0708102000012120'
BANK_NAME = 'IDBI Bank'
IFSC_CODE = 'IBKL0000708'
BRANCH_NAME = 'Tirunelveli'

GSTIN = '02AMBPG7773M002'
PAN = 'AMBPG7773M002'
USERNAME = 'adqgsphpusr1'
PASSWORD = 'Gsp@1234'


# Application definition

INSTALLED_APPS = [
    'asset',  # define your app name
    'corsheaders', 
    'rest_framework',
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'rest_framework_simplejwt',
    'rest_framework_simplejwt.token_blacklist',

]




REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': (
        'rest_framework_simplejwt.authentication.JWTAuthentication',
    ),
}

MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
    #middleware for corsHeaders
    'corsheaders.middleware.CorsMiddleware',
    'django.middleware.common.CommonMiddleware',
]

ROOT_URLCONF = 'myapp.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

WSGI_APPLICATION = 'myapp.wsgi.application'


# Database
# https://docs.djangoproject.com/en/5.0/ref/settings/#databases

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.mysql',
        'NAME': 'invoice_online_payment', #define your database name here
        'USER': 'root', #change your mysql user name here
        'PASSWORD': '',  # change your mysql password here
        'HOST': 'localhost',
        'PORT': '3306'
    }
}


# Password validation
# https://docs.djangoproject.com/en/5.0/ref/settings/#auth-password-validators

AUTH_PASSWORD_VALIDATORS = [
    {
        'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator',
    },
]


# Internationalization
# https://docs.djangoproject.com/en/5.0/topics/i18n/

LANGUAGE_CODE = 'en-us'

TIME_ZONE = 'UTC'

USE_I18N = True

USE_TZ = True


# Static files (CSS, JavaScript, Images)
# https://docs.djangoproject.com/en/5.0/howto/static-files/

STATIC_URL = 'static/'
STATIC_ROOT = os.path.join(BASE_DIR, 'staticfiles')  # Define where static files will be collected


# Default primary key field type
# https://docs.djangoproject.com/en/5.0/ref/settings/#default-auto-field

DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'


#cors origin
CORS_ALLOW_ALL_ORIGINS = True   # it will allow all origin, no need to specify specific url

CORS_ALLOW_CREDENTIALS = True  # Allow cookies to be included in CORS requests

CORS_ALLOW_HEADERS = [
    'content-type',
    'authorization',
    'x-requested-with',
    'accept',
    'origin',
    'x-csrftoken',
]

SIMPLE_JWT = {
    'ACCESS_TOKEN_LIFETIME': timedelta(days=1),  # Set access token expiry
    'REFRESH_TOKEN_LIFETIME': timedelta(days=1),    # Set refresh token expiry
    'ROTATE_REFRESH_TOKENS': True,                 # Issue new refresh token on refresh
    'BLACKLIST_AFTER_ROTATION': True,              # Blacklist old refresh tokens
    'AUTH_HEADER_TYPES': ('Bearer',),             # Token type in headers
}
