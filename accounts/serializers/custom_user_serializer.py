from rest_framework import serializers
from accounts.models import CustomUser


class CustomUserModelSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ["email", "password", "username"]
        extra_kwargs = {"password": {"write_only": True, "min_length": 8}}

    def create(self, validated_data):
        user = CustomUser.objects.create_user(**validated_data)
        return user

    def to_representation(self, instance):
        result = super().to_representation(instance)
        result.pop("password", None)
        return result
