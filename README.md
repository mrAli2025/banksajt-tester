## CI/CD med GitHub Actions
Push till main triggar automatiskt:
1. Frontend-kontroller (npm ci, lint, build)
2. Deployment till EC2 via SSH + Docker Compose

## Feature flag
NEXT_PUBLIC_FEATURE_NEW_DASHBOARD styr en informationsbanner på kontosidan.
- false = Deployment (koden finns, funktionen dold)
- true = Release (funktionen synlig)

## Publicerad sajt
http://ec2-32-199-182-33.compute-1.amazonaws.com

## Tester

### Vitest (backend, enhetstester)
Testar valideringslogiken för insättning och uttag (`backend/src/validateAmount.js`), utan att starta hela applikationen.

```bash
cd backend
npm test
```

### Playwright (frontend, E2E-tester)
Testar riktiga användarflöden i en webbläsare mot en separat testmiljö (egen databas, egna portar), startad med Docker Compose.

```bash
# Starta testmiljön
docker compose -f docker-compose.test.yml up -d --build

# Kör testerna
cd frontend
npx playwright test

# Stäng ner testmiljön
cd ..
docker compose -f docker-compose.test.yml down -v
```

Testerna täcker bland annat:
- Att en ej inloggad besökare inte kan se konto- eller transaktionssidan
- Registrering → inloggning → insättning → rätt saldo och historik
- Att historik finns kvar efter omladdning och ny inloggning
- Att ett ogiltigt belopp inte ändrar saldo eller historik
- Att ett lyckat uttag minskar saldot och syns i historiken
- Att ett uttag större än saldot nekas utan att ändra saldo eller historik

### CI (GitHub Actions)
Varje push och pull request till `main` kör `frontend`, `backend` och `e2e` som separata jobb. `deploy` till EC2 körs bara vid push till `main`, och bara om alla tre testjobb är gröna.

## Nya funktioner sedan tidigare uppgift
- **Transaktionshistorik** (`/transactions`): visar alla insättningar och uttag för den inloggade användaren, nyast först.
- **Uttag** med skydd mot övertrassering: ett uttag nekas om beloppet är ogiltigt eller större än saldot, och ändrar då varken saldo eller historik.

# Skapa en Banksajt och publicera på aws

I dagens uppgift ska vi öva på att skapa en react-sajt med backend i express och publicera den på en ec2 instans i aws.

### Data i backend

I bankens backend finns tre arrayer: En array `users` för användare, en array `accounts` för bankkonton och en array `sessions` för engångslösenord`.

**Users**
Varje användare har ett id, ett användarnamn och ett lösenord.