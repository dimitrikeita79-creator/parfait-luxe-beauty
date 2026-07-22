export class ApiException extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ApiException';
  }

  static fromError(error: unknown): ApiException {
    if (error instanceof ApiException) return error;

    const errorMessage =
      error instanceof Error ? error.message : String(error);
    const errorLower = errorMessage.toLowerCase();

    if (errorLower.includes('invalid login credentials')) {
      return new ApiException('Email ou mot de passe incorrect');
    }
    if (errorLower.includes('user already registered')) {
      return new ApiException('Un compte existe déjà avec cet email');
    }
    if (errorLower.includes('password must be at least')) {
      return new ApiException('Le mot de passe doit contenir au moins 6 caractères');
    }
    if (errorLower.includes('rate limit')) {
      return new ApiException('Trop de tentatives. Réessayez plus tard.');
    }
    if (errorLower.includes('fetch') || errorLower.includes('network')) {
      return new ApiException('Erreur réseau. Vérifiez votre connexion internet.');
    }

    const errorJson = JSON.stringify(error, Object.getOwnPropertyNames(error));
    return new ApiException('ERREUR REELLE : ' + errorJson);
  }
}
