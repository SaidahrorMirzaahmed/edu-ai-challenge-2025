export class Ship {
  constructor(length) {
    this.length = length;
    this.locations = [];
    this.hits = Array(length).fill('');
  }

  place(locations) {
    this.locations = locations;
  }

  hit(index) {
    if (index >= 0 && index < this.length) {
      this.hits[index] = 'hit';
    }
  }

  isSunk() {
    return this.hits.every(hit => hit === 'hit');
  }

  getHitLocations() {
    return this.locations.filter((_, index) => this.hits[index] === 'hit');
  }
} 