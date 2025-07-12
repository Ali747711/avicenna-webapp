curl -X POST https://avicenna-webapp.vercel.app/api/analyze-symptoms \
  -H "Content-Type: application/json" \
  -d '{"symptoms":"I have a headache and feel tired","language":"en"}'