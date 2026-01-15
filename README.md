# Wyszukiwarka Produktów z Elasticsearch

Projekt wyszukiwarki produktów oparty na Elasticsearch, z backendem w Node.js i frontendem w React.js.

## Technologie

### Backend

- **Node.js** - Środowisko uruchomieniowe JavaScript po stronie serwera, umożliwiające budowę skalowalnych aplikacji backendowych.
- **Express.js** - Minimalistyczny i elastyczny framework webowy dla Node.js, ułatwiający tworzenie API REST i obsługę żądań HTTP.
- **@elastic/elasticsearch** - Oficjalny klient JavaScript dla Elasticsearch, zapewniający integrację z silnikiem wyszukiwania i indeksowaniem danych.
- **CORS** - Middleware Express.js do obsługi Cross-Origin Resource Sharing, umożliwiający komunikację między frontendem a backendem z różnych domen.
- **dotenv** - Biblioteka do zarządzania zmiennymi środowiskowymi, pozwalająca na bezpieczne przechowywanie konfiguracji (np. kluczy API) w pliku `.env`.

### Frontend

- **React.js** - Biblioteka JavaScript do budowy interfejsów użytkownika, umożliwiająca tworzenie komponentów wielokrotnego użytku i zarządzanie stanem aplikacji.
- **React Scripts** - Narzędzie do konfiguracji i uruchamiania aplikacji React z wbudowanym wsparciem dla Webpack, Babel i innych narzędzi deweloperskich.
- **Jest** - Framework testowy JavaScript używany do pisania i uruchamiania testów jednostkowych.
- **React Testing Library** - Biblioteka do testowania komponentów React z naciskiem na testowanie zachowań użytkownika.

### Baza danych

- **Elasticsearch** - Rozproszony silnik wyszukiwania i analizy danych, wykorzystywany do pełnotekstowego wyszukiwania produktów, autopodpowiedzi i zaawansowanych zapytań.

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

2. **Skonfiguruj zmienne środowiskowe dla backendu:**
   ```bash
   cd backend
   cp .env-sample .env
   ```
   Wypełnij plik `.env` swoimi danymi Elasticsearch:
   - `ELASTICSEARCH_NODE`: URL twojego klastra Elasticsearch
   - `ELASTICSEARCH_API_KEY`: Twój klucz API Elasticsearch

3. **Zainstaluj zależności backendu:**
   ```bash
   npm install
   ```

4. **Zainstaluj zależności frontendu:**
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

## Testy jednostkowe

Projekt zawiera kompleksowe testy jednostkowe dla frontendu, napisane przy użyciu React Testing Library i Jest.

### Uruchomienie testów

Aby uruchomić testy jednostkowe frontendu:

```bash
cd frontend
npm test
```

Aby uruchomić testy w trybie jednorazowym (bez trybu watch):

```bash
cd frontend
npm test -- --watchAll=false
```

### Pokrycie testami

Frontend zawiera **17 testów jednostkowych**, które pokrywają następujące funkcjonalności:

- **Renderowanie komponentów**: Testy sprawdzające poprawność renderowania nagłówka, pola wyszukiwania i przycisku
- **Interakcje użytkownika**: Testy dla wpisywania tekstu, klikania w sugestie, wyszukiwania przyciskiem i klawiszem Enter
- **Integracja z API**: Testy dla pobierania sugestii, wyszukiwania produktów, wyświetlania wyników
- **Obsługa stanów**: Testy dla stanu ładowania, ukrywania sugestii, obsługi błędów
- **Optymalizacja**: Testy dla debounce zapytań sugestii

### Technologie testowe

- **Jest** - Framework testowy JavaScript
- **React Testing Library** - Biblioteka do testowania komponentów React
- **@testing-library/jest-dom** - Dodatkowe matchery dla asercji DOM

Testy są automatycznie uruchamiane w GitHub Actions przy każdym pushu i pull requeście.

## Struktura projektu

```
elasticsearch-demo/
├── backend/
│   ├── server.js          # Główny plik serwera Node.js
│   └── package.json       # Zależności backendu
├── frontend/
│   ├── src/
│   │   ├── App.js         # Główny komponent React
│   │   ├── App.test.js    # Testy jednostkowe
│   │   ├── App.css        # Stylizacja
│   │   └── setupTests.js  # Konfiguracja testów
│   └── package.json       # Zależności frontendu
├── .github/
│   └── workflows/
│       └── ci.yml         # Workflow GitHub Actions
├── products.json          # Dane produktów
└── README.md              # Ten plik
```

## API Endpoints

- `GET /api/search?q=<query>` - Wyszukiwanie produktów
- `GET /api/suggestions?q=<query>` - Pobieranie sugestii

## Licencja

MIT License