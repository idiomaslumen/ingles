// api/bold-signature.js
const crypto = require('crypto');

module.exports = (req, res) => {
  // Permitir llamadas desde tu dominio de GitHub Pages
  res.setHeader('Access-Control-Allow-Origin', '*'); // luego lo restringes a tu dominio
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const { amount, currency, product } = req.query;

  if (!amount || !currency) {
    return res.status(400).json({ error: 'Faltan parámetros' });
  }

  const secretKey = process.env.BOLD_SECRET_KEY; // se guarda en Vercel, nunca en el código
  const orderId = `${product || 'LUMEN'}-${Date.now()}`;

  const integritySignature = crypto
    .createHash('sha256')
    .update(`${orderId}${amount}${currency}${secretKey}`)
    .digest('hex');

  return res.status(200).json({
    orderId,
    amount,
    currency,
    integritySignature
  });
};
