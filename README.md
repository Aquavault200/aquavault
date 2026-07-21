# AQUAVAULT — Site headless prêt pour Shopify Buy Button

Site vitrine statique (HTML/CSS/JS, sans framework, sans build) pour la boutique **AquaVault** (pochette étanche premium). Le design, le contenu et toutes les pages sont hébergés indépendamment de Shopify ; **Shopify sert uniquement de moteur e-commerce en arrière-plan** (catalogue produit, panier, paiement, commandes) via le composant **Shopify Buy Button**.

⚠️ Ce site ne collecte, ne traite ni ne stocke aucune donnée bancaire. Aucun système de paiement n'est simulé : le panier et le paiement n'existeront qu'une fois le Buy Button Shopify intégré aux emplacements prévus à cet effet.

## 1. Architecture du projet

```
aquavault/
├── index.html                       Page d'accueil
├── product.html                      Section produit + emplacement Buy Button
├── faq.html                           FAQ (recherche) + section Livraison & Retours
├── mentions-legales.html              Mentions légales (modèle)
├── politique-confidentialite.html     Politique de confidentialité RGPD (modèle)
├── conditions-generales-vente.html    CGV (modèle)
├── css/
│   ├── style.css         Design system : couleurs, typographie, boutons, header, footer, accordéon
│   ├── animations.css    Animations : reveal au scroll, flottement, bulles, ripples, marquee
│   ├── home.css          Styles page d'accueil (hero, features, démo, comparatif...)
│   ├── product.css       Styles fiche produit (galerie, quantité, emplacement Buy Button, avis...)
│   └── legal.css         Styles des pages légales (sommaire, sections, disclaimer)
├── js/
│   ├── icons.js           Sprite SVG (icônes ligne, injecté une fois par page)
│   ├── main.js            Comportements partagés : header au scroll, menu mobile, accordéons,
│   │                      reveal au scroll, compteurs animés, carousel avis, newsletter
│   └── product.js         Logique fiche produit : galerie, variantes visuelles, sélecteur de
│                          quantité, barre sticky, filtres d'avis — aucune logique de panier/prix
└── README.md
```

Chaque page est autonome : elle peut être ouverte directement dans un navigateur ou servie par n'importe quel serveur statique (voir section 5).

## 2. Emplacements prévus pour Shopify Buy Button

Deux emplacements sont clairement identifiés dans le HTML, prêts à recevoir le script généré par **Shopify → Composants achetables (Buy Button Channel)** :

1. **Sur la fiche produit** (`product.html`) : un bloc à bordure pointillée avec l'id `shopify-buy-button-product` (attribut `data-shopify-buy-button`), juste sous le sélecteur de quantité. C'est ici qu'il faut coller le script d'intégration du bouton produit Shopify.
   ```html
   <div class="buy-button-slot" id="shopify-buy-button-product" data-shopify-buy-button>
     <!-- Remplacer ce bloc par le script Shopify Buy Button -->
   </div>
   ```
2. **Dans le header** (toutes les pages) : un bouton panier vide avec l'id `shopify-buy-button-cart`, prévu pour accueillir soit le composant "cart" du Buy Button SDK, soit un déclencheur `client.checkout` de votre choix.

Le **sélecteur de quantité** (`#buyButtonQuantity`, boutons `data-qty-minus` / `data-qty-plus`) est fonctionnel côté interface (incrémente/décrémente entre 1 et 10) mais n'est relié à aucun prix ni panier : une fois le Buy Button intégré, lisez sa valeur (`document.getElementById('buyButtonQuantity').value`) pour préremplir la quantité du composant Shopify, par exemple via l'option `variantId` / `quantity` du SDK `@shopify/buy-button-js` ou l'API Storefront.

La barre sticky qui apparaît au scroll ne fait plus d'ajout au panier : elle ramène l'utilisateur vers l'emplacement du Buy Button (`data-scroll-to-buy-button`).

## 3. Marche à suivre pour intégrer le Buy Button (à faire côté Shopify)

1. Dans l'admin Shopify : **Paramètres → Applications et canaux de vente → Composants achetables**, activer le canal pour le produit AquaVault Pro.
2. Générer le script d'intégration (bouton produit).
3. Remplacer le contenu du `<div id="shopify-buy-button-product">` dans `product.html` par le script généré (il contient son propre `<script>` chargeant `buy-button-storefront.min.js` et sa configuration `ShopifyBuy.buildClient(...)` / `ui.createComponent('product', ...)`).
4. Adapter la configuration `moneyFormat`, les couleurs (`options.product.styles`) pour rester cohérent avec la charte (bleu océan `#0a5cc4`, noir `#060708`, coins arrondis).
5. Répéter l'opération pour le panier (`shopify-buy-button-cart`) avec un composant `cart` ou `toggle`.

## 4. Pages légales

Les trois pages légales (`mentions-legales.html`, `politique-confidentialite.html`, `conditions-generales-vente.html`) sont des **modèles** rédigés pour une boutique headless adossée à Shopify : elles précisent explicitement que le paiement et les données bancaires sont intégralement gérés par Shopify, jamais par ce site.

Tous les champs à personnaliser sont surlignés en bleu, au format `[à compléter]` (nom de société, SIRET, adresse, email de contact...). **Faites relire ces documents par un professionnel du droit avant mise en ligne** — ce ne sont pas des textes juridiquement définitifs.

## 5. Lancer le site en local

Aucune installation n'est nécessaire, mais ouvrir directement les fichiers HTML depuis l'explorateur (`file://`) peut limiter certaines fonctionnalités selon le navigateur. Le plus fiable est de servir le dossier via un petit serveur local :

**Avec Node.js installé :**
```bash
cd aquavault
npx serve .
```
puis ouvrez l'URL affichée (ex. http://localhost:3000).

**Avec Python installé :**
```bash
cd aquavault
python -m http.server 8080
```
puis ouvrez http://localhost:8080.

**Avec l'extension VS Code "Live Server" :** clic droit sur `index.html` → "Open with Live Server".

Naviguez ensuite entre les pages via le menu (Accueil, Produit, FAQ) ou directement via `product.html`, `faq.html`, `mentions-legales.html`, etc.

## 6. Prochaine étape possible

Une fois le Buy Button Shopify intégré et testé, ce même site pourra être déployé tel quel sur n'importe quel hébergeur statique (Vercel, Netlify, Cloudflare Pages...), indépendamment de Shopify — c'est tout l'intérêt de l'architecture headless.
