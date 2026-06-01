from typing import Any

from fastapi.responses import JSONResponse


def envelope(
    data: Any = None, errors: list[dict[str, Any]] | None = None, meta: dict[str, Any] | None = None
) -> JSONResponse:
    payload = {"data": data, "errors": errors or [], "meta": meta or {}}
    return JSONResponse(content=payload)
