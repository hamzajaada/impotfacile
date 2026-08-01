package com.impotfacile.security;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import javax.crypto.Cipher;
import javax.crypto.spec.GCMParameterSpec;
import javax.crypto.spec.SecretKeySpec;
import java.nio.charset.StandardCharsets;
import java.security.SecureRandom;
import java.util.Arrays;
import java.util.Base64;

@Component
public class EncryptionService {

    private static final String PREFIX = "enc:";
    private static final int IV_LENGTH = 12;
    private static final int GCM_TAG_BITS = 128;
    private static final String ALGORITHM = "AES/GCM/NoPadding";

    private final SecretKeySpec key;
    private final SecureRandom secureRandom = new SecureRandom();

    public EncryptionService(@Value("${app.encryption.key}") String keyB64) {
        byte[] decoded;
        try {
            decoded = Base64.getDecoder().decode(keyB64);
        } catch (IllegalArgumentException e) {
            throw new IllegalStateException("La cle de chiffrement doit etre en base64. Configurez APP_ENCRYPTION_KEY.");
        }
        if (decoded.length != 32) {
            throw new IllegalStateException("La cle de chiffrement doit faire 32 octets (AES-256). Configurez APP_ENCRYPTION_KEY.");
        }
        this.key = new SecretKeySpec(decoded, "AES");
    }

    public String encrypt(String plaintext) {
        if (plaintext == null || plaintext.isEmpty()) return plaintext;
        try {
            byte[] iv = new byte[IV_LENGTH];
            secureRandom.nextBytes(iv);
            Cipher cipher = Cipher.getInstance(ALGORITHM);
            cipher.init(Cipher.ENCRYPT_MODE, key, new GCMParameterSpec(GCM_TAG_BITS, iv));
            byte[] encrypted = cipher.doFinal(plaintext.getBytes(StandardCharsets.UTF_8));
            byte[] combined = new byte[iv.length + encrypted.length];
            System.arraycopy(iv, 0, combined, 0, iv.length);
            System.arraycopy(encrypted, 0, combined, iv.length, encrypted.length);
            return PREFIX + Base64.getEncoder().encodeToString(combined);
        } catch (Exception e) {
            throw new IllegalStateException("Erreur de chiffrement", e);
        }
    }

    public String decrypt(String ciphertext) {
        if (ciphertext == null || ciphertext.isEmpty()) return ciphertext;
        if (!ciphertext.startsWith(PREFIX)) return ciphertext;
        try {
            byte[] combined = Base64.getDecoder().decode(ciphertext.substring(PREFIX.length()));
            byte[] iv = Arrays.copyOfRange(combined, 0, IV_LENGTH);
            byte[] data = Arrays.copyOfRange(combined, IV_LENGTH, combined.length);
            Cipher cipher = Cipher.getInstance(ALGORITHM);
            cipher.init(Cipher.DECRYPT_MODE, key, new GCMParameterSpec(GCM_TAG_BITS, iv));
            return new String(cipher.doFinal(data), StandardCharsets.UTF_8);
        } catch (Exception e) {
            throw new IllegalStateException("Erreur de dechiffrement", e);
        }
    }
}
