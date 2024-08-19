class PriceCode {
  constructor(name) {
    this.name = name
  }
}

class Movie {
  constructor(title, priceCode) {
    this.title = title
    this.priceCode = priceCode
  }
}

class Rental {
  constructor(movie, daysRented) {
    this.movie = movie
    this.daysRented = daysRented
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
    let totalAmount = 0
    let frequentRenterPoints = 0
    let result = "Rental record for " + this.name + "\n"
    // determine amounts for each line
    for (let i=0; i<this.rentals.length; i++) {
      let each = this.rentals[i]
      let thisAmount = 0
      if (each.movie.priceCode.name === 'REGULAR') {
        thisAmount += 2
        if (each.daysRented > 2) {
          thisAmount += ((each.daysRented - 2) * 1.5);          
        }
      }
      else if (each.movie.priceCode.name === 'NEW RELEASE') {
        thisAmount += each.daysRented * 3
      }
      else if (each.movie.priceCode.name === 'CHILDRENS') {
        thisAmount += 1.5;
        if (each.daysRented > 3) {
          thisAmount = (each.daysRented - 3) * 1.5;
        }
      }
      // add frequent renter points
      frequentRenterPoints++;
      // add bonus for a two-day new-release rental
      if ((each.movie.priceCode.name === 'NEW RELEASE') && (each.daysRented > 1)) {
        frequentRenterPoints ++;
      }
      // show figures for this rental
      result += "\t" + each.movie.title + "\t" + thisAmount + "\n";
      totalAmount += thisAmount;
    }
    // add footer lines
    result += "Amount owed is " + totalAmount + "\n";
    result += "You earned " + frequentRenterPoints + " frequent renter points.";
    return result;
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

Store.PRICE_CODE_REGULAR = new PriceCode('REGULAR')
Store.PRICE_CODE_CHILDRENS = new PriceCode('CHILDRENS')
Store.PRICE_CODE_NEW_RELEASE = new PriceCode('NEW RELEASE')
