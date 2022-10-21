import errno
import logging
import os
import subprocess
from typing import Any, Dict

from configurations import Configuration
from django_replicated import settings


class Common(Configuration):

    # Build paths inside the project like this: os.path.join(BASE_DIR, ...)
    BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

    # Quick-start development settings - unsuitable for production
    # See https://docs.djangoproject.com/en/1.11/howto/deployment/checklist/

    # SECURITY WARNING: keep the secret key used in production secret!
    SECRET_KEY = "(ch@ngeMe)"

    # Celery settings
    CELERY_BROKER_URL = "amqp://guest:guest@localhost//"

    #: Only add pickle to this list if your broker is secured
    #: from unwanted access (see userguide/security.html)
    CELERY_ACCEPT_CONTENT = ["json"]
    CELERY_TASK_SERIALIZER = "json"
    CELERY_BROKER_HEARTBEAT = 0

    # SECURITY WARNING: don't run with debug turned on in production!
    DEBUG = True
    # INTERNAL_IPS = ["127.0.0.1"]

    ALLOWED_HOSTS = ["*"]

    # Application definition

    INSTALLED_APPS = [
        "common",
        "user",
        "group",
        "entity",
        "acl",
        "dashboard",
        "entry",
        "job",
        "webhook",
        "role",
        "django.contrib.admin",
        "django.contrib.auth",
        "django.contrib.contenttypes",
        "django.contrib.sessions",
        "django.contrib.messages",
        "django.contrib.staticfiles",
        "django.contrib.humanize",
        "import_export",
        "rest_framework",
        "rest_framework.authtoken",
        "custom_view.background",
        "custom_view",
        "drf_spectacular",
        "django_filters",
        "social_django",
        # "debug_toolbar",
    ]

    MIDDLEWARE = [
        "django.middleware.security.SecurityMiddleware",
        "whitenoise.middleware.WhiteNoiseMiddleware",
        "airone.lib.log.LoggingRequestMiddleware",
        "django.contrib.sessions.middleware.SessionMiddleware",
        "django.middleware.common.CommonMiddleware",
        "django.middleware.csrf.CsrfViewMiddleware",
        "django.contrib.auth.middleware.AuthenticationMiddleware",
        "django.contrib.messages.middleware.MessageMiddleware",
        "django.middleware.clickjacking.XFrameOptionsMiddleware",
        "social_django.middleware.SocialAuthExceptionMiddleware",
        "airone.lib.db.AirOneReplicationMiddleware",
        # "debug_toolbar.middleware.DebugToolbarMiddleware",
    ]

    ROOT_URLCONF = "airone.urls"

    PROJECT_PATH = os.path.realpath(os.path.dirname(__file__))
    TEMPLATES = [
        {
            "BACKEND": "django.template.backends.django.DjangoTemplates",
            "DIRS": [
                PROJECT_PATH + "/../templates/",
            ],
            "APP_DIRS": True,
            "OPTIONS": {
                "context_processors": [
                    "django.template.context_processors.debug",
                    "django.template.context_processors.request",
                    "django.contrib.auth.context_processors.auth",
                    "django.contrib.messages.context_processors.messages",
                    "social_django.context_processors.backends",
                    "social_django.context_processors.login_redirect",
                ],
            },
        },
    ]

    WSGI_APPLICATION = "airone.wsgi.application"

    # https://docs.djangoproject.com/en/2.2/ref/settings/#secure-proxy-ssl-header
    SECURE_PROXY_SSL_HEADER = ("HTTP_X_FORWARDED_PROTO", "https")

    # https://docs.djangoproject.com/en/3.2/ref/settings/#use-x-forwarded-port
    USE_X_FORWARDED_PORT = True

    # https://docs.djangoproject.com/en/3.2/ref/settings/#session-cookie-secure
    SESSION_COOKIE_SECURE = True

    # https://docs.djangoproject.com/en/3.2/ref/middleware/#http-strict-transport-security
    SECURE_HSTS_PRELOAD = True
    SECURE_HSTS_SECONDS = 1209600

    # Database
    # https://docs.djangoproject.com/en/1.11/ref/settings/#databases

    DATABASES = {
        "default": {
            "ENGINE": "django.db.backends.mysql",
            "NAME": "airone",
            "USER": "airone",
            "PASSWORD": "password",
            "HOST": "127.0.0.1",
            "OPTIONS": {
                "charset": "utf8mb4",
            },
        }
    }
    DATABASE_ROUTERS = ["django_replicated.router.ReplicationRouter"]
    REPLICATED_DATABASE_SLAVES = ["default"]
    REPLICATED_CACHE_BACKEND = settings.REPLICATED_CACHE_BACKEND
    REPLICATED_DATABASE_DOWNTIME = settings.REPLICATED_DATABASE_DOWNTIME
    REPLICATED_VIEWS_OVERRIDES = settings.REPLICATED_VIEWS_OVERRIDES
    REPLICATED_READ_ONLY_DOWNTIME = settings.REPLICATED_READ_ONLY_DOWNTIME
    REPLICATED_READ_ONLY_TRIES = settings.REPLICATED_READ_ONLY_TRIES
    REPLICATED_FORCE_MASTER_COOKIE_NAME = settings.REPLICATED_FORCE_MASTER_COOKIE_NAME
    REPLICATED_FORCE_MASTER_COOKIE_MAX_AGE = settings.REPLICATED_FORCE_MASTER_COOKIE_MAX_AGE
    REPLICATED_FORCE_STATE_HEADER = settings.REPLICATED_FORCE_STATE_HEADER
    REPLICATED_CHECK_STATE_ON_WRITE = settings.REPLICATED_CHECK_STATE_ON_WRITE
    REPLICATED_FORCE_MASTER_COOKIE_STATUS_CODES = (
        settings.REPLICATED_FORCE_MASTER_COOKIE_STATUS_CODES
    )
    REPLICATED_MANAGE_ATOMIC_REQUESTS = settings.REPLICATED_MANAGE_ATOMIC_REQUESTS

    # Password validation
    # https://docs.djangoproject.com/en/1.11/ref/settings/#auth-password-validators

    AUTH_PASSWORD_VALIDATORS = [
        {
            "NAME": "django.contrib.auth.password_validation.UserAttributeSimilarityValidator",
        },
        {
            "NAME": "django.contrib.auth.password_validation.MinimumLengthValidator",
        },
        {
            "NAME": "django.contrib.auth.password_validation.CommonPasswordValidator",
        },
        {
            "NAME": "django.contrib.auth.password_validation.NumericPasswordValidator",
        },
    ]

    # Internationalization
    # https://docs.djangoproject.com/en/1.11/topics/i18n/

    LANGUAGE_CODE = "en-us"

    TIME_ZONE = "Asia/Tokyo"

    USE_I18N = True

    USE_L10N = True

    USE_TZ = True

    # Static files (CSS, JavaScript, Images)
    # http://whitenoise.evans.io/en/stable/django.html

    STATIC_URL = "/static/"
    STATICFILES_DIRS = [os.path.join(BASE_DIR, "static")]
    STATIC_ROOT = os.path.join(BASE_DIR, "static_root")
    STATICFILES_STORAGE = "whitenoise.storage.CompressedManifestStaticFilesStorage"

    LOGIN_REDIRECT_URL = "/dashboard/"

    # global settins for AirOne
    AIRONE: Dict[str, Any] = {
        "CONCURRENCY": 1,
        "VERSION": "unknown",
        "FILE_STORE_PATH": "/tmp/airone_app",
        "AUTO_COMPLEMENT_USER": "auto_complementer",
        "EXTENSIONS": [],
        "TITLE": "AirOne",
        "SUBTITLE": "SubTitle, Please change it",
        "NOTE_DESC": "Description, Please change it",
        "NOTE_LINK": "",
        "SSO_DESC": "SSO",
    }

    try:
        proc = subprocess.Popen(
            "cd %s && git describe --tags" % BASE_DIR,
            shell=True,
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
        )
        outs, errs = proc.communicate(timeout=1)
        # if `git describe --tags` prints some string to stdout, use the result as version
        # else use 'unknown' as version (e.g. untagged git repository)
        if isinstance(outs, str):
            AIRONE["VERSION"] = outs.strip()
        elif isinstance(outs, bytes):
            AIRONE["VERSION"] = outs.decode("utf-8").strip()
        else:
            logging.getLogger(__name__).warning("could not describe airone version from git")

        # create a directory to store temporary file for applications
        if not os.path.exists(AIRONE["FILE_STORE_PATH"]):
            os.makedirs(AIRONE["FILE_STORE_PATH"])

    except OSError as e:
        # errno.ENOENT is the errno of FileNotFoundError
        if e.errno == errno.ENOENT:
            # do nothing and use 'unknown' as version when git does not exists
            logging.getLogger(__name__).warning("git command not found.")

    ES_CONFIG = {
        "NODES": ["localhost:9200"],
        "INDEX": "airone",
        "MAXIMUM_RESULTS_NUM": 500000,
        "TIMEOUT": None,
    }

    #
    # Note: Disable LDAP authentication by default in the mean time.
    #
    # AUTHENTICATION_BACKENDS = (
    #     "airone.auth.ldap.LDAPBackend",
    # )

    #
    # Note: Disable SSO authentication by default in the mean time.
    # (c.f. https://python-social-auth.readthedocs.io/en/latest/backends/saml.html)
    # AUTHENTICATION_BACKENDS = (
    #     "django.contrib.auth.backends.ModelBackend",
    #     "social_core.backends.saml.SAMLAuth",
    # )
    # SOCIAL_AUTH_SAML_SP_ENTITY_ID = ""
    # SOCIAL_AUTH_SAML_SP_PRIVATE_KEY = ""
    # SOCIAL_AUTH_SAML_SP_PUBLIC_CERT = ""
    # SOCIAL_AUTH_SAML_ORG_INFO = {
    #     "": {
    #         "name": "",
    #         "displayname": "",
    #         "url": "",
    #     }
    # }
    # SOCIAL_AUTH_SAML_TECHNICAL_CONTACT = {
    #     "givenName": "",
    #     "emailAddress": "",
    # }
    # SOCIAL_AUTH_SAML_SUPPORT_CONTACT = {
    #     "givenName": "",
    #     "emailAddress": ""
    # }
    # SOCIAL_AUTH_SAML_ENABLED_IDPS = {
    #     "": {
    #         "entity_id": "",
    #         "url": "",
    #         "x509cert": """
    #         """,
    #         "attr_user_permanent_id": "",
    #         "attr_name": "",
    #         "attr_username": "",
    #     }
    # }
    # SOCIAL_AUTH_CLEAN_USERNAMES = False
    #
    # SOCIAL_AUTH_PIPELINE = (
    #     "social_core.pipeline.social_auth.social_details",
    #     "social_core.pipeline.social_auth.social_uid",
    #     "social_core.pipeline.social_auth.auth_allowed",
    #     "social_core.pipeline.social_auth.social_user",
    #     "airone.auth.social_auth.create_user",
    #     # 'social_core.pipeline.user.get_username',
    #     # 'social_core.pipeline.user.create_user',
    #     "social_core.pipeline.social_auth.associate_user",
    #     "social_core.pipeline.social_auth.load_extra_data",
    #     "social_core.pipeline.user.user_details",
    # )

    AUTH_CONFIG = {
        "LDAP": {
            "SERVER_ADDRESS": "127.0.0.1",
            "USER_FILTER": "sn={username},ou=User,dc=example,dc=com",
        }
    }

    LOGGING: Dict[str, Any] = {
        "version": 1,
        "disable_existing_loggers": True,
        "formatters": {
            "all": {
                "format": "\t".join(
                    [
                        "[%(levelname)s]",
                        "asctime:%(asctime)s",
                        "module:%(module)s",
                        "message:%(message)s",
                        "process:%(process)d",
                        "thread:%(thread)d",
                    ]
                )
            }
        },
        "handlers": {
            "file": {
                "level": "INFO",
                "class": "logging.FileHandler",
                "filename": os.path.join(BASE_DIR, "logs/django.log"),
                "formatter": "all",
            },
            "console": {
                "level": "INFO",
                "class": "logging.StreamHandler",
                "formatter": "all",
            },
        },
        "loggers": {
            "airone": {
                "handlers": ["file", "console"],
                "level": "INFO",
                "propagate": False,
            },
        },
    }
    # If log dir is not exists create it.
    if not os.path.exists(os.path.dirname(LOGGING["handlers"]["file"]["filename"])):
        os.makedirs(os.path.dirname(LOGGING["handlers"]["file"]["filename"]))

    DEFAULT_AUTO_FIELD = "django.db.models.AutoField"

    AUTH_USER_MODEL = "user.User"

    REST_FRAMEWORK = {
        "DEFAULT_SCHEMA_CLASS": "drf_spectacular.openapi.AutoSchema",
        "DEFAULT_AUTHENTICATION_CLASSES": [
            "rest_framework.authentication.BasicAuthentication",
            "rest_framework.authentication.SessionAuthentication",
            "api_v1.auth.AironeTokenAuth",
        ],
        "DEFAULT_PERMISSION_CLASSES": [
            "rest_framework.permissions.IsAuthenticated",
        ],
        "PAGE_SIZE": 30,
        "EXCEPTION_HANDLER": "airone.lib.drf.custom_exception_handler",
    }

    SPECTACULAR_SETTINGS = {
        "PREPROCESSING_HOOKS": [
            "airone.spectacular.exclude_customview_hook",
            "airone.spectacular.filter_apiv2_hook",
        ]
    }
