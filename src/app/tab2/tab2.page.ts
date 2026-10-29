import { Component, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { AlertController } from '@ionic/angular';

import { environment } from '../../environments/environment';

import { initializeApp } from 'firebase/app';

import {
  getFirestore,
  collection,
  onSnapshot,
  updateDoc,
  doc,
  deleteDoc
} from 'firebase/firestore';

const app = initializeApp(environment.firebaseConfig);
const db = getFirestore(app);

const foodsCol = collection(db, 'foods');

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss'],
  standalone: false,
})
export class Tab2Page implements OnDestroy {

  foods: any[] = [];

  filteredFoods: any[] = [];

  searchText = '';

  selectedCategory = 'All';

  private unsubscribeFoods: (() => void) | null = null;

  constructor(
    private alertCtrl: AlertController,
    private cdr: ChangeDetectorRef
  ) {}

  ionViewWillEnter() {
    this.subscribeToFoods();
  }

  subscribeToFoods() {

    if (this.unsubscribeFoods) {
      this.unsubscribeFoods();
    }

    this.unsubscribeFoods = onSnapshot(
      foodsCol,

      (snapshot) => {

        this.foods = snapshot.docs.map(d => ({
          id: d.id,
          ...d.data()
        }));

        this.filterFoods();

        console.log('Foods loaded:', this.foods);

        this.cdr.detectChanges();
      },

      (error) => {

        console.error('Firestore read error:', error);

        window.alert(
          'Error loading foods. Check the browser console.'
        );
      }
    );
  }

  filterFoods() {

    const search = this.searchText.toLowerCase().trim();

    this.filteredFoods = this.foods.filter(food => {

      const matchesSearch =
        food.name?.toLowerCase().includes(search) ||
        food.description?.toLowerCase().includes(search);

      const matchesCategory =
        this.selectedCategory === 'All' ||
        food.category === this.selectedCategory;

      return matchesSearch && matchesCategory;
    });
  }

  onSearchChange(event: any) {

    this.searchText = event.detail.value || '';

    this.filterFoods();
  }

  onCategoryChange(event: any) {

    this.selectedCategory = event.detail.value;

    this.filterFoods();
  }

  async deleteFood(foodId: string) {

    try {

      await deleteDoc(doc(db, 'foods', foodId));

      window.alert('Food deleted successfully');

    } catch (error) {

      console.error('Delete error:', error);

      window.alert('Failed to delete food.');
    }
  }

  async updateFood(food: any) {

    const alertBox = await this.alertCtrl.create({

      header: 'Update Food',

      inputs: [

        {
          name: 'name',
          type: 'text',
          value: food.name,
          placeholder: 'Food Name'
        },

        {
          name: 'price',
          type: 'number',
          value: food.price,
          placeholder: 'Price'
        },

        {
          name: 'quantity',
          type: 'number',
          value: food.quantity,
          placeholder: 'Quantity'
        },

        {
          name: 'description',
          type: 'text',
          value: food.description,
          placeholder: 'Description'
        }

      ],

      buttons: [

        {
          text: 'Cancel',
          role: 'cancel'
        },

        {
          text: 'Update',

          handler: async (data) => {

            try {

              const foodRef = doc(db, 'foods', food.id);

              await updateDoc(foodRef, {

                name: data.name,

                price: Number(data.price),

                quantity: Number(data.quantity),

                description: data.description

              });

              window.alert(
                'Food updated successfully'
              );

            } catch (error) {

              console.error(
                'Update error:',
                error
              );

              window.alert(
                'Failed to update food.'
              );
            }
          }
        }

      ]
    });

    await alertBox.present();
  }

  ngOnDestroy() {

    if (this.unsubscribeFoods) {
      this.unsubscribeFoods();
    }
  }
}