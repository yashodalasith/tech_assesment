from rest_framework.views import exception_handler


def custom_exception_handler(exc, context):
    """Normalize API error payloads for predictable frontend handling."""
    response = exception_handler(exc, context)
    if response is None:
        return response

    if isinstance(response.data, dict):
        message = response.data.get("detail", "Request failed")
        errors = response.data
    else:
        message = "Request failed"
        errors = {"detail": response.data}

    response.data = {
        "success": False,
        "message": message,
        "errors": errors,
    }
    return response
