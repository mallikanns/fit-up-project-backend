# Fit-Up

This full-stack exercise-tracking web application is designed for busy individuals seeking flexible fitness routines. It offers easy, equipment-free workouts and motivates users with monetary rewards and comprehensive data visualization tools.

## Screenshots

![App Screenshot](https://res.cloudinary.com/depnyvk3i/image/upload/v1698216133/img/qgrwg2a1jfeljwrn5zed.png)

## Demo

https://fit-up-project.vercel.app/

## Tech Stack

**Client:** React, TailwindCSS
**Server:** Node, Express, MongoDB

## Features

- Log in / Sign up / Sign out
- Create activity
- Read activity
- Update activity
- Delete activity
- Today Earn / Monthly Challenges
- Weekly Performance (Graph)

## Presentation slide

## Authors

- [@kongtuk2539](https://github.com/kongtuk2539)
- [@mallikanns](https://github.com/mallikanns)
- [@Jinbe2543](https://github.com/Jinbe2543)
- [@Tiiilis](https://github.com/Tiiilis)
- [@isansa](https://github.com/isansa)

## API Reference

### Activities API

#### Get all activities

```http
  GET /activities
```

#### Get activities by UserId

```http
  GET /activities/:id
```

| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `id`      | `string` | **Required**. Id of user to fetch |

#### Get Today activities by UserId

```http
  GET /activities/getToday/:id
```

| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `id`      | `string` | **Required**. Id of user to fetch |

#### Get Weekly activities by UserId

```http
  GET /activities/getWithDate/:id
```

| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `id`      | `string` | **Required**. Id of user to fetch |

#### Create new activity

```http
  POST /activities
```

#### Update activity

```http
  PUT /activities/:id
```

| Parameter | Type     | Description                           |
| :-------- | :------- | :------------------------------------ |
| `id`      | `string` | **Required**. Id of activity to fetch |

#### Delete activity

```http
  DELETE /activities/:id
```

| Parameter | Type     | Description                           |
| :-------- | :------- | :------------------------------------ |
| `id`      | `string` | **Required**. Id of activity to fetch |

#### Get weekly performance

```http
  GET /activities/weekly-activity/:userId
```

| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `id`      | `string` | **Required**. Id of user to fetch |

### Users API

#### Get all users

```http
  GET /users
```

#### Get User by Id

```http
  GET /users/:id
```

| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `id`      | `string` | **Required**. Id of user to fetch |

#### Create User

```http
  POST /users
```

#### Update User

```http
  PUT /users/:id
```

| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `id`      | `string` | **Required**. Id of user to fetch |

#### Log in

```http
  POST /users/login
```

#### Update User's coin

```http
  POST /users/update-coin/:id
```

| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `id`      | `string` | **Required**. Id of user to fetch |

#### Delete User's coin

```http
  POST /users/delete-coin/:id
```

| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `id`      | `string` | **Required**. Id of user to fetch |

## Appendix

Front-end URL: https://fit-up-project.vercel.app/
Front-end REPO: https://github.com/kongtuk2539/fit-up-project
Back-end URL: https://fit-up-project-backend.onrender.com
Back-end REPO: https://github.com/mallikanns/fit-up-project-backend
