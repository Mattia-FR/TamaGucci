# TamaGucci

Application mobile type Tamagotchi développée en 3 jours lors d'un hackathon à la Wild Code School. J'ai choisi React Native pour découvrir le développement mobile.

## 🎯 Contexte

Hackathon de 3 jours avec choix entre Unity et React Native. 
Premier projet mobile : j'ai découvert React Native, Expo, et la gestion d'état complexe sous contrainte de temps.

## Fonctionnalités

- **Animal virtuel (Tama-chan)** avec animation Lottie
- **4 statistiques** à gérer : bonheur, faim, propreté, énergie
- **4 actions** : nourrir, jouer, nettoyer, se reposer (avec temps de recharge pour éviter le spam)
- **État de santé** : Tama-chan peut tomber malade si les stats critiques restent basses trop longtemps
- **Âge** du Tama affiché et suivi dans le temps
- **Décroissance automatique** des stats au fil du temps (intervalles configurables)
- **Détection d’abus** : blocage temporaire des actions en cas de clics trop répétés
- **Notifications** pour ne pas oublier de s’occuper de votre Tama
- **Snackbar** pour les retours utilisateur
- **Écran À propos** avec les infos sur le jeu
- **Persistance** des données avec AsyncStorage

## Stack technique

- **Expo** (~52) avec **expo-router** (routing par fichiers)
- **React Native** + **TypeScript**
- **React Native Paper** (UI)
- **Lottie** (animations du pet)
- **React Native Reanimated** & **Gesture Handler**
- **expo-notifications** pour les rappels

## Démarrage

1. **Installer les dépendances**

   ```bash
   npm install
   ```

2. **Lancer l’app**

   ```bash
   npx expo start
   ```

   Ensuite, ouvrez l’app dans un émulateur Android/iOS, un simulateur ou **Expo Go**.

## Structure du projet

- `app/` — écrans et routing (index, about)
- `app/components/` — composants (FeedTama, PlayWithTama, CleanTama, RestTama, StatBars, StatAlert, PetAnimation, ActionButton)
- `app/utils/core/` — types, reducer d’état, configuration (limites, décroissance, cooldowns, détection d’abus)
- `app/utils/hooks/` — `useTamaState`, `useFonts`, `useNotifications`, `useTamaAge`
- `app/utils/contexts/` — SnackbarContext
- `assets/` — polices, images, animations Lottie

## Configuration

Les constantes (niveaux critiques, intervalles de décroissance, cooldowns des actions, détection d’abus) sont centralisées dans `app/utils/core/config.ts`.

---

Projet réalisé dans le cadre de la **Wild Code School**.
