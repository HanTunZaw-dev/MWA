# Helping for funs

## Draft Idea 

On this community site, the volunteer and needy people can meet together.

 

If you are a volunteer, you can the list of things that other people need to help

 

If you need someone to help you, you can signup and ask for help. By providing information like: date time, description, estimate of how long, and any specific skills needed.

 

Both volunteers and the needy can rate together.

 

Later version we can add new features for reporting something weird about a helper

 

What can I ask for help? anything:
- gardening
- prepare a broken bike
- play with your child
- go and eat at a luxury restaurant with you
- ...

 

Privates,
- Guest users can see a list of tasks that she/he can help with without contact information, they may know the location (not specific address) and how far from their location. But you need to sign in if you WANT TO HELP :).

 

- People who need help must accept the volunteer before they can contact together.


## Design/Database

### Users
    - Sign up new user
    - Sign in

### Guest user
    - Can see all open tasks

### Logged user - acting like people who need help (requester)
    - Post new task
    - Modify/Update status of owner task
    - Accept a volunteer who want to help
    - Rating a helper (if time is possinble)

### logged user - acting like a volunteer (helper)
    - See list of open tasks near to thier location
    - Register as a volunteer for an open task
    - See all tasks (with status) that user registered
    - Cancel a registered task
    - Rating/Report about the requester (if time is possinble)

## Models
### User
```json
    {
        "_id": "string",
        "fullName": "string",
        "email": "string",
        "password": "sstring", //hashed string
        "location": {"type": ["number"]},
        "contact": {
            "phone": "string",
            "address": "string"
        },
        //"currentRating": "number", //think about this later
    }
```

### Desire
```json
    {
        "_id": "string",
        "status": "string", //open, inprogress, closed, cancelled, expired
        "title": "string",
        "category": "string",
        "description": "string",
        "requestTime": "number",
        "location": {"type": ["number"]},
        "address": "string",
        "contactInfo": "string", //show to accepted helper only.
        "estimateInHours": "number", //how long to finish the task
        "numberOfVolunteerNeeded": "number",
        "createdBy": "User",
        "createAt": "datetime",
        "volunteers": ["Volunteer"]
    }
```
### Volunteer
```json
    {
        "userId": "string",
        "userName": "string",
        //"rating": "number", //think about this later
        "status": "string" //pending, accepted, rejected, done
    }

```
## Screenshots
### Listing
![image](https://github.com/maharishi-university/final-project-thonguyen-dev/assets/59194586/5a43fe0b-a41f-4e96-b257-d86968d5c547)

### New request
![image](https://github.com/maharishi-university/final-project-thonguyen-dev/assets/59194586/976140a3-03c8-4258-9a91-ffe678dadaf3)

### View detail
![image](https://github.com/maharishi-university/final-project-thonguyen-dev/assets/59194586/36f619ce-7db1-4fb9-bc29-4d94043de5de)

### Authorization
#### Signup
![image](https://github.com/maharishi-university/final-project-thonguyen-dev/assets/59194586/6d25611b-1ee0-4528-9d80-2c831d4d8e0e)

#### Signin
![image](https://github.com/maharishi-university/final-project-thonguyen-dev/assets/59194586/c935ef56-cbc5-4b85-861b-aa8e9c5fd76e)





