# AQUAVAULT — Site headless connecté à Shopify

Site vitrine statique (HTML/CSS/JS, sans framework, sans build) pour la boutique **AquaVault** (pochette étanche premium). Le design, le contenu et toutes les pages sont hébergés indépendamment de Shopify ; **Shopify sert uniquement de moteur e-commerce en arrière-plan** (catalogue produit, panier, paiement, commandes).

⚠️ Ce site ne collecte, ne traite ni ne stocke aucune donnée bancaire. Les boutons d'achat renvoient directement vers la fiche produit Shopify (`https://aquavault-8696.myshopify.com/products/aquavault-pro-sac-banane-etanche`), où le panier et le paiement sont intégralement gérés par Shopify.

ℹ️ Le canal historique "Shopify Buy Button" (JS Buy SDK) a été retiré par Shopify mi-2025. Ce site utilise donc une simple redirection vers la boutique Shopify plutôt qu'un composant embarqué — c'est l'approche la plus simple et la plus fiable pour une intégration sans code côté panier/paiement.

## 1. Architecture du projet

```
aquavault/
├── index.html                       Page d'accueil
├── product.html                      Section produit + emplacement Buy Button
├── faq.html                           FAQ (recherche) + section Livraison
├── mentions-legales.html              Mentions légales (modèle)
├── politique-confidentialite.html     Politique de confidentialité RGPD (modèle)
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

## 2. Emplacements des liens d'achat Shopify

Trois emplacements pointent vers la boutique Shopify :

1. **Sur la fiche produit** (`product.html`, id `shopify-buy-button-product`) et **dans la scène de remontée de l'accueil** (`index.html`, id `shopify-buy-button-home`) : un bouton `<a>` qui renvoie directement vers `https://aquavault-8696.myshopify.com/products/aquavault-pro-sac-banane-etanche`. L'attribut `data-shopify-buy-button` est conservé car `js/product.js` s'en sert pour faire défiler la page jusqu'à ce bouton depuis la barre sticky.
2. **Dans le header** (toutes les pages, id `shopify-buy-button-cart`) : un lien `<a>` vers `https://aquavault-8696.myshopify.com/cart`.

Le **sélecteur de quantité** (`#buyButtonQuantity`, boutons `data-qty-minus` / `data-qty-plus`) reste une simple interface côté site (incrémente/décrémente entre 1 et 10) : la quantité réelle se choisit ensuite sur la fiche produit Shopify après redirection.

La barre sticky qui apparaît au scroll ne fait pas d'ajout au panier : elle ramène l'utilisateur vers le bouton d'achat (`data-scroll-to-buy-button`), qui redirige lui-même vers Shopify.

## 3. Pourquoi une redirection plutôt qu'un bouton intégré ?

Le canal "Composants achetables" / Buy Button de Shopify reposait sur le JS Buy SDK, que Shopify a retiré mi-2025 — il n'est plus proposé dans l'admin pour les nouvelles boutiques. La solution la plus simple et la plus robuste, sans code ni token d'API à gérer, est donc de renvoyer directement vers la fiche produit et le panier hébergés par Shopify, qui gèrent eux-mêmes tout le tunnel d'achat (variantes, paiement, confirmation de commande).

Si l'URL du produit ou de la boutique change un jour (nouveau nom de domaine, produit renommé...), il suffit de mettre à jour les liens `href` aux emplacements listés ci-dessus.

## 4. Pages légales

Les deux pages légales (`mentions-legales.html`, `politique-confidentialite.html`) sont des **modèles** rédigés pour une boutique headless adossée à Shopify : elles précisent explicitement que le paiement et les données bancaires sont intégralement gérés par Shopify, jamais par ce site.

Tous les champs à personnaliser sont surlignés en bleu, au format `[à compléter]` (nom de société, SIRET, adresse, email de contact...). **Faites relire ces documents par un professionnel du droit avant mise en ligne** — ce ne sont pas des textes juridiquement définitifs.

⚠️ Les conditions générales de vente (CGV) ne sont pas incluses sur ce site : elles sont gérées séparément. Pense à t'assurer qu'un lien vers tes CGV reste accessible avant paiement (obligation légale pour toute vente en ligne en France/UE), par exemple via une page légale Shopify ou un lien ajouté manuellement dans le footer.

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

## 6. Déploiement

Le site est déployé sur Vercel (import direct du dépôt GitHub, preset "Other", sans commande de build) : chaque `git push` sur `main` redéploie automatiquement la version en ligne — c'est tout l'intérêt de l'architecture headless.
