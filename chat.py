import json
from flask_cors import CORS
import time
from groq import Groq
from flask import Flask, request, jsonify

messages = {}
app = Flask(__name__)
CORS(app)#, origins=["https://silvaordie.github.io"], methods=["GET", "POST", "OPTIONS"])
with open("data/projects/experiences.json", 'r', encoding="utf8") as e:
    experiences = json.load(e)

with open("data/projects/projects.json", 'r', encoding="utf8") as p:
        projects = json.load(p)

COOLDOWN_TIME = 2     
current_time = time.time()

client = Groq(
        api_key="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",
        )
main_message= {
            "role": "system",
            "content": "You are the an AI impersonation of 26-year-old engineer named José Silva with a Master’s degree in Electrical and Computer Engineering, specializing in Robotics, AI, and Computer Science. You can only answer questions based on his experiences and portfolio. Here's a JSON with all your experiences:\n\n" + str(experiences) + "\n\n And here's a json with your personal projects:\n\n" + str(projects) +"\n\nYour answers should only be based on this information but do not mention the JSON files. The 'natures' fields refers to technologies or areas of expertise of each project/experience.",
        }

@app.route('/api/answer', methods=['GET', 'POST', 'OPTIONS'])
def answer():
    global current_time
    data = request.get_json()
    question = data.get("text", "")  # Get the text field from the JSON request body
    udid = data.get("udid", "")  # Get the text field from the JSON request body
      # Get current time in seconds

    # Check if the user has sent a request recently (within the cooldown period)
    if time.time() - current_time < COOLDOWN_TIME:
        # If the request is too soon, return a 429 status (Too Many Requests)
        return jsonify({"error": "Please wait before sending another message"}), 429
    current_time = time.time()
    if len(question) > 250:
        return jsonify({"answer":"Your question is a bit too long for me, please keep it inside the 250 characters range !"})
    if udid not in messages:
         messages[udid] = [main_message]
    
    if len(messages.keys())> 5:
         del messages[messages.keys()[0]]
    with open("queries.txt", 'a', encoding="utf8") as q:
         q.write(question+"\n")

# Define the user's question    
    while len(messages) > 4:
        messages[udid].pop(1)
    messages[udid].append({
                "role": "user",
                "content": question
            })
    try:
        chat_completion = client.chat.completions.create(
            messages=[
            {
                "role": m["role"],
                "content": m["content"]
            }
            for m in messages[udid]],
            model="llama3-8b-8192",
        )
        messages[udid].append({
                    "role": "user",
                    "content": chat_completion.choices[0].message.content
                })
    except:
         return -1

    return jsonify({"answer":chat_completion.choices[0].message.content})

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)