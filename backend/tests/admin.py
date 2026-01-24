from django.contrib import admin
from .models import Test, TestAccess, TestPasscodeHistory,TestQuestion


admin.site.register(TestQuestion)
admin.site.register(Test)
admin.site.register(TestAccess)
admin.site.register(TestPasscodeHistory)
