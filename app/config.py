import os


class Config:
    DB_HOST = os.getenv('DB_HOST', '127.0.0.1')
    DB_PORT = int(os.getenv('DB_PORT', '3306'))
    DB_NAME = os.getenv('DB_NAME', 'birthdays')
    DB_USER = os.getenv('DB_USER', 'birthdayapp')
    DB_PASSWORD = os.getenv('DB_PASSWORD', 'changeme')
    APP_HOST = os.getenv('APP_HOST', '0.0.0.0')
    APP_PORT = int(os.getenv('APP_PORT', '8000'))
