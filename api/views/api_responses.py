from rest_framework.response import Response
from rest_framework import status


class APIResponse:
    @staticmethod
    def success(data=None, message=None, status_code=status.HTTP_200_OK):
        payload = {"data": data or {}}
        if message:
            payload["data"]["message"] = message
        return Response(payload, status=status_code)

    @staticmethod
    def error(errors, status_code=status.HTTP_400_BAD_REQUEST):
        if isinstance(errors, str):
            errors = [errors]
        return Response({"errors": errors}, status=status_code)
