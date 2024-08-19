import { Store, Movie, Rental, PriceCode, Statement } from './engine.js'

let chai = require('chai')
chai.should()

let store = new Store()

let cinderella = store.addMovie('Cinderella', Store.PRICE_CODE_CHILDRENS)
let star_wars  = store.addMovie('Star Wars', Store.PRICE_CODE_REGULAR)
let gladiator  = store.addMovie('Gladiator', Store.PRICE_CODE_NEW_RELEASE)

let john_smith = store.addCustomer('John Smith')

john_smith.addRental(cinderella, 5)
john_smith.addRental(star_wars, 5)
john_smith.addRental(gladiator, 5)

describe("Store", function() {

  describe("movies", function() {

    it("should be 3", function(){
      store.movies.length.should.equal(3)
    })
    it("should have the correct titles", function(){
      store.movies[0].title.should.equal('Cinderella')
      store.movies[1].title.should.equal('Star Wars')
      store.movies[2].title.should.equal('Gladiator')
    })
    it("should have the correct price codes", function(){
      store.movies[0].priceCode.name.should.equal('CHILDRENS')
      store.movies[1].priceCode.name.should.equal('REGULAR')
      store.movies[2].priceCode.name.should.equal('NEW RELEASE')
    })

  })

  describe("customers", function() {

    it("should be 1", function(){
      store.customers.length.should.equal(1)
    })
    it("should have the correct name", function(){
      store.customers[0].name.should.equal('John Smith')
    })

  })

  let customer = store.customers[0]

  describe("rentals", function() {

    it("should be 3", function(){
      customer.rentals.length.should.equal(3)
    })
    it("should be for the correct movies", function(){
      customer.rentals[0].movie.title.should.equal('Cinderella')
      customer.rentals[1].movie.title.should.equal('Star Wars')
      customer.rentals[2].movie.title.should.equal('Gladiator')
    })
    it("should be for the correct number of days rented", function(){
      customer.rentals[0].daysRented.should.equal(5)
      customer.rentals[1].daysRented.should.equal(5)
      customer.rentals[2].daysRented.should.equal(5)
    })

  })
})

describe("Statement", () => {
  describe("calculateRental()", () => {
    it("contains the expected data", () => {
      const cinderella = new Movie('Cinderella', Store.PRICE_CODE_CHILDRENS)
      const star_wars  = new Movie('Star Wars', Store.PRICE_CODE_REGULAR)
      const gladiator  = new Movie('Gladiator', Store.PRICE_CODE_NEW_RELEASE)

      const rentals = [
        new Rental(cinderella, 5),
        new Rental(star_wars, 5),
        new Rental(gladiator, 5),
      ]

      const statement = new Statement("John Smith", rentals)
      const rentalCost = statement.calculateRental()

      rentalCost.should.deep.equal([
        {
          movieTitle: 'Cinderella',
          rentalPrice: 3,
          totalAmount: 3,
          frequentRenterPoints: 1,
        },
        {
          movieTitle: 'Star Wars',
          rentalPrice: 6.5,
          totalAmount: 9.5,
          frequentRenterPoints: 2,
        },
        {
          movieTitle: 'Gladiator',
          rentalPrice: 15,
          totalAmount: 24.5,
          frequentRenterPoints: 4,
        },
      ])
    })
  })

  describe("print()", () => {
    it("prints the statement in expected format", () => {
      const customer = store.customers[0]

      const expected =
`Rental record for John Smith
\tCinderella\t3
\tStar Wars\t6.5
\tGladiator\t15
Amount owed is 24.5
You earned 4 frequent renter points.`

      customer.printStatement().should.equal(expected)
    })
  })
})

describe("Rental", () => {
  describe("calculatePrice()", () => {
    describe("price for a Regular movie", () => {
      it("correctly calculates for less than or equal to 2 days", () => {
        const movie = new Movie("Hamilton", new PriceCode(PriceCode.REGULAR))
        const rental1 = new Rental(movie, 1)
        rental1.calculatePrice().should.equal(2)
        const rental2 = new Rental(movie, 2)
        rental2.calculatePrice().should.equal(2)
      })

      it("correctly calculates for above 2 days", () => {
        const movie = new Movie("Hamilton", new PriceCode(PriceCode.REGULAR))
        const rental = new Rental(movie, 3)
        rental.calculatePrice().should.equal(3.5)
      })
    })

    describe("price for a New Release movie", () => {
      it("correctly calculates the price", () => {
        const movie = new Movie("Hamilton", new PriceCode(PriceCode.NEW_RELEASE))
        const rental = new Rental(movie, 3)
        rental.calculatePrice().should.equal(9)
      })
    })

    describe("price for a Childrens movie", () => {
      it("correctly calculates for less than or equal to 3 days", () => {
        const movie = new Movie("Hamilton", new PriceCode(PriceCode.CHILDRENS))
        const rental1 = new Rental(movie, 1)
        rental1.calculatePrice().should.equal(1.5)
        const rental2 = new Rental(movie, 3)
        rental2.calculatePrice().should.equal(1.5)
      })

      it("correctly calculates for above 3 days", () => {
        const movie = new Movie("Hamilton", new PriceCode(PriceCode.CHILDRENS))
        const rental1 = new Rental(movie, 4)
        rental1.calculatePrice().should.equal(1.5)
        const rental2 = new Rental(movie, 5)
        rental2.calculatePrice().should.equal(3)
      })
    })
  })

  describe("calculateFrequentRenterPoints()", () => {
    it("returns 2 for two-day New Release rentals", () => {
      const movie = new Movie("Hamilton", new PriceCode(PriceCode.NEW_RELEASE))
      const rental = new Rental(movie, 3)
      rental.calculateFrequentRenterPoints().should.equal(2)
    })

    it("returns 1 for all others", () => {
      const movie = new Movie("Hamilton", new PriceCode(PriceCode.REGULAR))
      const rental = new Rental(movie, 3)
      rental.calculateFrequentRenterPoints().should.equal(1)
    })
  })
})
