from app.tasks.celery_app import celery_app


@celery_app.task(name="email.send_generic")
def send_generic_email(to_email: str, subject: str, body: str) -> str:
    return f"Email queued to {to_email} with subject {subject}"
