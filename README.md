# Wyszukiwarka Produktów z Elasticsearch

Projekt wyszukiwarki produktów oparty na Elasticsearch, z backendem w Node.js i frontendem w React.js.

## Funkcje

- **Wyszukiwarka produktów**: Wyszukiwanie produktów po tytule, opisie i kategorii.
- **Autopodpowiedzi**: Dynamiczne sugestie podczas wpisywania w polu wyszukiwania.
- **Responsywny interfejs**: Prosty i intuicyjny design.

## Wymagania

- Node.js (wersja 14 lub nowsza)
- npm lub yarn
- Konto Elasticsearch w chmurze (już skonfigurowane)

## Instalacja

1. **Sklonuj repozytorium:**
   ```bash
   git clone https://github.com/gmaxsoft/elasticsearch-project.git
   cd elasticsearch-project
   ```

2. **Zainstaluj zależności backendu:**
   ```bash
   cd backend
   npm install
   ```

3. **Zainstaluj zależności frontendu:**
   ```bash
   cd ../frontend
   npm install
   ```

## Uruchomienie

1. **Uruchom backend:**
   ```bash
   cd backend
   npm start
   ```
   Serwer będzie dostępny na `http://localhost:3001`.

2. **Uruchom frontend:**
   ```bash
   cd frontend
   npm start
   ```
   Aplikacja będzie dostępna na `http://localhost:3000`.

## Import danych

Po uruchomieniu backendu, dane produktów zostaną automatycznie zaimportowane do Elasticsearch z pliku `products.json`.

## Struktura projektu

```
elasticsearch-demo/
├── backend/
│   ├── server.js          # Główny plik serwera Node.js
│   └── package.json       # Zależności backendu
├── frontend/
│   ├── src/
│   │   ├── App.js         # Główny komponent React
│   │   └── App.css        # Stylizacja
│   └── package.json       # Zależności frontendu
├── products.json          # Dane produktów
└── README.md              # Ten plik
```

## API Endpoints

- `GET /api/search?q=<query>` - Wyszukiwanie produktów
- `GET /api/suggestions?q=<query>` - Pobieranie sugestii

## Technologie

- **Backend**: Node.js, Express.js, Elasticsearch
- **Frontend**: React.js
- **Baza danych**: Elasticsearch (chmura)

## Licencja

MIT License