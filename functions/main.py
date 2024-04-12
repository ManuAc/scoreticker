# Welcome to Cloud Functions for Firebase for Python!
# To get started, simply uncomment the below code or create your own.
# Deploy with `firebase deploy`

from firebase_functions import https_fn, options
from firebase_admin import firestore
from firebase_admin import initialize_app
from flask import request, jsonify

# Initialize Firebase Admin SDK
initialize_app()


@https_fn.on_request(
    cors=options.CorsOptions(cors_origins="*", cors_methods=["get", "post"])
)
def add_game_record(request):
    try:
        data = request.get_json()
        date = data.get('date')
        player1 = data.get('player1')
        player2 = data.get('player2')
        score_player1 = data.get('scorePlayer1')
        score_player2 = data.get('scorePlayer2')
        winner = data.get('winner')

        # Validate the request data
        if not all([date, player1, player2, score_player1, score_player2, winner]):
            return jsonify({'error': 'Invalid request data.'}), 400

        # Add the game record to Firestore
        game_record_ref = firestore.client().collection('gameRecords').add({
            'date': date,
            'player1': player1,
            'player2': player2,
            'scorePlayer1': score_player1,
            'scorePlayer2': score_player2,
            'winner': winner
        })

        return jsonify({'status': 'ok'}), 200

    except Exception as e:
        print('Error adding game record:', e)
        return jsonify({'error': 'Failed to add game record.'}), 500


@https_fn.on_request(
    cors=options.CorsOptions(cors_origins="*", cors_methods=["get", "post"])
)
def get_game_records(request):
    try:
        # Retrieve game records from Firestore
        game_records = []
        docs = firestore.client().collection('gameRecords').get()
        for doc in docs:
            game_records.append(doc.to_dict())

        return jsonify(game_records), 200

    except Exception as e:
        print('Error retrieving game records:', e)
        return jsonify({'error': 'Failed to retrieve game records.'}), 500


@https_fn.on_request(
    cors=options.CorsOptions(cors_origins="*", cors_methods=["get", "post"])
)
def get_game_summary(request):
    try:
        # Retrieve summaries for each player
        players = ["manu", "sabari", "rishabh", "karan", "akash"]
        summary = {}

        for name in players:

            collection_ref = firestore.client().collection('name')
            docs = collection_ref.stream()
            doc_map = {doc.id: doc.to_dict() for doc in docs}

            summary[name] = doc_map

        return jsonify(summary), 200

    except Exception as e:
        print('Error retrieving game records:', e)
        return jsonify({'error': 'Failed to retrieve game records.'}), 500