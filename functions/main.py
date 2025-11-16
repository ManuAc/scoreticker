# Welcome to Cloud Functions for Firebase for Python!
# To get started, simply uncomment the below code or create your own.
# Deploy with `firebase deploy`

from firebase_functions import https_fn, options
from firebase_admin import firestore
from firebase_admin import initialize_app
from flask import request, jsonify
import json
from datetime import datetime

# Initialize Firebase Admin SDK
initialize_app()


# Helper function to generate the games collection name
def get_games_collection_name(year):

    if year is None or int(year) <= 2024:
        return "games"

    month = datetime.now().month
    quarter = (month - 1) // 3 + 1

    if int(year) == 2025 and quarter <= 2:
        return "games_2025"

    return f"games_{year}_{quarter}"


# Helper function to generate the summary collection name
def get_summary_collection_name(year):

    if year is None or int(year) <= 2024:
        return "summary"

    month = datetime.now().month
    quarter = (month - 1) // 3 + 1

    if int(year) == 2025 and quarter <= 2:
        return "summary_2025"

    return f"summary_{year}_{quarter}"


@https_fn.on_request(
    cors=options.CorsOptions(cors_origins="*", cors_methods=["get", "post"])
)
def add_game_record(request):
    year = datetime.now().year
    collection_name = get_games_collection_name(year)

    try:
        # Update games collection
        game_data = request.get_json()
        firestore.client().collection(collection_name).add(game_data)

        # Update summary collection for player 1
        update_summary(game_data["player1"], game_data["player2"], game_data["winner"], year)

        # Update summary collection for player 2
        update_summary(game_data["player2"], game_data["player1"], game_data["winner"], year)

        return jsonify({'status': 'ok'}), 200

    except Exception as e:
        print('Error adding game record:', e)
        return jsonify({'error': f"Failed to add game record {e}."}), 500


def update_summary(player_name, opponent, winner, year):
    collection_name = get_summary_collection_name(year)

    summary_ref = firestore.client().collection(collection_name).where('player', '==', player_name).where('opponent', '==', opponent)
    docs = list(summary_ref.stream())

    if docs:
        for doc in docs:
            doc_data = doc.to_dict()

            if doc_data["player"] != player_name or doc_data["opponent"] != opponent:
                continue

            doc_id = doc.id
            if doc_data["player"] == winner:
                doc_data['wins'] += 1
            else:
                doc_data['losses'] += 1
            doc_data['gamesPlayed'] += 1
            firestore.client().collection(collection_name).document(doc_id).update(doc_data)
    else:
        # If no document exists for this player, create one
        new_doc_data = {
            'player': player_name,
            'opponent': opponent,
            'gamesPlayed': 1,
            'wins': 1 if winner == player_name else 0,
            'losses': 0 if winner == player_name else 1
        }
        firestore.client().collection(collection_name).add(new_doc_data)


@https_fn.on_request(
    cors=options.CorsOptions(cors_origins="*", cors_methods=["get", "post"])
)
def get_game_records(request):
    year = request.args.get('year')
    collection_name = get_games_collection_name(year)

    try:
        games_ref = firestore.client().collection(collection_name).order_by('date', direction=firestore.Query.DESCENDING).stream()
        games_data = []
        for doc in games_ref:
            doc_data = doc.to_dict()
            games_data.append(doc_data)
        return json.dumps(games_data), 200

    except Exception as e:
        print('Error retrieving game records:', e)
        return jsonify({'error': 'Failed to retrieve game records.'}), 500


@https_fn.on_request(
    cors=options.CorsOptions(cors_origins="*", cors_methods=["get", "post"])
)
def get_game_summary(request):
    year = request.args.get('year')
    collection_name = get_summary_collection_name(year)

    try:
        summary_ref = firestore.client().collection(collection_name).stream()
        summary_data = []
        for doc in summary_ref:
            doc_data = doc.to_dict()
            summary_data.append(doc_data)
        return json.dumps(summary_data), 200

    except Exception as e:
        print('Error retrieving summary records:', e)
        return jsonify({'error': 'Failed to retrieve summary records.'}), 500