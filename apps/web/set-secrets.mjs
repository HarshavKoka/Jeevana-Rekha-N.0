import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const sodium = require('tweetsodium');

const TOKEN = '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';
const REPO  = 'Vijayi-Group/JeevanaRekha';

const SECRETS = {
    AWS_ACCESS_KEY_ID:      'AKIA5RNUKLHE7YJ2CB46',
    AWS_SECRET_ACCESS_KEY:  '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',
    MONGODB_URI:            'mongodb+srv://jr_backend:Jee2001@jr-cluster-prod.a7wiel4.mongodb.net/jeevanarekha?appName=jr-cluster-prod',
    PAYLOAD_SECRET:         '0d17455702be50cc4d6f983bf91ce67aaa507639d8c493e61f09c66b156baf8f',
    NEXT_PUBLIC_SERVER_URL: 'https://jeevanarekha.com',
    NEXT_PUBLIC_GA_ID:      'G-6EMZFFFC8Z',
};

const headers = {
    'Authorization': `Bearer ${TOKEN}`,
    'Accept': 'application/vnd.github+json',
    'X-GitHub-Api-Version': '2022-11-28',
    'Content-Type': 'application/json',
    'User-Agent': 'secret-setter',
};

// Get repo public key
const keyRes = await fetch(`https://api.github.com/repos/${REPO}/actions/secrets/public-key`, { headers });
const { key, key_id } = await keyRes.json();

function encryptSecret(secret, publicKey) {
    const messageBytes = Buffer.from(secret);
    const keyBytes = Buffer.from(publicKey, 'base64');
    const encrypted = sodium.seal(messageBytes, keyBytes);
    return Buffer.from(encrypted).toString('base64');
}

for (const [name, value] of Object.entries(SECRETS)) {
    const encrypted_value = encryptSecret(value, key);
    const res = await fetch(`https://api.github.com/repos/${REPO}/actions/secrets/${name}`, {
        method: 'PUT',
        headers,
        body: JSON.stringify({ encrypted_value, key_id }),
    });
    console.log(`${name}: ${res.status === 201 || res.status === 204 ? '✅ set' : '❌ failed (' + res.status + ')'}`);
}
