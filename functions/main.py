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
def get_games_collection_name(tournament_id):
    # Convert to string for consistent comparison
    if tournament_id is not None:
        tournament_id = str(tournament_id)
    
    # Default to 'games' if no tournament_id provided
    if tournament_id is None:
        return "games"
    
    # Return the tournament_id as-is (it should already be the collection name)
    return tournament_id


# Helper function to generate the summary collection name
def get_summary_collection_name(tournament_id):
    # Convert to string for consistent comparison
    if tournament_id is not None:
        tournament_id = str(tournament_id)
    
    # Default to 'summary' if no tournament_id provided
    if tournament_id is None:
        return "summary"
    
    # Replace 'games' prefix with 'summary' prefix
    if tournament_id.startswith('games'):
        return tournament_id.replace('games', 'summary', 1)
    
    # Return the tournament_id as-is if it already has summary prefix
    return tournament_id


@https_fn.on_request(
    cors=options.CorsOptions(cors_origins="*", cors_methods=["get", "post"])
)
def add_game_record(request):
    try:
        # Update games collection
        game_data = request.get_json()
        tournament_id = game_data.get("tournament_id")
        
        # Convert tournament_id to string for consistent handling
        if tournament_id is not None:
            tournament_id = str(tournament_id)
        
        collection_name = get_games_collection_name(tournament_id)
        firestore.client().collection(collection_name).add(game_data)

        # Update summary collection for player 1
        update_summary(game_data["player1"], game_data["player2"], game_data["winner"], tournament_id)

        # Update summary collection for player 2
        update_summary(game_data["player2"], game_data["player1"], game_data["winner"], tournament_id)

        return jsonify({'status': 'ok'}), 200

    except Exception as e:
        print('Error adding game record:', e)
        return jsonify({'error': f"Failed to add game record {e}."}), 500


def update_summary(player_name, opponent, winner, tournamet_id):
    collection_name = get_summary_collection_name(tournamet_id)

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
    tournament_id = request.args.get('year')  # Keep 'year' for backward compatibility with client
    if tournament_id and tournament_id.isdigit():
        tournament_id = str(tournament_id)  # Ensure it's a string for consistent comparison
    collection_name = get_games_collection_name(tournament_id)

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
    tournament_id = request.args.get('year')  # Keep 'year' for backward compatibility with client
    if tournament_id and tournament_id.isdigit():
        tournament_id = str(tournament_id)  # Ensure it's a string for consistent comparison
    collection_name = get_summary_collection_name(tournament_id)

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