import { Injectable } from '@angular/core';
import {
  Auth,
  GithubAuthProvider,
  GoogleAuthProvider,
  createUserWithEmailAndPassword,
  updateProfile,
} from '@angular/fire/auth';
import { signInWithPopup, User } from '@firebase/auth';
@Injectable({
  providedIn: 'root',
})
export class AuthService {
  githubProvider = new GithubAuthProvider();
  googleProvider = new GoogleAuthProvider();

  currentUser: User | null = null;

  constructor(private auth: Auth) {
    this.auth.onAuthStateChanged((user) => {
      this.currentUser = user;
    });
  }

  loginWithGithub() {
    signInWithPopup(this.auth, this.githubProvider);
  }

  loginWithGoogle() {
    signInWithPopup(this.auth, this.googleProvider);
  }

  async register(email: string, password: string, username: string) {
    const result = await createUserWithEmailAndPassword(
      this.auth,
      email,
      password
    );
    const user = this.auth.currentUser!;
    if (username !== '') {
      await updateProfile(user, { displayName: username });
    }
    return user;
  }

  async logout() {
    await this.auth.signOut();
  }
}
