from flask import Flask, request, Response, make_response
from flask_restful import Resource, Api
from datetime import datetime
from openai import OpenAI
import os
from dotenv import load_dotenv
from flask_cors import CORS

load_dotenv()

app = Flask(__name__) 

@app.before_request
def handle_preflight():
    if request.method == "OPTIONS":
        response = make_response()
        response.headers.add("Access-Control-Allow-Origin", "http://localhost:3000")
        response.headers.add("Access-Control-Allow-Headers", "Content-Type")
        response.headers.add("Access-Control-Allow-Methods", "GET,POST,OPTIONS")
        return response

CORS(app, resources={
    r"/v1/*": {
        "origins": ["http://localhost:3000"],
        "allow_headers": ["Content-Type"],
        "methods": ["GET", "POST", "OPTIONS"]
    }
})
api = Api(app)
client = OpenAI(
    base_url="https://api.groq.com/openai/v1",
    api_key=os.getenv('GROQ_API_KEY')
)

chat_histories = {}

class ChatBot(Resource):
    def post(self):
        try:
            data = request.get_json()
            if not data or 'message' not in data:
                return {'status': 'error', 'message': 'No message provided'}, 400

            user_message = data['message']
            chat_id = data.get('chat_id', 'default')
            
            # Initialize chat history if it doesn't exist
            if chat_id not in chat_histories:
                chat_histories[chat_id] = [{
                    "role": "assistant",
                    "content": "Hi, how can I help you today?"
                }]

            # Add user message to chat history
            chat_histories[chat_id].append({
                "role": "user",
                "content": user_message
            })

            def generate():
                response_stream = client.chat.completions.create(
                    model="mixtral-8x7b-32768",
                    messages=[
                        {"role": "system", "content": "You are a helpful assistant."},
                        *chat_histories[chat_id]
                    ],
                    temperature=0.7,
                    max_tokens=1000,
                    stream=True
                )

                full_response = ""
                for chunk in response_stream:
                    if chunk.choices[0].delta.content is not None:
                        content = chunk.choices[0].delta.content
                        full_response += content
                        yield f"data: {content}\n\n"

                # Add assistant's complete response to chat history
                chat_histories[chat_id].append({
                    "role": "assistant",
                    "content": full_response
                })
                
                yield "data: [DONE]\n\n"

            return Response(
                generate(),
                mimetype='text/event-stream',
                headers={
                    'Cache-Control': 'no-cache',
                    'Connection': 'keep-alive',
                    'X-Accel-Buffering': 'no'
                }
            )

        except Exception as e:
            return {'status': 'error', 'message': str(e)}, 500

    def get(self):
        try:
            chat_id = request.args.get('chat_id', 'default')
            return {
                'status': 'success',
                'data': {
                    'chat_id': chat_id,
                    'history': chat_histories.get(chat_id, [])
                }
            }, 200
        except Exception as e:
            return {'status': 'error', 'message': str(e)}, 500

api.add_resource(ChatBot, '/v1/chat')

if __name__ == '__main__': 
    app.run(debug = True) 