# Business Card Server

This is a server for managing business cards of different users.
Written in Node.js

## Install

1. Download the project
2. Do

```
npm i
```

To install all required libraries

3. Create a new file named ".env" for environment variables configuration (see ".env.example" for required parameters). Other configuration variables can be found in "config->default.json".

4. Do

```
npm run dev
```

For development 5. Do

```
npm run start
```

For production

5. Do

```
npm run seed-db
```

For seeding the DB

## Seeding the DB

The seeding operation empties the Cards and Users collections and inserts 3 Users (regular, admin, business) and 3 Cards (associated with the business User).

## Usage

### Models

#### User Model

```
{
  name: {
    first: {
      type: String,
      required: true,
      minlength: 2,
      maxlength: 255,
    },
    middle: {
      type: String,
      minlength: 0,
      maxlength: 255,
      default: "",
    },
    last: {
      type: String,
      required: true,
      minlength: 2,
      maxlength: 255,
    },

    _id: {
      type: mongoose.Types.ObjectId,
      default: new mongoose.Types.ObjectId(),
    },
  },
  phone: {
    type: String,
    required: true,
    minlength: 9,
    maxlength: 10,
  },
  email: {
    type: String,
    required: true,
    minlength: 6,
    maxlength: 255,
    unique: true,
  },
  password: {
    type: String,
    required: true,
    minlength: 6,
    maxlength: 1024,
  },
  image: {
    url: {
      type: String,
      default:
        "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png",
      minlength: 11,
      maxlength: 1024,
    },
    alt: {
      type: String,
      minlength: 6,
      maxlength: 255,
      default: "User Image",
    },
    _id: {
      type: mongoose.Types.ObjectId,
      default: new mongoose.Types.ObjectId(),
    },
  },
  address: {
    state: {
      type: String,
      minlength: 0,
      maxlength: 255,
      default: "",
    },
    country: {
      type: String,
      minlength: 3,
      maxlength: 255,
      required: true,
    },
    city: {
      type: String,
      minlength: 6,
      maxlength: 255,
      required: true,
    },
    street: {
      type: String,
      minlength: 3,
      maxlength: 255,
      required: true,
    },
    houseNumber: {
      type: String,
      minlength: 1,
      maxlength: 10,
      required: true,
    },
    zip: {
      type: String,
      minlength: 0,
      maxlength: 12,
      default: "",
    },

    _id: {
      type: mongoose.Types.ObjectId,
      default: new mongoose.Types.ObjectId(),
    },
  },
  isBusiness: {
    type: Boolean,
    required: true,
  },
  isAdmin: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
}
```

#### Card Model

```
{
  title: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 255,
  },
  subtitle: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 255,
  },
  description: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 1024,
  },
  phone: {
    type: String,
    required: true,
    minlength: 9,
    maxlength: 10,
  },
  email: {
    type: String,
    required: true,
    minlength: 6,
    maxlength: 255,
  },
  web: {
    type: String,
    required: true,
    minlength: 11,
    maxlength: 1024,
  },
  image: {
    url: {
      type: String,
      default:
        "https://cdn.pixabay.com/photo/2018/03/10/12/00/teamwork-3213924_1280.jpg",
      minlength: 11,
      maxlength: 1024,
    },
    alt: {
      type: String,
      minlength: 6,
      maxlength: 255,
      default: "Business Image",
    },
    _id: {
      type: mongoose.Types.ObjectId,
      default: new mongoose.Types.ObjectId(),
    },
  },
  address: {
    state: {
      type: String,
      minlength: 0,
      maxlength: 255,
      default: "",
    },
    country: {
      type: String,
      minlength: 3,
      maxlength: 255,
      required: true,
    },
    city: {
      type: String,
      minlength: 6,
      maxlength: 255,
      required: true,
    },
    street: {
      type: String,
      minlength: 3,
      maxlength: 255,
      required: true,
    },
    houseNumber: {
      type: String,
      minlength: 1,
      maxlength: 10,
      required: true,
    },
    zip: {
      type: String,
      minlength: 0,
      maxlength: 12,
      default: "",
    },

    _id: {
      type: mongoose.Types.ObjectId,
      default: new mongoose.Types.ObjectId(),
    },
  },
  bizNumber: {
    type: String,
    required: true,
    minlength: 3,
    maxlength: 999_999_999,
    unique: true,
  },
  likes: [
    {
      user_id: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      createdAt: {
        type: Date,
        default: Date.now,
      },
    },
  ],
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
}
```

### Routes

#### User Routes

| No. | URL          | method | Authorization                | action                   | notice       | return          |
| --- | ------------ | ------ | ---------------------------- | ------------------------ | ------------ | --------------- |
| 1.  | /users       | POST   | all                          | register user            | Unique email | User            |
| 2.  | /users/login | POST   | all                          | login                    |              | Encrypted token |
| 3.  | /users       | GET    | admin                        | Get all                  |              | Array of users  |
| 4.  | /users/:id   | GET    | The registered user or admin | Get user                 |              | User            |
| 5.  | /users/:id   | PUT    | The registered user          | Edit user                |              | User            |
| 6.  | /users/:id   | PATCH  | The registered user          | Change isBusiness status |              | User            |
| 7.  | /users/:id   | DELETE | The registered user or admin | Delete User              |              | Deleted User    |

- Minimum input ( Register user, Edit user):

```
{
    "name":{
        "first":"Yoni ",
        "last":"Yeonatan"
    },
    "phone":"0526094755",
    "email":"yoni@yoni.net",
    "password":"123456",
    "isBusiness":true,
    "address":{
        "state":"",
        "country":"Israel",
        "city":"Netanya",
        "street":"Greenboim",
        "houseNumber":"30A"
    }
}

```

#### Card Routes

| No. | URL                  | method | Authorization                           | action           | return         |
| --- | -------------------- | ------ | --------------------------------------- | ---------------- | -------------- |
| 1.  | /cards               | GET    | all                                     | All cards        | card           |
| 2.  | /cards/my-cards      | GET    | The registered user                     | Get User Cards   | Array of cards |
| 3.  | /cards/:id           | GET    | all                                     | Get card         | card           |
| 4.  | /cards               | POST   | business users                          | create new card  | card           |
| 5.  | /cards/:id           | PUT    | The users who created the card          | Edit card        | card           |
| 6.  | /cards/:id           | PATCH  | A registered user                       | Like card        | card           |
| 7.  | /cards/:id           | DELETE | The users who created the card or admin | Delete card      | Deleted card   |
| 8.  | /cards/changeBiz/:id | PATCH  | admin                                   | change bizNumber | card           |

- Minimum input ( Create new card, Edit card):

```
{
    "title":"My Card Title",
    "subtitle":"My Card subTitle",
    "description":"My Card description",
    "phone":"0526094760",
    "email":"d@d7.ben",
    "web":"myCards.web",
    "address":{
        "state":"",
        "country":"Israel",
        "city":"Netanya",
        "street":"Gronboim",
        "houseNumber":"30A"
    }
}
```

## Technologies & Libraries

1. "nodemon": for development purposes
1. "bcrypt": password encryption
1. "chalk": coloring console messages
1. "config": configuration
1. "cors": cors policy
1. "dotenv": environment variables
1. "express": requests routing
1. "joi": validation
1. "jsonwebtoken": managing web tokens
1. "lodash": various helper functions
1. "mongoose": managing mongoDB
1. "morgan": logging response messages

## enjoy 😄
