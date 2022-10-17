import { Injectable } from '@angular/core';
import {
  Auth,
  GithubAuthProvider,
  GoogleAuthProvider,
  createUserWithEmailAndPassword,
  updateProfile,
  signInWithEmailAndPassword,
} from '@angular/fire/auth';
import { doc, Firestore, getDoc, setDoc } from '@angular/fire/firestore';
import { signInWithPopup, User } from '@firebase/auth';
import { collection, CollectionReference } from '@firebase/firestore';
import { Subject } from 'rxjs';
import { IUser } from '../models/user.model';
@Injectable({
  providedIn: 'root',
})
export class AuthService {
  githubProvider = new GithubAuthProvider();
  googleProvider = new GoogleAuthProvider();

  currentUser: IUser | null = null;
  currentUser$ = new Subject<IUser | null>();
  userCollectionRef: CollectionReference<IUser>;

  constructor(private auth: Auth, private store: Firestore) {
    this.auth.onAuthStateChanged((user) => {
      this.currentUser$.next(user as IUser);
      this.currentUser = user as IUser;
    });

    this.userCollectionRef = collection(
      this.store,
      'users'
    ) as CollectionReference<IUser>;
  }

  async createUser(user: User) {
    // create user document in firestore, different from firebase authentication user creation
    const userDoc = doc(this.userCollectionRef, user.uid);
    const snap = await getDoc(userDoc);
    if (!snap.exists()) {
      await setDoc(userDoc, {
        email: user.email,
        displayName: user.displayName === '' ? user.email : user.displayName,
        photoURL: user.photoURL,
      });
    }
  }

  async signIn(email: string, password: string) {
    await signInWithEmailAndPassword(this.auth, email, password);
  }

  async signInWithGithub() {
    await this.signInWithProvider(this.githubProvider);
  }

  async signInWithGoogle() {
    await this.signInWithProvider(this.googleProvider);
  }

  async signInWithProvider(provider: GithubAuthProvider | GoogleAuthProvider) {
    const { user } = await signInWithPopup(this.auth, provider);
    await this.createUser(user);
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

    await this.createUser(user);
  }

  async logout() {
    await this.auth.signOut();
  }
}
