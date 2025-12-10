# Advent calendar
Un [calendrier interactif](https://calendalex.netlify.app/) en ligne avec des cases un peu cursed faites maison, chaque jour du calendrier révèle une animation ou une interaction différente.

## Fonctionnalités
- Navigation entre les jours du calendrier
- Déblocage progressif des jours en fonction de la date
- Contenu différent chaque jour (animations 3D, interactions, images…)

## Technos utilisées
- Next.js : framework Reac pour le rendu côté serveur et le routing
- React : composants et gestion de l’état
- Three.js : animations 3D
- [mediapipe](https://ai.google.dev/edge/mediapipe/solutions/vision/gesture_recognizer?hl=fr) pour les interactions avec les gestes
- Librairie [GSAP](https://gsap.com/) pour quelques animations
- API [Useless Facts](https://uselessfacts.jsph.pl/)

## Organisation du projet
- pages/ : pages des jours et page principale du calendrier
- components/ : composants réutilisables (navigation, boutons…)
- styles/ : fichiers CSS pour chaque jour et composants
- public/ : images, modèles 3D, skybox et autres assets
