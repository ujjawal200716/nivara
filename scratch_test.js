const fs = require('fs');
const env = fs.readFileSync('.env.local', 'utf8');
const groqKey = env.match(/GROQ_API_KEY=(.*)/)?.[1]?.trim();
const { Groq } = require('groq-sdk');
const groq = new Groq({ apiKey: groqKey });

async function test() {
  try {
    const res = await groq.chat.completions.create({
      messages: [
        { role: 'system', content: 'You are a housing society triage AI. Respond with valid JSON: {"category": "Lift", "urgency": "Critical", "translation": "Elevator stuck"}' },
        { role: 'user', content: 'Lift band hai floor 3 pe' }
      ],
      model: 'qwen/qwen3.8-27b',
      response_format: { type: 'json_object' }
    });
    console.log('QWEN TEST SUCCESS:', res.choices[0].message.content);
  } catch (e) {
    console.error('QWEN TEST ERROR:', e.message);
  }
}
test();
