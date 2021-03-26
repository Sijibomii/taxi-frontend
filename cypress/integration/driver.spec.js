const faker = require('faker');
const { webSocket } = require('rxjs/webSocket');
// const randomEmailDriver = faker.internet.email();  
// const randomEmailRider = faker.internet.email();  

// describe('The driver dashboard', function () {
//   it('Cannot be visited if the user is not a driver', function () {
//     cy.intercept('POST', 'sign_up').as('signUp');
//     cy.intercept('POST', 'log_in').as('logIn');

//     cy.visit('/#/sign-up');
//     cy.get('input#username').type(randomEmailRider);  
//     cy.get('input#firstName').type('Gary');
//     cy.get('input#lastName').type('Cole');
//     cy.get('input#password').type('pAssw0rd', { log: false });
//     cy.get('select#group').select('rider');

//     // Handle file upload
//     cy.get('input#photo').attachFile('images/photo.jpg');

//     cy.get('button').contains('Sign up').click();
//     cy.wait('@signUp');
//     cy.hash().should('eq', '#/log-in');

//     // Log in.
//     cy.visit('/#/log-in')
//     cy.get('input#username').type(randomEmailRider);  
//     cy.get('input#password').type('pAssw0rd', { log: false });
//     cy.get('button').contains('Log in').click();
//     cy.hash().should('eq', '#/');
//     cy.get('button').contains('Log out');
//     cy.wait('@logIn');

//     cy.visit('/#/driver');
//     cy.hash().should('eq', '#/');
//   });

  
//   it('Can be visited if the user is a driver', function () {
//     cy.intercept('POST', 'sign_up').as('signUp');
//     cy.intercept('POST', 'log_in').as('logIn');

//     cy.visit('/#/sign-up');
//     cy.get('input#username').type(randomEmailDriver);
//     cy.get('input#firstName').type('Gary');
//     cy.get('input#lastName').type('Cole');
//     cy.get('input#password').type('pAssw0rd', { log: false });
//     cy.get('select#group').select('driver');

//     // Handle file upload
//     cy.get('input#photo').attachFile('images/photo.jpg');

//     cy.get('button').contains('Sign up').click();
//     cy.wait('@signUp');
//     cy.hash().should('eq', '#/log-in');

//     // Log in.
//     cy.visit('/#/log-in');
//     cy.get('input#username').type(randomEmailDriver);
//     cy.get('input#password').type('pAssw0rd', { log: false });
//     cy.get('button').contains('Log in').click();
//     cy.hash().should('eq', '#/');
//     cy.get('button').contains('Log out');
//     cy.wait('@logIn');

//     cy.visit('/#/driver');
//     cy.hash().should('eq', '#/driver');
//   });
// });


///////////////// NEW TEST TO REMOVE DUPLICATE CODE FOR ADDING USER/////////////////////

const driverEmail = faker.internet.email();
const driverFirstName = faker.name.firstName();
const driverLastName = faker.name.lastName();
const riderEmail = faker.internet.email();
const riderFirstName = faker.name.firstName();
const riderLastName = faker.name.lastName();
const tripResponse = [
  {
    id: "94fc5eba-de7a-44b2-8000-856ec824609d",
    created: "2020-08-18T21:41:08.112946Z",
    updated: "2020-08-18T21:41:08.112986Z",
    pick_up_address: "A",
    drop_off_address: "B",
    status: "STARTED",
    driver: {
      id: 113,
      photo: "http://localhost:8003/media/photos/photo_QI0TTYh.jpg",
    },
    rider: {
      id: 112,
      photo: "http://localhost:8003/media/photos/photo_r3XrvgH.jpg",
    }
  },
  {
    id: "94fc5eba-de7a-44b2-8000-856ec824609d",
    created: "2020-08-18T21:41:08.112946Z",
    updated: "2020-08-18T21:41:08.112986Z",
    pick_up_address: "A",
    drop_off_address: "B",
    status: "REQUESTED",
    driver: {
      id: 113,
      photo: "http://localhost:8003/media/photos/photo_QI0TTYh.jpg",
    },
    rider: {
      id: 112,
      photo: "http://localhost:8003/media/photos/photo_r3XrvgH.jpg",
    }
  },
  {
    id: "94fc5eba-de7a-44b2-8000-856ec824609d",
    created: "2020-08-18T21:41:08.112946Z",
    updated: "2020-08-18T21:41:08.112986Z",
    pick_up_address: "A",
    drop_off_address: "B",
    status: "COMPLETED",
    driver: {
      id: 113,
      photo: "http://localhost:8003/media/photos/photo_QI0TTYh.jpg",
    },
    rider: {
      id: 112,
      photo: "http://localhost:8003/media/photos/photo_r3XrvgH.jpg",
    }
  }
];

