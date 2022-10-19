export class AppConfig {
  public static modalIds = {
    USER_AUTH_MODAL: {
      id: 'user-auth-modal',
      title: 'Your account',
    },
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
