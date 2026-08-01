package com.impotfacile.model.identity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "administrateurs")
@Data
@NoArgsConstructor
@EqualsAndHashCode(callSuper = true)
public class Administrateur extends Utilisateur {
}
