export class AppConfig {
  public static modalIds = {
    USER_AUTH_MODAL: 'user-auth-modal',
  };
  public static validator = {
    password: {
      minLength: 6,
    },
    username: {
      minLength: 3,
    },
  };
}
