# MON COMMERCE — accès propriétaire email sans SMS

## Décision métier du 10 octobre 2026

Le propriétaire a demandé d'utiliser **magic link / code email** plutôt que l'enrôlement d'un téléphone SMS payant. Conserver la souveraineté du professionnel, le contact direct et 0 % commission.

### Ce qui existe déjà en production

- Auth Supabase `signInWithOtp` pour l'email, envoi **magic link** selon le modèle email actuel, `shouldCreateUser:false`.
- Session réelle obtenue et vérifiée par `sb.auth.getUser()`; consultation de la fiche uniquement lorsque `digiy_commerce_sites.auth_user_id=auth.uid()` et le site est actif.
- Les lectures des commandes et articles sont protégées par des policies RLS **de propriétaire**, pas par le nom du commerce ou des coordonnées métier. `anon` ne dispose pas du privilège SELECT sur les commandes.
- Le compte propriétaire lié à `astou-boutique` dispose actuellement de `require_phone_mfa=false`; l'autorisation phone MFA `digiy_owner_mfa_gate()` existante autorise le compte lorsque ce drapeau reste faux.
- **La migration V6 AAL2 restrictive du dossier `supabase/20261010_commerce_v6_owner_orders_phone_mfa.sql` est ANNULÉE / NE PAS DÉPLOYER** : aucun de ses quatre verrous n'était actif en production lors de la décision. Cette migration était un candidat testé isolément, pas une obligation métier validée. Elle reste dans le dépôt seulement comme trace historique.
- Une commande réelle et ses deux lignes panier sont conservées. Ne jamais envoyer de commandes, d'avis ou de données fictives en production.

### Correctif email

- Le gestionnaire `gestion-produits-v3.html` déclenche le garde propriétaire existant avec `offerEnrollment:false`. **Quand le serveur indique que le SMS n'est pas obligatoire**, il ne propose plus une inscription téléphone désactivée, mais conserve toute contrainte phone MFA exigée pour un autre compte.
- Après contrôle d'email/session + correspondance du `auth_user_id` en SQL, affiche les produits et les commandes réelles ; n'exige pas un AAL2 fictif obtenu via email. Si plusieurs commerces appartiennent à un même compte, l'utilisateur doit choisir via la fiche de commerce.
- `acces-proprietaire-v4.html` garde le **magic link existant** et ajoute la validation facultative d'un **OTP email à six chiffres** par `supabase.auth.verifyOtp({email,token,type:'email'})`.
- IMPORTANT : `signInWithOtp({email})` envoie **par défaut un magic link**, pas nécessairement un code numérique. Pour faire parvenir le code à six chiffres il faut configurer le modèle *Magic Link* de **Supabase Auth → Email Templates** pour inclure `{{ .Token }}`. Cette configuration peut concerner **tous les modules utilisant le même projet Auth** ; ne la changer ni la simuler dans le code du navigateur sans en analyser l'impact sur BUILD, JOB, LOC, RESTO, etc. Le magic link reste la voie immédiatement utilisable.
- **Un OTP email ou un magic link ne vaut pas authentification multifactorielle AAL2**. Les commandes demeurent protégées par l'authentification et le lien propriétaire RLS. Le téléphone provisoire en registre privé ne devient pas un facteur SMS sans enrôlement et vérification.

### Recette

1. Ouvrir `https://mon-commerce.digiylyfe.com/acces-proprietaire-v4.html?site=astou-boutique&lang=fr` et demander le lien à l'email associé.
2. Cliquer le lien reçu. Si le modèle Auth contient aussi `{{ .Token }}`, saisir le code dans le champ facultatif.
3. Contrôler que le gestionnaire retrouve la commande et les deux lignes panier, que les actions propriétaire fonctionnent, qu'aucun code SMS n'est requis, et que l'URL d'une autre boutique ne permet aucune lecture.
4. La validation terrain réelle reste à faire par le propriétaire ; les tests GitHub mockés ne sont pas une preuve d'accès navigateur réel.
5. Tester ensuite les espaces BUILD et JOB séparément (leurs politiques phone MFA peuvent différer). Ne pas désactiver globalement le MFA du projet Supabase.

Historique : PR #21 COMMERCE V6 préparait le verrou SMS AAL2, **non installé** ; la décision présente remplace ce chantier côté MON COMMERCE sans DDL.
