import { Store } from './engine.js'

let store = new Store()

let cinderella = store.addMovie('Cinderella', Store.PRICE_CODE_CHILDRENS)
let star_wars  = store.addMovie('Star Wars', Store.PRICE_CODE_REGULAR)
let gladiator  = store.addMovie('Gladiator', Store.PRICE_CODE_NEW_RELEASE)

let john_smith = store.addCustomer('John Smith')

john_smith.addRental(cinderella, 5)
john_smith.addRental(star_wars, 5)
john_smith.addRental(gladiator, 5)

console.log(john_smith.statement())

// You should see:

// Rental record for John Smith
//   Cinderella  3
//   Star Wars 6.5
//   Gladiator 15
// Amount owed is 24.5
// You earned 4 frequent renter points.

