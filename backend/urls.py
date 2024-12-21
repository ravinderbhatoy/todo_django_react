from django.urls import path
from . import views
from rest_framework_simplejwt.views import (
    TokenRefreshView,
)



urlpatterns = [
    path("todos/",views.get_todos),
    path("create/",views.create_todo),
    path("update/<int:pk>",views.update_todo),
    path("delete/<int:pk>",views.delete_todo),

    path('token/', views.MyTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
]

