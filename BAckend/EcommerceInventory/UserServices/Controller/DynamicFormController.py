from EcommerceInventory.Helpers import (
    getDynamicFormModels,
    getDynamicFormFields,
    getExcludeFields,
)
from rest_framework.views import APIView
from rest_framework.response import Response

from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.authentication import JWTAuthentication

from django.core.serializers import serialize as serializer
import json
from django.apps import apps

from UserServices.models import Users


class DynamicFormController(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def post(self, request, modelName):
        # Checking if model Name exists in the models
        if modelName not in getDynamicFormModels():
            return Response({"error": "Model Not Exist"}, status=404)
        # getting the model name from the models
        model = getDynamicFormModels()[modelName]
        model_class = apps.get_model(model)

        if model_class is None:
            return Response({"error": "Model Not Found"}, status=404)

        field_info = model_class._meta.fields
        model_fields = [field.name for field in field_info]
        exclude_fields = getExcludeFields()

        required_fields = [
            field.name
            for field in field_info
            if not field.null
            and field.default is not None
            and field.name not in exclude_fields
        ]

        missing_fields = [
            field for field in required_fields if field not in request.data
        ]
        if missing_fields:
            return Response(
                {
                    "error": [
                        f"Thefollowing field in required: {field}"
                        for field in missing_fields
                    ]
                },
                status=400,
            )
        # creating a copy of post data
        fields = request.data.copy()
        fields["domain_user_id"] = request.user.domain_user_id
        fields["added_by_user_id"] = Users.objects.get(id=request.user.id)

        fieldsdata = {
            key: value for key, value in fields.items() if key in model_fields
        }
        # all the model fields data
        print(model_fields)
        # all the post data fields
        print(fields.items())
        # sanititizing the post data fields by model fields data and eliminating the extra fields
        print(fieldsdata.items())

        # assigning Foreign Key instance for ForeignKey fields in Post Data
        for field in field_info:
            if (
                field.is_relation
                and field.name in fieldsdata
                and isinstance(fieldsdata[field.name], int)
            ):
                related_model = field.related_model
                try:
                    fieldsdata[field.name] = related_model.objects.get(
                        id=fieldsdata[field.name]
                    )
                except related_model.DoesNotExist:
                    return Response(
                        {"error": f"{field.name} Relation Not Exists"}, status=404
                    )

        model_instance = model_class.objects.create(**fieldsdata)

        serialized_data = serializer("json", [model_instance])
        model_json = json.loads(serialized_data)
        response_json = model_json[0]["fields"]
        response_json["id"] = model_json[0]["pk"]
        return Response(
            {"data": response_json, "message": "Data saved successfully"}, status=201
        )

    def get(self, request, modelName):
        if modelName not in getDynamicFormModels():
            return Response({"error": "Model not found"}, status=404)
        model = getDynamicFormModels()[modelName]
        model_class = apps.get_model(model)

        if model_class is None:
            return Response({"error": "Model not found"}, status=404)

        model_instance = model_class()
        fields = getDynamicFormFields(model_instance, request.user.domain_user_id)
        return Response({"data": fields, "message": "Form fetched successfully"})
