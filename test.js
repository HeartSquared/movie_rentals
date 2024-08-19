import { Store } from './engine.js'

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

describe("store", function() {

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

  describe("statement", function() {
  
    it("should be 3", function(){
      // At this point, the structure of the program begins getting in the
      // way of testing. Rentals are imbedded in the Customer object, but
      // there is no property to access them. They can only be accessed 
      // internally, by the Statement() method, which imbeds them in the
      // text string passed as it's return value. So, to get these amounts,
      // we will have to parse that value
      let statementTokens = []
      let lines = customer.statement().split("\n")
      for (let i=0; i<lines.length; i++) {
        let lineTokens = lines[i].split("\t")
        for (let j=0; j<lineTokens.length; j++) {
          statementTokens.push(lineTokens[j])
        }
      }
      // The statementTokens[] array will have the following elements:
      //    [0] = junk
      //    [1] = junk
      //    [2] = title #1
      //    [3] = price #1
      //    [4] = junk
      //    [5] = title #2
      //    [6] = price #2
      //    [7] = junk
      //    [8] = title #3
      //    [9] = price #3
      //    [10] = "Amount owed is x"
      //    [11] = "You earned x frequent renter points."
      // We will test the title and price elements, and the total 
      // and frequent renter points items. If these tests pass, then 
      // we know that AddRentals() is adding rentals to a Customer 
      // object properly, and that the Statement() method is
      // generating a statement in the expected format.
      statementTokens[2].should.equal('Cinderella')
      statementTokens[3].should.equal('3')
      statementTokens[5].should.equal('Star Wars')
      statementTokens[6].should.equal('6.5')
      statementTokens[8].should.equal('Gladiator')
      statementTokens[9].should.equal('15')
    })

  })

}) 

