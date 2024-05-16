from django.urls import include, re_path

from . import views

urlpatterns = [
    re_path(r"^$", views.index, name="index"),
    re_path(r"^create/$", views.create, name="create"),
    re_path(r"^do_create/$", views.do_create, name="do_create"),
    re_path(r"^edit/(\d+)/$", views.edit, name="edit"),
    re_path(r"^do_edit/(\d+)/$", views.do_edit, name="do_edit"),
    re_path(r"^api/v1/", include(("role.api_v1.urls", "role.api_v1"))),
    re_path(r"^api/v2/", include(("role.api_v2.urls", "role.api_v2"))),
]
