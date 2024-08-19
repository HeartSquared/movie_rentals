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
    if (this.movie.priceCode.name === PriceCode.REGULAR) {
      if (this.daysRented > 2) {
        return 2 + ((this.daysRented - 2) * 1.5);
      }
      return 2
    }

    if (this.movie.priceCode.name === PriceCode.NEW_RELEASE) {
      return this.daysRented * 3
    }

    if (this.movie.priceCode.name === PriceCode.CHILDRENS) {
      if (this.daysRented > 3) {
        return (this.daysRented - 3) * 1.5;
      }
      return 1.5;
    }

    throw new Error("invalid price code")
  }

  calculateFrequentRenterPoints() {
    // add bonus for a two-day new-release rental
    if ((this.movie.priceCode.name === PriceCode.NEW_RELEASE) && (this.daysRented > 1)) {
      return 2;
    }
    return 1;
  }
}

export class Statement {
  constructor(customerName, rentals) {
    this.totalAmount = 0
    this.frequentRenterPoints = 0

    this.name = customerName
    this.rentals = rentals
  }

  calculateRental() {
    return this.rentals.map(rental => {
      const rentalPrice = rental.calculatePrice()
      this.totalAmount += rentalPrice;

      // add frequent renter points
      this.frequentRenterPoints += rental.calculateFrequentRenterPoints()

      return {
        movieTitle: rental.movie.title,
        rentalPrice,
        totalAmount: this.totalAmount,
        frequentRenterPoints: this.frequentRenterPoints
      }
    })
  }

  getPrintHeader() {
    return "Rental record for " + this.name + "\n"
  }

  getPrintBody() {
    let body = ''
    this.calculateRental().forEach(({ movieTitle, rentalPrice }) => {
      body += "\t" + movieTitle + "\t" + rentalPrice + "\n";
    })
    return body
  }

  getPrintFooter() {
    return "Amount owed is " + this.totalAmount + "\n" +
      "You earned " + this.frequentRenterPoints + " frequent renter points.";
  }

  print() {
    return this.getPrintHeader() + this.getPrintBody() + this.getPrintFooter()
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
