# API Specifications

## Local AI Server `POST /ask`

**URL:** `http://localhost:3000/ask` (Usually mapped to network IP for physical devices)
**Description:** Takes a message array and a mode flag, returning a highly-structured clinical response.

### Request Body (JSON)
```json
{
  "messages": [
    {"role": "user", "content": "Explain Myocardial Infarction"}
  ],
  "mode": "standard | quiz | summary"
}
```

### Modes
- `standard`: Returns deep clinical breakdown (Topic, Definition, Causes, Symptoms, Nursing Management, Complications).
- `quiz`: Returns 5 Medical MCQs with answers.
- `summary`: Returns brief bullet point notes.

### Response (JSON) Success
```json
{
  "answer": "🩺 Topic:\nMyocardial Infarction...\n\n📌 Definition:..."
}
```

### Error Response
```json
{
  "error": "Messages missing"
}
```
