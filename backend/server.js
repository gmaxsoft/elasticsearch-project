const express = require('express');
const cors = require('cors');
const { Client } = require('@elastic/elasticsearch');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3001;

// Elasticsearch client
const esClient = new Client({
  node: 'https://my-elasticsearch-project-d3a2cb.es.europe-west1.gcp.elastic.cloud:443',
  auth: {
    apiKey: 'VWM4M2VKb0JjVTZvVVI1eWttaS06YjJTSzU0WkZ5NDRCanNYMEtseFQ5Zw=='
  },
  tls: {
    rejectUnauthorized: false
  }
});

app.use(cors());
app.use(express.json());

// Import products to Elasticsearch
async function importProducts() {
  try {
    const products = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'products.json'), 'utf8'));

    const operations = products.flatMap(product => [
      { index: { _index: 'products', _id: product.id.toString() } },
      product
    ]);

    const response = await esClient.bulk({ refresh: true, operations });
    console.log('Products imported successfully:', response);
  } catch (error) {
    console.error('Error importing products:', error);
  }
}

// Search endpoint
app.get('/api/search', async (req, res) => {
  try {
    const { q } = req.query;

    if (!q) {
      return res.json([]);
    }

    const response = await esClient.search({
      index: 'products',
      query: {
        multi_match: {
          query: q,
          fields: ['title', 'description', 'category']
        }
      },
      size: 50
    });

    const products = response.hits.hits.map(hit => ({
      id: hit._id,
      ...hit._source
    }));

    res.json(products);
  } catch (error) {
    console.error('Search error:', error);
    res.status(500).json({ error: 'Search failed' });
  }
});

// Suggestions endpoint for autocomplete
app.get('/api/suggestions', async (req, res) => {
  try {
    const { q } = req.query;

    if (!q) {
      return res.json([]);
    }

    const response = await esClient.search({
      index: 'products',
      query: {
        multi_match: {
          query: q,
          fields: ['title', 'category']
        }
      },
      size: 10,
      _source: ['title', 'category']
    });

    const suggestions = response.hits.hits.map(hit => hit._source.title);
    res.json([...new Set(suggestions)]); // Remove duplicates
  } catch (error) {
    console.error('Suggestions error:', error);
    res.status(500).json({ error: 'Suggestions failed' });
  }
});

app.listen(PORT, async () => {
  console.log(`Server running on http://localhost:${PORT}`);
  await importProducts();
});