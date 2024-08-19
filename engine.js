export class PriceCode {
  constructor(name) {
    this.name = name
  }
}
PriceCode.REGULAR = 'REGULAR'
PriceCode.CHILDRENS = 'CHILDRENS'
PriceCode.NEW_RELEASE = 'NEW RELEASE'

export class Movie {
  constructor(title, priceCode) {
    this.title = title
    this.priceCode = priceCode
  }
}

export class Rental {
  constructor(movie, daysRented) {
    this.movie = movie
    this.daysRented = daysRented
  }

  calculatePrice() {
    let thisAmount = 0
    if (this.movie.priceCode.name === PriceCode.REGULAR) {
      thisAmount += 2
      if (this.daysRented > 2) {
        thisAmount += ((this.daysRented - 2) * 1.5);
      }
    }
    else if (this.movie.priceCode.name === PriceCode.NEW_RELEASE) {
      thisAmount += this.daysRented * 3
    }
    else if (this.movie.priceCode.name === PriceCode.CHILDRENS) {
      thisAmount += 1.5;
      if (this.daysRented > 3) {
        thisAmount = (this.daysRented - 3) * 1.5;
      }
    }
    return thisAmount
  }
}

class Statement {
  constructor(customerName, rentals) {
    this.totalAmount = 0
    this.frequentRenterPoints = 0

    this.name = customerName
    this.rentals = rentals
  }

  print() {
    let result = "Rental record for " + this.name + "\n"
    for (let i=0; i<this.rentals.length; i++) {
      const rental = this.rentals[i]
      const rentalPrice = rental.calculatePrice()

      // add frequent renter points
      this.frequentRenterPoints++;
      // add bonus for a two-day new-release rental
      if ((rental.movie.priceCode.name === PriceCode.NEW_RELEASE) && (rental.daysRented > 1)) {
        this.frequentRenterPoints ++;
      }
      // show figures for this rental
      result += "\t" + rental.movie.title + "\t" + rentalPrice + "\n";
      this.totalAmount += rentalPrice;
    }
    // add footer lines
    result += "Amount owed is " + this.totalAmount + "\n";
    result += "You earned " + this.frequentRenterPoints + " frequent renter points.";
    return result;
  }
}

class Customer {
  constructor(name) {
    this.name = name
    this.rentals = []
  }
  addRental(movie, daysRented) {
    let rental = new Rental(movie, daysRented);
    this.rentals.push(rental)
    return rental;
  }
  statement() {
    return (new Statement(this.name, this.rentals)).print()
  }
}

export class Store {
  constructor() {
    this.movies = []
    this.customers = []
  }
  addMovie(name, priceCode) {
    let movie = new Movie(name, priceCode)
    this.movies.push(movie);
    return movie;
  }
  addCustomer(name) {
    let customer = new Customer(name)
    this.customers.push(customer)
    return customer
  }
}

Store.PRICE_CODE_REGULAR = new PriceCode(PriceCode.REGULAR)
Store.PRICE_CODE_CHILDRENS = new PriceCode(PriceCode.CHILDRENS)
Store.PRICE_CODE_NEW_RELEASE = new PriceCode(PriceCode.NEW_RELEASE)
