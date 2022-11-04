import { Injectable } from '@angular/core';
import {
  Auth,
  createUserWithEmailAndPassword,
  fetchSignInMethodsForEmail,
  GithubAuthProvider,
  GoogleAuthProvider,
  signInWithEmailAndPassword,
  signInWithPopup,
  updateProfile,
} from '@angular/fire/auth';
import {
  collection,
  CollectionReference,
  doc,
  Firestore,
  getDoc,
  setDoc,
} from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { IUser } from '../models/user.model';
import { AvatarService } from './avatar.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  githubProvider = new GithubAuthProvider();
  googleProvider = new GoogleAuthProvider();

  currentUser: IUser | null = null;
  currentUser$ = new Subject<IUser | null>();
  userCollectionRef: CollectionReference<Omit<IUser, 'uid'>>;

  constructor(
    private auth: Auth,
    private store: Firestore,
    private avatarService: AvatarService,
    private router: Router
  ) {
    this.auth.onAuthStateChanged((user) => {
      this.currentUser$.next(user as IUser);
      this.currentUser = user as IUser;
    });

    this.userCollectionRef = collection(
      this.store,
      'users'
    ) as CollectionReference<IUser>;
  }

  // create user document in firestore
  async createUser(user: IUser) {
    const userDoc = doc(this.userCollectionRef, user.uid);
    const snap = await getDoc(userDoc);
    if (!snap.exists()) {
      await setDoc(userDoc, {
        email: user.email,
        displayName: user.displayName,
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
    const displayName = user.displayName || user.email!;
    const photoURL =
      user.photoURL || this.avatarService.getAvatarUrl(displayName);
    await this.createUser({
      email: user.email!,
      displayName,
      photoURL: photoURL,
      uid: user.uid,
    });
  }

  async register(email: string, password: string, displayName: string) {
    const { user } = await createUserWithEmailAndPassword(
      this.auth,
      email,
      password
    );
    const photoURL = this.avatarService.getAvatarUrl(displayName);
    await updateProfile(user, {
      displayName,
      photoURL,
    });

    await this.createUser({
      uid: user.uid,
      email: user.email || '',
      displayName,
      photoURL: photoURL,
    });
  }

  async fetchSignInMethodForEmail(email: string) {
    return await fetchSignInMethodsForEmail(this.auth, email);
  }

  async logout() {
    await this.auth.signOut();
    this.router.navigateByUrl('/');
  }
}
