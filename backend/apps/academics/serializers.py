from rest_framework import serializers
from .models import AIChatSession, AIChatMessage

class AIChatMessageSerializer(serializers.ModelSerializer):
    class Meta:
        model = AIChatMessage
        fields = ['id', 'session', 'sender', 'content', 'metadata', 'created_at']
        read_only_fields = ['id', 'created_at']


class AIChatSessionListSerializer(serializers.ModelSerializer):
    message_count = serializers.SerializerMethodField()
    latest_message = serializers.SerializerMethodField()

    class Meta:
        model = AIChatSession
        fields = [
            'id', 'title', 'subject', 'semester', 'mode', 'tone',
            'is_pinned', 'created_at', 'updated_at', 'message_count', 'latest_message'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']

    def get_message_count(self, obj):
        return obj.messages.count()

    def get_latest_message(self, obj):
        latest = obj.messages.order_by('-created_at').first()
        if latest:
            return {
                'id': latest.id,
                'sender': latest.sender,
                'content': latest.content[:80],
                'created_at': latest.created_at.isoformat()
            }
        return None


class AIChatSessionDetailSerializer(serializers.ModelSerializer):
    messages = AIChatMessageSerializer(many=True, read_only=True)

    class Meta:
        model = AIChatSession
        fields = [
            'id', 'title', 'subject', 'semester', 'mode', 'tone',
            'is_pinned', 'created_at', 'updated_at', 'messages'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at', 'messages']
