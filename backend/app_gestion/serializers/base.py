from rest_framework import serializers

class TimeStampedSerializer(serializers.ModelSerializer):
    created_at = serializers.DateTimeField(format='%d/%m/%Y %H:%M', read_only=True)
    updated_at = serializers.DateTimeField(format='%d/%m/%Y %H:%M', read_only=True)

    class Meta:
        abstract = True
