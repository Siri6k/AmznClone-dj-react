from django.urls import path
from UserServices.Controller import AuthController


urlpatterns = [
    path("login/", AuthController.LoginAPIView.as_view(), name="login"),
    path("signup/", AuthController.SignupAPIView.as_view(), name="login"),
    path("publicApi/", AuthController.PublicAPIView.as_view(), name="public"),
    path("protectedApi/", AuthController.ProtectedAPIView.as_view(), name="protected"),
]
