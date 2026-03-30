from rest_framework.renderers import JSONRenderer


class StandardizedJSONRenderer(JSONRenderer):
    """Wrap successful responses in a consistent envelope."""

    def render(self, data, accepted_media_type=None, renderer_context=None):
        response = renderer_context.get("response") if renderer_context else None
        status_code = response.status_code if response else 200

        if data is None:
            payload = {
                "success": 200 <= status_code < 300,
                "message": "No content",
                "data": None,
            }
        elif isinstance(data, dict) and "success" in data:
            payload = data
        elif 200 <= status_code < 300:
            payload = {
                "success": True,
                "message": "Request successful",
                "data": data,
            }
        else:
            payload = data

        return super().render(payload, accepted_media_type, renderer_context)
