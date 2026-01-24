from django.contrib import admin
from .models import TestAttempt, Response, ResponseOption

admin.site.register(Response)
admin.site.register(ResponseOption)

admin.site.register(TestAttempt)
