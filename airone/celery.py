import importlib
import os

import configurations
from celery import Celery
from celery.signals import task_failure
from django.conf import settings
from django.core.mail import mail_admins

from airone.lib.log import Logger

# set the default Django settings module for the 'celery' program.
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "airone.settings")
os.environ.setdefault("DJANGO_CONFIGURATION", "Dev")

configurations.setup()

for extension in settings.AIRONE["EXTENSIONS"]:
    try:
        importlib.import_module("%s.settings" % extension)
    except ImportError:
        Logger.warning("Failed to load settings %s" % extension)

app = Celery("airone")

# Using a string here means the worker doesn't have to serialize
# the configuration object to child processes.
# - namespace='CELERY' means all celery-related configuration keys
#   should have a `CELERY_` prefix.
app.config_from_object("django.conf:settings", namespace="CELERY")

# Load task modules from all registered Django app configs.
app.autodiscover_tasks()


@task_failure.connect()
def celery_task_failure_email(**kwargs):
    """This event handler is for reporting by email when an exception error in celery."""

    subject = "ERROR Celery Task {sender.name}".format(**kwargs)
    message = """
Task Name: {sender.name}
Task ID: {task_id}
Task args: {args}
Task kwargs: {kwargs}

raised exception:
{exception!r}

full traceback:
{einfo}
""".format(**kwargs)

    # Logger for DEBUG because email is not sent in dev environment
    Logger.error(message)

    # Logger for Alert because long texts usually cannot be parsed by log server
    Logger.error("An exception error has occurred")

    # Send an email so that admins can receive errors
    mail_admins(subject, message)


@task_failure.connect()
def celery_task_failure_update_job_status(**kwargs):
    """This event handler is update job status when an exception error in celery."""
    from job.models import Job, JobStatus

    job_id = kwargs["args"][0]
    job = Job.objects.get(id=job_id)
    job.status = JobStatus.ERROR
    job.save(update_fields=["status"])
