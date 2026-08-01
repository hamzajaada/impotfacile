-- Schema MySQL identique a celui genere par Hibernate (backend Spring Boot)
-- Les tables sont creees seulement si absentes : un backend Spring et un backend
-- Node peuvent donc utiliser la MEME base sans conflit.

CREATE TABLE IF NOT EXISTS utilisateurs (
  id varchar(36) NOT NULL,
  email varchar(255) NOT NULL,
  mot_de_passe_hash varchar(255) NOT NULL,
  role varchar(255) NOT NULL,
  prenom varchar(255) DEFAULT NULL,
  nom varchar(255) DEFAULT NULL,
  date_creation datetime(6) NOT NULL,
  PRIMARY KEY (id),
  UNIQUE KEY uk_utilisateurs_email (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS administrateurs (
  id varchar(36) NOT NULL,
  PRIMARY KEY (id),
  CONSTRAINT fk_administrateurs_utilisateur FOREIGN KEY (id) REFERENCES utilisateurs (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS clients (
  telephone varchar(255) DEFAULT NULL,
  profil_fiscal varchar(255) DEFAULT NULL,
  id varchar(36) NOT NULL,
  PRIMARY KEY (id),
  CONSTRAINT fk_clients_utilisateur FOREIGN KEY (id) REFERENCES utilisateurs (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS formulaires_templates (
  id varchar(36) NOT NULL,
  nom varchar(255) NOT NULL,
  annee_fiscale int NOT NULL,
  version int NOT NULL,
  actif tinyint(1) NOT NULL,
  PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS sections_formulaire (
  id varchar(36) NOT NULL,
  titre varchar(255) NOT NULL,
  ordre int NOT NULL,
  repetable tinyint(1) NOT NULL,
  template_id varchar(36) NOT NULL,
  PRIMARY KEY (id),
  KEY idx_sections_template (template_id),
  CONSTRAINT fk_sections_template FOREIGN KEY (template_id) REFERENCES formulaires_templates (id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS sections_formulaire_profils (
  section_id varchar(36) NOT NULL,
  profil varchar(255) NOT NULL,
  PRIMARY KEY (section_id, profil),
  CONSTRAINT fk_sfp_section FOREIGN KEY (section_id) REFERENCES sections_formulaire (id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS champs_formulaire (
  id varchar(36) NOT NULL,
  label varchar(255) NOT NULL,
  type varchar(255) NOT NULL,
  obligatoire tinyint(1) NOT NULL,
  ordre int NOT NULL,
  nom_champ varchar(255) DEFAULT NULL,
  options varchar(2000) DEFAULT NULL,
  section_id varchar(36) NOT NULL,
  PRIMARY KEY (id),
  KEY idx_champs_section (section_id),
  CONSTRAINT fk_champs_section FOREIGN KEY (section_id) REFERENCES sections_formulaire (id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS champs_formulaire_profils (
  champ_id varchar(36) NOT NULL,
  profil varchar(255) NOT NULL,
  PRIMARY KEY (champ_id, profil),
  CONSTRAINT fk_cfp_champ FOREIGN KEY (champ_id) REFERENCES champs_formulaire (id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS regles_conditionnelles (
  id varchar(36) NOT NULL,
  champ_cible varchar(255) NOT NULL,
  type_regle varchar(255) NOT NULL,
  valeur_attendue varchar(255) NOT NULL,
  champ_id varchar(36) NOT NULL,
  PRIMARY KEY (id),
  KEY idx_regles_champ (champ_id),
  CONSTRAINT fk_regles_champ FOREIGN KEY (champ_id) REFERENCES champs_formulaire (id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS declarations (
  id varchar(36) NOT NULL,
  annee_fiscale int NOT NULL,
  statut varchar(255) NOT NULL,
  date_soumission datetime(6) NOT NULL,
  avec_conjoint tinyint(1) NOT NULL,
  client_id varchar(36) NOT NULL,
  template_id varchar(36) DEFAULT NULL,
  donnees_formulaire longtext,
  PRIMARY KEY (id),
  KEY idx_declarations_client (client_id),
  KEY idx_declarations_template (template_id),
  CONSTRAINT fk_declarations_client FOREIGN KEY (client_id) REFERENCES utilisateurs (id),
  CONSTRAINT fk_declarations_template FOREIGN KEY (template_id) REFERENCES formulaires_templates (id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS reponses_champs (
  id varchar(36) NOT NULL,
  valeur varchar(5000) DEFAULT NULL,
  declaration_id varchar(36) NOT NULL,
  champ_id varchar(36) NOT NULL,
  PRIMARY KEY (id),
  KEY idx_reponses_declaration (declaration_id),
  KEY idx_reponses_champ (champ_id),
  CONSTRAINT fk_reponses_declaration FOREIGN KEY (declaration_id) REFERENCES declarations (id) ON DELETE CASCADE,
  CONSTRAINT fk_reponses_champ FOREIGN KEY (champ_id) REFERENCES champs_formulaire (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS personnes_a_charge (
  id varchar(36) NOT NULL,
  nom varchar(255) NOT NULL,
  lien_parente varchar(255) DEFAULT NULL,
  date_naissance date DEFAULT NULL,
  revenu double DEFAULT NULL,
  declaration_id varchar(36) NOT NULL,
  PRIMARY KEY (id),
  KEY idx_pac_declaration (declaration_id),
  CONSTRAINT fk_pac_declaration FOREIGN KEY (declaration_id) REFERENCES declarations (id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS documents (
  id varchar(36) NOT NULL,
  type varchar(255) NOT NULL,
  nom_fichier varchar(255) NOT NULL,
  chemin_fichier varchar(255) NOT NULL,
  content_type varchar(255) DEFAULT NULL,
  taille bigint DEFAULT NULL,
  date_upload datetime(6) NOT NULL,
  verifie tinyint(1) NOT NULL,
  declaration_id varchar(36) NOT NULL,
  PRIMARY KEY (id),
  KEY idx_documents_declaration (declaration_id),
  CONSTRAINT fk_documents_declaration FOREIGN KEY (declaration_id) REFERENCES declarations (id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
