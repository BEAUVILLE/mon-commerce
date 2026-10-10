# MON COMMERCE V6 — commandes privées + double sécurité SQL CORE

Date : 10 octobre 2026 · Projet `digiy-core` · Dossier de suivi : [CORE V2 COMMERCE #19](https://github.com/BEAUVILLE/mon-commerce/issues/19).

## Préflight réel : pourquoi V6

- Boutique CORE : **1**, liée à un `auth_user_id`. **1 commande client réelle**, **2 lignes panier**.
- La commande est une demande (`status='request'`) et n'est pas une preuve de paiement, de livraison, ni un avis DIGIY TRUST.
- `public.digiy_commerce_orders` et `public.digiy_commerce_order_items` : RLS, lecture des commandes et lignes avec contrôle du propriétaire. **Avant V6, aucune policy restrictive MFA explicite sur ces 2 tables**.
- `public.digiy_owner_mfa_gate()` est une fonction permissive tant que `require_phone_mfa=false`. Pour cette boutique, le registre de sécurité téléphone existe mais **aucun facteur téléphone vérifié et aucun mode obligatoire activé** lors du contrôle. Ne pas confondre « module téléphone appelé » et « propriétaire a terminé AAL2 ».
- `public.digiy_owner_mfa_ok()` exige au serveur : `aal2` sur JWT, facteur téléphone vérifié correspondant au registre, et `require_phone_mfa=true`.

## Changement produit

Le professionnel garde l'éditeur produits accessible dans le cadre des RLS existantes. Les **commandes et les coordonnées client sont masquées tant que la double sécurité n'est pas activée et vérifiée**. Le garde déjà présent `owner-phone-mfa-v1.js` permet au propriétaire de démarrer l'enrôlement téléphone ; après activation (vérifiée par Supabase), l'interface redémarre et ouvre le panneau commandes.

Si aucun téléphone n'est enregistré dans le CORE propriétaire, l'interface demande de contacter l'atelier. Elle **n'invente pas** de téléphone, ne désactive pas RLS, ne rend pas le carnet visible à AAL1 et ne supprime pas l'ancienne commande.

## Changement SQL proposé

Fichier : `supabase/20261010_commerce_v6_owner_orders_phone_mfa.sql`.

Ajoute **4 policies restrictives ciblées `authenticated`** :
- `digiy_commerce_orders` : `SELECT`, `UPDATE`, `DELETE` ;
- `digiy_commerce_order_items` : `SELECT`.

Toutes exigent `public.digiy_owner_mfa_ok()` ; elles complètent les policies de propriété **sans remplacer leur vérification d'identité et de commerce actif**. Aucune migration de données, modification de `auth.users`, `GRANT`, `security definer` ni transformation d'archives. La policy **`COMMERCE public creates order requests`** est préservée, pour laisser fonctionner les demandes envoyées par les clients anonymes ou connectés. Le RPC `digiy_commerce_submit_cart_v1` reste inchangé.

Retour arrière versionné : `supabase/ROLLBACK_20261010_commerce_v6_owner_orders_phone_mfa.sql`. N'utiliser qu'en cas de régression réelle, avec contrôle de la confidentialité client.

## Tests d'acceptation

CI sur PostgreSQL 17 **isolé avec fixtures synthétiques** :
1. AAL1 du propriétaire : 0 commande et 0 ligne lue, 0 mise à jour / suppression.
2. AAL2 du vrai propriétaire de la fixture : exactement sa commande et ses lignes, mise à jour autorisée.
3. AAL2 d'un autre compte : aucune commande ni ligne visible.
4. Visiteur anonyme : envoi de demande possible ; authentifié sans AAL2 : envoi possible aussi.
5. Quatre policies restrictives appliquées et non réappliquées silencieusement.
6. UI : fermeture du panneau commandes sans téléphone, possibilité d'activation, aucun `innerHTML` sur les lignes client.

Le test PostgreSQL simule seulement la **sortie booléenne** du MFA serveur ; il ne simule pas la vérification d'un SMS réel. L'essai propriétaire authentifié **sur téléphone réel** reste à effectuer et conditionne le contrôle complet.

## Rollout

**Ne pas appliquer SQL tant que :** CI verte, nouvelle sauvegarde chiffrée prouvée, préflight droits existants compatible, propriétaire informé que l'accès aux commandes exigera désormais l'activation du téléphone. Un propriétaire pas encore enrôlé doit voir un écran explicite au lieu de croire que ses commandes ont disparu.

**Après migration :** vérifier les 4 policies en SQL, les permissions anon/auth, le comptage stable des commandes et lignes de panier, puis l'absence de fuite AAL1. La recette réelle propriétaire permet seule de valider le cycle MFA de bout en bout. Ne jamais créer une commande de test en production.
