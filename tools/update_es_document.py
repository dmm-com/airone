import os
import sys
from optparse import OptionParser

import configurations

# append airone directory to the default path
sys.path.append("./")

# prepare to load the data models of AirOne
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "airone.settings")
os.environ.setdefault("DJANGO_CONFIGURATION", "Dev")

# load AirOne application
configurations.setup()

from entity.models import Entity  # NOQA
from job.models import Job  # NOQA


def update_es_document(entities):
    target_entity = Entity.objects.filter(is_active=True)
    if entities:
        target_entity = target_entity.filter(name__in=entities)

    for entity in target_entity:
        Job.new_update_documents(entity).run(will_delay=False)


def get_options():
    parser = OptionParser(usage="%prog [options] [target-Entities]")

    return parser.parse_args()


if __name__ == "__main__":
    (option, entities) = get_options()

    update_es_document(entities)
