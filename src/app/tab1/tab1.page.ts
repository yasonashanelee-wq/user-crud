import { Component } from '@angular/core';

import { environment } from '../../environments/environment';

import { initializeApp } from 'firebase/app';

import {
  getFirestore,
  collection,
  addDoc
} from 'firebase/firestore';

const app = initializeApp(environment.firebaseConfig);
const db = getFirestore(app);

const foodsCol = collection(db, 'foods');

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss'],
  standalone: false,
})
export class Tab1Page {

  newFood = {
    name: '',
    category: '',
    price: 0,
    quantity: 0,
    description: ''
  };

  async addFood() {

    if (
      !this.newFood.name ||
      !this.newFood.category ||
      this.newFood.price <= 0 ||
      this.newFood.quantity < 0 ||
      !this.newFood.description
    ) {
      window.alert('Please fill in all fields correctly.');
      return;
    }

    try {

      await addDoc(foodsCol, this.newFood);

      window.alert('Food added successfully');

      this.newFood = {
        name: '',
        category: '',
        price: 0,
        quantity: 0,
        description: ''
      };

    } catch (error) {

      console.error('Error adding food:', error);

      window.alert('Failed to add food.');
    }
  }
}