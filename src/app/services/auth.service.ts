import { Injectable } from '@angular/core';
import {
  Auth,
  GithubAuthProvider,
  GoogleAuthProvider,
  createUserWithEmailAndPassword,
  updateProfile,
  signInWithEmailAndPassword,
} from '@angular/fire/auth';
import { Firestore } from '@angular/fire/firestore';
import { signInWithPopup, User } from '@firebase/auth';
import {
  addDoc,
  collection,
  CollectionReference,
  DocumentData,
} from '@firebase/firestore';
import { IUser } from '../models/user.model';
@Injectable({
  providedIn: 'root',
})
export class AuthService {
  githubProvider = new GithubAuthProvider();
  googleProvider = new GoogleAuthProvider();

  currentUser: User | null = null;
  userCollectionRef: CollectionReference<IUser>;

  constructor(private auth: Auth, private store: Firestore) {
    this.auth.onAuthStateChanged((user) => {
      this.currentUser = user;
    });

    this.userCollectionRef = collection(
      this.store,
      'users'
    ) as CollectionReference<IUser>;
  }

  async login(password: string, email: string) {
    await signInWithEmailAndPassword(this.auth, email, password);
  }

  loginWithGithub() {
    signInWithPopup(this.auth, this.githubProvider);
  }

  loginWithGoogle() {
    signInWithPopup(this.auth, this.googleProvider);
  }

  async register(email: string, password: string, username: string) {
    const { user } = await createUserWithEmailAndPassword(
      this.auth,
      email,
      password
    );
    if (username !== '') {
      await updateProfile(user, { displayName: username });
    }
    await addDoc<IUser>(this.userCollectionRef, {
      uid: user.uid,
      email: user.email!,
      displayName: user.displayName === '' ? user.email! : user.displayName!,
    });
    return user;
  }

  async logout() {
    await this.auth.signOut();
  }
}
