export class AppConfig {
  public static modals = {
    USER_AUTH_MODAL: {
      id: 'user-auth-modal',
      title: 'Your account',
    },
    VIDEO_EDIT_MODAL: {
      id: 'video-edit-modal',
      title: 'Edit clip',
    },
    VIDEO_DELETE_MODAL: {
      id: 'video-delete-modal',
      title: 'Confirm deleting this clip',
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
