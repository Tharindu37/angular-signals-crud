import { Injectable, computed, effect, inject, signal } from '@angular/core';
import { Contact } from '../model/contact.model';
import { Router } from '@angular/router';
import { LoaderService } from './loader.service';
import {
  CollectionReference,
  Firestore,
  addDoc,
  collection,
  collectionData,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
} from '@angular/fire/firestore';
import { toSignal } from '@angular/core/rxjs-interop';

@Injectable({
  providedIn: 'root',
})
export class ContactsService {
  firestore = inject(Firestore);
  contactsCollection = collection(
    this.firestore,
    'contacts'
  ) as CollectionReference<Contact>;

  // constructor() {
  //   this.fetchContact();
  // }

  private contacts$ = collectionData(this.contactsCollection, {
    idField: 'id',
  });
  // contacts = signal<Contact[]>([]);
  contacts = toSignal(this.contacts$, { initialValue: [] });

  readonly MAX_CONTACTS_ALLOWED = 21;

  totalContacts = computed(() => this.contacts().length);

  maxReached = computed(
    () => this.totalContacts() >= this.MAX_CONTACTS_ALLOWED
  );

  router = inject(Router);
  loader = inject(LoaderService);

  // async fetchContact() {
  //   const data = await getDocs(this.contactsCollection);
  //   this.contacts.set([...data.docs.map((d) => ({ ...d.data(), id: d.id }))]);
  // }

  async addContact(newContact: Partial<Contact>) {
    this.loader.showLoader();

    await addDoc(this.contactsCollection, { ...newContact });
    // this.fetchContact();
    this.loader.hideLoader();
    this.router.navigate(['/']);
  }

  async deleteContact(id: string) {
    this.loader.showLoader();
    const ref = doc(this.firestore, 'contacts', id);
    await deleteDoc(ref);
    // await this.fetchContact();
    this.loader.hideLoader();
  }
}
