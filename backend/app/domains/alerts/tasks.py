from app.tasks.celery_app import celery_app


@celery_app.task(name="alerts.send_price_drop_email")
def send_price_drop_email(email: str, variant_name: str, price_drop: float) -> str:
    return f"Queued price drop email to {email} for {variant_name}: {price_drop}"
