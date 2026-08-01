package com.impotfacile.model.identity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "clients")
@Data
@NoArgsConstructor
@EqualsAndHashCode(callSuper = true)
public class Client extends Utilisateur {
    private String telephone;
    private String profilFiscal;
}
