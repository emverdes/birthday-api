from datetime import date
from flask import Flask, jsonify
from db import get_connection
from config import Config

app = Flask(__name__)


@app.route('/health', methods=['GET'])
def health():
    return jsonify({'status': 'ok'}), 200


@app.route('/api/people', methods=['GET'])
def get_people():
    conn = get_connection()
    try:
        with conn.cursor() as cur:
            cur.execute(
                """
                SELECT id, first_name, last_name, birth_date, email, city
                FROM people
                ORDER BY last_name, first_name
                """
            )
            rows = cur.fetchall()
        return jsonify(rows), 200
    finally:
        conn.close()


@app.route('/api/people/<int:person_id>', methods=['GET'])
def get_person(person_id):
    conn = get_connection()
    try:
        with conn.cursor() as cur:
            cur.execute(
                """
                SELECT id, first_name, last_name, birth_date, email, city
                FROM people
                WHERE id = %s
                """,
                (person_id,),
            )
            row = cur.fetchone()

        if row is None:
            return jsonify({'error': 'person not found'}), 404

        return jsonify(row), 200
    finally:
        conn.close()


@app.route('/api/birthdays/today', methods=['GET'])
def birthdays_today():
    today = date.today()
    conn = get_connection()
    try:
        with conn.cursor() as cur:
            cur.execute(
                """
                SELECT id, first_name, last_name, birth_date, email, city
                FROM people
                WHERE MONTH(birth_date) = %s
                  AND DAY(birth_date) = %s
                ORDER BY last_name, first_name
                """,
                (today.month, today.day),
            )
            rows = cur.fetchall()

        return jsonify({'today': today.isoformat(), 'count': len(rows), 'results': rows}), 200
    finally:
        conn.close()


@app.route('/api/birthdays/month/<int:month>', methods=['GET'])
def birthdays_by_month(month):
    if month < 1 or month > 12:
        return jsonify({'error': 'month must be between 1 and 12'}), 400

    conn = get_connection()
    try:
        with conn.cursor() as cur:
            cur.execute(
                """
                SELECT id, first_name, last_name, birth_date, email, city
                FROM people
                WHERE MONTH(birth_date) = %s
                ORDER BY DAY(birth_date), last_name, first_name
                """,
                (month,),
            )
            rows = cur.fetchall()

        return jsonify({'month': month, 'count': len(rows), 'results': rows}), 200
    finally:
        conn.close()


if __name__ == '__main__':
    app.run(host=Config.APP_HOST, port=Config.APP_PORT)
