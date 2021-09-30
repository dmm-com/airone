from django.conf.urls import url

from . import views

urlpatterns = [
    url(r'^history/(\d+)$', views.history, name='history'),
    url(r'^entities/(\d+)$', views.get_entity, name='get_entity'),
]