describe('The driver dashboard', function () {
  // new
  before(function() {
    cy.addUser(riderEmail, riderFirstName, riderLastName, 'rider');
    cy.addUser(driverEmail, driverFirstName, driverLastName, 'driver');
  })

  it('Cannot be visited if the user is not a driver', function () {
    cy.intercept('POST', 'log_in').as('logIn');

    cy.logIn(riderEmail);  // new

    cy.visit('/#/driver');
    cy.hash().should('eq', '#/');
  });

  it('Can be visited if the user is a driver', function () {
    cy.intercept('POST', 'log_in').as('logIn');

    cy.logIn(driverEmail); // new

    cy.visit('/#/driver');
    cy.hash().should('eq', '#/driver');
  });
  it('Displays messages for no trips', function () {
    cy.intercept('trip', {
      statusCode: 200,
      body: []
    }).as('getTrips');
  
    cy.logIn(riderEmail);
  
    cy.visit('/#/rider');
    cy.wait('@getTrips');
  
    // Current trips.
    cy.get('[data-cy=trip-card]')
      .eq(0)
      .contains('No trips.');
  
    // Completed trips.
    cy.get('[data-cy=trip-card]')
      .eq(1)
      .contains('No trips.');
  });
  it('Displays current, requested, and completed trips', function () {
    cy.intercept('trip', {
      statusCode: 200,
      body: tripResponse
    }).as('getTrips');
  
    cy.logIn(driverEmail);
  
    cy.visit('/#/driver');
    cy.wait('@getTrips');
  
    // Current trips.
    cy.get('[data-cy=trip-card]')
      .eq(0)
      .contains('STARTED');
  
    // Requested trips.
    cy.get('[data-cy=trip-card]')
      .eq(1)
      .contains('REQUESTED');
  
    // Completed trips.
    cy.get('[data-cy=trip-card]')
      .eq(2)
      .contains('COMPLETED');
  });
  it('Shows details about a trip', () => {
    cy.intercept('trip', {
      statusCode: 200,
      body: tripResponse[0]
    }).as('getTrips');
  
    cy.logIn(driverEmail);
  
    cy.visit(`/#/driver/${tripResponse[0].id}`);
  
    cy.get('[data-cy=trip-card]')
      .should('have.length', 1)
      .and('contain.text', 'STARTED');
  });
  it('Can receive a ride request', function () {
    cy.intercept('trip', {
      statusCode: 200,
      body: []
    }).as('getTrips');
  
    cy.logIn(driverEmail);
  
    cy.visit('/#/driver');
    cy.wait('@getTrips');
  
    // Requested trips.
    cy.get('[data-cy=trip-card]')
      .eq(1)
      .contains('No trips.');
  
    // Make trip request as rider.
    cy.request({
      method: 'POST',
      url: 'http://localhost:8003/api/log_in/',
      body: {
        "username": riderEmail,
        "password": "pAssw0rd"
      }
    }).then((response) => {
      const token = response.body.access;
      const ws = webSocket(`ws://localhost:8003/taxi/?token=${token}`);
      ws.subscribe();
      ws.next({
        type: 'create.trip',
        data: {
          pick_up_address: '123 Main Street',
          drop_off_address: '456 Elm Street',
          rider: 2
        }
      });
    });
  
    // Requested trips.
    cy.get('[data-cy=trip-card]')
      .eq(1)
      .contains('REQUESTED');
  });
});